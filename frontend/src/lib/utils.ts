import type { Priority, ReportStatus, TaskStatus } from '../types/report';

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string | null | undefined): string {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function getStatusColorClass(status: ReportStatus | TaskStatus | Priority | string): {
  bg: string;
  text: string;
  border: string;
} {
  switch (status) {
    case 'APPROVED':
    case 'COMPLETED':
      return {
        bg: 'bg-[#8DF688]/20',
        text: 'text-[#171A18]',
        border: 'border-[#8DF688]',
      };
    case 'SUBMITTED':
    case 'IN_PROGRESS':
    case 'MEDIUM':
      return {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
      };
    case 'NEEDS_CORRECTION':
    case 'BLOCKED':
    case 'HIGH':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
      };
    case 'CRITICAL':
      return {
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-200',
      };
    case 'DRAFT':
    case 'NOT_STARTED':
    case 'LOW':
    default:
      return {
        bg: 'bg-[#F7F8F7]',
        text: 'text-[#6B726D]',
        border: 'border-[#E5E7E5]',
      };
  }
}
