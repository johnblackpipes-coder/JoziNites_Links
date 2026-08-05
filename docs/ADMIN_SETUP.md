# Admin setup for JoziNites

This document explains how to enable the Admin UI and serverless update function.

Required environment variables (set these in your Vercel project settings):
- GITHUB_TOKEN — a GitHub Personal Access Token with `repo` (contents) permission.
- ADMIN_SECRET — a strong random string used to authenticate the admin UI requests.

Deployment notes:
- admin.html is a very small frontend that posts the new `links.json` contents to `/api/update-links`.
- The serverless function uses the GITHUB_TOKEN to fetch the current `links.json` and update it in a commit to `main`.
- No secrets are stored in the repository. Set them in the Vercel dashboard under Project → Settings → Environment Variables.

Security notes:
- ADMIN_SECRET must be kept secret. Anyone with this value can update links.json in the repo.
- Consider adding IP allowlisting / more advanced auth if you need higher security.
