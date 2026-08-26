const {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject,
    addMember,
    getMembers,
    removeMember,
} = require("../services/project.service");

const asyncHandler = require("../utils/asyncHandler");

const create = asyncHandler(async (req, res) => {
    const project = await createProject(
        req.body,
        req.user.userId
    );

    res.status(201).json({
        success: true,
        project,
    });
});

const getAll = asyncHandler(async (req, res) => {
    const projects = await getProjects(
        req.user.userId
    );

    res.status(200).json({
        success: true,
        projects,
    });
});

const getOne = asyncHandler(async (req,res) => {
    const project = await getProjectById(
        req.params.id,
        req.user.userId
    );
    res.status(200).json({
        success: true,
        project,
    });
})

const update = asyncHandler(async (req,res) => {
    const project = await updateProject(
        req.params.id,
        req.user.userId,
        req.body
    );

    res.status(200).json({
        success: true,
        project,
    });
})

const remove = asyncHandler(async (req, res) => {
    await deleteProject(
        req.params.id,
        req.user.userId
    );

    res.status(200).json({
        success: true,
        message: "Project deleted successfully",
    });
});

const addProjectMember = asyncHandler(
    async (req, res) => {
        const project = await addMember(
            req.params.id,
            req.user.userId,
            req.body.email,
            req.body.role
        );

        res.status(200).json({
            success: true,
            project,
        });
    }
);

const getProjectMembers = asyncHandler(
    async (req, res) => {
        const members = await getMembers(
            req.params.id,
            req.user.userId
        );

        res.status(200).json({
            success: true,
            members,
        });
    }
);

const removeProjectMember = asyncHandler(
    async (req, res) => {
        const project = await removeMember(
            req.params.id, //project id
            req.user.userId, //requester id -> jwt 
            req.params.userId //target member id
        );

        res.status(200).json({
            success: true,
            project,
        });
    }
);



module.exports = {
    create,
    getAll,
    getOne,
    update,
    remove,
    addProjectMember,
    getProjectMembers,
    removeProjectMember,
};