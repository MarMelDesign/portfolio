const footerYear = document.getElementById("footer-year");
const cursor = document.getElementById("cursor");
const portfolioLoader = document.getElementById("portfolio-loader");
const loaderProgress = document.getElementById("loader-progress");
const loaderPhrase = document.getElementById("loader-phrase");
const ticketCard = document.querySelector(".ticket-card");
const ticketExpanded = document.getElementById("ticket-expanded");
const playlistCard = document.querySelector(".playlist-card");
const playlistToggle = document.querySelector(".playlist-toggle");
const softFocusAudio = document.getElementById("soft-focus-audio");
const draggableCards = document.querySelectorAll(".draggable");
const caseWindowLayer = document.getElementById("case-window-layer");
const caseWindow = document.getElementById("case-window");
const caseWindowTitle = document.getElementById("case-window-title");
const caseTitle = document.getElementById("case-title");
const caseSummary = document.getElementById("case-summary");
const caseNote = document.getElementById("case-note");
const caseImageOne = document.getElementById("case-image-one");
const caseImageTwo = document.getElementById("case-image-two");
const caseTags = document.getElementById("case-tags");
const caseLink = document.getElementById("case-link");
const caseWindowClose = document.querySelector(".case-window-close");
const caseWindowBar = document.querySelector(".case-window-bar");
const memoryDesktop = document.querySelector(".board-canvas");
const mobileMagicPopup = document.getElementById("mobile-magic-popup");
const mobileMagicClose = document.querySelector(".mobile-magic-close");

const memorySlugs = {
  SPROOT: "sproot",
  ICRUSH: "icrush",
  "DE SOI": "de-soi",
  VAULTWIN: "vaultwin"
};

if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

const showHeroOnRefresh = () => {
  const navigation = performance.getEntriesByType("navigation")[0];
  const isRefresh = navigation?.type === "reload";

  if (!isRefresh) return;

  if (window.location.hash) {
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
  }

  const html = document.documentElement;
  const previousScrollBehavior = html.style.scrollBehavior;
  html.style.scrollBehavior = "auto";
  window.scrollTo(0, 0);
  requestAnimationFrame(() => {
    window.scrollTo(0, 0);
    html.style.scrollBehavior = previousScrollBehavior;
  });
};

showHeroOnRefresh();
window.addEventListener("pageshow", showHeroOnRefresh);

if (footerYear) {
  footerYear.textContent = new Date().getFullYear();
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const initPortfolioLoader = () => {
  if (!portfolioLoader || !loaderProgress) {
    document.body.classList.remove("is-loading");
    return;
  }

  let progress = 0;
  let loaded = document.readyState === "complete";
  let phraseIndex = -1;
  const startedAt = performance.now();
  const minDuration = prefersReducedMotion ? 500 : 3900;
  const settleDelay = prefersReducedMotion ? 120 : 940;
  const phrases = [
    "preparing something beautiful...",
    "warming up the creative room...",
    "collecting unfinished thoughts...",
    "brewing visual identity...",
    "the cat is supervising the design process..."
  ];

  const setProgress = (value) => {
    progress = Math.min(100, Math.max(progress, value));
    const rounded = Math.round(progress);
    const nextPhraseIndex = Math.min(phrases.length - 1, Math.floor(progress / 20));

    if (loaderPhrase && nextPhraseIndex !== phraseIndex) {
      phraseIndex = nextPhraseIndex;
      loaderPhrase.classList.remove("is-changing");
      void loaderPhrase.offsetWidth;
      loaderPhrase.textContent = phrases[phraseIndex];
      loaderPhrase.classList.add("is-changing");
    }

    portfolioLoader.style.setProperty("--load-progress", (progress / 100).toFixed(3));
    portfolioLoader.style.setProperty("--ripple-duration", `${(2.8 - (progress / 100) * 1.1).toFixed(2)}s`);
    portfolioLoader.style.setProperty("--steam-strength", (0.42 + (progress / 100) * 0.58).toFixed(3));
    portfolioLoader.style.setProperty("--loader-breath", (0.72 + Math.sin(performance.now() / 260) * 0.08).toFixed(3));
    loaderProgress.textContent = rounded;
  };

  const finish = () => {
    setProgress(100);
    window.setTimeout(() => {
      portfolioLoader.classList.add("is-complete");
      document.body.classList.add("loader-exiting");
      portfolioLoader.setAttribute("aria-hidden", "true");
      window.setTimeout(() => {
        document.body.classList.remove("is-loading", "loader-exiting");
        portfolioLoader.remove();
      }, prefersReducedMotion ? 180 : 1300);
    }, settleDelay);
  };

  const tick = () => {
    const elapsed = performance.now() - startedAt;
    const ease = 1 - Math.pow(1 - Math.min(elapsed / minDuration, 1), 2.4);
    const durationProgress = Math.min(88, ease * 88);
    const livingProgress = durationProgress + Math.sin(elapsed / 260) * 1.3 + Math.sin(elapsed / 690) * 1.8;

    if (loaded && elapsed >= minDuration) {
      finish();
      return;
    }

    const loadedProgress = Math.max(livingProgress, Math.min(97, 52 + ease * 45));
    setProgress(loaded ? loadedProgress : livingProgress);
    window.requestAnimationFrame(tick);
  };

  if (!loaded) {
    window.addEventListener("load", () => {
      loaded = true;
    }, { once: true });
  }

  if (!prefersReducedMotion && window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener("pointermove", (event) => {
      const x = (event.clientX / window.innerWidth - .5).toFixed(3);
      const y = (event.clientY / window.innerHeight - .5).toFixed(3);
      portfolioLoader.style.setProperty("--loader-x", x);
      portfolioLoader.style.setProperty("--loader-y", y);
    });
  }

  setProgress(0);
  tick();
};

initPortfolioLoader();

if (cursor && !prefersReducedMotion && window.matchMedia("(pointer: fine)").matches) {
  let cursorX = window.innerWidth / 2;
  let cursorY = window.innerHeight / 2;
  let targetX = cursorX;
  let targetY = cursorY;

  document.body.classList.add("cursor-ready");

  window.addEventListener("mousemove", (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
  });

  const renderCursor = () => {
    cursorX += (targetX - cursorX) * 0.18;
    cursorY += (targetY - cursorY) * 0.18;
    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
    requestAnimationFrame(renderCursor);
  };

  renderCursor();
}

const initTicketExpansion = () => {
  if (!ticketCard || !ticketExpanded) return;

  const closeButtons = ticketExpanded.querySelectorAll(".ticket-backdrop, .ticket-close");
  const closeButton = ticketExpanded.querySelector(".ticket-close");

  const openTicket = () => {
    if (document.body.classList.contains("ticket-open") || ticketCard.classList.contains("is-pulling")) return;

    ticketCard.classList.add("is-pulling");

    window.setTimeout(() => {
      ticketExpanded.setAttribute("aria-hidden", "false");
      document.body.classList.add("ticket-open");
      ticketCard.classList.remove("is-pulling");
      window.setTimeout(() => closeButton?.focus(), 420);
    }, prefersReducedMotion ? 0 : 360);
  };

  const closeTicket = () => {
    document.body.classList.remove("ticket-open");
    ticketExpanded.setAttribute("aria-hidden", "true");
    ticketCard.focus();
  };

  ticketCard.addEventListener("click", (event) => {
    event.preventDefault();
    openTicket();
  });

  closeButtons.forEach((button) => {
    button.addEventListener("click", closeTicket);
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.body.classList.contains("ticket-open")) {
      closeTicket();
    }
  });
};

initTicketExpansion();

const initPlaylistPlayer = () => {
  if (!playlistCard || !playlistToggle || !softFocusAudio) return;

  let isPlaying = false;

  const startMusic = async () => {
    try {
      softFocusAudio.volume = 0.42;
      if (softFocusAudio.readyState === 0) {
        softFocusAudio.load();
      }
      await softFocusAudio.play();
      playlistCard.classList.add("is-playing");
      playlistCard.classList.remove("is-audio-blocked");
      playlistToggle.setAttribute("aria-pressed", "true");
      playlistToggle.setAttribute("aria-label", "Pause soft focus playlist");
      isPlaying = true;
    } catch (error) {
      playlistCard.classList.remove("is-playing");
      playlistCard.classList.add("is-audio-blocked");
      playlistToggle.setAttribute("aria-pressed", "false");
      playlistToggle.setAttribute("aria-label", "Play soft focus playlist");
      isPlaying = false;
    }
  };

  const stopMusic = () => {
    softFocusAudio.pause();
    playlistCard.classList.remove("is-playing");
    playlistToggle.setAttribute("aria-pressed", "false");
    playlistToggle.setAttribute("aria-label", "Play soft focus playlist");
    isPlaying = false;
  };

  playlistToggle.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (isPlaying) {
      stopMusic();
    } else {
      await startMusic();
    }
  });

  ["pointerdown", "mousedown", "touchstart"].forEach((eventName) => {
    playlistToggle.addEventListener(eventName, (event) => {
      event.stopPropagation();
    }, { passive: true });
  });
};

initPlaylistPlayer();

const initMobileMagicPopup = () => {
  if (!mobileMagicPopup || !mobileMagicClose) return;

  const mobileQuery = window.matchMedia("(max-width: 760px)");
  const dismissedKey = "marmel-mobile-magic-dismissed";

  const closePopup = () => {
    mobileMagicPopup.classList.remove("is-visible");
    mobileMagicPopup.setAttribute("aria-hidden", "true");
    sessionStorage.setItem(dismissedKey, "true");
  };

  const maybeShowPopup = () => {
    if (!mobileQuery.matches || sessionStorage.getItem(dismissedKey) === "true") return;

    window.setTimeout(() => {
      if (!mobileQuery.matches || sessionStorage.getItem(dismissedKey) === "true") return;
      mobileMagicPopup.classList.add("is-visible");
      mobileMagicPopup.setAttribute("aria-hidden", "false");
    }, 900);
  };

  mobileMagicClose.addEventListener("click", closePopup);
  mobileQuery.addEventListener?.("change", maybeShowPopup);
  maybeShowPopup();
};

initMobileMagicPopup();

const caseStudies = {
  SPROOT: {
    title: "SPROOT",
    summary: "A media monitoring product shaped into a calmer, clearer workspace for scanning, sorting, and making sense of busy information.",
    note: "The magic was making dense data feel quiet enough to trust.",
    images: ["sproot-2.png", "sproot-1.png"],
    tags: ["UX/UI", "Product", "Research", "Dashboard"]
  },
  ICRUSH: {
    title: "ICRUSH",
    summary: "A bright Web3 social world with expressive brand energy, playful interface moments, and a system built for personality.",
    note: "Keep the energy high, but make every interaction easy to follow.",
    images: ["icrush-1.png", "icrush-2.png"],
    tags: ["Brand", "UX/UI", "Web3", "Social"]
  },
  "DE SOI": {
    title: "DE SOI",
    summary: "A soft romantic visual direction built around mood, texture, and editorial feeling.",
    note: "Let the atmosphere do some of the explaining.",
    images: ["sarang.jpg", "straw.jpg"],
    tags: ["Visual design", "Moodboard", "Brand", "Editorial"]
  },
  VAULTWIN: {
    title: "VAULTWIN",
    summary: "A futuristic blockchain identity experience balanced with structure, contrast, and a polished product language.",
    note: "Make the technical parts feel secure, human, and cinematic.",
    images: ["sproot-1.png", "icrush-2.png"],
    tags: ["Blockchain", "Identity", "UX/UI", "System"]
  }
};

const initCaseWindow = () => {
  if (!caseWindowLayer || !caseWindow || !caseWindowBar) return;

  let lastTrigger = null;
  let isDragging = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;
  let windowX = 0;
  let windowY = 0;
  let caseScrollY = 0;
  let focusReleaseTimer = 0;

  const lockCaseFocus = () => {
    caseScrollY = window.scrollY || document.documentElement.scrollTop || 0;
    document.documentElement.classList.add("case-scroll-lock", "case-focus-open");
    document.body.classList.add("case-scroll-lock");
    document.body.classList.add("case-focus-open");
    document.body.style.top = `-${caseScrollY}px`;
    document.body.style.width = "100%";
  };

  const unlockCaseFocus = () => {
    const previousScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";
    document.documentElement.classList.remove("case-scroll-lock");
    document.body.classList.remove("case-scroll-lock");
    document.body.style.top = "";
    document.body.style.width = "";
    window.scrollTo(0, caseScrollY);
    document.documentElement.style.scrollBehavior = previousScrollBehavior;
  };

  const setWindowPosition = (x, y) => {
    const margin = 16;
    const rect = caseWindow.getBoundingClientRect();
    const maxX = Math.max(margin, window.innerWidth - rect.width - margin);
    const maxY = Math.max(margin, window.innerHeight - rect.height - margin);
    windowX = Math.min(Math.max(x, margin), maxX);
    windowY = Math.min(Math.max(y, margin), maxY);
    caseWindow.style.setProperty("--case-x", `${windowX}px`);
    caseWindow.style.setProperty("--case-y", `${windowY}px`);
  };

  const centerWindow = () => {
    const rect = caseWindow.getBoundingClientRect();
    setWindowPosition((window.innerWidth - rect.width) / 2, (window.innerHeight - rect.height) / 2);
  };

  const renderCaseStudy = (folder) => {
    const key = folder.dataset.project;
    const study = caseStudies[key];
    if (!study) return;

    caseWindowTitle.textContent = study.title;
    caseTitle.textContent = study.title;
    caseSummary.textContent = study.summary;
    caseNote.textContent = study.note;
    caseImageOne.src = study.images[0];
    caseImageTwo.src = study.images[1];
    caseImageOne.alt = `${study.title} pinned mockup`;
    caseImageTwo.alt = `${study.title} scrapbook screenshot`;
    caseLink.href = folder.href;
    caseTags.innerHTML = study.tags.map((tag) => `<li>${tag}</li>`).join("");
  };

  const openCaseWindow = (folder) => {
    window.clearTimeout(focusReleaseTimer);
    lastTrigger = folder;
    renderCaseStudy(folder);
    lockCaseFocus();
    caseWindowLayer.classList.remove("is-closing");
    caseWindowLayer.setAttribute("aria-hidden", "false");
    caseWindow.setAttribute("aria-modal", "true");
    centerWindow();
    requestAnimationFrame(() => {
      caseWindowLayer.classList.add("is-open");
      caseWindowClose?.focus();
    });
  };

  const closeCaseWindow = () => {
    caseWindowLayer.classList.add("is-closing");
    caseWindowLayer.classList.remove("is-open");
    caseWindowLayer.setAttribute("aria-hidden", "true");
    caseWindow.setAttribute("aria-modal", "false");
    document.documentElement.classList.remove("case-focus-open");
    document.body.classList.remove("case-focus-open");
    focusReleaseTimer = window.setTimeout(() => {
      caseWindowLayer.classList.remove("is-closing");
      unlockCaseFocus();
      lastTrigger?.focus({ preventScroll: true });
    }, prefersReducedMotion ? 0 : 820);
  };

  document.querySelectorAll(".desktop-folder").forEach((folder) => {
    const memorySlug = memorySlugs[folder.dataset.project];

    folder.addEventListener("pointerenter", () => {
      if (!memoryDesktop || !memorySlug) return;
      memoryDesktop.dataset.activeMemory = memorySlug;
    });

    folder.addEventListener("pointerleave", () => {
      if (!memoryDesktop || !memorySlug) return;
      window.setTimeout(() => {
        if (!folder.matches(":hover")) memoryDesktop.removeAttribute("data-active-memory");
      }, 180);
    });

    folder.addEventListener("focus", () => {
      if (!memoryDesktop || !memorySlug) return;
      memoryDesktop.dataset.activeMemory = memorySlug;
    });

    folder.addEventListener("blur", () => {
      if (!memoryDesktop || !memorySlug) return;
      memoryDesktop.removeAttribute("data-active-memory");
    });

    folder.addEventListener("click", (event) => {
      event.preventDefault();
      if (memoryDesktop && memorySlug) {
        memoryDesktop.classList.add(`memory-${memorySlug}-discovered`);
        memoryDesktop.dataset.activeMemory = memorySlug;
      }
      openCaseWindow(folder);
    });
  });

  caseWindowClose?.addEventListener("click", closeCaseWindow);

  caseWindowLayer.addEventListener("click", (event) => {
    if (event.target === caseWindowLayer) closeCaseWindow();
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && caseWindowLayer.classList.contains("is-open")) {
      closeCaseWindow();
    }
  });

  caseWindowBar.addEventListener("pointerdown", (event) => {
    if (event.target.closest("button")) return;

    const rect = caseWindow.getBoundingClientRect();
    isDragging = true;
    dragOffsetX = event.clientX - rect.left;
    dragOffsetY = event.clientY - rect.top;
    caseWindow.classList.add("is-dragging");
    caseWindowBar.setPointerCapture(event.pointerId);
  });

  caseWindowBar.addEventListener("pointermove", (event) => {
    if (!isDragging) return;
    setWindowPosition(event.clientX - dragOffsetX, event.clientY - dragOffsetY);
  });

  const stopDragging = (event) => {
    if (!isDragging) return;
    isDragging = false;
    caseWindow.classList.remove("is-dragging");
    if (caseWindowBar.hasPointerCapture(event.pointerId)) {
      caseWindowBar.releasePointerCapture(event.pointerId);
    }
  };

  caseWindowBar.addEventListener("pointerup", stopDragging);
  caseWindowBar.addEventListener("pointercancel", stopDragging);

  window.addEventListener("resize", () => {
    if (!caseWindowLayer.classList.contains("is-open")) return;
    setWindowPosition(windowX, windowY);
  });
};

initCaseWindow();

const revealTargets = document.querySelectorAll(
  ".float-card, .ticket-card, .about, .project-card, .section-heading, .memory-piece, .film-strip, .hand-note, .archive-vinyl, .archive-browser-window, .archive-map-card, .archive-type-card, .archive-coffee-card, .archive-dance-card"
);

if ("IntersectionObserver" in window && !prefersReducedMotion) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealTargets.forEach((target, index) => {
    target.classList.add("reveal");
    target.style.transitionDelay = `${Math.min(index * 35, 210)}ms`;
    revealObserver.observe(target);
  });
} else {
  revealTargets.forEach((target) => target.classList.add("in-view"));
}

if (!prefersReducedMotion && window.matchMedia("(pointer: fine)").matches) {
  draggableCards.forEach((card) => {
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let cardX = 0;
    let cardY = 0;

    card.addEventListener("pointerdown", (event) => {
      if (event.target.closest("button, a, input, textarea, select, audio")) return;

      isDragging = true;
      startX = event.clientX - cardX;
      startY = event.clientY - cardY;
      card.classList.add("dragging");
      card.setPointerCapture(event.pointerId);
    });

    card.addEventListener("pointermove", (event) => {
      if (!isDragging) return;

      cardX = event.clientX - startX;
      cardY = event.clientY - startY;
      card.style.translate = `${cardX}px ${cardY}px`;
    });

    const stopDragging = (event) => {
      if (!isDragging) return;

      isDragging = false;
      card.classList.remove("dragging");

      if (card.hasPointerCapture(event.pointerId)) {
        card.releasePointerCapture(event.pointerId);
      }
    };

    card.addEventListener("pointerup", stopDragging);
    card.addEventListener("pointercancel", stopDragging);
  });
}
