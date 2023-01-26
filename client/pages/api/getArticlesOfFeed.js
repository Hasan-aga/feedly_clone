// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getUserByEmail, getFeedsOfUser, getArticlesOfFeed } from "@/lib/db";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    res.status(403).json({ success: false, error: "You are not signed in." });
  } else if (req.method === "GET")
    try {
      // http://localhost:3000/api/getArticlesOfFeed?feedid=82
      const { feedid } = req.query;
      const results = await getArticlesOfFeed(feedid);

      res.status(200).json({ success: true, results });
    } catch (error) {
      console.log(`failed getting articles, ${error}`);
      res.status(500).json({ success: false, error });
    }
}
