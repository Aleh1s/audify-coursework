package com.aleh1s.backend.oauth2.user;

import java.util.Map;

public class GoogleOAuth2UserInfo extends OAuth2UserInfo {
    public GoogleOAuth2UserInfo(Map<String, Object> attributes) {
        super(attributes);
    }

    @Override
    public String getId() {
        return (String) super.attributes.get("sub");
    }

    @Override
    public String getName() {
        return (String) super.attributes.get("name");
    }

    @Override
    public String getEmail() {
        return (String) super.attributes.get("email");
    }
    @Override
    public String getImageUrl() {
        return (String) super.attributes.get("picture");
    }
}
