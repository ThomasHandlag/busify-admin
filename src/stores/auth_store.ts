import type { NavigateFunction } from "react-router";
import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { login } from "../app/api/auth";

export interface LoggedInUser {
  role: string;
  userId: number;
  email: string;
}

export interface AuthState {
  loggedInUser?: LoggedInUser;
  accessToken: string;
  refreshToken: string;
  loading: boolean;
  error: string | null;
  login: ({
    username,
    password,
    navigate,
  }: {
    username: string;
    password: string;
    navigate: NavigateFunction;
  }) => Promise<void>;
  logOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => {
        return {
          accessToken: "",
          refreshToken: "",
          loggedInUser: undefined,
          loading: false,
          error: null,
          login: async ({ username, password, navigate }) => {
            try {
              set(
                {
                  loggedInUser: undefined,
                  accessToken: "",
                  refreshToken: "",
                },
                false,
                { type: "@AUTH/LOGIN/LOADING" }
              );

              const response = await login({
                username,
                password,
              });

              set(
                {
                  accessToken: response?.accessToken,
                  refreshToken: response?.refreshToken,
                  loggedInUser: response?.loggedInUser as LoggedInUser,
                  loading: false,
                  error: null,
                },
                false,
                { type: "@AUTH/LOGIN/SUCCESS" }
              );
              // check role to navigate
              if (response?.loggedInUser.role === "CUSTOMER_SERVICE") {
                navigate("/customer-service");
              }
              if (response?.loggedInUser.role === "ADMIN") {
                navigate("/admin");
              }
            } catch (error) {
              console.error("Login error:", error);
              set(
                {
                  error:
                    error instanceof Error ? error.message : "Login failed",
                  accessToken: "",
                  refreshToken: "",
                  loggedInUser: undefined,
                },
                false,
                {
                  type: "@AUTH/LOGIN/ERROR",
                }
              );
            }
          },

          logOut: async () => {
            set({
              accessToken: "",
              refreshToken: "",
              loggedInUser: undefined,
            });
          },
        };
      },
      {
        name: "auth-storage",
      }
    )
  )
);
