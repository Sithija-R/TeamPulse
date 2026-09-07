import React, { useState } from 'react';
import { PageHeader } from '../../../components/common/PageHeader';
import { DUMMY_PROJECTS } from '../../../lib/dummyData';
import type { Project } from '../../../types/project';
import { Plus, Briefcase, Edit2, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';

export const Projects: React.FC = () => {
  const [projectsList, setProjectsList] = useState<Project[]>(DUMMY_PROJECTS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [active, setActive] = useState(true);

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingProject) {
      setProjectsList(
        projectsList.map((p) =>
          p.id === editingProject.id
            ? { ...p, name: name.trim(), description: description.trim() || null, active }
            : p
        )
      );
      setEditingProject(null);
    } else {
      const newProject: Project = {
        id: Date.now(),
        name: name.trim(),
        description: description.trim() || null,
        active,
        memberCount: 1,
        reportCount: 0,
      };
      setProjectsList([newProject, ...projectsList]);
    }

    setName('');
    setDescription('');
    setActive(true);
    setShowAddForm(false);
  };

  const startEdit = (project: Project) => {
    setEditingProject(project);
    setName(project.name);
    setDescription(project.description || '');
    setActive(project.active);
    setShowAddForm(true);
  };

  const confirmDelete = () => {
    if (deletingId) {
      setProjectsList(projectsList.filter((p) => p.id !== deletingId));
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Project Management"
        description="Configure active organizational initiatives and workspace repositories."
        action={
          <button
            onClick={() => {
              setEditingProject(null);
              setName('');
              setDescription('');
              setActive(true);
              setShowAddForm(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#8DF688] px-4 py-2 text-xs font-bold text-[#171A18] hover:bg-[#7ae875] transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Create Project
          </button>
        }
      />

      {/* Modal / Form */}
      {showAddForm && (
        <form
          onSubmit={handleSaveProject}
          className="rounded-2xl border border-[#8DF688] bg-[#8DF688]/10 p-6 space-y-4 animate-in fade-in duration-150"
        >
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#171A18]">
            {editingProject ? 'Edit Project' : 'Create New Project'}
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-[#171A18] mb-1">
                Project Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. NextGen Telemetry System"
                className="w-full rounded-xl border border-[#E5E7E5] bg-white px-3.5 py-2 text-xs font-medium text-[#171A18] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#171A18] mb-1">
                Status
              </label>
              <select
                value={active ? 'true' : 'false'}
                onChange={(e) => setActive(e.target.value === 'true')}
                className="w-full rounded-xl border border-[#E5E7E5] bg-white px-3.5 py-2 text-xs font-semibold text-[#171A18] outline-none"
              >
                <option value="true">Active Project</option>
                <option value="false">Inactive / Archived</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#171A18] mb-1">
                Description / Objectives
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of project scope..."
                className="w-full rounded-xl border border-[#E5E7E5] bg-white p-3 text-xs font-medium text-[#171A18] outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="rounded-lg border border-[#E5E7E5] bg-white px-4 py-2 text-xs font-semibold text-[#171A18] hover:bg-[#F7F8F7] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#171A18] px-5 py-2 text-xs font-bold text-white hover:bg-black cursor-pointer"
            >
              {editingProject ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      )}

      {/* Projects List Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projectsList.map((project) => (
          <div
            key={project.id}
            className="rounded-2xl border border-[#E5E7E5] bg-white p-5 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F7F8F7] border border-[#E5E7E5] text-[#171A18]">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#171A18]">{project.name}</h3>
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold ${
                        project.active ? 'text-emerald-700' : 'text-gray-500'
                      }`}
                    >
                      {project.active ? (
                        <>
                          <CheckCircle2 className="h-3 w-3" /> Active
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3" /> Inactive
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#6B726D] min-h-[36px] line-clamp-2 leading-relaxed">
                {project.description || 'No description provided.'}
              </p>
            </div>

            <div className="pt-3 border-t border-[#E5E7E5] flex items-center justify-between text-xs">
              <div className="text-[#6B726D] text-[11px]">
                <span>{project.memberCount || 3} Members</span> &bull;{' '}
                <span>{project.reportCount || 8} Reports</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => startEdit(project)}
                  className="rounded-lg p-1.5 text-[#6B726D] hover:bg-[#F7F8F7] hover:text-[#171A18] cursor-pointer"
                  title="Edit project"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeletingId(project.id)}
                  className="rounded-lg p-1.5 text-[#6B726D] hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                  title="Delete project"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

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
};
