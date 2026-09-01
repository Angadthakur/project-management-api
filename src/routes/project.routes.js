const express = require("express");

const {
    create,
    getAll,
    getOne,
    update,
    remove,
    addProjectMember,
    getProjectMembers,
    removeProjectMember,
} = require("../controllers/project.controller");

const taskController = require("../controllers/task.controller");

const protect = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");

const {
    createProjectSchema,
    updateProjectSchema,
    addMemberSchema,
} = require("../validators/project.validator");
const { createTaskSchema } = require("../validators/task.validator");

const router = express.Router();

//every project route requires authentication
router.use(protect);

router.post("/", validate(createProjectSchema), create);

router.get("/", getAll);

router.get("/:id",getOne);

router.patch("/:id" , validate(updateProjectSchema), update);

router.delete("/:id", remove);

//members
router.post("/:id/members" , validate(addMemberSchema), addProjectMember);

router.get("/:id/members", getProjectMembers);

router.delete("/:id/members/:userId", removeProjectMember)

//task
router.post("/:projectId/tasks", validate(createTaskSchema), taskController.create);

router.get("/:projectId/tasks", taskController.getAllForProject)

module.exports = router;