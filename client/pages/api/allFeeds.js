// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getAllFeeds } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method === "GET")
    try {
      const result = await getAllFeeds();
      res.status(200).json({ success: true, result: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error });
    }
}
