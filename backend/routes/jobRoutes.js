const express = require("express");

const router = express.Router();

const {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob
} = require("../controllers/jobController");

const authMiddleware = require("../middleware/auth");
const authorizeRole = require("../middleware/role");


// ======================================
// PUBLIC JOB ROUTES
// ======================================

// Get all active jobs
router.get("/", getAllJobs);

// Get single active job
router.get("/:id", getJobById);


// ======================================
// RECRUITER JOB ROUTES
// ======================================

// Create job
router.post(
    "/",
    authMiddleware,
    authorizeRole("recruiter"),
    createJob
);

// Update job
router.patch(
    "/:id",
    authMiddleware,
    authorizeRole("recruiter"),
    updateJob
);

// Archive job
router.delete(
    "/:id",
    authMiddleware,
    authorizeRole("recruiter"),
    deleteJob
);


module.exports = router;