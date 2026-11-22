# AGENTS.md — KAVQIS website

## What this is
A static marketing and information site for KAVQIS, a Financial Decision Toolkit mobile app. The app is **not yet released**. Don't add copy claiming it is available on Google Play, and don't add testimonials, ratings, statistics, download counts, advertising or subscription/pricing claims. The owner asked for this explicitly.

## Architecture
- No framework and no build step. `netlify.toml` publishes `public/` as-is (`command = ""`).
- `public/*.html`: one file per page. Netlify pretty URLs serve `features.html` at `/features`, so internal links use extensionless paths (`/features`, `/privacy-policy`).
- `public/assets/css/styles.css`: the whole design system. Tokens (navy / gold / ivory palette, fonts, radii, shadows) are CSS variables in `:root`. Sections are grouped with comment headers.
- `public/assets/js/main.js`: all behaviour. It covers the mobile nav, scroll reveals, count-up numbers, the home-page loan estimator, sub-nav/TOC scroll-spy, copy-to-clipboard, contact-form validation and the Google Play link switch.
- `public/sitemap.xml`, `public/robots.txt`, `public/assets/favicon.svg`.

## Conventions and non-obvious decisions
- **Shared header/footer are duplicated in every HTML file.** When changing nav or footer links, update all eight pages. The current page's nav link carries `aria-current="page"`.
- **Google Play placeholder:** badges are `<a class="play-badge is-soon" data-play-link>` with no `href`. Setting `PLAY_STORE_URL` in `main.js` activates them all, and elements with `data-play-note` are hidden at the same time. Keep using these attributes for any new store badge.
- **Animations:** `.load-in` (with `--i` stagger) runs on page load. `.reveal` (with `--d` stagger) runs on scroll and is only hidden when `<html>` has the `js` class, which an inline head script sets, so content stays visible without JS. Chart fills are also scoped under `.js`. `prefers-reduced-motion` disables motion.
- **Figures in mockups are illustrative samples.** They have no currency symbol on purpose, because the audience's country isn't fixed. Keep the sample maths internally consistent (for example, spent + left = daily plan).
- **Contact form:** Netlify Forms (`name="contact"`, honeypot `bot-field`, `action="/thank-you"`). Form detection is enabled through `.netlify/features/netlify-forms`. If you rename fields, keep `name` as the first text input and `message` as the first textarea, because the Netlify submission summary depends on them.
- **Legal pages** use `.legal` / `.legal-toc` / `.legal-section`. Each TOC link must match a section `id`.
- **Typography:** Instrument Serif for display (`.display`, with `em` in gold italic), Hanken Grotesk for body, IBM Plex Mono for labels and figures (`.mono`).
- Canonical URLs point to `https://kavqis-website.netlify.app`. Update them if a custom domain is added.
