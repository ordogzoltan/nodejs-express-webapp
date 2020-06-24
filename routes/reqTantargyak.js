const express = require('express'),
  { check, validationResult } = require('express-validator'),
  auth = require('../middleware/authorize'),
  db = require('../db/db');

const router = express.Router();

// lekerjuk a tantargy leirast
router.get('/tantargyLeiras_:id', auth.authorize(['user', 'admin']), (req, res) => {
  db.leirasTantargy(req.params.id, (err, selectResult) => {
    if (err) {
      res.status(404).send('Db hiba');
    }
    console.log(JSON.stringify(selectResult));
    res.send(JSON.stringify(selectResult));
  });
});

// uj tantargy
router.get('/uj_targy', auth.authorize('admin'), (req, res) => {
  res.render('uj_targy', { user: req.session.username, admin: 'yes' });
});

// formfeldolgozás uj tantrgy
router.post('/submit_form_uj_targy', [check('id').not().isEmpty()], auth.authorize('admin'), (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).render('uj_targy', { error: 'ID empty!' });
  } else {
    console.log(req.body.id);
    db.letezikTantargy(req.body.id, (err, selectResult) => {
      console.log(Object.keys(selectResult).length);
      if (Object.keys(selectResult).length >= 1) {
        res.status(400).render('uj_targy', { error: 'ID already exists!' });
      } else {
        const model = {
          id: req.body.id,
          leiras: req.body.leiras,
          tulajdonos: req.session.username,
        };
        console.log(model);
        db.ujTargy(model, () => {
          res.redirect('/');
        });
      }
    });
  }
});

// tantargy torlese
router.post('/torles_:id', auth.authorize('admin'), (request, response) => {
  // ellenorzes
  db.letezikTantargy(request.params.id, (err, selectResult) => {
    console.log(Object.keys(selectResult).length);
    if (Object.keys(selectResult).length === 0) {
      response.status(404).render('error', { status: 404, message: `Nem letezik ilyen ID (${request.params.id}), nem lehetett torolni!` });
    } else {
      // maga a feladat megjelenitese
      console.log(`Torolve lett az ${request.params.id} Tantargy`);
      db.tantargyTorles(request.params.id, () => {
        response.redirect('/');
      });
    }
  });
});

module.exports = router;
