const express = require("express");

const router = express.Router();

const {
    applyForJob,
    getMyApplications
} = require("../controllers/applicationController");

const authMiddleware = require("../middleware/auth");

const authorizeRole = require("../middleware/role");

const uploadResume = require("../middleware/uploadResume");


// ======================================
// APPLICANT ROUTES
// ======================================

// Apply for a job + upload resume
router.post(
    "/jobs/:jobId",
    authMiddleware,
    authorizeRole("applicant"),
    uploadResume.single("resume"),
    applyForJob
);


// Get applicant's applications
router.get(
    "/my",
    authMiddleware,
    authorizeRole("applicant"),
    getMyApplications
);


module.exports = router;