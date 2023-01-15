// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { addFeed } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method === "POST")
    try {
      const { title, url } = req.query;
      const result = await addFeed(title, url);
      res.status(200).json({ success: true, result: result.rows });
    } catch (error) {
      console.log(`failed adding ${title}, ${error}`);
      res.status(500).json({ success: false, error });
    }
}
