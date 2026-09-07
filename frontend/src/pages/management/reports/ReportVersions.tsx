import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useReports } from '../../../hooks/useReports';
import { PageHeader } from '../../../components/common/PageHeader';
import { VersionHistory } from '../../../components/reports/VersionHistory';
import { ErrorState } from '../../../components/common/ErrorState';

export const ManagementReportVersions: React.FC = () => {
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
        onRetry={() => navigate('/management/reports')}
      />
    );
  }

  const versions = getVersions(reportId);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Version History & Audit Log &bull; ${report.userName}`}
        description={`${report.projectName} &bull; Week starting ${report.weekStartDate}`}
        breadcrumbs={[
          { label: 'All Reports', href: '/management/reports' },
          { label: 'Report Detail', href: `/management/reports/${report.id}` },
          { label: 'Versions' },
        ]}
      />

      <VersionHistory versions={versions} />
    </div>
  );
};
