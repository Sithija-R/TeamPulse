import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useReports } from '../../../hooks/useReports';
import { PageHeader } from '../../../components/common/PageHeader';
import { ReportSummary } from '../../../components/reports/ReportSummary';
import { ReviewHistory } from '../../../components/reports/ReviewHistory';
import { VersionHistory } from '../../../components/reports/VersionHistory';
import { ErrorState } from '../../../components/common/ErrorState';
import { CheckSquare, FileText, MessageSquare, History } from 'lucide-react';

export const ManagementReportDetail: React.FC = () => {
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
        message="The requested team report could not be found."
        onRetry={() => navigate('/management/reports')}
      />
    );
  }

  const reviews = getReviews(reportId);
  const versions = getVersions(reportId);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Report Detail: ${report.userName}`}
        description={`${report.projectName} &bull; Week starting ${report.weekStartDate}`}
        breadcrumbs={[
          { label: 'All Reports', href: '/management/reports' },
          { label: `Report #${report.id}` },
        ]}
        action={
          <Link
            to={`/management/reports/${report.id}/review`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#8DF688] px-4 py-2 text-xs font-bold text-[#171A18] hover:bg-[#7ae875] transition-colors shadow-xs"
          >
            <CheckSquare className="h-4 w-4" />
            Review / Update Decision
          </Link>
        }
      />

      {/* Navigation Tabs */}
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
          Version Audit History ({versions.length})
        </button>
      </div>

      {activeTab === 'details' && <ReportSummary report={report} />}
      {activeTab === 'reviews' && <ReviewHistory reviews={reviews} />}
      {activeTab === 'versions' && <VersionHistory versions={versions} />}
    </div>
  );
};
