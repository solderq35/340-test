SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET SQL_SAFE_UPDATES = 0;


SET @@auto_increment_increment=1;
-- drop diagnosis here to prevent error
DROP TABLE IF EXISTS `diagnosis`;

DROP TABLE IF EXISTS `patient`;

CREATE TABLE patient (
    patient_id int AUTO_INCREMENT UNIQUE NOT NULL PRIMARY KEY,
    patient_first_name varchar(255) NOT NULL,
	patient_last_name varchar(255) NOT NULL,
	patient_birth date NOT NULL,
    patient_address varchar(255) NOT NULL,
	patient_email varchar(255) NOT NULL,
	patient_contact varchar(255) NOT NULL
	) ENGINE=InnoDB;

INSERT INTO `patient`(patient_first_name,patient_last_name,patient_birth,patient_address,patient_email,patient_contact) 
	VALUES ('John','Cena','1969-04-20','7292 SW Dictum Ave. San Antonio, MI 47096','jcena@gmail.com','503-888-4432'),('Larry','David','1981-06-23','3748 NW Jorge St. Austin, TX 28732','ldavid@gmail.com','222-345-6758'),('Sarah','Jackson','1942-07-13','2768 E Juan Rd. Orlando, FL 98394','sarahjack@hotmail.com','276-794-3586'),('Loraine','Zheng','1999-12-25','1235 S Hillsdale Ave. Dublin, CA 283945','lzhang@yahoo.com','232-435-5853');

DROP TABLE IF EXISTS `medication`;
CREATE TABLE medication (
    medication_id int AUTO_INCREMENT UNIQUE NOT NULL PRIMARY KEY,
    medication_name varchar(255) NOT NULL,
	manufacturer varchar(255) NOT NULL
	
	) ENGINE=InnoDB;

INSERT INTO `medication`(medication_name,manufacturer) VALUES ('Adderall','Pfizer'),('Marijuana','Johnson & Johnson'),('Benadryl','AbbVie'),('Tylenol','Merck & Co.');


DROP TABLE IF EXISTS `pharmacy`;
CREATE TABLE pharmacy (
    pharmacy_id int AUTO_INCREMENT NOT NULL PRIMARY KEY,
    pharmacy_name varchar(255) NOT NULL,
	pharmacy_address varchar(255) NOT NULL,
	pharmacy_contact varchar(255) NOT NULL
	
	) ENGINE=InnoDB;

INSERT INTO `pharmacy`(pharmacy_name,pharmacy_address,pharmacy_contact) 
	VALUES ('Wallgreens','2293 SE Jefferson St. Portland, OR 11224','334-233-4839'),('Fred Meyer Pharmacy','3354 SW Washington Ave. Corvallis, OR 19423','234-382-3938'),('Kroger','8362 E Lincoln Ave. Fremont, CA 53891','283-483-2948'),('Albertsons','9832 W Monroe St. Boise, ID 29332','102-304-1092');

DROP TABLE IF EXISTS `medication_pharmacy`;
CREATE TABLE `medication_pharmacy` (
	medication_id int NOT NULL,
	pharmacy_id int NOT NULL,
	PRIMARY KEY (medication_id, pharmacy_id),
	CONSTRAINT FOREIGN KEY(`medication_id`) REFERENCES `medication` (`medication_id`) ON DELETE CASCADE,
	CONSTRAINT FOREIGN KEY(`pharmacy_id`) REFERENCES `pharmacy` (`pharmacy_id`)  ON DELETE CASCADE
	) ENGINE=InnoDB;

INSERT INTO `medication_pharmacy`(medication_id,pharmacy_id) VALUES ('1','3'),('1','2'),('4','2'),('3','2');
	
DROP TABLE IF EXISTS `doctor`;
CREATE TABLE doctor (
    doctor_id int AUTO_INCREMENT UNIQUE NOT NULL PRIMARY KEY,
    doctor_first_name varchar(255) NOT NULL,
	doctor_last_name varchar(255) NOT NULL,
	doctor_contact varchar(255) NOT NULL
	
	) ENGINE=InnoDB;

INSERT INTO `doctor`(doctor_first_name,doctor_last_name,doctor_contact) 
	VALUES ('Jonathan','Kingsley','493-232-1023'),('Mary','Jane','420-666-6969'),('Dom','Torreto','192-394-1029'),('Jimmy','Fallon','492-293-4922');
	
CREATE TABLE diagnosis (
	diagnosis_id int AUTO_INCREMENT UNIQUE NOT NULL PRIMARY KEY,
	medication_id int,
	patient_id int,
	doctor_id int,
	pharmacy_id int,
	description text,
	charge int,
	diagnosis_date date,
	CONSTRAINT FOREIGN KEY (`medication_id`) REFERENCES `medication` (`medication_id`) ON DELETE SET NULL ON UPDATE CASCADE,
	CONSTRAINT FOREIGN KEY (`patient_id`) REFERENCES `patient` (`patient_id`) ON DELETE SET NULL ON UPDATE CASCADE,
	CONSTRAINT FOREIGN KEY (`doctor_id`) REFERENCES `doctor` (`doctor_id`) ON DELETE SET NULL ON UPDATE CASCADE,
	CONSTRAINT FOREIGN KEY (`pharmacy_id`) REFERENCES `pharmacy` (`pharmacy_id`) ON DELETE SET NULL ON UPDATE CASCADE

) ENGINE=InnoDB;

INSERT INTO `diagnosis`(medication_id,patient_id,doctor_id,pharmacy_id,description,charge,diagnosis_date) 
	VALUES ('1','1','4','1','AIDS','5000','2020-04-18'),('1','2','3','2','Malaria','200','2020-05-19'),('3','3','2','4','Common Cold','800','2021-05-21'),('2','3','1','4','Smallpox','300','2022-03-30');


-- phpMyAdmin SQL Dump
-- version 4.7.9
-- https://www.phpmyadmin.net/
--
-- Host: classmysql.engr.oregonstate.edu:3306
-- Generation Time: May 23, 2018 at 05:07 PM
-- Server version: 10.1.22-MariaDB
-- PHP Version: 7.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cs340_hedaoos`
--

-- --------------------------------------------------------

--
-- Table structure for table `bsg_cert`
--
DROP TABLE IF EXISTS `bsg_cert_people`;

DROP TABLE IF EXISTS `bsg_cert`;
CREATE TABLE `bsg_cert` (
  `certification_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `bsg_cert`
--

INSERT INTO `bsg_cert` (`certification_id`, `title`) VALUES
(1, 'Raptor'),
(2, 'Viper'),
(3, 'Mechanic'),
(4, 'Command');

-- --------------------------------------------------------

--
-- Table structure for table `bsg_cert_people`
--


CREATE TABLE `bsg_cert_people` (
  `cid` int(11) NOT NULL DEFAULT '0',
  `pid` int(11) NOT NULL DEFAULT '0',
  `certification_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `bsg_people`
--

DROP TABLE IF EXISTS `bsg_people`;
CREATE TABLE `bsg_people` (
  `character_id` int(11) NOT NULL,
  `fname` varchar(255) NOT NULL,
  `lname` varchar(255) DEFAULT NULL,
  `homeworld` int(11) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `race` varchar(5) NOT NULL DEFAULT 'Human'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `bsg_people`
--

INSERT INTO `bsg_people` (`character_id`, `fname`, `lname`, `homeworld`, `age`, `race`) VALUES
(6, 'Saul', 'Tigh', NULL, 71, 'Human'),
(9, 'Callandra', 'Henderson', NULL, NULL, 'Human'),
(121, 'harry', 'goober', 18, 23, 'Human'),
(156, '', '', 1, 0, 'Human'),
(157, '', '', 3, 0, 'Human'),
(158, 'The', 'Man', 16, 22, 'Human');

-- --------------------------------------------------------

--
-- Table structure for table `bsg_planets`
--

DROP TABLE IF EXISTS `bsg_planets`;
CREATE TABLE `bsg_planets` (
  `planet_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `population` bigint(20) DEFAULT NULL,
  `language` varchar(255) DEFAULT NULL,
  `capital` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `bsg_planets`
--

INSERT INTO `bsg_planets` (`planet_id`, `name`, `population`, `language`, `capital`) VALUES
(1, 'Gemenon', 2800000000, 'Old Gemenese', 'Oranu'),
(2, 'Leonis', 2600000000, 'Leonese', 'Luminere'),
(3, 'Caprica', 4900000000, 'Caprican', 'Caprica City'),
(7, 'Sagittaron', 1700000000, NULL, 'Tawa'),
(16, 'Aquaria', 25000, NULL, NULL),
(17, 'Canceron', 6700000000, NULL, 'Hades'),
(18, 'Libran', 2100000, NULL, NULL),
(19, 'Picon', 1400000000, NULL, 'Queestown'),
(20, 'Scorpia', 450000000, NULL, 'Celeste'),
(21, 'Tauron', 2500000000, 'Tauron', 'Hypatia'),
(22, 'Virgon', 4300000000, NULL, 'Boskirk');

-- --------------------------------------------------------

--
-- Table structure for table `bsg_spaceship`
--

DROP TABLE IF EXISTS `bsg_spaceship`;
CREATE TABLE `bsg_spaceship` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `seperate_saucer_section` bit(1) DEFAULT b'0',
  `length` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `bsg_spaceship`
--

INSERT INTO `bsg_spaceship` (`id`, `name`, `seperate_saucer_section`, `length`) VALUES
(1, 't1', b'1', 0),
(2, 't2', b'1', 0),
(3, 't2', b'1', 0),
(4, 't3', b'1', 0),
(5, 't4', b'0', 0),
(6, 't5', b'1', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bsg_cert`
--
ALTER TABLE `bsg_cert`
  ADD PRIMARY KEY (`certification_id`);

--
-- Indexes for table `bsg_cert_people`
--
ALTER TABLE `bsg_cert_people`
  ADD PRIMARY KEY (`cid`,`pid`),
  ADD KEY `pid` (`pid`);

--
-- Indexes for table `bsg_people`
--
ALTER TABLE `bsg_people`
  ADD PRIMARY KEY (`character_id`),
  ADD KEY `homeworld` (`homeworld`);

--
-- Indexes for table `bsg_planets`
--
ALTER TABLE `bsg_planets`
  ADD PRIMARY KEY (`planet_id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `bsg_spaceship`
--
ALTER TABLE `bsg_spaceship`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bsg_cert`
--
ALTER TABLE `bsg_cert`
  MODIFY `certification_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `bsg_people`
--
ALTER TABLE `bsg_people`
  MODIFY `character_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=159;

--
-- AUTO_INCREMENT for table `bsg_planets`
--
ALTER TABLE `bsg_planets`
  MODIFY `planet_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `bsg_spaceship`
--
ALTER TABLE `bsg_spaceship`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bsg_cert_people`
--
ALTER TABLE `bsg_cert_people`
  ADD CONSTRAINT `bsg_cert_people_ibfk_1` FOREIGN KEY (`cid`) REFERENCES `bsg_cert` (`certification_id`),
  ADD CONSTRAINT `bsg_cert_people_ibfk_2` FOREIGN KEY (`pid`) REFERENCES `bsg_people` (`character_id`);

--
-- Constraints for table `bsg_people`
--
ALTER TABLE `bsg_people`
  ADD CONSTRAINT `bsg_people_ibfk_1` FOREIGN KEY (`homeworld`) REFERENCES `bsg_planets` (`planet_id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;


