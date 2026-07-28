import Cookies from "js-cookie";
import { API_BASE_URL } from "@/shared/config/apiConfig";
import { createApiInstance } from "@/shared/config/axiosFactory";

const authApiInstance = createApiInstance(`${API_BASE_URL}/api/auth`);

export async function register({email,contact,password,fullname,isSeller}) {
    const response = await authApiInstance.post("/register",{
        email, contact, password, fullname, isSeller
    });
    return response.data;
}

export async function login({email,password}) {
    const response = await authApiInstance.post("/login",{ email, password });

    // Store token returned by backend so Bearer header works for all future requests
    if (response.data?.token) {
        Cookies.set("token", response.data.token, {
            expires: 7,
            sameSite: "Lax",
            secure: window.location.protocol === "https:"
        });
    }

    return response.data;
}

export async function getMe() {
    const response = await authApiInstance.get("/me");
    return response.data;
}