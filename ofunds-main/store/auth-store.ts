import { create } from "zustand";
import Cookies from "js-cookie";

export interface AuthState {
  access_token: string | null;
  chat_token: string | null;
  isAuthenticated: boolean;
  loginMethod: "email" | "pin" | null;
  expiresAt: number | null;
  setTokens: (
    access_token: string,
    chat_token: string,
    expiresAt?: number,
  ) => void;
  setAuthenticated: (
    authenticated: boolean,
    loginMethod?: "email" | "pin",
  ) => void;
  logout: () => void;
  loadTokensFromCookies: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  access_token: null,
  chat_token: null,
  isAuthenticated: false,
  loginMethod: null,
  expiresAt: null,

  setTokens: (access_token: string, chat_token: string, expiresAt?: number) => {
    const expiration = expiresAt || Date.now() + 24 * 60 * 60 * 1000; // 24 hours default

    // Set cookies with appropriate expiration
    const cookieOptions = {
      expires: new Date(expiration),
      secure: true,
      sameSite: "lax" as const,
    };

    Cookies.set("jetsend:access_token", access_token, cookieOptions);
    Cookies.set("jetsend:chat_token", chat_token, cookieOptions);

    set({
      access_token,
      chat_token,
      isAuthenticated: true,
      expiresAt: expiration,
    });
  },

  setAuthenticated: (authenticated: boolean, loginMethod?: "email" | "pin") => {
    set({
      isAuthenticated: authenticated,
      ...(loginMethod && { loginMethod }),
    });
  },

  logout: () => {
    Cookies.remove("jetsend:access_token");
    Cookies.remove("jetsend:chat_token");
    Cookies.remove("jetsend:user");

    set({
      access_token: null,
      chat_token: null,
      isAuthenticated: false,
      loginMethod: null,
      expiresAt: null,
    });
  },

  loadTokensFromCookies: () => {
    const access_token = Cookies.get("jetsend:access_token");
    const chat_token = Cookies.get("jetsend:chat_token");

    if (access_token && chat_token) {
      set({
        access_token,
        chat_token,
        isAuthenticated: true,
      });
    }
  },
}));
