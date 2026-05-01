CREATE DATABASE agriculture_db;

DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE roles (
 id SERIAL PRIMARY KEY,
 name VARCHAR(50) UNIQUE NOT NULL,
 description_fr VARCHAR(150),
 description_ar VARCHAR(150)
);

CREATE TABLE users (
 id SERIAL PRIMARY KEY,
 nom_fr VARCHAR(100) NOT NULL,
 nom_ar VARCHAR(100),
 prenom_fr VARCHAR(100) NOT NULL,
 prenom_ar VARCHAR(100),
 email VARCHAR(150) UNIQUE NOT NULL,
 password_hash TEXT NOT NULL,
 tel VARCHAR(30),
 status BOOLEAN DEFAULT TRUE,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_roles (
 user_id INT NOT NULL,
 role_id INT NOT NULL,

 PRIMARY KEY (user_id, role_id),

 CONSTRAINT fk_user
 FOREIGN KEY(user_id)
 REFERENCES users(id)
 ON DELETE CASCADE,

 CONSTRAINT fk_role
 FOREIGN KEY(role_id)
 REFERENCES roles(id)
 ON DELETE CASCADE
);

INSERT INTO roles(name,description_fr,description_ar) VALUES
('admin','Administrateur système','مدير النظام'),
('supervisor','Contrôleur','مراقب'),
('agent','Agent recenseur','عون الإحصاء');

INSERT INTO users(
 nom_fr,
 nom_ar,
 prenom_fr,
 prenom_ar,
 email,
 password_hash,
 tel
)
VALUES
(
 'Admin',
 'المدير',
 'System',
 'النظام',
 'admin@agri.dz',
 'hashed_password',
 '0550000000'
);

INSERT INTO user_roles(user_id,role_id)
VALUES (1,1);

INSERT INTO users(
 nom_fr, nom_ar,
 prenom_fr, prenom_ar,
 email, password_hash, tel
)
VALUES
('Benamar','بن عمر','Ali','علي','ali@agri.dz','hash','0551111111'),
('Brahimi','براهيمي','Karim','كريم','karim@agri.dz','hash','0552222222');

INSERT INTO user_roles(user_id,role_id)
VALUES
(2,3),
(3,3);

CREATE TABLE wilayas (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    nom_fr VARCHAR(150) NOT NULL,
    nom_ar VARCHAR(150)
);

CREATE TABLE communes (
    id SERIAL PRIMARY KEY,
    wilaya_id INT NOT NULL,
    nom_fr VARCHAR(150) NOT NULL,
    nom_ar VARCHAR(150),

    CONSTRAINT fk_commune_wilaya
        FOREIGN KEY (wilaya_id)
        REFERENCES wilayas(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_communes_wilaya ON communes(wilaya_id);

INSERT INTO wilayas(code, nom_fr, nom_ar) VALUES
('01','Adrar','أدرار'),
('02','Chlef','الشلف'),
('03','Laghouat','الأغواط'),
('04','Oum El Bouaghi','أم البواقي'),
('05','Batna','باتنة'),
('06','Béjaïa','بجاية'),
('07','Biskra','بسكرة'),
('08','Béchar','بشار'),
('09','Blida','البليدة'),
('10','Bouira','البويرة'),
('11','Tamanrasset','تمنراست'),
('12','Tébessa','تبسة'),
('13','Tlemcen','تلمسان'),
('14','Tiaret','تيارت'),
('15','Tizi Ouzou','تيزي وزو'),
('16','Alger','الجزائر'),
('17','Djelfa','الجلفة'),
('18','Jijel','جيجل'),
('19','Sétif','سطيف'),
('20','Saïda','سعيدة'),
('21','Skikda','سكيكدة'),
('22','Sidi Bel Abbès','سيدي بلعباس'),
('23','Annaba','عنابة'),
('24','Guelma','قالمة'),
('25','Constantine','قسنطينة'),
('26','Médéa','المدية'),
('27','Mostaganem','مستغانم'),
('28','M''Sila','المسيلة'),
('29','Mascara','معسكر'),
('30','Ouargla','ورقلة'),
('31','Oran','وهران'),
('32','El Bayadh','البيض'),
('33','Illizi','إليزي'),
('34','Bordj Bou Arréridj','برج بوعريريج'),
('35','Boumerdès','بومرداس'),
('36','El Tarf','الطارف'),
('37','Tindouf','تندوف'),
('38','Tissemsilt','تيسمسيلت'),
('39','El Oued','الوادي'),
('40','Khenchela','خنشلة'),
('41','Souk Ahras','سوق أهراس'),
('42','Tipaza','تيبازة'),
('43','Mila','ميلة'),
('44','Aïn Defla','عين الدفلى'),
('45','Naâma','النعامة'),
('46','Aïn Témouchent','عين تموشنت'),
('47','Ghardaïa','غرداية'),
('48','Relizane','غليزان'),
('49','Timimoun','تيميمون'),
('50','Bordj Badji Mokhtar','برج باجي مختار'),
('51','Ouled Djellal','أولاد جلال'),
('52','Béni Abbès','بني عباس'),
('53','In Salah','عين صالح'),
('54','In Guezzam','عين قزام'),
('55','Touggourt','تقرت'),
('56','Djanet','جانت'),
('57','El M''Ghair','المغير'),
('58','El Menia','المنيعة');
INSERT INTO communes (id, nom_fr, wilaya_id, nom_ar) VALUES
(1,'Adrar',1,'أدرار'),
(2,'Tamest',1,'تأماست'),
(3,'Charouine',1,'شروين'),
(4,'Reggane',1,'رڨان'),
(5,'In Zghmir',1,'ان زغمير'),
(6,'Tit',1,'تــيـــت'),
(7,'Ksar Kaddour',1,'قصر قدور'),
(8,'Tsabit',1,'تسابيت'),
(9,'Timimoun',1,'تيميمون'),
(10,'Ouled Said',1,'أولاد سعيد'),
(11,'Zaouiet Kounta',1,'زاوية كنتة'),
(12,'Aoulef',1,'أولف'),
(13,'Timokten',1,'تيمقتن'),
(14,'Tamentit',1,'تامنطيت'),
(15,'Fenoughil',1,'فنوغيل'),
(16,'Tinerkouk',1,'زاوية دباغ'),
(17,'Deldoul',1,'دﻟﺪول'),
(18,'Sali',1,'سالى'),
(19,'Akabli',1,'أقبلي'),
(20,'Metarfa',1,'المطارفة'),
(21,'Ouled Ahmed Tammi',1,'أولاد أحمد تيمى'),
(22,'Bouda',1,'بودة'),
(23,'Aougrout',1,'أوقروت'),
(24,'Talmine',1,'تالمين س'),
(25,'Bordj Badji Mokhtar',1,'برج باجي مختار'),
(26,'Sbaa',1,'السبع'),
(27,'Ouled Aissa',1,'أولاد عيسى'),
(28,'Timiaouine',1,'تيمياوين'),
(29,'Chlef',2,'الشلف'),
(30,'Tenes',2,'تنس'),
(31,'Benairia',2,'بنايرية'),
(32,'El Karimia',2,'الكريمية'),
(33,'Tadjna',2,'تاجنة'),
(34,'Taougrite',2,'تاوڨريت'),
(35,'Beni Haoua',2,'بني حواء'),
(36,'Sobha',2,'صبحة'),
(37,'Harchoun',2,'حرشون'),
(38,'Ouled Fares',2,'أولاد فارس'),
(39,'Sidi Akacha',2,'سيدي عكاشة'),
(40,'Boukadir',2,'بوقدير'),
(41,'Beni Rached',2,'بني راشد'),
(42,'Talassa',2,'تلعصة'),
(43,'Herenfa',2,'الهرنفة'),
(44,'Oued Goussine',2,'واد ڨوسين'),
(45,'Dahra',2,'الظهرة'),
(46,'Ouled Abbes',2,'أولاد عباس'),
(47,'Sendjas',2,'سنجاس'),
(48,'Zeboudja',2,'الزبوجة'),
(49,'Oued Sly',2,'واد سلي'),
(50,'Abou El Hassen',2,'أبو الحسن'),
(51,'El Marsa',2,'المرصى'),
(52,'Chettia',2,'الشطية'),
(53,'Sidi Abderrahmane',2,'سيدي عبد الرحمان'),
(54,'Moussadek',2,'مصدق'),
(55,'El Hadjadj',2,'الحجاج'),
(56,'Labiod Medjadja',2,'الأبيض مجاجة'),
(57,'Oued Fodda',2,'واد الفضة'),
(58,'Ouled Ben Abdelkader',2,'أولاد بن عبد القادر'),
(59,'Bouzghaia',2,'بوزغاية'),
(60,'Ain Merane',2,'عين مران'),
(61,'Oum Drou',2,'أم الذروع'),
(62,'Breira',2,'بريرة'),
(63,'Beni Bouateb',2,'بني بوعتاب'),
(64,'Laghouat',3,'الأغواط'),
(65,'Ksar El Hirane',3,'قصر الحيران'),
(66,'Benacer Ben Chohra',3,'بن ناصر بن شهرة'),
(67,'Sidi Makhlouf',3,'سيدي مخلوف'),
(68,'Hassi Delaa',3,'حاسي دلاعة'),
(69,'Hassi R''Mel',3,'حاسي الرمل'),
(70,'Ain Mahdi',3,'عين ماضي'),
(71,'Tadjmout',3,'تاجموت'),
(73,'Gueltat Sidi Saad',3,'قلتة سيدي سعد'),
(74,'Ain Sidi Ali',3,'عين سيدي علي'),
(75,'Beidha',3,'بيضاء'),
(76,'Brida',3,'بريدة'),
(77,'El Ghicha',3,'الغيشة'),
(78,'Hadj Mechri',3,'الحاج المشري'),
(79,'Sebgag',3,'سبقاق'),
(80,'Taouiala',3,'تاويالة'),
(81,'Tadjrouna',3,'تاجرونة'),
(82,'Aflou',3,'أفلو'),
(83,'El Assafia',3,'العسافية'),
(84,'Oued Morra',3,'وادي مرة'),
(85,'Oued M''Zi',3,'وادي مزي'),
(86,'El Haouaita',3,'الهوارية'),
(87,'Sidi Bouzid',3,'سيدي بوزيد'),
(88,'Oum El Bouaghi',4,'أم البواقي'),
(89,'Ain Beida',4,'عين البيضاء'),
(90,'Ain M''lila',4,'عين مليلة'),
(91,'Behir Chergui',4,'بحير الشرڨي'),
(92,'El Amiria',4,'العامرية'),
(93,'Sigus',4,'سيقوس'),
(94,'El Belala',4,'البلالة'),
(95,'Ain Babouche',4,'عين بابوش'),
(96,'Berriche',4,'بريش'),
(97,'Ouled Hamla',4,'أولاد حملة'),
(98,'Dhala',4,'الضلعة'),
(99,'Ain Kercha',4,'عين كرشة'),
(100,'Hanchir Toumghani',4,'هنشير تومغني'),
(101,'El Djazia',4,'الجازية'),
(102,'Ain Diss',4,'عين الديس'),
(103,'Fkirina',4,'فكرينة'),
(104,'Souk Naamane',4,'سوق نعمان'),
(105,'Zorg',4,'الزرڨ'),
(106,'El Fedjoudj Boughrara Saoudi',4,'الفجوج بوغرارة سعودى'),
(107,'Ouled Zouai',4,'أولاد زواي'),
(108,'Bir Chouhada',4,'بئر الشهداء'),
(109,'Ksar Sbahi',4,'قصر صباحي'),
(110,'Oued Nini',4,'وادي نيني'),
(111,'Meskiana',4,'مسكيانة'),
(112,'Ain Fekroune',4,'عين فكرون'),
(113,'Rahia',4,'الراحية'),
(114,'Ain Zitoun',4,'عين الزيتون'),
(115,'Ouled Gacem',4,'أولاد ڨاسم'),
(116,'El Harmilia',4,'الحرملية'),
(117,'Batna',5,'باتنة'),
(118,'Ghassira',5,'غسيرة'),
(119,'Maafa',5,'معافة'),
(120,'Merouana',5,'مروانة'),
(121,'Seriana',5,'سريانة'),
(122,'Menaa',5,'منعة'),
(123,'El Madher',5,'المعذر'),
(124,'Tazoult',5,'تازولت'),
(125,'Ngaous',5,'نڨاوس'),
(126,'Guigba',5,'قيقبة'),
(127,'Inoughissen',5,'إينوغيسن'),
(128,'Ouyoun El Assafir',5,'عيون العصافير'),
(129,'Djerma',5,'جرمة'),
(130,'Bitam',5,'بيطام'),
(131,'Metkaouak',5,'عزيل عبد القادر'),
(132,'Arris',5,'اريس'),
(133,'Kimmel',5,'كيمل'),
(134,'Tilatou',5,'تيلاطو'),
(135,'Ain Djasser',5,'عين جاسر'),
(136,'Ouled Selam',5,'أولاد سلام'),
(137,'Tigherghar',5,'تيغرغار'),
(138,'Ain Yagout',5,'عين ياقوت'),
(139,'Fesdis',5,'فسديس'),
(140,'Sefiane',5,'سفيان'),
(141,'Rahbat',5,'الرحبات'),
(142,'Tighanimine',5,'تيغانمين'),
(143,'Lemsane',5,'لمسان'),
(144,'Ksar Belezma',5,'قصر بلازمة'),
(145,'Seggana',5,'سقانة'),
(146,'Ichmoul',5,'ايشمول'),
(147,'Foum Toub',5,'فم الطوب'),
(148,'Beni Foudhala El Hakania',5,'بنى فضالة الحقانية'),
(149,'Oued El Ma',5,'واد الماء'),
(150,'Talkhamt',5,'تالخمت'),
(151,'Bouzina',5,'بوزينة'),
(152,'Chemora',5,'الشمرة'),
(153,'Oued Chaaba',5,'واد الشعبة'),
(154,'Taxlent',5,'تاكسلانت'),
(155,'Gosbat',5,'القصبات'),
(156,'Ouled Aouf',5,'أولاد عوف'),
(157,'Boumagueur',5,'بومقر'),
(158,'Barika',5,'بريكة'),
(159,'Djezzar',5,'الجزار'),
(160,'Tkout',5,'تكوت'),
(161,'Ain Touta',5,'عين التوتة'),
(162,'Hidoussa',5,'حيدوسة'),
(163,'Teniet El Abed',5,'نية العابد'),
(164,'Oued Taga',5,'وادي الطاقة'),
(165,'Ouled Fadel',5,'أولاد فاضل'),
(166,'Timgad',5,'تيمقاد'),
(167,'Ras El Aioun',5,'رأس العيون'),
(168,'Chir',5,'شير'),
(169,'Ouled Si Slimane',5,'أولاد سي سليمان'),
(170,'Zanat El Beida',5,'زانة البيضاء'),
(171,'M''doukel',5,'أمدوكال'),
(172,'Ouled Ammar',5,'أولاد عمار'),
(173,'El Hassi',5,'الحاسي'),
(174,'Lazrou',5,'لازرو'),
(175,'Boumia',5,'بومية'),
(176,'Boulhilat',5,'بولهيلات'),
(177,'Larbaa',5,'الاربعاء'),
(178,'Bejaia',6,'بجاية'),
(179,'Amizour',6,'اميزور'),
(180,'Ferraoun',6,'فرعون'),
(181,'Taourirt Ighil',6,'تاوريرت اغيل'),
(182,'Chelata',6,'شلاطة'),
(183,'Tamokra',6,'تامقرة'),
(184,'Timzrit',6,'تيمزريت'),
(185,'Souk El Thenine',6,'سوق الاثنين'),
(186,'M''cisna',6,'مسيسنة'),
(187,'Thinabdher',6,'تينبذار'),
(188,'Tichi',6,'تيشي'),
(189,'Semaoun',6,'سمعون'),
(190,'Kendira',6,'كنديرة'),
(191,'Tifra',6,'تيفرة'),
(192,'Ighram',6,'إغرم'),
(193,'Amalou',6,'امالو'),
(194,'Ighil Ali',6,'إغيل على'),
(195,'Ifelain Ilmathen',6,'افناين الماثن'),
(196,'Toudja',6,'توجة'),
(197,'Darguina',6,'درقينة'),
(198,'Sidi Ayad',6,'سيدي عياد'),
(199,'Aokas',6,'أوقاس'),
(200,'Ait Djellil',6,'آيث جليل'),
(201,'Adekar',6,'آدكار'),
(202,'Akbou',6,'أقبو'),
(203,'Seddouk',6,'صدوق'),
(204,'Tazmalt',6,'تازمالت'),
(205,'Ait R''zine',6,'آيت أرزين'),
(206,'Chemini',6,'شميني'),
(207,'Souk Oufella',6,'سوق أوفلة'),
(208,'Taskriout',6,'تاسقريوت'),
(209,'Tibane',6,'طيبان'),
(210,'Tala Hamza',6,'ثالة حمزة'),
(211,'Barbacha',6,'برباشة'),
(212,'Beni Ksila',6,'بنى كسيلة'),
(213,'Ouzallaguen',6,'أوزلاقن'),
(214,'Bouhamza',6,'بوحمزة'),
(215,'Beni Melikeche',6,'بنى مليكش'),
(216,'Sidi Aich',6,'سيدي عيش'),
(217,'El Kseur',6,'القصر'),
(218,'Melbou',6,'ملبو'),
(219,'Akfadou',6,'اكفادو'),
(220,'Leflaye',6,'لفلاى'),
(221,'Kherrata',6,'خراطة'),
(222,'Draa Kaid',6,'ذراع القايد'),
(223,'Tamridjet',6,'تامريجت'),
(224,'Ait Smail',6,'آيت سماعيل'),
(225,'Boukhelifa',6,'بوخليفة'),
(226,'Tizi N''berber',6,'تيزى نبربر'),
(227,'Beni Maouch',6,'بني معوش'),
(228,'Oued Ghir',6,'وادي غير'),
(229,'Boudjellil',6,'بوجليل'),
(230,'Biskra',7,'بسكرة'),
(231,'Oumache',7,'أوماش'),
(232,'Branis',7,'البرانس'),
(233,'Chetma',7,'شتمة'),
(234,'Ouled Djellal',7,'أولاد جلال'),
(235,'Ras El Miaad',7,'راس الميعاد'),
(236,'Besbes',7,'البسباس'),
(237,'Sidi Khaled',7,'سيدي خالد'),
(238,'Doucen',7,'الدوسن'),
(239,'Ech Chaiba',7,'أولاد رحمة'),
(240,'Sidi Okba',7,'سيدي عقبة'),
(241,'Mchouneche',7,'مشونش'),
(242,'El Haouch',7,'الحوش'),
(243,'Ain Naga',7,'عين الناقة'),
(244,'Zeribet El Oued',7,'زريبة الوادي'),
(245,'El Feidh',7,'الفيض'),
(246,'El Kantara',7,'القنطرة'),
(247,'Ain Zaatout',7,'عين زعطوط'),
(248,'El Outaya',7,'لوطاية'),
(249,'Djemorah',7,'جمورة'),
(250,'Tolga',7,'طولقة'),
(251,'Lioua',7,'لواء'),
(252,'Lichana',7,'لشانة'),
(253,'Ourlal',7,'أورلال'),
(254,'M''lili',7,'مليلي'),
(255,'Foughala',7,'فوغالة'),
(256,'Bordj Ben Azzouz',7,'برج بن عزوز'),
(257,'M''ziraa',7,'مزيرعة'),
(258,'Bouchagroun',7,'بوشقرون'),
(259,'Mekhadma',7,'مخادمة'),
(260,'El Ghrous',7,'الغروس'),
(261,'El Hadjab',7,'الحاجب'),
(262,'Khanguet Sidinadji',7,'خنڨة سيدي ناجي'),
(263,'Bechar',8,'بشار'),
(264,'Erg Ferradj',8,'عرق فراج'),
(265,'Ouled Khoudir',8,'أولاد خدير'),
(266,'Meridja',8,'مريجة'),
(267,'Timoudi',8,'تيمودى'),
(268,'Lahmar',8,'لحمر'),
(269,'Beni Abbes',8,'بني عباس'),
(270,'Beni Ikhlef',8,'بني يخلف'),
(271,'Mechraa Houari Boumedienne',8,'مشرع ھوارى بومدين'),
(272,'Kenedsa',8,'القنادسة'),
(273,'Igli',8,'إقلي'),
(274,'Tabalbala',8,'تبلبالة'),
(275,'Taghit',8,'تاغيث'),
(276,'El Ouata',8,'الوطى'),
(277,'Boukais',8,'بوكايس'),
(278,'Mogheul',8,'موغل'),
(279,'Abadla',8,'العبادلة'),
(280,'Kerzaz',8,'كرزاز'),
(281,'Ksabi',8,'قصابى'),
(282,'Tamtert',8,'تامترت'),
(283,'Beni Ounif',8,'بني ونيف'),
(284,'Blida',9,'البليدة'),
(285,'Chebli',9,'الشبلي'),
(286,'Bouinan',9,'بوعينان'),
(287,'Oued El Alleug',9,'واد العلايڨ'),
(288,'Ouled Yaich',9,'اولاد يعيش'),
(289,'Chrea',9,'الشريعة'),
(290,'El Affroun',9,'العفرون'),
(291,'Chiffa',9,'الشفة'),
(292,'Hammam Melouane',9,'حمام ملوان'),
(293,'Ben Khlil',9,'بني خليل'),
(294,'Soumaa',9,'صومعة'),
(295,'Mouzaia',9,'موزاية'),
(296,'Souhane',9,'صوحان'),
(297,'Meftah',9,'مفتاح'),
(298,'Ouled Selama',9,'أولاد سلامة'),
(299,'Boufarik',9,'بوفاريك'),
(300,'Larbaa',9,'الاربعاء'),
(301,'Oued Djer',9,'واد جر'),
(302,'Beni Tamou',9,'بني تامو'),
(303,'Bouarfa',9,'بوعرفة'),
(304,'Beni Mered',9,'بني مراد'),
(305,'Bougara',9,'بوڨرة'),
(306,'Guerrouaou',9,'ڨرواو'),
(307,'Ain Romana',9,'عين الرمانة'),
(308,'Djebabra',9,'جبابرة'),
(309,'Bouira',10,'البويرة'),
(310,'El Asnam',10,'الأصنام'),
(311,'Guerrouma',10,'قرومة'),
(312,'Souk El Khemis',10,'سوق الخميس'),
(313,'Kadiria',10,'قادرية'),
(314,'Hanif',10,'احنيف'),
(315,'Dirah',10,'ديرة'),
(316,'Ait Laaziz',10,'آيت لعزيز'),
(317,'Taghzout',10,'تاغزوت'),
(318,'Raouraoua',10,'الروراوة'),
(319,'Mezdour',10,'مسدور'),
(320,'Haizer',10,'حيزر'),
(321,'Lakhdaria',10,'الأخضرية'),
(322,'Maala',10,'معالة'),
(323,'El Hachimia',10,'الهاشمية'),
(324,'Aomar',10,'أعمر'),
(325,'Chorfa',10,'الشرفاء'),
(326,'Bordj Oukhriss',10,'برج أوخريص'),
(327,'El Adjiba',10,'العجيبة'),
(328,'El Hakimia',10,'الحاكمية'),
(329,'El Khebouzia',10,'الخبوزية'),
(330,'Ahl El Ksar',10,'أھل القصر'),
(331,'Bouderbala',10,'بودربالة'),
(332,'Zbarbar',10,'زبربر'),
(333,'Ain El Hadjar',10,'عين الحجر'),
(334,'Djebahia',10,'الجباحية'),
(335,'Aghbalou',10,'أغبالو'),
(336,'Taguedit',10,'تاڨديت'),
(337,'Ain Turk',10,'عين الترك'),
(338,'Saharidj',10,'الصهاريج'),
(339,'Dechmia',10,'الدشمية'),
(340,'Ridane',10,'ريدان'),
(341,'Bechloul',10,'بشلول'),
(342,'Boukram',10,'بوكرام'),
(343,'Ain Bessam',10,'عين بسام'),
(344,'Bir Ghbalou',10,'بئر غبالو'),
(345,'Mchedallah',10,'مشدا الله'),
(346,'Sour El Ghozlane',10,'سور الغزلان'),
(347,'Maamora',10,'المعمورة'),
(348,'Ouled Rached',10,'أولاد راشد'),
(349,'Ain Laloui',10,'عين العلوي'),
(350,'Hadjera Zerga',10,'الحجرة الزرقاء'),
(351,'Ath Mansour',10,'آث منصور'),
(352,'El Mokrani',10,'المقراني'),
(353,'Oued El Berdi',10,'وادى البردي'),
(354,'Tamanrasset',11,'تمنراست'),
(355,'Abalessa',11,'أبلسة'),
(356,'In Ghar',11,'عين غار'),
(357,'In Guezzam',11,'عين قزام'),
(358,'Idles',11,'إدلس'),
(359,'Tazouk',11,'تاظروك'),
(360,'Tinzaouatine',11,'تين زاوتين'),
(361,'In Salah',11,'عين صالح'),
(362,'In Amguel',11,'ان أمقل'),
(363,'Foggaret Ezzaouia',11,'فقارة الزوى'),
(364,'Tebessa',12,'تبسة'),
(365,'Bir El Ater',12,'بئر العاتر'),
(366,'Cheria',12,'الشريعة'),
(367,'Stah Guentis',12,'سطح قنطيس'),
(368,'El Aouinet',12,'العوينات'),
(369,'Lahouidjbet',12,'الحويجبات'),
(370,'Safsaf El Ouesra',12,'صفصاف الوسرة'),
(371,'Hammamet',12,'الحمامات'),
(372,'Negrine',12,'نقرين'),
(373,'Bir El Mokadem',12,'بئر مقدم'),
(374,'El Kouif',12,'الكويف'),
(375,'Morsott',12,'مرسط'),
(376,'El Ogla',12,'العقلة'),
(377,'Bir Dheb',12,'بئير الذھب'),
(378,'El Ogla',12,'العقلة'),
(379,'Gorriguer',12,'قوريقر'),
(380,'Bekkaria',12,'بكارية'),
(381,'Boukhadra',12,'بوخضرة'),
(382,'Ouenza',12,'الونزة'),
(383,'El Ma El Biodh',12,'الماء الأبيض'),
(384,'Oum Ali',12,'أم على'),
(385,'Tlidjene',12,'ثليجان'),
(386,'Ain Zerga',12,'عين الزرقاء'),
(387,'El Meridj',12,'المريج'),
(388,'Boulhaf Dyr',12,'بولحاف الدير'),
(389,'Bedjene',12,'بجن'),
(390,'El Mazeraa',12,'المزرعة'),
(391,'Ferkane',12,'فركان'),
(392,'Tlemcen',13,'تلمسان'),
(393,'Beni Mester',13,'بني مستار'),
(394,'Ain Tallout',13,'عين تالوت'),
(395,'Remchi',13,'الرمشي'),
(396,'El Fehoul',13,'الفحول'),
(397,'Sabra',13,'صبرة'),
(398,'Ghazaouet',13,'الغزوات'),
(399,'Souani',13,'السواني'),
(400,'Djebala',13,'جبالة'),
(401,'El Gor',13,'الغور'),
(402,'Oued Chouly',13,'وادى الشولى'),
(403,'Ain Fezza',13,'عين فزّة'),
(404,'Ouled Mimoun',13,'أولاد ميمون'),
(405,'Amieur',13,'عمير'),
(406,'Ain Youcef',13,'عين يوسف'),
(407,'Zenata',13,'زناتة'),
(408,'Beni Snous',13,'بنى سنوس'),
(409,'Bab El Assa',13,'باب العسة'),
(410,'Dar Yaghmouracene',13,'دار يغمراسن'),
(411,'Fellaoucene',13,'فلاوسن'),
(412,'Azails',13,'العزايل'),
(413,'Sebbaa Chioukh',13,'سبعة شيوخ'),
(414,'Terni Beni Hediel',13,'تيرني بني هديل'),
(415,'Bensekrane',13,'بن سكران'),
(416,'Ain Nehala',13,'عين نحالة'),
(417,'Hennaya',13,'الحناية'),
(418,'Maghnia',13,'مغنية'),
(419,'Hammam Boughrara',13,'حمام بوغرارة'),
(420,'Souahlia',13,'تونان'),
(421,'Msirda Fouaga',13,'مسيردة الفواقة'),
(422,'Ain Fetah',13,'عين فتاح'),
(423,'El Aricha',13,'العريشة'),
(424,'Souk Thlata',13,'سوق الثلاثاء'),
(425,'Sidi Abdelli',13,'سيدي العبدلي'),
(426,'Sebdou',13,'سبدو'),
(427,'Beni Ouarsous',13,'برج عريمة'),
(428,'Sidi Medjahed',13,'سيدي مجاهد'),
(429,'Beni Boussaid',13,'بني بوسعيد'),
(430,'Marsa Ben Mhidi',13,'مرسى بن مھيدي'),
(431,'Nedroma',13,'ندرومة'),
(432,'Sidi Djillali',13,'سيدي الجيلالي'),
(433,'Beni Bahdel',13,'بني بهدل'),
(434,'El Bouihi',13,'البويھي'),
(435,'Honaine',13,'هنين'),
(436,'Tianet',13,'تيانت'),
(437,'Ouled Riyah',13,'أولاد رياح'),
(438,'Bouhlou',13,'بوحلو'),
(439,'Souk El Khemis',13,'سوق الخميس'),
(440,'Ain Ghoraba',13,'عين غرابة'),
(441,'Chetouane',13,'شتوان'),
(442,'Mansourah',13,'المنصورة'),
(443,'Beni Semiel',13,'بني مستار'),
(444,'Ain Kebira',13,'عين الكبيرة'),
(445,'Tiaret',14,'تيارت'),
(446,'Medroussa',14,'مدروسة'),
(447,'Ain Bouchekif',14,'بوشقيف'),
(448,'Sidi Ali Mellal',14,'سيدي علي ملال'),
(449,'Ain Zarit',14,'عين زاريت'),
(450,'Ain Deheb',14,'عين الذهب'),
(451,'Sidi Bakhti',14,'سيدي بختي'),
(452,'Medrissa',14,'مدريسة'),
(453,'Zmalet El Emir Aek',14,'زمالة الأمير عبد القادر'),
(454,'Madna',14,'مادنة'),
(455,'Sebt',14,'السبت'),
(456,'Mellakou',14,'ملاكو'),
(457,'Dahmouni',14,'دحموني'),
(458,'Rahouia',14,'رحوية'),
(459,'Mahdia',14,'المھدية'),
(460,'Sougueur',14,'سوقر'),
(461,'Sidi Abdelghani',14,'سيدي عبد الغنى'),
(462,'Ain El Hadid',14,'عين الحديد'),
(463,'Ouled Djerad',14,'اولاد جراد'),
(464,'Naima',14,'نعيمة'),
(465,'Meghila',14,'مغيلة'),
(466,'Guertoufa',14,'قرطوفة'),
(467,'Sidi Hosni',14,'سيدي حسني'),
(468,'Djillali Ben Amar',14,'جيلالي بن عمار'),
(469,'Sebaine',14,'سبعين'),
(470,'Tousnina',14,'توسنينة'),
(471,'Frenda',14,'فرندة'),
(472,'Ain Kermes',14,'عين كرمس'),
(473,'Ksar Chellala',14,'قصر الشلالة'),
(474,'Rechaiga',14,'الرشايقة'),
(475,'Nadorah',14,'ملاكو'),
(476,'Tagdemt',14,'تاقدمت'),
(477,'Oued Lilli',14,'وادى ليلى'),
(478,'Mechraa Safa',14,'مشرع الصفاء'),
(479,'Hamadia',14,'الحمادية'),
(480,'Chehaima',14,'شحيمة'),
(481,'Takhemaret',14,'تاخمرت'),
(482,'Sidi Abderrahmane',14,'سيدي عبدالرحمان'),
(483,'Serghine',14,'سرغين'),
(484,'Bougara',14,'بوقرة'),
(485,'Faidja',14,'الفايجة'),
(486,'Tidda',14,'تيدة'),
(487,'Tizi Ouzou',15,'تيزي وزو'),
(488,'Ain El Hammam',15,'عين الحمام'),
(489,'Akbil',15,'أقبيل'),
(490,'Freha',15,'فريحة'),
(491,'Souamaa',15,'صوامع'),
(492,'Mechtrass',15,'مشطراس'),
(493,'Irdjen',15,'إرجن'),
(494,'Timizart',15,'تيميزارت'),
(495,'Makouda',15,'ماكودة'),
(496,'Draa El Mizan',15,'ذراع الميزان'),
(497,'Tizi Ghenif',15,'تيزي غنيف'),
(498,'Bounouh',15,'بونوح'),
(499,'Ait Chaffaa',15,'آيت شفعة'),
(500,'Frikat',15,'فريقات'),
(501,'Beni Aissi',15,'بني عيسي'),
(502,'Beni Zmenzer',15,'أيت زمنزر'),
(503,'Iferhounene',15,'إيفرحونن'),
(504,'Azazga',15,'عزازقة'),
(505,'Iloula Oumalou',15,'إيلولة أمالو'),
(506,'Yakouren',15,'اعكورن'),
(507,'Larba Nait Irathen',15,'الأربعاء نايت إيراثن'),
(508,'Tizi Rached',15,'تيزي راشد'),
(509,'Zekri',15,'زكري'),
(510,'Ouaguenoun',15,'واقنون'),
(511,'Ain Zaouia',15,'عين الزاوية'),
(512,'Mkira',15,'مكيرة'),
(513,'Ait Yahia',15,'أيت يحي'),
(514,'Ait Mahmoud',15,'أيت محمود'),
(515,'Maatka',15,'المعاتقة'),
(516,'Ait Boumehdi',15,'آيت بومھدى'),
(517,'Abi Youcef',15,'أبي يوسف'),
(518,'Beni Douala',15,'بني دوالة'),
(519,'Illilten',15,'إليلتن'),
(520,'Bouzguen',15,'بوزقن'),
(521,'Ait Aggouacha',15,'أيت أقواشة'),
(522,'Ouadhia',15,'واضية'),
(523,'Azzefoun',15,'أزفون'),
(524,'Tigzirt',15,'تقزيرت'),
(525,'Ait Aissa Mimoun',15,'آيت عيسى ميمون'),
(526,'Boghni',15,'بوغني'),
(527,'Ifigha',15,'ايفيغاء'),
(528,'Ait Oumalou',15,'آيت أومالو'),
(529,'Tirmitine',15,'ترمتين'),
(530,'Akerrou',15,'أقرو'),
(531,'Yatafen',15,'يطافن'),
(532,'Beni Ziki',15,'بنى زيكى'),
(533,'Draa Ben Khedda',15,'ذراع بن خدة'),
(534,'Ouacif',15,'واسيف'),
(535,'Idjeur',15,'آجر'),
(536,'Mekla',15,'مقلع'),
(537,'Tizi Nthlata',15,'تيزي نثلاثة'),
(538,'Beni Yenni',15,'بني يني'),
(539,'Aghrib',15,'أغريب'),
(540,'Iflissen',15,'إفليسن'),
(541,'Boudjima',15,'بوجيمة'),
(542,'Ait Yahia Moussa',15,'أيت يحي موسى'),
(543,'Souk El Thenine',15,'سوق الإثنين'),
(544,'Ait Khelil',15,'أيت خليلي'),
(545,'Sidi Naamane',15,'سيدي نعمان'),
(546,'Iboudraren',15,'أبودرارن'),
(547,'Agouni Gueghrane',15,'آقنى قغران'),
(548,'Mizrana',15,'مزرانة'),
(549,'Imsouhal',15,'إمسوحال'),
(550,'Tadmait',15,'تادمايت'),
(551,'Ait Bouadou',15,'أيت بوعدو'),
(552,'Assi Youcef',15,'أسي يوسف'),
(553,'Ait Toudert',15,'أيت تودرت'),
(554,'Alger Centre',16,'الجزائر الوسطى'),
(555,'Sidi Mhamed',16,'سيدي امحمد'),
(556,'El Madania',16,'المدنية'),
(557,'Belouizdad',16,'بلوزداد'),
(558,'Bab El Oued',16,'باب الواد'),
(559,'Bologhine',16,'بولوغين'),
(560,'Casbah',16,'القصبة'),
(561,'Oued Koriche',16,'وادي قريش'),
(562,'Bir Mourad Rais',16,'بير مراد رايس'),
(563,'El Biar',16,'الآبيار'),
(564,'Bouzareah',16,'بوزريعة'),
(565,'Birkhadem',16,'بئر خادم'),
(566,'El Harrach',16,'الحراش'),
(567,'Baraki',16,'براقي'),
(568,'Oued Smar',16,'وادي سمار'),
(569,'Bourouba',16,'بوروبة'),
(570,'Hussein Dey',16,'حسين داي'),
(571,'Kouba',16,'القبة'),
(572,'Bachedjerah',16,'باش جراح'),
(573,'Dar El Beida',16,'الدار البيضاء'),
(574,'Bab Azzouar',16,'باب الزوار'),
(575,'Ben Aknoun',16,'بن عكنون'),
(576,'Dely Ibrahim',16,'دالي ابراهيم'),
(577,'El Hammamet',16,'الحمامات'),
(578,'Rais Hamidou',16,'الرايس حميدو'),
(579,'Djasr Kasentina',16,'جسر قسنطينة'),
(580,'El Mouradia',16,'المرادية'),
(581,'Hydra',16,'حيدرة'),
(582,'Mohammadia',16,'المحمدية'),
(583,'Bordj El Kiffan',16,'برج الكيفان'),
(584,'El Magharia',16,'المقرية'),
(585,'Beni Messous',16,'بني مسوس'),
(586,'Les Eucalyptus',16,'الكليتوس'),
(587,'Birtouta',16,'بئر توتة'),
(588,'Tassala El Merdja',16,'تسالة المرجة'),
(589,'Ouled Chebel',16,'أولاد الشبل'),
(590,'Sidi Moussa',16,'سيدي موسى'),
(591,'Ain Taya',16,'عين طاية'),
(592,'Bordj El Bahri',16,'برج البحري'),
(593,'Marsa',16,'المرسى'),
(594,'Haraoua',16,'هراوة'),
(595,'Rouiba',16,'رويبة'),
(596,'Reghaia',16,'الرغاية'),
(597,'Ain Benian',16,'عين بنيان'),
(598,'Staoueli',16,'سطاوالي'),
(599,'Zeralda',16,'زرالدة'),
(600,'Mahelma',16,'محالمة'),
(601,'Rahmania',16,'رحمانية'),
(602,'Souidania',16,'سويدانية'),
(603,'Cheraga',16,'شراقة'),
(604,'Ouled Fayet',16,'أولاد فايت'),
(605,'El Achour',16,'العاشور'),
(606,'Draria',16,'درارية'),
(607,'Douera',16,'دويرة'),
(608,'Baba Hassen',16,'بابا حسن'),
(609,'Khracia',16,'خرايسية'),
(610,'Saoula',16,'السحاولة'),
(611,'Djelfa',17,'الجلفة'),
(612,'Moudjebara',17,'مجبرة'),
(613,'El Guedid',17,'القديد'),
(614,'Hassi Bahbah',17,'حاسي بحبح'),
(615,'Ain Maabed',17,'عين معبد'),
(616,'Sed Rahal',17,'سد رحال'),
(617,'Feidh El Botma',17,'فيض البطمة'),
(618,'Birine',17,'البيرين'),
(619,'Bouira Lahdeb',17,'بويرة الأحداب'),
(620,'Zaccar',17,'زكار'),
(621,'El Khemis',17,'الخميس'),
(622,'Sidi Baizid',17,'سيدي بايزيد'),
(623,'M''Liliha',17,'المليليحة'),
(624,'El Idrissia',17,'الإدريسية'),
(625,'Douis',17,'الدويس'),
(626,'Hassi El Euch',17,'حاسي العش'),
(627,'Messaad',17,'مسعد'),
(628,'Guettara',17,'قتارة'),
(629,'Sidi Ladjel',17,'سيدي لعجال'),
(630,'Had Sahary',17,'حد الصحاري'),
(631,'Guernini',17,'القرنيني'),
(632,'Selmana',17,'سلمانة'),
(633,'Ain Chouhada',17,'عين الشهداء'),
(634,'Oum Laadham',17,'ام العظام'),
(635,'Dar Chouikh',17,'دار الشيوخ'),
(636,'Charef',17,'الشارف'),
(637,'Beni Yacoub',17,'بن يعقوب'),
(638,'Zaafrane',17,'الزعفران'),
(639,'Deldoul',17,'دلدول'),
(640,'Ain El Ibel',17,'عين الابل'),
(641,'Ain Oussera',17,'عين وسارة'),
(642,'Benhar',17,'بنهار'),
(643,'Hassi Fedoul',17,'حاسي فدول'),
(644,'Amourah',17,'عمورة'),
(645,'Ain Fekka',17,'عين افقة'),
(646,'Tadmit',17,'تعضميت'),
(647,'Jijel',18,'جيجل'),
(648,'Erraguene',18,'إراڨن'),
(649,'El Aouana',18,'العوانة'),
(650,'Ziamma Mansouriah',18,'زيامة منصورية'),
(651,'Taher',18,'الطاهير'),
(652,'Emir Abdelkader',18,'الامير عبد القادر'),
(653,'Chekfa',18,'الشقفة'),
(654,'Chahna',18,'الشحنة'),
(655,'El Milia',18,'الميلية'),
(656,'Sidi Maarouf',18,'سيدي معروف'),
(657,'Settara',18,'السطارة'),
(658,'El Ancer',18,'العنصر'),
(659,'Sidi Abdelaziz',18,'سيدي عبد العزيز'),
(660,'Kaous',18,'قاوس'),
(661,'Ghebala',18,'غبالة'),
(662,'Bouraoui Belhadef',18,'بوراوي بلهادف'),
(663,'Djmila',18,'جيملة'),
(664,'Selma Benziada',18,'سلمى بن زيادة'),
(665,'Boussif Ouled Askeur',18,'أولاد عسكر'),
(666,'El Kennar Nouchfi',18,'القنار'),
(667,'Ouled Yahia Khadrouch',18,'اولاد يحيى'),
(668,'Boudria Beni Yadjis',18,'بودريعة بن ياجيس'),
(669,'Kemir Oued Adjoul',18,'بني بلعيد'),
(670,'Texena',18,'تاكسنة'),
(671,'Djemaa Beni Habibi',18,'الجمعة بني حبيبي'),
(672,'Bordj T''her',18,'برج الطهر'),
(673,'Ouled Rabah',18,'ولاد رابح'),
(674,'Ouadjana',18,'وجانة'),
(675,'Setif',19,'سطيف'),
(676,'Ain El Kebira',19,'عين الكبيرة'),
(677,'Beni Aziz',19,'بني عزيز'),
(678,'Ouled Sidi Ahmed',19,'أولاد سي أحمد'),
(679,'Boutaleb',19,'بوطالب'),
(680,'Ain Roua',19,'عين الروى'),
(681,'Draa Kebila',19,'ذراع قبيلة'),
(682,'Bir El Arch',19,'بئر العرش'),
(683,'Beni Chebana',19,'بني شبانة'),
(684,'Ouled Tebben',19,'أولاد تبان'),
(685,'Hamma',19,'حامة'),
(686,'Maaouia',19,'معاوية'),
(687,'Ain Legraj',19,'عين لڨراج'),
(688,'Ain Abessa',19,'عين عباسة'),
(689,'Dehamcha',19,'الدهامشة'),
(690,'Babor',19,'بابور'),
(691,'Guidjel',19,'قجال'),
(692,'Ain Lahdjar',19,'عين لحجر'),
(693,'Bousselam',19,'بوسلام'),
(694,'El Eulma',19,'العلمة'),
(695,'Djemila',19,'جميلة'),
(696,'Beni Ouartilane',19,'بني ورتيلان'),
(697,'Rosfa',19,'الرصفة'),
(698,'Ouled Addouane',19,'أولاد عدوان'),
(699,'Belaa',19,'البلاعة'),
(700,'Ain Arnat',19,'عين أرنات'),
(701,'Amoucha',19,'عموشة'),
(702,'Ain Oulmane',19,'عين ولمان'),
(703,'Beidha Bordj',19,'بيضاء برج'),
(704,'Bouandas',19,'بوعنداس'),
(705,'Bazer Sakhra',19,'بازر الصخرة'),
(706,'Hammam Essokhna',19,'حمام السخنة'),
(707,'Mezloug',19,'مزلوق'),
(708,'Bir Haddada',19,'بئر حدادة'),
(709,'Serdj El Ghoul',19,'سرج الغول'),
(710,'Harbil',19,'حربيل'),
(711,'El Ouricia',19,'الأورسية'),
(712,'Tizi Nbechar',19,'تيزي نبشار'),
(713,'Salah Bey',19,'صالح باي'),
(714,'Ain Azal',19,'عين أزال'),
(715,'Guenzet',19,'ڨنزات'),
(716,'Talaifacene',19,'تالة إيفاسن'),
(717,'Bougaa',19,'بوقاعة'),
(718,'Beni Fouda',19,'بني فودة'),
(719,'Tachouda',19,'تاشودة'),
(720,'Beni Mouhli',19,'إيث موحلي'),
(721,'Ouled Sabor',19,'أولاد صابر'),
(722,'Guellal',19,'قلال'),
(723,'Ain Sebt',19,'عين السبت'),
(724,'Hammam Guergour',19,'حمام قرقور'),
(725,'Ait Naoual Mezada',19,'آيت نوال مزادة'),
(726,'Ksar El Abtal',19,'قصرالأبطال'),
(727,'Beni Hocine',19,'بني حسين'),
(728,'Ait Tizi',19,'آيت تيزي'),
(729,'Maouklane',19,'موكلان'),
(730,'Guelta Zerka',19,'القلتة الزرقاء'),
(731,'Oued El Barad',19,'واد البارد'),
(732,'Taya',19,'طاية'),
(733,'El Ouldja',19,'الولجة'),
(734,'Tella',19,'التلة'),
(735,'Saida',20,'سعيدة'),
(736,'Doui Thabet',20,'دوى ثابت'),
(737,'Ain El Hadjar',20,'عين الحجر'),
(738,'Ouled Khaled',20,'أولاد خالد'),
(739,'Moulay Larbi',20,'موالي العربي'),
(740,'Youb',20,'يوب'),
(741,'Hounet',20,'هونت'),
(742,'Sidi Amar',20,'يدي عمر'),
(743,'Sidi Boubekeur',20,'سيدي بوبكر'),
(744,'El Hassasna',20,'حساسنة'),
(745,'Maamora',20,'معمورة'),
(746,'Sidi Ahmed',20,'سيدي أحمد'),
(747,'Ain Sekhouna',20,'العين السخونة'),
(748,'Ouled Brahim',20,'أولاد ابراھيم'),
(749,'Tircine',20,'تيرسين'),
(750,'Ain Soltane',20,'عين السلطان'),
(751,'Skikda',21,'سكيكدة'),
(752,'Ain Zouit',21,'عين زويت'),
(753,'El Hadaik',21,'الحدايق'),
(754,'Azzaba',21,'عزابة'),
(755,'Djendel',21,'جندل'),
(756,'Ain Cherchar',21,'عين شرشار'),
(757,'Bekkouche Lakhdar',21,'بكوش لخضر'),
(758,'Ben Azzouz',21,'بن عزوز'),
(759,'Es Sebt',21,'السبت'),
(760,'Collo',21,'القل'),
(761,'Beni Zid',21,'بنى زيد'),
(762,'Kerkera',21,'كركرة'),
(763,'Ouled Attia',21,'أولاد عطية'),
(764,'Oued Zehour',21,'وادي الزهور'),
(765,'Zitouna',21,'الزيتونة'),
(766,'El Harrouch',21,'الحروش'),
(767,'Zerdazas',21,'زردازة'),
(768,'Ouled Hebaba',21,'أولاد حبابة'),
(769,'Sidi Mezghiche',21,'سيدي مزغيش'),
(770,'Emdjez Edchich',21,'مجاز الدشيش'),
(771,'Beni Oulbane',21,'بني والبان'),
(772,'Ain Bouziane',21,'عين بوزيان'),
(773,'Ramdane Djamel',21,'رمضان جمال'),
(774,'Beni Bachir',21,'بني بشير'),
(775,'Salah Bouchaour',21,'صالح بوالشعور'),
(776,'Tamalous',21,'تمالوس'),
(777,'Ain Kechra',21,'عين قشرة'),
(778,'Oum Toub',21,'أم الطوب'),
(779,'Bein El Ouiden',21,'بين الويدان'),
(780,'Filfila',21,'فلفلة'),
(781,'Cheraia',21,'الشرايع'),
(782,'Kanoua',21,'قنواع'),
(783,'El Ghedir',21,'الغدير'),
(784,'Bouchtata',21,'بوشطاطة'),
(785,'Ouldja Boulbalout',21,'الولجة بو البلوط'),
(786,'Kheneg Mayoum',21,'خنق مايوم'),
(787,'Hamadi Krouma',21,'حمادي كرومة'),
(788,'El Marsa',21,'المرسى'),
(789,'Sidi Bel Abbes',22,'سيدي بلعباس'),
(790,'Tessala',22,'تسالة'),
(791,'Sidi Brahim',22,'سيدي ابراهيم'),
(792,'Mostefa Ben Brahim',22,'مصطفى بن ابراهيم'),
(793,'Telagh',22,'تلاغ'),
(794,'Mezaourou',22,'مزاورو'),
(795,'Boukhanafis',22,'بوخنفيس'),
(796,'Sidi Ali Boussidi',22,'سيدي علي بوسيدي'),
(797,'Badredine El Mokrani',22,'بدر الدين المقراني'),
(798,'Marhoum',22,'مرحوم'),
(799,'Tafissour',22,'تفسور'),
(800,'Amarnas',22,'العمارنة'),
(801,'Tilmouni',22,'تلموني'),
(802,'Sidi Lahcene',22,'سيدي لحسن'),
(803,'Ain Thrid',22,'عين التريد'),
(804,'Makedra',22,'مكدرة'),
(805,'Tenira',22,'تنيرة'),
(806,'Moulay Slissen',22,'مولاي سليسن'),
(807,'El Hacaiba',22,'الحصيبة'),
(808,'Hassi Zehana',22,'حاسي زهانة'),
(809,'Tabia',22,'طابية'),
(810,'Merine',22,'مرين'),
(811,'Ras El Ma',22,'رأس الماء'),
(812,'Ain Tindamine',22,'عين تندامين'),
(813,'Ain Kada',22,'عين قادة'),
(814,'Mcid',22,'مسيد'),
(815,'Sidi Khaled',22,'سيدي خالد'),
(816,'Ain El Berd',22,'عين البرد'),
(817,'Sfissef',22,'سفيزف'),
(818,'Ain Adden',22,'عين عدان'),
(819,'Oued Taourira',22,'واد تاوريرة'),
(820,'Dhaya',22,'الظاية'),
(821,'Zerouala',22,'زروالة'),
(822,'Lamtar',22,'لمطار'),
(823,'Sidi Chaib',22,'سيدي شعيب'),
(824,'Sidi Dahou',22,'سيدي دحو'),
(825,'Oued Sbaa',22,'واد السبع'),
(826,'Boudjebaa El Bordj',22,'بوجبهة البرج'),
(827,'Sehala Thaoura',22,'سهالة الثورة'),
(828,'Sidi Yacoub',22,'سيدي يعقوب'),
(829,'Sidi Hamadouche',22,'سيدي حمادوش'),
(830,'Belarbi',22,'بلعربي'),
(831,'Oued Sefioun',22,'واد سفيون'),
(832,'Teghalimet',22,'تغاليمت'),
(833,'Ben Badis',22,'ابن باديس'),
(834,'Sidi Ali Benyoub',22,'سيدي علي بن يوب'),
(835,'Chetouane Belaila',22,'شطوان بلايلة'),
(836,'Bir El Hammam',22,'بئر الحمام'),
(837,'Taoudmout',22,'تاودموت'),
(838,'Redjem Demouche',22,'رجم دموش'),
(839,'Benachiba Chelia',22,'بن عشيبة شلية'),
(840,'Hassi Dahou',22,'حاسي دحو'),
(841,'Annaba',23,'عنابة'),
(842,'Berrahel',23,'برحال'),
(843,'El Hadjar',23,'الحجار'),
(844,'Eulma',23,'العلمة'),
(845,'El Bouni',23,'البوني'),
(846,'Oued El Aneb',23,'وادي العنب'),
(847,'Cheurfa',23,'الشرفة'),
(848,'Seraidi',23,'سرايدي'),
(849,'Ain Berda',23,'عين الباردة'),
(850,'Chetaibi',23,'شطايبي'),
(851,'Sidi Amer',23,'سيدي عمار'),
(852,'Treat',23,'التريعات'),
(853,'Guelma',24,'قالمة'),
(854,'Nechmaya',24,'نشماية'),
(855,'Bouati Mahmoud',24,'بوعاتي محمود'),
(856,'Oued Zenati',24,'وادي الزناتي'),
(857,'Tamlouka',24,'تاملوكة'),
(858,'Oued Fragha',24,'وادي فراغة'),
(859,'Ain Sandel',24,'عين صندل'),
(860,'Ras El Agba',24,'راس العقبة'),
(861,'Dahouara',24,'الدهوارة'),
(862,'Belkhir',24,'بلخير'),
(863,'Ben Djarah',24,'بن جراح'),
(864,'Bou Hamdane',24,'بوحمدان'),
(865,'Ain Makhlouf',24,'عين مخلوف'),
(866,'Ain Ben Beida',24,'عين بن بيضاء'),
(867,'Khezara',24,'خزارة'),
(868,'Beni Mezline',24,'بني مزلين'),
(869,'Bou Hachana',24,'بوحشانة'),
(870,'Guelaat Bou Sbaa',24,'قلعة بوصبع'),
(871,'Hammam Maskhoutine',24,'حمام مسخوطين'),
(872,'El Fedjoudj',24,'الفجوج'),
(873,'Bordj Sabat',24,'برج صباط'),
(874,'Hamman Nbail',24,'حمام النبايل'),
(875,'Ain Larbi',24,'عين العربى'),
(876,'Medjez Amar',24,'مجاز عمار'),
(877,'Bouchegouf',24,'بوشقوف'),
(878,'Heliopolis',24,'ھيليوبوليس'),
(879,'Houari Boumediene',24,'هواري بومدين'),
(880,'Roknia',24,'الركنية'),
(881,'Salaoua Announa',24,'سلاوة عنونة'),
(882,'Medjez Sfa',24,'مجاز الصفاء'),
(883,'Boumahra Ahmed',24,'بومهرة أحمد'),
(884,'Ain Reggada',24,'عين رقادة'),
(885,'Oued Cheham',24,'وادي الشحم'),
(886,'Djeballah Khemissi',24,'جبالة لخميسي'),
(887,'Constantine',25,'قسنطينة'),
(888,'Hamma Bouziane',25,'حامة بوزيان'),
(889,'Ibn Badis',25,'إبن باديس'),
(890,'Zighoud Youcef',25,'زيغود يوسف'),
(891,'Didouche Mourad',25,'ديدوش مراد'),
(892,'El Khroub',25,'الخروب'),
(893,'Ain Abid',25,'عين عبيد'),
(894,'Beni Hamiden',25,'بني حميدان'),
(895,'Ouled Rahmoune',25,'أولاد رحمون'),
(896,'Ain Smara',25,'عين سمارة'),
(897,'Mesaoud Boudjeriou',25,'مسعود بوجريو'),
(898,'Ibn Ziad',25,'ابن زياد'),
(899,'Medea',26,'المدية'),
(900,'Ouzera',26,'وزرة'),
(901,'Ouled Maaref',26,'أولاد معرف'),
(902,'Ain Boucif',26,'عين بوسيف'),
(903,'Aissaouia',26,'العيساوية'),
(904,'Ouled Deide',26,'أولاد دايد'),
(905,'El Omaria',26,'العمارية'),
(906,'Derrag',26,'دراڨ'),
(907,'El Guelbelkebir',26,'القلب الكبير'),
(908,'Bouaiche',26,'بوعيش'),
(909,'Mezerena',26,'مزغنة'),
(910,'Ouled Brahim',26,'أولاد إبراهيم'),
(911,'Tizi Mahdi',26,'تيزي المهدي'),
(912,'Sidi Ziane',26,'سيدي زيان'),
(913,'Tamesguida',26,'تمزڨيدة'),
(914,'El Hamdania',26,'الحمدانية'),
(915,'Kef Lakhdar',26,'الكاف الأخضر'),
(916,'Chelalet El Adhaoura',26,'شلالة العذاورة'),
(917,'Bouskene',26,'بوسكن'),
(918,'Rebaia',26,'الربعية'),
(919,'Bouchrahil',26,'بوشراحيل'),
(920,'Ouled Hellal',26,'أولاد هلال'),
(921,'Tafraout',26,'تافراوت'),
(922,'Baata',26,'بعطة'),
(923,'Boghar',26,'بوغار'),
(924,'Sidi Naamane',26,'سيدي نعمان'),
(925,'Ouled Bouachra',26,'أولاد بوعشرة'),
(926,'Sidi Zahar',26,'سيدي زهار'),
(927,'Oued Harbil',26,'وادي حربيل'),
(928,'Benchicao',26,'بن شكاو'),
(929,'Sidi Damed',26,'سيدي دامد'),
(930,'Aziz',26,'عزيز'),
(931,'Souagui',26,'السواڨي'),
(932,'Zoubiria',26,'الزبيرية'),
(933,'Ksar El Boukhari',26,'قصر البخاري'),
(934,'El Azizia',26,'العزيزية'),
(935,'Djouab',26,'جواب'),
(936,'Chahbounia',26,'الشهبونية'),
(937,'Meghraoua',26,'مغراوة'),
(938,'Cheniguel',26,'شنيڨل'),
(939,'Ain Ouksir',26,'عين القصير'),
(940,'Oum El Djalil',26,'أم الجليل'),
(941,'Ouamri',26,'عوامري'),
(942,'Si Mahdjoub',26,'سى المحجوب'),
(943,'Tlatet Eddouair',26,'ثلاثة الدوائر'),
(944,'Beni Slimane',26,'بني سليمان'),
(945,'Berrouaghia',26,'البرواڨية'),
(946,'Seghouane',26,'سغوان'),
(947,'Meftaha',26,'المفاتحة'),
(948,'Mihoub',26,'ميهوب'),
(949,'Boughezoul',26,'بوغزول'),
(950,'Tablat',26,'تابلاط'),
(951,'Deux Bassins',26,'فج الحوضين'),
(952,'Draa Essamar',26,'ذراع السمار'),
(953,'Sidi Errabia',26,'سيدي الربيع'),
(954,'Bir Ben Laabed',26,'بئر بن العابد'),
(955,'El Ouinet',26,'العوينات'),
(956,'Ouled Antar',26,'أولاد عنتر'),
(957,'Bouaichoune',26,'بوعيشون'),
(958,'Hannacha',26,'حناشة'),
(959,'Sedraia',26,'سدراية'),
(960,'Medjebar',26,'مجبر'),
(961,'Khams Djouamaa',26,'خمس جوامع'),
(962,'Saneg',26,'سانڨ'),
(963,'Mostaganem',27,'مستغانم'),
(964,'Sayada',27,'صيادة'),
(965,'Fornaka',27,'فرناكة'),
(966,'Stidia',27,'ستيدية'),
(967,'Ain Nouissy',27,'عين نويسي'),
(968,'Hassi Maameche',27,'حاسي مماش'),
(969,'Ain Tadles',27,'عين تادلس'),
(970,'Sour',27,'صور'),
(971,'Oued El Kheir',27,'واد الخير'),
(972,'Sidi Bellater',27,'سيدي بلعاتر'),
(973,'Kheiredine',27,'خير الدين'),
(974,'Sidi Ali',27,'سيدي علي'),
(975,'Abdelmalek Ramdane',27,'عبد المالك رمضان'),
(976,'Hadjadj',27,'حجاج'),
(977,'Nekmaria',27,'نقمارية'),
(978,'Sidi Lakhdar',27,'سيدي لخضر'),
(979,'Achaacha',27,'عشعاشة'),
(980,'Khadra',27,'خضراء'),
(981,'Bouguirat',27,'بوقيراط'),
(982,'Sirat',27,'سيرات'),
(983,'Ain Sidi Cherif',27,'عين سيدي شريف'),
(984,'Mesra',27,'ماسرة'),
(985,'Mansourah',27,'منصورة'),
(986,'Souaflia',27,'سوافلية'),
(987,'Ouled Boughalem',27,'أوالد بوغالم'),
(988,'Ouled Maallah',27,'أولاد مع الله'),
(989,'Mezghrane',27,'مزغران'),
(990,'Ain Boudinar',27,'عين بودينار'),
(991,'Tazgait',27,'تزقايت'),
(992,'Safsaf',27,'صفصاف'),
(993,'Touahria',27,'طواھيرية'),
(994,'El Hassiane',27,'الحسيان'),
(995,'Msila',28,'المسيلة'),
(996,'Maadid',28,'المعاضيد'),
(997,'Hammam Dhalaa',28,'حمام الضلعة'),
(998,'Ouled Derradj',28,'أولاد دراج'),
(999,'Tarmount',28,'تارمونت'),
(1000,'Mtarfa',28,'مطارفة'),
(1001,'Khoubana',28,'خبانة'),
(1002,'M''cif',28,'مسيف'),
(1003,'Chellal',28,'شلال'),
(1004,'Ouled Madhi',28,'أولاد ماضي'),
(1005,'Magra',28,'مقرة'),
(1006,'Berhoum',28,'برهوم'),
(1007,'Ain Khadra',28,'عين الخضراء'),
(1008,'Ouled Addi Guebala',28,'اولاد عدي لقبالة'),
(1009,'Belaiba',28,'بلعايبة'),
(1010,'Sidi Aissa',28,'سيدي عيسى'),
(1011,'Ain El Hadjel',28,'عين الحجل'),
(1012,'Sidi Hadjeres',28,'سيدي ھجرس'),
(1013,'Ouanougha',28,'ونوغة'),
(1014,'Bou Saada',28,'بوسعادة'),
(1015,'Ouled Sidi Brahim',28,'أولاد سيدي ابراهيم'),
(1016,'Sidi Ameur',28,'سيدي عامر'),
(1017,'Tamsa',28,'تامسة'),
(1018,'Ben Srour',28,'بن سرور'),
(1019,'Ouled Slimane',28,'أولاد سليمان'),
(1020,'El Houamed',28,'الحوامد'),
(1021,'El Hamel',28,'الهامل'),
(1022,'Ouled Mansour',28,'أولاد منصور'),
(1023,'Maarif',28,'المعاريف'),
(1024,'Dehahna',28,'الدهاهنة'),
(1025,'Bouti Sayah',28,'بوطي السايح'),
(1026,'Khettouti Sed Djir',28,'خطوطي سد الجير'),
(1027,'Zarzour',28,'الزرزور'),
(1028,'Oued Chair',28,'محمد بوضياف'),
(1029,'Benzouh',28,'بن الزوه'),
(1030,'Bir Foda',28,'بير الفضة'),
(1031,'Ain Fares',28,'عين فارس'),
(1032,'Sidi Mhamed',28,'سيدي محمد'),
(1033,'Ouled Atia',28,'منعة'),
(1034,'Souamaa',28,'الصوامع'),
(1035,'Ain El Melh',28,'عين الملح'),
(1036,'Medjedel',28,'مجدل'),
(1037,'Slim',28,'سليم'),
(1038,'Ain Errich',28,'عين الريش'),
(1039,'Beni Ilmane',28,'بنى يلمان'),
(1040,'Oultene',28,'ولتام'),
(1041,'Djebel Messaad',28,'جبل مساعد'),
(1042,'Mascara',29,'معسكر'),
(1043,'Bou Hanifia',29,'بوحنيفية'),
(1044,'Tizi',29,'تيزي'),
(1045,'Hacine',29,'حسين'),
(1046,'Maoussa',29,'ماوسة'),
(1047,'Teghennif',29,'تيغنيف'),
(1048,'El Hachem',29,'الهاشم'),
(1049,'Sidi Kada',29,'سيدي قادة'),
(1050,'Zelmata',29,'زلماطة'),
(1051,'Oued El Abtal',29,'واد الأبطال'),
(1052,'Ain Ferah',29,'عين فراح'),
(1053,'Ghriss',29,'غريس'),
(1054,'Froha',29,'فروحة'),
(1055,'Matemore',29,'مطمور'),
(1056,'Makdha',29,'ماقضة'),
(1057,'Sidi Boussaid',29,'سيدي بوسعيد'),
(1058,'El Bordj',29,'البرج'),
(1059,'Ain Fekan',29,'عين فكان'),
(1060,'Benian',29,'بنيان'),
(1061,'Khalouia',29,'خلوية'),
(1062,'El Menaouer',29,'المناور'),
(1063,'Oued Taria',29,'واد التاغية'),
(1064,'Aouf',29,'عوف'),
(1065,'Ain Fares',29,'عين فارس'),
(1066,'Ain Frass',29,'عين فراس'),
(1067,'Sig',29,'سيڨ'),
(1068,'Oggaz',29,'عقاز'),
(1069,'Alaimia',29,'العلايمية'),
(1070,'El Gaada',29,'القعدة'),
(1071,'Zahana',29,'زھانة'),
(1072,'Mohammadia',29,'المحمدية'),
(1073,'Sidi Abdelmoumene',29,'سيدي عبد المومن'),
(1074,'Ferraguig',29,'فرقيق'),
(1075,'El Ghomri',29,'الغمري'),
(1076,'Sedjerara',29,'سجرارة'),
(1077,'Moctadouz',29,'مقطع الدوز'),
(1078,'Bou Henni',29,'بوهني'),
(1079,'Guettena',29,'القيطنة'),
(1080,'El Mamounia',29,'المامونية'),
(1081,'El Keurt',29,'الكرط'),
(1082,'Gharrous',29,'غروس'),
(1083,'Gherdjoum',29,'ڤرجوم'),
(1084,'Chorfa',29,'الشرفة'),
(1085,'Ras Ain Amirouche',29,'رأس العين عميروش'),
(1086,'Nesmot',29,'نسموط'),
(1087,'Sidi Abdeldjebar',29,'سيدي عبد الجبار'),
(1088,'Sehailia',29,'سحايلية'),
(1089,'Ouargla',30,'ورڨلة'),
(1090,'Ain Beida',30,'عين البيضاء'),
(1091,'Ngoussa',30,'نقوسة'),
(1092,'Hassi Messaoud',30,'حاسي مسعود'),
(1093,'Rouissat',30,'الرويسات'),
(1094,'Balidat Ameur',30,'بليدة عامر'),
(1095,'Tebesbest',30,'تبسبست'),
(1096,'Nezla',30,'نزلة'),
(1097,'Zaouia El Abidia',30,'الزاوية العابدية'),
(1098,'Sidi Slimane',30,'سيدي سليمان'),
(1099,'Sidi Khouiled',30,'سيدي خويلد'),
(1100,'Hassi Ben Abdellah',30,'حاسي بن عبد الله'),
(1101,'Touggourt',30,'توقرت'),
(1102,'El Hadjira',30,'الحجيرة'),
(1103,'Taibet',30,'الطيبات'),
(1104,'Tamacine',30,'تماسين'),
(1105,'Benaceur',30,'بن ناصر'),
(1106,'Mnaguer',30,'المنقر'),
(1107,'Megarine',30,'المقارين'),
(1108,'El Allia',30,'العالية'),
(1109,'El Borma',30,'البرمة'),
(1110,'Oran',31,'وهران'),
(1111,'Gdyel',31,'ڨديل'),
(1112,'Bir El Djir',31,'بئر الجير'),
(1113,'Hassi Bounif',31,'حاسي بونيف'),
(1114,'Es Senia',31,'السانية'),
(1115,'Arzew',31,'أرزيو'),
(1116,'Bethioua',31,'بطيوة'),
(1117,'Marsat El Hadjadj',31,'مرس الحجاج'),
(1118,'Ain Turk',31,'عين الترك'),
(1119,'El Ancar',31,'العنصر'),
(1120,'Oued Tlelat',31,'وادى تليلات'),
(1121,'Tafraoui',31,'طفراوي'),
(1122,'Sidi Chami',31,'سيدي الشحمي'),
(1123,'Boufatis',31,'بوفاطيس'),
(1124,'Mers El Kebir',31,'المرسى الكبير'),
(1125,'Bousfer',31,'بوسفر'),
(1126,'El Karma',31,'الكرمة'),
(1127,'El Braya',31,'ألبْرَيَ'),
(1128,'Hassi Ben Okba',31,'حاسي بن عقبة'),
(1129,'Ben Freha',31,'بن فريحة'),
(1130,'Hassi Mefsoukh',31,'حاسي مفسوخ'),
(1131,'Sidi Ben Yabka',31,'سيدي بن يبقى'),
(1132,'Messerghin',31,'مسرغين'),
(1133,'Boutlelis',31,'بوتليليس'),
(1134,'Ain Kerma',31,'عين الكرمة'),
(1135,'Ain Biya',31,'عين البية'),
(1136,'El Bayadh',32,'البيض'),
(1137,'Rogassa',32,'روقاصة'),
(1138,'Stitten',32,'ستيتين'),
(1139,'Brezina',32,'بريزينة'),
(1140,'Ghassoul',32,'غسول'),
(1141,'Boualem',32,'بوعلام'),
(1142,'El Abiodh Sidi Cheikh',32,'الابيض سيدي الشيخ'),
(1143,'Ain El Orak',32,'عين العراك'),
(1144,'Arbaouat',32,'أربوات'),
(1145,'Bougtoub',32,'بوقطب'),
(1146,'El Kheither',32,'الخيثر'),
(1147,'Kef El Ahmar',32,'الكاف الاحمر'),
(1148,'Boussemghoun',32,'بوسمغون'),
(1149,'Chellala',32,'شلالة'),
(1150,'Krakda',32,'كراكدة'),
(1151,'El Bnoud',32,'البنود'),
(1152,'Cheguig',32,'الشقيق'),
(1153,'Sidi Ameur',32,'سيدي عامر'),
(1154,'El Mehara',32,'المھارة'),
(1155,'Tousmouline',32,'توسمولين'),
(1156,'Sidi Slimane',32,'سيدي سليمان'),
(1157,'Sidi Tifour',32,'سيدي طيفور'),
(1158,'Illizi',33,'إليزي'),
(1159,'Djanet',33,'جانت'),
(1160,'Debdeb',33,'دبداب'),
(1161,'Bordj Omar Driss',33,'برج عمر ادريس'),
(1162,'Bordj El Haouasse',33,'برج الحواس'),
(1163,'In Amenas',33,'إن أميناس'),
(1164,'Bordj Bou Arreridj',34,'برج بوعريريج'),
(1165,'Ras El Oued',34,'رأس الوادي'),
(1166,'Bordj Zemoura',34,'برج زمورة'),
(1167,'Mansoura',34,'منصورة'),
(1168,'El Mhir',34,'المھير'),
(1169,'Ben Daoud',34,'بن داود'),
(1170,'El Achir',34,'العشير'),
(1171,'Ain Taghrout',34,'عين تاغروت'),
(1172,'Bordj Ghdir',34,'برج غدير'),
(1173,'Sidi Embarek',34,'سيدي مبارك'),
(1174,'El Hamadia',34,'الحمادية'),
(1175,'Belimour',34,'بليمور'),
(1176,'Medjana',34,'مجانة'),
(1177,'Teniet En Nasr',34,'ثنية النصر'),
(1178,'Djaafra',34,'جعافرة'),
(1179,'El Main',34,'إلماين'),
(1180,'Ouled Brahem',34,'أولاد ابراھم'),
(1181,'Ouled Dahmane',34,'أولاد دحمان'),
(1182,'Hasnaoua',34,'حسناوة'),
(1183,'Khelil',34,'خليل'),
(1184,'Taglait',34,'تاقلعيت'),
(1185,'Ksour',34,'القصور'),
(1186,'Ouled Sidi Brahim',34,'آث سيذى پراهم'),
(1187,'Tafreg',34,'تفرڨ'),
(1188,'Colla',34,'القلة'),
(1189,'Tixter',34,'تقصطر'),
(1190,'El Ach',34,'العش'),
(1191,'El Anseur',34,'العناصر'),
(1192,'Tesmart',34,'تسمارت'),
(1193,'Ain Tesra',34,'عين تسرة'),
(1194,'Bir Kasdali',34,'بئر قصد علي'),
(1195,'Ghilassa',34,'غيلاسة'),
(1196,'Rabta',34,'الرابطة'),
(1197,'Haraza',34,'الحرازة'),
(1198,'Boumerdes',35,'بومرداس'),
(1199,'Boudouaou',35,'بودواو'),
(1200,'Afir',35,'أفير'),
(1201,'Bordj Menaiel',35,'برج منايل'),
(1202,'Baghlia',35,'بغلية'),
(1203,'Sidi Daoud',35,'سيدي داود'),
(1204,'Naciria',35,'الناصرية'),
(1205,'Djinet',35,'جنات'),
(1206,'Isser',35,'يسر'),
(1207,'Zemmouri',35,'زموري'),
(1208,'Si Mustapha',35,'سي مصطفى'),
(1209,'Tidjelabine',35,'تيجلابين'),
(1210,'Chabet El Ameur',35,'شعبة العامر'),
(1211,'Thenia',35,'الثنية'),
(1212,'Timezrit',35,'تمزريت'),
(1213,'Corso',35,'قورصو'),
(1214,'Ouled Moussa',35,'أولاد موسى'),
(1215,'Larbatache',35,'الأربعطاش'),
(1216,'Bouzegza Keddara',35,'بوزقزة قدارة'),
(1217,'Taourga',35,'تورقة'),
(1218,'Ouled Aissa',35,'أولاد عيسى'),
(1219,'Ben Choud',35,'بن شود'),
(1220,'Dellys',35,'دلس'),
(1221,'Ammal',35,'عمال'),
(1222,'Beni Amrane',35,'بنى عمران'),
(1223,'Souk El Had',35,'سوق الحد'),
(1224,'Boudouaou El Bahri',35,'بودواو البحرى'),
(1225,'Ouled Hedadj',35,'أولاد ھداج'),
(1226,'Laghata',35,'لقاطة'),
(1227,'Hammedi',35,'حمادى'),
(1228,'Khemis El Khechna',35,'خميس الخشنة'),
(1229,'El Kharrouba',35,'الخروبة'),
(1230,'El Tarf',36,'الطارف'),
(1231,'Bouhadjar',36,'بوحجار'),
(1232,'Ben Mhidi',36,'بن مهيدى'),
(1233,'Bougous',36,'بوقوس'),
(1234,'El Kala',36,'القالة'),
(1235,'Ain El Assel',36,'عين العسل'),
(1236,'El Aioun',36,'العيون'),
(1237,'Bouteldja',36,'بوثلجة'),
(1238,'Souarekh',36,'السوارخ'),
(1239,'Berrihane',36,'برحان'),
(1240,'Lac Des Oiseaux',36,'بحيرة الطيور'),
(1241,'Chefia',36,'الشافية'),
(1242,'Drean',36,'الذرعان'),
(1243,'Chihani',36,'شهانى'),
(1244,'Chebaita Mokhtar',36,'شبيطة مختار'),
(1245,'Besbes',36,'البسباس'),
(1246,'Asfour',36,'عصفور'),
(1247,'Echatt',36,'الشط'),
(1248,'Zerizer',36,'زريزر'),
(1249,'Zitouna',36,'الزيتونة'),
(1250,'Ain Kerma',36,'عين الكرمة'),
(1251,'Oued Zitoun',36,'وادى الزيتون'),
(1252,'Hammam Beni Salah',36,'حمام بنى صالح'),
(1253,'Raml Souk',36,'رمل سوق'),
(1254,'Tindouf',37,'تندوف'),
(1255,'Oum El Assel',37,'أم العسل'),
(1256,'Tissemsilt',38,'تيسمسيلت'),
(1257,'Bordj Bou Naama',38,'برج بونعامة'),
(1258,'Theniet El Had',38,'ثنية الاحد'),
(1259,'Lazharia',38,'الازھرية'),
(1260,'Beni Chaib',38,'بنى شعيب'),
(1261,'Lardjem',38,'لارجم'),
(1262,'Melaab',38,'ملعب'),
(1263,'Sidi Lantri',38,'سيدي العنترى'),
(1264,'Bordj El Emir Abdelkader',38,'برج الامير عبد القادر'),
(1265,'Layoune',38,'العيون'),
(1266,'Khemisti',38,'خميستى'),
(1267,'Ouled Bessem',38,'أولاد بسام'),
(1268,'Ammari',38,'عمارى'),
(1269,'Youssoufia',38,'اليوسفية'),
(1270,'Sidi Boutouchent',38,'سيدي بوتوشنت'),
(1271,'Larbaa',38,'الاربعاء'),
(1272,'Maasem',38,'المعاصم'),
(1273,'Sidi Abed',38,'سيدي عابد'),
(1274,'Tamalaht',38,'تاملاحت'),
(1275,'Sidi Slimane',38,'سيدي سليمان'),
(1276,'Boucaid',38,'بوقايد'),
(1277,'Beni Lahcene',38,'بنى لحسن'),
(1278,'El Oued',39,'الوادي'),
(1279,'Robbah',39,'رباح'),
(1280,'Oued El Alenda',39,'وادى العلندة'),
(1281,'Bayadha',39,'البياضة'),
(1282,'Nakhla',39,'النخلة'),
(1283,'Guemar',39,'ڨمار'),
(1284,'Kouinine',39,'كوينين'),
(1285,'Reguiba',39,'الرڨيبة'),
(1286,'Hamraia',39,'الحمراية'),
(1287,'Taghzout',39,'تغزوت'),
(1288,'Debila',39,'الدبيلة'),
(1289,'Hassani Abdelkrim',39,'بلدية حساني عبد الكريم'),
(1290,'Hassi Khelifa',39,'حاسى خليفة'),
(1291,'Taleb Larbi',39,'طالب العربي'),
(1292,'Douar El Ma',39,'دوار الماء'),
(1293,'Sidi Aoun',39,'سيدي عون'),
(1294,'Trifaoui',39,'تريفاوى'),
(1295,'Magrane',39,'المڨرن'),
(1296,'Beni Guecha',39,'بن ڨشة'),
(1297,'Ourmas',39,'أورماس'),
(1298,'Still',39,'سطيل'),
(1299,'Mrara',39,'مرارة'),
(1300,'Sidi Khellil',39,'سيدي خليل'),
(1301,'Tendla',39,'تندلة'),
(1302,'El Ogla',39,'العقلة'),
(1303,'Mih Ouansa',39,'مية ونسة'),
(1304,'El Mghair',39,'المغير'),
(1305,'Djamaa',39,'جامعة'),
(1306,'Oum Touyour',39,'أم الطيور'),
(1307,'Sidi Amrane',39,'سيدي عمران'),
(1308,'Khenchela',40,'خنشلة'),
(1309,'Mtoussa',40,'متوسة'),
(1310,'Kais',40,'قايس'),
(1311,'Baghai',40,'بغاي'),
(1312,'El Hamma',40,'الحامة'),
(1313,'Ain Touila',40,'عين الطويلة'),
(1314,'Taouzianat',40,'تاوزيانت'),
(1315,'Bouhmama',40,'بوحمامة'),
(1316,'El Oueldja',40,'الولجة'),
(1317,'Remila',40,'الرميلة'),
(1318,'Cherchar',40,'ششار'),
(1319,'Djellal',40,'جلال'),
(1320,'Babar',40,'بابار'),
(1321,'Tamza',40,'تامزة'),
(1322,'Ensigha',40,'انسيغة'),
(1323,'Ouled Rechache',40,'أولاد رشاش'),
(1324,'El Mahmal',40,'المحمل'),
(1325,'Msara',40,'أمصارة'),
(1326,'Yabous',40,'يابوس'),
(1327,'Khirane',40,'خيران'),
(1328,'Chelia',40,'شلية'),
(1329,'Souk Ahras',41,'سوق أهراس'),
(1330,'Sedrata',41,'سدراتة'),
(1331,'Hanancha',41,'الحنانشة'),
(1332,'Mechroha',41,'المشروحة'),
(1333,'Ouled Driss',41,'أولاد ادريس'),
(1334,'Tiffech',41,'تيفاش'),
(1335,'Zaarouria',41,'الزعرورية'),
(1336,'Taoura',41,'تاورة'),
(1337,'Drea',41,'الدريعة'),
(1338,'Haddada',41,'الحدادة'),
(1339,'Khedara',41,'لخضارة'),
(1340,'Merahna',41,'المراهنة'),
(1341,'Ouled Moumen',41,'أولاد مؤمن'),
(1342,'Bir Bouhouche',41,'بئر بوحوش'),
(1343,'Mdaourouche',41,'مداوروش'),
(1344,'Oum El Adhaim',41,'أم العظائم'),
(1345,'Ain Zana',41,'عين الزانة'),
(1346,'Ain Soltane',41,'عين السلطان'),
(1347,'Quillen',41,'ويلان'),
(1348,'Sidi Fredj',41,'سيدي فرج'),
(1349,'Safel El Ouiden',41,'سافل الويدان'),
(1350,'Ragouba',41,'الرقوبة'),
(1351,'Khemissa',41,'خميسة'),
(1352,'Oued Keberit',41,'وادى الكبريت'),
(1353,'Terraguelt',41,'ترقالت'),
(1354,'Zouabi',41,'الزوابى'),
(1355,'Tipaza',42,'تيبازة'),
(1356,'Menaceur',42,'مناصر'),
(1357,'Larhat',42,'الأرهاط'),
(1358,'Douaouda',42,'دواودة'),
(1359,'Bourkika',42,'بورقيقة'),
(1360,'Khemisti',42,'خميستي'),
(1361,'Aghabal',42,'أغابال'),
(1362,'Hadjout',42,'حجوط'),
(1363,'Sidi Amar',42,'سيدي عمر'),
(1364,'Gouraya',42,'ڨورايا'),
(1365,'Nodor',42,'الناظور'),
(1366,'Chaiba',42,'الشعيبة'),
(1367,'Ain Tagourait',42,'عين تڨورايت'),
(1368,'Cherchel',42,'شرشال'),
(1369,'Damous',42,'الداموس'),
(1370,'Meurad',42,'مراد'),
(1371,'Fouka',42,'فوكة'),
(1372,'Bou Ismail',42,'بو اسماعيل'),
(1373,'Ahmer El Ain',42,'أحمر العين'),
(1374,'Bou Haroun',42,'بوهارون'),
(1375,'Sidi Ghiles',42,'سيدي غيلاس'),
(1376,'Messelmoun',42,'مسلمون'),
(1377,'Sidi Rached',42,'سيدي راشد'),
(1378,'Kolea',42,'القليعة'),
(1379,'Attatba',42,'الحطاطبة'),
(1380,'Sidi Semiane',42,'سيدي سميان'),
(1381,'Beni Milleuk',42,'بني ميلك'),
(1382,'Hadjerat Ennous',42,'حجرة النص'),
(1383,'Mila',43,'ميلة'),
(1384,'Ferdjioua',43,'فرجيوة'),
(1385,'Chelghoum Laid',43,'شلغوم العيد'),
(1386,'Oued Athmenia',43,'وادي العثمانية'),
(1387,'Ain Mellouk',43,'عين ملوك'),
(1388,'Telerghma',43,'تلاغمة'),
(1389,'Oued Seguen',43,'وادى سقان'),
(1390,'Tadjenanet',43,'تاجنانت'),
(1391,'Benyahia Abderrahmane',43,'بن يحيى عبد الرحمان'),
(1392,'Oued Endja',43,'وادى النجاء'),
(1393,'Ahmed Rachedi',43,'أحمد راشدي'),
(1394,'Ouled Khalouf',43,'أولاد خلوف'),
(1395,'Tiberguent',43,'تيبرقنت'),
(1396,'Bouhatem',43,'بوحاتم'),
(1397,'Rouached',43,'رواشد'),
(1398,'Tessala Lamatai',43,'تسالة لمطاي'),
(1399,'Grarem Gouga',43,'القرارم قوقة'),
(1400,'Sidi Merouane',43,'سيدي مروان'),
(1401,'Tassadane Haddada',43,'تسدان حدادة'),
(1402,'Derradji Bousselah',43,'دراحي بوصلاح'),
(1403,'Minar Zarza',43,'مينار زرزة'),
(1404,'Amira Arras',43,'عميرة أراس'),
(1405,'Terrai Bainen',43,'ترعى بينان'),
(1406,'Hamala',43,'حمالة'),
(1407,'Ain Tine',43,'عين التين'),
(1408,'El Mechira',43,'المشيرة'),
(1409,'Sidi Khelifa',43,'سيدي خليفة'),
(1410,'Zeghaia',43,'زغاية'),
(1411,'Elayadi Barbes',43,'العياضى برباس'),
(1412,'Ain Beida Harriche',43,'عين البيضاء حريش'),
(1413,'Yahia Beniguecha',43,'يحيى بنى قشة'),
(1414,'Chigara',43,'الشيقارة'),
(1415,'Ain Defla',44,'عين دفلة'),
(1416,'Miliana',44,'مليانة'),
(1417,'Boumedfaa',44,'بومدفع'),
(1418,'Khemis Miliana',44,'خميس مليانة'),
(1419,'Hammam Righa',44,'حمام ريغة'),
(1420,'Arib',44,'عريب'),
(1421,'Djelida',44,'جليدة'),
(1422,'El Amra',44,'العامرة'),
(1423,'Bourached',44,'بوراشد'),
(1424,'El Attaf',44,'العطاف'),
(1425,'El Abadia',44,'العبادية'),
(1426,'Djendel',44,'جندل'),
(1427,'Oued Chorfa',44,'وادى الشرفاء'),
(1428,'Ain Lechiakh',44,'عين الشياخ'),
(1429,'Oued Djemaa',44,'وادى جمعة'),
(1430,'Rouina',44,'روينة'),
(1431,'Zeddine',44,'زدين'),
(1432,'El Hassania',44,'الحسنية'),
(1433,'Bir Ouled Khelifa',44,'بئر ولد خليفة'),
(1434,'Ain Soltane',44,'عين السلطان'),
(1435,'Tarik Ibn Ziad',44,'طارق بن زياد'),
(1436,'Bordj Emir Khaled',44,'برج الأمير خالد'),
(1437,'Ain Torki',44,'عين التركى'),
(1438,'Sidi Lakhdar',44,'سيدي لخضر'),
(1439,'Ben Allal',44,'بن علال'),
(1440,'Ain Benian',44,'عين البنيان'),
(1441,'Hoceinia',44,'حسينية'),
(1442,'Barbouche',44,'بربوش'),
(1443,'Djemaa Ouled Chikh',44,'جمعة أولاد الشيخ'),
(1444,'Mekhatria',44,'المخاطرية'),
(1445,'Bathia',44,'بطحية'),
(1446,'Tachta Zegagha',44,'تاشتة زقاغة'),
(1447,'Ain Bouyahia',44,'عين بويحى'),
(1448,'El Maine',44,'الماين'),
(1449,'Tiberkanine',44,'تبركانين'),
(1450,'Belaas',44,'بالعاص'),
(1451,'Naama',45,'النعامة'),
(1452,'Mechria',45,'مشرية'),
(1453,'Ain Sefra',45,'عين الصفراء'),
(1454,'Tiout',45,'تيوت'),
(1455,'Sfissifa',45,'صفيصيفة'),
(1456,'Moghrar',45,'مغرار'),
(1457,'Assela',45,'عسلة'),
(1458,'Djeniane Bourzeg',45,'جنين بورزق'),
(1459,'Ain Ben Khelil',45,'عين بن خليل'),
(1460,'Makman Ben Amer',45,'مكمن بن عمر'),
(1461,'Kasdir',45,'قصدير'),
(1462,'El Biod',45,'البيوض'),
(1463,'Ain Temouchent',46,'عين تموشنت'),
(1464,'Chaabet El Ham',46,'شعبة اللحم'),
(1465,'Ain Kihal',46,'عين الكيحل'),
(1466,'Hammam Bouhadjar',46,'حمام بو حجر'),
(1467,'Bou Zedjar',46,'بوزجار'),
(1468,'Oued Berkeche',46,'وادى برقش'),
(1469,'Aghlal',46,'أغلال'),
(1470,'Terga',46,'تارقة'),
(1471,'Ain El Arbaa',46,'عين الاربعاء'),
(1472,'Tamzoura',46,'تامزوغة'),
(1473,'Chentouf',46,'شنتوف'),
(1474,'Sidi Ben Adda',46,'سيدي بن عدة'),
(1475,'Aoubellil',46,'عقب الليل'),
(1476,'El Malah',46,'المالح'),
(1477,'Sidi Boumediene',46,'سيدي بومدين'),
(1478,'Oued Sabah',46,'وادى الصباح'),
(1479,'Ouled Boudjemaa',46,'أولاد بوجمعة'),
(1480,'Ain Tolba',46,'عين الطلبة'),
(1481,'El Amria',46,'العامرية'),
(1482,'Hassi El Ghella',46,'حاسى الغلة'),
(1483,'Hassasna',46,'الحساسنة'),
(1484,'Ouled Kihal',46,'أولاد الكيحل'),
(1485,'Beni Saf',46,'بني صاف'),
(1486,'Sidi Safi',46,'سيدي الصافي'),
(1487,'Oulhaca El Gheraba',46,'ولهاصة الغرابة'),
(1488,'Sidi Ouriache',46,'سيدي وريلش'),
(1489,'El Emir Abdelkader',46,'الأمير عبد القادر'),
(1490,'El Messaid',46,'المساعيد'),
(1491,'Ghardaia',47,'غرداية'),
(1492,'El Meniaa',47,'المنيعة'),
(1493,'Dhayet Bendhahoua',47,'ضاية بن ضحوة'),
(1494,'Berriane',47,'بريان'),
(1495,'Metlili',47,'متليلي الشعانبة'),
(1496,'El Guerrara',47,'الڨرارة'),
(1497,'El Atteuf',47,'العطف'),
(1498,'Zelfana',47,'زلفانة'),
(1499,'Sebseb',47,'سبسب'),
(1500,'Bounoura',47,'بونورة'),
(1501,'Hassi Fehal',47,'حاسي الفحل'),
(1502,'Hassi Gara',47,'حاسي قارة'),
(1503,'Mansoura',47,'منصورة'),
(1504,'Relizane',48,'غيليزان'),
(1505,'Oued Rhiou',48,'وادي رهيو'),
(1506,'Belaassel Bouzegza',48,'بلعسل بوزقزة'),
(1507,'Sidi Saada',48,'سيدي سعادة'),
(1508,'Ouled Aiche',48,'أولاد يعيش'),
(1509,'Sidi Lazreg',48,'سيدي لزرق'),
(1510,'El Hamadna',48,'الحمادنة'),
(1511,'Sidi Mhamed Ben Ali',48,'سيدي امحمد بن علي'),
(1512,'Mediouna',48,'مديونة'),
(1513,'Sidi Khettab',48,'سيدي خطاب'),
(1514,'Ammi Moussa',48,'عمي موسى'),
(1515,'Zemmoura',48,'زمورة'),
(1516,'Beni Dergoun',48,'بني درقن'),
(1517,'Djidiouia',48,'جيديوة'),
(1518,'El Guettar',48,'القطارة'),
(1519,'Hamri',48,'الحمري'),
(1520,'El Matmar',48,'المطمار'),
(1521,'Sidi Mhamed Ben Aouda',48,'سيدي بن عودة'),
(1522,'Ain Tarek',48,'عين طارق'),
(1523,'Oued Essalem',48,'وادي السلام'),
(1524,'Ouarizane',48,'واريزان'),
(1525,'Mazouna',48,'مازونة'),
(1526,'Kalaa',48,'قلعة'),
(1527,'Ain Rahma',48,'عين الرحمة'),
(1528,'Yellel',48,'يلل'),
(1529,'Oued El Djemaa',48,'وادى الجمعة'),
(1530,'Ramka',48,'رمكة'),
(1531,'Mendes',48,'مندس'),
(1532,'Lahlef',48,'لحلاف'),
(1533,'Beni Zentis',48,'بني زنتيس'),
(1534,'Souk El Haad',48,'سوق الحد'),
(1535,'Dar Ben Abdellah',48,'دار بن عبد الله'),
(1536,'El Hassi',48,'الحاسى'),
(1537,'Had Echkalla',48,'حد الشقالة'),
(1538,'Bendaoud',48,'بن داود'),
(1539,'Merdja Sidi Abed',48,'مرجة سيدي عابد'),
(1540,'Ouled Sidi Mihoub',48,'أولاد سيدي ميهوب');

DROP TABLE IF EXISTS niveau_instruction CASCADE;

CREATE TABLE niveau_instruction(
 id SERIAL PRIMARY KEY,
 nom_fr VARCHAR(100) NOT NULL,
 nom_ar VARCHAR(100)
);

INSERT INTO niveau_instruction(nom_fr, nom_ar) VALUES
('Aucun','بدون'),
('Primaire','ابتدائي'),
('Moyen','متوسط'),
('Secondaire','ثانوي'),
('Universitaire','جامعي');

DROP TABLE IF EXISTS formation_agricole CASCADE;

CREATE TABLE formation_agricole(
 id SERIAL PRIMARY KEY,
 nom_fr VARCHAR(100) NOT NULL,
 nom_ar VARCHAR(100)
);

INSERT INTO formation_agricole(nom_fr, nom_ar) VALUES
('Aucun','بدون'),
('Perfectionnement','تكوين تكميلي'),
('Agent technique','تقني'),
('Agent technique spécialisé','تقني متخصص'),
('Technicien','تقني سامي'),
('Technicien supérieur','تقني سامي متخصص'),
('Ingénieur','مهندس'),
('Vétérinaire','طبيب بيطري'),
('Formation PRCHAT','تكوين PRCHAT');

DROP TABLE IF EXISTS statut_juridique CASCADE;

CREATE TABLE statut_juridique(
 id SERIAL PRIMARY KEY,
 nom_fr VARCHAR(150) NOT NULL,
 nom_ar VARCHAR(150)
);

INSERT INTO statut_juridique(nom_fr, nom_ar) VALUES
('Personne physique','شخص طبيعي'),
('Société civile','شركة مدنية'),
('SARL','شركة ذات مسؤولية محدودة'),
('EURL','مؤسسة ذات مسؤولية محدودة'),
('Coopérative','تعاونية'),
('Groupement','تجمع'),
('Location','إيجار'),
('Association','جمعية'),
('Partenariat','شراكة'),
('Sans statut juridique','بدون صفة قانونية'),
('Autre','أخرى');

DROP TABLE IF EXISTS type_accessibilite CASCADE;

CREATE TABLE type_accessibilite(
 id SERIAL PRIMARY KEY,
 nom_fr VARCHAR(150) NOT NULL,
 nom_ar VARCHAR(150)
);

INSERT INTO type_accessibilite(id, nom_fr, nom_ar) VALUES
(1,'Route nationale','طريق وطنية'),
(2,'Chemin de wilaya','طريق ولائية'),
(3,'Route communale','طريق بلدية'),
(4,'Piste rurale','مسلك ريفي'),
(5,'Piste agricole','مسلك فلاحي'),
(6,'Autre','أخرى');

drop table if exists mode_exploitation cascade;

CREATE TABLE mode_exploitation(
 id INT PRIMARY KEY,
 nom_fr VARCHAR(200) NOT NULL,
 nom_ar VARCHAR(200)
);

INSERT INTO mode_exploitation(id, nom_fr, nom_ar) VALUES
(1,'APFA','الاستصلاح في إطار APFA'),
(2,'EAC','مستثمرة فلاحية جماعية'),
(3,'EAI','مستثمرة فلاحية فردية'),
(4,'GCA','مستثمرة فلاحية جماعية'),
(5,'CDARS','التنمية الريفية CDARS'),
(6,'Concession CIM 108, CIM 1839','امتياز فلاحي'),
(7,'Nouvelle concession OTAS','امتياز جديد OTAS'),
(8,'Nouvelle concession ODAS','امتياز جديد ODAS'),
(9,'Exploitation sans titre','استغلال بدون سند'),
(10,'Ferme pilote','مزرعة نموذجية'),
(11,'Etablissement public (EPA, EPIC, EPE)','مؤسسة عمومية'),
(12,'Droit d’usage des forêts','حق استعمال الغابات'),
(13,'Inconnu','غير معروف');

DROP TABLE IF EXISTS statut_terre CASCADE;

CREATE TABLE statut_terre(
 id INT PRIMARY KEY,
 nom_fr VARCHAR(200) NOT NULL,
 nom_ar VARCHAR(200)
);

INSERT INTO statut_terre(id, nom_fr, nom_ar) VALUES
(1,'Melk personnel titré','ملك شخصي موثق'),
(2,'Melk personnel non titré','ملك شخصي غير موثق'),
(3,'Melk en indivision titré','ملك مشترك موثق'),
(4,'Melk en indivision non titré','ملك مشترك غير موثق'),
(5,'Domaine public','الملك العمومي'),
(6,'Domaine privé de l''Etat','ملك خاص للدولة'),
(7,'Wakf privé','وقف خاص'),
(8,'Wakf public','وقف عام'),
(9,'Inconnu','غير معروف');

DROP TABLE IF EXISTS type_superficie CASCADE;

CREATE TABLE type_superficie(
 id SERIAL PRIMARY KEY,
 nom_fr VARCHAR(150) NOT NULL,
 nom_ar VARCHAR(150),
 categorie VARCHAR(50)
);

INSERT INTO type_superficie(nom_fr, nom_ar, categorie) VALUES
('Cultures herbacées','محاصيل عشبية','SAU'),
('Terres en jachère','أراضي بور','SAU'),
('Cultures pérennes','محاصيل دائمة','SAU'),
('Prairies naturelles','مروج طبيعية','SAU'),
('Pacages et parcours','مراعي','SAT'),
('Surfaces improductives','مساحات غير منتجة','SAT'),
('Terres forestières','أراضي الغابات','SAT');

drop table if exists source_energie_type cascade;

CREATE TABLE source_energie_type(
 id INT PRIMARY KEY,
 nom_fr VARCHAR(150) NOT NULL,
 nom_ar VARCHAR(150)
);

INSERT INTO source_energie_type(id, nom_fr, nom_ar) VALUES
(1,'Réseau électrique','الشبكة الكهربائية'),
(2,'Groupe électrogène','مولد كهربائي'),
(3,'Énergie solaire','الطاقة الشمسية'),
(4,'Énergie éolienne','طاقة الرياح'),
(5,'Autres sources','مصادر أخرى');

DROP TABLE IF EXISTS categorie_culture CASCADE;

CREATE TABLE categorie_culture(
 id SERIAL PRIMARY KEY,
 nom_fr VARCHAR(150) NOT NULL,
 nom_ar VARCHAR(150)
);

INSERT INTO categorie_culture(nom_fr, nom_ar) VALUES
('Céréales','الحبوب'),
('Légumineuses sèches','البقول الجافة'),
('Cultures industrielles','المحاصيل الصناعية'),
('Cultures fourragères','المحاصيل العلفية'),
('Cultures maraîchères','الخضر'),
('Cultures condimentaires','التوابل'),
('Plantes aromatiques et médicinales','النباتات العطرية والطبية'),
('Autres cultures','محاصيل أخرى');

DROP TABLE IF EXISTS type_culture CASCADE;

CREATE TABLE type_culture(
 id SERIAL PRIMARY KEY,
 categorie_id INT NOT NULL,
 nom_fr VARCHAR(150) NOT NULL,
 nom_ar VARCHAR(150),

 CONSTRAINT fk_type_culture_categorie
 FOREIGN KEY (categorie_id)
 REFERENCES categorie_culture(id)
);

INSERT INTO type_culture(categorie_id, nom_fr, nom_ar) VALUES
(1,'Blé dur','قمح صلب'),
(1,'Blé tendre','قمح لين'),
(1,'Orge','شعير'),
(1,'Avoine','شوفان'),
(1,'Maïs grain','ذرة'),
(1,'Maïs fourrager','ذرة علفية'),
(1,'Sorgho','ذرة رفيعة'),
(1,'Mil','دخن'),
(1,'Triticale','تريتيكال');

INSERT INTO type_culture(categorie_id, nom_fr, nom_ar) VALUES
(2,'Pois chiche','حمص'),
(2,'Lentilles','عدس'),
(2,'Fève','فول'),
(2,'Féverole','فول علفي'),
(2,'Haricot sec','فاصوليا جافة'),
(2,'Pois sec','بازلاء جافة'),
(2,'Lupin','ترمس');

INSERT INTO type_culture(categorie_id, nom_fr, nom_ar) VALUES
(3,'Tournesol','عباد الشمس'),
(3,'Colza','سلجم زيتي'),
(3,'Soja','صوجا'),
(3,'Betterave sucrière','شمندر سكري'),
(3,'Tabac','تبغ'),
(3,'Coton','قطن'),
(3,'Tomate industrielle','طماطم صناعية');

INSERT INTO type_culture(categorie_id, nom_fr, nom_ar) VALUES
(4,'Luzerne','فصة'),
(4,'Sulla','سولا'),
(4,'Trèfle','برسيم'),
(4,'Ray grass','راي غراس'),
(4,'Orge fourragère','شعير علفي'),
(4,'Avoine fourragère','شوفان علفي'),
(4,'Maïs ensilage','ذرة سيلاج');

INSERT INTO type_culture(categorie_id, nom_fr, nom_ar) VALUES
(5,'Pomme de terre','بطاطا'),
(5,'Oignon','بصل'),
(5,'Ail','ثوم'),
(5,'Tomate','طماطم'),
(5,'Poivron','فلفل'),
(5,'Piment','فلفل حار'),
(5,'Aubergine','باذنجان'),
(5,'Courgette','كوسة'),
(5,'Concombre','خيار'),
(5,'Carotte','جزر'),
(5,'Navet','لفت'),
(5,'Betterave','شمندر'),
(5,'Chou','كرنب'),
(5,'Chou fleur','قرنبيط'),
(5,'Laitue','خس'),
(5,'Haricot vert','فاصوليا خضراء'),
(5,'Pastèque','بطيخ'),
(5,'Melon','شمام');

INSERT INTO type_culture(categorie_id, nom_fr, nom_ar) VALUES
(6,'Coriandre','قزبر'),
(6,'Persil','معدنوس'),
(6,'Cumin','كمون'),
(6,'Fenouil','شمر'),
(6,'Anis','يانسون');

INSERT INTO type_culture(categorie_id, nom_fr, nom_ar) VALUES
(7,'Romarin','إكليل الجبل'),
(7,'Thym','زعتر'),
(7,'Lavande','خزامى'),
(7,'Menthe','نعناع'),
(7,'Verveine','لويزة');

INSERT INTO type_culture(categorie_id, nom_fr, nom_ar) VALUES
(8,'Autres cultures','محاصيل أخرى');

DROP TABLE IF EXISTS type_arbre CASCADE;

CREATE TABLE type_arbre(
 id SERIAL PRIMARY KEY,
 nom_fr VARCHAR(150) NOT NULL,
 nom_ar VARCHAR(150)
);

INSERT INTO type_arbre(nom_fr, nom_ar) VALUES
('Olivier','زيتون'),
('Figuier','تين'),
('Agrumes','حمضيات'),
('Pommier','تفاح'),
('Amandier','لوز'),
('Palmier dattier','نخيل'),
('Grenadier','رمان'),
('Caroubier','خروب'),
('Autres arbres','أشجار أخرى');

DROP TABLE IF EXISTS type_animal CASCADE;

CREATE TABLE type_animal(
 id SERIAL PRIMARY KEY,
 nom_fr VARCHAR(150) NOT NULL,
 nom_ar VARCHAR(150)
);

INSERT INTO type_animal(nom_fr, nom_ar) VALUES
('Bovins','أبقار'),
('Ovins','أغنام'),
('Caprins','ماعز'),
('Camelins','إبل'),
('Equins','خيول'),
('Mulets','بغال'),
('Asins','حمير'),
('Cuniculture','أرانب');

DROP TABLE IF EXISTS categorie_bovin CASCADE;

CREATE TABLE categorie_bovin(
 id SERIAL PRIMARY KEY,
 nom_fr VARCHAR(150) NOT NULL,
 nom_ar VARCHAR(150)
);

INSERT INTO categorie_bovin(nom_fr, nom_ar) VALUES
('Vaches laitières BLM','أبقار الحلوب المتطورة'),
('Vaches laitières BLA','أبقار الحلوب المحسنة'),
('Vaches laitières BLL','أبقار الحلوب الحلية');

DROP TABLE IF EXISTS type_aviculture CASCADE;

CREATE TABLE type_aviculture(
 id SERIAL PRIMARY KEY,
 nom_fr VARCHAR(150) NOT NULL,
 nom_ar VARCHAR(150)
);

INSERT INTO type_aviculture(nom_fr, nom_ar) VALUES
('Poules','دجاج'),
('Dindes','ديك رومي'),
('Autre aviculture','دواجن أخرى');

DROP TABLE IF EXISTS type_ruche CASCADE;

CREATE TABLE type_ruche(
 id SERIAL PRIMARY KEY,
 nom_fr VARCHAR(150) NOT NULL,
 nom_ar VARCHAR(150)
);

INSERT INTO type_ruche(nom_fr, nom_ar) VALUES
('Ruches modernes','خلايا عصرية'),
('Ruches traditionnelles','خلايا تقليدية');

DROP TABLE IF EXISTS categorie_batiment CASCADE;

CREATE TABLE categorie_batiment(
 id SERIAL PRIMARY KEY,
 nom_fr VARCHAR(150) NOT NULL,
 nom_ar VARCHAR(150)
);

INSERT INTO categorie_batiment(nom_fr, nom_ar) VALUES
('Habitation','سكن'),
('Élevage','تربية المواشي'),
('Production','إنتاج'),
('Stockage','تخزين'),
('Transformation','تحويل'),
('Collecte','جمع');

DROP TABLE IF EXISTS type_batiment CASCADE;

CREATE TABLE type_batiment(
 id SERIAL PRIMARY KEY,
 nom_fr VARCHAR(150) NOT NULL,
 nom_ar VARCHAR(150),
 categorie_id INT,

 CONSTRAINT fk_type_batiment_categorie
 FOREIGN KEY (categorie_id)
 REFERENCES categorie_batiment(id)
);

INSERT INTO type_batiment(nom_fr, nom_ar, categorie_id) VALUES
('Bâtiment d’habitation','سكن',1),
('Bergerie','إسطبل الأغنام',2),
('Étable','إسطبل الأبقار',2),
('Poulailler','بيت الدواجن',2),
('Serre tunnel','بيت بلاستيكي نفق',3),
('Serre multi chapelle','بيت بلاستيكي متعدد',3),
('Bâtiment de stockage','مخزن',4),
('Chambre froide','غرفة تبريد',4),
('Unité de transformation','وحدة تحويل',5),
('Centre de collecte de lait','مركز جمع الحليب',6);

DROP TABLE IF EXISTS type_materiel CASCADE;

CREATE TABLE type_materiel(
 id SERIAL PRIMARY KEY,
 nom_fr VARCHAR(150) NOT NULL,
 nom_ar VARCHAR(150)
);

INSERT INTO type_materiel(nom_fr, nom_ar) VALUES
('Tracteur','جرار'),
('Moissonneuse batteuse','حصادة'),
('Motoculteur','آلة حرث صغيرة'),
('Charrue','محراث'),
('Cover crop','آلة تسوية'),
('Epandeur d’engrais','آلة نثر السماد'),
('Pulvérisateur','آلة رش'),
('Semoir','آلة بذر'),
('Arracheuse pomme de terre','آلة قلع البطاطا'),
('Motopompe','مضخة');

DROP TABLE IF EXISTS type_ouvrage_eau CASCADE;

CREATE TABLE type_ouvrage_eau(
 id SERIAL PRIMARY KEY,
 nom_fr VARCHAR(150) NOT NULL,
 nom_ar VARCHAR(150),
 categorie VARCHAR(50)
);

INSERT INTO type_ouvrage_eau(nom_fr, nom_ar, categorie) VALUES
('Barrage','سد','GPI'),
('Station de pompage','محطة ضخ','GPI'),
('Forage','بئر ارتوازي','PMH'),
('Puits','بئر','PMH'),
('Foggara','فقارة','PMH'),
('Source','عين ماء','PMH'),
('Petit barrage','سد صغير','PMH'),
('Retenue collinaire','بحيرة جبلية','PMH');

DROP TABLE IF EXISTS mode_irrigation CASCADE;

CREATE TABLE mode_irrigation(
 id SERIAL PRIMARY KEY,
 nom_fr VARCHAR(150) NOT NULL,
 nom_ar VARCHAR(150)
);

INSERT INTO mode_irrigation(nom_fr, nom_ar) VALUES
('Aspersion classique','رش'),
('Gravitaire','ري سطحي'),
('Epandage de crues','ري بالفيض'),
('Goutte à goutte','ري بالتنقيط'),
('Pivot','محور'),
('Enrouleur','مدفع ري'),
('Pluie artificielle','أمطار اصطناعية'),
('Foggara','فقارة'),
('Autre','أخرى');

DROP TABLE IF EXISTS mode_stockage_eau CASCADE;

CREATE TABLE mode_stockage_eau(
 id SERIAL PRIMARY KEY,
 nom_fr VARCHAR(150) NOT NULL,
 nom_ar VARCHAR(150)
);

INSERT INTO mode_stockage_eau(nom_fr, nom_ar) VALUES
('Bassin de stockage','حوض تخزين'),
('Réservoir / citerne','خزان'),
('Château d''eau','خزان مرتفع'),
('Retenue collinaire','بحيرة جبلية'),
('Barrage','سد'),
('Autre mode de stockage','طريقة تخزين أخرى');

DROP TABLE IF EXISTS type_travail CASCADE;

CREATE TABLE type_travail(
 id SERIAL PRIMARY KEY,
 nom_fr VARCHAR(150) NOT NULL,
 nom_ar VARCHAR(150),
 categorie VARCHAR(50)
);

INSERT INTO type_travail(nom_fr, nom_ar, categorie) VALUES
('Co-exploitants','مستثمرون مشاركون','familial'),
('Ouvriers permanents','عمال دائمون','salarié'),
('Ouvriers saisonniers','عمال موسميون','salarié'),
('Main d’œuvre familiale','عمل عائلي','familial');

drop table if exists type_temps_travail cascade;

CREATE TABLE type_temps_travail(
 id SERIAL PRIMARY KEY,
 nom_fr VARCHAR(50),
 nom_ar VARCHAR(50)
);

INSERT INTO type_temps_travail(nom_fr,nom_ar) VALUES
('Permanent','دائم'),
('Saisonnier','موسمي'),
('Occasionnel','عرضي');

drop table if exists sexe cascade;

CREATE TABLE sexe(
 id SERIAL PRIMARY KEY,
 nom_fr VARCHAR(20),
 nom_ar VARCHAR(20)
);

INSERT INTO sexe(nom_fr, nom_ar) VALUES
('Masculin','ذكر'),
('Féminin','أنثى');

drop table if exists type_assurance cascade;

CREATE TABLE type_assurance(
 id SERIAL PRIMARY KEY,
 nom_fr VARCHAR(50),
 nom_ar VARCHAR(50)
);

INSERT INTO type_assurance(nom_fr, nom_ar) VALUES
('CASNOS','كاسنوس'),
('CNAS','كنـاس');

drop table if exists nature_exploitant cascade;

CREATE TABLE nature_exploitant(
 id SERIAL PRIMARY KEY,
 nom_fr VARCHAR(50),
 nom_ar VARCHAR(50)
);

INSERT INTO nature_exploitant(nom_fr, nom_ar) VALUES
('Propriétaire','مالك'),
('Locataire','مستأجر'),
('Autre','أخرى');

DROP TABLE IF EXISTS type_activite CASCADE;

CREATE TABLE type_activite(
 id SERIAL PRIMARY KEY,
 nom_fr VARCHAR(100),
 nom_ar VARCHAR(100)
);

INSERT INTO type_activite(nom_fr,nom_ar) VALUES
('Production végétale','إنتاج نباتي'),
('Production animale','إنتاج حيواني'),
('Mixte','نشاط مختلط');

DROP TABLE IF EXISTS type_activite_exploitant CASCADE;

CREATE TABLE type_telephone(
 id SERIAL PRIMARY KEY,
 nom_fr VARCHAR(50),
 nom_ar VARCHAR(50)
);

INSERT INTO type_telephone(nom_fr,nom_ar) VALUES
('Fixe','هاتف ثابت'),
('Mobile','هاتف نقال');

DROP TABLE IF EXISTS exploitants CASCADE;

CREATE TABLE exploitants(

 id SERIAL PRIMARY KEY,

 nom_fr VARCHAR(150),
 nom_ar VARCHAR(150),

 prenom_fr VARCHAR(150),
 prenom_ar VARCHAR(150),

 sexe_id INT,

 date_naissance DATE,

 nin VARCHAR(50),
 nis VARCHAR(50),

 telephone VARCHAR(30),
 email VARCHAR(150),

 adresse_fr TEXT,
 adresse_ar TEXT,

 niveau_instruction_id INT,
 formation_agricole_id INT,

 inscrit_chambre_agri BOOLEAN,
 inscrit_chambre_peche BOOLEAN,
 inscrit_union_paysans BOOLEAN,
 inscrit_chambre_artisanat BOOLEAN,
 inscrit_chambre_commerce BOOLEAN,
 beneficie_dispositif_social BOOLEAN,

 type_assurance_id INT,
 num_securite_sociale VARCHAR(50),

 issu_famille_agricole BOOLEAN,
 est_exploitant_principal BOOLEAN,

 nb_coexploitants INT,

 nature_exploitant_id INT,

 FOREIGN KEY(niveau_instruction_id)
 REFERENCES niveau_instruction(id),

 FOREIGN KEY(formation_agricole_id)
 REFERENCES formation_agricole(id),

 FOREIGN KEY(sexe_id)
 REFERENCES sexe(id),

 FOREIGN KEY(type_assurance_id)
 REFERENCES type_assurance(id),

 FOREIGN KEY(nature_exploitant_id)
 REFERENCES nature_exploitant(id)

);

INSERT INTO exploitants(
 nom_fr, nom_ar,
 prenom_fr, prenom_ar,
 sexe_id,
 date_naissance,
 nin,
 nis,
 telephone,
 email,
 adresse_fr, adresse_ar,
 niveau_instruction_id,
 formation_agricole_id,
 inscrit_chambre_agri,
 inscrit_chambre_peche,
 inscrit_union_paysans,
 inscrit_chambre_artisanat,
 inscrit_chambre_commerce,
 beneficie_dispositif_social,
 type_assurance_id,
 num_securite_sociale,
 issu_famille_agricole,
 est_exploitant_principal,
 nb_coexploitants,
 nature_exploitant_id
) VALUES

('Benali','بن علي','Ahmed','أحمد',1,'1975-03-15','197503150012345','123456789012345','0550123456','ahmed.benali@mail.com','Tiaret','تيارت',3,2,TRUE,FALSE,TRUE,FALSE,FALSE,TRUE,1,'987654321',TRUE,TRUE,2,1),

('Kaci','قاسي','Fatima','فاطمة',2,'1982-07-22','198207220045678','223456789012345','0660456789','fatima.kaci@mail.com','Sougueur','سوقر',4,3,TRUE,FALSE,TRUE,FALSE,FALSE,FALSE,2,'987654322',TRUE,TRUE,1,1),

('Bouzid','بوزيد','Mohamed','محمد',1,'1968-11-10','196811100078912','323456789012345','0550789123','m.bouzid@mail.com','Frenda','فرندة',2,1,FALSE,FALSE,TRUE,FALSE,FALSE,TRUE,1,'987654323',TRUE,TRUE,3,2),

('Zerrouki','زروقي','Samira','سميرة',2,'1990-05-05','199005050012222','423456789012345','0670122223','samira.zerrouki@mail.com','Mahdia','المهدية',5,7,TRUE,FALSE,FALSE,FALSE,FALSE,FALSE,2,'987654324',FALSE,TRUE,0,1);

drop table if exists exploitation_accessibilite cascade;
DROP TABLE IF EXISTS sources_energie CASCADE;
drop table if exists blocks cascade;
DROP TABLE IF EXISTS exploitations CASCADE;

CREATE TABLE exploitations(

 id SERIAL PRIMARY KEY,

 exploitant_id INT NOT NULL,
 commune_id INT NOT NULL,

 nom_exploitation_fr VARCHAR(200),
 nom_exploitation_ar VARCHAR(200),

 district_fr VARCHAR(150),
 district_ar VARCHAR(150),

 statut_juridique_id INT,

 latitude DECIMAL(10,7),
 longitude DECIMAL(10,7),

 geom GEOMETRY(Point,4326),

 activite_exploitation_id INT,

 acces_reseau_electrique BOOLEAN,
 acces_reseau_telephonique BOOLEAN,

 type_telephone_id INT,

 acces_internet BOOLEAN,
 internet_agri BOOLEAN,

 eac_concession BOOLEAN,
 nb_exploitants_eac INT,

 logement_occupant BOOLEAN,
 nb_menages INT,

 superficie_batie DECIMAL(12,2),
 superficie_non_batie DECIMAL(12,2),

 CONSTRAINT fk_exploitation_exploitant
 FOREIGN KEY(exploitant_id)
 REFERENCES exploitants(id),

 CONSTRAINT fk_exploitation_commune
 FOREIGN KEY(commune_id)
 REFERENCES communes(id),

 CONSTRAINT fk_exploitation_statut
 FOREIGN KEY(statut_juridique_id)
 REFERENCES statut_juridique(id),

 CONSTRAINT fk_exploitation_activite
 FOREIGN KEY(activite_exploitation_id)
 REFERENCES type_activite(id),

 CONSTRAINT fk_exploitation_telephone
 FOREIGN KEY(type_telephone_id)
 REFERENCES type_telephone(id)
);

CREATE INDEX idx_exploitations_geom
ON exploitations
USING GIST (geom);

CREATE TABLE exploitation_accessibilite(
 exploitation_id INT,
 accessibilite_id INT,

 PRIMARY KEY (exploitation_id, accessibilite_id),

 CONSTRAINT fk_access_exploitation
 FOREIGN KEY(exploitation_id)
 REFERENCES exploitations(id),

 CONSTRAINT fk_access_type
 FOREIGN KEY(accessibilite_id)
 REFERENCES type_accessibilite(id)

);

CREATE TABLE sources_energie(
 exploitation_id INT,
 type_source_id INT,

 PRIMARY KEY (exploitation_id, type_source_id),

 CONSTRAINT fk_source_exploitation
 FOREIGN KEY(exploitation_id)
 REFERENCES exploitations(id),

 CONSTRAINT fk_source_type
 FOREIGN KEY(type_source_id)
 REFERENCES source_energie_type(id)
);

CREATE TABLE blocks(
 id SERIAL PRIMARY KEY,

 exploitation_id INT,

 mode_exploi_id INT,
 statut_terre_id INT,

 superficie DECIMAL(12,2),

 FOREIGN KEY(exploitation_id)
 REFERENCES exploitations(id),

 FOREIGN KEY(mode_exploi_id)
 REFERENCES mode_exploitation(id),

 FOREIGN KEY(statut_terre_id)
 REFERENCES statut_terre(id)

);

INSERT INTO exploitations(
 exploitant_id,
 commune_id,
 nom_exploitation_fr,
 nom_exploitation_ar,
 district_fr,
 district_ar,
 statut_juridique_id,
 latitude,
 longitude,
 geom,
 activite_exploitation_id,
 acces_reseau_electrique,
 acces_reseau_telephonique,
 type_telephone_id,
 acces_internet,
 internet_agri,
 eac_concession,
 nb_exploitants_eac,
 logement_occupant,
 nb_menages,
 superficie_batie,
 superficie_non_batie
) VALUES

(
1,445,
'Ferme Benali','مزرعة بن علي',
'Zone agricole nord','المنطقة الفلاحية الشمالية',
1,
35.3712000,1.3215000,
ST_SetSRID(ST_MakePoint(1.3215,35.3712),4326),
3,
TRUE,TRUE,
2,
TRUE,TRUE,
FALSE,0,
TRUE,1,
120.5,35.2
),

(
2,460,
'Exploitation Kaci','مستثمرة قاسي',
'District Sougueur','منطقة السوقر',
2,
35.1880000,1.2950000,
ST_SetSRID(ST_MakePoint(1.2950,35.1880),4326),
1,
TRUE,TRUE,
2,
TRUE,FALSE,
FALSE,0,
TRUE,2,
80.3,20.5
),

(
3,471,
'Ferme Bouzid','مزرعة بوزيد',
'Plaine Frenda','سهل فرندة',
1,
35.0610000,1.0480000,
ST_SetSRID(ST_MakePoint(1.0480,35.0610),4326),
2,
FALSE,TRUE,
2,
FALSE,FALSE,
TRUE,4,
TRUE,3,
60.0,12.5
),

(
4,459,
'Exploitation Zerrouki','مستثمرة زروقي',
'Mahdia Est','المهدية الشرقية',
3,
35.4320000,1.0830000,
ST_SetSRID(ST_MakePoint(1.0830,35.4320),4326),
3,
TRUE,TRUE,
2,
TRUE,TRUE,
FALSE,0,
TRUE,1,
150.0,40.0
);

INSERT INTO exploitation_accessibilite(
 exploitation_id,
 accessibilite_id
) VALUES

(1,1),
(2,2),
(3,3),
(4,2);

INSERT INTO sources_energie(
 exploitation_id,
 type_source_id
) VALUES

(1,1),
(1,2),

(2,1),

(3,3),

(4,1),
(4,2);

INSERT INTO blocks(
 exploitation_id,
 mode_exploi_id,
 statut_terre_id,
 superficie
)
VALUES

-- Exploitation 1 : Ferme Benali
(1,3,1,15.50),
(1,3,1,12.30),
(1,6,2,7.80),

-- Exploitation 2 : Exploitation Kaci
(2,3,1,10.00),
(2,3,3,5.60),

-- Exploitation 3 : Ferme Bouzid
(3,2,6,20.00),
(3,2,6,14.20),
(3,9,2,3.50),

-- Exploitation 4 : Exploitation Zerrouki
(4,6,1,18.75),
(4,6,1,9.40),
(4,12,5,6.00);

DROP TABLE IF EXISTS recensements CASCADE;
DROP TABLE IF EXISTS recensement_campagne CASCADE;
DROP TABLE IF EXISTS recensement_status CASCADE;

CREATE TABLE recensement_status(
 id SERIAL PRIMARY KEY,
 nom_fr VARCHAR(50),
 nom_ar VARCHAR(50)
);

CREATE TABLE recensement_campagne(
 id SERIAL PRIMARY KEY,
 nom_fr VARCHAR(150) NOT NULL,
 nom_ar VARCHAR(150),
 annee INT NOT NULL UNIQUE,
 date_debut DATE,
 date_fin DATE
);

CREATE TABLE recensements(
 id SERIAL PRIMARY KEY,
 campagne_id INT NOT NULL,
 exploitation_id INT NOT NULL,
 recenseur_id INT,
 controleur_id INT,
 date_recensement DATE,
 date_controle DATE,
 status_id INT,

 CONSTRAINT fk_recensement_campagne
 FOREIGN KEY(campagne_id)
 REFERENCES recensement_campagne(id),

 CONSTRAINT fk_recensement_exploitation
 FOREIGN KEY(exploitation_id)
 REFERENCES exploitations(id),

 CONSTRAINT fk_recensement_recenseur
 FOREIGN KEY(recenseur_id)
 REFERENCES users(id),

 CONSTRAINT fk_recensement_controleur
 FOREIGN KEY(controleur_id)
 REFERENCES users(id),

 CONSTRAINT fk_recensement_status
 FOREIGN KEY(status_id)
 REFERENCES recensement_status(id),

 CONSTRAINT unique_recensement
 UNIQUE(campagne_id, exploitation_id)
);

INSERT INTO recensement_status(id, nom_fr, nom_ar) VALUES
(1,'En cours','قيد الإنجاز'),
(2,'Recensé','تم الإحصاء'),
(3,'Contrôlé','تم المراقبة'),
(4,'Validé','تم الاعتماد'),
(5,'Rejeté','مرفوض');

INSERT INTO recensement_campagne(
 nom_fr,
 nom_ar,
 annee,
 date_debut,
 date_fin
)
VALUES
(
'Recensement Agricole 2025',
'الإحصاء الفلاحي 2025',
2025,
'2025-01-01',
'2025-12-31'
);

INSERT INTO recensements(
 campagne_id,
 exploitation_id,
 recenseur_id,
 controleur_id,
 date_recensement,
 status_id
)
VALUES
(1,1,2,NULL,'2025-03-01',2),
(1,2,2,NULL,'2025-03-02',2),
(1,3,3,NULL,'2025-03-03',2),
(1,4,3,NULL,'2025-03-04',2);

DROP TABLE IF EXISTS superficies CASCADE;
DROP TABLE IF EXISTS cultures CASCADE;
DROP TABLE IF EXISTS arbres CASCADE;

CREATE TABLE superficies(
 recensement_id INT,
 type_superficie_id INT,
 surface_sec DECIMAL(12,2),
 surface_irrigue DECIMAL(12,2),

 PRIMARY KEY (recensement_id, type_superficie_id),

 FOREIGN KEY(recensement_id)
 REFERENCES recensements(id),

 FOREIGN KEY(type_superficie_id)
 REFERENCES type_superficie(id)
);

CREATE TABLE cultures(
 recensement_id INT,
 type_culture_id INT,
 surface_sec DECIMAL(12,2),
 surface_irrigue DECIMAL(12,2),
 surface_intercalaire DECIMAL(12,2),

 PRIMARY KEY (recensement_id, type_culture_id),

 FOREIGN KEY(recensement_id)
 REFERENCES recensements(id),

 FOREIGN KEY(type_culture_id)
 REFERENCES type_culture(id)
);

CREATE TABLE arbres(
 recensement_id INT,
 type_arbre_id INT,
 nombre INT,

 PRIMARY KEY (recensement_id, type_arbre_id),

 FOREIGN KEY(recensement_id)
 REFERENCES recensements(id),

 FOREIGN KEY(type_arbre_id)
 REFERENCES type_arbre(id)
);

INSERT INTO superficies VALUES
(1,1,20,5),
(1,2,10,0),
(1,3,3,0);

INSERT INTO cultures VALUES
(1,1,10,2,0),
(1,2,5,1,0),
(1,3,4,0,0);

INSERT INTO arbres VALUES
(1,1,120),
(1,2,50),
(1,3,30);

DROP TABLE IF EXISTS cheptel CASCADE;

CREATE TABLE cheptel(
 recensement_id INT,
 animal_type_id INT,
 nombre_total INT,
 nb_femelle INT,

 PRIMARY KEY(recensement_id, animal_type_id),

 FOREIGN KEY(recensement_id)
 REFERENCES recensements(id),

 FOREIGN KEY(animal_type_id)
 REFERENCES type_animal(id)
);

DROP TABLE IF EXISTS bovins CASCADE;

CREATE TABLE bovins(
 recensement_id INT,
 categorie_bovin_id INT,
 nombre INT,

 PRIMARY KEY(recensement_id, categorie_bovin_id),

 FOREIGN KEY(recensement_id)
 REFERENCES recensements(id),

 FOREIGN KEY(categorie_bovin_id)
 REFERENCES categorie_bovin(id)
);

DROP TABLE IF EXISTS aviculture CASCADE;

CREATE TABLE aviculture(
 recensement_id INT,
 type_aviculture_id INT,
 nb_ponte INT,
 nb_chaire INT,

 PRIMARY KEY(recensement_id, type_aviculture_id),

 FOREIGN KEY(recensement_id)
 REFERENCES recensements(id),

 FOREIGN KEY(type_aviculture_id)
 REFERENCES type_aviculture(id)
);

DROP TABLE IF EXISTS apiculture CASCADE;

CREATE TABLE apiculture(
 recensement_id INT,
 type_ruche_id INT,
 nb_ruches_total INT,
 nb_ruches_pleine INT,

 PRIMARY KEY(recensement_id, type_ruche_id),

 FOREIGN KEY(recensement_id)
 REFERENCES recensements(id),

 FOREIGN KEY(type_ruche_id)
 REFERENCES type_ruche(id)
);

INSERT INTO cheptel(
 recensement_id,
 animal_type_id,
 nombre_total,
 nb_femelle
)
VALUES
(1,2,120,80),   -- Ovins
(1,3,45,30),    -- Caprins
(1,4,12,8),     -- Camelins
(1,5,6,4),      -- Equins
(1,8,20,12);    -- Cuniculture

INSERT INTO bovins(
 recensement_id,
 categorie_bovin_id,
 nombre
)
VALUES
(1,1,15),  -- BLM
(1,2,10),  -- BLA
(1,3,8);   -- BLL

INSERT INTO aviculture(
 recensement_id,
 type_aviculture_id,
 nb_ponte,
 nb_chaire
)
VALUES
(1,1,200,50),   -- Poules
(1,2,20,10),    -- Dindes
(1,3,30,15);    -- Autres volailles

INSERT INTO apiculture(
 recensement_id,
 type_ruche_id,
 nb_ruches_total,
 nb_ruches_pleine
)
VALUES
(1,1,40,30),   -- Ruches modernes
(1,2,15,8);    -- Ruches traditionnelles

DROP TABLE IF EXISTS batiments CASCADE;

CREATE TABLE batiments(
 recensement_id INT,
 type_batiment_id INT,
 nombre INT,
 surface DECIMAL(12,2),

 PRIMARY KEY(recensement_id, type_batiment_id),

 FOREIGN KEY(recensement_id)
 REFERENCES recensements(id),

 FOREIGN KEY(type_batiment_id)
 REFERENCES type_batiment(id)
);

DROP TABLE IF EXISTS materiels CASCADE;

CREATE TABLE materiels(
 recensement_id INT,
 type_materiel_id INT,
 nombre INT,

 PRIMARY KEY(recensement_id, type_materiel_id),

 FOREIGN KEY(recensement_id)
 REFERENCES recensements(id),

 FOREIGN KEY(type_materiel_id)
 REFERENCES type_materiel(id)
);

DROP TABLE IF EXISTS main_oeuvre CASCADE;

CREATE TABLE main_oeuvre(
 recensement_id INT,
 type_travail_id INT,
 sexe_id INT,
 type_temps_id INT,
 nb INT,

 PRIMARY KEY(recensement_id,type_travail_id,sexe_id,type_temps_id),

 FOREIGN KEY(recensement_id)
 REFERENCES recensements(id),

 FOREIGN KEY(type_travail_id)
 REFERENCES type_travail(id),

 FOREIGN KEY(sexe_id)
 REFERENCES sexe(id),

 FOREIGN KEY(type_temps_id)
 REFERENCES type_temps_travail(id)
);

DROP TABLE IF EXISTS menage_agricole CASCADE;

CREATE TABLE menage_agricole(
 recensement_id INT PRIMARY KEY,
 nb_personnes INT,
 nb_adultes INT,
 nb_enfants INT,

 FOREIGN KEY(recensement_id)
 REFERENCES recensements(id)
);

INSERT INTO batiments(
 recensement_id,
 type_batiment_id,
 nombre,
 surface
)
VALUES
(1,1,1,120),   -- habitation
(1,2,2,300),   -- bergerie
(1,3,1,250),   -- étable
(1,5,3,450),   -- serre tunnel
(1,7,1,180);   -- bâtiment stockage

INSERT INTO materiels(
 recensement_id,
 type_materiel_id,
 nombre
)
VALUES
(1,1,2),   -- tracteurs
(1,2,1),   -- moissonneuse
(1,3,3),   -- motoculteur
(1,6,2),   -- épandeur engrais
(1,10,4);  -- motopompe

INSERT INTO main_oeuvre(
 recensement_id,
 type_travail_id,
 sexe_id,
 type_temps_id,
 nb
)
VALUES
(1,1,1,1,1),   -- exploitant homme
(1,4,2,1,1),   -- aide familiale femme
(1,2,1,1,2),   -- ouvriers permanents hommes
(1,3,1,2,5),   -- ouvriers saisonniers hommes
(1,3,2,2,3);   -- ouvriers saisonniers femmes

INSERT INTO menage_agricole(
 recensement_id,
 nb_personnes,
 nb_adultes,
 nb_enfants
)
VALUES
(1,6,4,2);

DROP TABLE IF EXISTS ouvrages_eau CASCADE;

CREATE TABLE ouvrages_eau(
 recensement_id INT,
 type_ouvrage_id INT,
 nombre INT,
 PRIMARY KEY(recensement_id, type_ouvrage_id),

 FOREIGN KEY(recensement_id)
 REFERENCES recensements(id),

 FOREIGN KEY(type_ouvrage_id)
 REFERENCES type_ouvrage_eau(id)
);

DROP TABLE IF EXISTS irrigation CASCADE;

CREATE TABLE irrigation(
 recensement_id INT,
 mode_irrigation_id INT,
 surface DECIMAL(12,2),

 PRIMARY KEY(recensement_id, mode_irrigation_id),

 FOREIGN KEY(recensement_id)
 REFERENCES recensements(id),

 FOREIGN KEY(mode_irrigation_id)
 REFERENCES mode_irrigation(id)
);

DROP TABLE IF EXISTS intrants CASCADE;

CREATE TABLE intrants(

 recensement_id INT PRIMARY KEY,
 semences_selectionnees BOOLEAN,
 semences_certifiees BOOLEAN,
 bio BOOLEAN,
 semences_ferme BOOLEAN,
 engrais_azotes BOOLEAN,
 engrais_phosphates BOOLEAN,
 engrais_mineraux BOOLEAN,
 fumier_organique BOOLEAN,
 produits_phytosanitaires BOOLEAN,

 FOREIGN KEY(recensement_id)
 REFERENCES recensements(id)
);

INSERT INTO ouvrages_eau VALUES
(1,1,1),   -- barrage
(1,3,2),   -- forage
(1,4,1);   -- puits

INSERT INTO irrigation VALUES
(1,1,20),   -- aspersion
(1,4,15),   -- goutte à goutte
(1,5,10);   -- pivot

INSERT INTO intrants VALUES
(
1,
TRUE,
FALSE,
FALSE,
TRUE,
TRUE,
TRUE,
FALSE,
TRUE,
TRUE
);

