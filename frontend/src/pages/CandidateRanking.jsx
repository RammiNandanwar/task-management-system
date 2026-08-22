import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

const CandidateRanking = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchTerm, setSearchTerm] = useState("");
    const [minimumScore, setMinimumScore] = useState(0);
    const [statusFilter, setStatusFilter] = useState("all");

    const [selectedCandidate, setSelectedCandidate] =
        useState(null);

    // ======================================
    // FETCH APPLICATIONS
    // ======================================

    const fetchApplications = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await API.get(
                `/applications/job/${jobId}`
            );

            setApplications(
                response.data.applications || []
            );
        } catch (error) {
            setError(
                error.response?.data?.error ||
                "Unable to load candidates."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, [jobId]);

    // ======================================
    // FILTER CANDIDATES
    // ======================================

    const filteredApplications = useMemo(() => {
        return applications.filter((application) => {
            const candidateName =
                application.applicant?.name
                    ?.toLowerCase() || "";

            const candidateEmail =
                application.applicant?.email
                    ?.toLowerCase() || "";

            const search =
                searchTerm.toLowerCase().trim();

            const score =
                application.aiAnalysis?.matchScore || 0;

            const matchesSearch =
                candidateName.includes(search) ||
                candidateEmail.includes(search);

            const matchesScore =
                score >= Number(minimumScore);

            const matchesStatus =
                statusFilter === "all" ||
                application.status === statusFilter;

            return (
                matchesSearch &&
                matchesScore &&
                matchesStatus
            );
        });
    }, [
        applications,
        searchTerm,
        minimumScore,
        statusFilter
    ]);

    // ======================================
    // CLEAR FILTERS
    // ======================================

    const clearFilters = () => {
        setSearchTerm("");
        setMinimumScore(0);
        setStatusFilter("all");
    };

    // ======================================
    // LOADING
    // ======================================

    if (loading) {
        return (
            <div className="page-container">
                <div className="state-card">
                    <h2>
                        Loading candidates...
                    </h2>

                    <p>
                        Please wait while we fetch
                        the AI-ranked candidates.
                    </p>
                </div>
            </div>
        );
    }

    // ======================================
    // ERROR
    // ======================================

    if (error) {
        return (
            <div className="page-container">
                <div className="state-card error-state">
                    <h2>
                        Unable to load candidates
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        onClick={fetchApplications}
                        className="retry-btn"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // ======================================
    // DASHBOARD
    // ======================================

    return (
        <div className="page-container">

            {/* HEADER */}

            <div className="page-header">

                <div>
                    <button
                        className="back-btn"
                        onClick={() => navigate(-1)}
                    >
                        ← Back
                    </button>

                    <h1>
                        Candidate Ranking
                    </h1>

                    <p>
                        AI-powered candidate
                        evaluation
                    </p>
                </div>

                <div className="candidate-count">
                    <strong>
                        {applications.length}
                    </strong>

                    <span>
                        Total Applications
                    </span>
                </div>

            </div>

            {/* FILTERS */}

            <section className="filter-panel">

                <div className="filter-group">

                    <label>
                        Search Candidate
                    </label>

                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) =>
                            setSearchTerm(
                                e.target.value
                            )
                        }
                    />

                </div>

                <div className="filter-group">

                    <label>
                        Minimum AI Score
                    </label>

                    <select
                        value={minimumScore}
                        onChange={(e) =>
                            setMinimumScore(
                                e.target.value
                            )
                        }
                    >
                        <option value="0">
                            All Scores
                        </option>

                        <option value="50">
                            50%+
                        </option>

                        <option value="60">
                            60%+
                        </option>

                        <option value="70">
                            70%+
                        </option>

                        <option value="80">
                            80%+
                        </option>

                        <option value="90">
                            90%+
                        </option>
                    </select>

                </div>

                <div className="filter-group">

                    <label>
                        Application Status
                    </label>

                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(
                                e.target.value
                            )
                        }
                    >
                        <option value="all">
                            All Statuses
                        </option>

                        <option value="applied">
                            Applied
                        </option>

                        <option value="shortlisted">
                            Shortlisted
                        </option>

                        <option value="interview">
                            Interview
                        </option>

                        <option value="offered">
                            Offered
                        </option>

                        <option value="rejected">
                            Rejected
                        </option>
                    </select>

                </div>

                <button
                    className="clear-filter-btn"
                    onClick={clearFilters}
                >
                    Clear Filters
                </button>

            </section>

            {/* RESULTS */}

            <div className="results-header">

                <div>
                    <h2>
                        Ranked Candidates
                    </h2>

                    <p>
                        Showing{" "}
                        {filteredApplications.length}{" "}
                        of{" "}
                        {applications.length}{" "}
                        candidates
                    </p>
                </div>

            </div>

            {/* EMPTY RESULT */}

            {filteredApplications.length === 0 ? (
                <div className="state-card">

                    <div className="state-icon">
                        ?
                    </div>

                    <h3>
                        No matching candidates
                    </h3>

                    <p>
                        Try changing your search
                        or filters.
                    </p>

                    <button
                        className="retry-btn"
                        onClick={clearFilters}
                    >
                        Clear Filters
                    </button>

                </div>
            ) : (

                /* CANDIDATE LIST */

                <div className="candidate-list">

                    {filteredApplications.map(
                        (application, index) => {

                            const score =
                                application.aiAnalysis
                                    ?.matchScore || 0;

                            const skills =
                                application.aiAnalysis
                                    ?.skills || [];

                            const missingSkills =
                                application.aiAnalysis
                                    ?.missingSkills || [];

                            return (
                                <div
                                    key={
                                        application._id
                                    }
                                    className="candidate-card"
                                >

                                    {/* RANK */}

                                    <div className="candidate-rank">
                                        #{index + 1}
                                    </div>

                                    {/* CANDIDATE INFO */}

                                    <div className="candidate-info">

                                        <h2>
                                            {
                                                application
                                                    .applicant
                                                    ?.name
                                            }
                                        </h2>

                                        <p>
                                            {
                                                application
                                                    .applicant
                                                    ?.email
                                            }
                                        </p>

                                        <span
                                            className="candidate-status"
                                        >
                                            {
                                                application
                                                    .status
                                            }
                                        </span>

                                    </div>

                                    {/* AI SCORE */}

                                    <div className="candidate-score">

                                        <strong>
                                            {score}%
                                        </strong>

                                        <span>
                                            AI Match
                                        </span>

                                    </div>

                                    {/* SKILLS */}

                                    <div className="candidate-skills">

                                        <h4>
                                            Matching Skills
                                        </h4>

                                        <div>

                                            {skills.length >
                                            0 ? (
                                                skills.map(
                                                    (
                                                        skill,
                                                        skillIndex
                                                    ) => (
                                                        <span
                                                            key={
                                                                skillIndex
                                                            }
                                                        >
                                                            {
                                                                skill
                                                            }
                                                        </span>
                                                    )
                                                )
                                            ) : (
                                                <p>
                                                    No skills
                                                    found
                                                </p>
                                            )}

                                        </div>

                                    </div>

                                    {/* MISSING SKILLS */}

                                    <div className="candidate-missing-skills">

                                        <h4>
                                            Missing Skills
                                        </h4>

                                        <div>

                                            {missingSkills.length >
                                            0 ? (
                                                missingSkills.map(
                                                    (
                                                        skill,
                                                        skillIndex
                                                    ) => (
                                                        <span
                                                            key={
                                                                skillIndex
                                                            }
                                                        >
                                                            {
                                                                skill
                                                            }
                                                        </span>
                                                    )
                                                )
                                            ) : (
                                                <p>
                                                    No major
                                                    missing
                                                    skills
                                                </p>
                                            )}

                                        </div>

                                    </div>

                                    {/* SUMMARY */}

                                    <div className="candidate-summary">

                                        <h4>
                                            AI Summary
                                        </h4>

                                        <p>
                                            {
                                                application
                                                    .aiAnalysis
                                                    ?.summary ||
                                                "No AI summary available."
                                            }
                                        </p>

                                    </div>

                                    {/* VIEW DETAILS */}

                                    <button
                                        className="view-candidate-btn"
                                        onClick={() =>
                                            setSelectedCandidate(
                                                application
                                            )
                                        }
                                    >
                                        View Details
                                    </button>

                                </div>
                            );
                        }
                    )}

                </div>
            )}

            {/* ======================================
                CANDIDATE DETAILS MODAL
            ====================================== */}

            {selectedCandidate && (
                <div className="modal-overlay">

                    <div className="candidate-modal">

                        <button
                            className="modal-close"
                            onClick={() =>
                                setSelectedCandidate(
                                    null
                                )
                            }
                        >
                            ×
                        </button>

                        <h2>
                            {
                                selectedCandidate
                                    .applicant
                                    ?.name
                            }
                        </h2>

                        <p>
                            {
                                selectedCandidate
                                    .applicant
                                    ?.email
                            }
                        </p>

                        <div className="modal-score">

                            <strong>
                                {
                                    selectedCandidate
                                        .aiAnalysis
                                        ?.matchScore || 0
                                }%
                            </strong>

                            <span>
                                AI Match Score
                            </span>

                        </div>

                        <div className="modal-section">

                            <h3>
                                Experience
                            </h3>

                            <p>
                                {
                                    selectedCandidate
                                        .aiAnalysis
                                        ?.experience ||
                                    "Not available"
                                }
                            </p>

                        </div>

                        <div className="modal-section">

                            <h3>
                                Strengths
                            </h3>

                            {(
                                selectedCandidate
                                    .aiAnalysis
                                    ?.strengths || []
                            ).map(
                                (
                                    strength,
                                    index
                                ) => (
                                    <p key={index}>
                                        • {strength}
                                    </p>
                                )
                            )}

                        </div>

                        <div className="modal-section">

                            <h3>
                                Missing Skills
                            </h3>

                            {(
                                selectedCandidate
                                    .aiAnalysis
                                    ?.missingSkills || []
                            ).map(
                                (
                                    skill,
                                    index
                                ) => (
                                    <p key={index}>
                                        • {skill}
                                    </p>
                                )
                            )}

                        </div>

                        <div className="modal-section">

                            <h3>
                                AI Summary
                            </h3>

                            <p>
                                {
                                    selectedCandidate
                                        .aiAnalysis
                                        ?.summary ||
                                    "No summary available."
                                }
                            </p>

                        </div>

                        <div className="modal-section">

                            <h3>
                                Application Status
                            </h3>

                            <p>
                                {
                                    selectedCandidate
                                        .status
                                }
                            </p>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
};

export default CandidateRanking;