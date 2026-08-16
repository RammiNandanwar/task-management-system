import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Default page */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* Public routes */}
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />

                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                </Route>

            </Routes>
        </BrowserRouter>
    );
}

export default App;