import { needsUpdate } from "./utils";

const { Pool, Client } = require("pg");

// leaving the args to Pool empty loads the defaults from env
const pool = new Pool();
const client = new Client();
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

export async function addFeed(url, title) {
  try {
    const timestamp = new Date();
    const results = await pool.query(
      "INSERT INTO rssfeeds (url, lastupdated, title) VALUES ($1, $2, $3) RETURNING * ",
      [url, timestamp, title]
    );

    return results;
  } catch (error) {
    throw new Error(`failed to process query, ${error}`);
  }
}

export async function saveArticle(article, client) {
  try {
    // we can use  ON CONFLICT (link) DO NOTHING to prevent throwing error on unique conflict
    const articleid = await client.query(
      "INSERT INTO articles (title, link, description, publication_date, category) VALUES ($1, $2, $3, $4, $5) ON CONFLICT(link) DO NOTHING RETURNING articleid ",
      [
        article.title,
        article.link,
        article.description,
        article.pubDate,
        article.category,
      ]
    );
    console.log("saved article ", article.title);

    return articleid.rows[0]?.articleid;
  } catch (error) {
    if (error.code === "23505") {
      console.log("Duplicate url found, skipping article");
      return;
    }
    throw error;
  }
}

export async function getFeedTimestamp(feedID) {
  try {
    const result = pool.query(
      "SELECT lastupdated FROM rssfeeds WHERE rowid = $1",
      [feedID]
    );
    console.log("timestamp:", result.rows[0]);
  } catch (error) {
    console.log("error getting timestamp", error);
  }
}

export async function getArticlesOfFeed(feedID, offset = 0) {
  try {
    // todo: use join to enable ordering articles by publication_date
    const articleIDs = await pool.query(
      `SELECT articles.articleid
      FROM feed_articles
      INNER JOIN articles
      ON feed_articles.articleid = articles.articleid
      WHERE feedid = $1
      ORDER BY articles.publication_date desc
      LIMIT 5
      OFFSET $2`,
      [feedID, offset]
    );

    // get article from article id
    const articles = [];
    for (let { articleid } of articleIDs.rows) {
      const article = await pool.query(
        "SELECT * FROM articles WHERE articleid = $1",
        [articleid]
      );
      articles.push(...article.rows);
    }
    return articles;
  } catch (error) {
    throw new Error(`failed to process query, ${error}`);
  }
}

export async function getUrlFromFeedID(feedID) {
  try {
    const result = await pool.query(
      "SELECT url FROM rssfeeds WHERE rowid = $1",
      [feedID]
    );
    const feedUrl = result.rows[0].url;
    return feedUrl;
  } catch (error) {
    throw error;
  }
}

export async function updateFeedArticles(feedID, articles) {
  // const client = await pool.connect();
  await client.connect();
  try {
    // todo: transaction is failing we must use same client:
    // start transaction
    await client.query("BEGIN");
    console.log("begin saving articles...");
    const timestamp = new Date();
    // update timestamp in rssfeeds table
    await client.query(
      "UPDATE rssfeeds SET lastupdated = $1 WHERE rowid = $2 RETURNING *",
      [timestamp, feedID]
    );
    console.log("finished 1st query");

    // update article in feed_articles table
    for (let article of articles) {
      const articleid = await saveArticle(article, client);
      if (articleid) {
        client.query(
          "INSERT INTO feed_articles(feedid, articleid) VALUES($1, $2)",
          [feedID, articleid]
        );
        console.log("saved articleid: ", articleid);
      }
    }
    console.log("commit.");
    await client.query("COMMIT"); // end transaction
  } catch (error) {
    console.log("error");
    await client.query("ROLLBACK"); // if an error occurs, undo the transaction
    throw new Error(`failed to process query, ${error}`);
  } finally {
    await client.end();
  }
}

export async function getFeedByTitle(title) {
  try {
    const result = await pool.query(
      "SELECT * FROM rssfeeds WHERE title = $1 ",
      [title]
    );
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

export async function getFeedsOfUser(userID) {
  const feeds = await pool.query(
    "SELECT * FROM rssfeeds where rowid in (SELECT rssid FROM user_to_rss_feed WHERE userid = $1)",
    [userID]
  );

  return feeds.rows;
}

// todo: associate user w/ feeds
// when adding feed, add relation to user-feed table
