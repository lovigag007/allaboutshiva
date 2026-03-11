const express = require('express');
const { engine } = require('express-handlebars');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const path = require('path');

const app = express();

// Handlebars setup
app.engine('hbs', engine({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials'),
  helpers: {
    eq: (a, b) => a === b,
    or: (a, b) => a || b,
    truncate: (str, len) => str && str.length > len ? str.substring(0, len) + '...' : str,
    formatDate: (date) => {
      if (!date) return '';
      return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    },
    json: (obj) => JSON.stringify(obj),
    increment: (n) => n + 1,
    isCurrent: (page, current) => page === current ? 'active' : ''
  }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(session({
  secret: 'om-namah-shivaya-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));
app.use(flash());

// Global variables middleware
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.isAdmin = req.session.isAdmin || false;
  next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/names', require('./routes/names'));
app.use('/mantras', require('./routes/mantras'));
app.use('/vedas', require('./routes/vedas'));
app.use('/stotras', require('./routes/stotras'));
app.use('/ornaments', require('./routes/ornaments'));
app.use('/admin', require('./routes/admin'));
app.use('/auth', require('./routes/auth'));
app.use('/pages', require('./routes/pages'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🕉️  All About Shiva is running on http://localhost:${PORT}`);
  console.log(`   Admin login: http://localhost:${PORT}/auth/login`);
  console.log(`   Default admin: admin / om-namah-shivaya\n`);
});

module.exports = app;
