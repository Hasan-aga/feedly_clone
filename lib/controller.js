import { Client } from "pg";
import {
  addCategory,
  addFeed,
  deleteFeedForUser,
  deleteFeedForUserCategory,
  linkUserToFeed,
  updateFeedArticles,
} from "./db_transaction";
import {
  getArticleBodyAndImage,
  getArticleImageLink,
  getFeedUrlAndFavicon,
  getFreshArticles,
  groupByCategory,
  hasHttpPart,
  needsUpdate,
  processFeedInfo,
} from "./utils";

const {
  getUserByEmail,
  getFeedByTitle,
  addUser,
  getFeedsOfUser,
  bookmarkArticleForUser,
  deleteBookmarkForUser,
  getArticlesOfFeed,
  markArticleAsReadForUser,
  markArticleAsUnreadForUser,
  updateImageLink,
  getUserBookmarks,
  getTotalNumberOfArticlesForFeed,
  getArticleById,
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
    if (!hasHttpPart(url)) {
      url = "http://" + url;
    }
    await this.client.connect();
    try {
      await this.client.query("BEGIN");
      const urlDetails = new URL(url);
      const title = urlDetails.hostname;
      const { correctedCategroy, correctedTitle } = processFeedInfo({
        category,
        title,
      });
      const feedExists = await getFeedByTitle(title);
      console.log(`${urlDetails.hostname} exists?`, feedExists);
      let feedID;
      if (!feedExists) {
        const { url: correctUrl, favicon } = await getFeedUrlAndFavicon(url);
        console.log("Adding", correctUrl);
        const regex = /\bwww\./g;
        const feedInfo = {
          correctUrl,
          favicon,
          category: correctedCategroy,
          title: correctedTitle,
        };
        feedID = await addFeed(feedInfo, this.userid, this.client);

        const articles = await getFreshArticles(correctUrl);
        await updateFeedArticles(feedID, articles, this.client);
      } else {
        feedID = feedExists.rowid;
      }
      await addCategory(this.userid, feedID, correctedCategroy, this.client);
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
        if (needsUpdate(feed.lastupdated)) {
          // update the articles of feed
          const articles = await getFreshArticles(feed.url);
          await this.client.query("BEGIN");
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
    await this.client.connect();
    try {
      await this.client.query("BEGIN");
      await deleteFeedForUser(this.userid, feedid, this.client);
      await deleteFeedForUserCategory(this.userid, feedid, this.client);
      await this.client.query("COMMIT");
    } catch (error) {
      console.log("got error,", error);
      console.log("rolling back");
      this.client.query("ROLLBACK");
      throw error;
    } finally {
      this.client
        .end()
        .then(() => console.log("client has disconnected"))
        .catch((err) => console.error("error during disconnection", err.stack));
    }
  }

  async getMyArticles(feedid, offset) {
    console.log("offset", offset);
    try {
      const articles = await getArticlesOfFeed({
        feedid,
        userid: this.userid,
        offset,
      });

      return articles;
    } catch (error) {
      throw error;
    }
  }

  async getArticleImage(articleid) {
    try {
      console.log("getting image for articleid", articleid);
      const article = await getArticleById(articleid);
      const imageLink = await getArticleImageLink(article.link);
      article.image_link = imageLink;
      console.log("setting article img", article.image_link);
      updateImageLink(article.articleid, article.image_link);
      return imageLink;
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

  async getMyBookmarks() {
    try {
      const bookmarks = await getUserBookmarks(this.userid);
      // return date as string since getserverprops wont serialize date objects!
      bookmarks.forEach((element) => {
        element.publication_date = element.publication_date.toString();
      });
      return bookmarks;
    } catch (error) {
      throw error;
    }
  }

  async markAsRead(articleid) {
    try {
      await markArticleAsReadForUser(this.userid, articleid);
    } catch (error) {
      throw error;
    }
  }

  async markAsUnread(articleid) {
    try {
      await markArticleAsUnreadForUser(this.userid, articleid);
    } catch (error) {
      throw error;
    }
  }
}
