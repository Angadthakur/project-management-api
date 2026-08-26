const mongoose = require("mongoose");

const projectMemberSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        role: {
            type: String,
            enum: ["manager", "member"],
            default: "member",
        },
    },
    {
        _id: false,
    }
);

const projectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
            default: "",
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        member : {
            type : [projectMemberSchema],
            default:[]
        },

        status: {
            type: String,
            enum: ["active", "completed", "archived"],
            default: "active",
        },
    },
    {
        timestamps: true,
    }
);

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;