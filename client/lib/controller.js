import { Client } from "pg";
import {
  addCategory,
  addFeed,
  linkUserToFeed,
  updateFeedArticles,
} from "./db_transaction";
import {
  getFeedUrlAndFavicon,
  getFreshArticles,
  groupByCategory,
  needsUpdate,
} from "./utils";

const {
  getUserByEmail,
  getFeedByTitle,
  addUser,
  getFeedsOfUser,
  deleteFeedForUser,
  bookmarkArticleForUser,
  deleteBookmarkForUser,
} = require("./db");

export class Controller {
  constructor(session, userid) {
    this.email = session.user.email;
    this.userid = userid;
    this.client = new Client();
  }

  static async start(session) {
    let user = await getUserByEmail(session.user.email);
    if (!user) {
      user = await addUser(session.user.email);
      console.log(`added user `, user);
    }
    const userid = user.rowid;
    return new Controller(session, userid);
  }

  getUserId() {
    return this.userid;
  }

  getUserEmail() {
    return this.email;
  }

  async addNewFeed(url, category) {
    console.log("adding", url);
    await this.client.connect();
    try {
      await this.client.query("BEGIN");
      const urlDetails = new URL(url);
      const title = urlDetails.hostname;
      const feedExists = await getFeedByTitle(title);
      console.log(`${urlDetails.hostname} exists?`, feedExists);
      let feedID;
      if (!feedExists) {
        const { url: correctUrl, favicon } = await getFeedUrlAndFavicon(url);
        console.log("Adding", correctUrl);
        const feedInfo = {
          correctUrl,
          favicon,
          category,
          title,
        };
        feedID = await addFeed(feedInfo, this.userid, this.client);

        const articles = await getFreshArticles(correctUrl);
        await updateFeedArticles(feedID, articles, this.client);
      } else {
        feedID = feedExists.rowid;
      }
      await addCategory(this.userid, feedID, category, this.client);
      console.log(`feed id:${feedID}`);
      await linkUserToFeed(this.userid, feedID, this.client);
      await this.client.query("COMMIT");
      return { user: this.userid, email: this.email, feedID };
    } catch (error) {
      console.log("got error,", error);
      console.log("rolling back...");
      this.client.query("ROLLBACK");
      throw error;
    } finally {
      this.client
        .end()
        .then(() => console.log("client has disconnected"))
        .catch((err) => console.error("error during disconnection", err.stack));
    }
  }

  async getMyFeeds() {
    await this.client.connect();
    try {
      const results = await getFeedsOfUser(this.userid);
      console.log(`user ${this.userid} feed:`, results);
      for (const feed of results) {
        // check if feed needs updating articles

        console.log("feed needs update? ", needsUpdate(feed.lastupdated));
        if (needsUpdate(feed.lastupdated)) {
          // update the articles of feed
          const articles = await getFreshArticles(feed.url);
          this.client.query("BEGIN");
          await updateFeedArticles(feed.rowid, articles, this.client);
          await this.client.query("COMMIT");
        }
      }

      return groupByCategory(results);
    } catch (error) {
      console.log("got error,", error);
      console.log("rolling back");
      this.client.query("ROLLBACK");
    } finally {
      this.client
        .end()
        .then(() => console.log("client has disconnected"))
        .catch((err) => console.error("error during disconnection", err.stack));
    }
  }

  async deleteFeed(feedid) {
    try {
      await deleteFeedForUser(this.userid, feedid);
    } catch (error) {
      throw error;
    }
  }

  async bookmarkArticle(articleid) {
    try {
      await bookmarkArticleForUser(this.userid, articleid);
    } catch (error) {
      throw error;
    }
  }

  async deleteBookmark(articleid) {
    try {
      await deleteBookmarkForUser(this.userid, articleid);
    } catch (error) {
      throw error;
    }
  }
}
