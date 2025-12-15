-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: findacar
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cars`
--

DROP TABLE IF EXISTS `cars`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cars` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `brand` varchar(50) NOT NULL,
  `model` varchar(255) DEFAULT NULL,
  `year` int(11) NOT NULL,
  `price_per_day` decimal(10,2) NOT NULL,
  `availability` tinyint(1) DEFAULT 1,
  `image` varchar(255) DEFAULT NULL,
  `is_special` tinyint(4) DEFAULT 0,
  `description` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cars`
--

LOCK TABLES `cars` WRITE;
/*!40000 ALTER TABLE `cars` DISABLE KEYS */;
INSERT INTO `cars` VALUES (2,'BMW','320d',2021,120.00,1,'https://www.bmw.co.za/content/dam/bmw/marketZA/bmw_co_za/images/bmw-finance/select-offers/bmw-3-series-sedan-320i-lci-offer-cosy-image.png',0,''),(3,'Audi','A4',2020,150.00,1,'https://file.kelleybluebookimages.com/kbb/base/evox/ExtSpP/14340/2020-Audi-A4-360SpinFrame_14340_032_2400x1800_nologo.png',0,''),(5,'Toyota','Corolla',2021,80.00,1,'https://cars.usnews.com/static/images/Auto/izmo/i159614041/2021_toyota_corolla_angularfront.jpg',0,''),(6,'BMW','X5',2023,250.00,1,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZOEtOGksaXUWS1ahrLYthiuCQV8wqZ7Yaig&s',0,''),(21,'Nissan','GT-R',2025,500.00,1,'https://media.drive.com.au/obj/tx_q:70,rs:auto:1920:1080:1/driveau/upload/vehicles/showrooms/models/nissan-gt-r',1,'Sports • Auto • 2 Passengers • Petrol'),(22,'Toyota','Supra MK4',1994,500.00,1,'https://file.aiquickdraw.com/imgcompressed/img/compressed_5acc389deccc5a24a25276c94c45916d.webp',1,'Coupe • Auto • 2 Passengers • Petrol'),(23,'Chevrolet','Camaro',2024,480.00,1,'https://inv.assets.sincrod.com/RTT/Chevrolet/2024/6067843/default/ext_GAZ_deg02.jpg',1,'Muscle • Auto • 4 Passengers • Petrol');
/*!40000 ALTER TABLE `cars` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_forms`
--

DROP TABLE IF EXISTS `contact_forms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_forms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `name` varchar(100) DEFAULT NULL,
  `surname` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `contact_forms_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_forms`
--

LOCK TABLES `contact_forms` WRITE;
/*!40000 ALTER TABLE `contact_forms` DISABLE KEYS */;
INSERT INTO `contact_forms` VALUES (1,1,'Hello, I need assistance.','2025-04-03 07:31:36',NULL,NULL,NULL),(2,1,'Interested in renting BMW.','2025-04-03 06:00:00',NULL,NULL,NULL),(3,1,'What\'s the insurance policy?','2025-04-03 06:30:00',NULL,NULL,NULL),(5,12,'Testna poruka broj 1','2025-05-23 15:28:30','Tarik','Hodzic','hodzictarik99@gmail.com'),(6,11,'Testna poruka v2','2025-05-24 11:09:33','Tarik','Hodzic','tarik.hodzic@stu.ibu.edu.ba');
/*!40000 ALTER TABLE `contact_forms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservations`
--

DROP TABLE IF EXISTS `reservations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `car_id` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `status` enum('pending','confirmed','canceled') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `car_id` (`car_id`),
  CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reservations_ibfk_2` FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservations`
--

LOCK TABLES `reservations` WRITE;
/*!40000 ALTER TABLE `reservations` DISABLE KEYS */;
INSERT INTO `reservations` VALUES (62,11,2,'2025-08-08','2025-09-09',3960.00,'pending','2025-05-24 11:07:00'),(63,11,22,'2025-09-09','2025-10-10',15500.00,'pending','2025-05-24 11:07:31'),(64,12,23,'2025-09-08','2025-10-10',15360.00,'pending','2025-05-24 12:24:43'),(65,11,6,'2025-09-09','2025-10-10',8000.00,'pending','2025-05-24 12:28:49');
/*!40000 ALTER TABLE `reservations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscriptions`
--

DROP TABLE IF EXISTS `subscriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subscriptions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `plan` enum('BASIC','PREMIUM','VIP') NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` text DEFAULT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_template` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `subscriptions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscriptions`
--

LOCK TABLES `subscriptions` WRITE;
/*!40000 ALTER TABLE `subscriptions` DISABLE KEYS */;
INSERT INTO `subscriptions` VALUES (8,1,'BASIC',70.00,'Perfect for individuals looking for a simple and affordable car rental option. Includes basic insurance, 1000 miles per month, and access to economy and standard vehicles.','0000-00-00','0000-00-00','2025-05-21 20:03:28',1),(9,1,'PREMIUM',120.00,'Ideal for frequent travelers needing flexibility and full coverage. Offers unlimited mileage, access to all vehicle categories, and priority customer support.','0000-00-00','0000-00-00','2025-05-21 20:05:16',1),(10,1,'VIP',200.00,'Perfect for luxury seekers and business users. Includes VIP cars, chauffeur option, and premium insurance.\nPriority service included daily with flexible scheduling.','0000-00-00','0000-00-00','2025-05-21 20:07:25',1),(30,11,'BASIC',70.00,'Subscribed to BASIC','2025-05-24','2025-06-24','2025-05-24 11:14:13',0),(31,12,'PREMIUM',120.00,'Subscribed to PREMIUM','2025-05-24','2025-06-24','2025-05-24 12:25:03',0);
/*!40000 ALTER TABLE `subscriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'John Doe','john.doe@example.com','hashed_password','user','2025-04-03 07:26:51'),(2,'Jane Smith','jane.smith@example.com','hashed_password2','user','2025-04-03 06:00:00'),(3,'Mark Johnson','mark.j@example.com','hashed_password3','admin','2025-04-03 06:10:00'),(4,'Test Korisnik','test@example.com','tajna123','user','2025-04-29 12:56:03'),(5,'Testttt Korisnik','testtt@example.com','tajna123','user','2025-04-29 12:56:03'),(6,'New User','newuser@example.com','$2y$10$XaUCYjP0hKX4zvDqeAvpkeB5pwZDZ1DBFz09wX5XnTspB0Aq2eEE6','user','2025-05-17 17:27:32'),(7,'New User','newuserr@example.com','$2y$10$.A1mGLwHVtINdgTOWjIpP.o4AIObdSLORV24ZFUUhW9VQTmm4O3oa','user','2025-05-17 17:29:48'),(8,'Tarik Hodzic','tarik.hodzic@stu.ibu.edu.ba','$2y$10$ZQmXP6MLuDDOMP.l/vHQ0OcyjZbvkcMnrFa5NmbisO/hZzkPOXqpy','user','2025-05-17 18:12:25'),(9,'THAB','zavrsni@example.com','$2y$10$m.X44WSSUl1EeQnioYT1AemSGqMfkZ9e5zgDLSDgIFiB52R2bHjva','user','2025-05-17 18:15:25'),(10,'caoTi','email@gmail.com','$2y$10$ARCLaOAy3xdxTCJqoYYF9u5wTjuMvfD80PKEgQMG3dElstYm9JSyy','user','2025-05-17 18:15:53'),(11,'Medina Hodzic','medinahodzic1603@gmail.com','$2y$10$2s4FJuanRmQ0Mlb0kcgVTu7NrIf8bPhK6CmxikVMmUV1uyQ0JgwAS','admin','2025-05-17 18:16:52'),(12,'Tarik Hodzic','hodzictarik99@gmail.com','$2y$10$Lvg7nNL.z.t2wFPeRr0imunqtEEeJ0KZb765ppi0pX1j/DhRX1qm.','user','2025-05-18 14:28:44'),(13,'Testing korisnik','testmain@gmail.com','$2y$10$5ZyFQl7nz2zoA9RAfL2MOub3OoEAwfoAV/Q.P2QJ3KDi9A5zbb5im','user','2025-05-20 11:22:02'),(14,'Testing korisnikJedan','testinggmail@gmail.com','$2y$10$Y8nt429zJ1JBqYBfV0EBmeMgDsS8/3Fd2Lhae8JEmbq9BCtooTX9G','user','2025-05-24 12:36:28');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'findacar'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-25 11:04:47
