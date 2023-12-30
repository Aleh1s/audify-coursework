create table _user (
    id bigserial primary key,
    name varchar(255) not null,
    email varchar(255) not null,
    password varchar(255),
    role varchar(20) not null,
    auth_provider varchar(20) not null,
    is_blocked boolean not null default false
);