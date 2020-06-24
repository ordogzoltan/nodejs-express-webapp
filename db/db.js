// Adatbázis műveleteket végző modul

const mysql = require('mysql');

const pool = mysql.createPool({
  connectionLimit: 20,
  database: 'webprog',
  host: 'localhost',
  port: 3306,
  user: 'webprog',
  password: 'webprog',
});

// uj targy beszurasa az adatbazisba
exports.ujTargy = (req, callback) => {
  const query = `INSERT INTO Tantargyak (id,leiras,tulajdonos)
    VALUES ("${req.id}", "${req.leiras}", "${req.tulajdonos}");`;
  console.log(`req.tulajdonos: ${req.tulajdonos}`);
  pool.query(query, callback);
};

// egy tantargy leirasank lekerese
exports.leirasTantargy = (req, callback) => {
  const query = `SELECT leiras FROM Tantargyak WHERE id="${req}"`;
  pool.query(query, callback);
};

// leker minden tantargyat
exports.mindenTantargy = (req, callback) => {
  const query = 'SELECT * FROM Tantargyak';
  pool.query(query, callback);
};

// feladat lekrese id szerint
exports.feladatok = (req, callback) => {
  const query = `select Tantargyak.id tid, Feladatok.id, Feladatok.leiras, hatarido, file
  from Tantargyak left join Feladatok on Tantargyak.id=Feladatok.tid
  where Tantargyak.id="${req.params.id}"`;
  pool.query(query, callback);
};

// uj feladat beszurasa
exports.ujFeladat = (req, callback) => {
  const query = `INSERT INTO Feladatok (tid,leiras,hatarido,file)
  VALUES ("${req.id}", "${req.leiras}", "${req.hatarido}", "${req.file}");`;
  pool.query(query, callback);
};

// tantargy torles
exports.tantargyTorles = (req, callback) => {
  const query = `Delete t,f from Tantargyak t left join Feladatok f on t.id = f.id where t.id="${req}";`;
  pool.query(query, callback);
};

// ellenorizzuk ha letezik a tantargy
exports.letezikTantargy = (req, callback) => {
  console.log(req);
  const query = `SELECT id,tulajdonos FROM Tantargyak WHERE id="${req}"`;
  pool.query(query, callback);
};


// password hash eltarolasa az ab-ben
exports.registerUser = (req, callback) => {
  const query = `INSERT INTO Felhasznalok (username,passwd,privilege) VALUES ("${req.user}", "${req.password}", "${req.priv}");`;
  pool.query(query, callback);
};

// user es password lekerese
exports.checkUser = (req, callback) => {
  console.log(req);
  const query = `Select * from Felhasznalok where username = "${req}"`;
  pool.query(query, callback);
};

// feladat torlese
exports.feladatTorles = (req, callback) => {
  console.log(req);
  const query = `Delete from Feladatok where id="${req}";`;
  pool.query(query, callback);
};

// feladat lekrese id es user szerint
exports.TantargyLetrehozasaCheck = (req, callback) => {
  const query = `select Tantargyak.tulajdonos from Tantargyak left join Feladatok on Tantargyak.id=Feladatok.tid
  where Feladatok.id="${req.fid}" and Tantargyak.tulajdonos="${req.user}";`;
  pool.query(query, callback);
};
