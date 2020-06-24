const express = require('express'),
  path = require('path'),
  morgan = require('morgan'),
  ehandlebars = require('express-handlebars'),
  // requestRoutes = require('./routes/requests'),
  requestLogins = require('./routes/reqLogins'),
  requestTantargyak = require('./routes/reqTantargyak'),
  requestFeladatok = require('./routes/reqFeladatok'),
  rest = require('./restapi'),
  errorMiddleware = require('./middleware/error');

// inicializáljuk az express alkalmazást
const app = express();

// morgan middleware: loggolja a beérkezett hívásokat
app.use(morgan('tiny'));

// static mappa
const staticDir = path.join(__dirname, 'static');
app.use(express.static(staticDir));

// beallitjuk a hbs engine-t
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', ehandlebars({
  extname: 'hbs',
  defaultView: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials'),
}));


// standard kérésfeldolgozással kapjuk a body tartalmát
app.use(express.urlencoded({ extended: true }));

app.use('/api', rest);

// mount the index route at the / path
// app.use('/', requestRoutes);
app.use('/', requestLogins);
app.use('/', requestTantargyak);
app.use('/', requestFeladatok);


// utolsóként kössük be a hibaoldalkezelőt globálisan
app.use(errorMiddleware);

app.listen(8080, () => { console.log('Server listening on http://localhost:8080/ ...'); });
