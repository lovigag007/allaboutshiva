const express = require('express');
const router = express.Router();
const Name = require('../models/Name');
const Mantra = require('../models/Mantra');
const Veda = require('../models/Veda');
const Stotra = require('../models/Stotra');
const Event = require('../models/Event');
const Ornament = require('../models/Ornament');
const { Page } = require('../models/Admin');

// Home
router.get('/', async (req, res) => {
  try {
    const [featuredNames, upcomingEvents] = await Promise.all([
      Name.getFeatured(8),
      Event.getUpcoming(5)
    ]);
    res.render('public/home', { title: 'All About Shiva', featuredNames, upcomingEvents });
  } catch (err) {
    console.error(err);
    res.render('public/error', { title: 'Error', message: 'Could not load page.' });
  }
});

// Names
router.get('/names', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const search = req.query.search || '';
  const data = await Name.getAll({ page, limit: 24, search });
  res.render('public/names', { title: 'Names of Shiva', ...data, search });
});
router.get('/names/:id', async (req, res) => {
  const name = await Name.getById(req.params.id);
  if (!name) return res.redirect('/names');
  res.render('public/name-detail', { title: name.name + ' — Name of Shiva', name });
});

// Mantras
router.get('/mantras', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const search = req.query.search || '';
  const data = await Mantra.getAll({ page, limit: 10, search });
  res.render('public/mantras', { title: 'Mantras of Shiva', ...data, search });
});
router.get('/mantras/:id', async (req, res) => {
  const mantra = await Mantra.getById(req.params.id);
  if (!mantra) return res.redirect('/mantras');
  res.render('public/mantra-detail', { title: mantra.title, mantra });
});

// Vedas
router.get('/vedas', async (req, res) => {
  const vedas = await Veda.getAll();
  res.render('public/vedas', { title: 'The Four Vedas', vedas });
});
router.get('/vedas/:name', async (req, res) => {
  const veda = await Veda.getBySlug(req.params.name);
  if (!veda) return res.redirect('/vedas');
  res.render('public/veda-detail', { title: veda.name, veda });
});

// Stotras
router.get('/stotras', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const search = req.query.search || '';
  const data = await Stotra.getAll({ page, limit: 10, search });
  res.render('public/stotras', { title: 'Stotras of Shiva', ...data, search });
});
router.get('/stotras/:id', async (req, res) => {
  const stotra = await Stotra.getById(req.params.id);
  if (!stotra) return res.redirect('/stotras');
  res.render('public/stotra-detail', { title: stotra.title, stotra });
});

// Ornaments
router.get('/ornaments', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const search = req.query.search || '';
  const data = await Ornament.getAll({ page, limit: 12, search });
  res.render('public/ornaments', { title: 'Ornaments of Shiva', ...data, search });
});
router.get('/ornaments/:id', async (req, res) => {
  const ornament = await Ornament.getById(req.params.id);
  if (!ornament) return res.redirect('/ornaments');
  res.render('public/ornament-detail', { title: ornament.name, ornament });
});

// Static pages
router.get('/page/:slug', async (req, res) => {
  const page = await Page.getBySlug(req.params.slug);
  if (!page) return res.status(404).render('public/error', { title: '404', message: 'Page not found.' });
  res.render('public/static-page', { title: page.title, page });
});

module.exports = router;
