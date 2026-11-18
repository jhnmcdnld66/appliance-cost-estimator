# Appliance Running-Cost Estimator (Stage 1, private beta)

A small web app that estimates how much a home appliance costs to run per hour, day, month, and year at your electric rate.

It's plain HTML, CSS, and JavaScript: no frameworks, no build step, no backend, no cookies, no tracking. It can be added to a phone's home screen and works offline (it's a PWA).

## What each file does

| File | What it's for |
|---|---|
| `index.html` | The main page: the calculator (with a "Calculate now" button; pressing Enter works too), results table, Share on X button, explainer links, and the placeholder blocks below the results. |
| `config.js` | **The file you'll edit most.** Default electric rate, appliance presets, and the affiliate / tip / sponsor placeholders. |
| `compare.js` | The "Compare old vs new" section (refrigerators and freezers): annual kWh, cost, savings, and payback. |
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
kWh per hour  = watts ÷ 1000            (an hour of running at full power)
hours per day = percent of the day ÷ 100 × 24   (the two fields fill each other in)
kWh per day   = kWh per hour × hours per day
kWh per month = kWh per day × days per month
kWh per year  = kWh per month × 12
cost          = kWh × rate ($ per kWh)
```

## How to edit appliance presets

Open `config.js` and find the `appliances` list. Each appliance is one line like this:

```js
{ id: "space-heater", name: "Space heater (1500 W)", watts: 1500, hours: 8, days: 30, cycles: true,
  note: "Most plug-in heaters max out at 1500 W." },
```

- `id`: a unique short name (letters and dashes, no spaces).
- `name`: what appears in the dropdown.
- `watts`, `hours`, `days`: default values filled in when the appliance is picked. For appliances that cycle on and off, `hours` is the time it actually runs (e.g. a fridge: 8.4 hours = 35% of the day).
- `cycles`: `true` shows the "this appliance cycles on and off" tip.
- `note`: short hint shown under the dropdown.

**To add one:** copy a line, paste it, and change the values. Keep the comma between entries.
**To remove one:** delete its line. Keep the `custom` entry last.

**To change the default rate:** edit `defaultRate` and `defaultRateLabel`.

If you add or remove a file, add it to the list in `sw.js` and bump `CACHE_VERSION` (for example `ace-v5` to `ace-v6`). The app always loads fresh files when online, and uses the saved copy only when offline.

## Old vs new comparison

The "Compare old vs new" section uses the `compare` part of `config.js`:

- **New models:** medians from ENERGY STAR's public data for full-size certified [refrigerators](https://data.energystar.gov/Active-Specifications/ENERGY-STAR-Certified-Residential-Refrigerators/p5st-her9) and [freezers](https://data.energystar.gov/Active-Specifications/ENERGY-STAR-Certified-Residential-Freezers/8t9c-g3tn), downloaded Nov 2026. "ENERGY STAR new" is the median EnergyGuide kWh/year. "Standard new" is the median U.S. federal standard maximum for those same models.
- **Old refrigerators:** ENERGY STAR figures for a typical refrigerator of that age: about 1980 = 1,821 kWh/yr, about 1990 = 1,180, before 1993 (average) = 1,000, about 2000 = 810. Source: ENERGY STAR, [Understanding and Designing Residential Appliance Efficiency and Recycling Programs](https://www.energystar.gov/sites/default/files/asset/document/Appliance_and_Recycling_Quick_Start_Guide.pdf) (Dec 2012), Exhibit 2, citing the 2012 ENERGY STAR Data Book. There's no official figure for 2001 and newer, so that option asks for the EnergyGuide label.
- **Old freezers:** **rough estimates** (standard new × 1.8 before 2001, × 1.35 for 2001–2010, × 1.15 for 2011–2020). They are not official data, and the page labels them that way.
- Users can type the kWh/year from the yellow EnergyGuide label for their exact old and new models. This replaces the typical values.

To refresh the numbers, re-download the ENERGY STAR data and update `standardNew`, `energyStarNew`, and `n` for each type.

## Placeholders (nothing real yet)

- **Affiliate block ("Efficient models")**: `affiliate` in `config.js`. All links are `href: "#"`. Includes the disclosure "We may earn a commission from links on this page."
- **Tip link ("Buy me a coffee")**: `tip` in `config.js`, `href: "#"`.
- **Local sponsor card**: `sponsor` in `config.js`. It's `enabled: false`, so the card stays hidden. Set it to `true` and fill in `name`, `message`, and `href` to show it.
- **Share URL**: `siteUrl` in `config.js` is `https://example.com/...` until there's a real address.

All of these show up only below the results. Nothing covers the calculator, and there are no pop-ups.

## Sources for defaults

- **Default rate $0.1816/kWh and state rates**: U.S. and state average residential prices for August 2026 (preliminary) from the U.S. Energy Information Administration, *Electric Power Monthly*, [Table 5.6.A](https://www.eia.gov/electricity/monthly/xls/table_5_06_a.xlsx) (released 2026-10-23). To update them, edit `defaultRate` and `stateRates` (in cents) in `config.js`.
- **Wattages**: typical values in line with the U.S. Department of Energy's appliance energy guidance (<https://www.energy.gov/energysaver/estimating-appliance-and-home-electronic-energy-use>) and common product specs (1500 W plug-in heaters, 4500 W water heater elements, 120 V × 12 A ≈ 1.4 kW Level 1 EV charging, 240 V × 30 A ≈ 7.2 kW Level 2). Real appliances vary; the notes in `config.js` give typical ranges.
- **Default running hours** for cycling appliances (fridge 8.4 h = 35% of the day, AC/heat pump 4.8 h, and others) are rough rules of thumb, not measured data.

## TODO before launch

- [ ] Decide on hosting (and get a domain if wanted), then update `siteUrl` in `config.js`.
- [ ] Sign up for affiliate program(s) and replace the placeholder affiliate links. Keep the disclosure.
- [ ] Set up a tip page and replace the tip link.
- [ ] Update the Privacy page if any affiliate or tip services add tracking.
- [ ] Refresh the default and state rates from the latest EIA Table 5.6.A (August 2026 numbers are preliminary).
- [ ] Review the preset wattages and default running hours.
- [ ] Test "Add to Home Screen" and offline mode on a real iPhone and Android phone once hosted (needs HTTPS).
- [ ] Find a sourced replacement for the "rough estimate" old-freezer multipliers, and consider adding window AC, dehumidifiers, washers/dryers, and water heaters to the comparison.
- [ ] Optional: find a local sponsor and turn on the sponsor card.
