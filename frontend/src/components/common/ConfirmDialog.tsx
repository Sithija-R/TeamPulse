import React from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-xl border border-[#E5E7E5] bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
        <h3 className="text-lg font-bold text-[#171A18]">{title}</h3>
        <p className="mt-2 text-sm text-[#6B726D]">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-[#E5E7E5] bg-white px-4 py-2 text-xs font-semibold text-[#171A18] hover:bg-[#F7F8F7] transition-colors cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition-colors cursor-pointer ${
              variant === 'danger'
                ? 'bg-rose-600 text-white hover:bg-rose-700'
                : 'bg-[#8DF688] text-[#171A18] hover:bg-[#7ae875]'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
