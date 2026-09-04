const express = require("express");

const {
    register , 
    login , 
    getMe
} = require("../controllers/auth.controller");

const protect = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const { registerSchema, loginSchema } = require("../validators/auth.validator");
const authorize = require("../middlewares/role.middleware");
const rateLimiter = require("../middlewares/rateLimiter");


const router = express.Router();

router.post("/register", rateLimiter, validate(registerSchema),register);

router.post("/login",validate(loginSchema),login);

router.get("/me", protect,getMe);

module.exports = router;