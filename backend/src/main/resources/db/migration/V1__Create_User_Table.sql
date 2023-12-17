create table _user (
    id bigserial primary key,
    first_name varchar(255) not null,
    last_name varchar(255) not null,
    email varchar(255) not null,
    password varchar(255) not null,
    role varchar(20) not null,
    auth_provider varchar(20) not null,
    is_blocked boolean not null default false
);