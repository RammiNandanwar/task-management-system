const Application = require("../models/application");
const Job = require("../models/job");

// ======================================
// APPLY FOR A JOB
// ======================================

exports.applyForJob = async (req, res) => {
    try {
        const { coverLetter } = req.body;

        // Check job
        const job = await Job.findOne({
            _id: req.params.jobId,
            status: "active"
        });

        if (!job) {
            return res.status(404).json({
                error: "Job not found or no longer active"
            });
        }

        // Check duplicate application
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

        // Resume is required
        if (!req.file) {
            return res.status(400).json({
                error: "Resume PDF is required"
            });
        }

        // Create application
        const application = await Application.create({
            job: job._id,

            applicant: req.user._id,

            coverLetter: coverLetter || "",

            resume: {
                fileName: req.file.originalname,

                fileUrl:
                    `/uploads/resumes/${req.file.filename}`,

                filePath: req.file.path
            }
        });

        // Populate response
        const populatedApplication =
            await Application.findById(
                application._id
            )
                .populate(
                    "job",
                    "title company location"
                )
                .populate(
                    "applicant",
                    "name email"
                );

        res.status(201).json({
            message:
                "Application submitted successfully",

            application: populatedApplication
        });

    } catch (error) {
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