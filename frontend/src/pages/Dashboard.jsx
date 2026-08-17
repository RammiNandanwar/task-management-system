import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import API from "../services/api";
import CreateTask from "../components/CreateTask";
import TaskCard from "../components/TaskCard";
import EditTask from "../components/EditTask";

const Dashboard = () => {
    const { user, logout } = useAuth();

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [editingTask, setEditingTask] = useState(null);
    const [filter, setFilter] = useState("all");

    // ================================
    // FETCH TASKS
    // ================================

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

    // ================================
    // CREATE TASK
    // ================================

    const handleTaskCreated = (newTask) => {
        setTasks((previousTasks) => [
            newTask,
            ...previousTasks
        ]);
    };

    // ================================
    // OPEN EDIT FORM
    // ================================

    const handleEditTask = (task) => {
        setEditingTask(task);
    };

    // ================================
    // UPDATE TASK
    // ================================

    const handleUpdateTask = async (taskId, updatedData) => {
        try {
            setError("");

            const response = await API.patch(
                `/tasks/${taskId}`,
                updatedData
            );

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

    // ================================
    // DELETE TASK
    // ================================

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

    // ================================
    // FILTER TASKS
    // ================================

    const filteredTasks = tasks.filter((task) => {
        if (filter === "all") {
            return true;
        }

        return task.status === filter;
    });

    // ================================
    // DASHBOARD UI
    // ================================

    return (
        <div>
            <h1>Dashboard</h1>

            <h2>
                Welcome, {user?.name}
            </h2>

            <p>
                Email: {user?.email}
            </p>

            <button onClick={logout}>
                Logout
            </button>

            <hr />

            {/* ============================
                CREATE TASK
            ============================ */}

            <CreateTask
                onTaskCreated={handleTaskCreated}
            />

            <hr />

            {/* ============================
                TASK LIST
            ============================ */}

            <h2>My Tasks</h2>

            {/* ============================
                FILTER BUTTONS
            ============================ */}

            <div>
                <button
                    onClick={() => setFilter("all")}
                >
                    All
                </button>

                <button
                    onClick={() => setFilter("pending")}
                >
                    Pending
                </button>

                <button
                    onClick={() => setFilter("in-progress")}
                >
                    In Progress
                </button>

                <button
                    onClick={() => setFilter("completed")}
                >
                    Completed
                </button>
            </div>

            <br />

            {/* Loading */}
            {loading && (
                <p>
                    Loading tasks...
                </p>
            )}

            {/* Error */}
            {error && (
                <p>
                    {error}
                </p>
            )}

            {/* No tasks at all */}
            {!loading &&
                !error &&
                tasks.length === 0 && (
                    <p>
                        No tasks found.
                    </p>
                )}

            {/* No tasks for selected filter */}
            {!loading &&
                tasks.length > 0 &&
                filteredTasks.length === 0 && (
                    <p>
                        No {filter} tasks found.
                    </p>
                )}

            {/* Filtered tasks */}
            {!loading &&
                filteredTasks.length > 0 && (
                    <div>
                        {filteredTasks.map((task) => (
                            <div key={task._id}>
                                {editingTask?._id === task._id ? (
                                    <EditTask
                                        task={task}
                                        onUpdate={
                                            handleUpdateTask
                                        }
                                        onCancel={() =>
                                            setEditingTask(null)
                                        }
                                    />
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