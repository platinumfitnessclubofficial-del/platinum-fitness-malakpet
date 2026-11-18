/* ==========================================================================
   PLATINUM Fitness Club Unisex — Malakpet
   Interactions: countdown, reveal, count-up, nav, lightbox, tilt
   ========================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var PHONE = "+917416769922";

  /* Header + scroll progress --------------------------------------------- */
  var header = document.querySelector(".site-header");
  var progress = document.querySelector("[data-progress]");

  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
    if (progress) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var ratio = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      progress.style.width = (ratio * 100).toFixed(2) + "%";
    }
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  /* Mobile navigation ----------------------------------------------------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("primary-nav");

  function closeNav() {
    if (!nav || !toggle) return;
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    document.body.classList.remove("nav-open");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.classList.toggle("nav-open", open);
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeNav();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
    document.addEventListener("click", function (e) {
      if (!nav.classList.contains("is-open")) return;
      if (e.target.closest(".site-header")) return;
      closeNav();
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 820) closeNav();
    });
  }

  /* Scroll reveal --------------------------------------------------------- */
  var revealItems = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -50px 0px" });
    revealItems.forEach(function (el) { revealObserver.observe(el); });
  }

  /* Count-up stats -------------------------------------------------------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    var suffix = el.getAttribute("data-suffix") || "";
    if (isNaN(target)) return;

    if (reduceMotion) {
      el.textContent = format(target, decimals) + suffix;
      return;
    }

    var duration = 1500;
    var start = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      var p = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = format(target * eased, decimals) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = format(target, decimals) + suffix;
    }
    requestAnimationFrame(step);
  }

  function format(value, decimals) {
    if (decimals > 0) return value.toFixed(decimals);
    var rounded = Math.round(value);
    return rounded >= 1000 ? rounded.toLocaleString("en-IN") : String(rounded);
  }

  var counters = document.querySelectorAll("[data-count]");
  if (counters.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      counters.forEach(animateCount);
    } else {
      var countObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          animateCount(entry.target);
          countObserver.unobserve(entry.target);
        });
      }, { threshold: 0.6 });
      counters.forEach(function (el) { countObserver.observe(el); });
    }
  }

  /* Canvas embers (hero + offer sections) ---------------------------------- */
  function mountEmbers(canvas, opts) {
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var dots = [];
    var W = 0;
    var H = 0;
    var density = opts.density || 10;
    var maxDots = opts.maxDots || 150;
    var minDots = opts.minDots || 70;

    function spawn(bottom) {
      var bokeh = Math.random() < 0.3;
      return {
        x: Math.random() * W,
        y: bottom ? H + 20 : Math.random() * H,
        r: bokeh ? 3 + Math.random() * 7 : 0.9 + Math.random() * 2,
        vy: bokeh ? 0.05 + Math.random() * 0.16 : 0.2 + Math.random() * 0.55,
        sway: Math.random() * Math.PI * 2,
        swaySpeed: 0.002 + Math.random() * 0.008,
        swayAmp: 10 + Math.random() * 26,
        alpha: bokeh ? 0.16 + Math.random() * 0.2 : 0.3 + Math.random() * 0.45,
        twinkle: Math.random() * Math.PI * 2,
        orange: Math.random() < (opts.orangeRatio || 0.75),
        bokeh: bokeh
      };
    }

    function resize() {
      W = canvas.clientWidth || canvas.parentNode.clientWidth || window.innerWidth;
      H = canvas.clientHeight || canvas.parentNode.clientHeight || window.innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var target = Math.round(Math.min(maxDots, Math.max(minDots, W / density)));
      while (dots.length < target) dots.push(spawn(false));
      if (dots.length > target) dots.length = target;
    }

    function frame() {
      if (canvas.clientWidth && (canvas.clientWidth !== W || canvas.clientHeight !== H)) resize();
      if (!document.hidden) {
        ctx.clearRect(0, 0, W, H);
        for (var i = 0; i < dots.length; i++) {
          var d = dots[i];
          d.y -= d.vy;
          d.sway += d.swaySpeed * 16;
          d.twinkle += 0.03;
          if (d.y < -24) dots[i] = spawn(true);
          var px = d.x + Math.sin(d.sway) * d.swayAmp;
          var a = Math.max(0, d.alpha * (0.6 + 0.4 * Math.sin(d.twinkle)));
          if (d.bokeh) {
            var gr = ctx.createRadialGradient(px, d.y, 0, px, d.y, d.r * 3.2);
            var col = d.orange ? "255,92,26" : "255,255,255";
            gr.addColorStop(0, "rgba(" + col + "," + a.toFixed(3) + ")");
            gr.addColorStop(1, "rgba(" + col + ",0)");
            ctx.fillStyle = gr;
            ctx.beginPath();
            ctx.arc(px, d.y, d.r * 3.2, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.globalAlpha = a;
            ctx.shadowColor = d.orange ? "rgba(255,92,26,.95)" : "rgba(255,255,255,.85)";
            ctx.shadowBlur = d.r * 6;
            ctx.fillStyle = d.orange ? "#ff6a2b" : "#ffffff";
            ctx.beginPath();
            ctx.arc(px, d.y, d.r, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      }
      requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener("resize", resize);
    requestAnimationFrame(frame);
  }

  if (!reduceMotion) {
    document.querySelectorAll(".hero-fx, .offer-fx").forEach(function (cv) {
      mountEmbers(cv, cv.classList.contains("offer-fx")
        ? { density: 12, maxDots: 120, minDots: 55, orangeRatio: 0.85 }
        : {});
    });
  }

  /* Daily countdown ------------------------------------------------------- */
  var hourEls = document.querySelectorAll('[data-cd="hours"]');
  var minuteEls = document.querySelectorAll('[data-cd="minutes"]');
  var secondEls = document.querySelectorAll('[data-cd="seconds"]');

  function pad(n) { return String(n).padStart(2, "0"); }

  function tick() {
    var now = new Date();
    var midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
    var diff = Math.max(0, midnight - now);
    var total = Math.floor(diff / 1000);
    var h = Math.floor(total / 3600);
    var m = Math.floor((total % 3600) / 60);
    var s = total % 60;

    hourEls.forEach(function (el) { el.textContent = pad(h); });
    minuteEls.forEach(function (el) { el.textContent = pad(m); });
    secondEls.forEach(function (el) { el.textContent = pad(s); });
  }
  tick();
  setInterval(tick, 1000);

  /* Slots bar ------------------------------------------------------------- */
  var slotsBar = document.querySelector(".slots-bar span");
  if (slotsBar) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      slotsBar.classList.add("is-filled");
    } else {
      var slotObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          slotsBar.classList.add("is-filled");
          slotObserver.unobserve(entry.target);
        });
      }, { threshold: 0.4 });
      slotObserver.observe(slotsBar.parentElement);
    }
  }

  /* Active navigation ----------------------------------------------------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav a[href^="#"]'));
  var navSections = navLinks
    .map(function (link) { return document.querySelector(link.getAttribute("href")); })
    .filter(Boolean);

  function syncActiveNav() {
    if (!navSections.length) return;
    var marker = window.scrollY + window.innerHeight * 0.35;
    var current = null;
    navSections.forEach(function (section) {
      if (section.offsetTop <= marker) current = section;
    });
    navLinks.forEach(function (link) {
      link.classList.toggle("is-active", !!current && link.getAttribute("href") === "#" + current.id);
    });
  }
  syncActiveNav();
  window.addEventListener("scroll", syncActiveNav, { passive: true });
  window.addEventListener("resize", syncActiveNav);

  /* Hero tilt ------------------------------------------------------------- */
  var tiltTarget = document.querySelector("[data-tilt]");
  if (tiltTarget && finePointer && !reduceMotion) {
    var frame = null;
    tiltTarget.addEventListener("pointermove", function (e) {
      if (frame) return;
      frame = requestAnimationFrame(function () {
        var rect = tiltTarget.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        tiltTarget.style.transform =
          "perspective(900px) rotateY(" + (x * 5).toFixed(2) + "deg) rotateX(" + (-y * 5).toFixed(2) + "deg)";
        frame = null;
      });
    });
    tiltTarget.addEventListener("pointerleave", function () {
      tiltTarget.style.transform = "";
    });
  }

  /* Lightbox -------------------------------------------------------------- */
  var dialog = document.querySelector("[data-lightbox-dialog]");
  var galleryItems = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox]"));
  if (dialog && galleryItems.length && typeof dialog.showModal === "function") {
    var lightboxImg = dialog.querySelector("[data-lightbox-img]");
    var lightboxCaption = dialog.querySelector("[data-lightbox-caption]");
    var index = 0;

    function render(i) {
      index = (i + galleryItems.length) % galleryItems.length;
      var item = galleryItems[index];
      var src = item.getAttribute("data-src");
      var caption = item.getAttribute("data-caption") || "";
      lightboxImg.src = src;
      lightboxImg.alt = caption;
      lightboxCaption.textContent = caption;
    }

    function openAt(i) {
      render(i);
      dialog.showModal();
      document.body.classList.add("nav-open");
    }

    galleryItems.forEach(function (item, i) {
      item.setAttribute("tabindex", "0");
      item.setAttribute("role", "button");
      item.setAttribute("aria-label", "View photo: " + (item.getAttribute("data-caption") || "gallery image"));
      item.addEventListener("click", function () { openAt(i); });
      item.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openAt(i);
        }
      });
    });

    dialog.querySelector("[data-lightbox-close]").addEventListener("click", function () { dialog.close(); });
    dialog.querySelector("[data-lightbox-prev]").addEventListener("click", function () { render(index - 1); });
    dialog.querySelector("[data-lightbox-next]").addEventListener("click", function () { render(index + 1); });

    dialog.addEventListener("click", function (e) {
      if (e.target === dialog) dialog.close();
    });
    dialog.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { e.preventDefault(); render(index - 1); }
      if (e.key === "ArrowRight") { e.preventDefault(); render(index + 1); }
    });
    dialog.addEventListener("close", function () {
      document.body.classList.remove("nav-open");
      lightboxImg.src = "";
    });
  }

  /* FAQ: one open at a time ----------------------------------------------- */
  var faqItems = document.querySelectorAll(".faq details");
  faqItems.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (!item.open) return;
      faqItems.forEach(function (other) { if (other !== item) other.open = false; });
    });
  });

  /* Year ------------------------------------------------------------------ */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* Expose contact for debugging / integrations --------------------------- */
  window.PLATINUM_PHONE = PHONE;
})();
