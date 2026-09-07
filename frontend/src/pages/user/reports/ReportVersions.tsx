import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useReports } from '../../../hooks/useReports';
import { PageHeader } from '../../../components/common/PageHeader';
import { VersionHistory } from '../../../components/reports/VersionHistory';
import { ErrorState } from '../../../components/common/ErrorState';

export const ReportVersions: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getReportById, getVersions } = useReports();

  const reportId = Number(id);
  const report = getReportById(reportId);

  if (!report) {
    return (
      <ErrorState
        title="Report Not Found"
        message="The requested report version history could not be loaded."
        onRetry={() => navigate('/user/reports')}
      />
    );
  }

  const versions = getVersions(reportId);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Version History &bull; ${report.projectName}`}
        description={`Audit trail for report week starting ${report.weekStartDate}`}
        breadcrumbs={[
          { label: 'My Reports', href: '/user/reports' },
          { label: 'Report Detail', href: `/user/reports/${report.id}` },
          { label: 'Version History' },
        ]}
      />

      <VersionHistory versions={versions} />
    </div>
  );
};
