require('dotenv').config();
const express = require('express');
const nunjucks = require('nunjucks');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const morgan = require('morgan');
const path = require('path');

const app = express();

// ── View engine: Nunjucks ────────────────────────────────────────────────────
const env = nunjucks.configure(path.join(__dirname, 'views'), {
  autoescape: true,
  express: app,
  watch: process.env.NODE_ENV !== 'production'
});

// Custom filters
env.addFilter('truncate', (str, len) => str && str.length > len ? str.slice(0, len) + '…' : str);
env.addFilter('nl2br', (str) => str ? str.replace(/\n/g, '<br>') : '');
env.addFilter('dateformat', (d) => {
  if (!d) return '';
  const date = new Date(d);
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
});
env.addFilter('striphtml', (str) => str ? str.replace(/<[^>]*>/g, '') : '');

app.set('view engine', 'njk');

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, '../public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'shiva-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 8 * 60 * 60 * 1000 } // 8 hours
}));
app.use(flash());

// Locals for templates
app.use((req, res, next) => {
  res.locals.flash_success = req.flash('success');
  res.locals.flash_error = req.flash('error');
  res.locals.adminLoggedIn = !!(req.session && req.session.adminId);
  res.locals.adminName = req.session ? req.session.adminName : '';
  res.locals.currentPath = req.path;
  next();
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/', require('./routes/public'));
app.use('/admin', require('./routes/admin'));

// 404
app.use((req, res) => {
  res.status(404).render('public/error', { title: '404 — Not Found', message: 'The page you are looking for does not exist.' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('public/error', { title: 'Server Error', message: 'An unexpected error occurred.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🕉️  All About Shiva is running on http://localhost:${PORT}`);
  console.log(`   Admin panel: http://localhost:${PORT}/admin\n`);
});
