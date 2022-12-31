require("dotenv").config();
const Pool = require("pg").Pool;

const pool = new Pool();

function getAllFeeds(request, response) {
  pool.query("SELECT * FROM rssfeeds ORDER BY rowid ASC", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
}

async function addUser(request, response) {
  try {
    const { email, password } = request.query;
    console.log(request.query);

    const result = await pool.query(
      "INSERT INTO users (email,password) VALUES ($1, $2) RETURNING *",
      [email, password]
    );
    response.status(201).send(`User added with ID: ${result.rows[0].rowid}`);
  } catch (error) {
    // create a friendly error message
    const message = "An error occurred while processing your request";

    // log the error for debugging purposes
    console.error(error);

    // send the friendly error message to the user
    response.status(500).json({ success: false, message });
  }
}

async function addFeed(request, response) {
  try {
    const { title, url } = request.query;

    const results = await pool.query(
      "INSERT INTO rssfeeds (title,url) VALUES ($1, $2) RETURNING *",
      [title, url]
    );

    response
      .status(201)
      .send(`Feed added with title: ${results.rows[0].title}`);
  } catch (error) {
    // check the error message for a specific string
    if (
      error.message.includes("duplicate key value violates unique constraint")
    ) {
      // create a friendly error message
      const message = "A feed with the same URL already exists";

      // log the error for debugging purposes
      console.error(error);

      // send the friendly error message to the user
      response.status(200).json({ success: true, message });
    } else {
      // create a friendly error message
      const message = "An error occurred while processing your request";

      // log the error for debugging purposes
      console.error(error);

      // send the friendly error message to the user
      response.status(500).json({ success: false, message });
    }
  }
}

async function deleteUsersWithDuplicateEmails(request, response) {
  try {
    const result = await pool.query(
      `
      SELECT (SELECT COUNT(*) FROM users) - COUNT(*) AS num_deleted FROM users WHERE rowid IN (
        SELECT rowid FROM (
          SELECT rowid, ROW_NUMBER() OVER (PARTITION BY email ORDER BY rowid) AS rn
          FROM users
        ) t WHERE t.rn > 1
      );
      `
    );
    response.status(200).json(result.rows);
  } catch (error) {
    // create a friendly error message
    const message = "An error occurred while processing your request";

    // log the error for debugging purposes
    console.error(error);

    // send the friendly error message to the user
    response.status(500).json({ success: false, message });
  }
}

// TODO: create table if not exist

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  },
  getAllFeeds,
  addUser,
  addFeed,
  deleteUsersWithDuplicateEmails,
};
