import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing TikTok URL' });
  }

  try {
    // Ganti endpoint API sesuai kebutuhan, misal tikwm
    const apiUrl = `https://api.tikwm.com/?url=${encodeURIComponent(url)}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    // Cari video URL
    const videoUrl = data.nowm || data.video?.play_addr || data.play || data.url;

    if (!videoUrl) {
      return res.status(500).json({ error: 'Gagal menemukan video URL' });
    }

    res.status(200).json({
      videoUrl,
      title: data.title || 'Video TikTok',
      author: data.author || data.username || '',
      thumb: data.thumb || data.cover || ''
    });
  } catch (err) {
    res.status(500).json({ error: 'Terjadi kesalahan server', detail: err.message });
  }
}
