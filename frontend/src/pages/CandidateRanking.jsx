import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

const CandidateRanking = () => {
    const { jobId } = useParams();

    const [applications, setApplications] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

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

    if (loading) {
        return (
            <div className="page-container">
                <h2>
                    Loading candidates...
                </h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-container">
                <h2>
                    Unable to load candidates
                </h2>

                <p>
                    {error}
                </p>
            </div>
        );
    }

    return (
        <div className="page-container">

            <div className="page-header">

                <div>
                    <h1>
                        Candidate Ranking
                    </h1>

                    <p>
                        Candidates ranked by AI
                        match score
                    </p>
                </div>

                <div>
                    <strong>
                        {applications.length}
                    </strong>

                    <span>
                        {" "}Applications
                    </span>
                </div>

            </div>

            {applications.length === 0 ? (
                <div className="state-card">

                    <h3>
                        No applications yet
                    </h3>

                    <p>
                        Candidates who apply for
                        this job will appear here.
                    </p>

                </div>
            ) : (
                <div className="candidate-list">

                    {applications.map(
                        (application, index) => {

                            const score =
                                application
                                    .aiAnalysis
                                    ?.matchScore || 0;

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

                                    {/* CANDIDATE */}

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

                                        <span>
                                            Status:{" "}
                                            {
                                                application
                                                    .status
                                            }
                                        </span>

                                    </div>

                                    {/* SCORE */}

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
                                            Skills
                                        </h4>

                                        <div>

                                            {(
                                                application
                                                    .aiAnalysis
                                                    ?.skills ||
                                                []
                                            ).map(
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

                                </div>
                            );
                        }
                    )}

                </div>
            )}

        </div>
    );
};

export default CandidateRanking;