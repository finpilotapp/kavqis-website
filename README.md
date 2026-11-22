# KAVQIS — Financial Intelligence (website)

The official website for **KAVQIS**, a Financial Decision Toolkit mobile app that helps people understand everyday financial decisions: loans, investments, salary and tax, savings, smart everyday calculators and a daily money dashboard.

## Pages

| URL | File | Purpose |
| --- | --- | --- |
| `/` | `public/index.html` | Introduces KAVQIS, the six modules, how it works, a live sample loan estimator and principles |
| `/features` | `public/features.html` | Detailed look at Loans, Investments, Salary & Tax, Savings, Smart Tools and the Daily Money Dashboard |
| `/about` | `public/about.html` | Vision, values, and what KAVQIS is and isn't |
| `/contact` | `public/contact.html` | Email (hellokavqis@gmail.com) and a contact form handled by Netlify Forms |
| `/privacy-policy` | `public/privacy-policy.html` | Editable privacy policy |
| `/disclaimer` | `public/disclaimer.html` | Estimates-only / no professional advice disclaimer |
| `/thank-you` | `public/thank-you.html` | Shown after the contact form is sent |
| (any missing URL) | `public/404.html` | Custom not-found page |

## Technology

- Plain HTML, CSS and vanilla JavaScript. No framework, no build step.
- Hosted on Netlify. `netlify.toml` publishes the `public/` folder directly.
- Netlify Forms handles the contact form. Submissions appear in the Netlify dashboard under Forms.
- Fonts: Instrument Serif (headings), Hanken Grotesk (body) and IBM Plex Mono (figures), loaded from Google Fonts.

## Common edits

- **Google Play link:** when the app is published, open `public/assets/js/main.js` and set `PLAY_STORE_URL` at the top of the file. Every "Coming soon on Google Play" badge then becomes a live "Get it on Google Play" link, and the "in development" notes are hidden.
- **Privacy Policy / Disclaimer:** edit the text inside each `<section class="legal-section">` in `public/privacy-policy.html` or `public/disclaimer.html`, and update the "Last updated" date. Instructions are in an HTML comment at the top of each document.
- **Colours and type:** all design tokens are CSS variables at the top of `public/assets/css/styles.css`.
- **Custom domain:** if you add one, update the domain in the `<link rel="canonical">` / `og:url` tags of each page, in `public/sitemap.xml` and in `public/robots.txt`.

## Running locally

There's nothing to build. Run any static file server from the project root, for example:

```bash
netlify dev        # Netlify CLI; also emulates redirects and headers
# or
npx serve public
```

Clean URLs such as `/features` resolve to `features.html` on Netlify and with `netlify dev`.

## Deploying

Push to the connected repository, or drag the `public/` folder into Netlify. No build command is required.
