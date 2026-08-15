import { createContext, useContext, useEffect, useState } from "react";
import API from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is already logged in
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            API.get("/auth/me", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then((response) => {
                    setUser(response.data.user);
                })
                .catch(() => {
                    localStorage.removeItem("token");
                    setUser(null);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    // Login
    const login = async (email, password) => {
        const response = await API.post("/auth/login", {
            email,
            password
        });

        const { token, user } = response.data;

        localStorage.setItem("token", token);
        setUser(user);

        return response.data;
    };

    // Logout
    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    const value = {
        user,
        loading,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};