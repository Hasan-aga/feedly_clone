// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { addFeed } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method === "POST")
    try {
      const { url } = req.query;
      console.log("Adding", url);
      const result = await addFeed(url);
      res.status(200).json({ success: true, result: result.rows });
    } catch (error) {
      console.log(`failed adding feed, ${error}`);
      res.status(500).json({ success: false, error });
    }
}
