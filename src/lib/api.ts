export const API_BASE = "http://localhost:5001";

export const getToken = (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
};

export const getStoredRole = (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("role");
};

export const getStoredName = (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("name");
};

export const authHeaders = (): Record<string, string> => {
    const token = getToken();
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
};

export const formatTime = (value?: string | null): string => {
    if (!value) return "--:--:--";
    try {
        return new Date(value).toLocaleTimeString([], { hour12: false });
    } catch {
        return "--:--:--";
    }
};

export const formatDate = (value?: string | null): string => {
    if (!value) return "";
    try {
        return new Date(value).toLocaleDateString();
    } catch {
        return value;
    }
};

export const clearAuth = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
};
