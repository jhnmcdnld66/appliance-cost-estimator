// Old vs new comparison. Figures and sources live in config.js (compare section).
(function () {
  "use strict";
  var C = window.APP_CONFIG && window.APP_CONFIG.compare;
  if (!C) return;
  var $ = function (id) { return document.getElementById(id); };
  var type = $("cmp-type"), oldAge = $("cmp-old-age"), oldKwh = $("cmp-old-kwh"),
      newKind = $("cmp-new-kind"), newKwh = $("cmp-new-kwh"), price = $("cmp-price"), rate = $("rate");

  function fill(sel, items, label) {
    sel.innerHTML = "";
    items.forEach(function (it) {
      var o = document.createElement("option");
      o.value = it.id; o.textContent = it[label];
      sel.appendChild(o);
    });
  }
  fill(type, C.types, "name");
  fill(oldAge, C.oldBands, "label");
  $("cmp-source").textContent = C.sourceNote;

  function money(v) {
    return "$" + v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  function kwh(v) { return Math.round(v).toLocaleString("en-US") + " kWh"; }
  function val(el) { return el.value.trim() === "" ? null : parseFloat(el.value); }

  function compare() {
    var t = C.types.find(function (x) { return x.id === type.value; }) || C.types[0];
    var r = parseFloat(rate.value), oLabel = val(oldKwh), nLabel = val(newKwh), p = val(price);
    var err = $("cmp-error");
    if (!(r >= 0) || (oLabel !== null && !(oLabel >= 0)) || (nLabel !== null && !(nLabel >= 0)) || (p !== null && !(p >= 0))) {
      err.textContent = "Please check the numbers (and the electric rate above).";
      err.hidden = false;
      return false;
    }
    err.hidden = true;

    var oldYear = oLabel !== null ? oLabel : t.standardNew * C.oldMultipliers[oldAge.value];
    var newYear = nLabel !== null ? nLabel : t[newKind.value];
    $("cmp-old-src").textContent = oLabel !== null ? "(your label)" : "(rough estimate)";
    $("cmp-new-src").textContent = nLabel !== null ? "(your label)" :
      "(" + (newKind.value === "energyStarNew" ? "ENERGY STAR median" : "federal standard median") + ")";

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
    $("cmp-rate-note").textContent = "Using your electric rate of $" + r + "/kWh.";
    return true;
  }

  [type, oldAge, newKind].forEach(function (el) { el.addEventListener("change", compare); });
  [oldKwh, newKwh, price, rate].forEach(function (el) { el.addEventListener("input", compare); });
  $("compare-form").addEventListener("submit", function (e) {
    e.preventDefault();
    if (!compare()) return;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    $("cmp-results").scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
  });
  compare();
})();
