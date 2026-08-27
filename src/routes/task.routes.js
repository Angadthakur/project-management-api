const express = require("express");

const taskController = require("../controllers/task.controller");

const protect = require("../middlewares/auth.middleware");
const { updateTaskSchema, assignTaskSchema, createTaskSchema } = require("../validators/task.validator");

const router = express.Router();

router.use(protect);

router.get("/:id", taskController.getOne);

router.patch("/:id" ,validate(updateTaskSchema), taskController.update )

router.delete("/:id", taskController.remove);

router.patch("/:id/assign", validate(assignTaskSchema), taskController.assign);

module.exports = router;