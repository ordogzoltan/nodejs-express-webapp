// Moduláris express router létrehozása
const express = require('express'),
  fs = require('fs'),
  path = require('path'),
  bodyParser = require('body-parser'),
  eformidable = require('express-formidable'),
  auth = require('../middleware/authorize'),
  db = require('../db/db');

const router = express.Router();

// feladat torlese - ajax
router.post('/feladatTorles', bodyParser.json(), auth.authorize(['user', 'admin']), (req, res) => {
  console.log(req.body);
  const dbReq = {
    fid: req.body.fid,
    user: req.session.username,
  };
  console.log(dbReq);
  db.TantargyLetrehozasaCheck(dbReq, (err1, selectResult) => {
    if (Object.keys(selectResult).length === 0) {
      res.status(404).render('error', { status: 404, message: 'Nem az adott user hozta letre a tantargyat' });
    } else {
      db.feladatTorles(req.body.fid, (err) => {
        if (err) {
          console.log(`Nem sikeres torles!\n ${err}`);
          const model = JSON.stringify({ uzenet: err });
          console.log(model.uzenet);
          res.status(404).send(JSON.stringify({ uzenet: err, error: 'HIBA' }));
        } else {
          console.log(`Torolve lett az ${req.body.fid} feladat!`);
          res.send(JSON.stringify({ uzenet: 'Sikeres', error: false }));
        }
      });
    }
  });
});

// redirect a feladatok es uj feladat
router.get('/feladat_:id', auth.authorize(['user', 'admin']), (request, response) => {
  // ellenorzes
  db.letezikTantargy(request.params.id, (err, selectResult) => {
    if (Object.keys(selectResult).length === 0) {
      response.status(404).render('error', { status: 404, message: `Nem letezik ilyen ID (${request.params.id}), nem lehet betolteni a feladatokat!` });
    } else {
      // maga a feladat megjelenitese
      db.feladatok(request, (err2, feladatok) => {
        if (err2) {
          response.status(500).render('error', { status: 500, eredmeny: 'Hiba tortent a feladatok betoltesenel!' });
        }
        console.log(feladatok);
        console.log(`tulajdonos= ${selectResult[0].tulajdonos} || session role= ${request.session.username}`);
        if (request.session.role === 'admin') {
          if (request.session.username === selectResult[0].tulajdonos) {
            response.render('feladatok', {
              eredmeny: feladatok, user: request.session.username, admin: 'yes', tulajdonos: 'yes',
            });
          } else {
            response.render('feladatok', { eredmeny: feladatok, user: request.session.username, admin: 'yes' });
          }
        } else {
          response.render('feladatok', { eredmeny: feladatok, user: request.session.username });
        }
      });
    }
  });
});

const uploadDir = path.join(__dirname, '../uploadDir');

// feltöltési mappa elkészítése
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

router.use(eformidable({ uploadDir }));

// submit feladat
router.post('/submit_form_uj_feladat_:id', auth.authorize('admin'), (request, response) => {
  // az állományok a request.files-ban lesznek
  const fileHandler = request.files.allomany;

  // nezzuk ha pdf, ha nem letorlom
  const regexPdf = /.+\.pdf$/;
  if (!regexPdf.test(fileHandler.name)) {
    // ha nem pdf, akkor torli, s error:
    fs.unlink(fileHandler.path, (err) => {
      if (err) {
        response.status(500).render('error', { status: 500, eredmeny: 'Hiba tortent a feladatok betoltesenel!', user: request.session.username });
      }
      console.log(`${fileHandler.name} was deleted`);
    });
    console.log(request.params.id);
    db.feladatok(request, (err, selectResult) => {
      response.status(400).render('feladatok', { eredmeny: selectResult, error: 'Nem PDF a file!', user: request.session.username });
    });
  } else {
    // ha pdf, akkor feltolti:
    const model = {
      id: request.params.id,
      leiras: request.fields.fleiras,
      hatarido: request.fields.hatarido,
      file: fileHandler.name,
    };
    console.log(model);

    db.ujFeladat(model, (err) => {
      if (err) {
        console.log(`Sikertelen feladat feltoltes!\n ${err}`);
      } else {
        db.feladatok(request, (errFeltoltes, selectResult) => {
          if (errFeltoltes) {
            console.log(`Sikertelen feladat feltoltes!\n ${errFeltoltes}`);
          } else {
            console.log(selectResult);
            response.redirect(`/feladat_${model.id}`);
          }
        });
      }
    });
  }
});

module.exports = router;
