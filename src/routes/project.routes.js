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

const protect = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");

const {
    createProjectSchema,
    updateProjectSchema,
    addMemberSchema,
} = require("../validators/project.validator");

const router = express.Router();

//every project route requires authentication
router.use(protect);

router.post("/", validate(createProjectSchema), create);

router.get("/", getAll);

router.get("/:id",getOne);

router.patch("/:id" , validate(updateProjectSchema), update);

router.delete("/:id", remove);

router.post("/:id/members" , validate(addMemberSchema), addProjectMember);

router.get("/:id/members", getProjectMembers);

router.delete("/:id/members/:userId", removeProjectMember)

module.exports = router;