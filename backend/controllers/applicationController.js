const Application = require("../models/application");
const Job = require("../models/job");
const extractResumeText = require("../utils/resumeParser");
const analyzeResume = require("../services/aiService");

// ======================================
// APPLY FOR A JOB
// ======================================

exports.applyForJob = async (req, res) => {
    try {
        const { coverLetter } = req.body;

        // ======================================
        // CHECK JOB
        // ======================================

        const job = await Job.findOne({
            _id: req.params.jobId,
            status: "active"
        });

        if (!job) {
            return res.status(404).json({
                error: "Job not found or no longer active"
            });
        }

        // ======================================
        // CHECK DUPLICATE APPLICATION
        // ======================================

        const existingApplication =
            await Application.findOne({
                job: job._id,
                applicant: req.user._id
            });

        if (existingApplication) {
            return res.status(400).json({
                error:
                    "You have already applied for this job"
            });
        }

        // ======================================
        // CHECK RESUME
        // ======================================

        if (!req.file) {
            return res.status(400).json({
                error: "Resume PDF is required"
            });
        }

        // ======================================
        // EXTRACT RESUME TEXT
        // ======================================

        const extractedText =
            await extractResumeText(
                req.file.path
            );

        if (!extractedText) {
            return res.status(400).json({
                error:
                    "Could not extract text from the resume"
            });
        }

        // ======================================
        // AI ANALYSIS
        // ======================================

        const aiAnalysis = await analyzeResume(
            extractedText,
            job.description
        );

        // ======================================
        // CREATE APPLICATION
        // ======================================

        const application =
            await Application.create({
                job: job._id,

                applicant: req.user._id,

                coverLetter:
                    coverLetter || "",

                status: "applied",

                resume: {
                    fileName:
                        req.file.originalname,

                    fileUrl:
                        `/uploads/resumes/${req.file.filename}`,

                    filePath:
                        req.file.path,

                    extractedText
                },

                aiAnalysis: {
                    matchScore:
                        aiAnalysis.matchScore,

                    skills:
                        aiAnalysis.skills,

                    experience:
                        aiAnalysis.experience,

                    strengths:
                        aiAnalysis.strengths,

                    missingSkills:
                        aiAnalysis.missingSkills,

                    summary:
                        aiAnalysis.summary
                }
            });

        // ======================================
        // POPULATE APPLICATION
        // ======================================

        const populatedApplication =
            await Application.findById(
                application._id
            )
                .populate(
                    "job",
                    "title company location description"
                )
                .populate(
                    "applicant",
                    "name email"
                );

        // ======================================
        // RESPONSE
        // ======================================

        res.status(201).json({
            message:
                "Application submitted and AI analysis completed",

            application: populatedApplication
        });

    } catch (error) {
        console.error(
            "Application + AI analysis error:",
            error
        );

        res.status(500).json({
            error: error.message
        });
    }
};

// ======================================
// GET APPLICANT'S APPLICATIONS
// ======================================

exports.getMyApplications = async (req, res) => {
    try {
        const applications =
            await Application.find({
                applicant: req.user._id
            })
                .populate(
                    "job",
                    "title company location status"
                )
                .sort({
                    createdAt: -1
                });

        res.status(200).json({
            count: applications.length,
            applications
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};
// ======================================
// GET APPLICATIONS FOR A JOB
// RECRUITER ONLY
// ======================================

exports.getJobApplications = async (req, res) => {
    try {
        const { jobId } = req.params;

        // Find the job
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                error: "Job not found"
            });
        }

        // Make sure the recruiter owns this job
        if (
            job.recruiter.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                error:
                    "You are not authorized to view applications for this job"
            });
        }

        // Get applications
        const applications =
            await Application.find({
                job: jobId
            })
                .populate(
                    "applicant",
                    "name email"
                )
                .populate(
                    "job",
                    "title company location"
                );

        // Sort by AI match score
        applications.sort((a, b) => {
            const scoreA =
                a.aiAnalysis?.matchScore || 0;

            const scoreB =
                b.aiAnalysis?.matchScore || 0;

            return scoreB - scoreA;
        });

        res.status(200).json({
            count: applications.length,

            applications
        });

    } catch (error) {
        console.error(
            "Get job applications error:",
            error
        );

        res.status(500).json({
            error: error.message
        });
    }
};