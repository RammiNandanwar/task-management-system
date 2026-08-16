import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import API from "../services/api";
import CreateTask from "../components/CreateTask";

const Dashboard = () => {
    const { user, logout } = useAuth();

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [editingTask, setEditingTask] = useState(null);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await API.get("/tasks");

                setTasks(response.data.tasks);
            } catch (error) {
                setError(
                    error.response?.data?.error ||
                    "Failed to load tasks"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    // Update task
    const handleUpdateTask = async (taskId) => {
        try {
            const response = await API.patch(`/tasks/${taskId}`, {
                status: "completed"
            });

            setTasks((previousTasks) =>
                previousTasks.map((task) =>
                    task._id === taskId
                        ? response.data.task
                        : task
                )
            );
        } catch (error) {
            setError(
                error.response?.data?.error ||
                "Failed to update task"
            );
        }
    };

    // Delete task
    const handleDeleteTask = async (taskId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this task?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await API.delete(`/tasks/${taskId}`);

            setTasks((previousTasks) =>
                previousTasks.filter(
                    (task) => task._id !== taskId
                )
            );
        } catch (error) {
            setError(
                error.response?.data?.error ||
                "Failed to delete task"
            );
        }
    };

    return (
        <div>
            <h1>Dashboard</h1>

            <h2>Welcome, {user?.name}</h2>

            <p>Email: {user?.email}</p>

            <button onClick={logout}>
                Logout
            </button>

            <hr />

            <CreateTask
                onTaskCreated={(newTask) => {
                    setTasks((previousTasks) => [
                        newTask,
                        ...previousTasks
                    ]);
                }}
            />

            <hr />

            <h2>My Tasks</h2>

            {loading && <p>Loading tasks...</p>}

            {error && <p>{error}</p>}

            {!loading && !error && tasks.length === 0 && (
                <p>No tasks found.</p>
            )}

            {!loading && tasks.length > 0 && (
                <div>
                    {tasks.map((task) => (
                        <div key={task._id}>
                            {editingTask === task._id ? (
                                <div>
                                    <h3>Edit Task</h3>

                                    <p>
                                        <strong>
                                            {task.title}
                                        </strong>
                                    </p>

                                    <button
                                        onClick={() => {
                                            handleUpdateTask(task._id);
                                            setEditingTask(null);
                                        }}
                                    >
                                        Mark as Completed
                                    </button>

                                    <button
                                        onClick={() =>
                                            setEditingTask(null)
                                        }
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <h3>{task.title}</h3>

                                    <p>
                                        Description:{" "}
                                        {task.description}
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
                                            {new Date(
                                                task.dueDate
                                            ).toLocaleDateString()}
                                        </p>
                                    )}

                                    <button
                                        onClick={() =>
                                            setEditingTask(task._id)
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDeleteTask(task._id)
                                        }
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}

                            <hr />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;