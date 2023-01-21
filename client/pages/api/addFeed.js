// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import {
  addFeed,
  getFeedByUrl,
  getUserByEmail,
  linkUserToFeed,
} from "@/lib/db";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  console.log("req", req);
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    res.status(403).json({ success: false, error: "You are not signed in." });
  } else if (req.method === "POST")
    try {
      // todo: db throws error if feed exists. this is not right.
      // if user not signed in, block access to this endpoint
      // get url of feed
      //  if feed not in db, add it
      // get id of feed
      // get id of user
      // link user to feed
      const { url } = req.query;
      const feedExists = await getFeedByUrl(url);

      let feedID;
      if (!feedExists) {
        console.log("Adding", url);
        const result = await addFeed(url);
        feedID = result.rows[0].rowid;
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
