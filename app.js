(function () {
  "use strict";
  var C = window.APP_CONFIG;
  var $ = function (id) { return document.getElementById(id); };

  var els = {
    appliance: $("appliance"), note: $("appliance-note"), watts: $("watts"),
    hours: $("hours"), days: $("days"), duty: $("duty"), dutyTip: $("duty-tip"),
    rate: $("rate"), rateLabel: $("rate-label"), state: $("state"), error: $("form-error"),
    share: $("share-x")
  };

  // Populate the appliance picker
  els.appliance.innerHTML = "";
  C.appliances.forEach(function (a) {
    var opt = document.createElement("option");
    opt.value = a.id;
    opt.textContent = a.name;
    els.appliance.appendChild(opt);
  });

  // State picker: fills in the state's average rate; typing your own rate switches it to "My own rate"
  C.stateRates.forEach(function (s) {
    var opt = document.createElement("option");
    opt.value = s.code;
    opt.textContent = s.name + " (" + s.cents + "¢)";
    els.state.appendChild(opt);
  });
  var own = document.createElement("option");
  own.value = "custom"; own.textContent = "My own rate";
  els.state.appendChild(own);

  function showRateLabel() {
    var s = C.stateRates.find(function (x) { return x.code === els.state.value; });
    els.rateLabel.textContent = !s ? "Using your own rate." :
      s.code === "US" ? "Using the " + C.defaultRateLabel + "." :
      "Using the " + s.name + " " + C.stateRateLabel + ".";
  }
  var fillingFromState = false;
  els.state.addEventListener("change", function () {
    var s = C.stateRates.find(function (x) { return x.code === els.state.value; });
    if (s) {
      els.rate.value = Math.round(s.cents * 100) / 10000;
      fillingFromState = true;
      els.rate.dispatchEvent(new Event("input", { bubbles: true }));
      fillingFromState = false;
    }
    showRateLabel();
  });
  els.rate.addEventListener("input", function () {
    if (!fillingFromState) { els.state.value = "custom"; showRateLabel(); }
  });
  els.state.value = "US";
  els.rate.value = C.defaultRate;
  showRateLabel();

  function current() {
    return C.appliances.find(function (a) { return a.id === els.appliance.value; }) || C.appliances[0];
  }

  function applyPreset() {
    var a = current();
    els.watts.value = a.watts;
    els.hours.value = a.hours;
    els.days.value = a.days;
    els.duty.value = a.duty;
    els.note.textContent = a.note || "";
    els.dutyTip.hidden = !a.cycles;
    calculate();
  }

  function num(el) { return parseFloat(el.value); }

  function money(v) {
    var digits = v < 1 ? 3 : 2;
    return "$" + v.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });
  }
  function kwh(v) {
    var digits = v < 1 ? 3 : v < 100 ? 2 : 0;
    return v.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits }) + " kWh";
  }

  var lastMonthly = null;

  function calculate() {
    var w = num(els.watts), h = num(els.hours), d = num(els.days), p = num(els.duty), r = num(els.rate);
    var bad = [];
    if (!(w >= 0)) bad.push("watts");
    if (!(h >= 0 && h <= 24)) bad.push("hours per day (0–24)");
    if (!(d >= 0 && d <= 31)) bad.push("days per month (0–31)");
    if (!(p >= 0 && p <= 100)) bad.push("percent of time running (0–100)");
    if (!(r >= 0)) bad.push("electric rate");
    if (bad.length) {
      els.error.textContent = "Please check: " + bad.join(", ") + ".";
      els.error.hidden = false;
      return;
    }
    els.error.hidden = true;

    var perHour = (w / 1000) * (p / 100);
    var periods = { hour: perHour, day: perHour * h, month: perHour * h * d, year: perHour * h * d * 12 };
    Object.keys(periods).forEach(function (k) {
      $("kwh-" + k).textContent = kwh(periods[k]);
      $("cost-" + k).textContent = money(periods[k] * r);
    });
    lastMonthly = periods.month * r;
    updateShare();
  }

  function updateShare() {
    if (lastMonthly === null) return;
    var a = current();
    var label = a.id === "custom" ? "a " + num(els.watts) + "W appliance" : "a " + num(els.watts) + "W " + a.name.replace(/\s*\(.*\)$/, "").toLowerCase();
    var text = "At my rate ($" + num(els.rate).toFixed(2) + "/kWh), " + label +
      " costs about " + money(lastMonthly) + "/month to run.";
    els.share.href = "https://x.com/intent/post?text=" + encodeURIComponent(text) +
      "&url=" + encodeURIComponent(C.siteUrl);
  }

  els.appliance.addEventListener("change", applyPreset);
  [els.watts, els.hours, els.days, els.duty, els.rate].forEach(function (el) {
    el.addEventListener("input", calculate);
  });
  // "Calculate now" button and Enter key both submit the form
  $("calc-form").addEventListener("submit", function (e) {
    e.preventDefault();
    calculate();
    if (!els.error.hidden) return;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var results = $("results-heading");
    results.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    results.focus({ preventScroll: true });
  });

  // Placeholder monetization blocks (below results only)
  if (C.affiliate && C.affiliate.enabled) {
    $("affiliate-heading").textContent = C.affiliate.heading;
    $("affiliate-disclosure").textContent = C.affiliate.disclosure;
    var list = $("affiliate-links");
    C.affiliate.links.forEach(function (l) {
      var li = document.createElement("li"), a = document.createElement("a");
      a.href = l.href; a.textContent = l.label; a.rel = "sponsored nofollow";
      li.appendChild(a); list.appendChild(li);
    });
    $("affiliate").hidden = false;
  }
  if (C.tip && C.tip.enabled) {
    var t = $("tip-link");
    t.href = C.tip.href; t.textContent = C.tip.label;
    $("tip").hidden = false;
  }
  if (C.sponsor && C.sponsor.enabled) {
    $("sponsor-name").textContent = C.sponsor.name;
    $("sponsor-message").textContent = C.sponsor.message;
    $("sponsor-link").href = C.sponsor.href;
    $("sponsor").hidden = false;
  }

  applyPreset();

  window.APP_READY = true;

  // Offline/PWA features only work on a web server (http/https), never from file://
  if (location.protocol === "http:" || location.protocol === "https:") {
    var m = document.createElement("link");
    m.rel = "manifest";
    m.href = "manifest.webmanifest";
    document.head.appendChild(m);
    if ("serviceWorker" in navigator) {
      try {
        navigator.serviceWorker.register("sw.js").catch(function () {});
      } catch (err) { /* ignore: the calculator works without it */ }
    }
  }
})();
