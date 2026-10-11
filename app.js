// Simpan teks secara automatik (Auto-save) ke LocalStorage
const boxes = ['do', 'schedule', 'delegate', 'delete'];

// Muat turun teks yang pernah disimpan
boxes.forEach(box => {
  const el = document.getElementById(`box-${box}`);
  const savedText = localStorage.getItem(`exact_matrix_${box}`);
  if (savedText) {
    el.innerText = savedText;
  }

  // Simpan setiap kali pengguna menaip
  el.addEventListener('input', () => {
    localStorage.setItem(`exact_matrix_${box}`, el.innerText);
  });
});
