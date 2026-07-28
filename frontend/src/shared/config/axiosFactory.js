/**
 * Shared axios factory for all API instances.
 *
 * Automatically attaches the JWT token as an Authorization: Bearer header
 * on every request. This is required in production where the frontend
 * (Vercel) and backend (Render) are on different domains — browsers
 * block cross-domain cookies (especially Safari), so we use Bearer tokens.
 */
import axios from "axios";
import Cookies from "js-cookie";

export function createApiInstance(baseURL) {
    const instance = axios.create({
        baseURL,
        withCredentials: true,  // still needed for same-domain (localhost)
    });

    instance.interceptors.request.use((config) => {
        const token = Cookies.get("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    return instance;
}
