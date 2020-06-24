// Moduláris express router létrehozása
const express = require('express'),
  { check, validationResult } = require('express-validator'),
  crypto = require('crypto'),
  session = require('express-session'),
  auth = require('../middleware/authorize'),
  db = require('../db/db');

const hashSize = 32,
  saltSize = 16,
  hashAlgorithm = 'sha512',
  iterations = 1000;

const router = express.Router();

router.use(session({
  secret: '142e6ecf42884f03',
  resave: false,
  saveUninitialized: true,
}));


router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/register', (req, res) => {
  res.render('register');
});

// register
// generálunk hash-t egy jelszóból
router.post('/create_hash', [check('username').not().isEmpty()], [check('password').not().isEmpty()], [check('privilege').not().isEmpty()], (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).render('register', { error: 'User credentials empty!' });
  } else {
    const { username, password, privilege } = req.body;
    console.log(username);
    console.log(password);
    console.log(privilege);

    const salt = crypto.randomBytes(saltSize);
    // hash készítése
    const hash = crypto.pbkdf2Sync(password, salt, iterations, hashSize, hashAlgorithm);
    // konkatenálás és hexa stringgé alakítás
    const hashWithSalt = Buffer.concat([hash, salt]).toString('hex');
    // a konkatenált hash-t és sót tárolnánk adatbázisban
    console.log(hashWithSalt);
    const model = {
      user: username,
      password: hashWithSalt,
      priv: privilege,
    };
    db.registerUser(model, (err) => {
      if (err) {
        res.status(400).render('register', { error: 'NEM SIKERES A BESZURAS A FELHASZNALOK TABLABA' });
      } else { res.redirect('/'); }
    });
  }
});


// login
// egy megadott hashnek
router.post('/check_hash', [check('username').not().isEmpty()], [check('password').not().isEmpty()], (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).render('login', { error: 'User credentials empty!' });
  } else {
    const { password, username } = req.body;

    db.checkUser(username, (err, selectResult) => {
      if (Object.keys(selectResult).length >= 1) {
        console.log(selectResult);
        const hashWithSalt = selectResult[0].passwd;
        console.log(hashWithSalt);
        // hexa string dekódolás és dekonkatenálás
        const expectedHash = hashWithSalt.substring(0, hashSize * 2),
          salt = Buffer.from(hashWithSalt.substring(hashSize * 2), 'hex');
        // újra-hash-elés
        const binaryHash = crypto.pbkdf2Sync(password, salt, iterations, hashSize, hashAlgorithm);
        // hexa stringgé alakítás
        const actualHash = binaryHash.toString('hex');

        if (expectedHash === actualHash) {
          console.log('Passwords match');

          // session beallitasok - login
          req.session.username = username;
          req.session.role = selectResult[0].privilege;

          res.redirect('/');
        } else {
          console.log('Passwords do not match');
          res.status(400).render('login', { error: 'Password doesn\'t match!' });
        }
      } else { res.status(400).render('login', { error: 'Username doesn\'t exist' }); }
    });
  }
});

// kilépés
router.get('/logout', auth.authorize(['user', 'admin']), (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).render('error', `Session reset error: ${err.message}`);
    } else {
      console.log('Logout successful');
      res.redirect('/');
    }
  });
});

// gyökérre érkezett GET kérésre rendereljük a korábbi hívásokat
router.get('/', auth.authorize(['user', 'admin']), (req, res) => {
  db.mindenTantargy(req, (err, selectResult) => {
    if (req.session.role === 'admin') {
      res.render('homepage', { tantargyak: selectResult, user: req.session.username, admin: 'yes' });
    } else {
      res.render('homepage', { tantargyak: selectResult, user: req.session.username });
    }
  });
});

module.exports = router;
