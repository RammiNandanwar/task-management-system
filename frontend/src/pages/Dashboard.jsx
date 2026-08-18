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

    const [stats, setStats] = useState({
    totalTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0
});

    const [editingTask, setEditingTask] = useState(null);
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    // ================================
    // FETCH TASKS
    // ================================

    const fetchTasks = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await API.get("/tasks");

            setTasks(response.data.tasks || []);
        } catch (error) {
            setError(
                error.response?.data?.error ||
                "Unable to load tasks. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
    try {
        const response = await API.get("/tasks/stats");

        setStats(response.data);
    } catch (error) {
        console.error(
            "Failed to fetch task statistics:",
            error
        );
    }
};

    useEffect(() => {
        fetchTasks();
        fetchStats();
    }, []);

    // ================================
    // CREATE TASK
    // ================================

    const handleTaskCreated = (newTask) => {
    setTasks((previousTasks) => [
        newTask,
        ...previousTasks
    ]);

    fetchStats();
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
                "Unable to update task. Please try again."
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
                "Unable to delete task. Please try again."
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
    // DASHBOARD
    // ================================

    return (
        <div className="dashboard">

            {/* HEADER */}

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

            {/* STATISTICS */}

            <section className="stats-grid">

                <div className="stat-card">
                    <span>Total Tasks</span>

                    <strong>
                        {stats.totalTasks}
                    </strong>
                </div>

                <div className="stat-card">
                    <span>Pending</span>

                    <strong>
                        {stats.pendingTasks}
                    </strong>
                </div>

                <div className="stat-card">
                    <span>In Progress</span>

                    <strong>
                        {stats.inProgressTasks}
                    </strong>
                </div>

                <div className="stat-card">
                    <span>Completed</span>

                    <strong>
                        {stats.completedTasks}
                    </strong>
                </div>

            </section>

            {/* CREATE TASK */}

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

            {/* TASKS */}

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

                    {/* FILTER BUTTONS */}

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
                                setFilter("in-progress")
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
                                setFilter("completed")
                            }
                        >
                            Completed
                        </button>

                    </div>
                </div>

                {/* ============================
                    LOADING STATE
                ============================ */}

                {loading && (
                    <div className="state-card">
                        <div className="loading-spinner"></div>

                        <h3>
                            Loading your tasks
                        </h3>

                        <p>
                            Please wait while we
                            fetch your tasks.
                        </p>
                    </div>
                )}

                {/* ============================
                    ERROR STATE
                ============================ */}

                {!loading && error && (
                    <div className="state-card error-state">

                        <div className="state-icon">
                            !
                        </div>

                        <h3>
                            Something went wrong
                        </h3>

                        <p>
                            {error}
                        </p>

                        <button
                            className="retry-btn"
                            onClick={fetchTasks}
                        >
                            Try Again
                        </button>

                    </div>
                )}

                {/* ============================
                    EMPTY STATE
                ============================ */}

                {!loading &&
                    !error &&
                    tasks.length === 0 && (
                        <div className="state-card">

                            <div className="state-icon">
                                +
                            </div>

                            <h3>
                                No tasks yet
                            </h3>

                            <p>
                                You don't have any tasks.
                                Create your first task
                                above to get started.
                            </p>

                        </div>
                    )}

                {/* ============================
                    NO SEARCH RESULTS
                ============================ */}

                {!loading &&
                    !error &&
                    tasks.length > 0 &&
                    filteredTasks.length === 0 && (
                        <div className="state-card">

                            <div className="state-icon">
                                ?
                            </div>

                            <h3>
                                No matching tasks
                            </h3>

                            <p>
                                We couldn't find any
                                tasks matching your
                                search or selected
                                filter.
                            </p>

                            <button
                                className="retry-btn"
                                onClick={() => {
                                    setSearchTerm("");
                                    setFilter("all");
                                }}
                            >
                                Clear Search & Filter
                            </button>

                        </div>
                    )}

                {/* ============================
                    TASK GRID
                ============================ */}

                {!loading &&
                    !error &&
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