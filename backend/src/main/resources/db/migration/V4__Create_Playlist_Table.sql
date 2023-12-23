create table playlist (
    id bigserial primary key,
    name varchar(255) not null,
    preview_id varchar(36),
    owner_id bigint not null references _user(id)
);

create table song (
    song_id varchar(36) primary key,
    playlist_id bigint not null references playlist(id)
)