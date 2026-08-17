const TaskCard = ({
    task,
    onEdit,
    onDelete
}) => {
    return (
        <div className="task-card">

            <div className="task-card-header">

                <h3>
                    {task.title}
                </h3>

                <span
                    className={`status-badge status-${task.status}`}
                >
                    {task.status === "in-progress"
                        ? "In Progress"
                        : task.status}
                </span>

            </div>

            <p className="task-description">
                {task.description ||
                    "No description provided"}
            </p>

            <div className="task-details">

                <div>
                    <span>Priority</span>

                    <strong
                        className={`priority-${task.priority}`}
                    >
                        {task.priority}
                    </strong>
                </div>

                {task.dueDate && (
                    <div>
                        <span>Due Date</span>

                        <strong>
                            {new Date(
                                task.dueDate
                            ).toLocaleDateString()}
                        </strong>
                    </div>
                )}

            </div>

            <div className="task-actions">

                <button
                    className="edit-btn"
                    onClick={() =>
                        onEdit(task)
                    }
                >
                    Edit
                </button>

                <button
                    className="delete-btn"
                    onClick={() =>
                        onDelete(task._id)
                    }
                >
                    Delete
                </button>

            </div>

        </div>
    );
};

export default TaskCard;