const express = require('express'),
  validate = require('../middleware/validate'),
  db = require('../db/restDb');

const router = express.Router();

// minden tantargy kilistazasa
router.get('/', (req, res) => {
  db.findAllTantargyak()
    .then((tantargyak) => res.json(tantargyak))
    .catch((err) => res.status(500).json({ message: `Error a tantargyak listazasanal!: ${err.message}` }));
});

// queris kilistazas
router.get('/filter', (req, res) => {
  const TantargyLeiras = req.query.leiras;
  console.log(TantargyLeiras);
  db.findTantargyByLeiras(TantargyLeiras)
    .then((tantargy) => (tantargy ? res.json(tantargy) : res.status(404).json({ message: `Tantargy with Leiras ${TantargyLeiras} not found.` })))
    .catch((err) => res.status(500).json({ message: `Error while finding tantargy with Leiras ${TantargyLeiras}: ${err.message}` }));
});

// findById
router.get('/:TantargyId', (req, res) => {
  const { TantargyId } = req.params;
  db.findTantargyById(TantargyId)
    .then((tantargy) => (tantargy ? res.json(tantargy) : res.status(404).json({ message: `Tantargy with ID ${TantargyId} not found.` })))
    .catch((err) => res.status(500).json({ message: `Error while finding tantargy with ID ${TantargyId}: ${err.message}` }));
});

// egy tantargy feladatai kilstazasa
router.get('/:TantargyId/feladatok', (req, res) => {
  const { TantargyId } = req.params;
  db.feladatokByTantargyId(TantargyId)
    .then((tantargy) => (tantargy ? res.json(tantargy) : res.status(404).json({ message: `Feladatok with Tantargy ID ${TantargyId} not found.` })))
    .catch((err) => res.status(500).json({ message: `Error while finding feladatok with tID ${TantargyId}: ${err.message}` }));
});

// tantargy beszuras
router.post('/', validate.hasProps(['id', 'leiras', 'tulajdonos']), (req, res) => {
  console.log(req.body);
  db.tantargyExists(req.body.id)
    .then((exists) => {
      if (exists) {
        return res.status(400).json({ message: `User with ID ${req.body.id} already exist` });
      }

      return db.insertTantargy(req.body)
        .then((tantargy) => res.status(201).location(`${req.fullUrl}/${tantargy.id}`).json(tantargy));
    })
    .catch((err) => res.status(500).json({ message: `Error while creating tantargy: ${err.message}` }));
});

// tantargy torlese
router.delete('/:TantargyId', (req, res) => {
  const { TantargyId } = req.params;
  db.deleteTantargy(TantargyId)
    .then((rows) => (rows ? res.sendStatus(204) : res.status(404).json({ message: `Tantargy with ID ${TantargyId} not found.` })))
    .catch((err) => res.status(500).json({ message: `Error while deleting tantargy with ID ${TantargyId}: ${err.message}` }));
});

// tantargyak update patch-csel
router.patch('/:TantargyId', validate.hasProps(['leiras']), (req, res) => {
  const { TantargyId } = req.params;
  db.updateTantargy(TantargyId, req.body.leiras)
    .then((rows) => (rows ? res.sendStatus(204) : res.status(404).json({ message: `Tantargy with ID ${TantargyId} not found.` })))
    .catch((err) => res.status(500).json({ message: `Error while updating tantargy with ID ${TantargyId}: ${err.message}` }));
});

// feladat torlese - ajax
router.delete('/:TantargyId/feladatok/:FeladatId', (req, res) => {
  console.log(req.params);
  db.feladatTorles(req.params.FeladatId, (err) => {
    if (err) {
      console.log(`Nem sikeres torles!\n ${err}`);
      const model = JSON.stringify({ uzenet: err });
      console.log(model.uzenet);
      res.status(404).send(JSON.stringify({ uzenet: err, error: 'HIBA' }));
    } else {
      console.log(`Torolve lett az ${req.body.fid} feladat!`);
      res.send(JSON.stringify({ uzenet: 'Sikeres', error: 'Jo' }));
    }
  });
});

// lekerjuk a tantargy leirast
router.get('/:id/leiras', (req, res) => {
  db.leirasTantargy(req.params.id, (err, selectResult) => {
    if (err) {
      res.status(404).send('Db hiba');
    }
    console.log(JSON.stringify(selectResult));
    res.send(JSON.stringify(selectResult));
  });
});

module.exports = router;
