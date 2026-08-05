# JoziNites_Links — Linktree-style links

I added a Linktree-style, data-driven links system to the repo and updated the frontend to render the link buttons while preserving your existing Canva-inspired design.

What I added
- links.json — centralized place to add/reorder links and configure profile text
- app.js — client-side script that loads links.json and renders buttons
- assets/avatar.svg — generic avatar placeholder
- assets/icons/* — small SVG icons for Twitter, Instagram, Fetlife, OnlyFans, and a generic link icon
- updated index.html and styles.css to include the linktree section and styles

How to edit links
- Edit `links.json` in the repository (Add file → Edit or use the web editor). The `links` array is ordered; change the order to reorder buttons.
- Each link object supports: title, url, subtitle (optional), platform (one of twitter, instagram, fetlife, onlyfans, generic).
- If platform is omitted or unknown, the generic icon is used.

Example link object
{
  "title": "Latest Events",
  "url": "https://example.com/events",
  "subtitle": "Shows & parties",
  "platform": "generic"
}

Notes
- The site fetches `links.json` at runtime in the browser. For GitHub Pages this works without extra configuration.
- To replace placeholder images, upload your images to `assets/` and update paths in `links.json` or `index.html`.

If you want, I can:
- Move this into a separate branch instead of main (non-destructive).
- Add social preview meta tags, analytics, or scheduling features.
- Upload your Canva assets when you provide them.
