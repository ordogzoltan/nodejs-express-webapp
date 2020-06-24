const execute = require('./config');

// összes tantargy visszatérítése
exports.findAllTantargyak = () => execute('SELECT * FROM Tantargyak');

// tantargy id szerint
exports.findTantargyById = (id) => execute('SELECT * FROM Tantargyak WHERE id=?', [id])
  .then((tantargy) => tantargy[0]);

// tantargy leiras szerint
exports.findTantargyByLeiras = (id) => execute('SELECT * FROM Tantargyak WHERE leiras like ?', [id])
  .then((tantargy) => tantargy[0]);

// feladatok tantargy id szerint
exports.feladatokByTantargyId = (id) => execute('SELECT * FROM Feladatok WHERE tid=?', [id]);

// ha letezik ilyen tantargy
exports.tantargyExists = (userId) => execute('SELECT COUNT(*) AS count FROM Tantargyak WHERE id=?', [userId])
  .then((result) => (result[0].count > 0));

// insert
exports.insertTantargy = (tantargy) => execute('INSERT INTO Tantargyak VALUES (?,?,?)',
  [tantargy.id, tantargy.leiras, tantargy.tulajdonos])
  .then((result) => ({
    id: result.id,
    leiras: result.leiras,
    tulajdonos: result.tulajdonos,
  }));

// tantargy törlése
// Kikérjük a módosított sorok számát (innen tudjuk hogy létezett-e)
exports.deleteTantargy = (TantargyId) => execute('DELETE FROM Tantargyak WHERE id=?', [TantargyId])
  .then((result) => result.affectedRows > 0);

// Módosítás
// Kikérjük a módosított sorok számát (innen tudjuk hogy létezik-e)
exports.updateTantargy = (tantargyId, leiras) => execute('UPDATE Tantargyak SET leiras=? WHERE id=?', [leiras, tantargyId])
  .then((result) => result.affectedRows > 0);
