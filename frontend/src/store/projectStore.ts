import { create } from "zustand";
import * as projectService from "../services/projectService";
import type { Project, ProjectRequest } from "../types/project";

interface ProjectState {
    
  projects: Project[];
  selectedProject: Project | null;
  isLoading: boolean;
  error: string | null;

  fetchProjects: () => Promise<void>;
  fetchProject: (id: number) => Promise<void>;
  createProject: (data: ProjectRequest) => Promise<Project>;
  updateProject: (id: number, data: ProjectRequest) => Promise<Project>;
  deleteProject: (id: number) => Promise<void>;
  clearError: () => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  selectedProject: null,
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    set({ isLoading: true, error: null });

    try {
      const projects = await projectService.getProjects();
      set({ projects, isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to load projects.";
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  fetchProject: async (id) => {
    set({ isLoading: true, error: null });

    try {
      const selectedProject = await projectService.getProject(id);
      set({ selectedProject, isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to load project.";
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  createProject: async (data) => {
    set({ isLoading: true, error: null });

    try {
      const project = await projectService.createProject(data);

      set((state) => ({
        projects: [project, ...state.projects],
        isLoading: false
      }));

      return project;
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to create project.";
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  updateProject: async (id, data) => {
    set({ isLoading: true, error: null });

    try {
      const project = await projectService.updateProject(id, data);

      set((state) => ({
        projects: state.projects.map((item) => item.id === id ? project : item),
        selectedProject: project,
        isLoading: false
      }));

      return project;
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to update project.";
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  deleteProject: async (id) => {
    set({ isLoading: true, error: null });

    try {
      await projectService.deleteProject(id);

      set((state) => ({
        projects: state.projects.filter((project) => project.id !== id),
        selectedProject: state.selectedProject?.id === id ? null : state.selectedProject,
        isLoading: false
      }));
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to delete project.";
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  clearError: () => set({ error: null })
}));