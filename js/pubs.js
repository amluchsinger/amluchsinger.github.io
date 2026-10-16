(() => {
  const STORAGE_KEY = 'pubsViewState';
  let bibliographyDownload;
  function updateBibliographyDownload(source) {
    const link = document.querySelector('a[download]');
    if (!link || !source) return;
    if (bibliographyDownload) URL.revokeObjectURL(bibliographyDownload);
    bibliographyDownload = URL.createObjectURL(new Blob([source], { type: 'text/plain;charset=utf-8' }));
    link.href = bibliographyDownload;
    link.download = 'mypubs.bib';
  }
  updateBibliographyDownload(document.getElementById('bibtex_fallback')?.value);

  let initialized = false;
  let failed = false;
  const state = {
    sort: 'desc',
    tag: 'All'
  };

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      if (saved.sort === 'asc' || saved.sort === 'desc') state.sort = saved.sort;
      if (typeof saved.tag === 'string' && saved.tag.trim()) state.tag = saved.tag;
    } catch (_) {}
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) {}
  }

  function getDisplay() {
    return document.querySelector('.bibtex_display');
  }

  function getEntries() {
    return Array.from(document.querySelectorAll('.bibtex_display .bibtexentry'));
  }

  function extractYear(node) {
    const yEl = node.querySelector('.year');
    if (!yEl) return -Infinity;
    const y = parseInt((yEl.textContent || '').replace(/[^0-9]/g, ''), 10);
    return Number.isNaN(y) ? -Infinity : y;
  }

  function parseTags(tagText) {
    return (tagText || '')
      .split(/[;,]/)
      .map(tag => tag.trim())
      .filter(Boolean);
  }

  function getTagsForEntry(entry) {
    return parseTags(entry.querySelector('.tags')?.textContent || '');
  }

  function hydrateEntryMetadata() {
    getEntries().forEach(entry => {
      const tags = getTagsForEntry(entry);
      entry.dataset.tags = tags.join('|');
      entry.dataset.year = String(extractYear(entry));
      const date = entry.querySelector('.sortdate')?.textContent.trim() || '';
      const match = /^(\d{4})-(0[1-9]|1[0-2])(?:-(0[1-9]|[12]\d|3[01]))?$/.exec(date);
      entry.dataset.recency = match && Number(match[1]) === Number(entry.dataset.year)
        ? String(Number(match[2]) * 100 + Number(match[3] || 0)) : '';
      entry.dataset.sortTitle = entry.querySelector('.pub-title').textContent.trim();
    });
  }

  // Years stay authoritative; unknown within-year dates follow dated entries.
  function compareRecency(a, b, direction = state.sort) {
    const sign = direction === 'asc' ? 1 : -1;
    const ya = Number(a.dataset.year), yb = Number(b.dataset.year);
    if (ya !== yb) return ya < yb ? -sign : sign;
    const da = a.dataset.recency || '', db = b.dataset.recency || '';
    if (!!da !== !!db) return da ? -1 : 1;
    if (da !== db) return sign * (Number(da) - Number(db));
    return (a.dataset.sortTitle || '').localeCompare(b.dataset.sortTitle || '');
  }

  function getGroups() {
    return Array.from(document.querySelectorAll('.pub-group'));
  }

  function groupEntries() {
    const groups = new Map();
    getEntries().forEach((entry, index) => {
      const key = entry.querySelector('.pubgroup')?.textContent.trim() || `single-${index}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(entry);
    });
    groups.forEach(entries => {
      entries.sort((a, b) => compareRecency(a, b, 'desc'));
      const group = document.createElement('article');
      group.className = 'pub-group';
      group.dataset.sortTitle = entries[0].dataset.sortTitle;
      const title = document.createElement('h3');
      title.className = 'pub-title';
      title.textContent = entries[0].querySelector('.pub-title').textContent;
      group.appendChild(title);
      const authors = entries.map(entry => entry.querySelector('.pub-authors').textContent);
      const sameAuthors = new Set(authors).size === 1;
      if (sameAuthors) group.appendChild(entries[0].querySelector('.pub-authors').cloneNode(true));
      entries.forEach(entry => {
        const type = entry.querySelector('.bibtextypekey')?.textContent.trim().toLowerCase();
        const note = entry.querySelector('.note')?.textContent.trim() || '';
        const venue = entry.querySelector('.pub-venue');
        const preprint = /arxiv/i.test(venue.textContent + note);
        const label = preprint ? 'Preprint' : type === 'article' ? 'Journal' : type === 'inproceedings' ? 'Conference' : 'Version';
        entry.querySelector('.pub-title').remove();
        if (sameAuthors) entry.querySelector('.pub-authors').remove();
        const badge = document.createElement('span');
        badge.className = 'version-label';
        badge.textContent = label;
        entry.prepend(badge);
        if (preprint && note) venue.textContent = `${note} · ${entry.dataset.year}`;
        group.appendChild(entry);
      });
      getDisplay().appendChild(group);
    });
  }

  function refreshView() {
    let visibleCount = 0;
    getEntries().forEach(entry => {
      const show = state.tag === 'All' || entry.dataset.tags.split('|').includes(state.tag);
      entry.classList.toggle('pub-hidden', !show);
      if (show) visibleCount++;
    });
    const groups = getGroups();
    groups.forEach(group => {
      const visible = Array.from(group.querySelectorAll('.bibtexentry:not(.pub-hidden)'));
      group.classList.toggle('pub-hidden', visible.length === 0);
      const latest = [...visible].sort((a, b) => compareRecency(a, b, 'desc'))[0];
      group.dataset.year = latest?.dataset.year || '-Infinity';
      group.dataset.recency = latest?.dataset.recency || '';
      Array.from(group.querySelectorAll('.bibtexentry')).sort(compareRecency)
        .forEach(entry => group.appendChild(entry));
    });
    groups.sort(compareRecency).forEach(group => getDisplay().appendChild(group));
    getDisplay().querySelectorAll('.pub-year-heading').forEach(heading => heading.remove());
    let previousYear = null;
    groups.forEach(group => {
      if (group.classList.contains('pub-hidden')) return;
      const year = group.dataset.year;
      if (year !== previousYear) {
        const heading = document.createElement('h2');
        heading.className = 'pub-year-heading';
        heading.textContent = Number.isFinite(Number(year)) ? year : 'Undated';
        getDisplay().insertBefore(heading, group);
        previousYear = year;
      }
    });
    let visibleGroups = 0;
    groups.forEach(group => {
      if (group.classList.contains('pub-hidden')) group.removeAttribute('data-number');
      else group.dataset.number = String(++visibleGroups);
    });
    const topic = state.tag === 'All' ? '' : ` for “${state.tag}”`;
    document.getElementById('pubs-status').textContent =
      `${visibleCount} publication${visibleCount === 1 ? "" : "s"} · ${visibleGroups} grouped listing${visibleGroups === 1 ? "" : "s"}${topic}. Each version counts separately.`;
    updateSortButtons();
    updateTagButtons();
    saveState();
  }

  function updateSortButtons() {
    document.querySelectorAll('.pub-sort-btn').forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.sort === state.sort);
      btn.setAttribute('aria-pressed', String(btn.dataset.sort === state.sort));
    });
  }

  function updateTagButtons() {
    document.querySelectorAll('.tag-filter-btn').forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.tag === state.tag);
      btn.setAttribute('aria-pressed', String(btn.dataset.tag === state.tag));
    });
  }

  function buildTagButtons() {
    const container = document.getElementById('tag-filters');
    if (!container) return;

    const entries = getEntries();
    const counts = new Map();

    entries.forEach(entry => {
      getTagsForEntry(entry).forEach(tag => {
        counts.set(tag, (counts.get(tag) || 0) + 1);
      });
    });

    const orderedTags = Array.from(counts.keys()).sort((a, b) => a.localeCompare(b));

    container.innerHTML = '';

    const allBtn = document.createElement('button');
    allBtn.type = 'button';
    allBtn.className = 'tag-filter-btn';
    allBtn.dataset.tag = 'All';
    allBtn.textContent = `All (${entries.length})`;
    container.appendChild(allBtn);

    orderedTags.forEach(tag => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tag-filter-btn';
      btn.dataset.tag = tag;
      btn.textContent = `${tag} (${counts.get(tag)})`;
      container.appendChild(btn);
    });

    container.addEventListener('click', event => {
      const btn = event.target.closest('.tag-filter-btn');
      if (!btn) return;
      state.tag = btn.dataset.tag || 'All';
      refreshView();
    });
  }

  function bindSortButtons() {
    document.querySelectorAll('.pub-sort-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const sort = btn.dataset.sort;
        if (sort !== 'asc' && sort !== 'desc') return;
        state.sort = sort;
        refreshView();
      });
    });
  }

  function initializePublicationsPage(event) {
    updateBibliographyDownload(event?.detail?.bibtex);
    if (initialized || failed) return;
    initialized = true;
    clearTimeout(loadTimeout);
    const display = getDisplay();
    if (!display) return;

    loadState();
    hydrateEntryMetadata();
    getEntries().forEach(entry => {
      for (const selector of ['.pub-title', '.pub-authors', '.pub-venue']) {
        const node = entry.querySelector(selector);
        if (node) node.textContent = node.textContent
          .replace(/\$(\d+)\^(st|nd|rd|th)\$/g, '$1$2')
          .replace(/\s+/g, ' ').replace(/\s+([,.])/g, '$1').trim();
      }
      entry.querySelectorAll('a.doi').forEach(link => {
        const doi = (link.getAttribute('href') || '').trim()
          .replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, '');
        link.href = 'https://doi.org/' + doi;
      });
    });
    buildTagButtons();
    groupEntries();

    const availableTags = new Set(
      Array.from(document.querySelectorAll('.tag-filter-btn')).map(btn => btn.dataset.tag)
    );
    if (!availableTags.has(state.tag)) {
      state.tag = 'All';
    }

    bindSortButtons();
    refreshView();
  }

  function showLoadError() {
    failed = true;
    clearTimeout(loadTimeout);
    document.getElementById('pubs-status').textContent = 'Publications could not be loaded. Please reload the page or download the bibliography above.';
    document.querySelectorAll('.pub-sort-btn').forEach(btn => { btn.disabled = true; });
  }

  const loadTimeout = setTimeout(showLoadError, 15000);
  document.addEventListener('bibtex:error', showLoadError);
  document.addEventListener('bibtex:loaded', initializePublicationsPage);
})();
