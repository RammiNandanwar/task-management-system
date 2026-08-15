import { useEffect, useState } from "react";
import API from "../services/api";
import { AuthContext } from "./AuthContext.js";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(() => {
        return !!localStorage.getItem("token");
    });

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            return;
        }

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
    }, []);

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