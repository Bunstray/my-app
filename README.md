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

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
