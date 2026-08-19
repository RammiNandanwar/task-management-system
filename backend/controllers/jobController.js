const Job = require("../models/job");

// ======================================
// CREATE JOB
// ======================================

exports.createJob = async (req, res) => {
    try {
        const {
            title,
            description,
            company,
            location,
            skills,
            experience,
            salary,
            employmentType
        } = req.body;

        // Check required fields
        if (
            !title ||
            !description ||
            !company ||
            !location ||
            !skills ||
            !experience
        ) {
            return res.status(400).json({
                error: "All required job fields must be filled"
            });
        }

        // Create job
        const job = await Job.create({
            title,
            description,
            company,
            location,
            skills,
            experience,
            salary,
            employmentType,
            recruiter: req.user.userId
        });

        res.status(201).json({
            message: "Job created successfully",
            job
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};


// ======================================
// GET ALL ACTIVE JOBS
// ======================================

exports.getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find({
            status: "active"
        })
            .populate(
                "recruiter",
                "name email"
            )
            .sort({
                createdAt: -1
            });

        res.status(200).json({
            count: jobs.length,
            jobs
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};


// ======================================
// GET SINGLE JOB
// ======================================

exports.getJobById = async (req, res) => {
    try {
        const job = await Job.findOne({
            _id: req.params.id,
            status: "active"
        }).populate(
            "recruiter",
            "name email"
        );

        if (!job) {
            return res.status(404).json({
                error: "Job not found"
            });
        }

        res.status(200).json({
            job
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};


// ======================================
// UPDATE JOB
// ======================================

exports.updateJob = async (req, res) => {
    try {
        const {
            title,
            description,
            company,
            location,
            skills,
            experience,
            salary,
            employmentType,
            status
        } = req.body;

        // Find job belonging to logged-in recruiter
        const job = await Job.findOne({
            _id: req.params.id,
            recruiter: req.user.userId
        });

        if (!job) {
            return res.status(404).json({
                error: "Job not found or you are not the owner"
            });
        }

        // Update only provided fields
        if (title !== undefined) {
            job.title = title;
        }

        if (description !== undefined) {
            job.description = description;
        }

        if (company !== undefined) {
            job.company = company;
        }

        if (location !== undefined) {
            job.location = location;
        }

        if (skills !== undefined) {
            job.skills = skills;
        }

        if (experience !== undefined) {
            job.experience = experience;
        }

        if (salary !== undefined) {
            job.salary = salary;
        }

        if (employmentType !== undefined) {
            job.employmentType = employmentType;
        }

        if (status !== undefined) {
            job.status = status;
        }

        await job.save();

        res.status(200).json({
            message: "Job updated successfully",
            job
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};


// ======================================
// ARCHIVE JOB
// ======================================

exports.deleteJob = async (req, res) => {
    try {
        // Instead of permanently deleting,
        // change status to archived
        const job = await Job.findOne({
            _id: req.params.id,
            recruiter: req.user.userId
        });

        if (!job) {
            return res.status(404).json({
                error: "Job not found or you are not the owner"
            });
        }

        job.status = "archived";

        await job.save();

        res.status(200).json({
            message: "Job archived successfully",
            job
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};