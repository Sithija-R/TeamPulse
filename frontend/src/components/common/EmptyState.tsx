import React from 'react';
import { FolderOpen } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  action,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#E5E7E5] bg-[#F7F8F7]/50 p-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-xs border border-[#E5E7E5] text-[#6B726D] mb-3">
        {icon || <FolderOpen className="h-6 w-6" />}
      </div>
      <h3 className="text-base font-semibold text-[#171A18]">{title}</h3>
      <p className="mt-1 text-sm text-[#6B726D] max-w-sm">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};
