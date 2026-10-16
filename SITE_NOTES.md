# Updated faculty website

This is a separate, editable copy of the website. The original Documents/webpage-backup folder was not changed.

## Preview

Run from this directory:

```sh
python3 -m http.server 8874 --bind 127.0.0.1
```

Open http://127.0.0.1:8874/ in a browser. Use an HTTP server rather than opening HTML directly: the publication list requests its bibliography over HTTP.

## Update publications

Edit `assets/mypubs.bib`. The publications page reads this file directly with caching disabled for the bibliography request. No conversion to `.txt` is needed. After editing the bibliography, run `python3 prepare_site.py` from this folder before uploading. This refreshes an embedded fallback in `pubs.html` for hosts that reject `.bib` requests. The page prefers the live `.bib` file when available; its download link works with either source. Preserve the `tags` field to include a paper in topic filters; multiple topics may be separated by commas or semicolons. Filters and sort order are remembered in the visitor's browser. The existing BibTeX library still loads jQuery and Moment from external CDNs, so publication rendering requires access to them.

The older `.txt`, HTML, CSS, and JavaScript backup files are retained for reference; the main navigation uses `pubs.html`. The older `publications.html` URL redirects to that page.

## Changes

- Compact shared white navigation with an orange active underline, stable scrollbar space, and a consistent mobile layout.
- Nunito typography (loaded from Google Fonts), clearer spacing, and a reorganized homepage with Welcome, My Bio, and Opportunities sections, a compact profile banner with a larger portrait and contact details containing the single email link.
- Consistent research and teaching page styles, with warm, rounded research panels and inset white figure panels.
- Direct `.bib` loading with status, failure feedback, and bibliography download.
- Correct DOI links, full author lists, cleaner citation spacing, and accessible pressed states for filters.

## Verification

All 32 bibliography records parsed. Browser checks covered topic filtering, chronological sorting, restored preferences, DOI links, and navigation alignment across all four main pages at 310, 768, and 1280 pixels. No horizontal overflow was found. Local asset links were checked; parser tests covered malformed values and comments at end of file.

## Publish

Upload this site's HTML, CSS, JavaScript, assets, docs, and slides to your existing static hosting location, preserving directory structure. Nothing has been published by this update.

## Related publication versions

Entries with the same `pubgroup` field (for example, `pubgroup = {repulsive-forces}`) share one listing. Entries without this optional field remain separate. This explicit mapping avoids merging unrelated papers with similar titles and also supports related versions whose titles change. Put the same ID on each related record when adding a new version.

Every bibliography record still contributes to the total and topic counts. The present file contains 32 records arranged into 26 listings, including three preprint records. The duplicate arXiv:2003.13097 record has been removed. Shared authors appear once; differing author lists remain attached to their respective versions. Lists sort by each group's latest matching version; version rows follow the selected recency order. Topic filtering counts and shows matching versions.

Verified 32 version rows across 26 groups, 10 Tile Self-Assembly records across 7 groups, chronological group sorting, saved filters after reload, and mobile layout without horizontal overflow.

Year headings separate the listings by the latest visible version of each paper, and update with sorting and topic filters. Verified descending and ascending year order and a single-topic view with no empty year sections.

The website CV is an unchanged copy of the supplied cv_master.pdf. The DNA32 TBN paper was added from page 2, preserving author order and using the initials supplied for A. A. Yilmaz. Its DOI has since been verified against Dagstuhl Publishing and added.

## Interactive monogram

The home banner includes a small AL tile monogram. Click or activate it with the keyboard to scatter and reassemble the tiles in about 2.4 seconds. It never plays automatically. Reduced-motion preferences keep it static, and the illustration remains visible if JavaScript is unavailable. This is a decorative illustration inspired by self-assembly, not a formal tile-system simulation. The animation is implemented locally in `js/monogram.js`, with no additional dependencies.

Verified click and keyboard playback, replay, rapid repeated activation, settled tile positions, and responsive widths from 320 to 1280 pixels.

## Within-year ordering and DOI audit

Optional `sortdate = {YYYY-MM-DD}` or `sortdate = {YYYY-MM}` fields now control within-year ordering. Citation years remain authoritative. Groups use the latest visible version to choose their year and date, regardless of sort direction. Version rows also follow the selected order. Unknown within-year dates come last in either direction; equal dates use alphabetical titles as a deterministic tie-break. Dates with a different year are ignored rather than silently moving a citation between year sections.

For journal articles whose online-first year differs from the cited issue year, use the issue month. UCNC 2025 retains its conference year and September conference month, although Springer published the proceedings in January 2026. Consult PUBLICATION_SOURCES.md for the identifier audit. Verified the requested DNA32 → SWAT → ITCS ordering, its reverse, filters, persistent preferences, and all 27 DOI link formats.

## Faculty hosting fix

The live host returned HTTP 404 for `assets/mypubs.bib`. To apply the fix to an existing upload, replace `pubs.html`, `js/pubs.js`, and `js/bibtex_js.js`, preserving these paths, then refresh the page. The hotfix ZIP contains just these three files. The complete site ZIP also includes the fallback-generation script. After future bibliography edits, run `python3 prepare_site.py` and upload both `assets/mypubs.bib` and `pubs.html`.

Verified both successful bibliography requests and a deliberately missing bibliography URL: 32 publications in 26 grouped listings, working topic filters, and a browser-generated bibliography download link.

## Course pages

The `classes/` folder contains course indexes and Fall2026.html pages for 4322, 4325, 6730, and 8322. 4322 and 4325 are populated drafts; 6730 and 8322 are starter pages. See `classes/README.md` for adding semesters and source notes. Upload `classes/`, `css/classes.css`, and the updated `teaching.html` together.
