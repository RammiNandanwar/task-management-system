const TaskCard = ({ task, onEdit, onDelete }) => {
    return (
        <div>
            <h3>{task.title}</h3>

            <p>
                Description: {task.description || "No description"}
            </p>

            <p>
                Status: {task.status}
            </p>

            <p>
                Priority: {task.priority}
            </p>

            {task.dueDate && (
                <p>
                    Due Date:{" "}
                    {new Date(task.dueDate).toLocaleDateString()}
                </p>
            )}

            <button onClick={() => onEdit(task)}>
                Edit
            </button>

            <button onClick={() => onDelete(task._id)}>
                Delete
            </button>
        </div>
    );
};

export default TaskCard;