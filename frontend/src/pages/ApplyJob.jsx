import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

const ApplyJob = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [coverLetter, setCoverLetter] = useState("");
    const [resume, setResume] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // ================================
    // HANDLE RESUME SELECTION
    // ================================

    const handleResumeChange = (e) => {
        const file = e.target.files[0];

        if (!file) {
            setResume(null);
            return;
        }

        // Check PDF
        if (file.type !== "application/pdf") {
            setError(
                "Only PDF resume files are allowed."
            );

            setResume(null);
            return;
        }

        // Check 5 MB limit
        if (file.size > 5 * 1024 * 1024) {
            setError(
                "Resume file must be smaller than 5 MB."
            );

            setResume(null);
            return;
        }

        setError("");
        setResume(file);
    };

    // ================================
    // SUBMIT APPLICATION
    // ================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        // Resume required
        if (!resume) {
            setError("Please upload your resume.");
            return;
        }

        try {
            setLoading(true);

            // Create FormData
            const formData = new FormData();

            formData.append(
                "coverLetter",
                coverLetter
            );

            formData.append(
                "resume",
                resume
            );

            // Send application
            await API.post(
                `/applications/jobs/${id}`,
                formData
            );

            setSuccess(
                "Application submitted successfully!"
            );

            setCoverLetter("");
            setResume(null);

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

            {/* BACK BUTTON */}

            <button
                className="back-btn"
                onClick={() =>
                    navigate(`/jobs/${id}`)
                }
            >
                ← Back to Job
            </button>

            {/* APPLICATION FORM */}

            <div className="application-form">

                <h1>Apply for this Job</h1>

                <p>
                    Submit your application and resume
                    to the recruiter.
                </p>

                {/* ERROR MESSAGE */}

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {/* SUCCESS MESSAGE */}

                {success && (
                    <div className="success-message">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    {/* COVER LETTER */}

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

                    {/* RESUME */}

                    <div className="form-group">

                        <label>
                            Resume (PDF)
                        </label>

                        <input
                            type="file"
                            accept=".pdf,application/pdf"
                            onChange={
                                handleResumeChange
                            }
                        />

                        {resume && (
                            <p>
                                Selected file:{" "}
                                <strong>
                                    {resume.name}
                                </strong>
                            </p>
                        )}

                        <small>
                            Maximum file size: 5 MB.
                            PDF only.
                        </small>

                    </div>

                    {/* SUBMIT BUTTON */}

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