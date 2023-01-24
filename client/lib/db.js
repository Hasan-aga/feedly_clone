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
    const timestamp = new Date();
    const results = await pool.query(
      "INSERT INTO rssfeeds (url, lastupdated) VALUES ($1, $2) RETURNING * ",
      [url, timestamp]
    );

    return results;
  } catch (error) {
    throw new Error(`failed to process query, ${error}`);
  }
}

export async function saveArticle(article) {
  const articleid = await pool.query(
    "INSERT INTO articles (title, link, description, publication_date, category) VALUES ($1, $2, $3, $4, $5) RETURNING articleid ",
    [
      article.title,
      article.link,
      article.description,
      article.pubDate,
      article.category,
    ]
  );

  return articleid.rows[0].articleid;
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
    const articleIDs = await pool.query(
      "SELECT articleid FROM feed_articles WHERE feedid = $1 LIMIT 5 OFFSET $2",
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
    throw error;
  }
}
export async function getUserArticles(userID, offset = 0) {
  try {
    // get the user feed ids
    const feedIDs = await getFeedsOfUser(userID);
    let results = {};
    console.log(`getting articles for ${userID}`, feedIDs);
    for (let feedID of feedIDs) {
      results[feedID.rssid] = {
        articles: await getArticlesOfFeed(feedID.rssid),
        offset,
      };
      // todo: give meaningful name to each feed
    }

    console.log("results ", results);
    return results;
    // for each feed id, get 5 articles
  } catch (error) {
    throw new Error(`failed to process query, ${error}`);
  }
}

export async function updateFeedArticles(feedID, articles) {
  try {
    await getFeedTimestamp(feedID);
    const timestamp = new Date();
    // update timestamp in rssfeeds table
    await pool.query("UPDATE rssfeeds SET lastupdated = $1 WHERE rowid = $2", [
      timestamp,
      feedID,
    ]);

    // update article in feed_articles table
    for (let article of articles) {
      const articleid = await saveArticle(article);
      pool.query(
        "INSERT INTO feed_articles(feedid, articleid) VALUES($1, $2)",
        [feedID, articleid]
      );
    }
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

export async function getFeedsOfUser(userID) {
  const feedLinks = await pool.query(
    "SELECT rssid FROM user_to_rss_feed WHERE userid = $1",
    [userID]
  );

  return feedLinks.rows;
}

// todo: associate user w/ feeds
// when adding feed, add relation to user-feed table
