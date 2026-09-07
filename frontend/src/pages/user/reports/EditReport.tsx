import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useReports } from '../../../hooks/useReports';
import { PageHeader } from '../../../components/common/PageHeader';
import { ReportForm } from '../../../components/reports/ReportForm';
import { CorrectionFeedback } from '../../../components/reports/CorrectionFeedback';
import type { WeeklyReport } from '../../../types/report';
import { ErrorState } from '../../../components/common/ErrorState';

export const EditReport: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getReportById, updateReport, submitReport, getReviews } = useReports();

  const reportId = Number(id);
  const report = getReportById(reportId);

  if (!report) {
    return (
      <ErrorState
        title="Report Not Found"
        message="The weekly report you requested could not be found."
        onRetry={() => navigate('/user/reports')}
      />
    );
  }

  const reviews = getReviews(reportId);
  const latestReview = reviews[0];

  const handleSubmit = (reportPayload: Omit<WeeklyReport, 'id'>, isSubmit: boolean) => {
    updateReport(reportId, reportPayload);
    if (isSubmit) {
      submitReport(reportId);
    }
    navigate('/user/reports');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Edit Report &bull; ${report.projectName}`}
        description={`Report for week starting ${report.weekStartDate}`}
        breadcrumbs={[
          { label: 'My Reports', href: '/user/reports' },
          { label: 'Report Detail', href: `/user/reports/${report.id}` },
          { label: 'Edit' },
        ]}
      />

      {report.status === 'NEEDS_CORRECTION' && (
        <CorrectionFeedback review={latestReview} />
      )}

      <ReportForm initialReport={report} onSubmit={handleSubmit} isEdit={true} />
    </div>
  );
};
