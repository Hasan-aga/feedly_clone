// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import {
  addFeed,
  addUser,
  getFeedByTitle,
  getUserByEmail,
  linkUserToFeed,
  updateFeedArticles,
} from "@/lib/db";
import {
  determineFeedPath,
  getFeedUrlAndFavicon,
  getFreshArticles,
} from "@/lib/utils";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    res.status(403).json({ success: false, error: "You are not signed in." });
  } else if (req.method === "POST") a;
  try {
    // get user id
    let user = await getUserByEmail(session.user.email);
    if (!user) {
      user = await addUser(session.user.email);
      console.log(`added user `, user);
    }
    const userID = user.rowid;
    const { url, category } = req.query;
    console.log(`adding feed to category ${category}`);
    const feedID = await addFeedToDB(url, category, userID);
    await linkUserToFeed(userID, feedID);
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(`failed adding feed, ${error}`);
    res.status(500).json({ success: false, error });
  }
}

async function addFeedToDB(url, category, userID) {
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
    feedID = await addFeed(feedInfo, userID);
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
  console.log(`feed id:${feedID}`);

  return feedID;
}
