(function () {
  "use strict";
  try { start(); } catch (err) {
    (window.APP_ERRORS = window.APP_ERRORS || []).push("app.js: " + err.message);
  }

  function start() {
  var C = window.APP_CONFIG;
  if (!C) throw new Error("settings from config.js are missing");
  var $ = function (id) { return document.getElementById(id); };

  var els = {
    appliance: $("appliance"), note: $("appliance-note"), watts: $("watts"),
    hours: $("hours"), days: $("days"), duty: $("duty"), dutyTip: $("duty-tip"),
    rate: $("rate"), rateLabel: $("rate-label"), state: $("state"), error: $("form-error"),
    timeError: $("time-error"), stA: $("st-a"), stB: $("st-b"),
    share: $("share-x")
  };
  Object.keys(els).forEach(function (k) {
    if (!els[k]) throw new Error("page element '" + k + "' not found (files may be from different versions)");
  });

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
    syncTime("hours");
    els.note.textContent = a.note || "";
    els.dutyTip.hidden = !a.cycles;
    calculate();
  }

  function num(el) { return parseFloat(el.value); }
  function round2(v) { return Math.round(v * 100) / 100; }

  // "Hours per day" and "Percent of the day" are two views of one value (percent of 24 hours).
  // The field the user last typed in is the source; the other is filled in, never the one being typed.
  var timeSource = "hours";
  function syncTime(source) {
    timeSource = source;
    var h = num(els.hours), p = num(els.duty);
    if (source === "hours" && h >= 0 && h <= 24) els.duty.value = round2(h / 24 * 100);
    if (source === "duty" && p >= 0 && p <= 100) els.hours.value = round2(p / 100 * 24);
  }
  // Shared value in hours per day, or an error message
  function hoursPerDay() {
    var h = els.hours.value.trim(), p = els.duty.value.trim();
    if (h === "" && p === "") return { error: "Enter hours per day or percent of the day." };
    var useHours = timeSource === "hours" ? h !== "" : p === "";
    if (useHours) {
      var hv = parseFloat(h);
      return hv >= 0 && hv <= 24 ? { hours: hv } : { error: "Hours per day must be between 0 and 24." };
    }
    var pv = parseFloat(p);
    return pv >= 0 && pv <= 100 ? { hours: pv / 100 * 24 } : { error: "Percent of the day must be between 0 and 100." };
  }

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
    var w = num(els.watts), t = hoursPerDay(), h = t.hours, d = num(els.days), r = num(els.rate);
    els.timeError.textContent = t.error || "";
    els.timeError.hidden = !t.error;
    var bad = [];
    if (!(w >= 0)) bad.push("watts");
    if (!(d >= 0 && d <= 31)) bad.push("days per month (0–31)");
    if (!(r >= 0)) bad.push("electric rate");
    els.error.textContent = bad.length ? "Please check: " + bad.join(", ") + "." : "";
    els.error.hidden = !bad.length;
    if (bad.length || t.error) { updateStates(null); return false; }

    var perHour = w / 1000;
    var periods = { hour: perHour, day: perHour * h, month: perHour * h * d, year: perHour * h * d * 12 };
    Object.keys(periods).forEach(function (k) {
      $("kwh-" + k).textContent = kwh(periods[k]);
      $("cost-" + k).textContent = money(periods[k] * r);
    });
    lastMonthly = periods.month * r;
    updateShare();
    updateStates(w / 1000 * h, h, d);
    return true;
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

  // Compare states: U.S. average vs two picked states, always at state-average rates (never the custom rate)
  var SC = C.stateCompare, stA = $("st-a"), stB = $("st-b"), stBody = $("st-body"), stShare = $("share-states");
  C.stateRates.forEach(function (s) {
    if (s.code === "US") return;
    [stA, stB].forEach(function (sel) {
      var opt = document.createElement("option");
      opt.value = s.code; opt.textContent = s.name;
      sel.appendChild(opt);
    });
  });
  stA.value = SC.defaults[0]; stB.value = SC.defaults[1];
  $("st-label").textContent = SC.label;
  var lastStates = null;
  function rateOf(code) { return C.stateRates.find(function (s) { return s.code === code; }); }
  function whole(v) { return "$" + Math.round(v).toLocaleString("en-US"); }
  function updateStates(kwhDay, h, d) {
    if (kwhDay !== undefined) lastStates = kwhDay === null ? null : { kwhDay: kwhDay, h: h, d: d };
    var cols = [rateOf("US"), rateOf(stA.value), rateOf(stB.value)];
    var month = cols.map(function (s) { return lastStates ? lastStates.kwhDay * lastStates.d * s.cents / 100 : 0; });
    var lo = Math.min.apply(null, month), hi = Math.max.apply(null, month);
    cols.forEach(function (s, i) {
      var cls = !lastStates || lo === hi ? "" : month[i] === lo ? "st-low" : month[i] === hi ? "st-high" : "";
      var th = $("st-h" + i);
      th.className = cls;
      th.innerHTML = "";
      th.appendChild(document.createTextNode(i === 0 ? "U.S. avg" : s.code));
      if (cls) {
        var tag = document.createElement("small");
        tag.textContent = cls === "st-low" ? "lowest" : "highest";
        th.appendChild(tag);
      }
      th.title = s.name;
      cols[i].cls = cls;
    });
    var rows = [["Rate (¢/kWh)", function (s) { return s.cents + "¢"; }]];
    if (lastStates) {
      rows.push(["Per day", function (s, i) { return money(month[i] / lastStates.d || 0); }],
        ["Per month", function (s, i) { return money(month[i]); }],
        ["Per year", function (s, i) { return money(month[i] * 12); }],
        ["vs U.S. avg (per month)", function (s, i) {
          if (i === 0) return "–";
          var diff = month[i] - month[0], pct = month[0] ? Math.round(diff / month[0] * 100) : 0;
          var sign = diff < 0 ? "−" : "+";
          return [sign + money(Math.abs(diff)), (pct < 0 ? "−" : "+") + Math.abs(pct) + "%"];
        }]);
    } else {
      rows.push(["Per month", function () { return "–"; }]);
    }
    stBody.innerHTML = "";
    rows.forEach(function (row) {
      var tr = document.createElement("tr"), rh = document.createElement("th");
      rh.scope = "row"; rh.textContent = row[0]; tr.appendChild(rh);
      cols.forEach(function (s, i) {
        var td = document.createElement("td");
        var v = row[1](s, i);
        (Array.isArray(v) ? v : [v]).forEach(function (part) {
          var span = document.createElement("span");
          span.textContent = part;
          td.appendChild(span);
        });
        if (s.cls) td.className = s.cls;
        tr.appendChild(td);
      });
      stBody.appendChild(tr);
    });
    var a = current(), name = a.id === "custom" ? "a " + num(els.watts) + " W appliance" : a.name.replace(/\s*\(.*\)$/, "");
    if (a.id !== "custom" && /^[A-Z][a-z]/.test(name)) name = name.charAt(0).toLowerCase() + name.slice(1);
    $("st-for").textContent = lastStates ? "For your " + num(els.watts) + " W " + (a.id === "custom" ? "appliance" : name) +
      ", " + round2(lastStates.h) + " h/day, " + lastStates.d + " days/month." : "Fill in the calculator above to compare.";
    if (lastStates) {
      var article = a.id === "custom" || /^EV /.test(name) ? "" : /^[aeiou]/i.test(name) ? "an " : "a ";
    var text = "Running " + article + name + " " + round2(lastStates.h) + " h/day costs " + whole(month[1]) + "/mo in " + cols[1].code +
        " vs " + whole(month[2]) + "/mo in " + cols[2].code + " (U.S. avg " + whole(month[0]) + "). via " + C.siteName;
      stShare.href = "https://x.com/intent/post?text=" + encodeURIComponent(text) + "&url=" + encodeURIComponent(C.siteUrl);
    }
  }
  [stA, stB].forEach(function (sel) { sel.addEventListener("change", function () { updateStates(); }); });

  els.appliance.addEventListener("change", applyPreset);
  els.hours.addEventListener("input", function () { syncTime("hours"); });
  els.duty.addEventListener("input", function () { syncTime("duty"); });
  [els.watts, els.hours, els.days, els.duty, els.rate].forEach(function (el) {
    el.addEventListener("input", calculate);
  });
  // "Calculate now" button and Enter key both submit the form
  $("calc-form").addEventListener("submit", function (e) {
    e.preventDefault();
    if (!calculate()) return;
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
  }
})();
