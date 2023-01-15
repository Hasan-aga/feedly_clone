// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { addUser } from "@/lib/db";
import { hashPassword, isValidEmail } from "@/lib/utils";

export default async function handler(req, res) {
  const { email, password } = req.query;
  if (req.method === "POST")
    try {
      console.log(req.query);
      if (!isValidEmail(email)) {
        throw new Error("Email not valid!");
      }

      const result = await addUser(email);
      res.status(201).json({ success: true, result: result.rows });
    } catch (error) {
      console.log(`failed adding ${email}, ${error}`);
      res.status(500).json({ success: false, error });
    }
}
