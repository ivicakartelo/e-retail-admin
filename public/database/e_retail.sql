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
  `deleted_at` TIMESTAMP NULL DEFAULT NULL, -- Soft delete column
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

-- Foreign Keys
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
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `users` (`name`, `email`, `password`, `role`)
VALUES
('Alice Johnson', 'alice.johnson@example.com', 'password_hash_1', 'customer'),
('Bob Smith', 'bob.smith@example.com', 'password_hash_2', 'customer'),
('Charlie Brown', 'charlie.brown@example.com', 'password_hash_3', 'customer'),
('Diana Prince', 'diana.prince@example.com', 'password_hash_4', 'customer'),
('Ethan Hunt', 'ethan.hunt@example.com', 'password_hash_5', 'customer'),
('Fiona Gallagher', 'fiona.gallagher@example.com', 'password_hash_6', 'customer'),
('George Taylor', 'george.taylor@example.com', 'password_hash_7', 'admin'),
('Hannah Lee', 'hannah.lee@example.com', 'password_hash_8', 'customer'),
('Ian Wright', 'ian.wright@example.com', 'password_hash_9', 'customer'),
('Julia Roberts', 'julia.roberts@example.com', 'password_hash_10', 'admin');

CREATE TABLE `orders` (
  `order_id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT(10) UNSIGNED NOT NULL,
  `order_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `status` ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  `total_amount` DECIMAL(10,2) NOT NULL,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL, -- Soft delete column
  PRIMARY KEY (`order_id`),
  CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
CREATE TABLE `order_items` (
  `order_item_id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id` INT(10) UNSIGNED NOT NULL,
  `article_id` INT(10) UNSIGNED NOT NULL,
  `quantity` INT(10) UNSIGNED NOT NULL DEFAULT 1,
  `price` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`order_item_id`),
  CONSTRAINT `fk_order_items_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_order_items_article` FOREIGN KEY (`article_id`) REFERENCES `article` (`article_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;