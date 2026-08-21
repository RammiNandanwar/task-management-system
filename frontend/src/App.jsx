import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import JobBoard from "./pages/JobBoard";
import JobDetails from "./pages/JobDetails";
import ApplyJob from "./pages/ApplyJob";
import CandidateRanking from "./pages/CandidateRanking";

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
                <Route path="/jobs" element={<JobBoard />}/>
                <Route path="/jobs/:id" element={<JobDetails />}/>
                <Route path="/jobs/:id/apply" element={<ApplyJob />}/>
                <Route path="/recruiter/jobs/:jobId/candidates" element={<CandidateRanking />}/>
                {/* Protected routes */}
                <Route element={<ProtectedRoute />}/>
                <Route path="/dashboard" element={<Dashboard />} />

            </Routes>
        </BrowserRouter>
    );
}

export default App;