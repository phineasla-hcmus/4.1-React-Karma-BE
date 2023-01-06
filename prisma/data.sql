-- karma."NGANHANGLIENKET" definition

-- Drop table

-- DROP TABLE karma."NGANHANGLIENKET";

CREATE TABLE karma."NGANHANGLIENKET" (
	"MANH" serial4 NOT NULL,
	"TENNH" varchar(50) NOT NULL,
	"KPUBLIC" text NOT NULL,
	"coCheBaoMat" karma."CoCheBaoMat" NOT NULL DEFAULT 'RSA'::karma."CoCheBaoMat",
	CONSTRAINT "NGANHANGLIENKET_pkey" PRIMARY KEY ("MANH")
);
CREATE UNIQUE INDEX "NGANHANGLIENKET_TENNH_key" ON karma."NGANHANGLIENKET" USING btree ("TENNH");


-- karma."TAIKHOAN" definition

-- Drop table

-- DROP TABLE karma."TAIKHOAN";

CREATE TABLE karma."TAIKHOAN" (
	"MATK" serial4 NOT NULL,
	"TENDANGNHAP" varchar(8) NOT NULL,
	"MATKHAU" varchar(100) NOT NULL,
	"VAITRO" karma."vaitro" NOT NULL,
	"REFRESHTOKEN" varchar(256) NULL,
	"HOATDONG" bool NOT NULL DEFAULT true,
	CONSTRAINT "TAIKHOAN_pkey" PRIMARY KEY ("MATK")
);
CREATE UNIQUE INDEX "TAIKHOAN_TENDANGNHAP_key" ON karma."TAIKHOAN" USING btree ("TENDANGNHAP");


-- karma."DANHSACHNGOAIDALUU" definition

-- Drop table

-- DROP TABLE karma."DANHSACHNGOAIDALUU";

CREATE TABLE karma."DANHSACHNGOAIDALUU" (
	"MATK" int4 NOT NULL,
	"NGUOIDUNG" varchar(20) NOT NULL,
	"TENGOINHO" varchar(20) NOT NULL,
	"MANH" int4 NOT NULL,
	CONSTRAINT "DANHSACHNGOAIDALUU_pkey" PRIMARY KEY ("MATK", "MANH"),
	CONSTRAINT "FK_DANHSACHNGOAIDALUU_NGANHANGLIENKET" FOREIGN KEY ("MANH") REFERENCES karma."NGANHANGLIENKET"("MANH")
);


-- karma."KHACHHANG" definition

-- Drop table

-- DROP TABLE karma."KHACHHANG";

CREATE TABLE karma."KHACHHANG" (
	"MAKH" serial4 NOT NULL,
	"HOTEN" varchar(30) NOT NULL,
	"EMAIL" varchar(30) NOT NULL,
	"SDT" varchar(15) NOT NULL,
	"MATK" int4 NULL,
	CONSTRAINT "KHACHHANG_pkey" PRIMARY KEY ("MAKH"),
	CONSTRAINT "FK_KHACHHANG_TAIKHOAN" FOREIGN KEY ("MATK") REFERENCES karma."TAIKHOAN"("MATK")
);
CREATE UNIQUE INDEX "KHACHHANG_MATK_key" ON karma."KHACHHANG" USING btree ("MATK");


-- karma."NHANVIEN" definition

-- Drop table

-- DROP TABLE karma."NHANVIEN";

CREATE TABLE karma."NHANVIEN" (
	"MANV" serial4 NOT NULL,
	"HOTEN" varchar(30) NOT NULL,
	"SDT" varchar(15) NOT NULL,
	"MATK" int4 NULL,
	CONSTRAINT "NHANVIEN_pkey" PRIMARY KEY ("MANV"),
	CONSTRAINT "FK_NHANVIEN_TAIKHOAN" FOREIGN KEY ("MATK") REFERENCES karma."TAIKHOAN"("MATK")
);
CREATE UNIQUE INDEX "NHANVIEN_MATK_key" ON karma."NHANVIEN" USING btree ("MATK");


-- karma."TAIKHOANTHANHTOAN" definition

-- Drop table

-- DROP TABLE karma."TAIKHOANTHANHTOAN";

CREATE TABLE karma."TAIKHOANTHANHTOAN" (
	"SOTK" varchar(12) NOT NULL,
	"SODU" int4 NOT NULL,
	"MATK" int4 NULL,
	"HOATDONG" bool NOT NULL DEFAULT true,
	CONSTRAINT "TAIKHOANTHANHTOAN_pkey" PRIMARY KEY ("SOTK"),
	CONSTRAINT "FK_TAIKHOANTHANHTOAN_TAIKHOAN" FOREIGN KEY ("MATK") REFERENCES karma."TAIKHOAN"("MATK")
);
CREATE UNIQUE INDEX "TAIKHOANTHANHTOAN_MATK_key" ON karma."TAIKHOANTHANHTOAN" USING btree ("MATK");


-- karma."CHUYENKHOANNGANHANGNGOAI" definition

-- Drop table

-- DROP TABLE karma."CHUYENKHOANNGANHANGNGOAI";

CREATE TABLE karma."CHUYENKHOANNGANHANGNGOAI" (
	"MACKN" serial4 NOT NULL,
	"TKTRONG" varchar(12) NOT NULL,
	"TKNGOAI" varchar(20) NOT NULL,
	"SOTIEN" int4 NOT NULL,
	"MANGANHANG" int4 NOT NULL,
	"NOIDUNGCK" text NOT NULL,
	"THOIGIAN" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"LOAICK" karma."LoaiCK" NOT NULL DEFAULT 'sender'::karma."LoaiCK",
	"PHICK" int4 NOT NULL DEFAULT 0,
	CONSTRAINT "CHUYENKHOANNGANHANGNGOAI_pkey" PRIMARY KEY ("MACKN"),
	CONSTRAINT "FK_CHUYENKHOANNGANHANGNGOAI" FOREIGN KEY ("MANGANHANG") REFERENCES karma."NGANHANGLIENKET"("MANH"),
	CONSTRAINT "FK_CHUYENKHOANNGOAI_TAIKHOANTHANHTOAN" FOREIGN KEY ("TKTRONG") REFERENCES karma."TAIKHOANTHANHTOAN"("SOTK")
);


-- karma."CHUYENKHOANNOIBO" definition

-- Drop table

-- DROP TABLE karma."CHUYENKHOANNOIBO";

CREATE TABLE karma."CHUYENKHOANNOIBO" (
	"MACK" serial4 NOT NULL,
	"NGUOICHUYEN" varchar(12) NOT NULL,
	"NGUOINHAN" varchar(12) NOT NULL,
	"SOTIEN" int4 NOT NULL,
	"NOIDUNGCK" text NULL,
	"NGAYCK" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"LOAICK" karma."LoaiCK" NOT NULL DEFAULT 'sender'::karma."LoaiCK",
	"PHICK" int4 NOT NULL DEFAULT 0,
	CONSTRAINT "CHUYENKHOANNOIBO_pkey" PRIMARY KEY ("MACK"),
	CONSTRAINT "FK_CHUYENKHOAN_TAIKHOANTHANHTOAN1" FOREIGN KEY ("NGUOICHUYEN") REFERENCES karma."TAIKHOANTHANHTOAN"("SOTK"),
	CONSTRAINT "FK_CHUYENKHOAN_TAIKHOANTHANHTOAN2" FOREIGN KEY ("NGUOINHAN") REFERENCES karma."TAIKHOANTHANHTOAN"("SOTK")
);


-- karma."DANHSACHDALUU" definition

-- Drop table

-- DROP TABLE karma."DANHSACHDALUU";

CREATE TABLE karma."DANHSACHDALUU" (
	"MATK" int4 NOT NULL,
	"NGUOIDUNG" varchar(12) NOT NULL,
	"TENGOINHO" varchar(20) NOT NULL,
	CONSTRAINT "DANHSACHDALUU_pkey" PRIMARY KEY ("MATK", "NGUOIDUNG"),
	CONSTRAINT "FK_DANHSACHDALUU1_TAIKHOAN" FOREIGN KEY ("MATK") REFERENCES karma."TAIKHOAN"("MATK"),
	CONSTRAINT "FK_DANHSACHDALUU2_TAIKHOANTHANHTOAN" FOREIGN KEY ("NGUOIDUNG") REFERENCES karma."TAIKHOANTHANHTOAN"("SOTK")
);


-- karma."LICHSUNAPTIEN" definition

-- Drop table

-- DROP TABLE karma."LICHSUNAPTIEN";

CREATE TABLE karma."LICHSUNAPTIEN" (
	"MAGG" serial4 NOT NULL,
	"MANHANVIEN" int4 NOT NULL,
	"SOTK" varchar(12) NOT NULL,
	"SOTIEN" int4 NOT NULL,
	"THOIGIAN" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "LICHSUNAPTIEN_pkey" PRIMARY KEY ("MAGG"),
	CONSTRAINT "FK_LICHSUNAPTIEN_NHANVIEN" FOREIGN KEY ("MANHANVIEN") REFERENCES karma."NHANVIEN"("MANV"),
	CONSTRAINT "FK_LICHSUNAPTIEN_TAIKHOANTHANHTOAN" FOREIGN KEY ("SOTK") REFERENCES karma."TAIKHOANTHANHTOAN"("SOTK")
);


-- karma."NHACNO" definition

-- Drop table

-- DROP TABLE karma."NHACNO";

CREATE TABLE karma."NHACNO" (
	"MANN" serial4 NOT NULL,
	"NGUOIGUI" int4 NOT NULL,
	"NGUOINHAN" int4 NOT NULL,
	"SOTIEN" int4 NOT NULL,
	"NGAYTAO" date NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"NOIDUNGNN" text NULL,
	"TRANGTHAI" bool NOT NULL DEFAULT true,
	"NGAYTHANHTOAN" date NULL,
	"DATHANHTOAN" bool NOT NULL,
	"NOIDUNGXOA" text NULL,
	"CHUYENKHOAN" int4 NULL,
	CONSTRAINT "NHACNO_pkey" PRIMARY KEY ("MANN"),
	CONSTRAINT "FK_NHACNO1_TAIKHOAN" FOREIGN KEY ("NGUOIGUI") REFERENCES karma."TAIKHOAN"("MATK"),
	CONSTRAINT "FK_NHACNO2_TAIKHOAN" FOREIGN KEY ("NGUOINHAN") REFERENCES karma."TAIKHOAN"("MATK"),
	CONSTRAINT "FK_NHACNO_CHUYENKHOANNOIBO" FOREIGN KEY ("CHUYENKHOAN") REFERENCES karma."CHUYENKHOANNOIBO"("MACK")
);
CREATE UNIQUE INDEX "NHACNO_CHUYENKHOAN_key" ON karma."NHACNO" USING btree ("CHUYENKHOAN");


-- karma."OTPCHUYENKHOAN" definition

-- Drop table

-- DROP TABLE karma."OTPCHUYENKHOAN";

CREATE TABLE karma."OTPCHUYENKHOAN" (
	"SOTK" varchar(12) NOT NULL,
	"NGUOINHAN" varchar(20) NOT NULL,
	"SOTIEN" int4 NOT NULL,
	"OTP" int4 NOT NULL,
	"NGAYTAO" date NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "OTPCHUYENKHOAN_pkey" PRIMARY KEY ("SOTK"),
	CONSTRAINT "FK_CHUYENKHOANNGOAI_TAIKHOANTHANHTOAN" FOREIGN KEY ("SOTK") REFERENCES karma."TAIKHOANTHANHTOAN"("SOTK")
);



INSERT INTO karma."CHUYENKHOANNGANHANGNGOAI" ("TKTRONG","TKNGOAI","SOTIEN","MANGANHANG","NOIDUNGCK","THOIGIAN","LOAICK","PHICK") VALUES
	 ('8327026569','123123123',200000,1,'huhu','2023-01-04 23:20:38.252','sender',0),
	 ('6150695609','123123123',-20000,2,'happy new year','2023-01-04 23:20:46.038','sender',0),
	 ('6150695609','123123123',1000000,1,'hihi','2023-01-04 17:20:38.243','receiver',0);
INSERT INTO karma."CHUYENKHOANNOIBO" ("NGUOICHUYEN","NGUOINHAN","SOTIEN","NOIDUNGCK","NGAYCK","LOAICK","PHICK") VALUES
	 ('8327026569','1569371459',697291,'A dignissimos odit nesciunt voluptatum est quo consectetur doloribus ut.','2023-01-04 14:59:58.056','sender',0),
	 ('8327026569','6150695609',21526,'Cumque blanditiis quibusdam illum eaque.','2023-01-04 14:59:58.061','sender',0),
	 ('8327026569','4784406573',411633,'Ipsam rerum veritatis ab.','2023-01-04 14:59:58.064','sender',0),
	 ('8327026569','6150695609',712595,'Deleniti in quibusdam incidunt illo eius nam optio voluptatem.','2023-01-04 14:59:58.066','sender',0),
	 ('8327026569','4784406573',757811,'Ratione laudantium enim tempora eveniet tempora occaecati corporis.','2023-01-04 14:59:58.068','sender',0),
	 ('8327026569','4784406573',592353,'Dolor totam dolorum.','2023-01-04 14:59:58.07','sender',0),
	 ('8327026569','2795767997',102452,'Repellat sed dignissimos.','2023-01-04 14:59:58.072','sender',0),
	 ('8327026569','4784406573',786485,'Pariatur omnis officia asperiores.','2023-01-04 14:59:58.075','sender',0),
	 ('6150695609','8327026569',27149,'Sit esse accusamus dolores expedita.','2023-01-04 14:59:58.078','sender',0),
	 ('6150695609','8327026569',451191,'Saepe modi similique ab doloribus ab voluptatem est praesentium.','2023-01-04 14:59:58.08','sender',0);
INSERT INTO karma."CHUYENKHOANNOIBO" ("NGUOICHUYEN","NGUOINHAN","SOTIEN","NOIDUNGCK","NGAYCK","LOAICK","PHICK") VALUES
	 ('6150695609','8327026569',35289,'Iusto voluptatum soluta laborum dolore illum facere veritatis.','2023-01-04 14:59:58.082','sender',0),
	 ('6150695609','8327026569',789366,'Quidem temporibus hic libero harum neque corporis aut.','2023-01-04 14:59:58.084','sender',0),
	 ('1569371459','8327026569',582750,'Fugiat quos nihil repellat.','2023-01-04 14:59:58.086','sender',0),
	 ('4784406573','8327026569',189689,'Magnam quasi minus officiis rerum dignissimos quisquam.','2023-01-04 14:59:58.088','sender',0),
	 ('6150695609','8327026569',451227,'Quia repellendus consequatur.','2023-01-04 14:59:58.09','sender',0),
	 ('6150695609','8327026569',27922,'Quia adipisci molestias iure voluptatum ea.','2023-01-04 14:59:58.091','sender',0),
	 ('2795767997','8327026569',604583,'Aspernatur voluptate esse facere eius dolores magni.','2023-01-04 14:59:58.093','sender',0),
	 ('2795767997','1569371459',268856,'Velit quam dicta expedita.','2023-01-04 14:59:58.095','sender',0),
	 ('2795767997','8327026569',360130,'Fugit consectetur aliquam tenetur magnam at aliquam cupiditate repellat.','2023-01-04 14:59:58.096','sender',0),
	 ('2795767997','8327026569',798682,'Inventore perspiciatis iusto voluptatum nemo officiis voluptate et tempore.','2023-01-04 14:59:58.098','sender',0);
INSERT INTO karma."CHUYENKHOANNOIBO" ("NGUOICHUYEN","NGUOINHAN","SOTIEN","NOIDUNGCK","NGAYCK","LOAICK","PHICK") VALUES
	 ('2795767997','8327026569',918403,'Magni libero est quasi eaque hic occaecati unde.','2023-01-04 14:59:58.099','sender',0),
	 ('2795767997','4784406573',479820,'Ducimus cumque vel ut ullam error inventore est.','2023-01-04 14:59:58.101','sender',0),
	 ('2795767997','1569371459',441056,'Quidem aliquid et.','2023-01-04 14:59:58.103','sender',0),
	 ('2795767997','6150695609',228354,'Dolorum expedita aut rem pariatur ducimus voluptatem totam.','2023-01-04 14:59:58.104','sender',0),
	 ('6150695609','2795767997',386033,'Alias pariatur officiis nulla fugiat quam exercitationem eos natus earum.','2023-01-04 14:59:58.106','sender',0),
	 ('6150695609','2795767997',635627,'Facilis excepturi quos nihil labore.','2023-01-04 14:59:58.108','sender',0),
	 ('6150695609','2795767997',409851,'Hic consequatur dolores accusantium iure dolores commodi nisi.','2023-01-04 14:59:58.109','sender',0),
	 ('6150695609','2795767997',285133,'Iure maxime magni.','2023-01-04 14:59:58.111','sender',0),
	 ('4784406573','2795767997',876346,'Odit occaecati suscipit officia qui perferendis laboriosam consequatur cumque.','2023-01-04 14:59:58.113','sender',0),
	 ('6150695609','2795767997',623921,'Excepturi eligendi dignissimos quibusdam vel veritatis illum labore nesciunt nisi.','2023-01-04 14:59:58.115','sender',0);
INSERT INTO karma."CHUYENKHOANNOIBO" ("NGUOICHUYEN","NGUOINHAN","SOTIEN","NOIDUNGCK","NGAYCK","LOAICK","PHICK") VALUES
	 ('4784406573','2795767997',499329,'Repudiandae magnam voluptate alias ipsam suscipit fugit unde velit.','2023-01-04 14:59:58.117','sender',0),
	 ('8327026569','2795767997',321176,'Sapiente nostrum tempore aliquam numquam quae iure.','2023-01-04 14:59:58.119','sender',0),
	 ('4784406573','2795767997',167599,'Cum quos blanditiis rem.','2023-01-04 14:59:58.12','sender',0),
	 ('4784406573','6150695609',39482,'Numquam quisquam distinctio perspiciatis necessitatibus qui iure.','2023-01-04 14:59:58.122','sender',0),
	 ('4784406573','1569371459',144585,'Distinctio doloribus perspiciatis distinctio quam tempora.','2023-01-04 14:59:58.123','sender',0),
	 ('4784406573','1569371459',969935,'Fuga adipisci totam aspernatur beatae aliquid dolorum omnis excepturi ipsum.','2023-01-04 14:59:58.125','sender',0),
	 ('4784406573','1569371459',891741,'Pariatur ipsum iure hic cupiditate excepturi eum.','2023-01-04 14:59:58.127','sender',0),
	 ('4784406573','1569371459',607641,'Earum harum sapiente iure.','2023-01-04 14:59:58.128','sender',0),
	 ('4784406573','1569371459',681058,'Maiores maiores minima inventore esse eius ipsum veniam facere vel.','2023-01-04 14:59:58.13','sender',0),
	 ('4784406573','8327026569',164102,'Earum minus odio distinctio reiciendis ea provident.','2023-01-04 14:59:58.132','sender',0);
INSERT INTO karma."CHUYENKHOANNOIBO" ("NGUOICHUYEN","NGUOINHAN","SOTIEN","NOIDUNGCK","NGAYCK","LOAICK","PHICK") VALUES
	 ('1569371459','4784406573',679738,'Veniam quasi maiores exercitationem.','2023-01-04 14:59:58.133','sender',0),
	 ('2795767997','4784406573',149867,'Magni fugiat sit omnis voluptas labore blanditiis voluptatum vero.','2023-01-04 14:59:58.135','sender',0),
	 ('6150695609','4784406573',444200,'Totam voluptatem deleniti.','2023-01-04 14:59:58.137','sender',0),
	 ('2795767997','4784406573',318534,'Ratione dolore necessitatibus quis quam architecto laboriosam eius officia.','2023-01-04 14:59:58.138','sender',0),
	 ('8327026569','4784406573',409584,'Saepe consectetur nemo in molestiae harum.','2023-01-04 14:59:58.14','sender',0),
	 ('8327026569','4784406573',290963,'Facere fugiat non corporis in excepturi qui voluptate.','2023-01-04 14:59:58.141','sender',0),
	 ('2795767997','4784406573',156875,'Minima corporis dolor quisquam et occaecati.','2023-01-04 14:59:58.143','sender',0),
	 ('8327026569','4784406573',760491,'Omnis tempora minima illo doloremque ut vel consectetur.','2023-01-04 14:59:58.145','sender',0),
	 ('6150695609','8327026569',621897,'Vitae voluptate deserunt illo hic assumenda ab corrupti harum.','2023-01-04 14:59:58.146','sender',0),
	 ('6150695609','1569371459',227632,'Impedit aut quo possimus.','2023-01-04 14:59:58.148','sender',0);
INSERT INTO karma."CHUYENKHOANNOIBO" ("NGUOICHUYEN","NGUOINHAN","SOTIEN","NOIDUNGCK","NGAYCK","LOAICK","PHICK") VALUES
	 ('6150695609','8327026569',92392,'Dicta rem vero consectetur eveniet.','2023-01-04 14:59:58.15','sender',0),
	 ('6150695609','4784406573',281295,'Aliquid corporis placeat soluta tempora.','2023-01-04 14:59:58.151','sender',0),
	 ('6150695609','8327026569',184571,'Possimus repudiandae soluta ut non laudantium deserunt.','2023-01-04 14:59:58.153','sender',0),
	 ('6150695609','8327026569',279508,'Dignissimos blanditiis ad ducimus omnis animi.','2023-01-04 14:59:58.154','sender',0),
	 ('6150695609','1569371459',237505,'Voluptas natus suscipit quae eos vitae quasi dolor sequi laudantium.','2023-01-04 14:59:58.156','sender',0),
	 ('6150695609','2795767997',991709,'Quis ut porro voluptates voluptatem cumque reprehenderit sapiente.','2023-01-04 14:59:58.158','sender',0),
	 ('8327026569','6150695609',178792,'Laborum ipsum similique nobis fugit numquam.','2023-01-04 14:59:58.159','sender',0),
	 ('8327026569','6150695609',29532,'Quis blanditiis nemo voluptatum animi deleniti.','2023-01-04 14:59:58.161','sender',0),
	 ('8327026569','6150695609',745341,'Error consequuntur aut quasi veritatis harum deleniti non eaque.','2023-01-04 14:59:58.162','sender',0),
	 ('1569371459','6150695609',746528,'Nemo quae cumque rem distinctio.','2023-01-04 14:59:58.164','sender',0);
INSERT INTO karma."CHUYENKHOANNOIBO" ("NGUOICHUYEN","NGUOINHAN","SOTIEN","NOIDUNGCK","NGAYCK","LOAICK","PHICK") VALUES
	 ('1569371459','6150695609',384844,'Nulla aliquam sapiente animi mollitia rem.','2023-01-04 14:59:58.166','sender',0),
	 ('8327026569','6150695609',950278,'Aperiam sint minima enim ratione veniam perferendis similique nam provident.','2023-01-04 14:59:58.168','sender',0),
	 ('1569371459','6150695609',819137,'Ipsa nulla expedita.','2023-01-04 14:59:58.17','sender',0),
	 ('4784406573','6150695609',934632,'Ratione adipisci quo illum dicta doloremque quibusdam placeat explicabo nisi.','2023-01-04 14:59:58.173','sender',0),
	 ('1569371459','6150695609',554226,'Quasi reiciendis laborum ipsum.','2023-01-04 14:59:58.175','sender',0),
	 ('1569371459','6150695609',275862,'Fugiat reprehenderit maiores.','2023-01-04 14:59:58.177','sender',0),
	 ('1569371459','6150695609',75497,'Iusto iste occaecati commodi magnam aspernatur deleniti sequi ipsam.','2023-01-04 14:59:58.178','sender',0),
	 ('1569371459','6150695609',268678,'Tempora earum esse officiis illum quisquam repudiandae accusamus.','2023-01-04 14:59:58.18','sender',0),
	 ('1569371459','2795767997',736927,'Minima aperiam placeat perspiciatis deleniti eos necessitatibus.','2023-01-04 14:59:58.182','sender',0),
	 ('1569371459','4784406573',297360,'Tenetur quaerat quaerat consequuntur nihil quidem suscipit esse veniam laudantium.','2023-01-04 14:59:58.183','sender',0);
INSERT INTO karma."CHUYENKHOANNOIBO" ("NGUOICHUYEN","NGUOINHAN","SOTIEN","NOIDUNGCK","NGAYCK","LOAICK","PHICK") VALUES
	 ('1569371459','8327026569',228598,'Maxime sapiente unde culpa nobis suscipit corporis saepe.','2023-01-04 14:59:58.185','sender',0),
	 ('1569371459','8327026569',905627,'Quas cumque adipisci porro quod qui inventore hic quasi maiores.','2023-01-04 14:59:58.187','sender',0),
	 ('4784406573','1569371459',621848,'Modi illo ad reiciendis.','2023-01-04 14:59:58.189','sender',0),
	 ('4784406573','1569371459',6561,'Quam sed sed.','2023-01-04 14:59:58.19','sender',0),
	 ('4784406573','1569371459',416609,'Accusamus amet aperiam nemo.','2023-01-04 14:59:58.192','sender',0),
	 ('4784406573','1569371459',514972,'Maiores veritatis et tenetur corporis molestias omnis aliquid laborum molestias.','2023-01-04 14:59:58.193','sender',0),
	 ('8327026569','1569371459',193689,'At quos necessitatibus.','2023-01-04 14:59:58.195','sender',0),
	 ('6150695609','1569371459',101661,'Quibusdam enim quaerat ducimus aut explicabo.','2023-01-04 14:59:58.197','sender',0),
	 ('6150695609','1569371459',453209,'Deleniti laborum a ex fugiat hic quos iure accusamus harum.','2023-01-04 14:59:58.198','sender',0),
	 ('4784406573','1569371459',246222,'Fuga hic minus velit tempore molestiae architecto.','2023-01-04 14:59:58.2','sender',0);
INSERT INTO karma."DANHSACHDALUU" ("MATK","NGUOIDUNG","TENGOINHO") VALUES
	 (4,'2795767997','earum'),
	 (4,'4784406573','cumque'),
	 (4,'6150695609','voluptate'),
	 (4,'1569371459','distinctio'),
	 (5,'4784406573','occaecati'),
	 (5,'6150695609','deserunt'),
	 (5,'1569371459','quaerat'),
	 (6,'6150695609','harum'),
	 (6,'1569371459','ex'),
	 (7,'1569371459','hic');
INSERT INTO karma."KHACHHANG" ("HOTEN","EMAIL","SDT","MATK") VALUES
	 ('Vladimir Jast','Vladimir62@gmail','0970575384',4),
	 ('Dave Abshire','Dave.Abshire@gmail','0988495753',5),
	 ('Alan O''Hara','Alan.OHara56@gmail','0911218991',6),
	 ('Zora Shanahan','Zora40@gmail','0907704410',7),
	 ('Amanda VonRueden','Amanda2@gmail','0953829878',8);
INSERT INTO karma."NGANHANGLIENKET" ("TENNH","KPUBLIC","coCheBaoMat") VALUES
	 ('Test','abc','RSA'),
	 ('TestBank ','asdkjaksd','RSA'),
INSERT INTO karma."NHANVIEN" ("HOTEN","SDT","MATK") VALUES
	 ('Annabell Kuvalis','0987068346',1),
	 ('Kamren Fay','0933955895',2);
INSERT INTO karma."TAIKHOAN" ("TENDANGNHAP","MATKHAU","VAITRO","REFRESHTOKEN","HOATDONG") VALUES
	 ('90347442','$2b$10$3o6Cbai9G6.X8p.P/zW1AOcCwKWkoYA.ad85aRRTms7/8HF5dJ316','Banker',NULL,true),
	 ('91192165','$2b$10$3o6Cbai9G6.X8p.P/zW1AOcCwKWkoYA.ad85aRRTms7/8HF5dJ316','Banker',NULL,true),
	 ('58211468','$2b$10$3o6Cbai9G6.X8p.P/zW1AOcCwKWkoYA.ad85aRRTms7/8HF5dJ316','Admin',NULL,true),
	 ('15793691','$2b$10$3o6Cbai9G6.X8p.P/zW1AOcCwKWkoYA.ad85aRRTms7/8HF5dJ316','User',NULL,true),
	 ('44095114','$2b$10$3o6Cbai9G6.X8p.P/zW1AOcCwKWkoYA.ad85aRRTms7/8HF5dJ316','User',NULL,true),
	 ('46924505','$2b$10$3o6Cbai9G6.X8p.P/zW1AOcCwKWkoYA.ad85aRRTms7/8HF5dJ316','User',NULL,true),
	 ('95317824','$2b$10$3o6Cbai9G6.X8p.P/zW1AOcCwKWkoYA.ad85aRRTms7/8HF5dJ316','User',NULL,true),
	 ('41568167','$2b$10$3o6Cbai9G6.X8p.P/zW1AOcCwKWkoYA.ad85aRRTms7/8HF5dJ316','User',NULL,true);
INSERT INTO karma."TAIKHOANTHANHTOAN" ("SOTK","SODU","MATK","HOATDONG") VALUES
	 ('8327026569',72303591,4,true),
	 ('2795767997',49766030,5,true),
	 ('4784406573',43493347,6,true),
	 ('6150695609',87055553,7,true),
	 ('1569371459',15216107,8,true);
