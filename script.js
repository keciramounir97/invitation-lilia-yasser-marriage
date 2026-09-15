const scene1 = document.getElementById("scene1");
const scene2 = document.getElementById("scene2");
const introTrigger = document.getElementById("introTrigger");
const bgMusic = document.getElementById("bgMusic");
const mapFrame = document.getElementById("mapFrame");
const musicToggle = document.getElementById("musicToggle");

let revealObserverInitialized = false;
let introStarted = false;
let mapLoaded = false;
let musicMuted = false;

function initRevealAnimations() {
  if (revealObserverInitialized) return;

  const elements = document.querySelectorAll(
    ".reveal-up, .reveal-left, .reveal-right, .reveal-zoom"
  );

  if (!elements.length) return;

  if (!("IntersectionObserver" in window)) {
    elements.forEach((el) => el.classList.add("is-visible"));
    revealObserverInitialized = true;
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: "40px 0px"
  });

  elements.forEach((el) => observer.observe(el));
  revealObserverInitialized = true;
}

function activateFloatingLogo() {
  document.body.classList.add("logo-active");
}

function loadMap() {
  if (mapLoaded || !mapFrame) return;
  const src = mapFrame.getAttribute("data-src");
  if (!src) return;
  mapFrame.src = src;
  mapLoaded = true;
}

function setMusicUi(isMuted) {
  musicMuted = isMuted;
  document.body.classList.toggle("music-muted", isMuted);
  if (!musicToggle) return;
  musicToggle.setAttribute("aria-pressed", String(isMuted));
  musicToggle.setAttribute(
    "aria-label",
    isMuted ? "Remettre la musique" : "Couper la musique"
  );
}

function playMusic() {
  if (!bgMusic) return;
  document.body.classList.add("music-ready");
  bgMusic.volume = 0.85;
  const promise = bgMusic.play();
  if (promise !== undefined) {
    promise.catch(() => {});
  }
  setMusicUi(false);
}

function startMusic() {
  if (musicMuted) return;
  playMusic();
}

function toggleMusic() {
  if (!bgMusic) return;

  if (!bgMusic.paused) {
    bgMusic.pause();
    setMusicUi(true);
    return;
  }

  playMusic();
}

function showScene2() {
  if (!scene2 || !scene1) return;

  scene2.classList.remove("hidden");
  scene1.classList.add("is-finished");

  document.body.classList.remove("intro-active");
  document.body.classList.add("intro-finished");

  activateFloatingLogo();
  loadMap();

  requestAnimationFrame(initRevealAnimations);
}

function startIntro() {
  if (introStarted || !scene1) return;

  introStarted = true;
  scene1.classList.add("is-started");
  activateFloatingLogo();
  startMusic();

  window.setTimeout(showScene2, 850);
}

function handleIntroKeydown(e) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    startIntro();
  }
}

if (introTrigger) {
  introTrigger.addEventListener("click", startIntro, { passive: true });
  introTrigger.addEventListener("keydown", handleIntroKeydown);
}

if (musicToggle) {
  musicToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMusic();
  });
}

/* 25 septembre 2026 à 16h00 */
const weddingDate = new Date(2026, 8, 25, 16, 0, 0).getTime();

const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

function updateCountdown() {
  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  const distance = weddingDate - Date.now();

  if (distance <= 0) {
    daysEl.textContent = "00";
    hoursEl.textContent = "00";
    minutesEl.textContent = "00";
    secondsEl.textContent = "00";
    return;
  }

  daysEl.textContent = String(Math.floor(distance / 86400000)).padStart(2, "0");
  hoursEl.textContent = String(Math.floor((distance % 86400000) / 3600000)).padStart(2, "0");
  minutesEl.textContent = String(Math.floor((distance % 3600000) / 60000)).padStart(2, "0");
  secondsEl.textContent = String(Math.floor((distance % 60000) / 1000)).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

document.addEventListener("DOMContentLoaded", () => {
  if (scene2 && !scene2.classList.contains("hidden")) {
    initRevealAnimations();
    activateFloatingLogo();
    loadMap();
  }
});

document.addEventListener("contextmenu", (e) => e.preventDefault());
document.addEventListener("keydown", (e) => {
  if (e.key === "F12") e.preventDefault();
  if (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key.toUpperCase())) {
    e.preventDefault();
  }
  if (e.ctrlKey && e.key.toUpperCase() === "U") {
    e.preventDefault();
  }
});
