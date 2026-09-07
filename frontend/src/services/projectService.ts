import api from "../lib/api";
import type { Project, ProjectRequest } from "../types/project";

export const getProjects = async (): Promise<Project[]> => {
  const response = await api.get<Project[]>("/projects");
  return response.data;
};

export const getProject = async (id: number): Promise<Project> => {
  const response = await api.get<Project>(`/projects/${id}`);
  return response.data;
};

export const createProject = async (data: ProjectRequest): Promise<Project> => {
  const response = await api.post<Project>("/projects", data);
  return response.data;
};

export const updateProject = async (id: number, data: ProjectRequest): Promise<Project> => {
  const response = await api.put<Project>(`/projects/${id}`, data);
  return response.data;
};

export const deleteProject = async (id: number): Promise<void> => {
  await api.delete(`/projects/${id}`);
};