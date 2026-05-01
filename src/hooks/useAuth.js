import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser, logout } from "../redux/feature/authSlice";

export const useAuth = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                let res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
                    method: "GET",
                    credentials: "include",
                });

                if (res.status === 401) {
                    // try refresh
                    const refreshRes = await fetch(`${import.meta.env.VITE_API_URL}/auth/refresh-token`, {
                        method: "POST",
                        credentials: "include",
                    });

                    if (!refreshRes.ok) throw new Error("Refresh token failed");

                    const { data } = await refreshRes.json();

                    // Retry /me with new token
                    res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
                        method: "GET",
                        credentials: "include",
                        headers: { Authorization: `Bearer ${data.accessToken}` },
                    });

                    if (!res.ok) throw new Error("Failed after refresh");
                }

                if (!res.ok) throw new Error("Auth failed");

                const { data } = await res.json();

                if (!data || !data.userId) throw new Error("Invalid user data");

                dispatch(setUser({
                    token: data.accessToken,
                    refreshToken: data.refreshToken,
                    user: data
                }));
            } catch (err) {
                console.error("Auth check failed:", err);
                dispatch(logout());
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [dispatch]);

    return { loading };
};