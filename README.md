# Appliance Running-Cost Estimator (Stage 1, private beta)

A small web app that estimates how much a home appliance costs to run per hour, day, month, and year at your electric rate.

It's plain HTML, CSS, and JavaScript: no frameworks, no build step, no backend, no cookies, no tracking. It can be added to a phone's home screen and works offline (it's a PWA).

## What each file does

| File | What it's for |
|---|---|
| `index.html` | The main page: the calculator (with a "Calculate now" button; pressing Enter works too), results table, Share on X button, explainer links, and the placeholder blocks below the results. |
| `config.js` | **The file you'll edit most.** Default electric rate, appliance presets, and the affiliate / tip / sponsor placeholders. |
| `app.js` | The calculator logic. Reads `config.js`, does the math, builds the share link, and shows or hides the placeholder blocks. |
| `styles.css` | All the styling (mobile-first). |
| `manifest.webmanifest` | Tells phones the app's name, colors, and icon for "Add to Home Screen". |
| `sw.js` | Service worker. Saves every file in the browser so the app works offline. |
| `icons/` | App icons (`icon.svg`, `icon-192.png`, `icon-512.png`). |
| `pages/` | Explainer articles (space heater cost, finding your rate, watts vs kWh) plus About, Privacy, and Disclaimer. |

## How to open it on your computer

**Option 1, quickest:** double-click `index.html` to open it in your browser. The calculator works, but offline/PWA mode won't, because browsers only allow service workers on a web server.

If you downloaded a ZIP, **extract (unzip) the whole folder first**. Windows lets you open `index.html` while it's still inside the ZIP, but then the browser can't find `config.js` and `app.js`, and the appliance list stays empty. The page shows a message when this happens.

**Option 2, full PWA test:** in a terminal, go to this folder and run:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000> in your browser. Press `Ctrl+C` in the terminal to stop it.

To try it on your phone, the phone needs to reach the computer over HTTPS (or `localhost`), so a real phone test will come after the hosting decision.

## How the math works

```
kWh per hour  = watts ÷ 1000 × (percent of time running ÷ 100)
kWh per day   = kWh per hour × hours per day
kWh per month = kWh per day × days per month
kWh per year  = kWh per month × 12
cost          = kWh × rate ($ per kWh)
```

## How to edit appliance presets

Open `config.js` and find the `appliances` list. Each appliance is one line like this:

```js
{ id: "space-heater", name: "Space heater (1500 W)", watts: 1500, hours: 8, days: 30, duty: 100, cycles: true,
  note: "Most plug-in heaters max out at 1500 W." },
```

- `id`: a unique short name (letters and dashes, no spaces).
- `name`: what appears in the dropdown.
- `watts`, `hours`, `days`: default values filled in when the appliance is picked.
- `duty`: default "percent of time running" (100 = always on while in use).
- `cycles`: `true` shows the "this appliance cycles on and off" tip.
- `note`: short hint shown under the dropdown.

**To add one:** copy a line, paste it, and change the values. Keep the comma between entries.
**To remove one:** delete its line. Keep the `custom` entry last.

**To change the default rate:** edit `defaultRate` and `defaultRateLabel`.

After changing any file, open `sw.js` and bump `CACHE_VERSION` (for example `ace-v1` to `ace-v2`). Otherwise phones that already installed the app keep the old version.

## Placeholders (nothing real yet)

- **Affiliate block ("Efficient models")**: `affiliate` in `config.js`. All links are `href: "#"`. Includes the disclosure "We may earn a commission from links on this page."
- **Tip link ("Buy me a coffee")**: `tip` in `config.js`, `href: "#"`.
- **Local sponsor card**: `sponsor` in `config.js`. It's `enabled: false`, so the card stays hidden. Set it to `true` and fill in `name`, `message`, and `href` to show it.
- **Share URL**: `siteUrl` in `config.js` is `https://example.com/...` until there's a real address.

All of these show up only below the results. Nothing covers the calculator, and there are no pop-ups.

## Sources for defaults

- **Default rate $0.17/kWh**: placeholder, roughly the U.S. average residential electricity price (about 16 to 18¢/kWh in 2024 to 2025) from the U.S. Energy Information Administration, *Electric Power Monthly*, Table 5.6.A. Check the current number at <https://www.eia.gov/electricity/monthly/>.
- **Wattages**: typical values in line with the U.S. Department of Energy's appliance energy guidance (<https://www.energy.gov/energysaver/estimating-appliance-and-home-electronic-energy-use>) and common product specs (1500 W plug-in heaters, 4500 W water heater elements, 120 V × 12 A ≈ 1.4 kW Level 1 EV charging, 240 V × 30 A ≈ 7.2 kW Level 2). Real appliances vary; the notes in `config.js` give typical ranges.
- **Default "percent of time running"** values for cycling appliances (fridge 35%, AC/heat pump 60%, and others) are rough rules of thumb, not measured data.

## TODO before launch

- [ ] Decide on hosting (and get a domain if wanted), then update `siteUrl` in `config.js`.
- [ ] Sign up for affiliate program(s) and replace the placeholder affiliate links. Keep the disclosure.
- [ ] Set up a tip page and replace the tip link.
- [ ] Update the Privacy page if any affiliate or tip services add tracking.
- [ ] Double-check the default rate against the latest EIA data.
- [ ] Review the preset wattages and duty-cycle defaults.
- [ ] Test "Add to Home Screen" and offline mode on a real iPhone and Android phone once hosted (needs HTTPS).
- [ ] Optional: find a local sponsor and turn on the sponsor card.
