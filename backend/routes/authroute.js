const express = require("express");
const router = express.Router();

const {
    register,
    login,
    getMe
} = require("../controllers/authcontroller");

const authMiddleware = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);

router.get("/me", authMiddleware, getMe);

module.exports = router;