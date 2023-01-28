import { Client } from "pg";
import { addFeed, linkUserToFeed, updateFeedArticles } from "./db_transaction";
import { getFeedUrlAndFavicon, getFreshArticles, needsUpdate } from "./utils";

const {
  getUserByEmail,
  getFeedByTitle,
  addUser,
  getFeedsOfUser,
} = require("./db");

export class Controller {
  constructor(session, userid) {
    this.email = session.user.email;
    this.userid = userid;
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
    const client = new Client();
    client.connect();
    try {
      await client.query("BEGIN");
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
        feedID = await addFeed(feedInfo, this.userid, client);

        const articles = await getFreshArticles(correctUrl);
        await updateFeedArticles(feedID, articles, client);
      } else {
        feedID = feedExists.rowid;
      }
      console.log(`feed id:${feedID}`);
      await linkUserToFeed(this.userid, feedID, client);
      client.query("COMMIT");
      return { user: this.userid, email: this.email, feedID };
    } catch (error) {
      console.log("got error,", error);
      console.log("rolling back...");
      client.query("ROLLBACK");
      throw error;
    } finally {
      client
        .end()
        .then(() => console.log("client has disconnected"))
        .catch((err) => console.error("error during disconnection", err.stack));
    }
  }

  async getMyFeeds() {
    const client = new Client();
    client.connect();
    try {
      const results = await getFeedsOfUser(this.userid);
      for (const feed of results) {
        // check if feed needs updating articles

        console.log("feed needs update? ", needsUpdate(feed.lastupdated));
        if (needsUpdate(feed.lastupdated)) {
          // update the articles of feed
          const articles = await getFreshArticles(feed.url);
          client.query("BEGIN");
          await updateFeedArticles(feed.rowid, articles, client);
          client.query("COMMIT");
        }
      }
      return results;
    } catch (error) {
      console.log("got error,", error);
      console.log("rolling back");
      client.query("ROLLBACK");
    } finally {
      client
        .end()
        .then(() => console.log("client has disconnected"))
        .catch((err) => console.error("error during disconnection", err.stack));
    }
  }
}
