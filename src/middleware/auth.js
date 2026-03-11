function requireAdmin(req, res, next) {
  if (req.session && req.session.adminId) {
    return next();
  }
  req.flash('error', 'Please log in to access the admin panel.');
  return res.redirect('/admin/login');
}

function redirectIfLoggedIn(req, res, next) {
  if (req.session && req.session.adminId) {
    return res.redirect('/admin');
  }
  next();
}

module.exports = { requireAdmin, redirectIfLoggedIn };
