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

-- Insert initial data 
-- Insert initial data into the department table
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

-- Insert data into the category table (linked to departments)
INSERT INTO `category` (`category_id`, `department_id`, `name`, `description`) VALUES
(1, 1, 'Mobile Phones', 'Smartphones and mobile devices'),
(2, 1, 'Laptops', 'Laptops and notebooks for personal use'),
(3, 2, 'Men Clothing', 'Clothing and fashion for men'),
(4, 2, 'Women Clothing', 'Clothing and fashion for women'),
(5, 3, 'Kitchen Appliances', 'Appliances for kitchen use'),
(6, 3, 'Home Decor', 'Decorative items for home'),
(7, 4, 'Fitness Gear', 'Equipment and gear for fitness'),
(8, 5, 'Fiction Books', 'Novels and fictional works'),
(9, 6, 'Board Games', 'Board games for family entertainment'),
(10, 7, 'Skincare', 'Skincare products and cosmetics');

-- Insert data into the article table
INSERT INTO `article` (`article_id`, `name`, `description`, `image_1`, `image_2`, `promotion_at_homepage_level`, `promotion_at_department_level`) VALUES
(1, 'iPhone 14', 'Latest Apple iPhone with advanced features', 'iphone14.jpg', NULL, 'Y', 'Y'),
(2, 'Samsung Galaxy S23', 'High-end Samsung smartphone', 'galaxys23.jpg', NULL, 'N', 'Y'),
(3, 'MacBook Pro', 'Apple MacBook Pro with M1 chip', 'macbookpro.jpg', NULL, 'Y', 'Y'),
(4, 'Dell XPS 13', 'Powerful and sleek laptop by Dell', 'dellxps13.jpg', NULL, 'N', 'Y'),
(5, 'Levi\'s Jeans', 'Comfortable and stylish jeans for men', 'levis.jpg', NULL, 'Y', 'N'),
(6, 'Adidas Sneakers', 'Comfortable sneakers for casual wear', 'adidas.jpg', NULL, 'N', 'Y'),
(7, 'Blender', 'Multi-speed kitchen blender', 'blender.jpg', NULL, 'N', 'Y'),
(8, 'Air Fryer', 'Air fryer for healthier cooking', 'airfryer.jpg', NULL, 'Y', 'Y'),
(9, 'Yoga Mat', 'Durable and comfortable yoga mat', 'yogamat.jpg', NULL, 'N', 'Y'),
(10, 'Dumbbells Set', 'Set of adjustable dumbbells', 'dumbbells.jpg', NULL, 'Y', 'N'),
(11, 'Harry Potter Book Set', 'Complete set of Harry Potter books', 'harrypotter.jpg', NULL, 'Y', 'Y'),
(12, 'Monopoly', 'Classic board game for family fun', 'monopoly.jpg', NULL, 'N', 'N'),
(13, 'L\'Oreal Moisturizer', 'Moisturizer for glowing skin', 'lorealmoisturizer.jpg', NULL, 'Y', 'Y'),
(14, 'Eye Cream', 'Anti-aging eye cream', 'eyecream.jpg', NULL, 'N', 'Y'),
(15, 'Car Vacuum', 'Compact car vacuum cleaner', 'carvacuum.jpg', NULL, 'N', 'Y'),
(16, 'Car Seat Cover', 'Seat covers for cars', 'seatcover.jpg', NULL, 'Y', 'N'),
(17, 'Cereal', 'Healthy and nutritious breakfast cereal', 'cereal.jpg', NULL, 'N', 'Y'),
(18, 'Rice', 'Pack of basmati rice', 'rice.jpg', NULL, 'N', 'Y'),
(19, 'Sofa Set', 'Comfortable 3-piece sofa set', 'sofaset.jpg', NULL, 'Y', 'Y'),
(20, 'Dining Table', 'Dining table for 6 people', 'diningtable.jpg', NULL, 'N', 'Y'),
(21, 'Wrist Watch', 'Stylish wrist watch', 'wristwatch.jpg', NULL, 'Y', 'N'),
(22, 'Treadmill', 'Fitness treadmill for home use', 'treadmill.jpg', NULL, 'Y', 'Y'),
(23, 'Perfume', 'Luxury perfume for men', 'perfume.jpg', NULL, 'N', 'N'),
(24, 'Smart TV', '55 inch smart TV with 4K display', 'smarttv.jpg', NULL, 'Y', 'Y'),
(25, 'Gaming Console', 'Next-gen gaming console', 'gamingconsole.jpg', NULL, 'N', 'Y'),
(26, 'Cookware Set', 'Non-stick cookware set', 'cookwareset.jpg', NULL, 'N', 'Y'),
(27, 'Basketball', 'Professional basketball', 'basketball.jpg', NULL, 'Y', 'N'),
(28, 'Tennis Racket', 'High-performance tennis racket', 'tennisracket.jpg', NULL, 'N', 'Y'),
(29, 'Electric Kettle', 'Fast boiling electric kettle', 'electrickettle.jpg', NULL, 'Y', 'Y'),
(30, 'Bluetooth Speaker', 'Portable Bluetooth speaker', 'bluetoothspeaker.jpg', NULL, 'N', 'Y');

-- Insert data into the category_article table (linking articles with categories)
INSERT INTO `category_article` (`category_id`, `article_id`) VALUES
(1, 1), (1, 2), -- Mobile Phones
(2, 3), (2, 4), -- Laptops
(3, 5), (3, 6), -- Men Clothing
(4, 7), (4, 8), -- Women Clothing
(5, 7), (5, 8), -- Kitchen Appliances
(6, 19), (6, 20), -- Home Decor
(7, 9), (7, 10), -- Fitness Gear
(8, 11), (8, 12), -- Fiction Books
(9, 12), (9, 13), -- Board Games
(10, 13), (10, 14); -- Skincare
