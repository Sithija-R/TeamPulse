package com.teampulse.backend.dto;

public record MemberStatusResponse(
        Long memberId,
        String memberName,
        String status,
        long reportCount
) {}