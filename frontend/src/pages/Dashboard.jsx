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
    const [searchTerm, setSearchTerm] = useState("");

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

    const handleUpdateTask = async (
        taskId,
        updatedData
    ) => {
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
    // FILTER + SEARCH
    // ================================

    const filteredTasks = tasks.filter((task) => {
        const matchesFilter =
            filter === "all" ||
            task.status === filter;

        const search = searchTerm
            .toLowerCase()
            .trim();

        const matchesSearch =
            task.title
                ?.toLowerCase()
                .includes(search) ||
            task.description
                ?.toLowerCase()
                .includes(search);

        return matchesFilter && matchesSearch;
    });

    // ================================
    // TASK COUNTS
    // ================================

    const pendingCount = tasks.filter(
        (task) => task.status === "pending"
    ).length;

    const inProgressCount = tasks.filter(
        (task) => task.status === "in-progress"
    ).length;

    const completedCount = tasks.filter(
        (task) => task.status === "completed"
    ).length;

    return (
        <div className="dashboard">

            {/* ============================
                HEADER
            ============================ */}

            <header className="dashboard-header">
                <div>
                    <h1>Task Management</h1>
                    <p>
                        Organize and manage your tasks
                    </p>
                </div>

                <div className="user-section">
                    <div>
                        <strong>
                            {user?.name}
                        </strong>

                        <span>
                            {user?.email}
                        </span>
                    </div>

                    <button
                        className="logout-btn"
                        onClick={logout}
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* ============================
                STATISTICS
            ============================ */}

            <section className="stats-grid">

                <div className="stat-card">
                    <span>Total Tasks</span>
                    <strong>{tasks.length}</strong>
                </div>

                <div className="stat-card">
                    <span>Pending</span>
                    <strong>{pendingCount}</strong>
                </div>

                <div className="stat-card">
                    <span>In Progress</span>
                    <strong>{inProgressCount}</strong>
                </div>

                <div className="stat-card">
                    <span>Completed</span>
                    <strong>{completedCount}</strong>
                </div>

            </section>

            {/* ============================
                CREATE TASK
            ============================ */}

            <section className="dashboard-section">
                <div className="section-header">
                    <div>
                        <h2>Create New Task</h2>

                        <p>
                            Add a new task to your workspace
                        </p>
                    </div>
                </div>

                <div className="create-task-card">
                    <CreateTask
                        onTaskCreated={
                            handleTaskCreated
                        }
                    />
                </div>
            </section>

            {/* ============================
                TASKS
            ============================ */}

            <section className="dashboard-section">

                <div className="section-header">
                    <div>
                        <h2>My Tasks</h2>

                        <p>
                            View and manage your tasks
                        </p>
                    </div>
                </div>

                {/* SEARCH */}

                <div className="task-controls">

                    <input
                        className="search-input"
                        type="text"
                        placeholder="Search tasks..."
                        value={searchTerm}
                        onChange={(e) =>
                            setSearchTerm(
                                e.target.value
                            )
                        }
                    />

                    {/* FILTER */}

                    <div className="filter-buttons">

                        <button
                            className={
                                filter === "all"
                                    ? "filter-btn active"
                                    : "filter-btn"
                            }
                            onClick={() =>
                                setFilter("all")
                            }
                        >
                            All
                        </button>

                        <button
                            className={
                                filter === "pending"
                                    ? "filter-btn active"
                                    : "filter-btn"
                            }
                            onClick={() =>
                                setFilter("pending")
                            }
                        >
                            Pending
                        </button>

                        <button
                            className={
                                filter === "in-progress"
                                    ? "filter-btn active"
                                    : "filter-btn"
                            }
                            onClick={() =>
                                setFilter(
                                    "in-progress"
                                )
                            }
                        >
                            In Progress
                        </button>

                        <button
                            className={
                                filter === "completed"
                                    ? "filter-btn active"
                                    : "filter-btn"
                            }
                            onClick={() =>
                                setFilter(
                                    "completed"
                                )
                            }
                        >
                            Completed
                        </button>

                    </div>
                </div>

                {/* LOADING */}

                {loading && (
                    <div className="message-card">
                        Loading tasks...
                    </div>
                )}

                {/* ERROR */}

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {/* NO TASKS */}

                {!loading &&
                    !error &&
                    tasks.length === 0 && (
                        <div className="message-card">
                            <h3>
                                No tasks yet
                            </h3>

                            <p>
                                Create your first task
                                above.
                            </p>
                        </div>
                    )}

                {/* NO FILTER RESULTS */}

                {!loading &&
                    tasks.length > 0 &&
                    filteredTasks.length === 0 && (
                        <div className="message-card">
                            <h3>
                                No matching tasks
                            </h3>

                            <p>
                                Try changing your
                                search or filter.
                            </p>
                        </div>
                    )}

                {/* TASK GRID */}

                {!loading &&
                    filteredTasks.length > 0 && (
                        <div className="task-grid">

                            {filteredTasks.map(
                                (task) => (
                                    <div
                                        key={task._id}
                                        className="task-wrapper"
                                    >
                                        {editingTask?._id ===
                                        task._id ? (
                                            <EditTask
                                                task={task}
                                                onUpdate={
                                                    handleUpdateTask
                                                }
                                                onCancel={() =>
                                                    setEditingTask(
                                                        null
                                                    )
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
                                    </div>
                                )
                            )}

                        </div>
                    )}

            </section>
        </div>
    );
};

export default Dashboard;