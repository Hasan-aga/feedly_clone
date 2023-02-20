import { XMLParser } from "fast-xml-parser";
import parse from "node-html-parser";
import robustRssFinder from "robust-rss-finder";

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
  // update if 2 hours passed
  return hoursSinceUpdate >= 2 ? true : false;
}

export async function getFeedUrlAndFavicon(url) {
  try {
    const res = await robustRssFinder(url);
    console.log("rss finder", res);
    if (res.feedUrls.length === 0) {
      throw new Error("No link was resolved! try again.");
    }
    return { url: res.feedUrls[0].url, favicon: res.site.favicon };
  } catch (error) {
    throw error;
  }
}

function getImageFromHeader(doc, selector) {
  const tag = doc.querySelector(selector);
  if (tag && tag.attributes) {
    return tag.attributes.content;
  }
  return null;
}

async function getFirstImageFromDoc(doc, link) {
  try {
    const img = doc.querySelector("img");
    const imgLink = img?.attributes.src;
    if (!imgLink) {
      throw new Error("No image found on page");
    }
    const { origin } = new URL(link);
    const url = new URL(imgLink, origin);
    return url.toString();
  } catch (error) {
    throw new Error(`Error parsing image from page: ${error.message}`);
  }
}

export async function getArticleImageLink(link) {
  try {
    console.log("Getting image for page", link);
    const response = await fetch(link);
    if (!response.ok) {
      throw new Error(`Could not fetch page: ${response.statusText}`);
    }
    const result = await response.text();
    const doc = parse(result);

    const selectors = [
      "meta[property='og:image']",
      "meta[name='image']",
      "meta[property='og:image']",
    ];

    for (const selector of selectors) {
      const result = getImageFromHeader(doc, selector);
      if (result) return result;
    }

    return getFirstImageFromDoc(doc, link);
  } catch (error) {
    console.error(`Error getting image for page ${link}: ${error.message}`);
    throw error;
  }
}

export async function getFreshArticles(url) {
  console.log("getting fresh articles");
  const res = await fetch(url);
  if (res.ok) {
    const articles = await res.text();
    const parser = new XMLParser();
    let articleObject = parser.parse(articles);
    console.dir(articleObject);

    if (articleObject.rss) {
      const articles = articleObject.rss.channel.item;
      return articles;
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

export function groupByCategory(dataArray) {
  return dataArray.reduce(function (acc, item) {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});
}

export function hasHttpPart(url) {
  const regex = /http:|https:/;
  const result = regex.test(url);
  return result;
}

export function containsArabicCharacters(str) {
  var arabicPattern = /[\u0600-\u06FF]/;

  return arabicPattern.test(str);
}

export function parseDescription(article) {
  if (!article.description) {
    return "No description 😓";
  }
  let { description } = article;
  if (description.charAt(0) === "<") {
    const root = new parse(description);
    description = root.text;
  }
  return description.slice(0, 200);
}

export function processFeedInfo({ category, title }) {
  // remove www. part from title
  //  make category standard (lower case + trim)
  const regex = /\bwww\./g;
  const result = {
    correctedCategory: category.toLowerCase().trim(),
    correctedTitle: title.replace(regex, ""),
  };
  return result;
}
