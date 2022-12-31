const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db/db");
const helmet = require("helmet");

const app = express();
const port = 3000;

app.use(helmet());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", (request, response) => {
  response.json({ info: "Node.js, Express, and Postgres API" });
});
app.get("/allFeeds", db.getAllFeeds);
app.get("/allUsers", db.getAllUsers);
app.post("/addUser", db.addUser);
app.post("/addFeed", db.addFeed);
app.delete("/deleteFeed", db.deleteFeed);
app.delete("/deleteUser", db.deleteUser);
app.delete(
  "/deleteUsersWithDuplicateEmails",
  db.deleteUsersWithDuplicateEmails
);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
