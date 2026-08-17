import { useEffect, useState } from "react";

const EditTask = ({ task, onUpdate, onCancel }) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        status: "pending",
        priority: "medium",
        dueDate: ""
    });

    useEffect(() => {
        setFormData({
            title: task.title || "",
            description: task.description || "",
            status: task.status || "pending",
            priority: task.priority || "medium",
            dueDate: task.dueDate
                ? task.dueDate.split("T")[0]
                : ""
        });
    }, [task]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        onUpdate(task._id, formData);
    };

    return (
        <div>
            <h3>Edit Task</h3>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title</label>

                    <br />

                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter task title"
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Description</label>

                    <br />

                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter task description"
                    />
                </div>

                <br />

                <div>
                    <label>Status</label>

                    <br />

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

                <br />

                <div>
                    <label>Priority</label>

                    <br />

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

                <br />

                <div>
                    <label>Due Date</label>

                    <br />

                    <input
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                    />
                </div>

                <br />

                <button type="submit">
                    Save Changes
                </button>

                {" "}

                <button
                    type="button"
                    onClick={onCancel}
                >
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default EditTask;