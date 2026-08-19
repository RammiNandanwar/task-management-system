import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchJob = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await API.get(`/jobs/${id}`);

            setJob(response.data.job);
        } catch (error) {
            setError(
                error.response?.data?.error ||
                "Unable to load job details."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJob();
    }, [id]);

    if (loading) {
        return (
            <div className="page-container">
                <p>Loading job details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-container">
                <h1>Job Not Found</h1>

                <p>{error}</p>

                <button
                    onClick={() => navigate("/jobs")}
                >
                    Back to Jobs
                </button>
            </div>
        );
    }

    if (!job) {
        return null;
    }

    return (
        <div className="page-container">

            {/* Back Button */}

            <button
                className="back-btn"
                onClick={() => navigate("/jobs")}
            >
                ← Back to Jobs
            </button>

            {/* Job Header */}

            <div className="job-details">

                <div className="job-details-header">

                    <div>
                        <h1>{job.title}</h1>

                        <h2>{job.company}</h2>
                    </div>

                    <span className="job-status">
                        {job.status}
                    </span>

                </div>

                {/* Job Information */}

                <div className="job-info">

                    <div>
                        <strong>Location</strong>
                        <p>{job.location}</p>
                    </div>

                    <div>
                        <strong>Experience</strong>
                        <p>{job.experience}</p>
                    </div>

                    <div>
                        <strong>Salary</strong>
                        <p>{job.salary}</p>
                    </div>

                    <div>
                        <strong>Employment Type</strong>
                        <p>{job.employmentType}</p>
                    </div>

                </div>

                {/* Description */}

                <section className="job-section">

                    <h2>Job Description</h2>

                    <p>
                        {job.description}
                    </p>

                </section>

                {/* Skills */}

                <section className="job-section">

                    <h2>Required Skills</h2>

                    <div className="job-skills">

                        {job.skills?.map(
                            (skill, index) => (
                                <span key={index}>
                                    {skill}
                                </span>
                            )
                        )}

                    </div>

                </section>

                {/* Recruiter */}

                {job.recruiter && (
                    <section className="job-section">

                        <h2>Posted By</h2>

                        <p>
                            {job.recruiter.name}
                        </p>

                        <p>
                            {job.recruiter.email}
                        </p>

                    </section>
                )}

                {/* Apply */}

                <div className="apply-section">

                    <button
                        className="apply-btn"
                        onClick={() =>
                            navigate(
                                `/jobs/${job._id}/apply`
                            )
                        }
                    >
                        Apply Now
                    </button>

                </div>

            </div>
        </div>
    );
};

export default JobDetails;