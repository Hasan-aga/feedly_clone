import { Controller } from "@/lib/controller";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  try {
    const session = await unstable_getServerSession(req, res, authOptions);
    if (!session) {
      throw new Error("You are not signed in.");
    }
    const { articleid } = req.query;
    const controller = await Controller.start(session);
    const imageLink = await controller.getArticleImage(articleid);
    res.status(200).json({ success: true, imageLink });
  } catch (error) {
    console.error(`failed while working with articles!, ${error}`);
    res.status(500).json({ success: false, error: error.message });
  }
}
