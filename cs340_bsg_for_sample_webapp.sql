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

DROP TABLE IF EXISTS `bsg_cert_people`;
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

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
