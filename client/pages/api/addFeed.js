// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import {
  addFeed,
  getFeedByTitle,
  getUserByEmail,
  linkUserToFeed,
  updateFeedArticles,
} from "@/lib/db";
import { determineFeedPath, getFreshArticles } from "@/lib/utils";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    res.status(403).json({ success: false, error: "You are not signed in." });
  } else if (req.method === "POST")
    try {
      const { url } = req.query;
      const feedID = await addFeedToDB(url);
      // get user id
      const user = await getUserByEmail(session.user.email);
      const userID = user.rowid;
      await linkFeedToUser(userID, feedID);
      res.status(200).json({ success: true });
    } catch (error) {
      console.log(`failed adding feed, ${error}`);
      res.status(500).json({ success: false, error });
    }
}
async function linkFeedToUser(userID, feedID) {
  const relation = await linkUserToFeed(userID, feedID);
  console.log(relation.rows[0], feedID);
}

async function addFeedToDB(url) {
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
    try {
      // separate into own try / catch. failing to get articles wont disrupt creating user/feed relation
      const articles = await getFreshArticles(correctUrl);
      await updateFeedArticles(feedID, articles);
    } catch (error) {
      console.log(error);
    }
  } else {
    feedID = feedExists.rowid;
  }
  return feedID;
}
