// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import {
  addFeed,
  getFeedByTitle,
  getUserByEmail,
  linkUserToFeed,
  updateFeedArticles,
} from "@/lib/db";
import { determineFeedPath } from "@/lib/utils";
import { XMLParser } from "fast-xml-parser";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

async function getFreshArticles(url) {
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
      const urlDetails = new URL(url);
      const title = urlDetails.hostname;
      const feedExists = await getFeedByTitle(title);
      console.log(`${urlDetails.hostname} exists?`, feedExists);
      let feedID;
      if (!feedExists) {
        const correctUrl = await determineFeedPath(url);
        console.log("Adding", correctUrl);
        const result = await addFeed(correctUrl, title);
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
