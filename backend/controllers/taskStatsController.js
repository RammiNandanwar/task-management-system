const Task = require("../models/task");

exports.getTaskStats = async (req, res) => {
    try {
        const userId = req.user.userId;

        const totalTasks = await Task.countDocuments({
            user: userId
        });

        const pendingTasks = await Task.countDocuments({
            user: userId,
            status: "pending"
        });

        const inProgressTasks = await Task.countDocuments({
            user: userId,
            status: "in-progress"
        });

        const completedTasks = await Task.countDocuments({
            user: userId,
            status: "completed"
        });

        res.status(200).json({
            totalTasks,
            pendingTasks,
            inProgressTasks,
            completedTasks
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};