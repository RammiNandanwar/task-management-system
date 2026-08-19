import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const JobBoard = () => {
    const navigate = useNavigate();

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ================================
    // FETCH JOBS
    // ================================

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

    // ================================
    // LOAD JOBS
    // ================================

    useEffect(() => {
        fetchJobs();
    }, []);

    // ================================
    // LOADING STATE
    // ================================

    if (loading) {
        return (
            <div className="page-container">
                <div className="page-header">
                    <h1>Available Jobs</h1>

                    <p>
                        Find the right opportunity for your
                        skills and experience.
                    </p>
                </div>

                <div className="state-card">
                    <h3>Loading jobs...</h3>

                    <p>
                        Please wait while we fetch the
                        latest job openings.
                    </p>
                </div>
            </div>
        );
    }

    // ================================
    // ERROR STATE
    // ================================

    if (error) {
        return (
            <div className="page-container">
                <div className="page-header">
                    <h1>Available Jobs</h1>

                    <p>
                        Find the right opportunity for your
                        skills and experience.
                    </p>
                </div>

                <div className="state-card error-state">
                    <h3>Unable to load jobs</h3>

                    <p>{error}</p>

                    <button
                        className="retry-btn"
                        onClick={fetchJobs}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // ================================
    // JOB BOARD
    // ================================

    return (
        <div className="page-container">

            {/* PAGE HEADER */}

            <div className="page-header">
                <h1>Available Jobs</h1>

                <p>
                    Find the right opportunity for your
                    skills and experience.
                </p>
            </div>

            {/* EMPTY STATE */}

            {jobs.length === 0 ? (
                <div className="state-card">
                    <h2>No jobs available</h2>

                    <p>
                        There are currently no active job
                        openings.
                    </p>
                </div>
            ) : (

                /* JOB GRID */

                <div className="job-grid">

                    {jobs.map((job) => (
                        <div
                            className="job-card"
                            key={job._id}
                        >

                            {/* JOB HEADER */}

                            <div className="job-card-header">

                                <div>
                                    <h2>
                                        {job.title}
                                    </h2>

                                    <p className="job-company">
                                        {job.company}
                                    </p>
                                </div>

                                <span className="job-type">
                                    {job.employmentType}
                                </span>

                            </div>

                            {/* JOB INFORMATION */}

                            <div className="job-info">

                                <p>
                                    📍{" "}
                                    <strong>
                                        Location:
                                    </strong>{" "}
                                    {job.location}
                                </p>

                                <p>
                                    💼{" "}
                                    <strong>
                                        Experience:
                                    </strong>{" "}
                                    {job.experience}
                                </p>

                                <p>
                                    💰{" "}
                                    <strong>
                                        Salary:
                                    </strong>{" "}
                                    {job.salary}
                                </p>

                            </div>

                            {/* SKILLS */}

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

                            {/* DESCRIPTION */}

                            <p className="job-description">
                                {job.description}
                            </p>

                            {/* VIEW JOB */}

                            <button
                                className="view-job-btn"
                                onClick={() =>
                                    navigate(
                                        `/jobs/${job._id}`
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