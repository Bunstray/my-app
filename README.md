mysql> show tables;
+---------------------------------+
| Tables_in_jemparingancredential |
+---------------------------------+
| events |
| users |
+---------------------------------+
2 rows in set (0.00 sec)

mysql> describe events;
+------------+---------------------------------+------+-----+-------------------+-------------------+
| Field | Type | Null | Key | Default | Extra |
+------------+---------------------------------+------+-----+-------------------+-------------------+
| id | int | NO | PRI | NULL | auto_increment |
| title | varchar(255) | NO | | NULL | |
| date | date | NO | | NULL | |
| category | varchar(10) | NO | | NULL | |
| banner | varchar(255) | YES | | NULL | |
| created_by | int | YES | | NULL | |
| created_at | timestamp | YES | | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
| status | enum('uncompleted','completed') | YES | | uncompleted | |
+------------+---------------------------------+------+-----+-------------------+-------------------+
8 rows in set (0.00 sec)

mysql> describe users;
+----------+-------------------------+------+-----+---------+----------------+
| Field | Type | Null | Key | Default | Extra |
+----------+-------------------------+------+-----+---------+----------------+
| id | int | NO | PRI | NULL | auto_increment |
| email | varchar(255) | NO | UNI | NULL | |
| username | varchar(255) | NO | | NULL | |
| password | varchar(255) | NO | | NULL | |
| role | enum('admin','regular') | YES | | regular | |
+----------+-------------------------+------+-----+---------+----------------+
5 rows in set (0.00 sec)

CREATE DATABASE jemparingancredential;

USE jemparingancredential;

CREATE TABLE users (
id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
email VARCHAR(255) NOT NULL UNIQUE,
username VARCHAR(255) NOT NULL,
password VARCHAR(255) NOT NULL,
role ENUM('admin', 'regular') DEFAULT 'regular'
);

CREATE TABLE events (
id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
title VARCHAR(255) NOT NULL,
date DATE NOT NULL,
category VARCHAR(10) NOT NULL,
banner VARCHAR(255) NULL,
created_by INT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
status ENUM('uncompleted', 'completed') DEFAULT 'uncompleted',
FOREIGN KEY (created_by) REFERENCES users(id)
);


