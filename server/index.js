require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db/db");
const helmet = require("helmet");
const session = require("express-session");
const passport = require("passport");
const { localStrategy } = require("./db/localStrategy");
const { ensureLoggedIn } = require("connect-ensure-login");

const app = express();
const port = 3000;

app.use(helmet());
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(localStrategy);
// used to serialize the user for the session
passport.serializeUser((user, done) => {
  console.log("serial user", user);
  done(null, user.rowid);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.getUserByRowId(id);
    console.log("deserial user", user);

    done(null, user);
  } catch (error) {
    done(new Error(`User was not found!`));
  }
});
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// todo: implement associating user to feed
// 1. login

app.get("/", (request, response) => {
  response.json({ info: "Node.js, Express, and Postgres API" });
});
app.get("/allFeeds", db.getAllFeeds);
// todo: remove this endpoint from production
app.get("/allUsers", ensureLoggedIn("/hello"), db.getAllUsers);
app.post("/addUser", db.addUser);
app.post("/addFeed", db.addFeed);
app.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/hi" }),
  function (req, res) {
    console.log("user:", req.user);
    res.status(200).json({ success: true, message: "logged in" });
  }
);
app.get("/profile", ensureLoggedIn(), (request, response) => {
  response.status(200).json({ user: request.user.email });
});
app.delete("/deleteFeed", db.deleteFeed);
app.delete("/deleteUser", db.deleteUser);
app.delete(
  "/deleteUsersWithDuplicateEmails",
  db.deleteUsersWithDuplicateEmails
);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
