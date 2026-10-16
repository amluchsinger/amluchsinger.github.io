# Austin Luchsinger — personal website

Static HTML/CSS/JavaScript website prepared for GitHub Pages.

## Publish

Put this folder's contents directly in the repository root. In Settings → Pages,
choose Deploy from a branch, main, and / (root). No theme, package installation,
or custom build workflow is needed. Keep .nojekyll at the repository root.

See GITHUB_PAGES_SETUP.txt for complete transfer instructions.

## Update

Edit HTML files directly. Shared styles are in css/. Course pages are in classes/.
After editing assets/mypubs.bib, run `python3 prepare_site.py` and commit both the
bibliography and pubs.html. This keeps the embedded bibliography fallback current.
Commit and push changes to publish them.

Preview locally with `python3 -m http.server 8874`, then visit
http://127.0.0.1:8874/. See classes/README.md for adding semesters.

SITE_NOTES.md contains historical setup notes, including the former faculty-host fix.
