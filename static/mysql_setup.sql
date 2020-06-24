/*letre kell hozni a tablakat a webprog adatbazisban, es nodemon index.js-el inditani*/
/*a usernev es a password is az ab-hez: webprog*/

Create database webprog;
use webprog;
/*SET SQL_SAFE_UPDATES = 0;*/
ALTER USER 'webprog'@'localhost' IDENTIFIED WITH mysql_native_password BY 'webprog';

Create table Tantargyak
(  
	id varchar(10), 
	leiras varchar(50),
    constraint PK_tid PRIMARY KEY (id)
);

ALTER TABLE Tantargyak
ADD tulajdonos varchar(50);
Insert into Tantargyak values ( "Tantargy5", "Ez az elso leiras","qwe");

Create table Feladatok 
( 
	id int NOT NULL AUTO_INCREMENT, 
    tid varchar(10),
    leiras varchar(50), 
    hatarido date, 
    file varchar(30),
    constraint PK_fid primary key (id),
    constraint FK_tid foreign key (tid) references Tantargyak(id) ON DELETE CASCADE
);

Insert into Feladatok (tid,leiras,hatarido,file) values ( "Tantargy5", "Ez az elso feladat","2020-05-07","file.pdf");

Create table Felhasznalok
(
	username varchar(50),
    passwd varchar(150),
    privilege varchar(10),
    constraint PK_username primary key (username)
);
