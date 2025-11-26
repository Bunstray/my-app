CREATE TABLE `users` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `email` varchar(255),
  `username` varchar(255),
  `password` varchar(255),
  `role` enum(admin,regular) DEFAULT 'regular',
  `created_at` timestamp DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `events` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `category` varchar(10) NOT NULL,
  `banner` varchar(255),
  `created_by` int,
  `created_at` timestamp DEFAULT (CURRENT_TIMESTAMP),
  `status` enum('uncompleted', 'completed') DEFAULT 'uncompleted'
);

CREATE TABLE `bandul` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `event_id` int NOT NULL,
  `name` varchar(50) COMMENT 'e.g., Bandul A, Bandul B',
  `status` enum(active,inactive) DEFAULT 'active'
);

CREATE TABLE `participants` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `bandul_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `created_at` timestamp DEFAULT (CURRENT_TIMESTAMP)
);

ALTER TABLE `bandul` ADD FOREIGN KEY (`event_id`) REFERENCES `events` (`id`);

ALTER TABLE `participants` ADD FOREIGN KEY (`bandul_id`) REFERENCES `bandul` (`id`);



