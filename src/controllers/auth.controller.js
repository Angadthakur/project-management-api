const { registerUser , loginUser} = require("../services/auth.service");
const asyncHandler = require("../utils/asyncHandler");

const register = asyncHandler (async(req,res) => {
    
        const result = await registerUser(req.body);

        res.status(201).json({
            success:true,
            ...result,
        });
});

const login = asyncHandler (async (req,res) => {
    
        const result = await loginUser(req.body);

        res.status(200).json({
            success :true,
            ...result,
        });
});

const getMe = asyncHandler(async (req,res) =>{
    res.status(200).json({
        success: true,
        user: req.user,
    });
});

module.exports = {register, login, getMe};