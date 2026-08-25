const express = require("express");

const app = express();

app.use(express.json());

app.get('/health' , (req,res) => {
    return res.status(200).json({
        success : true,
        message : "Project Management API is running"
    });
});

module.exports = app;