import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useUserStore = create((set, get) => ({
  user: null,
  loading: null,
  checkingAuth: true,

  signup: async ({ name, email, password, confirmPassword }) => {
    set({ loading: true });

    if (password !== confirmPassword) {
      toast.error("Password and Confirm Password do not match");
      set({ loading: false });
      return;
    }

    try {
      const response = await axios.post("/auth/signup", {
        name,
        email,
        password,
      });
      set({ user: response.data, loading: false });
      toast.success("Account created successfully");
    } catch (error) {
      toast.error(error.response.data.message || "An error occurred");
    } finally {
      set({ loading: false });
    }
  },

  login: async ({ email, password }) => {
    set({ loading: true });
    try {
      const response = await axios.post("/auth/login", { email, password });
      set({ user: response.data, loading: false });
      console.log(response.data);
      toast.success("Logged in successfully");
    } catch (error) {
      toast.error(error.response.data.message || "An error occurred");
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      await axios.post("/auth/logout");
      set({ user: null });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred during logout"
      );
    }
  },

  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const response = await axios.get("/auth/profile");
      set({ user: response.data, checkingAuth: false });
    } catch (error) {
      set({ user: null, checkingAuth: false });
    }
  },

  refreshToken: async () => {
    // Prevent multiple simultaneous refresh attempts
    if (get().checkingAuth) return;

    set({ checkingAuth: true });
    try {
      const response = await axios.post("/auth/refresh-token");
      set({ checkingAuth: false });
      return response.data;
    } catch (error) {
      set({ user: null, checkingAuth: false });
      throw error;
    }
  },
}));

let refreshPromise = null;
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // If a refresh is already in progress, wait for it to complete
        if (refreshPromise) {
          await refreshPromise;
          return axios(originalRequest);
        }

        // Start a new refresh process
        refreshPromise = useUserStore.getState().refreshToken();
        await refreshPromise;
        refreshPromise = null;

        return axios(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login or handle as needed
        useUserStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
