/* A playful tile assembly illustration, not a simulation of a formal tile model. */
(() => {
  const button = document.querySelector('.monogram-button');
  if (!button) return;
  const tiles = Array.from(button.querySelectorAll('.monogram-tile'));
  const caption = button.querySelector('.monogram-caption');
  const status = document.querySelector('.monogram-status');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let animations = [];
  let running = false;
  let runId = 0;

  // Grow outward from the lower-left tile of each letter.
  const ordered = [...tiles].sort((a, b) => {
    const distance = tile => Number(tile.dataset.col) % 6 + 6 - Number(tile.dataset.row);
    return distance(a) - distance(b) || Number(a.dataset.col) - Number(b.dataset.col);
  });

  function finish(id) {
    if (id !== runId) return;
    animations.forEach(animation => animation.cancel());
    animations = [];
    running = false;
    button.removeAttribute('aria-busy');
    caption.textContent = 'Replay';
    status.textContent = 'AL assembled.';
  }

  button.disabled = false;
  button.setAttribute('aria-label', 'Assemble the AL tile monogram');
  button.title = 'Click to assemble my initials';
  caption.textContent = 'Assemble';
  button.addEventListener('click', () => {
    if (running) return;
    const id = ++runId;
    status.textContent = '';
    if (reducedMotion.matches || !tiles[0]?.animate) {
      finish(id);
      return;
    }
    running = true;
    button.setAttribute('aria-busy', 'true');
    caption.textContent = 'Assembling';
    animations = ordered.map((tile, index) => {
      const x = Number(tile.getAttribute('x'));
      const y = Number(tile.getAttribute('y'));
      // Scatter within the SVG bounds so the animation never covers page text.
      const dx = 8 + (index * 37 % 119) - x;
      const dy = 8 + (index * 29 % 69) - y;
      const scatter = `translate(${dx}px, ${dy}px)`;
      const departure = .30 + index / ordered.length * .40;
      return tile.animate([
        { transform: 'translate(0, 0)', opacity: 1, offset: 0 },
        { transform: scatter, opacity: .45, offset: .18 },
        { transform: scatter, opacity: .45, offset: departure },
        { transform: 'translate(0, 0)', opacity: 1, offset: departure + .23 },
        { transform: 'translate(0, 0)', opacity: 1, offset: 1 }
      ], { duration: 2400, easing: 'ease-in-out', fill: 'none' });
    });
    Promise.allSettled(animations.map(animation => animation.finished)).then(() => finish(id));
  });

  reducedMotion.addEventListener('change', event => {
    if (event.matches && running) finish(runId);
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && running) finish(runId);
  });
})();
