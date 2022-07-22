const express = require("express");
const passport = require("../middleware/passport");
const { forwardAuthenticated } = require("../middleware/checkAuth");

const router = express.Router();

router.get("/login", forwardAuthenticated, (req, res) => res.render("login"));

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
  })
);

router.get("/logout", (req, res) => {
  req.logout((err)=>{
    if(err){
      console.log("Logout unsuccessful");
      return next(err); 
    }
  });
  res.redirect("/auth/login");
});


router.get("/github", passport.authenticate("github"));

router.get("/github/callback",
  passport.authenticate("github"),
  (req, res)=>{res.redirect("/reminders");});

module.exports = router;
