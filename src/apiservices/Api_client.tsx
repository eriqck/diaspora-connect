import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,

});

// Attach token to every request
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auto-redirect on 401
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const requestUrl = error.config?.url ?? "";
        const isAuthenticationRequest =
            requestUrl.includes("/sign-in") ||
            requestUrl.includes("/admin-sign-in") ||
            requestUrl.includes("/sign-up") ||
            requestUrl.includes("/sign-out");

        if (error.response?.status === 401 && !isAuthenticationRequest) {
            localStorage.removeItem("authUser");
            localStorage.removeItem("authToken");
            window.location.href = "/login"; // redirect to login
        }
        return Promise.reject(error);
    }
);

export default apiClient;
