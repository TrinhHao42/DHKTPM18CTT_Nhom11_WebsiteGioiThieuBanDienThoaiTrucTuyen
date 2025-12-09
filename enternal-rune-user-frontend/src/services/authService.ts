import { User } from "@/types/User";

const API = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080";
export type RegisterPayload = {
    name: string;
    email: string;
    password: string;
};

export type LoginPayload = {
    email: string;
    password: string;

};
export type LoginResp = {
    token: string;
    user?: User;
    roles: string[];
};

type RequestOptions = RequestInit & { headers?: Record<string, string> };

async function fetchApi(endpoint: string, options: RequestOptions = {}) {
    const defaultHeaders = {
        "Content-Type": "application/json",
    };

    const res = await fetch(`${API}${endpoint}`, {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    });

    if (!res.ok) {
        let errorMessage = `API call failed on ${endpoint}`;
        try {
            const errorBody = await res.json();
            errorMessage = errorBody?.message || errorBody?.error || `Error ${res.status}`;
        } catch {
            errorMessage = (await res.text()) || `HTTP error ${res.status}`;
        }
        throw new Error(errorMessage);
    }

    if (res.status === 204) return null;

    return res.json();
}
// --- Auth Endpoints ---
export async function apiRegister(payload: RegisterPayload) {
    return fetchApi("/account/register", {
        method: "POST",
        body: JSON.stringify(payload),
    });

}
export async function apiLogin(payload: LoginPayload): Promise<LoginResp> {
    const response = await fetchApi("/account/login", {
        method: "POST",
        body: JSON.stringify(payload),
    });
    return response as LoginResp;
}

export async function apiGetMe(token: string) {
    return fetchApi("/account/me", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

// --- Forgot Password Endpoints ---
export async function apiSendResetCode(email: string) {
    return fetchApi("/api/auth/forgot-password/send-code", {
        method: "POST",
        body: JSON.stringify({ email }),
    });
}

export async function apiVerifyResetCode(email: string, code: string) {
    return fetchApi("/api/auth/forgot-password/verify-code", {
        method: "POST",
        body: JSON.stringify({ email, code }),
    });
}

export async function apiResetPassword(email: string, code: string, newPassword: string) {
    return fetchApi("/api/auth/forgot-password/reset", {
        method: "POST",
        body: JSON.stringify({ email, code, newPassword }),
    });
}

// --- Google OAuth Exchange ---
export async function apiExchangeGoogleCode(code: string): Promise<LoginResp> {
    const redirectUri = "http://localhost:3000/oauthlogon";
    const response = await fetchApi("/api/oauth/exchange-token", {
        method: "POST",
        body: JSON.stringify({ code, redirectUri }),
    });
    return response as LoginResp;
}


export async function apiActivateAccount(email: string, activateId: string) {
    return fetchApi(`/account/activate?email=${email}&activateId=${activateId}`, {
        method: "GET",
    });
}

// --- User Profile ---
export interface UserProfile {
    name: string;
    email: string;
    activate: boolean;
    addresses: Array<{
        addressId: number;
        streetName: string;
        wardName: string;
        cityName: string;
        countryName: string;
    }>;
    totalOrder: number;
    totalPrice: number;
}

export async function apiGetUserProfile(userId: number, token: string): Promise<UserProfile> {
    const response = await fetchApi(`/api/users/${userId}/profile`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response as UserProfile;
}