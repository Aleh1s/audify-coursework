create table audio
(
    id        varchar(36) primary key,
    extension varchar(255) not null,
    length    bigint       not null,
    data      oid          not null
)