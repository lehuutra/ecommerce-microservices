package com.ecommerce.auth.service;

import com.ecommerce.auth.dto.UserResponse;
import com.ecommerce.auth.entity.User;
import com.ecommerce.auth.exception.BusinessException;
import com.ecommerce.auth.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    private static final String EMAIL = "customer@example.com";

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AuthService authService;

    @Test
    void getCurrentUser_returnsSafeUserData() {
        User user = User.builder()
                .email(EMAIL)
                .fullName("Test Customer")
                .password("hashed-password")
                .role(User.Role.CUSTOMER)
                .build();
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));

        UserResponse result = authService.getCurrentUser(EMAIL);

        assertThat(result.getEmail()).isEqualTo(EMAIL);
        assertThat(result.getFullName()).isEqualTo("Test Customer");
        assertThat(result.getRole()).isEqualTo("CUSTOMER");
    }

    @Test
    void getCurrentUser_throwsNotFoundWhenUserDoesNotExist() {
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.getCurrentUser(EMAIL))
                .isInstanceOfSatisfying(BusinessException.class, exception -> {
                    assertThat(exception.getStatus()).isEqualTo(HttpStatus.NOT_FOUND);
                    assertThat(exception.getMessage()).isEqualTo("User not found");
                });
    }
}
