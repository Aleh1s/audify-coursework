package com.aleh1s.backend.oauth2;

import com.aleh1s.backend.exception.OAuth2AuthenticationProcessingException;
import com.aleh1s.backend.oauth2.user.OAuth2UserInfo;
import com.aleh1s.backend.oauth2.user.OAuth2UserInfoFactory;
import com.aleh1s.backend.playlist.PlaylistEntity;
import com.aleh1s.backend.playlist.PlaylistRepository;
import com.aleh1s.backend.user.AuthProvider;
import com.aleh1s.backend.user.UserEntity;
import com.aleh1s.backend.user.UserRepository;
import com.aleh1s.backend.user.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static java.util.Objects.isNull;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final OAuth2UserInfoFactory oAuth2UserInfoFactory;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User auth2User = super.loadUser(userRequest);

        String providerName = userRequest.getClientRegistration().getRegistrationId();
        OAuth2UserInfo oAuth2UserInfo = oAuth2UserInfoFactory.getOAuth2UserInfo(providerName, auth2User.getAttributes());

        String email = oAuth2UserInfo.getEmail();
        if (isNull(email) || email.isBlank()) {
            throw new OAuth2AuthenticationProcessingException(
                    "Email not found from %s provider. Maybe it has private access or you didn't grant access to it".formatted(providerName));
        }

        Optional<UserEntity> customerOptional = userRepository.findUserByEmail(email);
        UserEntity user;
        if (customerOptional.isPresent()) {
            user = customerOptional.get();
            boolean hasAnotherAuthProvider = !user.getAuthProvider().equals(getAuthProvider(userRequest));
            if (hasAnotherAuthProvider) {
                throw new OAuth2AuthenticationProcessingException("Looks like you're signed up with " +
                        user.getAuthProvider() + " account. Please use your " + user.getAuthProvider() +
                        " account to login.");
            }
            user = updateExistingCustomer(customerOptional.get(), oAuth2UserInfo);
        } else {
            user = registerNewCustomer(userRequest, oAuth2UserInfo);
        }
        return user;
    }

    private UserEntity registerNewCustomer(OAuth2UserRequest oAuth2UserRequest, OAuth2UserInfo oAuth2UserInfo) {
        UserEntity user = new UserEntity(
                oAuth2UserInfo.getName(),
                oAuth2UserInfo.getEmail(),
                UserRole.USER,
                getAuthProvider(oAuth2UserRequest)
        );

        PlaylistEntity playlist = new PlaylistEntity("Liked songs", true);
        user.addPlaylist(playlist);

        return userRepository.save(user);
    }

    private UserEntity updateExistingCustomer(UserEntity user, OAuth2UserInfo oAuth2UserInfo) {
        user.setName(oAuth2UserInfo.getName());
        return userRepository.save(user);
    }

    private AuthProvider getAuthProvider(OAuth2UserRequest userRequest) {
        return AuthProvider.valueOf(userRequest.getClientRegistration().getRegistrationId().toUpperCase());
    }
}
