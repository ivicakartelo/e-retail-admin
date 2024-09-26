CREATE DATABASE e_retail;
USE e_retail;

-- Create the department table first
CREATE TABLE `department` (
  `department_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '',
  `description` text DEFAULT NULL,
  PRIMARY KEY (`department_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create the article table
CREATE TABLE `article` (
  `article_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` text NOT NULL,
  `image_1` varchar(50) DEFAULT NULL,
  `image_2` varchar(50) DEFAULT NULL,
  `promotion_at_homepage_level` varchar(1) NOT NULL,
  `promotion_at_department_level` varchar(1) NOT NULL,
  PRIMARY KEY (`article_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create the category table with foreign key reference to department
CREATE TABLE `category` (
  `category_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `department_id` int(11) NOT NULL, -- Change to int(11) to match department
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  PRIMARY KEY (`category_id`),
  FOREIGN KEY (`department_id`) REFERENCES `department`(`department_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create the category_article table
CREATE TABLE `category_article` (
  `category_id` int(10) UNSIGNED NOT NULL,
  `article_id` int(10) UNSIGNED NOT NULL,
  PRIMARY KEY (`category_id`, `article_id`),
  FOREIGN KEY (`category_id`) REFERENCES `category`(`category_id`) ON DELETE CASCADE,
  FOREIGN KEY (`article_id`) REFERENCES `article`(`article_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Insert initial data into the department table
INSERT INTO `department` (`department_id`, `name`, `description`) VALUES
(1, 'Electronics', 'Descriptions Descriptions Descriptions'),
(2, 'Clothing & Apparel', 'Descriptions člamksxčla');
