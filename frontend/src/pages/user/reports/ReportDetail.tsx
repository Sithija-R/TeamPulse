import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useReports } from '../../../hooks/useReports';
import { PageHeader } from '../../../components/common/PageHeader';
import { ReportSummary } from '../../../components/reports/ReportSummary';
import { ReviewHistory } from '../../../components/reports/ReviewHistory';
import { VersionHistory } from '../../../components/reports/VersionHistory';
import { CorrectionFeedback } from '../../../components/reports/CorrectionFeedback';
import { ErrorState } from '../../../components/common/ErrorState';
import { Edit, History, FileText, MessageSquare } from 'lucide-react';

export const ReportDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getReportById, getReviews, getVersions } = useReports();
  const [activeTab, setActiveTab] = useState<'details' | 'reviews' | 'versions'>('details');

  const reportId = Number(id);
  const report = getReportById(reportId);

  if (!report) {
    return (
      <ErrorState
        title="Report Not Found"
        message="The weekly report could not be found."
        onRetry={() => navigate('/user/reports')}
      />
    );
  }

  const reviews = getReviews(reportId);
  const versions = getVersions(reportId);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Weekly Report: ${report.projectName}`}
        description={`Week period ${report.weekStartDate} to ${report.weekEndDate}`}
        breadcrumbs={[
          { label: 'My Reports', href: '/user/reports' },
          { label: `Report #${report.id}` },
        ]}
        action={
          (report.status === 'DRAFT' || report.status === 'NEEDS_CORRECTION') && (
            <Link
              to={`/user/reports/${report.id}/edit`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-white hover:bg-amber-600 shadow-xs"
            >
              <Edit className="h-4 w-4" />
              Edit & Resubmit Report
            </Link>
          )
        }
      />

      {report.status === 'NEEDS_CORRECTION' && reviews.length > 0 && (
        <CorrectionFeedback review={reviews[0]} />
      )}

      {/* Tabs Header */}
      <div className="flex border-b border-[#E5E7E5] text-xs font-semibold">
        <button
          onClick={() => setActiveTab('details')}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 cursor-pointer transition-colors ${
            activeTab === 'details'
              ? 'border-[#171A18] font-bold text-[#171A18]'
              : 'border-transparent text-[#6B726D] hover:text-[#171A18]'
          }`}
        >
          <FileText className="h-4 w-4" />
          Report Summary
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 cursor-pointer transition-colors ${
            activeTab === 'reviews'
              ? 'border-[#171A18] font-bold text-[#171A18]'
              : 'border-transparent text-[#6B726D] hover:text-[#171A18]'
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          Review History ({reviews.length})
        </button>

        <button
          onClick={() => setActiveTab('versions')}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 cursor-pointer transition-colors ${
            activeTab === 'versions'
              ? 'border-[#171A18] font-bold text-[#171A18]'
              : 'border-transparent text-[#6B726D] hover:text-[#171A18]'
          }`}
        >
          <History className="h-4 w-4" />
          Version History ({versions.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'details' && <ReportSummary report={report} />}
      {activeTab === 'reviews' && <ReviewHistory reviews={reviews} />}
      {activeTab === 'versions' && <VersionHistory versions={versions} />}
    </div>
  );
};
