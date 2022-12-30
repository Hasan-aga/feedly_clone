const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db/db");

const app = express();
const port = 3000;

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

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
