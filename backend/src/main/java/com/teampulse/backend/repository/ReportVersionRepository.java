package com.teampulse.backend.repository;

import com.teampulse.backend.model.ReportVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ReportVersionRepository extends JpaRepository<ReportVersion, Long> {
    List<ReportVersion> findByReportIdOrderByVersionNumberDesc(Long reportId);

    Optional<ReportVersion> findByReportIdAndVersionNumber(Long reportId, Integer versionNumber);

    Optional<ReportVersion> findTopByReportIdOrderByVersionNumberDesc(Long reportId);
}