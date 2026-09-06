package com.teampulse.backend.repository;

import com.teampulse.backend.model.ReportReview;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReportReviewRepository extends JpaRepository<ReportReview, Long> {
    List<ReportReview> findByReportIdOrderByCreatedAtDesc(Long reportId);
    List<ReportReview> findTop10ByOrderByCreatedAtDesc();
}