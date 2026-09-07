import React from 'react';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading data...',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="relative flex h-10 w-10 items-center justify-center">
        <div className="absolute h-full w-full animate-spin rounded-full border-2 border-[#E5E7E5] border-t-[#8DF688]" />
      </div>
      <p className="mt-3 text-xs font-medium text-[#6B726D]">{message}</p>
    </div>
  );
};
