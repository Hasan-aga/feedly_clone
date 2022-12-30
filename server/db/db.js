require("dotenv").config();
const Pool = require("pg").Pool;

const pool = new Pool();

function getAllFeeds(request, response) {
  pool.query("SELECT * FROM rssfeed ORDER BY rowid ASC", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
}

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  },
  getAllFeeds,
};
