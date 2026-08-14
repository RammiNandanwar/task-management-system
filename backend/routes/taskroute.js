const express = require("express");
const router = express.Router();

const { createTask } = require("../controllers/taskcontroller");
const authMiddleware = require("../middleware/auth");

router.post("/", authMiddleware, createTask);

module.exports = router;