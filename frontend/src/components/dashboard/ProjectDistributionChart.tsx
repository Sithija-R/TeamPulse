import React from 'react';
import { ProjectDistribution } from '../../types/dashboard';
import { Briefcase, Clock, Users } from 'lucide-react';

interface ProjectDistributionChartProps {
  projects: ProjectDistribution[];
}

export const ProjectDistributionChart: React.FC<ProjectDistributionChartProps> = ({ projects }) => {
  const maxHours = Math.max(...projects.map((p) => p.totalHours), 1);

  return (
    <div className="rounded-xl border border-[#E5E7E5] bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-[#171A18]">Project Workload Distribution</h3>
          <p className="text-xs text-[#6B726D]">Logged hours & reports per active project</p>
        </div>
        <Briefcase className="h-4 w-4 text-[#6B726D]" />
      </div>

      <div className="space-y-4">
        {projects.map((project) => {
          const percent = Math.round((project.totalHours / maxHours) * 100);

          return (
            <div key={project.projectId} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#171A18]">{project.projectName}</span>
                <div className="flex items-center gap-3 text-[#6B726D]">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {project.memberCount} members
                  </span>
                  <span className="flex items-center gap-1 font-medium text-[#171A18]">
                    <Clock className="h-3 w-3" />
                    {project.totalHours} hrs
                  </span>
                </div>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#F7F8F7] border border-[#E5E7E5]">
                <div
                  style={{ width: `${percent}%` }}
                  className="h-full bg-[#8DF688] transition-all duration-300"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
