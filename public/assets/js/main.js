/* ==========================================================================
   KAVQIS — site interactions
   ========================================================================== */

/**
 * GOOGLE PLAY LINK
 * ----------------
 * When the app is published, paste the Play Store URL below, e.g.
 *   const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.kavqis.app";
 * Every "Coming soon on Google Play" badge across the site becomes a live
 * "Get it on Google Play" link, and the "in development" notes are hidden.
 * Leave it empty ("") while the app is not yet available.
 */
const PLAY_STORE_URL = "";

(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Google Play placeholder ---------- */
  function initPlayLinks() {
    if (!PLAY_STORE_URL) return;
    document.querySelectorAll("[data-play-link]").forEach((el) => {
      el.setAttribute("href", PLAY_STORE_URL);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
      el.classList.remove("is-soon");
      el.removeAttribute("aria-disabled");
      el.setAttribute("aria-label", "Get KAVQIS on Google Play");
      const top = el.querySelector(".play-badge__top");
      if (top) top.textContent = "Get it on";
    });
    document.querySelectorAll("[data-play-note]").forEach((el) => {
      el.hidden = true;
    });
  }

  /* ---------- Header ---------- */
  function initHeader() {
    const header = document.querySelector(".site-header");
    if (!header) return;
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const toggle = document.querySelector(".nav-toggle");
    const nav = document.getElementById("site-nav");
    if (!toggle || !nav) return;

    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      nav.classList.toggle("is-open", open);
      document.body.classList.toggle("nav-open", open);
      header.classList.toggle("menu-active", open);
    };

    toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
    nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
    });
    window.matchMedia("(min-width: 900px)").addEventListener("change", (e) => {
      if (e.matches) setOpen(false);
    });
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    const items = document.querySelectorAll(".reveal, [data-observe]");
    if (!items.length) return;
    if (!("IntersectionObserver" in window) || prefersReducedMotion) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    items.forEach((el) => io.observe(el));
  }

  /* ---------- Count-up numbers ---------- */
  const fmt = (n, digits = 0) =>
    Number(n).toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });

  function initCountUp() {
    const els = document.querySelectorAll("[data-count]");
    if (!els.length) return;
    const run = (el) => {
      const target = parseFloat(el.dataset.count);
      const digits = parseInt(el.dataset.digits || "0", 10);
      if (prefersReducedMotion) {
        el.textContent = fmt(target, digits);
        return;
      }
      const duration = 1400;
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = fmt(target * eased, digits);
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if (!("IntersectionObserver" in window)) {
      els.forEach(run);
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          run(entry.target);
          io.unobserve(entry.target);
        }
      });
    });
    els.forEach((el) => io.observe(el));
  }

  /* ---------- Loan estimator (home) ---------- */
  function initEstimator() {
    const root = document.getElementById("estimator");
    if (!root) return;
    const amount = root.querySelector("#est-amount");
    const rate = root.querySelector("#est-rate");
    const years = root.querySelector("#est-years");
    const out = {
      amount: root.querySelector("[data-out='amount']"),
      rate: root.querySelector("[data-out='rate']"),
      years: root.querySelector("[data-out='years']"),
      monthly: root.querySelector("[data-out='monthly']"),
      interest: root.querySelector("[data-out='interest']"),
      total: root.querySelector("[data-out='total']"),
      principal: root.querySelector("[data-out='principal']"),
      share: root.querySelector("[data-out='share']"),
      barP: root.querySelector(".split-bar__p"),
      barI: root.querySelector(".split-bar__i"),
    };

    const paint = (input) => {
      const min = parseFloat(input.min);
      const max = parseFloat(input.max);
      const pct = ((parseFloat(input.value) - min) / (max - min)) * 100;
      input.style.setProperty("--pct", pct + "%");
    };

    const calc = () => {
      const P = parseFloat(amount.value);
      const annual = parseFloat(rate.value);
      const n = parseInt(years.value, 10) * 12;
      const r = annual / 12 / 100;
      const emi = r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const total = emi * n;
      const interest = total - P;
      const iShare = total > 0 ? (interest / total) * 100 : 0;

      out.amount.textContent = fmt(P);
      out.rate.textContent = annual.toFixed(1) + "%";
      out.years.textContent = years.value + (years.value === "1" ? " year" : " years");
      out.monthly.textContent = fmt(emi);
      out.interest.textContent = fmt(interest);
      out.total.textContent = fmt(total);
      out.principal.textContent = fmt(P);
      out.share.textContent = iShare.toFixed(1) + "%";
      out.barP.style.width = 100 - iShare + "%";
      out.barI.style.width = iShare + "%";

      amount.setAttribute("aria-valuetext", fmt(P));
      rate.setAttribute("aria-valuetext", annual.toFixed(1) + " percent per year");
      years.setAttribute("aria-valuetext", years.value + " years");
      [amount, rate, years].forEach(paint);
    };

    [amount, rate, years].forEach((input) => input.addEventListener("input", calc));
    calc();
  }

  /* ---------- Feature sub-nav highlighting ---------- */
  function initSectionSpy(linkSelector) {
    const links = Array.from(document.querySelectorAll(linkSelector));
    if (!links.length || !("IntersectionObserver" in window)) return;
    const map = new Map();
    links.forEach((link) => {
      const id = link.getAttribute("href").split("#")[1];
      const section = id && document.getElementById(id);
      if (section) map.set(section, link);
    });
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            links.forEach((l) => l.classList.remove("is-active"));
            const link = map.get(entry.target);
            if (link) {
              link.classList.add("is-active");
              const list = link.closest(".feature-nav__list");
              if (list && list.scrollWidth > list.clientWidth) {
                list.scrollTo({
                  left: link.offsetLeft - list.clientWidth / 2 + link.offsetWidth / 2,
                  behavior: prefersReducedMotion ? "auto" : "smooth",
                });
              }
            }
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    map.forEach((_, section) => io.observe(section));
  }

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(message) {
    let el = document.querySelector(".toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      el.setAttribute("role", "status");
      el.setAttribute("aria-live", "polite");
      document.body.appendChild(el);
    }
    el.textContent = message;
    requestAnimationFrame(() => el.classList.add("is-shown"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-shown"), 2400);
  }

  /* ---------- Copy email ---------- */
  function initCopy() {
    document.querySelectorAll("[data-copy]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const value = btn.getAttribute("data-copy");
        try {
          await navigator.clipboard.writeText(value);
          toast("Email address copied");
        } catch (err) {
          toast(value);
        }
      });
    });
  }

  /* ---------- Contact form validation ---------- */
  function initContactForm() {
    const form = document.querySelector("form[name='contact']");
    if (!form) return;
    const rules = {
      name: (v) => (v.trim().length >= 2 ? "" : "Please tell us your name."),
      email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Please enter a valid email address."),
      topic: (v) => (v ? "" : "Please choose a topic."),
      message: (v) => (v.trim().length >= 10 ? "" : "Please write a message of at least 10 characters."),
    };

    const check = (field) => {
      const rule = rules[field.name];
      if (!rule) return true;
      const wrapper = field.closest(".field");
      const msg = rule(field.value);
      const errorEl = wrapper && wrapper.querySelector(".field__error");
      if (wrapper) wrapper.classList.toggle("has-error", Boolean(msg));
      if (errorEl) errorEl.textContent = msg;
      field.setAttribute("aria-invalid", msg ? "true" : "false");
      return !msg;
    };

    form.querySelectorAll("input, select, textarea").forEach((field) => {
      field.addEventListener("blur", () => check(field));
      field.addEventListener("input", () => {
        if (field.closest(".field")?.classList.contains("has-error")) check(field);
      });
    });

    form.addEventListener("submit", (e) => {
      const fields = Array.from(form.querySelectorAll("[name]")).filter((f) => rules[f.name]);
      const results = fields.map(check);
      if (results.includes(false)) {
        e.preventDefault();
        const first = fields[results.indexOf(false)];
        if (first) first.focus();
        return;
      }
      const btn = form.querySelector("button[type='submit']");
      if (btn) {
        btn.disabled = true;
        const label = btn.querySelector("[data-label]");
        if (label) label.textContent = "Sending…";
      }
    });
  }

  /* ---------- Year ---------- */
  function initYear() {
    document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
  }

  document.addEventListener("DOMContentLoaded", () => {
    initPlayLinks();
    initHeader();
    initReveal();
    initCountUp();
    initEstimator();
    initSectionSpy(".feature-nav__link");
    initSectionSpy(".legal-toc a");
    initCopy();
    initContactForm();
    initYear();
  });
})();
