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

// Get all tasks for logged-in user
exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find({
            user: req.user.userId
        }).sort({ createdAt: -1 });

        res.status(200).json({
            count: tasks.length,
            tasks
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};
// Get a single task by ID
exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user.userId
        });

        if (!task) {
            return res.status(404).json({
                error: "Task not found"
            });
        }

        res.status(200).json({
            task
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};
// Update a task
exports.updateTask = async (req, res) => {
    try {
        const {
            title,
            description,
            status,
            priority,
            dueDate
        } = req.body;

        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user.userId
        });

        if (!task) {
            return res.status(404).json({
                error: "Task not found"
            });
        }

        // Update only the fields that are provided
        if (title !== undefined) {
            task.title = title;
        }

        if (description !== undefined) {
            task.description = description;
        }

        if (status !== undefined) {
            task.status = status;
        }

        if (priority !== undefined) {
            task.priority = priority;
        }

        if (dueDate !== undefined) {
            task.dueDate = dueDate;
        }

        await task.save();

        res.status(200).json({
            message: "Task updated successfully",
            task
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};