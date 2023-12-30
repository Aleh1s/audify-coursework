package com.aleh1s.backend.user;


import com.aleh1s.backend.playlist.PlaylistEntity;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.*;

import static jakarta.persistence.EnumType.*;
import static jakarta.persistence.GenerationType.*;

@Entity
@Getter
@Setter
@ToString(exclude = "playlists")
@NoArgsConstructor
@Table(name = "_user")
@EqualsAndHashCode(of = "id")
public class UserEntity implements UserDetails, OAuth2User {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = IDENTITY)
    private Long id;
    @Column(name = "name", nullable = false)
    private String name;
    @Column(name = "email", nullable = false)
    private String email;
    @Column(name = "password")
    private String password;
    @Column(name = "role", nullable = false, length = 20)
    @Enumerated(STRING)
    private UserRole role;
    @Column(name = "auth_provider", nullable = false, length = 20)
    @Enumerated(STRING)
    private AuthProvider authProvider;
    @Column(name = "is_blocked", nullable = false)
    private boolean isBlocked;
    @Setter(AccessLevel.PRIVATE)
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<PlaylistEntity> playlists = new HashSet<>();

    public UserEntity(
            String name,
            String email,
            String password,
            UserRole role
    ) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    public UserEntity(
            String name,
            String email,
            String password,
            UserRole role,
            AuthProvider authProvider
    ) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.authProvider = authProvider;
    }

    public UserEntity(
            String name,
            String email,
            UserRole role,
            AuthProvider authProvider
    ) {
        this.name = name;
        this.email = email;
        this.role = role;
        this.authProvider = authProvider;
    }

    @Override
    public <A> A getAttribute(String name) {
        return OAuth2User.super.getAttribute(name);
    }

    @Override
    public Map<String, Object> getAttributes() {
        return null;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority(role.name));
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return !this.isBlocked;
    }

    @Override
    public boolean isAccountNonLocked() {
        return !this.isBlocked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return !this.isBlocked;
    }

    @Override
    public boolean isEnabled() {
        return !this.isBlocked;
    }

    public void addPlaylist(PlaylistEntity playlistEntity) {
        this.playlists.add(playlistEntity);
        playlistEntity.setOwner(this);
    }

    public void deletePlaylist(PlaylistEntity playlistEntity) {
        this.playlists.remove(playlistEntity);
        playlistEntity.setOwner(null);
    }
}
