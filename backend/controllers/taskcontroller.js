const Task = require("../models/task");

// Create a new task
exports.createTask = async (req, res) => {
    try {
        const {
            title,
            description,
            status,
            priority,
            dueDate
        } = req.body;

        // Check required field
        if (!title) {
            return res.status(400).json({
                error: "Task title is required"
            });
        }

        // Create task
        const task = await Task.create({
            title,
            description,
            status,
            priority,
            dueDate,
            user: req.user.userId
        });

        res.status(201).json({
            message: "Task created successfully",
            task
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};