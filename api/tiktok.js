export default async function handler(req, res) {
  // Hanya izinkan POST
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const { url } = req.body || {};

    if (!url || typeof url !== "string") {
      return res.status(400).json({
        success: false,
        message: "URL TikTok tidak valid.",
      });
    }

    // API TikTok no-watermark yang stabil
    const apiURL = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`;

    const response = await fetch(apiURL, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
        "Accept": "application/json",
      },
    });

    // Kalau TikWM membalas HTML (bukan JSON), tangkap error
    const text = await response.text();
    let json;

    try {
      json = JSON.parse(text);
    } catch {
      return res.status(50
