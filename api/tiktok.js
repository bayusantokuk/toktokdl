// /api/tiktok.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  const url = req.query.url;
  if (!url) {
    res.status(400).json({ error: 'Missing TikTok URL' });
    return;
  }

  try {
    // Ganti endpoint ini sesuai API TikTok publik yang bisa diakses
    const apiUrl = `https://api.tikwm.com/?url=${encodeURIComponent(url)}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data || !data.nowm) {
      res.status(400).json({ error: 'Video tidak ditemukan / API gagal' });
      return;
    }

    res.status(200).json({
      videoUrl: data.nowm,
      title: data.title || 'Video TikTok',
      author: data.author || 'Unknown',
      thumb: data.cover || ''
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}
