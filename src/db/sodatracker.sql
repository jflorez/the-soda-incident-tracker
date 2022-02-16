CREATE TABLE tracker (
    user varchar(50),
    item varchar(50),
    oops datetime default CURRENT_TIMESTAMP,
    PRIMARY KEY(oops, user)
);