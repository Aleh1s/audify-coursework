create table playlist (
    id bigserial primary key,
    name varchar(255) not null,
    preview_id varchar(36),
    is_liked_songs_playlist boolean not null default false,
    owner_id bigint not null references _user(id)
);

create table song (
    id bigserial primary key,
    song_id varchar(36) not null ,
    playlist_id bigint not null references playlist(id)
)