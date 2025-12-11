// api/tiktok.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) return res.status(400).json({ error: "Missing TikTok URL" });

  try {
    // TikWM API endpoint
    const apiUrl = `https://api.tikwm.com/?url=${encodeURIComponent(url)}`;

    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();

    // ambil direct video URL (no watermark)
    let videoUrl = data.nowm || data.video?.play_addr?.url;

    if (!videoUrl) {
      return res.status(404).json({ error: "Gagal menemukan video" });
    }

    // CORS header supaya frontend bisa fetch
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.json({ videoUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
