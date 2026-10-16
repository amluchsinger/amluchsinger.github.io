# Course pages

Each course has an index and separate semester files:

```
classes/
  index.html
  4322/index.html
  4322/Fall2026.html
  4325/index.html
  4325/Fall2026.html
  6730/index.html
  6730/Fall2026.html
  8322/index.html
  8322/Fall2026.html
```

4322 and 4325 are populated from Austin's Google Sites pages as viewed September 25, 2026. 6730 and 8322 are explicitly labeled starter pages, not confirmed Fall 2026 offerings. Shared styling lives in `../css/classes.css`; the main site's styling is also used. All course content is plain HTML, with no build process or JavaScript required.

## Add a semester

1. Copy a course's `Fall2026.html` to (for example) `Spring2027.html` in the same folder.
2. Update its browser title, semester heading, section/CRN, syllabus, class times, final exam, office hours, assignments, and resource links. Remove old deadlines or replace them with “To be announced.” Update the footer year as needed.
3. Add a link to the new file in that course's `index.html`, leaving previous semesters linked.
4. Update `classes/index.html` and the main `teaching.html` to point to the current semester.
5. Upload the changed files, preserving capitalization and folder structure.

Relative links work both locally and under `/austin.luchsinger/` on the faculty server. For semester-specific uploaded documents, create a directory such as `4322/materials/Fall2026/` and use links like `materials/Fall2026/problem-set-1.pdf` from that semester page.

## Source notes and review

- 4325: https://sites.google.com/utexas.edu/austinluchsinger/teaching/csci-4325
- 4322: https://sites.google.com/utexas.edu/austinluchsinger/teaching/csci-4322
- Meeting times, rooms, section identifiers, office hours, final exam (4325), and posted assignment deadlines (4322) were carried over. Review these drafts before uploading.
- The 4325 schedule is now a local HTML table, transcribed from the Fall 2026 schedule screenshot. It no longer updates from Google Sheets.
- Slides, assignment PDFs, official syllabi, and other reading materials remain at their original external locations. The site now hosts the course pages, not copies of those documents. Mutable external documents will not constitute frozen semester archives unless you separately save and host semester-specific copies.
- Two expired signed ScienceDirect PDF URLs were replaced by stable publisher article links using the article identifiers in those URLs.
- The original MIT notes label had a year/author mismatch with its URL; the draft preserves the URL without repeating that attribution.

## Update the 4325 schedule

Open `4325/Fall2026.html` and search for `SCHEDULE START`. Each `<tr>` inside `<tbody>` represents one week: the `<th>` is the date range, followed by Monday and Wednesday `<td>` cells. Edit those cells, save, and upload the HTML file. Use `<strong>` for exams and `<span class="schedule-break">` for no-class days if desired. When duplicating a semester, update the caption and every date/topic row. The table is static and will not change when the Google Sheet changes.
