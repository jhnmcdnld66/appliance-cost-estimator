/*
 * config.js — the ONE file to edit for everyday changes.
 * Change the default rate, appliance presets, and the placeholder
 * affiliate / tip / sponsor settings here. No other file needs editing.
 */
window.APP_CONFIG = {
  siteName: "Appliance Cost Estimator",

  // Used in the "Share on X" post. PLACEHOLDER until a hosting decision is made.
  siteUrl: "https://example.com/appliance-cost-estimator",

  // PLACEHOLDER default electric rate in U.S. dollars per kWh.
  // Roughly the U.S. average residential price (~16-18 cents/kWh in 2024-2025,
  // U.S. EIA "Electric Power Monthly", Table 5.6.A). Update as needed.
  defaultRate: 0.17,
  defaultRateLabel: "U.S. average placeholder (about 17¢/kWh)",

  // Appliance presets.
  //   watts:  typical power draw while running
  //   hours:  default hours used per day
  //   days:   default days used per month
  //   duty:   default % of time actually drawing full power (100 = always on)
  //   cycles: true for thermostat/compressor appliances (shows the duty-cycle tip)
  //   note:   short hint shown under the picker
  appliances: [
    { id: "space-heater", name: "Space heater (1500 W)", watts: 1500, hours: 8, days: 30, duty: 100, cycles: true,
      note: "Most plug-in heaters max out at 1500 W. On a thermostat they cycle on and off." },
    { id: "window-ac", name: "Window air conditioner", watts: 900, hours: 8, days: 30, duty: 60, cycles: true,
      note: "Typical range 500–1200 W depending on size (BTU). Compressor cycles with the thermostat." },
    { id: "central-ac", name: "Central air conditioner", watts: 3500, hours: 8, days: 30, duty: 60, cycles: true,
      note: "A typical 3-ton system draws about 3000–4000 W while the compressor runs." },
    { id: "heat-pump", name: "Heat pump (whole home)", watts: 4000, hours: 8, days: 30, duty: 60, cycles: true,
      note: "Roughly 2000–5000 W while running; backup electric strips can add much more." },
    { id: "dryer", name: "Electric clothes dryer", watts: 4000, hours: 1, days: 12, duty: 100, cycles: false,
      note: "Typical 1800–5000 W. Set hours to about 1 per load." },
    { id: "washer", name: "Clothes washer (motor only)", watts: 500, hours: 1, days: 12, duty: 100, cycles: false,
      note: "Does not include the cost of heating hot water." },
    { id: "refrigerator", name: "Refrigerator", watts: 150, hours: 24, days: 30, duty: 35, cycles: true,
      note: "Runs all day but the compressor is only on part of the time. Check the yellow EnergyGuide label for kWh/year." },
    { id: "dishwasher", name: "Dishwasher", watts: 1800, hours: 1, days: 15, duty: 100, cycles: false,
      note: "About 1200–2400 W, mostly for heating water and drying." },
    { id: "oven", name: "Electric oven / range", watts: 3000, hours: 1, days: 20, duty: 50, cycles: true,
      note: "Elements cycle to hold temperature once the oven is preheated." },
    { id: "microwave", name: "Microwave", watts: 1100, hours: 0.25, days: 30, duty: 100, cycles: false,
      note: "Use the input power on the label, which is higher than the cooking power." },
    { id: "dehumidifier", name: "Dehumidifier", watts: 500, hours: 12, days: 30, duty: 70, cycles: true,
      note: "Typical 300–700 W. Cycles off when the target humidity is reached." },
    { id: "tv", name: "TV (LED, 50–65 in.)", watts: 100, hours: 5, days: 30, duty: 100, cycles: false,
      note: "Most modern LED TVs use about 50–150 W." },
    { id: "gaming-pc", name: "Gaming PC (while gaming)", watts: 400, hours: 3, days: 30, duty: 100, cycles: false,
      note: "Varies widely (250–700 W+) with the graphics card. Add your monitor separately." },
    { id: "ev-l1", name: "EV charging — Level 1 (120 V)", watts: 1400, hours: 8, days: 30, duty: 100, cycles: false,
      note: "A standard outlet at 12 A delivers about 1.4 kW." },
    { id: "ev-l2", name: "EV charging — Level 2 (240 V)", watts: 7200, hours: 2, days: 30, duty: 100, cycles: false,
      note: "A common 30 A home charger delivers about 7.2 kW. Hours = time actually charging." },
    { id: "water-heater", name: "Electric water heater (tank)", watts: 4500, hours: 3, days: 30, duty: 100, cycles: true,
      note: "Elements are usually 4500 W. Hours = time actually heating (often 2–4 per day)." },
    { id: "pool-pump", name: "Pool pump (single-speed)", watts: 1500, hours: 8, days: 30, duty: 100, cycles: false,
      note: "About 1000–2000 W for a 1–1.5 hp pump. Variable-speed pumps use far less." },
    { id: "led-bulb", name: "LED bulb (60 W equivalent)", watts: 9, hours: 5, days: 30, duty: 100, cycles: false,
      note: "Gives about the same light as a 60 W incandescent." },
    { id: "incandescent-bulb", name: "Incandescent bulb (60 W)", watts: 60, hours: 5, days: 30, duty: 100, cycles: false,
      note: "Compare with the LED preset to see the savings." },
    { id: "custom", name: "Custom (enter your own watts)", watts: 100, hours: 1, days: 30, duty: 100, cycles: false,
      note: "Find watts on the appliance label, or multiply volts × amps." }
  ],

  // OLD vs NEW comparison (refrigerators and freezers).
  //
  // "standardNew" and "energyStarNew" come from ENERGY STAR's public certified-product data
  // (downloaded 2026-11-17, full-size models only, i.e. compact = "No"):
  //   Refrigerators: https://data.energystar.gov/Active-Specifications/ENERGY-STAR-Certified-Residential-Refrigerators/p5st-her9
  //   Freezers:      https://data.energystar.gov/Active-Specifications/ENERGY-STAR-Certified-Residential-Freezers/8t9c-g3tn
  //   energyStarNew = median "annual_energy_use_kwh_yr" (from the EnergyGuide test) of certified models of that type
  //   standardNew   = median "us_federal_standard_kwh_yr" for those same models, i.e. the most a
  //                   standard (non-ENERGY STAR) new model of the same size and type may use under the federal standard
  //   n             = number of models in the median
  // ENERGY STAR says certified refrigerators are about 9% more efficient than the federal minimum
  // (https://www.energystar.gov/products/refrigerators).
  //
  // "old" values are ROUGH ESTIMATES, not measured data: the federal maximum for a new model
  // (standardNew) multiplied by oldMultipliers below, to roughly reflect older, looser efficiency
  // standards plus wear. Users should enter the kWh/year from the old unit's EnergyGuide label when they can.
  compare: {
    sourceNote: "New-model figures: medians of ENERGY STAR certified full-size models and their U.S. federal standard values (data.energystar.gov, downloaded Nov 2026). Old-model figures are rough estimates. For your exact models, use the kWh/year on the yellow EnergyGuide label.",
    oldBands: [
      { id: "pre2001", label: "Before 2001" },
      { id: "2001-2010", label: "2001–2010" },
      { id: "2011-2020", label: "2011–2020" }
    ],
    // Rough estimate: old kWh/year = standardNew × multiplier
    oldMultipliers: { "pre2001": 1.8, "2001-2010": 1.35, "2011-2020": 1.15 },
    types: [
      { id: "fridge-top", name: "Refrigerator — top freezer", standardNew: 404, energyStarNew: 363, n: 840 },
      { id: "fridge-bottom", name: "Refrigerator — bottom freezer / French door", standardNew: 623, energyStarNew: 560, n: 1706 },
      { id: "fridge-side", name: "Refrigerator — side-by-side", standardNew: 696, energyStarNew: 642, n: 128 },
      { id: "fridge-only", name: "Refrigerator — no freezer / single door", standardNew: 334, energyStarNew: 288, n: 302 },
      { id: "freezer-upright", name: "Freezer — upright", standardNew: 494, energyStarNew: 438, n: 509 },
      { id: "freezer-chest", name: "Freezer — chest", standardNew: 244, energyStarNew: 218, n: 9 }
    ]
  },

  // PLACEHOLDER affiliate block. Replace href "#" with real links before launch.
  affiliate: {
    enabled: true,
    heading: "Efficient models",
    disclosure: "We may earn a commission from links on this page.",
    links: [
      { label: "Energy-efficient space heaters (placeholder)", href: "#" },
      { label: "ENERGY STAR window air conditioners (placeholder)", href: "#" },
      { label: "Plug-in electricity usage meters (placeholder)", href: "#" }
    ]
  },

  // PLACEHOLDER tip link. Replace "#" with a real tip page before launch.
  tip: {
    enabled: true,
    label: "Buy me a coffee (placeholder)",
    href: "#"
  },

  // Future local sponsor slot. OFF by default — the card stays hidden.
  sponsor: {
    enabled: false,
    name: "",
    message: "",
    href: "#"
  }
};
