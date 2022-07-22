module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/auth/login");
  },
  forwardAuthenticated: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect("/dashboard");
  },
  isAdmin: (req, res, next)=>{
    console.log(`Admin log access`);
    console.log(req.user);
    if (req.isAuthenticated() && req.user.isAdmin) {
      return next();
    }
    res.redirect("/auth/login");
  }
};
