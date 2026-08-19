const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        company: {
            type: String,
            required: true,
            trim: true
        },

        location: {
            type: String,
            required: true,
            trim: true
        },

        skills: {
            type: [String],
            required: true
        },

        experience: {
            type: String,
            required: true,
            trim: true
        },

        salary: {
            type: String,
            default: "Not disclosed",
            trim: true
        },

        employmentType: {
            type: String,
            enum: [
                "full-time",
                "part-time",
                "internship",
                "contract"
            ],
            default: "full-time"
        },

        status: {
            type: String,
            enum: [
                "active",
                "closed",
                "archived"
            ],
            default: "active"
        },

        recruiter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Job", jobSchema);