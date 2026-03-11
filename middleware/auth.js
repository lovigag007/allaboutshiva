module.exports = {
  ensureAdmin: (req, res, next) => {
    if (req.session.isAdmin) return next();
    req.flash('error', 'Please login as admin to access this page');
    res.redirect('/auth/login');
  }
};
