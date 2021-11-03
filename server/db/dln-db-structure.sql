-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema dln-construcciones
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema dln-construcciones
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `dln-construcciones` DEFAULT CHARACTER SET utf8 ;
USE `dln-construcciones` ;

-- -----------------------------------------------------
-- Table `dln-construcciones`.`interests`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dln-construcciones`.`interests` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(100) NOT NULL,
  `description` TEXT NOT NULL,
  `image` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT NOW(),
  `updated_at` TIMESTAMP NOT NULL DEFAULT NOW(),
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `dln-construcciones`.`services`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dln-construcciones`.`services` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(100) NOT NULL,
  `image` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT NOW(),
  `updated_at` TIMESTAMP NOT NULL DEFAULT NOW(),
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `dln-construcciones`.`types`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dln-construcciones`.`types` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(100) NOT NULL,
  `image` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT NOW(),
  `updated_at` TIMESTAMP NOT NULL DEFAULT NOW(),
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `dln-construcciones`.`jobs`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dln-construcciones`.`jobs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `types_id` BIGINT UNSIGNED NOT NULL,
  `title` VARCHAR(100) NULL DEFAULT NULL,
  `description` TEXT NULL DEFAULT NULL,
  `image` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT NOW(),
  `updated_at` TIMESTAMP NOT NULL DEFAULT NOW(),
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `types_jobs_idx` (`types_id` ASC),
  CONSTRAINT `types_jobs`
    FOREIGN KEY (`types_id`)
    REFERENCES `dln-construcciones`.`types` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `dln-construcciones`.`categories`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dln-construcciones`.`categories` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(100) NOT NULL,
  `image` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT NOW(),
  `updated_at` TIMESTAMP NOT NULL DEFAULT NOW(),
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `dln-construcciones`.`batches`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dln-construcciones`.`batches` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `categories_id` BIGINT UNSIGNED NOT NULL,
  `title` VARCHAR(100) NOT NULL,
  `description` TEXT NOT NULL,
  `image` VARCHAR(100) NOT NULL,
  `price` INT NULL DEFAULT NULL,
  `sold` ENUM('true', 'false') NOT NULL DEFAULT 'false',
  `created_at` TIMESTAMP NOT NULL DEFAULT NOW(),
  `updated_at` TIMESTAMP NOT NULL DEFAULT NOW(),
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `categories_batches_idx` (`categories_id` ASC),
  CONSTRAINT `categories_batches`
    FOREIGN KEY (`categories_id`)
    REFERENCES `dln-construcciones`.`categories` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `dln-construcciones`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dln-construcciones`.`users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(100) NOT NULL,
  `password` VARCHAR(100) NOT NULL,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `avatar` VARCHAR(100) NULL DEFAULT NULL,
  `dni` INT UNSIGNED NULL DEFAULT NULL,
  `phone` VARCHAR(45) NULL DEFAULT NULL,
  `role` ENUM('admin', 'user') NOT NULL DEFAULT 'user',
  `created_at` TIMESTAMP NOT NULL DEFAULT NOW(),
  `updated_at` TIMESTAMP NOT NULL DEFAULT NOW(),
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `dln-construcciones`.`pictures`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dln-construcciones`.`pictures` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `services_b_id` BIGINT UNSIGNED NOT NULL,
  `picture` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT NOW(),
  `updated_at` TIMESTAMP NOT NULL DEFAULT NOW(),
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `services_pictures_idx` (`services_b_id` ASC),
  CONSTRAINT `services_pictures`
    FOREIGN KEY (`services_b_id`)
    REFERENCES `dln-construcciones`.`services` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `dln-construcciones`.`images`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dln-construcciones`.`images` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `batches_id` BIGINT UNSIGNED NOT NULL,
  `image` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT NOW(),
  `updated_at` TIMESTAMP NOT NULL DEFAULT NOW(),
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `batches_images_idx` (`batches_id` ASC),
  CONSTRAINT `batches_images`
    FOREIGN KEY (`batches_id`)
    REFERENCES `dln-construcciones`.`batches` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `dln-construcciones`.`projects`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dln-construcciones`.`projects` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `users_id` BIGINT UNSIGNED NOT NULL,
  `balance` BIGINT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT NOW(),
  `updated_at` TIMESTAMP NOT NULL DEFAULT NOW(),
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `users_projects_idx` (`users_id` ASC),
  CONSTRAINT `users_projects`
    FOREIGN KEY (`users_id`)
    REFERENCES `dln-construcciones`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `dln-construcciones`.`contents`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dln-construcciones`.`contents` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `services_a_id` BIGINT UNSIGNED NOT NULL,
  `subtitle` VARCHAR(100) NULL DEFAULT NULL,
  `text` TEXT NULL DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT NOW(),
  `updated_at` TIMESTAMP NOT NULL DEFAULT NOW(),
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `services_contents_idx` (`services_a_id` ASC),
  CONSTRAINT `services_contents`
    FOREIGN KEY (`services_a_id`)
    REFERENCES `dln-construcciones`.`services` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;