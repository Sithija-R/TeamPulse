package com.teampulse.backend.model;

import com.teampulse.backend.model.enums.Priority;
import com.teampulse.backend.model.enums.TaskStatus;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "report_tasks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "report_id")
    private WeeklyReport report;

    @Column(nullable = false)
    private String taskName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority;

    private Integer plannedPercentage;

    private Integer actualPercentage;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskStatus status;

    private Double plannedHours;

    private Double actualHours;

    @Column(columnDefinition = "TEXT")
    private String deliverable;
}