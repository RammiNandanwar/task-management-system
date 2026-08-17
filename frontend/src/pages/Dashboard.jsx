import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import API from "../services/api";
import CreateTask from "../components/CreateTask";
import TaskCard from "../components/TaskCard";

const Dashboard = () => {
    const { user, logout } = useAuth();

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [editingTask, setEditingTask] = useState(null);

    // Fetch tasks
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                setError("");

                const response = await API.get("/tasks");

                setTasks(response.data.tasks || []);
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

    // Handle edit button
    const handleEditTask = (task) => {
        setEditingTask(task._id);
    };

    // Update task
    const handleUpdateTask = async (taskId) => {
        try {
            setError("");

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

            setEditingTask(null);
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
            setError("");

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

    // Add newly created task to the list
    const handleTaskCreated = (newTask) => {
        setTasks((previousTasks) => [
            newTask,
            ...previousTasks
        ]);
    };

    return (
        <div>
            <h1>Dashboard</h1>

            <h2>Welcome, {user?.name}</h2>

            <p>
                Email: {user?.email}
            </p>

            <button onClick={logout}>
                Logout
            </button>

            <hr />

            {/* Create Task */}
            <CreateTask
                onTaskCreated={handleTaskCreated}
            />

            <hr />

            <h2>My Tasks</h2>

            {/* Loading */}
            {loading && (
                <p>Loading tasks...</p>
            )}

            {/* Error */}
            {error && (
                <p>{error}</p>
            )}

            {/* No tasks */}
            {!loading &&
                !error &&
                tasks.length === 0 && (
                    <p>No tasks found.</p>
                )}

            {/* Tasks */}
            {!loading &&
                tasks.length > 0 && (
                    <div>
                        {tasks.map((task) => (
                            <div key={task._id}>
                                {editingTask === task._id ? (
                                    <div>
                                        <h3>
                                            Edit Task
                                        </h3>

                                        <p>
                                            {task.title}
                                        </p>

                                        <button
                                            onClick={() =>
                                                handleUpdateTask(
                                                    task._id
                                                )
                                            }
                                        >
                                            Mark as Completed
                                        </button>

                                        <button
                                            onClick={() =>
                                                setEditingTask(
                                                    null
                                                )
                                            }
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <TaskCard
                                        task={task}
                                        onEdit={
                                            handleEditTask
                                        }
                                        onDelete={
                                            handleDeleteTask
                                        }
                                    />
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