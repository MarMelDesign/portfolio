const footerYear = document.getElementById("footer-year");
const cursor = document.getElementById("cursor");
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
      softFocusAudio.load();
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

  const keepButtonInteractive = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  playlistToggle.addEventListener("pointerdown", keepButtonInteractive, true);
  playlistToggle.addEventListener("mousedown", keepButtonInteractive, true);
  playlistToggle.addEventListener("touchstart", keepButtonInteractive, true);

  playlistToggle.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (isPlaying) {
      stopMusic();
    } else {
      await startMusic();
    }
  });
};

initPlaylistPlayer();

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
    lastTrigger = folder;
    renderCaseStudy(folder);
    caseWindowLayer.classList.add("is-open");
    caseWindowLayer.setAttribute("aria-hidden", "false");
    requestAnimationFrame(() => {
      centerWindow();
      caseWindowClose?.focus();
    });
  };

  const closeCaseWindow = () => {
    caseWindowLayer.classList.remove("is-open");
    caseWindowLayer.setAttribute("aria-hidden", "true");
    lastTrigger?.focus();
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
  ".float-card, .ticket-card, .about, .project-card, .section-heading, .memory-piece, .film-strip, .hand-note"
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
