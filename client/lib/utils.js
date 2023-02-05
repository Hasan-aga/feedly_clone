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
  return hoursSinceUpdate >= 12 ? true : false;
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

export async function getArticleImageLink(link) {
  // todo: get the body of an article
  try {
    console.log("getting page", link);
    const response = await fetch(link);
    const result = await response.text();

    const doc = parse(result);
    // try to get image from meta tags
    const openGraphImage = doc.querySelector(
      "meta[property='og:image']"
    ).attributes;
    if (openGraphImage.content) {
      return openGraphImage.content;
    }

    const metaImage = doc.querySelector("meta[name='image']").attributes;
    if (metaImage.content) return metaImage.content;

    // try to scrape the first image of the article page
    const img = doc.querySelector("img");
    const imgLink = img?.attributes.src;
    try {
      // test the image link if it is relative or absolute
      new URL(imgLink);
    } catch (error) {
      // if link is relative, concatinate it with origin
      const { origin } = new URL(link);
      return origin + imgLink;
    }
    return imgLink;
  } catch (error) {
    console.log("got error while calling article", error);
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
