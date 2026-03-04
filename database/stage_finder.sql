-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mer. 04 mars 2026 à 12:09
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `stage_finder`
--

-- --------------------------------------------------------

--
-- Structure de la table `admin_actions`
--

CREATE TABLE `admin_actions` (
  `id` int(11) NOT NULL,
  `admin_id` int(11) NOT NULL,
  `action_type` enum('approve_offer','reject_offer','delete_user','delete_offer','other') NOT NULL,
  `target_type` enum('user','offer','company','student') DEFAULT NULL,
  `target_id` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `action_date` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `admin_actions`
--

INSERT INTO `admin_actions` (`id`, `admin_id`, `action_type`, `target_type`, `target_id`, `description`, `action_date`) VALUES
(1, 11, 'approve_offer', 'offer', 1, 'Approbation de l\'offre Développeur Full Stack - Attijariwafa', '2026-02-16 20:30:26'),
(2, 11, 'approve_offer', 'offer', 2, 'Approbation de l\'offre Data Analyst - Attijariwafa', '2026-02-16 20:30:26'),
(3, 11, 'approve_offer', 'offer', 3, 'Approbation de l\'offre Ingénieur Réseaux - Maroc Telecom', '2026-02-16 20:30:26'),
(4, 11, 'reject_offer', 'offer', 4, 'Rejet de l\'offre - Informations insuffisantes sur les missions', '2026-02-16 20:30:26'),
(5, 11, 'approve_offer', 'offer', 5, 'Approbation de l\'offre Logistique - ONCF', '2026-02-16 20:30:26'),
(6, 11, 'approve_offer', 'offer', 6, 'Approbation de l\'offre Assistant RH - ONCF', '2026-02-16 20:30:26'),
(7, 11, 'approve_offer', 'offer', 7, 'Approbation de l\'offre Automatisme - OCP', '2026-02-16 20:30:26'),
(8, 11, 'approve_offer', 'offer', 8, 'Approbation de l\'offre Maintenance - OCP', '2026-02-16 20:30:26'),
(9, 11, 'reject_offer', 'offer', 9, 'Rejet - Format de l\'offre non conforme aux standards de la plateforme', '2026-02-16 20:30:26'),
(10, 11, 'approve_offer', 'offer', 10, 'Approbation de l\'offre Assistant Chef de Projet - Yazaki', '2026-02-16 20:30:26');

-- --------------------------------------------------------

--
-- Structure de la table `applications`
--

CREATE TABLE `applications` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `offer_id` int(11) NOT NULL,
  `cover_letter` text DEFAULT NULL,
  `cv_file` varchar(255) DEFAULT NULL,
  `status` enum('pending','accepted','rejected') DEFAULT 'pending',
  `applied_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `applications`
--

INSERT INTO `applications` (`id`, `student_id`, `offer_id`, `cover_letter`, `cv_file`, `status`, `applied_at`, `updated_at`, `created_at`) VALUES
(1, 1, 1, 'Je suis très intéressé par ce stage car je souhaite développer mes compétences en développement bancaire. J\'ai déjà réalisé un projet similaire lors de mes études...', '/uploads/cvs/ahmed_benali_cv.pdf', 'accepted', '2026-02-16 20:29:44', '2026-02-16 20:29:44', NULL),
(2, 1, 3, 'Passionné par les télécommunications, je souhaite mettre mes compétences en réseaux au service de Maroc Telecom...', '/uploads/cvs/ahmed_benali_cv.pdf', 'pending', '2026-02-16 20:29:44', '2026-02-16 20:29:44', NULL),
(3, 2, 4, 'Je suis une passionnée du marketing digital et je souhaite intégrer votre équipe pour apprendre aux côtés des experts de Maroc Telecom...', '/uploads/cvs/fatima_elidrissi_cv.pdf', 'pending', '2026-02-16 20:29:44', '2026-02-16 20:29:44', NULL),
(4, 2, 6, 'Je recherche un stage en RH pour développer mes compétences en recrutement et gestion des talents...', '/uploads/cvs/fatima_elidrissi_cv.pdf', 'rejected', '2026-02-16 20:29:44', '2026-02-16 20:29:44', NULL),
(5, 3, 5, 'Mon parcours en génie industriel m\'a préparé à relever les défis logistiques. Je serais ravi de contribuer à l\'optimisation des flux à l\'ONCF...', '/uploads/cvs/youssef_alaoui_cv.pdf', 'accepted', '2026-02-16 20:29:44', '2026-02-16 20:29:44', NULL),
(6, 3, 10, 'Je suis intéressé par ce stage qui allie gestion de projet et industrie. Mon expérience en tant que chef de projet associatif...', '/uploads/cvs/youssef_alaoui_cv.pdf', 'pending', '2026-02-16 20:29:44', '2026-02-16 20:29:44', NULL),
(7, 4, 2, 'Je souhaite mettre mes compétences en design et data visualisation au service de votre équipe data. J\'ai créé plusieurs dashboards lors de mes projets...', '/uploads/cvs/khadija_bennani_cv.pdf', 'pending', '2026-02-16 20:29:44', '2026-02-16 20:29:44', NULL),
(8, 5, 2, 'Je suis passionné par l\'analyse de données et je souhaite appliquer mes connaissances en machine learning à des cas concrets dans le secteur bancaire...', '/uploads/cvs/omar_tazi_cv.pdf', 'pending', '2026-02-16 20:29:44', '2026-02-16 20:29:44', NULL),
(9, 5, 8, 'Je cherche à appliquer mes compétences en data science dans le secteur industriel. L\'OCP serait un cadre idéal pour mon stage de fin d\'études...', '/uploads/cvs/omar_tazi_cv.pdf', 'accepted', '2026-02-16 20:29:44', '2026-02-16 20:29:44', NULL),
(10, 6, 1, 'it\'s a test', NULL, 'pending', '2026-02-26 22:16:38', '2026-02-26 22:16:38', '2026-02-26 22:16:38'),
(11, 6, 13, 'lettre de motivation', NULL, 'accepted', '2026-02-26 22:46:44', '2026-02-27 22:22:02', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `companies`
--

CREATE TABLE `companies` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `company_name` varchar(150) NOT NULL,
  `industry` varchar(100) DEFAULT NULL,
  `location` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `logo_path` varchar(255) DEFAULT NULL,
  `updated_at` varchar(45) DEFAULT NULL,
  `created_at` varchar(45) DEFAULT NULL,
  `phone` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `companies`
--

INSERT INTO `companies` (`id`, `user_id`, `company_name`, `industry`, `location`, `description`, `website`, `logo_path`, `updated_at`, `created_at`, `phone`) VALUES
(1, 6, 'Attijariwafa Bank', 'Finance/Banking', 'Casablanca', 'Leading banking group in Morocco and Africa', 'https://www.attijariwafa.com', '/uploads/logos/attijariwafa.png', NULL, NULL, NULL),
(2, 7, 'Maroc Telecom', 'Telecommunications', 'Rabat', 'Leading telecommunications operator in Morocco', 'https://www.iam.ma', '/uploads/logos/maroc-telecom.png', NULL, NULL, NULL),
(3, 8, 'ONCF', 'Transportation', 'Rabat', 'Moroccan national railway office', 'https://www.oncf.ma', '/uploads/logos/oncf.png', NULL, NULL, NULL),
(4, 9, 'OCP Group', 'Mining/Chemicals', 'Casablanca', 'World leader in phosphate and its derivatives', 'https://www.ocpgroup.ma', '/uploads/logos/ocp.png', NULL, NULL, NULL),
(5, 10, 'Yazaki Morocco', 'Automotive', 'Tangier', 'Japanese automotive components manufacturer', 'https://www.yazaki.com', '/uploads/logos/yazaki.png', NULL, NULL, NULL),
(6, 14, 'ilyasse', 'informatique', 'rabat', 'ilyaaaaaaaasssssss', 'https://ilyass.com', NULL, '2026-02-27 21:44:15', NULL, '06 00000000'),
(7, 19, 'company', NULL, 'Non renseigné', NULL, NULL, NULL, NULL, NULL, NULL),
(8, 22, 'testentreprise', 'Commerce', 'PARIS', 'test entreprise', 'https://testentreprise.com', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `conversations`
--

CREATE TABLE `conversations` (
  `id` int(11) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `conversations`
--

INSERT INTO `conversations` (`id`, `created_at`, `updated_at`) VALUES
(1, '2026-02-11 20:29:53', NULL),
(2, '2026-02-13 20:29:53', NULL),
(3, '2026-02-14 20:29:53', NULL),
(4, '2026-02-15 20:29:53', NULL),
(5, '2026-02-16 20:29:53', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `conversation_participants`
--

CREATE TABLE `conversation_participants` (
  `id` int(11) NOT NULL,
  `conversation_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `joined_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `conversation_participants`
--

INSERT INTO `conversation_participants` (`id`, `conversation_id`, `user_id`, `joined_at`) VALUES
(1, 1, 1, '2026-02-11 20:30:07'),
(2, 1, 6, '2026-02-11 20:30:07'),
(3, 2, 2, '2026-02-13 20:30:07'),
(4, 2, 7, '2026-02-13 20:30:07'),
(5, 3, 3, '2026-02-14 20:30:07'),
(6, 3, 8, '2026-02-14 20:30:07'),
(7, 4, 4, '2026-02-15 20:30:07'),
(8, 4, 9, '2026-02-15 20:30:07'),
(9, 5, 5, '2026-02-16 08:30:07'),
(10, 5, 9, '2026-02-16 08:30:07');

-- --------------------------------------------------------

--
-- Structure de la table `evaluations`
--

CREATE TABLE `evaluations` (
  `id` int(11) NOT NULL,
  `application_id` int(11) NOT NULL,
  `overall` int(11) DEFAULT 0,
  `technical` int(11) DEFAULT 0,
  `communication` int(11) DEFAULT 0,
  `teamwork` int(11) DEFAULT 0,
  `initiative` int(11) DEFAULT 0,
  `comment` text DEFAULT NULL,
  `completed` tinyint(1) DEFAULT 0,
  `certificate` tinyint(1) DEFAULT 0,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `evaluations`
--

INSERT INTO `evaluations` (`id`, `application_id`, `overall`, `technical`, `communication`, `teamwork`, `initiative`, `comment`, `completed`, `certificate`, `start_date`, `end_date`, `created_at`) VALUES
(1, 11, 3, 2, 5, 1, 3, 'it\'s a good student and I wish to see her better than that', 1, 1, '2026-02-01', '2026-03-01', '2026-02-28 18:00:53');

-- --------------------------------------------------------

--
-- Structure de la table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `conversation_id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `sent_at` datetime DEFAULT current_timestamp(),
  `updated_at` varchar(45) DEFAULT NULL,
  `created_at` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `messages`
--

INSERT INTO `messages` (`id`, `conversation_id`, `sender_id`, `message`, `is_read`, `sent_at`, `updated_at`, `created_at`) VALUES
(1, 1, 6, 'Bonjour Ahmed, nous avons bien reçu votre candidature pour le poste de Développeur Full Stack. Seriez-vous disponible pour un entretien cette semaine ?', 1, '2026-02-12 20:30:18', NULL, NULL),
(2, 1, 1, 'Bonjour, merci pour votre message. Oui, je suis disponible jeudi après-midi ou vendredi matin.', 1, '2026-02-12 20:30:18', NULL, NULL),
(3, 1, 6, 'Parfait. Je vous propose jeudi à 14h30 dans nos locaux à Casablanca. Je vous envoie l\'adresse exacte.', 1, '2026-02-13 20:30:18', NULL, NULL),
(4, 1, 1, 'C\'est noté, merci. Je serai présent.', 1, '2026-02-13 20:30:18', NULL, NULL),
(5, 2, 2, 'Bonjour, je postule pour le stage en marketing digital. Je suis très motivée à l\'idée de rejoindre votre équipe !', 1, '2026-02-13 20:30:18', NULL, NULL),
(6, 2, 7, 'Bonjour Fatima, merci pour votre intérêt. Pouvez-vous nous envoyer votre portfolio ?', 1, '2026-02-14 20:30:18', NULL, NULL),
(7, 2, 2, 'Bien sûr, voici le lien vers mon portfolio : www.fatimaelidrissi.design', 0, '2026-02-14 20:30:18', NULL, NULL),
(8, 3, 8, 'Félicitations Youssef ! Votre candidature pour le stage en logistique a été retenue. Pouvez-vous passer signer la convention demain ?', 1, '2026-02-15 20:30:18', NULL, NULL),
(9, 3, 3, 'Génial ! Merci beaucoup. Oui, je peux passer demain vers 10h. C\'est à votre bureau de Rabat ?', 1, '2026-02-15 20:30:18', NULL, NULL),
(10, 3, 8, 'Oui, exactement. Je vous attends à 10h. N\'oubliez pas votre convention signée par votre école.', 0, '2026-02-15 20:30:18', NULL, NULL),
(11, 4, 4, 'Bonjour, je suis très intéressée par le stage Data Analyst chez OCP. J\'aimerais en savoir plus sur les missions quotidiennes.', 1, '2026-02-16 00:30:18', NULL, NULL),
(12, 4, 9, 'Bonjour Khadija. Les missions incluent l\'analyse des données de production, la création de dashboards pour le management...', 0, '2026-02-16 02:30:18', NULL, NULL),
(13, 5, 5, 'Bonjour, je confirme ma présence à l\'entretien de demain à 11h.', 1, '2026-02-16 10:30:18', NULL, NULL),
(14, 5, 9, 'Parfait Omar. Voici le lien Google Meet pour l\'entretien à distance : meet.google.com/xyz', 0, '2026-02-16 12:30:18', NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2014_10_12_100000_create_password_reset_tokens_table', 1),
(2, '2019_08_19_000000_create_failed_jobs_table', 1),
(3, '2019_12_14_000001_create_personal_access_tokens_table', 1);

-- --------------------------------------------------------

--
-- Structure de la table `offers`
--

CREATE TABLE `offers` (
  `id` int(11) NOT NULL,
  `company_id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text NOT NULL,
  `requirements` text DEFAULT NULL,
  `location` varchar(150) NOT NULL,
  `duration` int(11) DEFAULT NULL,
  `type` enum('full-time','part-time','remote') DEFAULT 'full-time',
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `offers`
--

INSERT INTO `offers` (`id`, `company_id`, `title`, `description`, `requirements`, `location`, `duration`, `type`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 'Développeur Full Stack (Stage PFE)', 'Nous recherchons un stagiaire développeur full stack pour rejoindre notre équipe digitale. Vous participerez au développement de notre nouvelle application mobile banking.', 'Étudiant en dernière année d\'école d\'ingénieurs ou master informatique. Maîtrise de React, Node.js et MongoDB. Bonne connaissance des API REST.', 'Casablanca', 6, 'full-time', 'approved', '2026-02-16 20:29:35', '2026-02-16 20:29:35'),
(2, 1, 'Data Analyst (Stage)', 'Stage en analyse de données pour le département risque crédit. Vous travaillerez sur l\'analyse des données clients et la création de tableaux de bord.', 'Étudiant en Data Science ou Mathématiques appliquées. Maîtrise de SQL, Python et Power BI. Bonnes capacités analytiques.', 'Casablanca', 4, 'full-time', 'approved', '2026-02-16 20:29:35', '2026-02-16 20:29:35'),
(3, 2, 'Ingénieur Réseaux et Télécoms (Stage)', 'Stage au sein de la direction technique. Participation à l\'optimisation du réseau 4G/5G et analyse des performances.', 'Étudiant en télécommunications ou réseaux. Connaissances des technologies 4G/5G, IP/MPLS. Certifications CISCO sont un plus.', 'Rabat', 5, 'full-time', 'approved', '2026-02-16 20:29:35', '2026-02-16 20:29:35'),
(4, 2, 'Chargé de Marketing Digital (Stage)', 'Support à l\'équipe marketing digital pour la création de contenu et l\'animation des réseaux sociaux.', 'Étudiant en marketing ou communication. Maîtrise des réseaux sociaux, créativité, bonne rédaction.', 'Rabat', 3, 'part-time', 'pending', '2026-02-16 20:29:35', '2026-02-16 20:29:35'),
(5, 3, 'Ingénieur Logistique et Supply Chain', 'Stage au département supply chain pour l\'optimisation des flux et la gestion des stocks.', 'Étudiant en logistique ou génie industriel. Connaissance des outils de gestion de stock et ERP.', 'Casablanca', 4, 'full-time', 'approved', '2026-02-16 20:29:35', '2026-02-16 20:29:35'),
(6, 3, 'Assistant RH (Stage)', 'Support au département RH pour la gestion administrative, le recrutement et la formation.', 'Étudiant en gestion des ressources humaines. Bonne organisation, discrétion, maîtrise du pack Office.', 'Rabat', 3, 'full-time', 'approved', '2026-02-16 20:29:35', '2026-02-16 20:29:35'),
(7, 4, 'Ingénieur Automatisme et Contrôle-Commande', 'Stage au sein des unités industrielles de Jorf Lasfar. Participation aux projets d\'automatisation.', 'Étudiant en génie électrique ou automatisme. Connaissances des automates Siemens, supervision.', 'Jorf Lasfar', 6, 'full-time', 'approved', '2026-02-16 20:29:35', '2026-02-16 20:29:35'),
(8, 4, 'Technicien Maintenance Industrielle (Stage PFE)', 'Stage de fin d\'études en maintenance préventive et curative des équipements industriels.', 'Étudiant en BTS ou DUT maintenance industrielle. Connaissances en mécanique et électrotechnique.', 'Khouribga', 4, 'full-time', 'approved', '2026-02-16 20:29:35', '2026-02-16 20:29:35'),
(9, 5, 'Ingénieur Qualité Fournisseurs (Stage)', 'Stage au département qualité pour l\'évaluation et le suivi des fournisseurs.', 'Étudiant en qualité industrielle ou génie mécanique. Connaissances des normes ISO, outils qualité.', 'Tanger', 4, 'full-time', 'pending', '2026-02-16 20:29:35', '2026-02-16 20:29:35'),
(10, 5, 'Assistant Chef de Projet Industriel', 'Support à la gestion de projets d\'industrialisation de nouveaux produits.', 'Étudiant en gestion de projet industriel. Bonne organisation, anglais courant, maîtrise du MS Project.', 'Tanger', 5, 'full-time', 'approved', '2026-02-16 20:29:35', '2026-02-16 20:29:35'),
(12, 6, 'test', 'it\'s just a test', NULL, 'test', 3, 'remote', 'rejected', '2026-02-22 13:53:46', '2026-02-26 10:42:51'),
(13, 6, 'stage dev', 'just a stage ...', '\"maitrise python\"', 'khemisset', 1, 'remote', 'approved', '2026-02-26 09:31:20', '2026-02-26 09:33:52');

-- --------------------------------------------------------

--
-- Structure de la table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(10, 'App\\Models\\User', 17, 'auth_token', 'ead59772275318079787f66a082ff1693780396c8b72e9b54ab9ae0b6644b426', '[\"*\"]', '2026-02-25 08:56:36', NULL, '2026-02-25 08:49:36', '2026-02-25 08:56:36'),
(13, 'App\\Models\\User', 14, 'auth_token', 'dbd2824b5de2c1c2b0d734071f0afb508b54504becb3ae70455e233837785df7', '[\"*\"]', '2026-02-25 21:48:48', NULL, '2026-02-25 21:48:46', '2026-02-25 21:48:48'),
(31, 'App\\Models\\User', 19, 'auth_token', 'eca28b8ab9a3b7839e5d43e76d0f357d92ebd27e10d8282e1c05d7a830ba755a', '[\"*\"]', NULL, NULL, '2026-02-28 19:50:32', '2026-02-28 19:50:32'),
(40, 'App\\Models\\User', 22, 'auth_token', 'd7f8b0d5af09ed9d2e6dfa146b6d9e126f016cdf3fdac71c23b0db3631640aa7', '[\"*\"]', '2026-03-03 22:34:11', NULL, '2026-03-03 21:58:16', '2026-03-03 22:34:11');

-- --------------------------------------------------------

--
-- Structure de la table `students`
--

CREATE TABLE `students` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `university` varchar(150) NOT NULL,
  `specialite` varchar(100) NOT NULL,
  `graduation_year` year(4) DEFAULT NULL,
  `skills` text DEFAULT NULL,
  `cv_path` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `created_at` varchar(45) DEFAULT NULL,
  `updated_at` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `students`
--

INSERT INTO `students` (`id`, `user_id`, `university`, `specialite`, `graduation_year`, `skills`, `cv_path`, `phone`, `location`, `created_at`, `updated_at`) VALUES
(1, 1, 'Université Mohammed V - Rabat', 'Génie Informatique', '2024', 'Python, JavaScript, React, Node.js, MySQL', '/uploads/cvs/ahmed_benali_cv.pdf', NULL, NULL, NULL, NULL),
(2, 2, 'Université Al Akhawayn - Ifrane', 'Marketing et Communication', '2024', 'Social Media Marketing, Content Creation, SEO, Google Analytics', '/uploads/cvs/fatima_elidrissi_cv.pdf', NULL, NULL, NULL, NULL),
(3, 3, 'Ecole Mohammadia d\'Ingénieurs (EMI)', 'Génie Industriel', '2025', 'AutoCAD, SolidWorks, Supply Chain Management, Lean Six Sigma', '/uploads/cvs/youssef_alaoui_cv.pdf', NULL, NULL, NULL, NULL),
(4, 4, 'Ecole Supérieure des Arts Visuels - Marrakech', 'Design Graphique', '2024', 'Adobe Photoshop, Illustrator, Figma, UI/UX Design', '/uploads/cvs/khadija_bennani_cv.pdf', NULL, NULL, NULL, NULL),
(5, 5, 'Université Hassan II - Casablanca', 'Data Science', '2025', 'Python, R, SQL, Machine Learning, Tableau', '/uploads/cvs/omar_tazi_cv.pdf', NULL, NULL, NULL, NULL),
(6, 17, 'ista', 'Développement Web', NULL, '\"[\\\"python\\\",\\\"react\\\",\\\"html\\\"]\"', 'cvs/9uqcsS4MYPhArHLUqAnN8Qt72FJBE3GgAfjQn4AZ.docx', '06 22 33 44 55', 'khemisset', NULL, '2026-02-28 17:58:25'),
(7, 20, 'Non renseigné', 'Non renseigné', NULL, NULL, NULL, NULL, NULL, '2026-03-03 16:20:07', '2026-03-03 16:20:07'),
(8, 21, 'Bac+3 (Licence)', 'info', NULL, '[\"python\"]', NULL, NULL, 'PARIS', '2026-03-03 20:17:08', '2026-03-03 20:22:15');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','student','company') NOT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `profile_picture`, `bio`, `created_at`, `updated_at`) VALUES
(1, 'Ahmed Benali', 'ahmed.benali@example.com', 'hashed_password_123', 'student', '/uploads/profiles/ahmed.jpg', 'CS student passionate about web development and AI', '2026-02-16 20:29:06', '2026-02-16 20:29:06'),
(2, 'Fatima Zahra El Idrissi', 'fatima.elidrissi@example.com', 'hashed_password_456', 'student', '/uploads/profiles/fatima.jpg', 'Business student looking for marketing internship', '2026-02-16 20:29:06', '2026-02-16 20:29:06'),
(3, 'Youssef Alaoui', 'youssef.alaoui@example.com', 'hashed_password_789', 'student', '/uploads/profiles/youssef.jpg', 'Engineering student specialized in industrial systems', '2026-02-16 20:29:06', '2026-02-16 20:29:06'),
(4, 'Khadija Bennani', 'khadija.bennani@example.com', 'hashed_password_abc', 'student', '/uploads/profiles/khadija.jpg', 'Graphic design student with passion for UI/UX', '2026-02-16 20:29:06', '2026-02-16 20:29:06'),
(5, 'Omar Tazi', 'omar.tazi@example.com', 'hashed_password_def', 'student', '/uploads/profiles/omar.jpg', 'Data science enthusiast, looking for hands-on experience', '2026-02-16 20:29:06', '2026-02-16 20:29:06'),
(6, 'Karim Fassi', 'hr@attijariwafa.ma', 'hashed_password_comp1', 'company', '/uploads/companies/attijari.png', 'HR Manager at Attijariwafa Bank', '2026-02-16 20:29:06', '2026-02-16 20:29:06'),
(7, 'Salma Benjelloun', 'salma@maroctelecom.ma', 'hashed_password_comp2', 'company', '/uploads/companies/maroc-telecom.jpg', 'Tech Recruiter at Maroc Telecom', '2026-02-16 20:29:06', '2026-02-16 20:29:06'),
(8, 'Rachid El Ouafi', 'rachid@oncf.ma', 'hashed_password_comp3', 'company', '/uploads/companies/oncf.png', 'HR Director at ONCF', '2026-02-16 20:29:06', '2026-02-16 20:29:06'),
(9, 'Nadia Berrada', 'nadia@ocp.ma', 'hashed_password_comp4', 'company', '/uploads/companies/ocp.jpg', 'Talent Acquisition Specialist at OCP', '2026-02-16 20:29:06', '2026-02-16 20:29:06'),
(10, 'Mohammed Ghallab', 'mohammed@yazaki.ma', 'hashed_password_comp5', 'company', '/uploads/companies/yazaki.png', 'HR Manager at Yazaki Morocco', '2026-02-16 20:29:06', '2026-02-16 20:29:06'),
(11, 'Admin System', 'admin@stagefinder.ma', '$2y$10$p2YojVWGEWMDvxO1fFlckeS7XvueL2jrISSXeruoVAdw5y5rjExV6', 'admin', '/uploads/profiles/admin.jpg', 'Platform Administrator', '2026-02-16 20:29:06', '2026-02-22 14:52:00'),
(12, 'FATIHA ALAOUI', 'fatihaalaouimh@gmail.com', '$2y$10$znAXcS5UKEAYz.R9qQGhLelb9b0ekfeVcgCQT60ya7cuWxCzuWMmi', 'student', NULL, NULL, '2026-02-21 12:24:00', '2026-02-21 12:24:00'),
(13, 'fatiha almh', 'fthalmh0@gmail.com', '$2y$10$85GFLnabKiRGzWYPHLKOj.ymHVw6HoV1cjGzsSJHvEPPYFLSIgPfq', 'company', NULL, NULL, '2026-02-21 23:29:44', '2026-02-21 23:29:44'),
(14, 'ilyasse', 'ilyasse@gmail.com', '$2y$10$gXUq88c0YlUKJ7qDcWY2CuSs8VwsfoiXBp0wO.48TYhYO0aXWusJq', 'company', NULL, NULL, '2026-02-21 23:30:52', '2026-02-21 23:30:52'),
(16, 'Admin', 'adminadmin@stagefinder.com', '$2y$10$TOJNKqv1SSRgX.XorH7TXuGAEPZUQcpKDNjiCz2pWob/UvdpT0MiO', 'admin', NULL, NULL, '2026-02-22 14:27:54', '2026-02-26 09:56:43'),
(17, 'hiba', 'hiba@gmail.com', '$2y$10$D.mQy/YqEoL9m40.fdEWO.QzSPPbutGPptEL66OcbNlEyQbcpVTg2', 'student', NULL, 'stagiaire', '2026-02-24 21:11:50', '2026-02-25 20:10:10'),
(18, 'entreprise', 'entreprise@stageFinder.com', '$2y$10$wsM89InYOSGCjEXpiRsnIewpxPFa21ehJs7v3lLVLUZRV3F0n7qD2', 'company', NULL, NULL, '2026-02-26 11:43:19', '2026-02-26 11:43:19'),
(19, 'company', 'company@stageFinder.com', '$2y$10$CM3FJSZFnEe2lrUQHN2n6e23aofptpEewSKrQnjipuncVro5n3fCu', 'company', NULL, NULL, '2026-02-28 19:50:32', '2026-02-28 19:50:32'),
(20, 'ayman', 'ayman@stagefinder.com', '$2y$10$2lFuSk2I5Oiz4vFKu73gb.gacByxFoZol0cIU.V26pZ2jNi32pm6K', 'student', NULL, NULL, '2026-03-03 16:20:07', '2026-03-03 16:20:07'),
(21, 'yassmin', 'yassmin@stagefinder.com', '$2y$10$1guCFJblI1H41alI3fFhtub6bQA3UuaGRuDhWabrc5ceJRYn5divu', 'student', NULL, 'yassmina', '2026-03-03 20:17:08', '2026-03-03 20:22:15'),
(22, 'testentreprise', 'testentreprise@gmail.com', '$2y$10$F8oPK/C1SJnThcBsHrDRcOo/3YWroD8YGDlW3UjC14cgN1jNvSv2C', 'company', NULL, NULL, '2026-03-03 21:58:16', '2026-03-03 21:58:16');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `admin_actions`
--
ALTER TABLE `admin_actions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `admin_id` (`admin_id`);

--
-- Index pour la table `applications`
--
ALTER TABLE `applications`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_application` (`student_id`,`offer_id`),
  ADD KEY `offer_id` (`offer_id`);

--
-- Index pour la table `companies`
--
ALTER TABLE `companies`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Index pour la table `conversations`
--
ALTER TABLE `conversations`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `conversation_participants`
--
ALTER TABLE `conversation_participants`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_participant` (`conversation_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `evaluations`
--
ALTER TABLE `evaluations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `application_id` (`application_id`);

--
-- Index pour la table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Index pour la table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `conversation_id` (`conversation_id`),
  ADD KEY `sender_id` (`sender_id`);

--
-- Index pour la table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `offers`
--
ALTER TABLE `offers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `company_id` (`company_id`);

--
-- Index pour la table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Index pour la table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Index pour la table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `admin_actions`
--
ALTER TABLE `admin_actions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `applications`
--
ALTER TABLE `applications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT pour la table `companies`
--
ALTER TABLE `companies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `conversations`
--
ALTER TABLE `conversations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `conversation_participants`
--
ALTER TABLE `conversation_participants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `evaluations`
--
ALTER TABLE `evaluations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT pour la table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `offers`
--
ALTER TABLE `offers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT pour la table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT pour la table `students`
--
ALTER TABLE `students`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `admin_actions`
--
ALTER TABLE `admin_actions`
  ADD CONSTRAINT `admin_actions_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `applications`
--
ALTER TABLE `applications`
  ADD CONSTRAINT `applications_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `applications_ibfk_2` FOREIGN KEY (`offer_id`) REFERENCES `offers` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `companies`
--
ALTER TABLE `companies`
  ADD CONSTRAINT `companies_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `conversation_participants`
--
ALTER TABLE `conversation_participants`
  ADD CONSTRAINT `conversation_participants_ibfk_1` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `conversation_participants_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `evaluations`
--
ALTER TABLE `evaluations`
  ADD CONSTRAINT `evaluations_ibfk_1` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `offers`
--
ALTER TABLE `offers`
  ADD CONSTRAINT `offers_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `students_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
