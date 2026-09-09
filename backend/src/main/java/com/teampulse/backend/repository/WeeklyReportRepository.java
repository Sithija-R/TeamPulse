package com.teampulse.backend.repository;

import com.teampulse.backend.model.WeeklyReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface WeeklyReportRepository
        extends JpaRepository<WeeklyReport, Long>, JpaSpecificationExecutor<WeeklyReport> {
    List<WeeklyReport> findByUserId(Long userId);

    Optional<WeeklyReport> findByIdAndUserId(Long id, Long userId);

    boolean existsByUserIdAndWeekStartDate(Long userId, LocalDate weekStartDate);
}