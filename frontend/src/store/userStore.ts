import { create } from "zustand";
import * as userService from "../services/userService";
import type { ChangeRoleRequest, UserResponse } from "../types/user";

interface UserState {
  users: UserResponse[];
  selectedUser: UserResponse | null;
  isLoading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  fetchUser: (id: number) => Promise<void>;
  changeUserRole: (id: number, data: ChangeRoleRequest) => Promise<UserResponse>;
  clearError: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  selectedUser: null,
  isLoading: false,
  error: null,

  fetchUsers: async () => {
    set({ isLoading: true, error: null });

    try {
      const users = await userService.getUsers();
      set({ users, isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to load users.";
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  fetchUser: async (id) => {
    set({ isLoading: true, error: null });

    try {
      const selectedUser = await userService.getUser(id);
      set({ selectedUser, isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to load user.";
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  changeUserRole: async (id, data) => {
    set({ isLoading: true, error: null });

    try {
      const user = await userService.changeUserRole(id, data);

      set((state) => ({
        users: state.users.map((item) => item.id === id ? user : item),
        selectedUser: user,
        isLoading: false
      }));

      return user;
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to change user role.";
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  clearError: () => set({ error: null })
}));