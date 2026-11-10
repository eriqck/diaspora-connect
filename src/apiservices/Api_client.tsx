import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// Attach token to every request
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        // Fallback: host strips Authorization, index.php copies this back
        config.headers["X-Auth-Token"] = token;
    }
    return config;
});

const AUTH_ENDPOINTS = ["/sign-in", "/admin-sign-in", "/sign-up", "/sign-out"];

// Auto-redirect on 401
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const requestUrl: string = error.config?.url ?? "";
        const isAuthenticationRequest = AUTH_ENDPOINTS.some((endpoint) =>
            requestUrl.includes(endpoint)
        );

        if (error.response?.status === 401 && !isAuthenticationRequest) {
            const isAdminArea = window.location.pathname.startsWith("/admin");
            const loginPath = isAdminArea ? "/admin/login" : "/login";

            localStorage.removeItem("authUser");
            localStorage.removeItem("authToken");

            // Avoid a redirect loop if we're already on the login page
            if (window.location.pathname !== loginPath) {
                window.location.href = loginPath;
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;