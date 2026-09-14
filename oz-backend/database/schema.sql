-- MySQL Schema for OZ Interstate Movers Production Backend
CREATE DATABASE IF NOT EXISTS `oz_interstate` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `oz_interstate`;

-- Table 1: Roles
CREATE TABLE IF NOT EXISTS `roles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `description` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table 2: Permissions
CREATE TABLE IF NOT EXISTS `permissions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `module` VARCHAR(50) NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table 3: Admins
CREATE TABLE IF NOT EXISTS `admins` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `role_id` INT DEFAULT 1,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20) DEFAULT NULL,
  `avatar` VARCHAR(255) DEFAULT NULL,
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `remember_token` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table 4: Password Resets
CREATE TABLE IF NOT EXISTS `password_resets` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(100) NOT NULL,
  `token` VARCHAR(255) NOT NULL,
  `expires_at` DATETIME NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table 5: Login Logs
CREATE TABLE IF NOT EXISTS `login_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `admin_id` INT DEFAULT NULL,
  `email` VARCHAR(100) NOT NULL,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `user_agent` TEXT DEFAULT NULL,
  `status` ENUM('success', 'failed') DEFAULT 'success',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table 6: Activity Logs
CREATE TABLE IF NOT EXISTS `activity_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `admin_id` INT DEFAULT NULL,
  `action` VARCHAR(100) NOT NULL,
  `module` VARCHAR(50) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table 7: Banners
CREATE TABLE IF NOT EXISTS `banners` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `media_type` ENUM('image', 'video') DEFAULT 'image',
  `title` VARCHAR(255) NOT NULL,
  `subtitle` VARCHAR(255) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `button_text` VARCHAR(100) DEFAULT NULL,
  `button_link` VARCHAR(255) DEFAULT NULL,
  `image` VARCHAR(255) DEFAULT NULL,
  `video_url` VARCHAR(255) DEFAULT NULL,
  `video_thumbnail` VARCHAR(255) DEFAULT NULL,
  `autoplay` TINYINT(1) DEFAULT 1,
  `muted` TINYINT(1) DEFAULT 1,
  `loop` TINYINT(1) DEFAULT 1,
  `controls` TINYINT(1) DEFAULT 0,
  `preload` VARCHAR(20) DEFAULT 'auto',
  `object_fit` VARCHAR(20) DEFAULT 'cover',
  `overlay_opacity` VARCHAR(10) DEFAULT '0.7',
  `overlay_color` VARCHAR(20) DEFAULT '#000000',
  `font_family` VARCHAR(50) DEFAULT 'Inter',
  `title_font_size` VARCHAR(20) DEFAULT '48px',
  `title_font_weight` VARCHAR(20) DEFAULT '800',
  `title_font_style` VARCHAR(20) DEFAULT 'normal',
  `title_color` VARCHAR(20) DEFAULT '#ffffff',
  `title_letter_spacing` VARCHAR(20) DEFAULT '0px',
  `title_line_height` VARCHAR(20) DEFAULT '1.1',
  `title_text_transform` VARCHAR(20) DEFAULT 'none',
  `description_font_family` VARCHAR(50) DEFAULT 'Inter',
  `description_font_size` VARCHAR(20) DEFAULT '16px',
  `description_font_weight` VARCHAR(20) DEFAULT '400',
  `description_font_style` VARCHAR(20) DEFAULT 'normal',
  `description_color` VARCHAR(20) DEFAULT '#ffffff',
  `description_letter_spacing` VARCHAR(20) DEFAULT '0px',
  `description_line_height` VARCHAR(20) DEFAULT '1.6',
  `description_text_alignment` VARCHAR(20) DEFAULT 'left',
  `button_font_family` VARCHAR(50) DEFAULT 'Inter',
  `button_font_size` VARCHAR(20) DEFAULT '14px',
  `button_font_weight` VARCHAR(20) DEFAULT '700',
  `button_text_color` VARCHAR(20) DEFAULT '#ffffff',
  `button_background_color` VARCHAR(20) DEFAULT '#0284c7',
  `button_hover_color` VARCHAR(20) DEFAULT '#0369a1',
  `button_hover_text_color` VARCHAR(20) DEFAULT '#ffffff',
  `button_border_radius` VARCHAR(20) DEFAULT '12px',
  `button_border_color` VARCHAR(20) DEFAULT 'transparent',
  `text_alignment` VARCHAR(20) DEFAULT 'left',
  `display_order` INT DEFAULT 1,
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table 8: Categories
CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `description` TEXT DEFAULT NULL,
  `image` VARCHAR(255) DEFAULT NULL,
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table 9: Services
CREATE TABLE IF NOT EXISTS `services` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `category_id` INT DEFAULT NULL,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `short_description` TEXT DEFAULT NULL,
  `content` LONGTEXT DEFAULT NULL,
  `icon` VARCHAR(100) DEFAULT NULL,
  `image` VARCHAR(255) DEFAULT NULL,
  `price` DECIMAL(10,2) DEFAULT NULL,
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table 10: Blogs
CREATE TABLE IF NOT EXISTS `blogs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `category_id` INT DEFAULT NULL,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `summary` TEXT DEFAULT NULL,
  `content` LONGTEXT DEFAULT NULL,
  `image` VARCHAR(255) DEFAULT NULL,
  `author` VARCHAR(100) DEFAULT 'OZ Admin',
  `status` ENUM('published', 'draft', 'archived') DEFAULT 'published',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table 11: Gallery
CREATE TABLE IF NOT EXISTS `gallery` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) DEFAULT NULL,
  `category` VARCHAR(100) DEFAULT 'general',
  `image_url` VARCHAR(255) NOT NULL,
  `display_order` INT DEFAULT 0,
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table 12: Testimonials
CREATE TABLE IF NOT EXISTS `testimonials` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `role` VARCHAR(100) DEFAULT 'Customer',
  `company` VARCHAR(100) DEFAULT NULL,
  `avatar` VARCHAR(255) DEFAULT NULL,
  `content` TEXT NOT NULL,
  `rating` INT DEFAULT 5,
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table 13: FAQs
CREATE TABLE IF NOT EXISTS `faqs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `question` VARCHAR(255) NOT NULL,
  `answer` TEXT NOT NULL,
  `category` VARCHAR(100) DEFAULT 'general',
  `display_order` INT DEFAULT 0,
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table 14: About Page Details
CREATE TABLE IF NOT EXISTS `about` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `subtitle` VARCHAR(255) DEFAULT NULL,
  `description` LONGTEXT DEFAULT NULL,
  `experience_years` INT DEFAULT 10,
  `completed_moves` INT DEFAULT 5000,
  `happy_customers` INT DEFAULT 1200,
  `image_1` VARCHAR(255) DEFAULT NULL,
  `image_2` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table 15: SEO Promotion
CREATE TABLE IF NOT EXISTS `seo` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `page_name` VARCHAR(100) NOT NULL UNIQUE,
  `meta_title` VARCHAR(255) DEFAULT NULL,
  `meta_description` TEXT DEFAULT NULL,
  `meta_keywords` TEXT DEFAULT NULL,
  `canonical_url` VARCHAR(255) DEFAULT NULL,
  `og_image` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table 16: Website Settings
CREATE TABLE IF NOT EXISTS `settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `site_name` VARCHAR(100) DEFAULT 'OZ Interstate Movers',
  `site_email` VARCHAR(100) DEFAULT 'info@ozinterstate.com',
  `site_phone` VARCHAR(20) DEFAULT '1300 000 000',
  `site_address` TEXT DEFAULT NULL,
  `logo` VARCHAR(255) DEFAULT NULL,
  `favicon` VARCHAR(255) DEFAULT NULL,
  `currency` VARCHAR(10) DEFAULT 'AUD ($)',
  `timezone` VARCHAR(50) DEFAULT 'Australia/Sydney',
  `footer_text` TEXT DEFAULT NULL,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table 17: Contact Details
CREATE TABLE IF NOT EXISTS `contact_details` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `address` TEXT DEFAULT NULL,
  `phone_primary` VARCHAR(20) DEFAULT NULL,
  `phone_secondary` VARCHAR(20) DEFAULT NULL,
  `email_primary` VARCHAR(100) DEFAULT NULL,
  `email_secondary` VARCHAR(100) DEFAULT NULL,
  `opening_hours` VARCHAR(100) DEFAULT NULL,
  `google_maps_link` TEXT DEFAULT NULL,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table 18: Social Links
CREATE TABLE IF NOT EXISTS `social_links` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `platform` VARCHAR(50) NOT NULL,
  `url` VARCHAR(255) NOT NULL,
  `icon` VARCHAR(50) DEFAULT NULL,
  `status` ENUM('active', 'inactive') DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table 19: Inquiry Forms
CREATE TABLE IF NOT EXISTS `inquiry_forms` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL DEFAULT 'Get Your Moving Quote',
  `subtitle` VARCHAR(255) DEFAULT 'FREE ESTIMATE',
  `description` TEXT DEFAULT NULL,
  `button_text` VARCHAR(100) DEFAULT 'Submit Quote Request',
  `success_message` TEXT DEFAULT NULL,
  `error_message` TEXT DEFAULT NULL,
  `email_notification` TINYINT(1) DEFAULT 1,
  `admin_email` VARCHAR(100) DEFAULT 'admin@ozinterstate.com',
  `auto_reply` TINYINT(1) DEFAULT 1,
  `auto_reply_message` TEXT DEFAULT NULL,
  `redirect_url` VARCHAR(255) DEFAULT NULL,
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table 20: Inquiry Fields
CREATE TABLE IF NOT EXISTS `inquiry_fields` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `form_id` INT NOT NULL DEFAULT 1,
  `label` VARCHAR(100) NOT NULL,
  `placeholder` VARCHAR(100) DEFAULT NULL,
  `field_name` VARCHAR(100) NOT NULL,
  `field_type` VARCHAR(50) NOT NULL DEFAULT 'text',
  `required` TINYINT(1) DEFAULT 0,
  `read_only` TINYINT(1) DEFAULT 0,
  `width` VARCHAR(20) DEFAULT '100%',
  `options` JSON DEFAULT NULL,
  `default_value` VARCHAR(255) DEFAULT NULL,
  `help_text` VARCHAR(255) DEFAULT NULL,
  `icon` VARCHAR(50) DEFAULT 'FileText',
  `sort_order` INT DEFAULT 1,
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`form_id`) REFERENCES `inquiry_forms`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table 21: Inquiry Responses
CREATE TABLE IF NOT EXISTS `inquiry_responses` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `form_id` INT DEFAULT 1,
  `response_data` JSON NOT NULL,
  `status` ENUM('new', 'contacted', 'completed', 'spam') DEFAULT 'new',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`form_id`) REFERENCES `inquiry_forms`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table 22: Media Library
CREATE TABLE IF NOT EXISTS `media_library` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `file_name` VARCHAR(255) NOT NULL,
  `file_path` VARCHAR(255) NOT NULL,
  `file_type` VARCHAR(50) NOT NULL,
  `file_size` INT NOT NULL,
  `mime_type` VARCHAR(100) NOT NULL,
  `alt_text` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Default Admin & Roles
INSERT INTO `roles` (`id`, `name`, `description`) VALUES (1, 'Super Admin', 'Full system access') ON DUPLICATE KEY UPDATE `id`=`id`;

INSERT INTO `admins` (`id`, `role_id`, `name`, `email`, `password`, `status`) VALUES
(1, 1, 'OZ Admin', 'admin@ozinterstate.com', '$2a$10$X8m1Z9mR1p.0aXzP4N0vUuA1u7t8.K9/9q7q.9K9K9K9K9K9K9K9K', 'active')
ON DUPLICATE KEY UPDATE `id`=`id`;
