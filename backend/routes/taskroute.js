const express = require("express");
const router = express.Router();

const {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask
} = require("../controllers/taskcontroller");

const authMiddleware = require("../middleware/auth");

router.post("/", authMiddleware, createTask);
router.get("/", authMiddleware, getAllTasks);
router.get("/:id", authMiddleware, getTaskById);
router.patch("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, deleteTask);

module.exports = router;