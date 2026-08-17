import { useState } from "react";
import API from "../services/api";

const CreateTask = ({
    onTaskCreated
}) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        status: "pending",
        priority: "medium",
        dueDate: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await API.post(
                "/tasks",
                formData
            );

            onTaskCreated(
                response.data.task
            );

            setFormData({
                title: "",
                description: "",
                status: "pending",
                priority: "medium",
                dueDate: ""
            });
        } catch (error) {
            setError(
                error.response?.data?.error ||
                "Failed to create task"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            className="create-task-form"
            onSubmit={handleSubmit}
        >

            <div className="form-group">
                <label>
                    Task Title
                </label>

                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter task title"
                    required
                />
            </div>

            <div className="form-group">
                <label>
                    Description
                </label>

                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter task description"
                    rows="4"
                />
            </div>

            <div className="form-row">

                <div className="form-group">
                    <label>
                        Status
                    </label>

                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                    >
                        <option value="pending">
                            Pending
                        </option>

                        <option value="in-progress">
                            In Progress
                        </option>

                        <option value="completed">
                            Completed
                        </option>
                    </select>
                </div>

                <div className="form-group">
                    <label>
                        Priority
                    </label>

                    <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                    >
                        <option value="low">
                            Low
                        </option>

                        <option value="medium">
                            Medium
                        </option>

                        <option value="high">
                            High
                        </option>
                    </select>
                </div>

                <div className="form-group">
                    <label>
                        Due Date
                    </label>

                    <input
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                    />
                </div>

            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <button
                className="create-btn"
                type="submit"
                disabled={loading}
            >
                {loading
                    ? "Creating..."
                    : "Create Task"}
            </button>

        </form>
    );
};

export default CreateTask;