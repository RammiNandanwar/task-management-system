// Load environment variables FIRST
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");

// Routes
const authRoutes = require("./routes/authroute");
const taskRoutes = require("./routes/taskroute");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

// Check Gemini API key
console.log(
    "Gemini API Key loaded:",
    !!process.env.GEMINI_API_KEY
);

// Connect MongoDB
connectDB();

const app = express();

// ================================
// MIDDLEWARE
// ================================

app.use(cors());

app.use(express.json());

// Serve uploaded files
app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "uploads")
    )
);

// ================================
// ROUTES
// ================================

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/tasks",
    taskRoutes
);

app.use(
    "/api/jobs",
    jobRoutes
);

app.use(
    "/api/applications",
    applicationRoutes
);

// ================================
// TEST ROUTE
// ================================

app.get("/", (req, res) => {
    res.json({
        message:
            "Task Management System API is running"
    });
});

// ================================
// SERVER
// ================================

const PORT =
    process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(
        `Server running on port ${PORT}`
    );
});