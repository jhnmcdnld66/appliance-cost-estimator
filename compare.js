// Old vs new comparison. Figures and sources live in config.js (compare section).
(function () {
  "use strict";
  try { start(); window.COMPARE_READY = true; } catch (err) {
    (window.APP_ERRORS = window.APP_ERRORS || []).push("compare.js: " + err.message);
  }

  function start() {
  var C = window.APP_CONFIG && window.APP_CONFIG.compare;
  if (!C) throw new Error("comparison settings from config.js are missing");
  var $ = function (id) { return document.getElementById(id); };
  var type = $("cmp-type"), oldAge = $("cmp-old-age"), oldKwh = $("cmp-old-kwh"),
      newKind = $("cmp-new-kind"), newKwh = $("cmp-new-kwh"), price = $("cmp-price"), rate = $("rate");
  [type, oldAge, oldKwh, newKind, newKwh, price, rate].forEach(function (el) {
    if (!el) throw new Error("a comparison form field was not found (files may be from different versions)");
  });

  function fill(sel, items, label) {
    sel.innerHTML = "";
    items.forEach(function (it) {
      var o = document.createElement("option");
      o.value = it.id; o.textContent = it[label];
      sel.appendChild(o);
    });
  }
  fill(type, C.types, "name");

  function currentType() { return C.types.find(function (x) { return x.id === type.value; }) || C.types[0]; }
  var shownGroup = null;
  function syncBands() {
    var g = currentType().group;
    if (g === shownGroup) return;
    shownGroup = g;
    fill(oldAge, C.oldBands[g], "label");
    $("cmp-source").innerHTML = C.newSourceNote + " " + C.oldSourceNote[g] + " " + C.labelNote;
  }

  function money(v) {
    return "$" + v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  function kwh(v) { return Math.round(v).toLocaleString("en-US") + " kWh"; }
  function val(el) { return el.value.trim() === "" ? null : parseFloat(el.value); }

  function compare() {
    syncBands();
    var t = currentType();
    var band = C.oldBands[t.group].find(function (b) { return b.id === oldAge.value; });
    var r = parseFloat(rate.value), oLabel = val(oldKwh), nLabel = val(newKwh), p = val(price);
    var err = $("cmp-error");
    if (!(r >= 0) || (oLabel !== null && !(oLabel >= 0)) || (nLabel !== null && !(nLabel >= 0)) || (p !== null && !(p >= 0))) {
      err.textContent = "Please check the numbers (and the electric rate above).";
      err.hidden = false;
      return false;
    }
    if (oLabel === null && band.needsLabel) {
      err.textContent = "There's no official typical figure for refrigerators from 2001 or newer. Enter the kWh/year from the old refrigerator's EnergyGuide label.";
      err.hidden = false;
      ["cmp-old-year-kwh", "cmp-old-year-cost", "cmp-save-kwh", "cmp-save-year"].forEach(function (id) { $(id).textContent = "–"; });
      $("cmp-save-month").textContent = ""; $("cmp-payback").textContent = ""; $("cmp-old-src").textContent = "";
      return false;
    }
    err.hidden = true;

    var oldYear = oLabel !== null ? oLabel : band.kwh || t.standardNew * band.multiplier;
    var newYear = nLabel !== null ? nLabel : t[newKind.value];
    $("cmp-old-src").textContent = oLabel !== null ? "your label" : band.tag;
    $("cmp-new-src").textContent = nLabel !== null ? "your label" :
      newKind.value === "energyStarNew" ? "ENERGY STAR median" : "federal standard median";

    var saveYear = (oldYear - newYear) * r;
    $("cmp-old-year-kwh").textContent = kwh(oldYear);
    $("cmp-old-year-cost").textContent = money(oldYear * r);
    $("cmp-new-year-kwh").textContent = kwh(newYear);
    $("cmp-new-year-cost").textContent = money(newYear * r);
    $("cmp-save-kwh").textContent = saveYear > 0 ? kwh(oldYear - newYear) : "–";
    $("cmp-save-year").textContent = saveYear > 0 ? money(saveYear) : "$0.00";
    $("cmp-save-month").textContent = saveYear > 0 ? money(saveYear / 12) + " per month" : "";

    var pb = $("cmp-payback");
    if (saveYear <= 0) {
      pb.textContent = "The new model wouldn't use less electricity than the old one.";
    } else if (p !== null && p > 0) {
      var years = p / saveYear;
      pb.textContent = "Payback: about " + (years < 1 ? Math.round(years * 12) + " months" : years.toFixed(1) + " years") +
        " for a " + money(p) + " appliance, from electricity savings alone.";
    } else {
      pb.textContent = "Enter a price above to see how long the savings take to pay for the new appliance.";
    }
    $("cmp-rate-note").textContent = "Using your electric rate of $" + r + "/kWh from above.";
    return true;
  }

  function userCompare() {
    if (!compare()) return false;
    if (window.aceCount) window.aceCount("compare-old-new/" + type.value + "/" + oldAge.value, "Compare old vs new");
    return true;
  }
  [type, oldAge, newKind].forEach(function (el) { el.addEventListener("change", userCompare); });
  [oldKwh, newKwh, price].forEach(function (el) { el.addEventListener("input", userCompare); });
  rate.addEventListener("input", compare);
  $("compare-form").addEventListener("submit", function (e) {
    e.preventDefault();
    if (!userCompare()) return;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    $("cmp-results").scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
  });
  compare();
  }
})();
