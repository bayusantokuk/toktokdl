function isMobile() {
  return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent);
}

const form = document.getElementById("tiktok-form");
const input = document.getElementById("tiktok-url");
const statusEl = document.getElementById("tiktok-status");
const errorEl = document.getElementById("tiktok-error");
const resultEl = document.getElementById("tiktok-result");
const videoEl = document.getElementById("tiktok-preview");
const downloadLink = document.getElementById("tiktok-download");
const button = document.getElementById("tiktok-btn");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const url = input.value.trim();
  if (!url) return;

  errorEl.textContent = "";
  statusEl.textContent = "Mencari video TikTok...";
  button.disabled = true;
  resultEl.style.display = "none";

  try {
    const res = await fetch("/api/tiktok", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    if (!res.ok) throw new Error("Gagal menghubungi server.");

    const data = await res.json();

    if (!data.success || !data.downloadUrl) {
      throw new Error(data.message || "Server tidak mengembalikan video.");
    }

    // Auto-download desktop
    if (!isMobile()) {
      const a = document.createElement("a");
      a.href = data.downloadUrl;
      a.download = "tiktok-video.mp4";
      document.body.appendChild(a);
      a.click();
      a.remove();
    }

    // Preview & tombol download
    videoEl.src = data.downloadUrl;
    downloadLink.href = data.downloadUrl;
    downloadLink.download = "tiktok-video.mp4";
    document.getElementById("tiktok-title").textContent = data.title;
    document.getElementById("tiktok-author").textContent = data.author;

    resultEl.style.display = "block";
    statusEl.textContent = isMobile()
      ? "Tap tombol Download Video di bawah untuk menyimpan."
      : "Selesai!";
  } catch (err) {
    console.error(err);
    errorEl.textContent = err.message;
    statusEl.textContent = "";
  } finally {
    button.disabled = false;
  }
});
