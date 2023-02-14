// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getUserByEmail, getFeedsOfUser, updateFeedArticles } from "@/lib/db";
import { getFreshArticles, needsUpdate } from "@/lib/utils";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    res.status(403).json({ success: false, error: "You are not signed in." });
  } else if (req.method === "GET")
    try {
      const user = await getUserByEmail(session.user.email);
      const userID = user.rowid;

      const results = await getFeedsOfUser(userID);
      for (const feed of results) {
        // check if feed needs updating articles

        console.log("feed needs update? ", needsUpdate(feed.lastupdated));
        if (needsUpdate(feed.lastupdated)) {
          // update the articles of feed
          // todo: test that updating works
          const articles = await getFreshArticles(feed.url);
          await updateFeedArticles(feed.rowid, articles);
        }
      }
      res.status(200).json({ success: true, results });
    } catch (error) {
      console.log(`failed getting articles, ${error}`);
      res.status(500).json({ success: false, error });
    }
}
