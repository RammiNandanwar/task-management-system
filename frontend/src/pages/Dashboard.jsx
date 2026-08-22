import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showCreateForm, setShowCreateForm] =
        useState(false);

    const [creating, setCreating] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        company: "",
        location: "",
        skills: "",
        experience: "",
        salary: "",
        employmentType: "Full-time"
    });

    // ======================================
    // FETCH JOBS
    // ======================================

    const fetchJobs = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await API.get("/jobs");

            const allJobs =
                response.data.jobs || [];

            // Get current user's ID
            const currentUserId =
                user?._id || user?.id;

            // Only show jobs created by
            // the logged-in recruiter
            const recruiterJobs =
                allJobs.filter((job) => {
                    const recruiterId =
                        job.recruiter?._id ||
                        job.recruiter?.id ||
                        job.recruiter;

                    return (
                        String(recruiterId) ===
                        String(currentUserId)
                    );
                });

            setJobs(recruiterJobs);

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
        if (user) {
            fetchJobs();
        }
    }, [user]);

    // ======================================
    // HANDLE FORM CHANGE
    // ======================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    // ======================================
    // CREATE JOB
    // ======================================

    const handleCreateJob = async (e) => {
        e.preventDefault();

        try {
            setCreating(true);
            setError("");

            const skillsArray =
                formData.skills
                    .split(",")
                    .map((skill) => skill.trim())
                    .filter(Boolean);

            const response = await API.post(
                "/jobs",
                {
                    title: formData.title,
                    description:
                        formData.description,
                    company: formData.company,
                    location: formData.location,
                    skills: skillsArray,
                    experience:
                        formData.experience,
                    salary: formData.salary,
                    employmentType:
                        formData.employmentType
                }
            );

            const newJob =
                response.data.job;

            setJobs((previousJobs) => [
                newJob,
                ...previousJobs
            ]);

            setFormData({
                title: "",
                description: "",
                company: "",
                location: "",
                skills: "",
                experience: "",
                salary: "",
                employmentType: "Full-time"
            });

            setShowCreateForm(false);

        } catch (error) {
            setError(
                error.response?.data?.error ||
                "Unable to create job."
            );
        } finally {
            setCreating(false);
        }
    };

    // ======================================
    // ARCHIVE JOB
    // ======================================

    const handleArchiveJob = async (jobId) => {
        const confirmed = window.confirm(
            "Are you sure you want to archive this job?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            await API.delete(
                `/jobs/${jobId}`
            );

            setJobs((previousJobs) =>
                previousJobs.filter(
                    (job) =>
                        job._id !== jobId
                )
            );

        } catch (error) {
            setError(
                error.response?.data?.error ||
                "Unable to archive job."
            );
        }
    };

    // ======================================
    // LOGOUT
    // ======================================

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    // ======================================
    // DASHBOARD STATS
    // ======================================

    const totalJobs = jobs.length;

    const activeJobs = jobs.filter(
        (job) => job.status === "active"
    ).length;

    // ======================================
    // LOADING
    // ======================================

    if (loading) {
        return (
            <div className="ats-dashboard">

                <div className="ats-state-card">

                    <h2>
                        Loading recruiter dashboard...
                    </h2>

                    <p>
                        Please wait while we load
                        your jobs.
                    </p>

                </div>

            </div>
        );
    }

    // ======================================
    // DASHBOARD
    // ======================================

    return (
        <div className="ats-dashboard">

            {/* ==================================
                HEADER
            ================================== */}

            <header className="ats-header">

                <div>

                    <h1>
                        Recruiter Dashboard
                    </h1>

                    <p>
                        Manage your job openings
                        and candidates.
                    </p>

                </div>

                <div className="ats-user-section">

                    <div className="ats-user-info">

                        <strong>
                            {user?.name}
                        </strong>

                        <span>
                            {user?.email}
                        </span>

                        <small>
                            Recruiter
                        </small>

                    </div>

                    <button
                        className="ats-logout-btn"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </header>


            {/* ==================================
                ERROR
            ================================== */}

            {error && (
                <div className="ats-error">
                    {error}
                </div>
            )}


            {/* ==================================
                STATISTICS
            ================================== */}

            <section className="ats-stats">

                <div className="ats-stat-card">

                    <span>
                        Total Jobs
                    </span>

                    <strong>
                        {totalJobs}
                    </strong>

                </div>


                <div className="ats-stat-card">

                    <span>
                        Active Jobs
                    </span>

                    <strong>
                        {activeJobs}
                    </strong>

                </div>


                <div className="ats-stat-card">

                    <span>
                        Candidate Ranking
                    </span>

                    <strong>
                        AI
                    </strong>

                </div>

            </section>


            {/* ==================================
                JOB SECTION HEADER
            ================================== */}

            <section className="ats-job-section">

                <div className="ats-section-header">

                    <div>

                        <h2>
                            My Job Listings
                        </h2>

                        <p>
                            Create and manage your
                            recruitment opportunities.
                        </p>

                    </div>

                    <button
                        className="ats-create-btn"
                        onClick={() =>
                            setShowCreateForm(
                                !showCreateForm
                            )
                        }
                    >
                        {showCreateForm
                            ? "Cancel"
                            : "+ Create New Job"}
                    </button>

                </div>


                {/* ==================================
                    CREATE JOB FORM
                ================================== */}

                {showCreateForm && (
                    <form
                        className="ats-create-form"
                        onSubmit={handleCreateJob}
                    >

                        <h2>
                            Create New Job
                        </h2>


                        <div className="ats-form-grid">

                            <div className="ats-form-group">

                                <label>
                                    Job Title
                                </label>

                                <input
                                    name="title"
                                    value={
                                        formData.title
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="e.g. MERN Stack Developer"
                                    required
                                />

                            </div>


                            <div className="ats-form-group">

                                <label>
                                    Company
                                </label>

                                <input
                                    name="company"
                                    value={
                                        formData.company
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Company name"
                                    required
                                />

                            </div>


                            <div className="ats-form-group">

                                <label>
                                    Location
                                </label>

                                <input
                                    name="location"
                                    value={
                                        formData.location
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="e.g. Pune / Remote"
                                    required
                                />

                            </div>


                            <div className="ats-form-group">

                                <label>
                                    Experience
                                </label>

                                <input
                                    name="experience"
                                    value={
                                        formData.experience
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="e.g. 1-3 years"
                                    required
                                />

                            </div>


                            <div className="ats-form-group">

                                <label>
                                    Salary
                                </label>

                                <input
                                    name="salary"
                                    value={
                                        formData.salary
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="e.g. 6-8 LPA"
                                />

                            </div>


                            <div className="ats-form-group">

                                <label>
                                    Employment Type
                                </label>

                                <select
                                    name="employmentType"
                                    value={
                                        formData.employmentType
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >

                                    <option value="Full-time">
                                        Full-time
                                    </option>

                                    <option value="Part-time">
                                        Part-time
                                    </option>

                                    <option value="Internship">
                                        Internship
                                    </option>

                                    <option value="Contract">
                                        Contract
                                    </option>

                                </select>

                            </div>

                        </div>


                        <div className="ats-form-group">

                            <label>
                                Required Skills
                            </label>

                            <input
                                name="skills"
                                value={
                                    formData.skills
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="React, Node.js, MongoDB, Express"
                                required
                            />

                            <small>
                                Separate skills using commas.
                            </small>

                        </div>


                        <div className="ats-form-group">

                            <label>
                                Job Description
                            </label>

                            <textarea
                                name="description"
                                value={
                                    formData.description
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter complete job description..."
                                rows="6"
                                required
                            />

                        </div>


                        <button
                            type="submit"
                            className="ats-submit-btn"
                            disabled={creating}
                        >
                            {creating
                                ? "Creating Job..."
                                : "Create Job"}
                        </button>

                    </form>
                )}


                {/* ==================================
                    NO JOBS
                ================================== */}

                {!showCreateForm &&
                    jobs.length === 0 && (
                        <div className="ats-empty">

                            <div>
                                📋
                            </div>

                            <h3>
                                No jobs created yet
                            </h3>

                            <p>
                                Create your first job
                                opening to start
                                receiving applications.
                            </p>

                            <button
                                className="ats-create-btn"
                                onClick={() =>
                                    setShowCreateForm(
                                        true
                                    )
                                }
                            >
                                + Create Your First Job
                            </button>

                        </div>
                    )}


                {/* ==================================
                    JOB CARDS
                ================================== */}

                {jobs.length > 0 && (
                    <div className="ats-job-grid">

                        {jobs.map((job) => (

                            <div
                                className="ats-job-card"
                                key={job._id}
                            >

                                <div className="ats-job-top">

                                    <div>

                                        <h3>
                                            {job.title}
                                        </h3>

                                        <p>
                                            {job.company}
                                        </p>

                                    </div>

                                    <span
                                        className="ats-status"
                                    >
                                        {job.status}
                                    </span>

                                </div>


                                <div className="ats-job-details">

                                    <span>
                                        📍 {job.location}
                                    </span>

                                    <span>
                                        💼{" "}
                                        {
                                            job.employmentType
                                        }
                                    </span>

                                    <span>
                                        🎓{" "}
                                        {
                                            job.experience
                                        }
                                    </span>

                                </div>


                                {/* SKILLS */}

                                <div className="ats-skills">

                                    {(Array.isArray(
                                        job.skills
                                    )
                                        ? job.skills
                                        : [job.skills]
                                    ).map(
                                        (
                                            skill,
                                            index
                                        ) => (
                                            <span
                                                key={
                                                    index
                                                }
                                            >
                                                {skill}
                                            </span>
                                        )
                                    )}

                                </div>


                                {/* ACTIONS */}

                                <div className="ats-job-actions">

                                    <button
                                        className="ats-view-btn"
                                        onClick={() =>
                                            navigate(
                                                `/jobs/${job._id}`
                                            )
                                        }
                                    >
                                        View Job
                                    </button>


                                    <button
                                        className="ats-ranking-btn"
                                        onClick={() =>
                                            navigate(
                                                `/recruiter/jobs/${job._id}/candidates`
                                            )
                                        }
                                    >
                                        Candidate Ranking
                                    </button>


                                    <button
                                        className="ats-archive-btn"
                                        onClick={() =>
                                            handleArchiveJob(
                                                job._id
                                            )
                                        }
                                    >
                                        Archive
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>
                )}

            </section>

        </div>
    );
};

export default Dashboard;