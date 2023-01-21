const { Pool } = require("pg");

// leaving the args to Pool empty loads the defaults from env
const pool = new Pool();
export async function getAllFeeds() {
  try {
    const result = await pool.query(
      "SELECT * FROM rssfeeds ORDER BY rowid ASC"
    );
    return result;
  } catch (error) {
    throw new Error(`failed to run query, ${error}`);
  }
}

export async function addFeed(url) {
  try {
    const results = await pool.query(
      "INSERT INTO rssfeeds (url) VALUES ($1) RETURNING * ",
      [url]
    );

    return results;
  } catch (error) {
    throw new Error(`failed to process query, ${error}`);
  }
}

export async function getFeedByUrl(url) {
  try {
    const result = await pool.query("SELECT * FROM rssfeeds WHERE url = $1 ", [
      url,
    ]);
    return result.rows[0];
  } catch (error) {
    throw new Error(`failed to process query, ${error}`);
  }
}

export async function addUser(email) {
  try {
    const result = await pool.query(
      "INSERT INTO users (email) VALUES ($1) RETURNING *",
      [email]
    );
    return result;
  } catch (error) {
    throw new Error(`failed to process query, ${error}`);
  }
}

export async function getUserByEmail(email) {
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1 ", [
      email,
    ]);
    return result.rows[0];
  } catch (error) {
    throw new Error(`failed to process query, ${error}`);
  }
}

export async function linkUserToFeed(userID, feedID) {
  try {
    const result = await pool.query(
      "INSERT INTO user_to_rss_feed (userid, rssid) VALUES ($1, $2) RETURNING *",
      [userID, feedID]
    );
    return result;
  } catch (error) {
    throw new Error(`failed to process query, ${error}`);
  }
}

export async function getFeedsOfUser(user) {
  const { email } = user;
  const { rowid: userID } = await getUserByEmail(email);

  const feedLinks = await pool.query(
    "SELECT url FROM rssfeeds WHERE rowid IN (SELECT rssid FROM user_to_rss_feed WHERE userid = $1) ",
    [userID]
  );

  return feedLinks;
}

// todo: associate user w/ feeds
// when adding feed, add relation to user-feed table
