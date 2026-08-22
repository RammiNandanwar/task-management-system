import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

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

                {/* =====================================
                    DEFAULT ROUTE
                ===================================== */}

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

                {/* =====================================
                    PUBLIC ROUTES
                ===================================== */}

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                {/* Public Job Board */}

                <Route
                    path="/jobs"
                    element={<JobBoard />}
                />

                <Route
                    path="/jobs/:id"
                    element={<JobDetails />}
                />

                {/* =====================================
                    PROTECTED ROUTES
                ===================================== */}

                <Route element={<ProtectedRoute />}>

                    {/* Temporary Dashboard */}

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    {/* Apply for Job */}

                    <Route
                        path="/jobs/:id/apply"
                        element={<ApplyJob />}
                    />

                    {/* Recruiter Candidate Ranking */}

                    <Route
                        path="/recruiter/jobs/:jobId/candidates"
                        element={<CandidateRanking />}
                    />

                </Route>

                {/* =====================================
                    INVALID ROUTE
                ===================================== */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;