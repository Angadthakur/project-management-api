const { registerUser , loginUser} = require("../services/auth.service")

const register = async (req,res) => {
    try{
        const result = await registerUser(req.body);

        res.status(201).json({
            success:true,
            ...result,
        });
    }catch(error){
       res.status(400).json({
        success:false,
        message :error.message,
       });
    }
};

const login = async (req,res) => {
    try{
        const result = await loginUser(req.body);

        res.status(200).json({
            success :true,
            ...result,
        });
    }catch(error){
        res.status(401).json({
            success : false,
            message :error.message,
        });
    }
};

const getMe = async (req,res) =>{
    res.status(200).json({
        success: true,
        user: req.user,
    });
}

module.exports = {register, login, getMe};