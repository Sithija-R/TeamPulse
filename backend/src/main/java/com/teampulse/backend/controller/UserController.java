package com.teampulse.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.teampulse.backend.dto.ChangeRoleRequest;
import com.teampulse.backend.dto.UserResponse;
import com.teampulse.backend.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public List<UserResponse> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public UserResponse getUserById(
            @PathVariable Long id) {

        return userService.getUserById(id);
    }

    @PatchMapping("/{id}/role")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public UserResponse changeUserRole(
            @PathVariable Long id,
            @RequestBody ChangeRoleRequest request) {
              
        return userService.changeUserRole(id, request.role());
    }
}