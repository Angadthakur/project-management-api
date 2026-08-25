const User = require("../models/User");

const { hashPassword, comparePassword} = require("../utils/password");

const { generateToken } = require("../utils/jwt");
const AppError = require("../utils/AppError");


const registerUser = async ({name ,email, password}) => {
    const existingUser = await User.findOne({email});

    if(existingUser){
        throw new AppError("User already exists",409);
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
        name,
        email,
        password : hashedPassword,
    });

    const token = generateToken(user);

    return {
        user:{
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        token,
    };
};

const loginUser = async ({email , password}) => {
    const user = await User.findOne({email});

    if(!user){
        throw new AppError("Invalid email or password",401);
    }

    const passwordMatch = await comparePassword(password , user.password);

    if(!passwordMatch){
        throw new AppError("Invalid email or password",401);
    }

    const token = generateToken(user);

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        token,
    };
};

module.exports = {registerUser , loginUser};