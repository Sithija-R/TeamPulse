import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  highlight?: boolean;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtext,
  icon,
  trend,
  highlight = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-xl border border-[#E5E7E5] p-5 transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-[#8DF688] hover:shadow-sm' : ''
      } ${highlight ? 'bg-[#8DF688]/10 border-[#8DF688]' : 'bg-white'}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#6B726D]">
          {title}
        </span>
        {icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F7F8F7] text-[#171A18]">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-3xl font-bold tracking-tight text-[#171A18]">
          {value}
        </span>
        {trend && (
          <span
            className={`inline-flex items-center text-xs font-medium ${
              trend.isPositive ? 'text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full' : 'text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full'
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>

      {subtext && <p className="mt-1.5 text-xs text-[#9AA19C]">{subtext}</p>}
    </div>
  );
};
