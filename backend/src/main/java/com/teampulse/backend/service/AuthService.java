package com.teampulse.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.teampulse.backend.config.JwtService;
import com.teampulse.backend.dto.AuthResponse;
import com.teampulse.backend.dto.LoginRequest;
import com.teampulse.backend.dto.RegisterRequest;
import com.teampulse.backend.dto.UserResponse;
import com.teampulse.backend.exception.ResourceNotFoundException;
import com.teampulse.backend.exception.ResourceOverlappingException;
import com.teampulse.backend.model.User;
import com.teampulse.backend.model.enums.Role;
import com.teampulse.backend.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;

    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.email())) {
            throw new ResourceOverlappingException("Email already registered");
        }

        User user = User.builder()
                .name(request.name())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role(Role.TEAM_MEMBER)
                .build();

        User savedUser = userRepository.save(user);

        UserDetails userDetails = userDetailsService.loadUserByUsername( savedUser.getEmail());

        String token = jwtService.generateToken(userDetails);

        UserResponse userResponse = new UserResponse(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole().name()
        );

        return new AuthResponse(
                token,
                userResponse
        );
    }

    public AuthResponse login(LoginRequest request) {

        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                request.email(),
                                request.password()
                        )
                );
    
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
    
        String token = jwtService.generateToken(userDetails);
    
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserResponse userResponse = new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name()
        );
    
        return new AuthResponse(
                token,
                userResponse
        );
    }
}
