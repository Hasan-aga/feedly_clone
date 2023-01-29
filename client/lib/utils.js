import { XMLParser } from "fast-xml-parser";
import rssFinder from "rss-finder";

const bcrypt = require("bcrypt");

export function isValidEmail(email) {
  // use a regular expression to verify the email format
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
}

export async function isMatchingPasswords(incomingPassword, savedPassword) {
  return await bcrypt.compare(incomingPassword, savedPassword);
}

export async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

export function needsUpdate(lastUpdateTime) {
  const date1 = new Date(lastUpdateTime);
  const date2 = Date.now();
  const hoursSinceUpdate = Math.ceil(Math.abs(date1 - date2) / 36e5);
  return hoursSinceUpdate >= 12 ? true : false;
}

export async function getFeedUrlAndFavicon(url) {
  try {
    const res = await rssFinder(url);
    console.log("rss finder", res);
    if (res.feedUrls.length === 0) {
      throw new Error("No link was resolved! try again.");
    }
    return { url: res.feedUrls[0].url, favicon: res.site.favicon };
  } catch (error) {
    throw error;
  }
}

export async function getFreshArticles(url) {
  console.log("getting fresh articles");
  const res = await fetch(url);
  if (res.ok) {
    console.log("getting text");
    const articles = await res.text();
    console.log("getting xml");
    const parser = new XMLParser();
    let articleObject = parser.parse(articles);
    console.dir(articleObject);

    if (articleObject.rss) {
      return articleObject.rss.channel.item;
    }
    if (articleObject.feed) {
      const articles = articleObject.feed.entry.map((entry) => {
        let articleTemplate = {};
        const { title, link, id, content, updated } = entry;
        articleTemplate.title = title;
        articleTemplate.description = content;
        articleTemplate.link = id;
        articleTemplate.pubDate = updated;
        return articleTemplate;
      });

      return articles;
    }
    throw new Error("articles object has different schema:", articleObject);
  } else throw new Error("Failed to get new articles.");
}
