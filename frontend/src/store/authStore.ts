import { create } from "zustand";
import { persist } from "zustand/middleware";

import * as authService from "../services/authService";

import type {
  LoginRequest,
  RegisterRequest,
} from "../types/auth";
import { UserResponse } from "@/types/user";

interface AuthState {
  authUser: UserResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      authUser: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (data) => {
        set({ isLoading: true });

        try {
          const response = await authService.login(data);

          localStorage.setItem("token", response.token);

          set({
            authUser: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          const message =
            error.response?.data?.message || "Login failed. Please check your credentials.";
          set({isLoading: false,});
          throw new Error(message);
        }
      },

      register: async (data) => {
        set({ isLoading: true });

        try {
          const response = await authService.register(data);

          localStorage.setItem("token", response.token);

          set({
            authUser: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          const message =
            error.response?.data?.message || "Registration failed. Please try again.";

          set({
            isLoading: false,
          });

          throw new Error(message);
        }
      },

      logout: () => {
        localStorage.removeItem("token");

        set({
          authUser: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },
    }),
    {
      name: "teampulse-auth",
    }
  )
);
