-- phpMyAdmin SQL Dump
-- Version: 5.2.1
-- https://www.phpmyadmin.net/
-- Host: 127.0.0.1
-- Generated: Dec 19, 2024 at 05:01 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- Set character set and collation
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- Database: `e_retail`
CREATE DATABASE IF NOT EXISTS `e_retail` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `e_retail`;
-- Table: `article`
DROP TABLE IF EXISTS `article`;
CREATE TABLE `article` (
  `article_id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `description` TEXT NOT NULL,
  `price` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `image_1` VARCHAR(50) DEFAULT NULL,
  `image_2` VARCHAR(50) DEFAULT NULL,
  `promotion_at_homepage_level` VARCHAR(1) NOT NULL,
  `promotion_at_department_level` VARCHAR(1) NOT NULL,
  PRIMARY KEY (`article_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `article` (`article_id`, `name`, `description`, `price`, `image_1`, `image_2`, `promotion_at_homepage_level`, `promotion_at_department_level`) VALUES
(56, 'Top 10 Smartphones of 2024: Features and Reviews', 'mauris sollicitudin, faucibus nisi vel...', 19.28, '1732807137337-964721728-1.png', '1732807137337-345654659-2.png', '1', '0'),
(57, 'Best Laptops for Students: Affordable and Powerful', 'tempor, sed AUTO fringilla REACT TUTORIALS...', 0.00, '1732807686614-470342021-3.png', '1732807686614-487583442-4.png', '0', '1'),
(58, 'The Top 5 Electric Cars', 'vitae libero tempor, ut pellentesque dui...', 23.00, '1732812274112-465665101-4.png', '1732812274113-582937207-1.png', '0', '1'),
(59, 'How to Choose the Perfect Tires and Wheels for You', 'vitae lacus. Etiam ut nunc sed erat dictum...', 12.44, '1732812438698-993007923-4.png', '1732812438699-560100139-2.png', '1', '0'),
(60, 'Exploring the Best Contemporary Fiction Authors of', 'Pellentesque ornare risus purus...', 16.40, '1732813307830-311826258-3.png', '1732813307832-615631743-1.png', '0', '0'),
(61, '10 Must-Read Classics That Shaped Modern Literatur', 'ignissim risus AUTOBIOGRAPHY...', 7.25, '1734384110407-985289640-logo.png', '1734384110408-500992828-1.png', '1', '0');

-- Table: `category`
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `category_id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `department_id` INT(11) NOT NULL,
  `name` VARCHAR(50) NOT NULL,
  `description` TEXT DEFAULT NULL,
  PRIMARY KEY (`category_id`),
  KEY `department_id` (`department_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `category` (`category_id`, `department_id`, `name`, `description`) VALUES
(12, 1, 'Mobile Phones', 'fermentum vehicula, ante tellus ultricies...'),
(13, 5, 'Laptops & Computers', 'nec quam consequat faucibus vel quis ipsum...'),
(14, 8, 'Car Parts & Accessories', 'dignissim. Nullam faucibus AUTO pulvinar...'),
(15, 8, 'Tires & Wheels', 'dignissim risus sit amet, viverra sapien...'),
(16, 5, 'Fiction & Literature', 'Nullam faucibus pulvinar finibus...');

-- Table: `category_article`
DROP TABLE IF EXISTS `category_article`;
CREATE TABLE `category_article` (
  `category_id` INT(10) UNSIGNED NOT NULL,
  `article_id` INT(10) UNSIGNED NOT NULL,
  PRIMARY KEY (`category_id`, `article_id`),
  KEY `article_id` (`article_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `category_article` (`category_id`, `article_id`) VALUES
(12, 56),
(12, 57),
(13, 56),
(13, 57),
(14, 58),
(15, 59),
(16, 60),
(16, 61);

-- Table: `department`
DROP TABLE IF EXISTS `department`;
CREATE TABLE `department` (
  `department_id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL DEFAULT '',
  `description` TEXT DEFAULT NULL,
  PRIMARY KEY (`department_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `department` (`department_id`, `name`, `description`) VALUES
(1, 'Electronics', 'Electronic gadgets and devices'),
(2, 'Clothing & Apparel', 'Fashion and accessories for men and women'),
(3, 'Home & Kitchen', 'Appliances and kitchenware for home use'),
(4, 'Sports & Outdoors', 'Gear for sports and outdoor activities'),
(5, 'Books', 'Books, magazines, and reading materials'),
(6, 'Toys & Games', 'Toys for children and gaming consoles'),
(7, 'Health & Beauty', 'Healthcare products and beauty essentials'),
(8, 'Automotive', 'Car accessories and tools for vehicles'),
(9, 'Groceries', 'Daily essentials and groceries'),
(10, 'Furniture', 'Furniture for home and office use');

Foreign Keys
ALTER TABLE `category`
  ADD CONSTRAINT `category_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `department` (`department_id`) ON DELETE CASCADE;

ALTER TABLE `category_article`
  ADD CONSTRAINT `category_article_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `category_article_ibfk_2` FOREIGN KEY (`article_id`) REFERENCES `article` (`article_id`) ON DELETE CASCADE;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

CREATE TABLE `users` (
  `user_id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('customer', 'admin') NOT NULL DEFAULT 'customer',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `promotions` (
  `promotion_id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `discount_percentage` DECIMAL(5,2) NOT NULL CHECK (`discount_percentage` BETWEEN 0 AND 100),
  `start_date` DATETIME NOT NULL,
  `end_date` DATETIME NOT NULL,
  `applies_to` ENUM('article', 'category', 'department', 'global') NOT NULL,
  `reference_id` INT(10) UNSIGNED DEFAULT NULL, -- Links to the relevant article, category, or department
  PRIMARY KEY (`promotion_id`),
  CONSTRAINT `fk_promotions_article` FOREIGN KEY (`reference_id`) REFERENCES `article` (`article_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_promotions_category` FOREIGN KEY (`reference_id`) REFERENCES `category` (`category_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_promotions_department` FOREIGN KEY (`reference_id`) REFERENCES `department` (`department_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `sales_analytics` (
  `analytics_id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `article_id` INT(10) UNSIGNED NOT NULL,
  `order_id` INT(10) UNSIGNED NOT NULL,
  `quantity` INT(10) UNSIGNED NOT NULL,
  `total_price` DECIMAL(10,2) NOT NULL,
  `sale_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`analytics_id`),
  CONSTRAINT `fk_sales_analytics_article` FOREIGN KEY (`article_id`) REFERENCES `article` (`article_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_sales_analytics_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `user_activity` (
  `activity_id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT(10) UNSIGNED NOT NULL,
  `activity_type` ENUM('view', 'add_to_cart', 'purchase', 'review') NOT NULL,
  `reference_id` INT(10) UNSIGNED DEFAULT NULL, -- Links to the article, order, or review
  `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`activity_id`),
  CONSTRAINT `fk_user_activity_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_user_activity_article` FOREIGN KEY (`reference_id`) REFERENCES `article` (`article_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `discount_coupons` (
  `coupon_id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `description` TEXT DEFAULT NULL,
  `discount_percentage` DECIMAL(5,2) NOT NULL CHECK (`discount_percentage` BETWEEN 0 AND 100),
  `max_uses` INT(10) UNSIGNED NOT NULL DEFAULT 1, -- How many times the coupon can be used
  `used_count` INT(10) UNSIGNED NOT NULL DEFAULT 0, -- Tracks current usage
  `valid_from` DATETIME NOT NULL,
  `valid_until` DATETIME NOT NULL,
  PRIMARY KEY (`coupon_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE `orders`
ADD COLUMN `coupon_id` INT(10) UNSIGNED DEFAULT NULL,
ADD CONSTRAINT `fk_orders_coupon` FOREIGN KEY (`coupon_id`) REFERENCES `discount_coupons` (`coupon_id`) ON DELETE SET NULL;

CREATE TABLE `inventory` (
  `article_id` INT(10) UNSIGNED NOT NULL,
  `stock_quantity` INT(10) UNSIGNED NOT NULL DEFAULT 0,
  `reorder_level` INT(10) UNSIGNED NOT NULL DEFAULT 10, -- Minimum stock before restocking
  `last_updated` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`article_id`),
  CONSTRAINT `fk_inventory_article` FOREIGN KEY (`article_id`) REFERENCES `article` (`article_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `refunds` (
  `refund_id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id` INT(10) UNSIGNED NOT NULL,
  `user_id` INT(10) UNSIGNED NOT NULL,
  `reason` TEXT NOT NULL,
  `status` ENUM('requested', 'approved', 'rejected', 'processed') DEFAULT 'requested',
  `requested_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `processed_at` TIMESTAMP DEFAULT NULL,
  PRIMARY KEY (`refund_id`),
  CONSTRAINT `fk_refunds_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_refunds_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `notifications` (
  `notification_id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT(10) UNSIGNED NOT NULL,
  `message` TEXT NOT NULL,
  `is_read` BOOLEAN NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`notification_id`),
  CONSTRAINT `fk_notifications_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Drop foreign key constraints from `category_article` table
ALTER TABLE `category_article` DROP FOREIGN KEY `category_article_ibfk_2`;

-- Drop foreign key constraints from `sales_analytics` table
ALTER TABLE `sales_analytics` DROP FOREIGN KEY `fk_sales_analytics_article`;

-- Drop foreign key constraints from `user_activity` table
ALTER TABLE `user_activity` DROP FOREIGN KEY `fk_user_activity_article`;

-- Drop foreign key constraints from `inventory` table
ALTER TABLE `inventory` DROP FOREIGN KEY `fk_inventory_article`;