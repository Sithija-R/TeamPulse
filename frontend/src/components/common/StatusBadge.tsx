import React from 'react';
import { getStatusColorClass } from '../../lib/utils';
import { REPORT_STATUS_LABELS, PRIORITY_LABELS, TASK_STATUS_LABELS } from '../../lib/constants';

interface StatusBadgeProps {
  status: string;
  type?: 'report' | 'priority' | 'task' | 'general';
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  type = 'general',
  size = 'md',
}) => {
  const colors = getStatusColorClass(status);
  
  let label = status;
  if (type === 'report') {
    label = REPORT_STATUS_LABELS[status as keyof typeof REPORT_STATUS_LABELS] || status;
  } else if (type === 'priority') {
    label = PRIORITY_LABELS[status as keyof typeof PRIORITY_LABELS] || status;
  } else if (type === 'task') {
    label = TASK_STATUS_LABELS[status as keyof typeof TASK_STATUS_LABELS] || status;
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-medium',
    md: 'px-2.5 py-1 text-xs font-semibold',
    lg: 'px-3 py-1.5 text-sm font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${colors.bg} ${colors.text} ${colors.border} ${sizeClasses[size]} transition-colors`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-75" />
      {label}
    </span>
  );
};
