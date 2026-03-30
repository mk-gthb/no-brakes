/* ═══════════════════════════════════════════
   MADHAV & EVA — NO BRAKES
   License plate hero. Interstate energy.
   ═══════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);
const IS_TOUCH = "ontouchstart" in window || navigator.maxTouchPoints > 0;
gsap.ticker.lagSmoothing(0);

/* ═══ CURSOR + SPARKLE ═══ */
const curDot = document.getElementById("cur-dot");
const curRing = document.getElementById("cur-ring");
let mx = 0, my = 0, sparkTimer = 0;

if (!IS_TOUCH) {
  document.addEventListener("mousemove", (e) => {
    mx = e.clientX; my = e.clientY;
    gsap.set(curDot, { x: mx, y: my });
    gsap.to(curRing, { x: mx, y: my, duration: 0.15, ease: "power2.out" });
    sparkTimer++;
    if (sparkTimer % 5 === 0) spawnSpark(mx, my);
  });
  document.querySelectorAll("a, button, [data-magnetic], .flyer-card, .cover-card, .duo-card, .pledge").forEach((el) => {
    el.addEventListener("mouseenter", () => curRing.classList.add("hover"));
    el.addEventListener("mouseleave", () => curRing.classList.remove("hover"));
  });
}

function spawnSpark(x, y) {
  const s = document.createElement("div");
  s.className = "cursor-spark";
  s.textContent = ["✦", "★", "·"][Math.floor(Math.random() * 3)];
  s.style.left = x + "px"; s.style.top = y + "px";
  s.style.fontSize = (8 + Math.random() * 8) + "px";
  document.body.appendChild(s);
  gsap.to(s, {
    y: -(20 + Math.random() * 25), x: (Math.random() - 0.5) * 35,
    opacity: 0, scale: 0,
    duration: 0.4 + Math.random() * 0.3, ease: "power2.out",
    onComplete: () => s.remove(),
  });
}

/* ═══ SCROLL PROGRESS + NAV ═══ */
const prog = document.getElementById("scroll-prog");
window.addEventListener("scroll", () => {
  const p = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  prog.style.width = p * 100 + "%";
  document.getElementById("nav").classList.toggle("scrolled", window.scrollY > 60);
});

/* ═══ MAGNETIC ═══ */
function initMagnetic() {
  if (IS_TOUCH) return;
  document.querySelectorAll("[data-magnetic]").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - r.left - r.width / 2;
      const dy = e.clientY - r.top - r.height / 2;
      gsap.to(el, { x: dx * 0.35, y: dy * 0.35, duration: 0.3, ease: "power2.out" });
    });
    el.addEventListener("mouseleave", () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,0.3)" });
    });
  });
}

/* ═══ 3D TILT ═══ */
function initTilt() {
  if (IS_TOUCH) return;
  document.querySelectorAll("[data-tilt]").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const cx = (e.clientX - r.left) / r.width - 0.5;
      const cy = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(el, { rotateY: cx * 12, rotateX: -cy * 10, transformPerspective: 900, duration: 0.3, ease: "power2.out" });
    });
    el.addEventListener("mouseleave", () => {
      gsap.to(el, { rotateY: 0, rotateX: 0, duration: 0.6, ease: "elastic.out(1,0.3)" });
    });
  });
}

/* ═══ PLATE HERO — HOLOGRAPHIC + TILT + STAMP ═══ */
function initPlate() {
  const plate = document.getElementById("plate");
  if (!plate) return;

  if (!IS_TOUCH) {
    plate.addEventListener("mousemove", (e) => {
      const r = plate.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      gsap.to(plate, {
        rotateY: (px - 0.5) * 14, rotateX: -(py - 0.5) * 10,
        transformPerspective: 1000,
        duration: 0.4, ease: "power2.out",
      });
      plate.style.setProperty("--shine-x", px * 100 + "%");
      plate.style.setProperty("--shine-y", py * 100 + "%");
      plate.style.setProperty("--holo-pos", (px * 100 - 20) + "%");
    });
    plate.addEventListener("mouseleave", () => {
      gsap.to(plate, { rotateY: 0, rotateX: 0, duration: 0.8, ease: "elastic.out(1,0.25)" });
    });
  }

}

/* ═══ HERO ENTRANCE — PALM DRIVE ZOOM-TO-PLATE ═══ */
function initHero() {
  const carMain = document.getElementById("hero-car-main");
  const isSmall = window.innerWidth <= 600;

  if (carMain) {
    gsap.set(carMain, { xPercent: -50, yPercent: -50, scale: 0.03, opacity: 0 });
  }

  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  tl.from(".hero-highway", {
    opacity: 0, scaleY: 0, transformOrigin: "bottom center",
    duration: 0.6, ease: "power2.out",
  })
  .from(".palm", {
    opacity: 0, scaleY: 0, transformOrigin: "bottom center",
    duration: 0.5, stagger: 0.03, ease: "power2.out",
  }, "-=0.4");

  if (!isSmall && carMain) {
    gsap.set(".plate", { opacity: 0, scale: 0.8 });

    tl.to(carMain, {
      opacity: 1, scale: 0.15,
      duration: 0.3, ease: "power1.out",
    }, "-=0.1")
    .to(carMain, {
      scale: 1.3, y: 40,
      duration: 2.2, ease: "power1.inOut",
    })
    .to({}, { duration: 0.2 })
    // Car vanishes fast
    .to(carMain, {
      opacity: 0,
      duration: 0.3, ease: "power3.in",
    })
    // Plate POPS in — overshoots then snaps back
    .fromTo(".plate",
      { opacity: 0, scale: 0.3 },
      { opacity: 1, scale: 1.12, duration: 0.35, ease: "power4.out" },
      "-=0.2"
    )
    .to(".plate", {
      scale: 1,
      duration: 0.5, ease: "elastic.out(1.2, 0.4)",
    })
    // NO BRAKES slams down
    .from(".hero-eyebrow", {
      y: -40, opacity: 0, scale: 1.4,
      duration: 0.35, ease: "back.out(2.5)",
    }, "-=0.3")
    // Slogan punches up
    .from(".hero-slogan", {
      y: 30, opacity: 0, scale: 0.8,
      duration: 0.4, ease: "back.out(2)",
    }, "-=0.15")
    .from(".hero-below", { y: 30, opacity: 0, duration: 0.3, ease: "back.out(1.5)" }, "-=0.1");
  } else {
    tl.from(".hero-eyebrow", {
      y: -20, opacity: 0,
      duration: 0.3, ease: "back.out(1.7)",
    }, "-=0.1")
    .from(".plate", {
      scale: 0.3, opacity: 0, y: 40,
      duration: 0.8, ease: "elastic.out(1, 0.5)",
    }, "-=0.1");
  }

  tl.fromTo("#plate-shine",
    { opacity: 0.9 },
    { opacity: 0, duration: 0.6, ease: "power2.out" },
    "-=0.1"
  );
}

/* ═══ PLATFORM ═══ */
function initPlatform() {
  gsap.from(".platform-title", {
    scrollTrigger: { trigger: ".platform", start: "top 75%" },
    scale: 0.3, opacity: 0, rotate: -8,
    duration: 0.9, ease: "elastic.out(1,0.5)",
  });

  gsap.from(".platform-hook", {
    scrollTrigger: { trigger: ".platform", start: "top 70%" },
    y: 25, opacity: 0, duration: 0.5, delay: 0.2,
  });

  gsap.from(".acrostic", {
    scrollTrigger: { trigger: ".acrostic", start: "top 85%" },
    y: 15, opacity: 0, duration: 0.5,
    ease: "back.out(1.4)",
  });

  gsap.utils.toArray(".pledge").forEach((row, i) => {
    gsap.from(row, {
      scrollTrigger: { trigger: row, start: "top 90%" },
      x: i % 2 === 0 ? -60 : 60,
      opacity: 0,
      duration: 0.6, delay: i * 0.03,
      ease: "back.out(1.4)",
    });
  });
}

/* ═══ CLASSICS ═══ */
function initClassics() {
  gsap.from(".classics .section-title", {
    scrollTrigger: { trigger: ".classics", start: "top 75%" },
    y: 60, opacity: 0, duration: 0.7, ease: "back.out(1.7)",
  });

  gsap.utils.toArray(".flyer-card").forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: "top 92%" },
      y: 50, opacity: 0, scale: 0.9,
      duration: 0.6,
      delay: (i % 4) * 0.06,
      ease: "back.out(1.5)",
    });
  });
}

/* ═══ COVERS ═══ */
function initCovers() {
  gsap.from(".covers .section-title", {
    scrollTrigger: { trigger: ".covers", start: "top 75%" },
    y: 60, opacity: 0, duration: 0.7, ease: "back.out(1.7)",
  });

  gsap.utils.toArray(".cover-card").forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: "top 92%" },
      scale: 0.5, opacity: 0,
      rotate: gsap.utils.random(-10, 10),
      duration: 0.8,
      delay: (i % 3) * 0.1,
      ease: "elastic.out(1,0.5)",
    });
  });

  document.querySelectorAll("[data-flip]").forEach((card) => {
    card.addEventListener("click", () => card.classList.toggle("flipped"));
  });
}

/* ═══ DUO ═══ */
function initDuo() {
  gsap.from(".duo .section-title", {
    scrollTrigger: { trigger: ".duo", start: "top 75%" },
    y: 60, opacity: 0, duration: 0.7, ease: "back.out(1.7)",
  });

  gsap.utils.toArray(".duo-card").forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: "top 85%" },
      y: 100, opacity: 0, rotate: i === 0 ? -6 : 6, scale: 0.8,
      duration: 0.9, delay: i * 0.15, ease: "back.out(1.5)",
    });
  });
}

/* ═══ VOTE + CONFETTI ═══ */
function initVote() {
  const tl = gsap.timeline({
    scrollTrigger: { trigger: ".vote", start: "top 72%" },
  });

  tl.from(".vote-eyebrow", { y: 30, opacity: 0, duration: 0.5 })
    .from(".vote-heading", {
      scale: 0.3, opacity: 0, rotate: -8,
      duration: 1, ease: "elastic.out(1,0.45)",
    }, "-=0.2")
    .from(".vote-dates", { y: 30, opacity: 0, duration: 0.5 }, "-=0.3")
    .from(".vote-btn", {
      scale: 0, opacity: 0,
      duration: 0.7, ease: "elastic.out(1,0.4)",
    }, "-=0.2");
}

function initConfetti() {
  const btn = document.getElementById("vote-btn");
  if (!btn) return;
  btn.addEventListener("click", (e) => {
    const r = btn.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const colors = ["#A41034", "#F5A623", "#FFFFFF", "#6B0A22", "#FDBE44"];
    for (let i = 0; i < 45; i++) {
      const p = document.createElement("div");
      p.className = "confetti";
      p.style.left = cx + "px"; p.style.top = cy + "px";
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      p.style.width = (6 + Math.random() * 8) + "px";
      p.style.height = (6 + Math.random() * 8) + "px";
      p.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
      document.body.appendChild(p);
      gsap.to(p, {
        x: (Math.random() - 0.5) * 400,
        y: -(80 + Math.random() * 250),
        rotation: (Math.random() - 0.5) * 720,
        scale: 0, opacity: 0,
        duration: 0.7 + Math.random() * 0.6,
        ease: "power2.out",
        onComplete: () => p.remove(),
      });
    }
  });
}

/* ═══ ROAD DIVIDERS ═══ */
function initRoads() {
  gsap.utils.toArray(".road").forEach((road) => {
    gsap.from(road.querySelectorAll(".road-lines span"), {
      scrollTrigger: { trigger: road, start: "top 95%" },
      scaleX: 0, opacity: 0,
      duration: 0.3, stagger: 0.06, ease: "power2.out",
    });
  });
}

/* ═══ MARQUEES ═══ */
function initMarquees() {
  document.querySelectorAll(".marquee-track").forEach((track) => {
    const content = track.innerHTML;
    track.innerHTML = content + content;
  });
}

/* ═══ LIVE CALENDAR FEED ═══ */
const CAL_ID = "6424dd38d459b7005092779a8d37180d26508927ed46e49526ae335190c5e107@group.calendar.google.com";
const API_KEY = "AIzaSyCrL0zxaQPx9x_cI0c4Pp25ITYjZO9jOsA";

async function initCalendar() {
  gsap.from(".upcoming .section-title", {
    scrollTrigger: { trigger: ".upcoming", start: "top 75%" },
    y: 60, opacity: 0, duration: 0.7, ease: "back.out(1.7)",
  });

  const feed = document.getElementById("events-feed");
  const now = new Date().toISOString();
  const twoWeeks = new Date(Date.now() + 14 * 86400000).toISOString();
  const MAX_SHOW = 4;
  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CAL_ID)}/events?key=${API_KEY}&timeMin=${now}&timeMax=${twoWeeks}&orderBy=startTime&singleEvents=true&maxResults=20`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    const events = data.items || [];

    if (events.length === 0) {
      feed.innerHTML = '<p class="events-empty">No upcoming events in the next 2 weeks. Check back soon!</p>';
      return;
    }

    feed.innerHTML = "";
    const today = new Date(); today.setHours(0,0,0,0);
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
    const in3Days = new Date(today); in3Days.setDate(in3Days.getDate() + 3);

    const MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
    const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

    const shown = events.slice(0, MAX_SHOW);
    const hasMore = events.length > MAX_SHOW;

    shown.forEach((ev, i) => {
      const isAllDay = !!ev.start.date;
      const startDate = new Date(ev.start.dateTime || ev.start.date);
      const endDate = new Date(ev.end.dateTime || ev.end.date);
      const evDay = new Date(startDate); evDay.setHours(0,0,0,0);

      let badge = "", badgeClass = "ev-badge--upcoming";
      if (evDay.getTime() === today.getTime()) { badge = "TODAY"; badgeClass = "ev-badge--today"; }
      else if (evDay.getTime() === tomorrow.getTime()) { badge = "TOMORROW"; badgeClass = "ev-badge--soon"; }
      else if (evDay < in3Days) { badge = "THIS WEEK"; badgeClass = "ev-badge--soon"; }
      else { badge = `IN ${Math.ceil((evDay - today) / 86400000)} DAYS`; }

      let timeStr = "All day";
      if (!isAllDay) {
        const fmt = (d) => d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
        timeStr = fmt(startDate) + " – " + fmt(endDate);
      }

      let locationHTML = "";
      if (ev.location) {
        locationHTML = `<p class="ev-location">📍 ${ev.location}</p>`;
      }

      let rsvpHTML = "";
      const desc = ev.description || "";
      const linkMatch = desc.match(/https?:\/\/[^\s<"]+/);
      if (linkMatch) {
        rsvpHTML = `<a href="${linkMatch[0]}" target="_blank" rel="noopener" class="ev-rsvp">RSVP →</a>`;
      }

      const card = document.createElement("div");
      card.className = "ev-card";
      card.setAttribute("data-tilt", "");
      card.innerHTML = `
        <div class="ev-date">
          <span class="ev-date-month">${MONTHS[startDate.getMonth()]}</span>
          <span class="ev-date-day">${startDate.getDate()}</span>
          <span class="ev-date-dow">${DAYS[startDate.getDay()]}</span>
        </div>
        <div class="ev-body">
          <p class="ev-title">${ev.summary || "Event"}</p>
          <p class="ev-meta">${timeStr}</p>
          ${locationHTML}
          ${rsvpHTML}
        </div>
        <span class="ev-badge ${badgeClass}">${badge}</span>
      `;

      feed.appendChild(card);

      gsap.from(card, {
        scrollTrigger: { trigger: card, start: "top 92%" },
        y: 40, opacity: 0,
        duration: 0.5, delay: i * 0.06,
        ease: "back.out(1.4)",
      });
    });

    if (hasMore) {
      const btnWrap = document.createElement("div");
      btnWrap.className = "events-more-wrap";
      btnWrap.innerHTML = `<a href="https://calendar.google.com/calendar/embed?src=${encodeURIComponent(CAL_ID)}&ctz=America%2FLos_Angeles" target="_blank" rel="noopener" class="events-more-btn" data-magnetic>See All ${events.length} Events &rarr;</a>`;
      feed.appendChild(btnWrap);
      gsap.from(btnWrap, { scrollTrigger: { trigger: btnWrap, start: "top 95%" }, y: 20, opacity: 0, duration: 0.4 });
    }

    if (!IS_TOUCH) {
      feed.querySelectorAll("[data-tilt]").forEach((el) => {
        el.addEventListener("mousemove", (e) => {
          const r = el.getBoundingClientRect();
          const cx = (e.clientX - r.left) / r.width - 0.5;
          const cy = (e.clientY - r.top) / r.height - 0.5;
          gsap.to(el, { rotateY: cx * 8, rotateX: -cy * 6, transformPerspective: 900, duration: 0.3, ease: "power2.out" });
        });
        el.addEventListener("mouseleave", () => {
          gsap.to(el, { rotateY: 0, rotateX: 0, duration: 0.6, ease: "elastic.out(1,0.3)" });
        });
        el.addEventListener("mouseenter", () => curRing && curRing.classList.add("hover"));
        el.addEventListener("mouseleave", () => curRing && curRing.classList.remove("hover"));
      });
    }
  } catch (err) {
    console.warn("Calendar fetch failed:", err);
    feed.innerHTML = `
      <div class="events-fallback">
        <p class="events-fallback-msg">Live event data is loading — check back shortly, or view the full calendar below.</p>
        <a href="https://calendar.google.com/calendar/embed?src=${encodeURIComponent(CAL_ID)}&ctz=America%2FLos_Angeles" target="_blank" rel="noopener" class="events-fallback-btn" data-magnetic>View Full Calendar →</a>
      </div>`;
  }
}

/* ═══ INIT ═══ */
window.addEventListener("DOMContentLoaded", () => {
  initMarquees();
  initMagnetic();
  initTilt();
  initConfetti();

  gsap.delayedCall(0.15, () => {
    initPlate();
    initHero();
    initPlatform();
    initClassics();
    initCovers();
    initDuo();
    initCalendar();
    initVote();
    initRoads();
  });
});
