import { Pool } from "pg";
import {
  addCategory,
  addFeed,
  deleteFeedForUser,
  deleteFeedForUserCategory,
  linkUserToFeed,
  updateFeedArticles,
} from "./db_transaction";
import {
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
  moveUserFeedToCategory,
} = require("./db");

export class Controller {
  #_results;
  constructor(session, userid) {
    this.email = session.user.email;
    this.userid = userid;
    this.pool = new Pool();
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
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      const urlDetails = new URL(url);
      const title = urlDetails.hostname;
      const { correctedCategory, correctedTitle } = processFeedInfo({
        category,
        title,
      });

      const feedExists = await getFeedByTitle(correctedTitle);
      console.log(`${urlDetails.hostname} exists?`, feedExists);
      let feedID;
      if (!feedExists) {
        const { url: correctUrl, favicon } = await getFeedUrlAndFavicon(url);
        const feedInfo = {
          correctUrl,
          favicon,
          category: correctedCategory,
          title: correctedTitle,
        };
        feedID = await addFeed(feedInfo, this.userid, client);

        const articles = await getFreshArticles(correctUrl);
        await updateFeedArticles(feedID, articles, client);
      } else {
        feedID = feedExists.rowid;
      }
      await addCategory(this.userid, feedID, correctedCategory, client);
      await linkUserToFeed(this.userid, feedID, client);
      await client.query("COMMIT");
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
    try {
      const results = await getFeedsOfUser(this.userid);
      this.#_results = results;
      return groupByCategory(results);
    } catch (error) {
      console.log("got error,", error);
    } finally {
      this.checkAndUpdate(this.#_results);
    }
  }

  async checkAndUpdate(results) {
    let client;
    try {
      client = await this.pool.connect();
      console.debug(`we have ${results.length} feeds`);
      for (const feed of results) {
        try {
          // todo do not use loop to update the db
          // check if feed needs updating articles
          if (needsUpdate(feed.lastupdated)) {
            console.log("updating ", feed.title);
            // update the articles of feed
            const articles = await getFreshArticles(feed.url);
            await client.query("BEGIN");
            await updateFeedArticles(feed.rowid, articles, client);
            await client.query("COMMIT");
          }
          console.debug("finished updating feeds");
        } catch (error) {
          console.error("got error,", error);
          console.error("rolling back");
          client.query("ROLLBACK");
          throw error;
        }
      }
    } catch (error) {
      console.error("got error,", error);
    } finally {
      client
        .end()
        .then(() => console.log("client has disconnected"))
        .catch((err) => console.error("error during disconnection", err.stack));
    }
  }

  async deleteFeed(feedid) {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      await deleteFeedForUser(this.userid, feedid, client);
      await deleteFeedForUserCategory(this.userid, feedid, client);
      await client.query("COMMIT");
    } catch (error) {
      console.log("got error,", error);
      console.log("rolling back");
      client.query("ROLLBACK");
      throw error;
    } finally {
      client
        .end()
        .then(() => console.log("client has disconnected"))
        .catch((err) => console.error("error during disconnection", err.stack));
    }
  }

  async moveFeedToCategory(feedid, category) {
    try {
      console.log("moving", category);
      const correctCategory = category.toLowerCase().trim();
      await moveUserFeedToCategory(this.userid, feedid, correctCategory);
    } catch (error) {
      throw error;
    }
  }

  async getMyArticles(feedid, offset) {
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
      const article = await getArticleById(articleid);
      const imageLink = await getArticleImageLink(article.link);
      article.image_link = imageLink;
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
