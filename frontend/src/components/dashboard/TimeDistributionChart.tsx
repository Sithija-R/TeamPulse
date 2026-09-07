import React from 'react';
import { TimeDistribution } from '../../types/dashboard';
import { TASK_TYPE_LABELS } from '../../lib/constants';
import { PieChart } from 'lucide-react';

interface TimeDistributionChartProps {
  distribution: TimeDistribution[];
}

export const TimeDistributionChart: React.FC<TimeDistributionChartProps> = ({ distribution }) => {
  const categoryColors: Record<string, string> = {
    DEVELOPMENT: 'bg-[#8DF688] text-[#171A18]',
    TESTING: 'bg-blue-400 text-white',
    MEETINGS: 'bg-amber-400 text-[#171A18]',
    DOCUMENTATION: 'bg-purple-400 text-white',
    RESEARCH: 'bg-teal-400 text-[#171A18]',
    OTHER: 'bg-gray-400 text-white',
  };

  const totalHours = distribution.reduce((acc, item) => acc + item.hours, 0) || 1;

  return (
    <div className="rounded-xl border border-[#E5E7E5] bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-[#171A18]">Time Distribution by Category</h3>
          <p className="text-xs text-[#6B726D]">Aggregate team effort across task types</p>
        </div>
        <PieChart className="h-4 w-4 text-[#6B726D]" />
      </div>

      {/* Progress Multi-Bar */}
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-[#F7F8F7] border border-[#E5E7E5] mb-5">
        {distribution.map(
          (item) =>
            item.hours > 0 && (
              <div
                key={item.taskType}
                style={{ width: `${(item.hours / totalHours) * 100}%` }}
                className={`h-full ${categoryColors[item.taskType].split(' ')[0]} transition-all duration-300`}
                title={`${TASK_TYPE_LABELS[item.taskType]}: ${item.hours} hrs (${item.percentage}%)`}
              />
            )
        )}
      </div>

      {/* Detail Breakdown List */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {distribution.map((item) => (
          <div key={item.taskType} className="rounded-lg bg-[#F7F8F7] p-2.5 border border-[#E5E7E5]">
            <div className="flex items-center gap-2 mb-1">
              <span className={`h-2.5 w-2.5 rounded-full ${categoryColors[item.taskType].split(' ')[0]}`} />
              <span className="text-xs font-semibold text-[#171A18]">
                {TASK_TYPE_LABELS[item.taskType]}
              </span>
            </div>
            <div className="flex items-baseline justify-between text-xs">
              <span className="font-bold text-[#171A18]">{item.hours} hrs</span>
              <span className="text-[#6B726D] font-medium">{item.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
