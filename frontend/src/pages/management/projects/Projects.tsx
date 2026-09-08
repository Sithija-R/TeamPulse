import { SubmitEvent, useEffect, useState } from "react";
import {
  Briefcase,
  CheckCircle2,
  Edit2,
  Plus,
  Trash2,
  XCircle,
} from "lucide-react";

import { PageHeader } from "../../../components/common/PageHeader";
import { ConfirmDialog } from "../../../components/common/ConfirmDialog";
import { useProjectStore } from "../../../store/projectStore";
import type { Project, ProjectRequest } from "../../../types/project";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/toast";

export function Projects() {
  const {
    projects,
    isLoading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    clearError,
  } = useProjectStore();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [active, setActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchProjects().catch(() => {});
  }, [fetchProjects]);

  const resetForm = () => {
    setName("");
    setDescription("");
    setActive(true);
    setEditingProject(null);
    setShowAddForm(false);
  };

  const openCreateForm = () => {
    clearError();
    setEditingProject(null);
    setName("");
    setDescription("");
    setActive(true);
    setShowAddForm(true);
  };

  const startEdit = (project: Project) => {
    clearError();
    setEditingProject(project);
    setName(project.name);
    setDescription(project.description || "");
    setActive(project.active);
    setShowAddForm(true);
  };

  const handleSaveProject = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.add({
        title: "Project Name Required",
        description: "Please enter a project name.",
        type: "error",
      });
      return;
    }

    const data: ProjectRequest = {
      name: name.trim(),
      description: description.trim() || undefined,
      active,
    };

    setIsSaving(true);

    try {
      if (editingProject) {
        await updateProject(editingProject.id, data);

        toast.add({
          title: "Project Updated",
          description: "The project has been updated successfully.",
          type: "success",
        });
      } else {
        await createProject(data);

        toast.add({
          title: "Project Created",
          description: "The project has been created successfully.",
          type: "success",
        });
      }

      resetForm();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : editingProject
            ? "Failed to update project."
            : "Failed to create project.";

      toast.add({
        title: editingProject
          ? "Update Failed"
          : "Creation Failed",
        description: message,
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (deletingId === null) return;

    try {
      await deleteProject(deletingId);

      toast.add({
        title: "Project Deleted",
        description: "The project has been deleted successfully.",
        type: "success",
      });

      setDeletingId(null);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to delete project.";

      toast.add({
        title: "Delete Failed",
        description: message,
        type: "error",
      });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Project Management"
        description="Configure active organizational initiatives and workspace repositories."
        action={
          <Button
            type="button"
            onClick={openCreateForm}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#8DF688] px-4 py-2 text-xs font-bold text-[#171A18] shadow-xs hover:bg-[#7ae875]"
          >
            <Plus className="h-4 w-4" />
            Create Project
          </Button>
        }
      />

      {error && !showAddForm && (
        <Card className="border-rose-200 bg-rose-50">
          <CardContent className="flex items-center justify-between gap-4 p-4">
            <p className="text-xs font-medium text-rose-700">{error}</p>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fetchProjects().catch(() => {})}
              className="shrink-0 border-rose-200 bg-white text-xs text-rose-700 hover:bg-rose-100"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {showAddForm && (
        <Card className="border-[#8DF688] bg-[#8DF688]/10 shadow-none animate-in fade-in duration-150">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-[#171A18]">
              {editingProject ? "Edit Project" : "Create New Project"}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form
              id="project-form"
              onSubmit={handleSaveProject}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="project-name"
                    className="text-xs font-semibold text-[#171A18]"
                  >
                    Project Name *
                  </Label>

                  <Input
                    id="project-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. NextGen Telemetry System"
                    className="h-9 rounded-xl border-[#E5E7E5] bg-white text-xs font-medium text-[#171A18]"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-[#171A18]">
                    Status
                  </Label>

                  <Select
                    value={active ? "true" : "false"}
                    onValueChange={(value) => setActive(value === "true")}
                  >
                    <SelectTrigger className="h-9 w-full rounded-xl border-[#E5E7E5] bg-white text-xs font-semibold text-[#171A18]">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="true">
                        Active Project
                      </SelectItem>
                      <SelectItem value="false">
                        Inactive / Archived
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <Label
                    htmlFor="project-description"
                    className="text-xs font-semibold text-[#171A18]"
                  >
                    Description / Objectives
                  </Label>

                  <Textarea
                    id="project-description"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief summary of project scope..."
                    className="resize-none rounded-xl border-[#E5E7E5] bg-white p-3 text-xs font-medium text-[#171A18]"
                  />
                </div>
              </div>
            </form>
          </CardContent>

          <CardFooter className="justify-end gap-2 border-t border-[#E5E7E5]/60 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              disabled={isSaving}
              className="rounded-lg border-[#E5E7E5] bg-white px-4 text-xs font-semibold text-[#171A18] hover:bg-[#F7F8F7]"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              form="project-form"
              disabled={isSaving}
              className="rounded-lg bg-[#171A18] px-5 text-xs font-bold text-white hover:bg-black"
            >
              {isSaving
                ? editingProject
                  ? "Saving..."
                  : "Creating..."
                : editingProject
                  ? "Save Changes"
                  : "Create Project"}
            </Button>
          </CardFooter>
        </Card>
      )}

      {isLoading && projects.length === 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="border-[#E5E7E5] shadow-none">
              <CardContent className="space-y-4 p-5">
                <div className="h-10 w-10 animate-pulse rounded-xl bg-[#F7F8F7]" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-[#F7F8F7]" />
                <div className="h-10 w-full animate-pulse rounded bg-[#F7F8F7]" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <Card className="border-dashed border-[#E5E7E5] bg-white shadow-none">
          <CardContent className="flex flex-col items-center justify-center p-10 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-[#E5E7E5] bg-[#F7F8F7]">
              <Briefcase className="h-5 w-5 text-[#6B726D]" />
            </div>

            <h3 className="text-sm font-bold text-[#171A18]">
              No projects found
            </h3>

            <p className="mt-1 max-w-sm text-xs text-[#6B726D]">
              Create your first project to start organizing weekly reports.
            </p>

            <Button
              type="button"
              onClick={openCreateForm}
              className="mt-4 rounded-xl bg-[#8DF688] text-xs font-bold text-[#171A18] hover:bg-[#7ae875]"
            >
              <Plus className="mr-1.5 h-4 w-4" />
              Create Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="flex flex-col justify-between border-[#E5E7E5] bg-white shadow-none"
            >
              <CardContent className="space-y-4 p-5">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#E5E7E5] bg-[#F7F8F7] text-[#171A18]">
                        <Briefcase className="h-4 w-4" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold text-[#171A18]">
                          {project.name}
                        </h3>

                        <Badge
                          variant="outline"
                          className={
                            project.active
                              ? "mt-1 border-emerald-200 bg-emerald-50 text-[10px] font-bold text-emerald-700"
                              : "mt-1 border-gray-200 bg-gray-50 text-[10px] font-bold text-gray-500"
                          }
                        >
                          {project.active ? (
                            <>
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              Active
                            </>
                          ) : (
                            <>
                              <XCircle className="mr-1 h-3 w-3" />
                              Inactive
                            </>
                          )}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <p className="line-clamp-3 min-h-[54px] text-xs leading-relaxed text-[#6B726D]">
                    {project.description || "No description provided."}
                  </p>
                </div>
              </CardContent>

              <CardFooter className="justify-end gap-1 border-t border-[#E5E7E5] px-5 py-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => startEdit(project)}
                  title="Edit project"
                  aria-label={`Edit ${project.name}`}
                  className="h-8 w-8 rounded-lg text-[#6B726D] hover:bg-[#F7F8F7] hover:text-[#171A18]"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeletingId(project.id)}
                  title="Delete project"
                  aria-label={`Delete ${project.name}`}
                  className="h-8 w-8 rounded-lg text-[#6B726D] hover:bg-rose-50 hover:text-rose-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={deletingId !== null}
        title="Delete Project"
        message="Are you sure you want to delete this project? Existing reports will remain archived."
        confirmText="Delete Project"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}