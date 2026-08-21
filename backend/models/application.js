const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
    {
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true
        },

        applicant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        coverLetter: {
            type: String,
            trim: true,
            default: ""
        },

        status: {
            type: String,
            enum: [
                "applied",
                "shortlisted",
                "interview",
                "offered",
                "rejected"
            ],
            default: "applied"
        },

        resume: {
            fileName: {
                type: String,
                default: ""
            },

            fileUrl: {
                type: String,
                default: ""
            },

            filePath: {
                type: String,
                default: ""
            },

            extractedText: {
                type: String,
                default: ""
            }
        },

        aiAnalysis: {
            matchScore: {
                type: Number,
                default: null
            },

            skills: {
                type: [String],
                default: []
            },

            experience: {
                type: String,
                default: ""
            },

            strengths: {
                type: [String],
                default: []
            },

            missingSkills: {
                type: [String],
                default: []
            },

            summary: {
                type: String,
                default: ""
            }
        }
    },
    {
        timestamps: true
    }
);

applicationSchema.index(
    {
        job: 1,
        applicant: 1
    },
    {
        unique: true
    }
);

module.exports = mongoose.model(
    "Application",
    applicationSchema
);