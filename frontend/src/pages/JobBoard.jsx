import { useEffect, useState } from "react";
import API from "../services/api";

const JobBoard = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchJobs = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await API.get("/jobs");

            setJobs(response.data.jobs || []);
        } catch (error) {
            setError(
                error.response?.data?.error ||
                "Unable to load jobs."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    if (loading) {
        return (
            <div className="page-container">
                <h1>Available Jobs</h1>
                <p>Loading jobs...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-container">
                <h1>Available Jobs</h1>
                <p>{error}</p>

                <button onClick={fetchJobs}>
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Available Jobs</h1>

                <p>
                    Find the right opportunity for your
                    skills and experience.
                </p>
            </div>

            {jobs.length === 0 ? (
                <div className="empty-state">
                    <h2>No jobs available</h2>

                    <p>
                        There are currently no active job
                        openings.
                    </p>
                </div>
            ) : (
                <div className="job-grid">
                    {jobs.map((job) => (
                        <div
                            className="job-card"
                            key={job._id}
                        >
                            <div className="job-card-header">
                                <h2>{job.title}</h2>

                                <span>
                                    {job.employmentType}
                                </span>
                            </div>

                            <p className="job-company">
                                {job.company}
                            </p>

                            <p>
                                📍 {job.location}
                            </p>

                            <p>
                                💼 Experience:{" "}
                                {job.experience}
                            </p>

                            <p>
                                💰 Salary:{" "}
                                {job.salary}
                            </p>

                            <div className="job-skills">
                                {job.skills?.map(
                                    (skill, index) => (
                                        <span
                                            key={index}
                                        >
                                            {skill}
                                        </span>
                                    )
                                )}
                            </div>

                            <p className="job-description">
                                {job.description}
                            </p>

                            <button
                                className="view-job-btn"
                                onClick={() =>
                                    window.alert(
                                        "Job details and application functionality will be added in the next steps."
                                    )
                                }
                            >
                                View Job
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default JobBoard;