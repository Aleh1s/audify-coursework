package com.aleh1s.backend.security;

import com.aleh1s.backend.exception.DelegatedAuthEntryPoint;
import com.aleh1s.backend.jwt.JwtAuthenticationFilter;
import com.aleh1s.backend.oauth2.CustomOAuth2UserService;
import com.aleh1s.backend.oauth2.HttpCookieOAuth2AuthorizationRequestRepository;
import com.aleh1s.backend.oauth2.OAuth2AuthenticationFailureHandler;
import com.aleh1s.backend.oauth2.OAuth2AuthenticationSuccessHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final DelegatedAuthEntryPoint delegatedAuthEntryPoint;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;
    private final OAuth2AuthenticationFailureHandler oAuth2AuthenticationFailureHandler;
    private final HttpCookieOAuth2AuthorizationRequestRepository httpCookieOAuth2AuthorizationRequestRepository;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(authorize -> {
                    authorize.requestMatchers(
                            HttpMethod.POST,
                            "/api/v1/auth/login",
                            "/api/v1/registration"
                    ).permitAll();
                    authorize.requestMatchers(
                            HttpMethod.GET,
                            "/api/v1/images/*",
                            "/api/v1/audios/*",
                            "/oauth2/authorize/**",
                            "/oauth2/callback/*",
                            "/favicon.ico",
                            "/error"
                    ).permitAll();
                    authorize.requestMatchers(
                            HttpMethod.GET,
                            "/api/v1/users/profile"
                    ).authenticated();
                    authorize.requestMatchers(
                            HttpMethod.PATCH,
                            "/api/v1/users/password",
                            "/api/v1/users/name"
                    ).authenticated();
                    authorize.requestMatchers(
                            HttpMethod.POST,
                            "/api/v1/songs"
                    ).hasRole("ADMIN");
                    authorize.requestMatchers(
                            HttpMethod.DELETE,
                            "/api/v1/songs/*"
                    ).hasRole("ADMIN");
                    authorize.requestMatchers(
                            "/api/v1/users/**"
                    ).hasRole("ADMIN");
                    authorize.anyRequest().authenticated();
                }).sessionManagement(sm -> sm.sessionCreationPolicy(STATELESS))
                .exceptionHandling(eh -> eh.authenticationEntryPoint(delegatedAuthEntryPoint))
                .oauth2Login(c -> {
                    c.authorizationEndpoint(ae -> {
                        ae.authorizationRequestRepository(httpCookieOAuth2AuthorizationRequestRepository);
                        ae.baseUri("/oauth2/authorize");
                    });
                    c.redirectionEndpoint(re -> re.baseUri("/oauth2/callback/*"));
                    c.userInfoEndpoint(ui -> ui.userService(customOAuth2UserService));
                    c.successHandler(oAuth2AuthenticationSuccessHandler);
                    c.failureHandler(oAuth2AuthenticationFailureHandler);
                })
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }
}
