const Task = require("../models/Task");
const Project = require("../models/Project");
const User = require("../models/User");
const AppError = require("../utils/AppError");

const createTask = async (
    projectId,
    requesterId,
    taskData
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

    const membership =
        project.members.find(
            (member) =>
                member.user.toString() === requesterId
        );

    const isMember = !!membership;

    if (!isOwner && !isMember) {
        throw new AppError(
            "You do not have access to this project",
            403
        );
    }

    if (taskData.assignedTo) {
        const assignedUser = await User.findById(
            taskData.assignedTo
        );

        if (!assignedUser) {
            throw new AppError(
                "Assigned user not found",
                404
            );
        }

        const isAssignedUserMember =
            project.members.some(
                (member) =>
                    member.user.toString() ===
                    taskData.assignedTo
            );

        const isAssignedUserOwner =
            project.owner.toString() ===
            taskData.assignedTo;

        if (
            !isAssignedUserMember &&
            !isAssignedUserOwner
        ) {
            throw new AppError(
                "Assigned user is not part of this project",
                400
            );
        }
    }

    const task = await Task.create({
        ...taskData,
        project: projectId,
        createdBy: requesterId,
    });

    return task;
};

const getProjectTasks = async (
    projectId,
    requesterId,
    filters = {}
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

    const isMember =
        project.members.some(
            (member) =>
                member.user.toString() === requesterId
        );

    if (!isOwner && !isMember) {
        throw new AppError(
            "You do not have access to this project",
            403
        );
    }
    
    //pagination
    const page = Math.max(
        parseInt(filters.page) || 1,
        1
    );

    const limit = Math.min(
        parseInt(filters.limit) || 10,
        100
    )

    const skip = (page-1) * limit;



    const query = { project: projectId };

    //filtering 
    if (filters.status) {
        query.status = filters.status;
    }

    if (filters.priority) {
        query.priority = filters.priority;
    }

    if (filters.assignedTo) {
        query.assignedTo = filters.assignedTo;
    }

    //searching
    if(filters.search){
        query.$or = [
            {
                title :{
                    $regex : filters.search,
                    $options : "i"
                }
            },
            {
                description : {
                    $regex: filters.search,
                $options: "i",
                }
            }
        ]
    }

    //sorting 
    let sort = {
        createdAt:-1,
    }

    if (filters.sort) {
    const sortField = filters.sort.startsWith("-")
        ? filters.sort.substring(1)
        : filters.sort;

    const sortOrder = filters.sort.startsWith("-")
        ? -1
        : 1;

    const allowedSortFields = [
        "createdAt",
        "dueDate",
        "priority",
        "title",
    ];

    if (!allowedSortFields.includes(sortField)) {
        throw new AppError(
            `Invalid sort field: ${sortField}`,
            400
        );
    }

    sort = {
        [sortField]: sortOrder,
    };
}

    const totalTasks = await Task.countDocuments(query)

    const totalPages = Math.ceil(
        totalTasks/ limit
    )


    const tasks = await Task.find(query)
        .populate("createdBy", "name email")
        .populate("assignedTo", "name email")
        .sort(sort)
        .skip(skip)
        .limit(limit)

    return {
        tasks,
        pagination: {
            page,
            limit,
            totalTasks,
            totalPages,
            hasNextPage : page < totalPages,
            hasPreviousPage : page> 1,
        }
    };
};

const getTaskById = async (
    taskId,
    requesterId
) => {
    const task = await Task.findById(taskId)
        .populate("createdBy", "name email")
        .populate("assignedTo", "name email")
        .populate("project", "name owner members");

    if (!task) {
        throw new AppError(
            "Task not found",
            404
        );
    }

    const project = task.project;

    const isOwner =
        project.owner.toString() === requesterId;

    const isMember =
        project.members.some(
            (member) =>
                member.user.toString() === requesterId
        );

    if (!isOwner && !isMember) {
        throw new AppError(
            "You do not have access to this task",
            403
        );
    }

    return task;
};

const updateTask = async (
    taskId,
    requesterId,
    updates
) => {
    const task = await Task.findById(taskId);

    if (!task) {
        throw new AppError(
            "Task not found",
            404
        );
    }

    const project = await Project.findById(
        task.project
    );

    if (!project) {
        throw new AppError(
            "Project not found",
            404
        );
    }

    const isOwner =
        project.owner.toString() === requesterId;

    const membership =
        project.members.find(
            (member) =>
                member.user.toString() === requesterId
        );

    const isManager =
        membership?.role === "manager";

    const isAssignedUser =
        task.assignedTo?.toString() === requesterId;

    if (
        !isOwner &&
        !isManager &&
        !isAssignedUser
    ) {
        throw new AppError(
            "You do not have permission to update this task",
            403
        );
    }

    Object.assign(task, updates);//copies the properties from updates into the task

    await task.save();

    return task;
};

const deleteTask = async (
    taskId,
    requesterId
) => {
    const task = await Task.findById(taskId);

    if (!task) {
        throw new AppError(
            "Task not found",
            404
        );
    }

    const project = await Project.findById(
        task.project
    );

    if (!project) {
        throw new AppError(
            "Project not found",
            404
        );
    }

    const isOwner =
        project.owner.toString() === requesterId;

    const membership =
        project.members.find(
            (member) =>
                member.user.toString() === requesterId
        );

    const isManager =
        membership?.role === "manager";

    if (!isOwner && !isManager) {
        throw new AppError(
            "You do not have permission to delete this task",
            403
        );
    }

    await task.deleteOne();

    return task;
};

const assignTask = async (
    taskId,
    requesterId,
    targetUserId
) => {
    const task = await Task.findById(taskId);

    if (!task) {
        throw new AppError(
            "Task not found",
            404
        );
    }

    const project = await Project.findById(
        task.project
    );

    if (!project) {
        throw new AppError(
            "Project not found",
            404
        );
    }

    const isOwner =
        project.owner.toString() === requesterId;

    const membership =
        project.members.find(
            (member) =>
                member.user.toString() === requesterId
        );

    const isManager =
        membership?.role === "manager";

    if (!isOwner && !isManager) {
        throw new AppError(
            "You do not have permission to assign tasks",
            403
        );
    }

    if (targetUserId === null) {
        task.assignedTo = null;

        await task.save();

        return task;
    }

    const targetUser =
        await User.findById(targetUserId);

    if (!targetUser) {
        throw new AppError(
            "User not found",
            404
        );
    }

    const isTargetMember =
        project.members.some(
            (member) =>
                member.user.toString() === targetUserId
        );

    const isTargetOwner =
        project.owner.toString() === targetUserId;

    if (!isTargetMember && !isTargetOwner) {
        throw new AppError(
            "User is not part of this project",
            400
        );
    }

    task.assignedTo = targetUserId;

    await task.save();

    return task;
};

module.exports = {
    createTask,
    getProjectTasks,
    getTaskById,
    updateTask,
    deleteTask,
    assignTask,
};