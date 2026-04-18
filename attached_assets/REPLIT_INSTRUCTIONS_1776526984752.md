# Instructions for Replit: Building ecologicalcommons.org

## What this is

This is the top-level public-facing website for Ecological Commons. It sits above the existing data layer at `data.ecologicalcommons.org` (the FERNS implementation) and describes the larger idea that the data layer serves.

This is a content-first static site. Six markdown files describe the full set of pages. No dynamic features, no database, no login, no API. The site reads and links to `data.ecologicalcommons.org` but does not depend on it programmatically.

## The files

Six markdown files, all in this folder:

1. **index.md** — the front page
2. **built.md** — "What's Built," summarizing the data layer and links to developer resources
3. **idea.md** — "The Idea," a long page with four sections describing what an ecological commons is and what it could become
4. **information-frontier.md** — a sub-page of the Idea page, focused on commons governance and information science foundations
5. **computing-frontier.md** — a sub-page of the Idea page, focused on computing research and software development
6. **worksheet.md** — a standalone page inviting readers to imagine what they could build using the elements the commons could hold

## Site structure and URLs

The intended URL structure:

- `ecologicalcommons.org/` → renders `index.md`
- `ecologicalcommons.org/built` → renders `built.md`
- `ecologicalcommons.org/idea` → renders `idea.md`
- `ecologicalcommons.org/idea/information-frontier` → renders `information-frontier.md`
- `ecologicalcommons.org/idea/computing-frontier` → renders `computing-frontier.md`
- `ecologicalcommons.org/worksheet` → renders `worksheet.md`

Existing internal links in the markdown already use these paths (e.g., `/idea/information-frontier`). Keep the structure as specified.

## Navigation

A simple top navigation should appear on every page. Minimum items:

- Home (links to `/`)
- The Idea (links to `/idea`)
- What's Built (links to `/built`)
- Worksheet (links to `/worksheet`)

The Idea page's two sub-pages (information frontier, computing frontier) are already linked inline from within the Idea page content. They do not need to appear in the top navigation.

## Styling and visual design

Not yet determined. For the first deploy, use clean, readable defaults:

- Serif or high-quality sans-serif body font at a comfortable reading size (roughly 18px on desktop, responsive on mobile)
- Generous line height (1.6 or similar)
- Comfortable maximum content width (roughly 700px for reading)
- Quiet color palette, high contrast for readability
- No decorative imagery, no hero banners, no stock photos
- Clear heading hierarchy (the markdown uses `#`, `##`, `###`)
- Italic text for emphasis where it appears in the markdown
- Bold text for emphasis where it appears in the markdown
- Em-dashes preserved as rendered

The worksheet page may benefit from slightly distinct visual treatment — it is written to look like a classroom handout. A simple way to handle this: a horizontal rule at the top (already in the markdown as `---`), the header block at the top set apart visually, and slightly denser typography for the elements list. Do not make it cutesy or use chalkboard fonts or school imagery.

## External links in the content

The markdown contains links to:

- `https://data.ecologicalcommons.org/` (the data layer homepage)
- `https://data.ecologicalcommons.org/api/v1/sources` (the live source registry)
- `https://data.ecologicalcommons.org/api/openapi.json` (OpenAPI spec in JSON)
- `https://data.ecologicalcommons.org/api/openapi.yaml` (OpenAPI spec in YAML)
- `https://s2c-species.replit.app` (the proof-of-concept app)
- A Google Drive link to a PowerPoint presentation

Render all of these as standard hyperlinks. No special handling required.

## Contact

The email `seeds2community@gmail.com` appears on the front page and the worksheet page. Render as a `mailto:` link.

## Mobile responsiveness

The site should read well on a phone. Content width should collapse gracefully on smaller screens. Font size should remain comfortable. No horizontal scroll.

## What NOT to build (yet)

- No user accounts or login
- No comments or submission forms
- No embedded widgets from the data layer (the data layer has its own explorers at its own URL)
- No analytics beyond basic server logs unless specifically discussed
- No visual worksheet interactivity (blanks to fill in, etc.) — the worksheet is text-only; readers do the thinking on their own

## Future additions (not for this pass)

These may come later, but are not part of this build:

- An "About" page
- A visual rendering of the live source registry on the What's Built page
- Subdomains for regional instances (e.g., a Southeast Michigan subdomain)
- An MCP interface for the data layer

## Priorities for this build

1. **Content renders correctly.** Markdown formatting, headings, italics, bold, em-dashes, internal and external links.
2. **Navigation works.** Top nav is present on every page; inline links work.
3. **Reads well on mobile and desktop.**
4. **Clean, quiet, readable visual style.** Default-good rather than designed-in-detail.
5. **Deploy to ecologicalcommons.org.**

Ask if anything is unclear before making assumptions that will be hard to undo.
