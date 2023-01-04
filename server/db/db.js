const { isValidEmail, isMatchingPasswords } = require("./utils");
const bcrypt = require("bcrypt");

const Pool = require("pg").Pool;

const pool = new Pool();

async function getAllFeeds(request, response) {
  try {
    const result = await pool.query(
      "SELECT * FROM rssfeeds ORDER BY rowid ASC"
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

async function getAllUsers(request, response) {
  console.log("user: ", request.user);
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY rowid ASC");
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

async function addUser(request, response) {
  try {
    const { email, password } = request.query;

    if (!isValidEmail(email)) {
      throw new Error("Email not valid!");
    }

    // hash the password using the SHA-256 algorithm
    const hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (email,password) VALUES ($1, $2) RETURNING *",
      [email, hash]
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

async function deleteFeed(request, response) {
  try {
    const { id } = request.query;

    // delete the feed with the specified id
    const result = await pool.query(
      "DELETE FROM rssfeeds WHERE rowid = $1 RETURNING *",
      [id]
    );

    // if no rows were affected, the feed was not found
    if (result.rowCount === 0) {
      // create a friendly error message
      const message = "The specified feed was not found";

      // send the friendly error message to the user
      response.status(404).json({ success: false, message });
    } else {
      // send a success message to the user
      response.status(200).json({ success: true });
    }
  } catch (error) {
    // create a friendly error message
    const message = "An error occurred while processing your request";

    // log the error for debugging purposes
    console.error(error);

    // send the friendly error message to the user
    response.status(500).json({ success: false, message });
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

async function deleteUser(request, response) {
  try {
    const { id } = request.query;

    // delete the user with the specified id
    const result = await pool.query(
      "DELETE FROM users WHERE rowid = $1 RETURNING *",
      [id]
    );

    // if no rows were affected, the user was not found
    if (result.rowCount === 0) {
      // create a friendly error message
      const message = "The specified user was not found";

      // send the friendly error message to the user
      response.status(404).json({ success: false, message });
    } else {
      // send a success message to the user
      response.status(200).json({ success: true });
    }
  } catch (error) {
    // create a friendly error message
    const message = "An error occurred while processing your request";

    // log the error for debugging purposes
    console.error(error);

    // send the friendly error message to the user
    response.status(500).json({ success: false, message });
  }
}

// check if login info exists
// get one user from db by email

async function getUserByEmail(email) {
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1 ", [
      email,
    ]);
    const user = result.rows[0];
    if (!user) {
      throw new Error("no user found.");
    }
    return user;
  } catch (error) {
    const message = "Could not find a user with given email.";

    console.error(error);

    throw new Error(`${message}, ${error}`);
  }
}
async function getUserByRowId(id) {
  try {
    const result = await pool.query("SELECT * FROM users WHERE rowid = $1 ", [
      id,
    ]);
    const user = result.rows[0];
    if (!user) {
      throw new Error("no user found.");
    }
    return user;
  } catch (error) {
    const message = "Could not find a user with given email.";

    console.error(error);

    throw new Error(`${message}, ${error}`);
  }
}

async function loginWithEmailAndPassword(request, response) {
  try {
    const { email, password } = request.query;
    console.log("searching for user with email", email);
    const { password: existingPassword } = await getUserByEmail(email);
    if (!isMatchingPasswords(password, existingPassword)) {
      throw new Error();
    }
    response.status(200).json({ success: true, jwt: "todo" });
  } catch (error) {
    const message = "User or password do not match";
    console.log("error finding user");
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
  deleteFeed,
  deleteUser,
  getAllUsers,
  loginWithEmailAndPassword,
  getUserByEmail,
  getUserByRowId,
};
