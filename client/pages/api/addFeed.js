// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import {
  addFeed,
  getFeedByUrl,
  getUserByEmail,
  linkUserToFeed,
  updateFeedArticles,
} from "@/lib/db";
import { XMLParser } from "fast-xml-parser";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

async function determineFeedPath(url) {
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

async function getFreshArticles(url) {
  // {
  //   '?xml': '',
  //   rss: {
  //     channel: {
  //       title: 'صفحات صغيرة',
  //       'atom:link': '',
  //       link: 'https://smallpages.blog',
  //       description: 'أفكار في التقنية، التعليم والتبسيط يكتبها عبدالله المهيري',
  //       lastBuildDate: 'Tue, 24 Jan 2023 14:11:06 +0000',
  //       language: 'ar',
  //       'sy:updatePeriod': 'hourly',
  //       'sy:updateFrequency': 1,
  //       generator: 'https://wordpress.org/?v=6.1.1',
  //       image: [Object],
  //       site: 193963405,
  //       item: [Array]
  //     }
  //   }
  // }
  const res = await fetch(url);
  if (res.ok) {
    const articles = await res.text();
    const parser = new XMLParser();
    let articleObject = parser.parse(articles);
    return articleObject.rss.channel.item;
  } else throw new Error("Failed to get new articles.");
}

export default async function handler(req, res) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    res.status(403).json({ success: false, error: "You are not signed in." });
  } else if (req.method === "POST")
    try {
      const { url } = req.query;
      const feedExists = await getFeedByUrl(url);

      const correctUrl = await determineFeedPath(url);
      console.log("winner", correctUrl);

      let feedID;
      if (!feedExists) {
        console.log("Adding", correctUrl);

        const result = await addFeed(correctUrl);
        feedID = result.rows[0].rowid;
        const articles = await getFreshArticles(correctUrl);
        await updateFeedArticles(feedID, articles);
      } else {
        feedID = feedExists.rowid;
      }
      // get user id
      const user = await getUserByEmail(session.user.email);
      const userID = user.rowid;
      const relation = await linkUserToFeed(userID, feedID);
      console.log(relation.rows[0], feedID);
      res.status(200).json({ success: true });
    } catch (error) {
      console.log(`failed adding feed, ${error}`);
      res.status(500).json({ success: false, error });
    }
}
