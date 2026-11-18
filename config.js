/*
 * config.js — the ONE file to edit for everyday changes.
 * Change the default rate, appliance presets, and the placeholder
 * affiliate / tip / sponsor settings here. No other file needs editing.
 */
window.APP_CONFIG = {
  siteName: "Appliance Cost Estimator",

  // Used in the "Share on X" post. PLACEHOLDER until a hosting decision is made.
  siteUrl: "https://example.com/appliance-cost-estimator",

  // Default electric rate in U.S. dollars per kWh: U.S. average residential price, August 2026 (preliminary).
  // Source: U.S. EIA, Electric Power Monthly, Table 5.6.A (released 2026-10-23)
  // https://www.eia.gov/electricity/monthly/xls/table_5_06_a.xlsx
  defaultRate: 0.1816,
  defaultRateLabel: "U.S. average residential rate, Aug 2026 (EIA, preliminary)",

  // State average residential rates in CENTS per kWh, Aug 2026 (preliminary), same EIA table.
  // Shown in the "Pick your state" dropdown. These are state averages, not any one utility's rate.
  stateRateLabel: "state average residential rate, Aug 2026 (EIA, preliminary)",
  // Text of the "i" (Where do these numbers come from?) popup. Plain text only.
  // {month} is replaced with dataMonth. Update dataMonth when you refresh the rates.
  sources: {
    title: "Where do these numbers come from?",
    dataMonth: "August 2026 (preliminary)",
    items: [
      "Electric rates: U.S. Energy Information Administration (EIA), Electric Power Monthly, Table 5.6.A, average residential price by state. Published monthly, about two months behind. Currently using {month}.",
      "Old refrigerator use: ENERGY STAR refrigerator guide (2012).",
      "New refrigerator and freezer use: ENERGY STAR certified product list (median of certified models).",
      "Formula: watts x hours per day / 1000 x rate = cost per day.",
      "Estimates only; check your bill for your exact rate."
    ]
  },
  // "Compare states" section: the two states shown at first (codes from stateRates below)
  stateCompare: {
    defaults: ["NY", "NV"],
    label: "State averages, EIA, August 2026 (preliminary)."
  },
  stateRates: [
    { code: "US", name: "U.S. average", cents: 18.16 },
    { code: "AL", name: "Alabama", cents: 16.33 },
    { code: "AK", name: "Alaska", cents: 29.41 },
    { code: "AZ", name: "Arizona", cents: 15.05 },
    { code: "AR", name: "Arkansas", cents: 14.37 },
    { code: "CA", name: "California", cents: 29.75 },
    { code: "CO", name: "Colorado", cents: 17.17 },
    { code: "CT", name: "Connecticut", cents: 24.51 },
    { code: "DE", name: "Delaware", cents: 18.7 },
    { code: "DC", name: "District of Columbia", cents: 25.98 },
    { code: "FL", name: "Florida", cents: 14.99 },
    { code: "GA", name: "Georgia", cents: 15.9 },
    { code: "HI", name: "Hawaii", cents: 47.18 },
    { code: "ID", name: "Idaho", cents: 13.37 },
    { code: "IL", name: "Illinois", cents: 19.32 },
    { code: "IN", name: "Indiana", cents: 17.02 },
    { code: "IA", name: "Iowa", cents: 17.06 },
    { code: "KS", name: "Kansas", cents: 15.47 },
    { code: "KY", name: "Kentucky", cents: 13.8 },
    { code: "LA", name: "Louisiana", cents: 12.87 },
    { code: "ME", name: "Maine", cents: 32.11 },
    { code: "MD", name: "Maryland", cents: 21.4 },
    { code: "MA", name: "Massachusetts", cents: 30.48 },
    { code: "MI", name: "Michigan", cents: 22.99 },
    { code: "MN", name: "Minnesota", cents: 17.2 },
    { code: "MS", name: "Mississippi", cents: 14.43 },
    { code: "MO", name: "Missouri", cents: 16.02 },
    { code: "MT", name: "Montana", cents: 15.57 },
    { code: "NE", name: "Nebraska", cents: 13.54 },
    { code: "NV", name: "Nevada", cents: 12.72 },
    { code: "NH", name: "New Hampshire", cents: 27.64 },
    { code: "NJ", name: "New Jersey", cents: 24.61 },
    { code: "NM", name: "New Mexico", cents: 16.51 },
    { code: "NY", name: "New York", cents: 28.65 },
    { code: "NC", name: "North Carolina", cents: 14.95 },
    { code: "ND", name: "North Dakota", cents: 13.31 },
    { code: "OH", name: "Ohio", cents: 19.38 },
    { code: "OK", name: "Oklahoma", cents: 14.82 },
    { code: "OR", name: "Oregon", cents: 15.92 },
    { code: "PA", name: "Pennsylvania", cents: 21.77 },
    { code: "RI", name: "Rhode Island", cents: 28.18 },
    { code: "SC", name: "South Carolina", cents: 15.76 },
    { code: "SD", name: "South Dakota", cents: 15.15 },
    { code: "TN", name: "Tennessee", cents: 13.42 },
    { code: "TX", name: "Texas", cents: 15.91 },
    { code: "UT", name: "Utah", cents: 13.31 },
    { code: "VT", name: "Vermont", cents: 23.84 },
    { code: "VA", name: "Virginia", cents: 17.64 },
    { code: "WA", name: "Washington", cents: 14.63 },
    { code: "WV", name: "West Virginia", cents: 16.31 },
    { code: "WI", name: "Wisconsin", cents: 19.41 },
    { code: "WY", name: "Wyoming", cents: 14.43 }
  ],

  // Appliance presets.
  //   watts:  typical power draw while running
  //   hours:  default hours per day it actually runs at full power
  //   days:   default days used per month
  //   cycles: true for thermostat/compressor appliances (shows the "cycles on and off" tip)
  //   note:   short hint shown under the picker
  appliances: [
    { id: "space-heater", name: "Space heater (1500 W)", watts: 1500, hours: 8, days: 30, cycles: true,
      note: "Most plug-in heaters max out at 1500 W. On a thermostat they cycle on and off." },
    { id: "window-ac", name: "Window air conditioner", watts: 900, hours: 4.8, days: 30, cycles: true,
      note: "Typical range 500–1200 W depending on size (BTU). Compressor cycles with the thermostat." },
    { id: "central-ac", name: "Central air conditioner", watts: 3500, hours: 4.8, days: 30, cycles: true,
      note: "A typical 3-ton system draws about 3000–4000 W while the compressor runs." },
    { id: "heat-pump", name: "Heat pump (whole home)", watts: 4000, hours: 4.8, days: 30, cycles: true,
      note: "Roughly 2000–5000 W while running; backup electric strips can add much more." },
    { id: "dryer", name: "Electric clothes dryer", watts: 4000, hours: 1, days: 12, cycles: false,
      note: "Typical 1800–5000 W. Set hours to about 1 per load." },
    { id: "washer", name: "Clothes washer (motor only)", watts: 500, hours: 1, days: 12, cycles: false,
      note: "Does not include the cost of heating hot water." },
    { id: "refrigerator", name: "Refrigerator", watts: 150, hours: 8.4, days: 30, cycles: true,
      note: "Runs all day but the compressor is only on part of the time. Check the yellow EnergyGuide label for kWh/year." },
    { id: "dishwasher", name: "Dishwasher", watts: 1800, hours: 1, days: 15, cycles: false,
      note: "About 1200–2400 W, mostly for heating water and drying." },
    { id: "oven", name: "Electric oven / range", watts: 3000, hours: 0.5, days: 20, cycles: true,
      note: "Elements cycle to hold temperature once the oven is preheated." },
    { id: "microwave", name: "Microwave", watts: 1100, hours: 0.25, days: 30, cycles: false,
      note: "Use the input power on the label, which is higher than the cooking power." },
    { id: "dehumidifier", name: "Dehumidifier", watts: 500, hours: 8.4, days: 30, cycles: true,
      note: "Typical 300–700 W. Cycles off when the target humidity is reached." },
    { id: "tv", name: "TV (LED, 50–65 in.)", watts: 100, hours: 5, days: 30, cycles: false,
      note: "Most modern LED TVs use about 50–150 W." },
    { id: "gaming-pc", name: "Gaming PC (while gaming)", watts: 400, hours: 3, days: 30, cycles: false,
      note: "Varies widely (250–700 W+) with the graphics card. Add your monitor separately." },
    { id: "ev-l1", name: "EV charging — Level 1 (120 V)", watts: 1400, hours: 8, days: 30, cycles: false,
      note: "A standard outlet at 12 A delivers about 1.4 kW." },
    { id: "ev-l2", name: "EV charging — Level 2 (240 V)", watts: 7200, hours: 2, days: 30, cycles: false,
      note: "A common 30 A home charger delivers about 7.2 kW. Hours = time actually charging." },
    { id: "water-heater", name: "Electric water heater (tank)", watts: 4500, hours: 3, days: 30, cycles: true,
      note: "Elements are usually 4500 W. Hours = time actually heating (often 2–4 per day)." },
    { id: "pool-pump", name: "Pool pump (single-speed)", watts: 1500, hours: 8, days: 30, cycles: false,
      note: "About 1000–2000 W for a 1–1.5 hp pump. Variable-speed pumps use far less." },
    { id: "led-bulb", name: "LED bulb (60 W equivalent)", watts: 9, hours: 5, days: 30, cycles: false,
      note: "Gives about the same light as a 60 W incandescent." },
    { id: "incandescent-bulb", name: "Incandescent bulb (60 W)", watts: 60, hours: 5, days: 30, cycles: false,
      note: "Compare with the LED preset to see the savings." },
    { id: "custom", name: "Custom (enter your own watts)", watts: 100, hours: 1, days: 30, cycles: false,
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
  // OLD refrigerators (kwh): ENERGY STAR, "Understanding and Designing Residential Appliance
  // Efficiency and Recycling Programs" (Dec 2012), Exhibit 2 (citing the 2012 ENERGY STAR Data Book),
  // plus the same guide's statement that refrigerators made before 1993 averaged 1,000 kWh/year.
  // These are for a typical refrigerator of that age (all styles), not a specific type.
  // https://www.energystar.gov/sites/default/files/asset/document/Appliance_and_Recycling_Quick_Start_Guide.pdf
  // There is no official figure for 2001 and newer, so that option asks for the EnergyGuide label.
  //
  // OLD freezers (multiplier): ROUGH ESTIMATES, not official data: standardNew × multiplier.
  compare: {
    newSourceNote: "New models: medians of ENERGY STAR certified full-size models and their U.S. federal standard values (data.energystar.gov, downloaded Nov 2026).",
    oldSourceNote: {
      fridge: 'Old refrigerators: typical figures for that age from ENERGY STAR, <a href="https://www.energystar.gov/sites/default/files/asset/document/Appliance_and_Recycling_Quick_Start_Guide.pdf">Understanding and Designing Residential Appliance Efficiency and Recycling Programs</a> (Dec 2012), Exhibit 2, citing the 2012 ENERGY STAR Data Book.',
      freezer: "Old freezers: rough estimates (no official figure used)."
    },
    labelNote: "For your exact models, use the kWh/year on the yellow EnergyGuide label.",
    oldBands: {
      fridge: [
        { id: "1980", label: "1980s or older (about a 1980 model)", kwh: 1821, tag: "ENERGY STAR estimate (2012 data)" },
        { id: "1990", label: "About 1990", kwh: 1180, tag: "ENERGY STAR estimate (2012 data)" },
        { id: "pre1993", label: "Before 1993 (average)", kwh: 1000, tag: "ENERGY STAR estimate (2012 data)" },
        { id: "2000", label: "About 2000", kwh: 810, tag: "ENERGY STAR estimate (2012 data)" },
        { id: "2001plus", label: "2001 or newer (enter its label kWh below)", needsLabel: true }
      ],
      freezer: [
        { id: "pre2001", label: "Before 2001", multiplier: 1.8, tag: "rough estimate" },
        { id: "2001-2010", label: "2001–2010", multiplier: 1.35, tag: "rough estimate" },
        { id: "2011-2020", label: "2011–2020", multiplier: 1.15, tag: "rough estimate" }
      ]
    },
    types: [
      { id: "fridge-top", group: "fridge", name: "Refrigerator — top freezer", standardNew: 404, energyStarNew: 363, n: 840 },
      { id: "fridge-bottom", group: "fridge", name: "Refrigerator — bottom freezer / French door", standardNew: 623, energyStarNew: 560, n: 1706 },
      { id: "fridge-side", group: "fridge", name: "Refrigerator — side-by-side", standardNew: 696, energyStarNew: 642, n: 128 },
      { id: "fridge-only", group: "fridge", name: "Refrigerator — no freezer / single door", standardNew: 334, energyStarNew: 288, n: 302 },
      { id: "freezer-upright", group: "freezer", name: "Freezer — upright", standardNew: 494, energyStarNew: 438, n: 509 },
      { id: "freezer-chest", group: "freezer", name: "Freezer — chest", standardNew: 244, energyStarNew: 218, n: 9 }
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
