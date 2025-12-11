export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "Missing TikTok URL" });

  try {
    const apiRes = await fetch(`https://api.tikwm.com/?url=${encodeURIComponent(url)}`);
    const data = await apiRes.json();

    const videoUrl = data.nowm || data.video?.play_addr?.urlList?.[0];
    const thumb = data.thumb || data.cover || "";
    const title = data.title || "Video TikTok";
    const author = data.author || "Unknown";

    if (!videoUrl) return res.status(500).json({ error: "Gagal mendapatkan video" });

    res.status(200).json({ videoUrl, thumb, title, author });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
}
