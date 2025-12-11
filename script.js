const goBtn = document.getElementById('goBtn');
const urlInput = document.getElementById('urlInput');
const dlBtn = document.getElementById('dlBtn');

goBtn.addEventListener('click', async () => {
  const url = urlInput.value.trim();
  if (!url) return alert('Masukkan link TikTok');

  try {
    const res = await fetch(`https://YOUR_WORKER_DOMAIN?url=${encodeURIComponent(url)}`);
    const data = await res.json();

    if (data.videoUrl) {
      dlBtn.href = data.videoUrl;
      dlBtn.download = 'tiktok.mp4';
      dlBtn.style.display = 'inline-block';
      dlBtn.textContent = 'Klik untuk download';
    } else {
      alert(data.error || 'Gagal download');
    }
  } catch (e) {
    alert('Terjadi kesalahan: ' + e.message);
  }
});
