export default async function handler(req, res) {
  try {
    const url = req.query.url;

    if (!url) {
      return res.status(400).send("Missing download URL");
    }

    // Fetch file dari TikTok CDN
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(500).send("Failed to fetch video");
    }

    // Paksa browser download file
    res.setHeader("Content-Type", "video/mp4");
    res.setHeader("Content-Disposition", "attachment; filename=tiktok-video.mp4");

    const arrayBuffer = await response.arrayBuffer();
    res.send(Buffer.from(arrayBuffer));
  } catch (e) {
    res.status(500).send("Server error");
  }
}
