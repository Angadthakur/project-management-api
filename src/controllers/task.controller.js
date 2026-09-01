const {
    createTask,
    getProjectTasks,
    getTaskById,
    updateTask,
    deleteTask,
    assignTask,
} = require("../services/task.service");

const asyncHandler = require("../utils/asyncHandler");

const create = asyncHandler(async (req, res) => {
    const task = await createTask(
        req.params.projectId,
        req.user.userId,
        req.body
    );

    res.status(201).json({
        success: true,
        task,
    });
});

const getAllForProject = asyncHandler(async (req, res) => {
    const result = await getProjectTasks(
        req.params.projectId,
        req.user.userId,
        req.query
    );

    res.status(200).json({
        success: true,
        ...result,
    });
});

const getOne = asyncHandler(async (req, res) => {
    const task = await getTaskById(
        req.params.id,
        req.user.userId
    );

    res.status(200).json({
        success: true,
        task,
    });
});

const update = asyncHandler(async (req, res) => {
    const task = await updateTask(
        req.params.id,
        req.user.userId,
        req.body
    );

    res.status(200).json({
        success: true,
        task,
    });
});

const remove = asyncHandler(async (req, res) => {
    await deleteTask(
        req.params.id,
        req.user.userId
    );

    res.status(200).json({
        success: true,
        message: "Task deleted successfully",
    });
});

const assign = asyncHandler(async (req, res) => {
    const task = await assignTask(
        req.params.id,
        req.user.userId,
        req.body.userId
    );

    res.status(200).json({
        success: true,
        task,
    });
});

module.exports = {
    create,
    getAllForProject,
    getOne,
    update,
    remove,
    assign
};