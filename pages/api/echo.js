export default async function handler(req, res) {
  try {
    const { message } = req.query;
    res.status(200).json({ success: true, message });
  } catch (error) {
    console.log(`failed!, ${error}`);
    res.status(500).json({ success: false, error: error.message });
  }
}
