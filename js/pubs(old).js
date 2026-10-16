function sortByYear() {
  const container = document.getElementById('bibtex_display');
  const entries = Array.from(container.children);
  
  entries.sort((a, b) => {
    return parseInt(b.getAttribute('data-year')) - parseInt(a.getAttribute('data-year'));
  });
  
  entries.forEach(e => container.appendChild(e)); // re-append in new order
}

function sortByType() {
  const container = document.getElementById('bibtex_display');
  const entries = Array.from(container.children);
  
  entries.sort((a, b) => {
    return a.getAttribute('data-type').localeCompare(b.getAttribute('data-type'));
  });
  
  entries.forEach(e => container.appendChild(e));
}

function sortRenderedPubs(order = 'desc') {
  const box = document.querySelector('.bibtex_display');
  if (!box) return;

  const items = Array.from(box.children).filter(el => el.nodeType === 1);

  items.sort((a, b) => {
    const ya = parseInt((a.querySelector('.year') || {}).textContent || '0', 10);
    const yb = parseInt((b.querySelector('.year') || {}).textContent || '0', 10);
    return order === 'asc' ? ya - yb : yb - ya;
  });

  items.forEach(el => box.appendChild(el));
}

(function waitForBibtex() {
  const box = document.querySelector('.bibtex_display');
  if (!box) return;

  if (box.children.length) { sortRenderedPubs('desc'); return; }

  const obs = new MutationObserver(() => {
    if (box.children.length) {
      sortRenderedPubs('desc');
      obs.disconnect();
    }
  });
  obs.observe(box, { childList: true });
})();
