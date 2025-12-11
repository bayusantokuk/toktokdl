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
  statusEl.textContent = "Memproses link...";
  button.disabled = true;
  resultEl.classList.add("hidden");

  try {
    const res = await fetch("/api/tiktok", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    const data = await res.json();

    if (!data.success) throw new Error(data.message);

    const finalURL = data.downloadUrl;

    // Preview
    videoEl.src = finalURL;
    document.getElementById("tiktok-title").textContent = data.title;
    document.getElementById("tiktok-author").textContent = data.author;

    // Tombol download → pakai proxy
    downloadLink.href = "/api/download?url=" + encodeURIComponent(finalURL);
    downloadLink.download = "tiktok-video.mp4";


    resultEl.classList.remove("hidden");
    statusEl.textContent = "Selesai!";

  } catch (err) {
    errorEl.textContent = err.message;
    statusEl.textContent = "";
  }

  button.disabled = false;
});
