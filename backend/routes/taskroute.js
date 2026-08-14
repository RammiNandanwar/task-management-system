const express = require("express");
const router = express.Router();

const {
    createTask,
    getAllTasks,
    getTaskById
} = require("../controllers/taskcontroller");

const authMiddleware = require("../middleware/auth");

router.post("/", authMiddleware, createTask);
router.get("/", authMiddleware, getAllTasks);
router.get("/:id", authMiddleware, getTaskById);

module.exports = router;