// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { Controller } from "@/lib/controller";
import { getArticlesOfFeed } from "@/lib/db";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  try {
    const session = await unstable_getServerSession(req, res, authOptions);
    if (!session) {
      throw new Error("You are not signed in.");
    }
    const { feedid, offset, articleid } = req.query;
    const controller = await Controller.start(session);
    switch (req.method) {
      case "GET":
        {
          console.log(`getting articles for feed ${feedid}`);
          // todo: maybe use this method through controller
          const results = await getArticlesOfFeed(feedid, offset);

          res.status(200).json({ success: true, results });
        }
        break;
      case "POST":
        {
          await controller.bookmarkArticle(articleid);
          res.status(200).json({ success: true });
        }
        break;

      default:
        res.status(404).json({
          success: false,
          info: "No such endpoint. Check request type / path",
        });
        break;
    }
  } catch (error) {
    console.log(`failed!, ${error}`);
    res.status(500).json({ success: false, error: error.message });
  }
}
