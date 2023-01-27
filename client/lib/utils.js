import { XMLParser } from "fast-xml-parser";

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

export async function determineFeedPath(url) {
  const res1 = fetch(url + "/feed");
  const res2 = fetch(url + "/rss.xml");
  const result = await Promise.all([res1, res2]);
  for (let w of result) {
    if (w.ok) {
      return w.url;
    }
  }
  throw new Error("No link was resolved! try again.");
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
    console.log(
      `articles of ${url}`,
      articleObject.rss.channel.item[0].pubDate
    );
    return articleObject.rss.channel.item;
  } else throw new Error("Failed to get new articles.");
}
