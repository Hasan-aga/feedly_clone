export default async function handler({ req, res }) {
  if (req.method === "POST")
    try {
      // if user not signed in, block access to this endpoint
      // get url of feed
      //  if feed not in db, add it
      // get id of feed
      // get id of user
      // link user to feed
      const { url } = req.query;
      const result = await addFeed(title, url);
      res.status(200).json({ success: true, result: result.rows });
    } catch (error) {
      console.log(`failed adding ${title}, ${error}`);
      res.status(500).json({ success: false, error });
    }
}
