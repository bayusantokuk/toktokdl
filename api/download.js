export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).send("URL missing");

  try {
    const response = await fetch(url);
    const data = await response.arrayBuffer();

    res.setHeader("Content-Type", "video/mp4");
    res.setHeader("Content-Disposition", "attachment; filename=tiktok-video.mp4");
    res.send(Buffer.from(data));
  } catch (err) {
    res.status(500).send("Gagal download video");
  }
}
