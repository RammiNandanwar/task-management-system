const express = require("express");

const router = express.Router();

const {
    applyForJob,
    getMyApplications
} = require("../controllers/applicationController");

const authMiddleware = require("../middleware/auth");
const authorizeRole = require("../middleware/role");


// ======================================
// APPLICANT ROUTES
// ======================================

// Apply for a job
router.post(
    "/jobs/:jobId",
    authMiddleware,
    authorizeRole("applicant"),
    applyForJob
);


// Get logged-in applicant's applications
router.get(
    "/my",
    authMiddleware,
    authorizeRole("applicant"),
    getMyApplications
);


module.exports = router;