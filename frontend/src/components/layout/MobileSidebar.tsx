import React from 'react';
import { Sidebar } from './Sidebar';
import { X } from 'lucide-react';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar Sheet */}
      <div className="fixed inset-y-0 left-0 flex w-64 transform bg-white transition-transform duration-300 ease-in-out">
        <Sidebar onCloseMobile={onClose} />
        <button
          onClick={onClose}
          className="absolute top-4 right-[-40px] flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#171A18] shadow-md border border-[#E5E7E5]"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
