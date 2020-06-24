// middleware az engedélyezéshez
function authorize(roles = ['user', 'admin']) {
  return (req, res, next) => {
    if (!req.session.role) {
      // a felhasználó nincs bejelentkezve
      res.status(401).render('login', { status: 401, message: 'You are not logged in, please log in' });
    } else if (!roles.includes(req.session.role)) {
      // a felhasználó be van jelentkezve de nincs joga ehhez az operációhoz
      res.status(401).render('error', {  status: 403, message: 'You do not have permission to access this endpoint' });
    } else {
      // minden rendben
      next();
    }
  };
}

exports.authorize = authorize;
