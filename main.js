/* ALI DEVELOPER — site behaviour (plain JavaScript, no dependencies) */
(function () {
  "use strict";
  var C = window.SITE_CONFIG || {};
  var NUMBER = String(C.whatsappNumber || "").replace(/\D/g, "");
  var ENDPOINT = String(C.formEndpoint || "").trim();
  var EMAIL = String(C.email || "").trim();
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function waUrl(text) { return "https://wa.me/" + NUMBER + "?text=" + encodeURIComponent(text); }

  /* ---- WhatsApp links: add the configured number ---- */
  $$("[data-wa-text]").forEach(function (a) { a.setAttribute("href", waUrl(a.getAttribute("data-wa-text"))); });

  /* ---- email + social from config.js ---- */
  if (EMAIL && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(EMAIL)) {
    $$("[data-email]").forEach(function (el) { el.hidden = false; });
    $$("[data-email-link]").forEach(function (a) { a.href = "mailto:" + EMAIL; });
    $$("[data-email-card]").forEach(function (a) { a.hidden = false; a.href = "mailto:" + EMAIL; });
    $$("[data-email-text]").forEach(function (el) { el.textContent = EMAIL; });
  }
  var social = C.social || {};
  var socialKeys = Object.keys(social).filter(function (k) { return /^https?:\/\//i.test(String(social[k] || "")); });
  if (socialKeys.length) {
    $$("[data-social]").forEach(function (ul) {
      socialKeys.forEach(function (k) {
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = social[k]; a.textContent = k; a.target = "_blank"; a.rel = "noopener noreferrer";
        li.appendChild(a); ul.appendChild(li);
      });
    });
    $$("[data-social-card]").forEach(function (el) { el.hidden = false; });
  }
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---- header: solid after scrolling ---- */
  var hdr = $("#hdr");
  function onScroll() { if (hdr) hdr.classList.toggle("solid", window.scrollY > 24 || document.body.classList.contains("lock")); }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* ---- mobile menu ---- */
  var burger = $("#burger"), mnav = $("#mnav");
  function setMenu(open) {
    if (!burger || !mnav) return;
    mnav.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("lock", open);
    onScroll();
  }
  if (burger) {
    burger.addEventListener("click", function () { setMenu(burger.getAttribute("aria-expanded") !== "true"); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
    $$("a", mnav).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
    window.addEventListener("resize", function () { if (window.innerWidth >= 1024) setMenu(false); });
  }

  /* ---- scroll reveal ---- */
  var items = $$(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -70px 0px", threshold: 0.05 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---- portfolio filters ---- */
  var fbtns = $$(".fbtn");
  fbtns.forEach(function (b) {
    b.addEventListener("click", function () {
      var f = b.getAttribute("data-filter");
      fbtns.forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      $$(".proj").forEach(function (card) {
        var show = f === "All" || card.getAttribute("data-cat") === f;
        card.classList.toggle("hide", !show);
        if (show) card.classList.add("in");
      });
    });
  });

  /* ---- forms ---- */
  var PHONE_IN = /^(?:\+?91|0)?[6-9]\d{9}$/, PHONE_INTL = /^\+\d{10,15}$/, EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function cleanPhone(v) { return v.replace(/[\s\-().]/g, ""); }
  function validPhone(v) { v = cleanPhone(v); return PHONE_IN.test(v) || PHONE_INTL.test(v); }
  function validUrl(v) { try { var u = new URL(/^https?:\/\//i.test(v) ? v : "https://" + v); return u.hostname.indexOf(".") > 0; } catch (e) { return false; } }
  function clean(v, max) { return String(v || "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, max || 500); }
  function line(label, v) { return v ? label + ": " + v + "\n" : ""; }

  var CFG = {
    demo: {
      prefix: "d-",
      fields: ["name", "business", "whatsapp", "email", "category", "site", "style", "budget", "desc"],
      validate: function (v) {
        var e = {};
        if (clean(v.name, 100).length < 2) e["d-name"] = "Please enter your full name.";
        if (clean(v.business, 120).length < 2) e["d-business"] = "Please enter your business name.";
        if (!v.whatsapp.trim()) e["d-whatsapp"] = "Please enter your WhatsApp number.";
        else if (!validPhone(v.whatsapp)) e["d-whatsapp"] = "Enter a valid number, e.g. 98765 43210 or +91 98765 43210.";
        if (v.email.trim() && !EMAIL_RE.test(v.email.trim())) e["d-email"] = "Please enter a valid email address.";
        if (!v.category) e["d-category"] = "Please choose a business category.";
        if (v.site.trim() && !validUrl(v.site.trim())) e["d-site"] = "Enter a valid website address, e.g. example.com.";
        if (!v.services.length) e["d-services"] = "Select at least one service.";
        if (!v.style) e["d-style"] = "Please choose a design style.";
        if (!v.budget) e["d-budget"] = "Please choose a budget range.";
        if (clean(v.desc, 1000).length < 10) e["d-desc"] = "Please describe your project in at least 10 characters.";
        return e;
      },
      message: function (v) {
        return ("Hi ALI DEVELOPER, I would like to request a free website demo.\n\n" +
          line("Name", clean(v.name, 100)) + line("Business", clean(v.business, 120)) + line("WhatsApp", clean(v.whatsapp, 25)) +
          line("Email", clean(v.email, 120)) + line("Category", v.category) + line("Existing website", clean(v.site, 200)) +
          line("Services required", v.services.join(", ")) + line("Design style", v.style) + line("Budget", v.budget) +
          line("Project details", clean(v.desc, 1000))).trim();
      },
      payload: function (v) {
        return { name: clean(v.name, 100), business: clean(v.business, 120), whatsapp: clean(v.whatsapp, 25), email: clean(v.email, 120),
          category: v.category, existingWebsite: clean(v.site, 200), servicesRequired: v.services.join(", "), designStyle: v.style,
          budget: v.budget, description: clean(v.desc, 1000), _subject: "Free demo request — alideveloper.online" };
      }
    },
    contact: {
      prefix: "c-",
      fields: ["name", "business", "email", "whatsapp", "service", "message"],
      validate: function (v) {
        var e = {};
        if (clean(v.name, 100).length < 2) e["c-name"] = "Please enter your name.";
        if (v.email.trim() && !EMAIL_RE.test(v.email.trim())) e["c-email"] = "Please enter a valid email address.";
        if (!v.whatsapp.trim()) e["c-whatsapp"] = "Please enter your WhatsApp number.";
        else if (!validPhone(v.whatsapp)) e["c-whatsapp"] = "Enter a valid number, e.g. 98765 43210 or +91 98765 43210.";
        if (!v.service) e["c-service"] = "Please choose a service.";
        if (clean(v.message, 1000).length < 10) e["c-message"] = "Please write a message of at least 10 characters.";
        return e;
      },
      message: function (v) {
        return ("Hi ALI DEVELOPER, I'd like to discuss a project.\n\n" +
          line("Name", clean(v.name, 100)) + line("Business", clean(v.business, 120)) + line("Email", clean(v.email, 120)) +
          line("WhatsApp", clean(v.whatsapp, 25)) + line("Service required", v.service) + line("Message", clean(v.message, 1000))).trim();
      },
      payload: function (v) {
        return { name: clean(v.name, 100), business: clean(v.business, 120), email: clean(v.email, 120), whatsapp: clean(v.whatsapp, 25),
          service: v.service, message: clean(v.message, 1000), _subject: "Contact enquiry — alideveloper.online" };
      }
    }
  };

  function setErr(id, msg) {
    var p = document.getElementById(id + "-err"), inp = document.getElementById(id);
    if (p) p.textContent = msg || "";
    if (inp && inp.tagName !== "DIV") { if (msg) inp.setAttribute("aria-invalid", "true"); else inp.removeAttribute("aria-invalid"); }
  }

  $$("form[data-form]").forEach(function (form) {
    var kind = form.getAttribute("data-form"), cfg = CFG[kind], busy = false, lastWa = "";
    var note = $("[data-form-note]", form);
    if (note) note.textContent = ENDPOINT
      ? "Your details are sent securely to our enquiry inbox."
      : "Submitting opens WhatsApp with your details prefilled — nothing is sent until you press Send there.";

    function read() {
      var v = {};
      cfg.fields.forEach(function (f) { var el = document.getElementById(cfg.prefix + f); v[f] = el ? el.value : ""; });
      v.services = $$('input[name="services"]:checked', form).map(function (c) { return c.value; });
      return v;
    }
    // clear an error as soon as the user edits the field
    form.addEventListener("input", function (e) { if (e.target && e.target.id) setErr(e.target.id, ""); });
    form.addEventListener("change", function (e) { if (e.target && e.target.name === "services") setErr("d-services", ""); else if (e.target && e.target.id) setErr(e.target.id, ""); });

    function showOk(mode) {
      var ok = $(".form-ok", form);
      $("[data-ok-title]", form).textContent = mode === "sent" ? "Thank you — your enquiry has been sent." : "WhatsApp is opening with your details.";
      var t = $("[data-ok-text]", form);
      if (mode === "sent") t.textContent = "We will get back to you on WhatsApp or email as soon as possible. You can also message us directly if it is urgent.";
      else { t.textContent = ""; var s = document.createElement("strong"); s.textContent = "Press Send in WhatsApp"; t.appendChild(document.createTextNode("Your message is prefilled. ")); t.appendChild(s); t.appendChild(document.createTextNode(" to deliver your enquiry — it is not sent until you do. This website does not store the details you entered.")); }
      var a = $("[data-ok-wa]", form); a.href = lastWa;
      $("[data-ok-wa-text]", form).textContent = mode === "sent" ? "Also message on WhatsApp" : "Open WhatsApp again";
      ok.hidden = false; form.classList.add("done"); ok.setAttribute("tabindex", "-1"); ok.focus({ preventScroll: false });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (busy) return;
      var bad = $(".form-bad", form); bad.hidden = true;
      var v = read(), errs = cfg.validate(v), first = null;
      $$(".fld [id]", form).forEach(function (el) { if (/^[dc]-/.test(el.id) && !/-err$/.test(el.id)) setErr(el.id, ""); });
      setErr("d-services", "");
      Object.keys(errs).forEach(function (id) { setErr(id, errs[id]); if (!first) first = id; });
      if (first) {
        var target = first === "d-services" ? $("#d-services input", form) : document.getElementById(first);
        if (target) target.focus();
        return;
      }
      var hpv = $('input[name="company_website"]', form);
      if (hpv && hpv.value) { lastWa = waUrl(cfg.message(v)); showOk("whatsapp"); return; } // bot: pretend success, send nothing

      lastWa = waUrl(cfg.message(v));
      if (!ENDPOINT) { window.open(lastWa, "_blank", "noopener,noreferrer"); showOk("whatsapp"); return; }

      busy = true; form.classList.add("is-loading");
      fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(cfg.payload(v)) })
        .then(function (r) { if (!r.ok) throw new Error("bad status"); showOk("sent"); })
        .catch(function () { bad.hidden = false; $("[data-bad-wa]", form).href = lastWa; })
        .then(function () { busy = false; form.classList.remove("is-loading"); });
    });

    var reset = $("[data-reset]", form);
    if (reset) reset.addEventListener("click", function () {
      form.reset(); form.classList.remove("done"); $(".form-ok", form).hidden = true;
      var firstField = $(".input", form); if (firstField) firstField.focus();
    });
  });
})();
