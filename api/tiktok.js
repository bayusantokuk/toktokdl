export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });
  }

  const { url } = req.body || {};

  if (!url) {
    return res.status(400).json({
      success: false,
      message: "URL TikTok tidak valid."
    });
  }

  try {
    const apiUrl = "https://www.tikwm.com/api/?url=" + encodeURIComponent(url);

    const response = await fetch(apiUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0 Safari/537.36",
      },
    });

    const json = await response.json();

    if (json.code !== 0 || !json.data) {
      throw new Error("Tidak bisa mengambil video.");
    }

    // 🔥 Ambil link auto-download
    const downloa
