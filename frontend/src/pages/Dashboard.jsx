import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import API from "../services/api";
import CreateTask from "../components/CreateTask";

const Dashboard = () => {
    const { user, logout } = useAuth();

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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
                            <h3>{task.title}</h3>

                            <p>
                                Description: {task.description}
                            </p>

                            <p>
                                Status: {task.status}
                            </p>

                            <p>
                                Priority: {task.priority}
                            </p>

                            <hr />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;