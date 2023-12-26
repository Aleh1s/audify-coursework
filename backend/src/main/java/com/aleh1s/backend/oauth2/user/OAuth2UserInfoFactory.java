package com.aleh1s.backend.oauth2.user;

import com.aleh1s.backend.exception.OAuth2AuthenticationProcessingException;
import com.aleh1s.backend.user.AuthProvider;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class OAuth2UserInfoFactory {
    public OAuth2UserInfo getOAuth2UserInfo(String registrationId, Map<String, Object> attributes) {
        if (registrationId.equalsIgnoreCase(AuthProvider.GOOGLE.name())) {
            return new GoogleOAuth2UserInfo(attributes);
        } else {
            throw new OAuth2AuthenticationProcessingException("Sorry! Login with %s is not supported yet".formatted(registrationId));
        }
    }
}
