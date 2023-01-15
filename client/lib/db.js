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

export async function addFeed(title, url) {
  try {
    const results = await pool.query(
      "INSERT INTO rssfeeds (title,url) VALUES ($1, $2) RETURNING *",
      [title, url]
    );

    return results;
  } catch (error) {
    throw new Error(`failed to process query, ${error}`);
  }
}
