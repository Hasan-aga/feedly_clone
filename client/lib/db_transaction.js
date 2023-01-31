export async function addFeed(feedInfo, userid, client) {
  const { correctUrl: url, title, category, favicon } = feedInfo;
  console.log(`adding feed ${JSON.stringify(feedInfo)} for user ${userid}`);
  try {
    const timestamp = new Date();
    // add feed to feed table
    const results = await client.query(
      "INSERT INTO rssfeeds (url, lastupdated, title, favicon) VALUES ($1, $2, $3, $4) RETURNING * ",
      [url, timestamp, title, favicon]
    );

    const feedid = results.rows[0].rowid;

    return feedid;
  } catch (error) {
    throw new Error(`failed to process query, ${error}`);
  }
}

export async function addCategory(userid, feedid, category, client) {
  try {
    // record feed category for current user
    await client.query(
      `INSERT INTO user_feeds_categories(userid, feedid, category) VALUES($1, $2, $3) `,
      [userid, feedid, category]
    );
  } catch (error) {}
}

export async function linkUserToFeed(userID, feedID, client) {
  // todo: handle linking existing link
  console.log(`linking user ${userID} to feed ${feedID}`);
  try {
    const result = await client.query(
      "INSERT INTO user_to_rss_feed (userid, rssid) VALUES ($1, $2) RETURNING *",
      [userID, feedID]
    );
    return result;
  } catch (error) {
    throw new Error(`failed to process query, ${error}`);
  }
}

export async function updateFeedArticles(feedID, articles, client) {
  // const client = await pool.connect();

  try {
    // todo: transaction is failing we must use same client:
    // start transaction
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
        console.log(`linked article ${articleid} to feed ${feedID}`);
      }
    }
  } catch (error) {
    console.log("error");
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
    console.log("saved article ", article.title.slice(0, 5));

    return articleid.rows[0]?.articleid;
  } catch (error) {
    if (error.code === "23505") {
      console.log("Duplicate url found, skipping article");
      return;
    }
    throw error;
  }
}
