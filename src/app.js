const express = require("express");

const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(express.json());

app.get('/health' , (req,res) => {
    return res.status(200).json({
        success : true,
        message : "Project Management API is running"
    });
});

app.use("/api/auth" , authRoutes);

module.exports = app;