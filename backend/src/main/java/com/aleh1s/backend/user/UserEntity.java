package com.aleh1s.backend.user;


import com.aleh1s.backend.playlist.PlaylistEntity;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

import static jakarta.persistence.EnumType.*;
import static jakarta.persistence.GenerationType.*;

@Entity
@Getter
@Setter
@ToString(exclude = "playlists")
@NoArgsConstructor
@Table(name = "_user")
@EqualsAndHashCode(of = "id")
public class UserEntity implements UserDetails {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = IDENTITY)
    private Long id;
    @Column(name = "first_name", nullable = false)
    private String firstName;
    @Column(name = "last_name", nullable = false)
    private String lastName;
    @Column(name = "email", nullable = false)
    private String email;
    @Column(name = "password", nullable = false)
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
            String firstName,
            String lastName,
            String email,
            String password,
            UserRole role
    ) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    public UserEntity(
            String firstName,
            String lastName,
            String email,
            String password,
            UserRole role,
            AuthProvider authProvider
    ) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.role = role;
        this.authProvider = authProvider;
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
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return !this.isBlocked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
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
