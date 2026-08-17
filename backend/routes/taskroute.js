const express = require("express");
const router = express.Router();

const {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask
} = require("../controllers/taskcontroller");

const {
    getTaskStats
} = require("../controllers/taskStatsController");

const authMiddleware = require("../middleware/auth");

// Create task
router.post("/", authMiddleware, createTask);

// Get task statistics
router.get("/stats", authMiddleware, getTaskStats);

// Get all tasks
router.get("/", authMiddleware, getAllTasks);

// Get task by ID
router.get("/:id", authMiddleware, getTaskById);

// Update task
router.patch("/:id", authMiddleware, updateTask);

// Delete task
router.delete("/:id", authMiddleware, deleteTask);

module.exports = router;