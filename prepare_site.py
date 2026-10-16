#!/usr/bin/env python3
"""Refresh the hosting fallback from assets/mypubs.bib before uploading the site."""
from pathlib import Path
import html

root = Path(__file__).resolve().parent
source = (root / 'assets/mypubs.bib').read_text(encoding='utf-8')
page = root / 'pubs.html'
text = page.read_text(encoding='utf-8')
start = '<!-- BIBTEX FALLBACK START -->'
end = '<!-- BIBTEX FALLBACK END -->'
a = text.index(start)
b = text.index(end, a) + len(end)
fallback = start + '\n    <textarea id="bibtex_fallback" hidden aria-hidden="true">' + html.escape(source) + '</textarea>\n    ' + end
page.write_text(text[:a] + fallback + text[b:], encoding='utf-8')
print('Updated pubs.html bibliography fallback from assets/mypubs.bib.')
