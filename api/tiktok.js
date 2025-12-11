export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { url } = req.body || {};
  if (!url || typeof url !== "string") {
    return res.status(400).json({ success: false, message: "URL TikTok tidak valid." });
  }

  try {
    const apiUrl = "https://www.tikwm.com/api/?url=" + encodeURIComponent(url);

    const response = await fetch(apiUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0 Safari/537.36",
      },
    });

    const contentType = response.headers.get("content-type");

    // Jika bukan JSON → kemungkinan error atau redirect
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text(); // ambil isi agar bisa debug
      console.error("Response bukan JSON:", text);
      throw new Error("API tidak merespon JSON. Cek link atau server sedang down.");
    }

    const json = await response.json();

    if (json.code !== 0 || !json.data?.play) {
      throw new Error("Tidak bisa mengambil video dari API.");
    }

    return res.status(200).json({
      success: true,
      downloadUrl: json.data.play,
      title: json.data.title || "Video TikTok",
      author: json.data.author || "Unknown",
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err.message || "Server error, coba lagi nanti.",
    });
  }
}
