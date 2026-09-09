import api from "../lib/api";
import type { ChangeRoleRequest, UserResponse } from "../types/user";

export const getUsers = async (): Promise<UserResponse[]> => {
  const response = await api.get<UserResponse[]>("/users");
  return response.data;
};

export const getUser = async (id: number): Promise<UserResponse> => {
  const response = await api.get<UserResponse>(`/users/${id}`);
  return response.data;
};

export const changeUserRole = async (id: number, data: ChangeRoleRequest): Promise<UserResponse> => {
  const response = await api.patch<UserResponse>(`/users/${id}/role`, data);
  return response.data;
};

