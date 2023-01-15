import { getUserByEmail } from "@/lib/db";

export default async function handler(req, res) {
  const { email } = req.query;
  try {
    const userExists = await getUserByEmail(email).rows;
    if (!userExists) {
      throw new Error("no user found with this email.");
    }
    res.status(200).json({ success: true, user: userExists });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
}
