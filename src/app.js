const express = require("express");

const authRoutes = require("./routes/auth.routes");

const errorHandler = require("./middlewares/error.middleware");

const projectRoutes = require("./routes/project.routes")

const taskRoutes = require("./routes/task.routes")

const app = express();

app.use(express.json());

app.get('/health' , (req,res) => {
    return res.status(200).json({
        success : true,
        message : "Project Management API is running"
    });
});

app.use("/api/auth" , authRoutes);

app.use("/api/projects", projectRoutes);

app.use("/api/tasks", taskRoutes);

app.use(errorHandler);

module.exports = app;