import { Client } from "pg";
import { addFeed, linkUserToFeed } from "./db_transaction";
import { getFeedUrlAndFavicon, getFreshArticles } from "./utils";

const {
  getUserByEmail,
  getFeedByTitle,
  updateFeedArticles,
  addUser,
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
    try {
      client.connect();
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
}
