import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

const ApplyJob = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [coverLetter, setCoverLetter] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");
            setSuccess("");

            await API.post(
                `/applications/jobs/${id}`,
                {
                    coverLetter
                }
            );

            setSuccess(
                "Application submitted successfully!"
            );

            setCoverLetter("");

        } catch (error) {
            setError(
                error.response?.data?.error ||
                "Unable to submit application."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">

            <button
                className="back-btn"
                onClick={() => navigate(`/jobs/${id}`)}
            >
                ← Back to Job
            </button>

            <div className="application-form">

                <h1>Apply for this Job</h1>

                <p>
                    Submit your application to the recruiter.
                </p>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="success-message">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label>
                            Cover Letter
                        </label>

                        <textarea
                            rows="8"
                            value={coverLetter}
                            onChange={(e) =>
                                setCoverLetter(
                                    e.target.value
                                )
                            }
                            placeholder="Write your cover letter..."
                        />

                    </div>

                    <button
                        type="submit"
                        className="apply-btn"
                        disabled={loading}
                    >
                        {loading
                            ? "Submitting..."
                            : "Submit Application"}
                    </button>

                </form>

            </div>

        </div>
    );
};

export default ApplyJob;