const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const path = require("path");
const port = process.env.port || 8000;
const gitHubsecret = require("./middleware/secretGitHub");

const app = express();

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

const passport = require("./middleware/passport");
const authRoute = require("./routes/authRoute");
const indexRoute = require("./routes/indexRoute");

const reminderRoute = require("./routes/reminderRoute");
const reminderController = require("./controllers/reminder_controller.js");
const router = require("./routes/authRoute");

// Middleware for express
app.use(express.json());
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log(`User details are: `);
  console.log(req.user);

  console.log("Entire session object:");
  console.log(req.session);

  console.log(`Session details are: `);
  console.log(req.session.passport);

  console.log(`The cookies are: `);

  // const getKeys = (callback)=>{
  //   const keys = [];
  //   req.sessionStore.all((err, s)=>{
  //     Object.keys(s).forEach((key, index) => {
  //         console.log('something'+key);
  //         console.log(key);
  //         console.log(index);
  //         keys.push(key);

  //         //if(index-1 >= s.length){
  //         //};
  //         callback(null, keys);
  //       });    
  //   });
  // };

  // getKeys((err, keys)=>{
  //   console.log(keys);
  // });
  next();
});

app.use("/", indexRoute);
app.use("/auth", authRoute);


// REMINDERS
// Show reminders
{
  const { ensureAuthenticated, isAdmin } = require("./middleware/checkAuth");
  app.get("/reminders", ensureAuthenticated, reminderController.list);
  app.get("/admin", isAdmin, (req, res)=>
  {
    const keys = [];
    let colLength = 0;
    let id = 1; //first one is undefined, so skip it
    req.sessionStore.length((err, length)=>{
      if(err){
        return null;
      }
      colLength = length;

      req.sessionStore.all((err, s)=>{
           ++id;
           if(err){
              // Abrupt end
              if(id>=colLength){
                res.render("admin", {
                  user: req.user,
                  sessionCookie: keys
                });
              }
             return null;
           }
           if(s){
            Object.keys(s).forEach((v, index)=>{
              keys.push(v);
            });
           }
           // End of collection
           if(id>=colLength){
              res.render("admin", {
                user: req.user,
                sessionCookie: keys
              });
           }
      });

    });
  });

  app.get("/destroy", isAdmin, (req, res)=>{
    req.session.destroy();
    res.redirect("/");
  })
}


// Route /reminder
app.use("/reminder", reminderRoute);


app.listen(port, () => {
  console.log(`🚀 Server has started on port ${port}`);
});
