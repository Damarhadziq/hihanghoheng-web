import { createAuthClient } from "better-auth/react";
import { API_URL } from "./httpClient";

export const authClient = createAuthClient({ baseURL: API_URL || globalThis.location.origin });
export const { signIn, signOut, signUp, useSession } = authClient;
