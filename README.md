# Makan Wheel

Spin a wheel to decide breakfast, lunch and dinner. Every day's meals are logged.

## Structure

```
MakanWheel/
├── index.html      Page layout (3 screens + bottom nav + result popup)
├── css/
│   └── style.css   All styling, light + dark mode
└── js/
    ├── utils.js    Helpers: dates, escaping, toast messages
    ├── store.js    Data layer: foods + meal records (localStorage for now)
    ├── wheel.js    Canvas wheel drawing, spin animation, result popup
    └── app.js      Navigation and rendering of Spin / Foods / History screens
```

Scripts load in that order (utils → store → wheel → app) at the bottom of index.html.

## Run it

Open `index.html` in a browser, or in VS Code install the **Live Server** extension,
right-click `index.html` → **Open with Live Server** (auto-reloads on save).

## Database later

All reads/writes go through `Store` in `js/store.js`. To use SQLite or an API,
only that file needs to change.
