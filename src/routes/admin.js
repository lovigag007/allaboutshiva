const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { requireAdmin, redirectIfLoggedIn } = require('../middleware/auth');
const { Admin, Page } = require('../models/Admin');
const Name = require('../models/Name');
const Mantra = require('../models/Mantra');
const Veda = require('../models/Veda');
const Stotra = require('../models/Stotra');
const Event = require('../models/Event');
const Ornament = require('../models/Ornament');

// ── Auth ─────────────────────────────────────────────────────────────────────
router.get('/login', redirectIfLoggedIn, (req, res) => {
  res.render('admin/login', { title: 'Admin Login', layout: 'admin/layout-plain' });
});

router.post('/login', redirectIfLoggedIn, async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findByEmail(email);
  if (!admin || !(await Admin.verifyPassword(password, admin.password))) {
    req.flash('error', 'Invalid email or password.');
    return res.redirect('/admin/login');
  }
  req.session.adminId = admin.id;
  req.session.adminName = admin.name;
  req.flash('success', `Welcome back, ${admin.name}!`);
  res.redirect('/admin');
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
});

// ── Dashboard ────────────────────────────────────────────────────────────────
router.get('/', requireAdmin, async (req, res) => {
  const [names, mantras, stotras, events, ornaments] = await Promise.all([
    Name.getAll({ limit: 1 }),
    Mantra.getAll({ limit: 1 }),
    Stotra.getAll({ limit: 1 }),
    Event.getAll({ limit: 1 }),
    Ornament.getAll({ limit: 1 })
  ]);
  res.render('admin/dashboard', {
    title: 'Admin Dashboard',
    counts: {
      names: names.total,
      mantras: mantras.total,
      stotras: stotras.total,
      events: events.total,
      ornaments: ornaments.total
    }
  });
});

// ── CRUD helper factory ──────────────────────────────────────────────────────
function crudRoutes(router, path, Model, views, fields) {
  // List
  router.get(`/${path}`, requireAdmin, async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search || '';
    const data = await Model.getAll({ page, limit: 15, search });
    res.render(`admin/${views.list}`, { title: views.title, ...data, search, path });
  });
  // New form
  router.get(`/${path}/new`, requireAdmin, (req, res) => {
    res.render(`admin/${views.form}`, { title: `New ${views.single}`, item: {}, path, isNew: true });
  });
  // Create
  router.post(`/${path}`, requireAdmin, async (req, res) => {
    try {
      const data = {};
      fields.forEach(f => { if (req.body[f] !== undefined) data[f] = req.body[f]; });
      if (data.is_featured !== undefined) data.is_featured = data.is_featured === 'on' ? 1 : 0;
      if (data.is_active !== undefined) data.is_active = data.is_active === 'on' ? 1 : 0;
      await Model.create(data);
      req.flash('success', `${views.single} created successfully.`);
      res.redirect(`/admin/${path}`);
    } catch (e) {
      req.flash('error', e.message);
      res.redirect(`/admin/${path}/new`);
    }
  });
  // Edit form
  router.get(`/${path}/:id/edit`, requireAdmin, async (req, res) => {
    const item = await Model.getById(req.params.id);
    if (!item) { req.flash('error', 'Not found.'); return res.redirect(`/admin/${path}`); }
    res.render(`admin/${views.form}`, { title: `Edit ${views.single}`, item, path, isNew: false });
  });
  // Update
  router.post(`/${path}/:id`, requireAdmin, async (req, res) => {
    try {
      const data = {};
      fields.forEach(f => { if (req.body[f] !== undefined) data[f] = req.body[f]; });
      if ('is_featured' in data) data.is_featured = data.is_featured === 'on' ? 1 : 0;
      if ('is_active' in data) data.is_active = data.is_active === 'on' ? 1 : 0;
      await Model.update(req.params.id, data);
      req.flash('success', `${views.single} updated.`);
      res.redirect(`/admin/${path}`);
    } catch (e) {
      req.flash('error', e.message);
      res.redirect(`/admin/${path}/${req.params.id}/edit`);
    }
  });
  // Delete
  router.post(`/${path}/:id/delete`, requireAdmin, async (req, res) => {
    await Model.delete(req.params.id);
    req.flash('success', `${views.single} deleted.`);
    res.redirect(`/admin/${path}`);
  });
}

// Apply CRUD to models
crudRoutes(router, 'names', Name, { list: 'names/list', form: 'names/form', title: 'Manage Names', single: 'Name' },
  ['name', 'language', 'meaning', 'story', 'is_featured', 'sort_order']);

crudRoutes(router, 'mantras', Mantra, { list: 'mantras/list', form: 'mantras/form', title: 'Manage Mantras', single: 'Mantra' },
  ['title', 'text_sanskrit', 'text_english', 'meaning', 'source', 'story', 'is_featured', 'sort_order']);

crudRoutes(router, 'stotras', Stotra, { list: 'stotras/list', form: 'stotras/form', title: 'Manage Stotras', single: 'Stotra' },
  ['title', 'text', 'meaning', 'written_by', 'story', 'is_featured', 'sort_order']);

crudRoutes(router, 'events', Event, { list: 'events/list', form: 'events/form', title: 'Manage Events', single: 'Event' },
  ['event_name', 'event_date', 'day_name', 'mahurat_time', 'description', 'is_active', 'sort_order']);

crudRoutes(router, 'ornaments', Ornament, { list: 'ornaments/list', form: 'ornaments/form', title: 'Manage Ornaments', single: 'Ornament' },
  ['name', 'body_part', 'meaning', 'story', 'sort_order']);

crudRoutes(router, 'pages', Page, { list: 'pages/list', form: 'pages/form', title: 'Manage Pages', single: 'Page' },
  ['slug', 'title', 'content', 'is_active']);

// ── Vedas (special: 4 static vedas, edit only) ───────────────────────────────
router.get('/vedas', requireAdmin, async (req, res) => {
  const vedas = await Veda.getAll();
  res.render('admin/vedas/list', { title: 'Manage Vedas', vedas });
});
router.get('/vedas/:id/edit', requireAdmin, async (req, res) => {
  const veda = await Veda.getById(req.params.id);
  if (!veda) { req.flash('error', 'Veda not found.'); return res.redirect('/admin/vedas'); }
  res.render('admin/vedas/form', { title: `Edit ${veda.name}`, veda });
});
router.post('/vedas/:id', requireAdmin, async (req, res) => {
  const { meaning, timeline, description } = req.body;
  // Parse dynamic incident/story arrays
  const incidents = [];
  if (req.body.inc_title) {
    const titles = [].concat(req.body.inc_title);
    const contents = [].concat(req.body.inc_content || []);
    const types = [].concat(req.body.inc_type || []);
    titles.forEach((t, i) => {
      if (t) incidents.push({ title: t, content: contents[i] || '', type: types[i] || 'incident' });
    });
  }
  await Veda.update(req.params.id, { meaning, timeline, description }, incidents);
  req.flash('success', 'Veda updated.');
  res.redirect('/admin/vedas');
});

module.exports = router;
