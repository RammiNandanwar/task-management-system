const express = require("express");

const router = express.Router();

const {
    applyForJob,
    getMyApplications,
    getJobApplications
} = require("../controllers/applicationController");

const authMiddleware = require("../middleware/auth");

const authorizeRole =
    require("../middleware/role");

const uploadResume =
    require("../middleware/uploadResume");


// ======================================
// APPLICANT
// ======================================

router.post(
    "/jobs/:jobId",
    authMiddleware,
    authorizeRole("applicant"),
    uploadResume.single("resume"),
    applyForJob
);


router.get(
    "/my",
    authMiddleware,
    authorizeRole("applicant"),
    getMyApplications
);


// ======================================
// RECRUITER
// ======================================

router.get(
    "/job/:jobId",
    authMiddleware,
    authorizeRole("recruiter"),
    getJobApplications
);


module.exports = router;