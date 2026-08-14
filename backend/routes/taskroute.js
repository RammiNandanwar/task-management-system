const express = require("express");
const router = express.Router();

const {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask
} = require("../controllers/taskcontroller");

const authMiddleware = require("../middleware/auth");

router.post("/", authMiddleware, createTask);
router.get("/", authMiddleware, getAllTasks);
router.get("/:id", authMiddleware, getTaskById);
router.patch("/:id", authMiddleware, updateTask);

module.exports = router;