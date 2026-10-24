# Makan Wheel

Spin a wheel to decide breakfast, lunch and dinner. Every day's meals are logged.

## Structure

```
MakanWheel/
├── index.html      Page layout (3 screens + bottom nav + result popup)
├── manifest.webmanifest  App name, icons, colours for "Install app"
├── sw.js           Service worker: caches files so the app works offline
├── icons/          App icons (SVG + 192/512 PNG)
├── css/
│   └── style.css   All styling, light + dark mode
└── js/
    ├── utils.js    Helpers: dates, escaping, toast messages
    ├── i18n.js     Translations (English, Malay, Chinese) + t() helper
    ├── store.js    Data layer: foods + meal records (localStorage for now)
    ├── wheel.js    Canvas wheel drawing, spin animation, result popup
    └── app.js      Navigation and rendering of Spin / Foods / History screens
```

Scripts load in that order (utils → i18n → store → wheel → app) at the bottom of index.html.

## Themes and languages

The top bar has a language picker (English, Bahasa Melayu, 中文) and a theme picker
(Original, Soft white, Colourful, Dark, Warm). Both are saved per device.
Theme colours live in `css/style.css` under `:root[data-theme="..."]`.
To add or change text, edit all three languages in `js/i18n.js`.

## Run it

Open `index.html` in a browser, or in VS Code install the **Live Server** extension,
right-click `index.html` → **Open with Live Server** (auto-reloads on save).

## Install + offline (PWA)

Install and offline only work when the app is served over http(s), not from a
double-clicked `index.html`. Live Server works for testing; to share it, publish
with GitHub Pages (repo **Settings → Pages → Deploy from branch → main / root**).

Users then open the link and choose **Install app** (Chrome/Edge/Android) or
**Share → Add to Home Screen** (iPhone). After the first visit it works offline.

**When you change any file:** bump `VERSION` in `sw.js` (e.g. `v1` → `v2`), or
users will keep seeing the old cached version.

## User data

Each user's foods and meal log are saved only on their own device (localStorage).
History → **Your data** has **Export backup** (downloads a readable `.txt` file
that opens in Notepad or a phone notes app) and **Import backup** (replaces this
device's data with a backup file; older `.json` backups also work).

```
== FOODS ==
Nasi lemak | Breakfast, Lunch
== MEAL LOG ==
2026-10-24 | Lunch | Laksa
```

## Database later

All reads/writes go through `Store` in `js/store.js`. To use SQLite or an API,
only that file needs to change.
