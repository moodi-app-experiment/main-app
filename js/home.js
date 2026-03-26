// ── Typewriter ───────────────────────────────────────────────────────
const LINES = [
  'your windows down on a night drive.',
  'the 2am feelings hit hard.',
  'only emo, punk or metal will do.',
  'a playlist just isn\'t enough.',
];

(function fadeLoop() {
  const el = document.getElementById('typewriter');
  if (!el) return;
  let lineIdx = 0;

  function showNext() {
    el.textContent = LINES[lineIdx];
    el.classList.add('fade-in');

    setTimeout(() => {
      el.classList.remove('fade-in');
      el.classList.add('fade-out');

      setTimeout(() => {
        el.classList.remove('fade-out');
        lineIdx = (lineIdx + 1) % LINES.length;
        showNext();
      }, 700);
    }, 3000);
  }

  setTimeout(showNext, 600);
})();

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
