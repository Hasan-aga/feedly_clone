import { Controller } from "@/lib/controller";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  try {
    const session = await unstable_getServerSession(req, res, authOptions);
    if (!session) {
      throw new Error("you are not signed in.");
    }
    const { url, category, feedid } = req.query;
    const controller = await Controller.start(session);

    switch (req.method) {
      case "POST":
        {
          const info = await controller.addNewFeed(url, category);
          res.status(200).json({ success: true, info });
        }
        break;
      case "GET":
        {
          const results = await controller.getMyFeeds();
          res.status(200).json({ success: true, results });
        }
        break;
      case "DELETE":
        {
          await controller.deleteFeed(feedid);
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
    return;
  } catch (error) {
    console.log(`failed!, ${error}`);
    res.status(500).json({ success: false, error });
  }
}
