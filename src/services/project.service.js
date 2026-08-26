const Project = require("../models/Project");
const AppError = require("../utils/AppError");
const User = require("../models/User");
const { get } = require("mongoose");

const createProject = async ({ name, description }, userId) => {
    const project = await Project.create({
        name,
        description,
        owner: userId,
    });

    return project;
};

const getProjects = async (userId) => {
    const projects = await Project.find({
        owner: userId,
    }).sort({
        createdAt: -1,
    });

    return projects;
};

const getProjectById = async(projectId , userId) => {
    const project = await Project.findById(projectId);

    if (!project) {
        throw new AppError("Project not found", 404);
    }
    
    if (project.owner.toString() !== userId) {
        throw new AppError(
            "You do not have access to this project",
            403
        );
    }

    return project;

}

const updateProject = async (
    projectId,
    userId,
    updates
) => {
    const project = await Project.findById(projectId);

    if (!project) {
        throw new AppError("Project not found", 404);
    }

    if (project.owner.toString() !== userId) {
        throw new AppError(
            "You do not have access to this project",
            403
        );
    }

    Object.assign(project, updates);

    await project.save();

    return project;
};

const deleteProject = async (
    projectId,
    userId
) => {
    const project = await Project.findById(projectId);

    if (!project) {
        throw new AppError(
            "Project not found",
            404
        );
    }

    if (project.owner.toString() !== userId) {
        throw new AppError(
            "You do not have permission to delete this project",
            403
        );
    }

    await project.deleteOne();
};

const addMember = async (
    projectId,
    requesterId,
    email,
    role
) => {
    const project = await Project.findById(projectId);

    if (!project) {
        throw new AppError(
            "Project not found",
            404
        );
    }

    const isOwner =
        project.owner.toString() === requesterId;

    const requesterMembership =
        project.members.find(
            (member) =>
                member.user.toString() === requesterId
        );

    const isManager =
        requesterMembership?.role === "manager";

    if (!isOwner && !isManager) {
        throw new AppError(
            "You do not have permission to add members",
            403
        );
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new AppError(
            "User not found",
            404
        );
    }

    if (project.owner.toString() === user._id.toString()) {
        throw new AppError(
            "Project owner is already part of the project",
            400
        );
    }

    const alreadyMember = project.members.some(
        (member) =>
            member.user.toString() === user._id.toString()
    );

    if (alreadyMember) {
        throw new AppError(
            "User is already a project member",
            409
        );
    }

    project.members.push({
        user: user._id,
        role,
    });

    await project.save();

    return project;
};

const getMembers = async (
    projectId,
    requesterId
) => {
    const project = await Project
        .findById(projectId)
        .populate(
            "members.user",
            "name email role"
        );

    if (!project) {
        throw new AppError(
            "Project not found",
            404
        );
    }

    const isOwner =
        project.owner.toString() === requesterId;

    const isMember =
        project.members.some(
            (member) =>
                member.user._id.toString() === requesterId
        );

    if (!isOwner && !isMember) {
        throw new AppError(
            "You do not have access to this project",
            403
        );
    }

    return project.members;
};

const removeMember = async (
    projectId,
    requesterId,
    targetUserId
) => {
    const project = await Project.findById(projectId);

    if (!project) {
        throw new AppError(
            "Project not found",
            404
        );
    }

    const isOwner =
        project.owner.toString() === requesterId;

    const requesterMembership =
        project.members.find(
            (member) =>
                member.user.toString() === requesterId
        );

    const isManager =
        requesterMembership?.role === "manager";

    if (!isOwner && !isManager) {
        throw new AppError(
            "You do not have permission to remove members",
            403
        );
    }

    const memberIndex = project.members.findIndex(
        (member) =>
            member.user.toString() === targetUserId
    );

    if (memberIndex === -1) {
        throw new AppError(
            "User is not a project member",
            404
        );
    }

    project.members.splice(memberIndex, 1);

    await project.save();

    return project;
};

module.exports = {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject,
    addMember,
    getMembers,
    removeMember,
};