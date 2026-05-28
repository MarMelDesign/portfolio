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
const caseLiveLink = document.getElementById("case-live-link");
const brandingFolderLinks = document.getElementById("branding-folder-links");
const caseWindowClose = document.querySelector(".case-window-close");
const caseWindowBar = document.querySelector(".case-window-bar");
const memoryDesktop = document.querySelector(".board-canvas");
const mobileMagicPopup = document.getElementById("mobile-magic-popup");
const mobileMagicClose = document.querySelector(".mobile-magic-close");
const notebookExplorer = document.querySelector(".notebook-explorer");
const notebookMagnifier = document.querySelector(".notebook-magnifier");
const routeLinks = document.querySelectorAll("[data-workspace-route]");

const initMailtoFallback = () => {
  const journeyButtons = document.querySelectorAll(".journey-button[href^='mailto:']");
  if (!journeyButtons.length) return;

  const email = "melkonyan.designer@gmail.com";

  const showToast = (message) => {
    const toast = document.createElement("div");
    toast.className = "marmel-toast";
    toast.textContent = message;
    Object.assign(toast.style, {
      position: "fixed",
      right: "16px",
      bottom: "16px",
      padding: "10px 14px",
      background: "#111",
      color: "#fff",
      borderRadius: "8px",
      zIndex: 99999,
      boxShadow: "0 6px 18px rgba(0,0,0,.4)"
    });
    document.body.appendChild(toast);
    window.setTimeout(() => toast.classList.add("visible"), 10);
    window.setTimeout(() => toast.remove(), 3000);
  };

  const copyEmail = async () => {
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(email);
        showToast("Email copied to clipboard");
        return;
      } catch (error) {
        // Fall back to a temporary textarea below.
      }
    }

    const textarea = document.createElement("textarea");
    textarea.value = email;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      if (document.execCommand("copy")) showToast("Email copied to clipboard");
    } catch (error) {
      // The mailto link still opens even when clipboard access is unavailable.
    }
    textarea.remove();
  };

  journeyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      window.setTimeout(copyEmail, 250);
    });
  });
};

initMailtoFallback();

const initContentProtection = () => {
  const protectedKeys = new Set(["s", "u", "p"]);

  document.querySelectorAll("img").forEach((image) => {
    image.setAttribute("draggable", "false");
    image.setAttribute("oncontextmenu", "return false");
  });

  const stopEvent = (event) => {
    event.preventDefault();
    event.stopPropagation();
    return false;
  };

  ["contextmenu", "dragstart"].forEach((eventName) => {
    document.addEventListener(eventName, stopEvent, true);
  });

  document.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    const isModifierShortcut = event.ctrlKey || event.metaKey;
    const isDevToolsShortcut =
      event.key === "F12" ||
      ((event.ctrlKey || event.metaKey) && event.shiftKey && ["i", "j", "c"].includes(key)) ||
      (event.metaKey && event.altKey && ["i", "j", "c"].includes(key));

    if (isDevToolsShortcut || (isModifierShortcut && protectedKeys.has(key))) {
      stopEvent(event);
    }
  }, true);

  window.addEventListener("beforeprint", (event) => {
    stopEvent(event);
  });

  const shield = document.createElement("div");
  shield.className = "copyright-shield";
  shield.setAttribute("aria-hidden", "true");
  shield.textContent = "Copyright MarMel. All rights reserved.";
  document.body.appendChild(shield);
};

initContentProtection();

const memorySlugs = {
  SPROOT: "sproot",
  ICRUSH: "icrush",
  "DE SOI": "de-soi",
  VAULTWIN: "vaultwin",
  SARANG: "sarang",
  BRANDING: "branding",
  EVIDENCE: "evidence"
};

const workspaceRoutes = {
  "/": "top",
  "/index.html": "top",
  "/workspace": "top",
  "/workspace/": "top",
  "/workspace/about": "about",
  "/workspace/playground": "work",
  "/workspace/work": "work",
  "/workspace/find-me": "internet"
};

if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

const normalizePath = (path) => path.replace(/\/+$/, "") || "/";

const getWorkspaceRoute = (path = window.location.pathname) => {
  const normalized = normalizePath(path);
  return workspaceRoutes[normalized] ? normalized : null;
};

const getWorkspaceTarget = (path = window.location.pathname) => {
  const route = getWorkspaceRoute(path);
  return route ? document.getElementById(workspaceRoutes[route]) : null;
};

const setActiveWorkspaceRoute = (path = window.location.pathname) => {
  const activeRoute = getWorkspaceRoute(path) || "/workspace";

  routeLinks.forEach((link) => {
    const linkRoute = getWorkspaceRoute(new URL(link.href, window.location.origin).pathname);
    const isActive =
      linkRoute === activeRoute ||
      (activeRoute === "/" && linkRoute === "/workspace") ||
      (linkRoute && workspaceRoutes[linkRoute] === workspaceRoutes[activeRoute]);
    link.classList.toggle("is-active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

const redirectUnknownPortfolioRoute = () => {
  const knownStaticPages = new Set([
    "/",
    "/index.html",
    "/404",
    "/404.html",
    "/de-soi.html",
    "/privacy.html",
    "/resume.html"
  ]);
  const path = normalizePath(window.location.pathname);

  if (getWorkspaceRoute(path) || knownStaticPages.has(path) || path.includes(".")) return;

  try {
    sessionStorage.setItem(loaderSessionKey, "true");
  } catch (error) {
    // The redirect still works if session storage is unavailable.
  }

  window.location.replace("/404.html");
};

const showHeroOnRefresh = () => {
  const navigation = performance.getEntriesByType("navigation")[0];
  const isRefresh = navigation?.type === "reload";

  if (!isRefresh) return;
  if (getWorkspaceRoute() && getWorkspaceRoute() !== "/" && getWorkspaceRoute() !== "/index.html" && getWorkspaceRoute() !== "/workspace") return;

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

const initWorkspaceRoutes = () => {
  const routeScrollOffset = () => Math.min(24, Math.max(0, window.innerHeight * 0.03));
  let routeTransitionTimer = 0;
  let lastObservedRoute = getWorkspaceRoute() || "/workspace";

  const scrollToRoute = (path, shouldPush = true, isInitial = false) => {
    const target = getWorkspaceTarget(path);
    const route = getWorkspaceRoute(path) || "/workspace";
    if (!target) return;

    window.clearTimeout(routeTransitionTimer);
    document.body.classList.add("route-transitioning");
    document.body.dataset.workspaceRoute = route.replace(/^\/workspace\/?/, "") || "home";

    if (shouldPush && normalizePath(window.location.pathname) !== route) {
      window.history.pushState({ workspaceRoute: route }, "", route);
    } else if (!shouldPush && normalizePath(window.location.pathname) !== route) {
      window.history.replaceState({ workspaceRoute: route }, "", route);
    }

    setActiveWorkspaceRoute(route);

    const previousScrollBehavior = document.documentElement.style.scrollBehavior;
    if (isInitial || prefersReducedMotion) {
      document.documentElement.style.scrollBehavior = "auto";
    }

    const top = target === document.getElementById("top")
      ? 0
      : window.scrollY + target.getBoundingClientRect().top - routeScrollOffset();

    window.scrollTo({
      top: Math.max(0, top),
      behavior: isInitial || prefersReducedMotion ? "auto" : "smooth"
    });

    if (isInitial || prefersReducedMotion) {
      requestAnimationFrame(() => {
        document.documentElement.style.scrollBehavior = previousScrollBehavior;
      });
    }

    routeTransitionTimer = window.setTimeout(() => {
      document.body.classList.remove("route-transitioning");
    }, prefersReducedMotion ? 120 : 820);
  };

  routeLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const url = new URL(link.href, window.location.origin);
      if (url.origin !== window.location.origin) return;
      const route = getWorkspaceRoute(url.pathname);
      if (!route) return;

      event.preventDefault();
      scrollToRoute(route, true, false);
    });
  });

  window.addEventListener("popstate", () => {
    scrollToRoute(getWorkspaceRoute() || "/workspace", false, false);
  });

  const initialRoute = getWorkspaceRoute();
  if (initialRoute) {
    window.history.replaceState({ workspaceRoute: initialRoute }, "", initialRoute);
    window.addEventListener("load", () => {
      window.setTimeout(() => {
        scrollToRoute(initialRoute, false, initialRoute !== "/workspace" && initialRoute !== "/");
      }, document.body.classList.contains("is-loading") ? 3900 : 120);
    }, { once: true });
  }

  if ("IntersectionObserver" in window) {
    const sectionRoutes = [
      { route: "/workspace", element: document.querySelector(".hero") },
      { route: "/workspace/about", element: document.getElementById("about") },
      { route: "/workspace/work", element: document.getElementById("work") },
      { route: "/workspace/find-me", element: document.getElementById("internet") }
    ].filter((item) => item.element);

    const observer = new IntersectionObserver((entries) => {
      if (document.body.classList.contains("route-transitioning")) return;

      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      const next = sectionRoutes.find((item) => item.element === visible.target);
      if (!next || next.route === lastObservedRoute) return;

      lastObservedRoute = next.route;
      window.history.replaceState({ workspaceRoute: next.route }, "", next.route);
      setActiveWorkspaceRoute(next.route);
    }, {
      threshold: [0.36, 0.58],
      rootMargin: "-18% 0px -42% 0px"
    });

    sectionRoutes.forEach(({ element }) => observer.observe(element));
  }

  setActiveWorkspaceRoute();
};

if (footerYear) {
  footerYear.textContent = new Date().getFullYear();
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const loaderSessionKey = "marmel-loader-seen";

const shouldShowPortfolioLoader = () => {
  const navigation = performance.getEntriesByType("navigation")[0];
  const isRefresh = navigation?.type === "reload";
  let hasSeenLoader = false;

  try {
    hasSeenLoader = sessionStorage.getItem(loaderSessionKey) === "true";
  } catch (error) {
    hasSeenLoader = false;
  }

  return isRefresh || !hasSeenLoader;
};

const initPortfolioLoader = () => {
  if (!portfolioLoader || !loaderProgress) {
    document.body.classList.remove("is-loading");
    return;
  }

  if (!shouldShowPortfolioLoader()) {
    document.documentElement.classList.add("skip-loader");
    document.body.classList.remove("is-loading", "loader-exiting");
    portfolioLoader.remove();
    return;
  }

  document.documentElement.classList.remove("skip-loader");
  try {
    sessionStorage.setItem(loaderSessionKey, "true");
  } catch (error) {
    // The loader still works if session storage is unavailable.
  }

  let progress = 0;
  let loaded = document.readyState === "complete";
  let phraseIndex = -1;
  const startedAt = performance.now();
  const minDuration = prefersReducedMotion ? 450 : 2200;
  const settleDelay = prefersReducedMotion ? 100 : 520;
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
        if (trackLoaderPointer) {
          window.removeEventListener("pointermove", trackLoaderPointer);
        }
        document.body.classList.remove("is-loading", "loader-exiting");
        portfolioLoader.remove();
      }, prefersReducedMotion ? 180 : 900);
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

  let trackLoaderPointer = null;
  if (!prefersReducedMotion && window.matchMedia("(pointer: fine)").matches) {
    trackLoaderPointer = (event) => {
      const x = (event.clientX / window.innerWidth - .5).toFixed(3);
      const y = (event.clientY / window.innerHeight - .5).toFixed(3);
      portfolioLoader.style.setProperty("--loader-x", x);
      portfolioLoader.style.setProperty("--loader-y", y);
    };
    window.addEventListener("pointermove", trackLoaderPointer);
  }

  setProgress(0);
  tick();
};

redirectUnknownPortfolioRoute();
initPortfolioLoader();
initWorkspaceRoutes();

const initNotebookMagnifier = () => {
  if (!notebookExplorer || !notebookMagnifier || prefersReducedMotion || !window.matchMedia("(pointer: fine)").matches) return;

  const zoom = 2.15;
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let isActive = false;
  let frameId = 0;

  const updateMagnifier = () => {
    currentX += (targetX - currentX) * 0.16;
    currentY += (targetY - currentY) * 0.16;

    const rect = notebookExplorer.getBoundingClientRect();
    const lensSize = notebookMagnifier.offsetWidth || 172;
    const backgroundWidth = rect.width * zoom;
    const backgroundHeight = rect.height * zoom;
    const backgroundX = -(currentX * zoom - lensSize / 2);
    const backgroundY = -(currentY * zoom - lensSize / 2);

    notebookMagnifier.style.setProperty("--lens-x", `${currentX}px`);
    notebookMagnifier.style.setProperty("--lens-y", `${currentY}px`);
    notebookMagnifier.style.setProperty("--book-bg-width", `${backgroundWidth}px`);
    notebookMagnifier.style.setProperty("--book-bg-height", `${backgroundHeight}px`);
    notebookMagnifier.style.setProperty("--book-bg-x", `${backgroundX}px`);
    notebookMagnifier.style.setProperty("--book-bg-y", `${backgroundY}px`);

    if (isActive) frameId = window.requestAnimationFrame(updateMagnifier);
  };

  const moveLens = (event) => {
    const rect = notebookExplorer.getBoundingClientRect();
    targetX = Math.min(Math.max(event.clientX - rect.left, 0), rect.width);
    targetY = Math.min(Math.max(event.clientY - rect.top, 0), rect.height);

    if (!isActive) {
      currentX = targetX;
      currentY = targetY;
      isActive = true;
      notebookExplorer.classList.add("is-exploring");
      window.cancelAnimationFrame(frameId);
      updateMagnifier();
    }
  };

  const hideLens = () => {
    isActive = false;
    notebookExplorer.classList.remove("is-exploring");
    window.cancelAnimationFrame(frameId);
  };

  notebookExplorer.addEventListener("pointerenter", moveLens);
  notebookExplorer.addEventListener("pointermove", moveLens);
  notebookExplorer.addEventListener("pointerleave", hideLens);
  notebookExplorer.addEventListener("pointercancel", hideLens);
};

initNotebookMagnifier();

if (cursor && !prefersReducedMotion && window.matchMedia("(pointer: fine)").matches) {
  let cursorX = window.innerWidth / 2;
  let cursorY = window.innerHeight / 2;
  let targetX = cursorX;
  let targetY = cursorY;
  let cursorFrame = 0;
  let idleTimer = 0;
  let isRenderingCursor = false;

  document.body.classList.add("cursor-ready");

  const stopCursor = () => {
    isRenderingCursor = false;
    window.cancelAnimationFrame(cursorFrame);
  };

  const startCursor = () => {
    if (isRenderingCursor || document.hidden) return;
    isRenderingCursor = true;
    renderCursor();
  };

  window.addEventListener("mousemove", (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
    startCursor();
    window.clearTimeout(idleTimer);
    idleTimer = window.setTimeout(stopCursor, 1200);
  });

  const renderCursor = () => {
    if (!isRenderingCursor || document.hidden) return;
    cursorX += (targetX - cursorX) * 0.18;
    cursorY += (targetY - cursorY) * 0.18;
    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
    cursorFrame = requestAnimationFrame(renderCursor);
  };

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopCursor();
    }
  });
}

const initTicketExpansion = () => {
  if (!ticketCard || !ticketExpanded) return;

  const closeButtons = ticketExpanded.querySelectorAll(".ticket-backdrop, .ticket-close");
  const closeButton = ticketExpanded.querySelector(".ticket-close");
  const ticketPanel = ticketExpanded.querySelector(".ticket-panel");
  let ticketScrollY = 0;

  const getTicketFocusable = () => Array.from(ticketExpanded.querySelectorAll(
    "button:not([disabled]), a[href], [tabindex]:not([tabindex='-1'])"
  )).filter((element) => element.offsetParent !== null);

  const lockTicketScroll = () => {
    ticketScrollY = window.scrollY || document.documentElement.scrollTop || 0;
    document.documentElement.classList.add("ticket-open");
    document.body.classList.add("ticket-open");
    document.body.style.top = `-${ticketScrollY}px`;
    document.body.style.width = "100%";
  };

  const unlockTicketScroll = () => {
    document.documentElement.classList.remove("ticket-open");
    document.body.classList.remove("ticket-open");
    document.body.style.top = "";
    document.body.style.width = "";
    window.scrollTo(0, ticketScrollY);
  };

  const openTicket = () => {
    if (document.body.classList.contains("ticket-open") || ticketCard.classList.contains("is-pulling")) return;

    ticketCard.classList.add("is-pulling");

    window.setTimeout(() => {
      ticketExpanded.setAttribute("aria-hidden", "false");
      ticketPanel?.setAttribute("aria-modal", "true");
      lockTicketScroll();
      ticketCard.classList.remove("is-pulling");
      window.setTimeout(() => closeButton?.focus(), 420);
    }, prefersReducedMotion ? 0 : 360);
  };

  const closeTicket = () => {
    unlockTicketScroll();
    ticketExpanded.setAttribute("aria-hidden", "true");
    ticketPanel?.setAttribute("aria-modal", "false");
    ticketCard.focus({ preventScroll: true });
  };

  const trapTicketFocus = (event) => {
    if (event.key !== "Tab" || !document.body.classList.contains("ticket-open")) return;

    const focusable = getTicketFocusable();
    if (!focusable.length) {
      event.preventDefault();
      closeButton?.focus();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
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
  window.addEventListener("keydown", trapTicketFocus);
};

initTicketExpansion();

const initPlaylistPlayer = () => {
  if (!playlistCard || !playlistToggle || !softFocusAudio) return;

  let isPlaying = false;
  let playlistPointerStart = null;

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

  playlistCard.addEventListener("pointerdown", (event) => {
    if (event.target.closest("button, a, input, textarea, select, audio")) {
      playlistPointerStart = null;
      return;
    }

    playlistPointerStart = {
      x: event.clientX,
      y: event.clientY
    };
  });

  playlistCard.addEventListener("click", async (event) => {
    if (event.target.closest("button, a, input, textarea, select, audio")) return;

    const pointerTravel = playlistPointerStart
      ? Math.hypot(event.clientX - playlistPointerStart.x, event.clientY - playlistPointerStart.y)
      : 0;
    playlistPointerStart = null;

    if (pointerTravel > 8) return;

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
    try {
      sessionStorage.setItem(dismissedKey, "true");
    } catch (error) {
      // The popup can still close if session storage is unavailable.
    }
  };

  const maybeShowPopup = () => {
    let wasDismissed = false;
    try {
      wasDismissed = sessionStorage.getItem(dismissedKey) === "true";
    } catch (error) {
      wasDismissed = false;
    }

    if (!mobileQuery.matches || wasDismissed) return;

    window.setTimeout(() => {
      let dismissedDuringDelay = false;
      try {
        dismissedDuringDelay = sessionStorage.getItem(dismissedKey) === "true";
      } catch (error) {
        dismissedDuringDelay = false;
      }
      if (!mobileQuery.matches || dismissedDuringDelay) return;
      mobileMagicPopup.classList.add("is-visible");
      mobileMagicPopup.setAttribute("aria-hidden", "false");
    }, 900);
  };

  mobileMagicClose.addEventListener("click", closePopup);
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mobileMagicPopup.classList.contains("is-visible")) {
      closePopup();
    }
  });
  if (mobileQuery.addEventListener) {
    mobileQuery.addEventListener("change", maybeShowPopup);
  } else if (mobileQuery.addListener) {
    mobileQuery.addListener(maybeShowPopup);
  }
  maybeShowPopup();
};

initMobileMagicPopup();

const caseStudies = {
  SPROOT: {
    title: "SPROOT",
    summary: "A media monitoring product shaped into a calmer, clearer workspace for scanning, sorting, and making sense of busy information.",
    note: "The magic was making dense data feel quiet enough to trust.",
    images: ["/images/sproot-2-1000.png", "/images/sproot-1-1200.jpg"],
    tags: ["UX/UI", "Product", "Research", "Dashboard"],
    liveUrl: "https://www.sproot.am"
  },
  ICRUSH: {
    title: "ICRUSH",
    summary: "A bright Web3 social world with expressive brand energy, playful interface moments, and a system built for personality.",
    note: "Keep the energy high, but make every interaction easy to follow.",
    images: ["/images/icrush-1-1000.png", "/images/icrush-2-1200.jpg"],
    tags: ["Brand", "UX/UI", "Web3", "Social"]
  },
  "DE SOI": {
    title: "DE SOI",
    summary: "A soft romantic visual direction built around mood, texture, and editorial feeling.",
    note: "Let the atmosphere do some of the explaining.",
    images: ["/images/sarang-1200.jpg", "/images/straw-1200.jpg"],
    tags: ["Visual design", "Moodboard", "Brand", "Editorial"]
  },
  VAULTWIN: {
    title: "VAULTWIN",
    summary: "A futuristic blockchain identity experience balanced with structure, contrast, and a polished product language.",
    note: "Make the technical parts feel secure, human, and cinematic.",
    images: ["/images/sproot-1-1200.jpg", "/images/icrush-2-1200.jpg"],
    tags: ["Blockchain", "Identity", "UX/UI", "System"]
  },
  SARANG: {
    title: "SARANG",
    summary: "A Korean food delivery mobile app designed around appetizing visuals, quick ordering flows, and a warm everyday service experience.",
    note: "Make choosing dinner feel fast, friendly, and a little bit delicious.",
    images: ["/images/sarang-1200.jpg", "/images/straw-1200.jpg"],
    tags: ["Mobile app", "Food delivery", "Korean app", "UX/UI"]
  },
  BRANDING: {
    title: "BRANDING PROJECTS",
    summary: "A collected folder of identity systems, brand atmospheres, and visual directions.",
    note: "Three small worlds gathered into one messy, useful archive.",
    images: ["/images/icrush-1-1000.png", "/images/sarang-1200.jpg"],
    tags: ["Branding", "Identity", "Moodboards", "Visual systems"],
    mood: "branding",
    folders: [
      {
        label: "identity_01",
        url: "https://www.behance.net/gallery/243719865/iCrush-WEB3-BRAND-IDENTITY-UXUI-DESIGN"
      },
      {
        label: "mood_02",
        url: "https://www.behance.net/gallery/162852245/-Love"
      },
      {
        label: "system_03",
        url: "https://www.behance.net/melkonyan_designer"
      }
    ]
  },
  EVIDENCE: {
    title: "evidence_folder",
    summary: "AI helps bring ideas to life, explore visual directions, and build experimental concepts faster. But the emotions, storytelling, art direction, and imagination come from the designer. This portfolio is proof of that collaboration: human feeling shaped through AI-assisted experimentation.",
    note: "generated 482 versions. still moved one pixel manually. human emotions > machine perfection.",
    images: ["/images/me.jpeg", "/images/me-cartoon2-720.png"],
    tags: ["Creative process", "AI assisted", "Art direction", "Human imagination"],
    mood: "evidence"
  }
};

const initCaseWindow = () => {
  const requiredCaseElements = [
    caseWindowLayer,
    caseWindow,
    caseWindowBar,
    caseWindowTitle,
    caseTitle,
    caseSummary,
    caseNote,
    caseImageOne,
    caseImageTwo,
    caseTags,
    caseLink
  ];

  if (requiredCaseElements.some((element) => !element)) return;

  let lastTrigger = null;
  let isDragging = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;
  let windowX = 0;
  let windowY = 0;
  let caseScrollY = 0;
  let focusReleaseTimer = 0;
  const canDragWindow = window.matchMedia("(pointer: fine) and (min-width: 901px)");

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

    caseWindow.classList.toggle("is-evidence-case", study.mood === "evidence");
    caseWindow.classList.toggle("is-branding-case", study.mood === "branding");
    caseWindowTitle.textContent = study.title;
    caseTitle.textContent = study.title;
    caseSummary.textContent = study.summary;
    caseNote.textContent = study.note;
    caseImageOne.src = study.images[0];
    caseImageTwo.src = study.images[1];
    caseImageOne.alt = `${study.title} pinned mockup`;
    caseImageTwo.alt = `${study.title} scrapbook screenshot`;
    caseLink.href = folder.href;
    if (brandingFolderLinks) {
      if (study.folders?.length) {
        brandingFolderLinks.hidden = false;
        brandingFolderLinks.innerHTML = study.folders.map((item, index) => (
          `<a class="branding-mini-folder branding-mini-folder-${index + 1}" href="${item.url}" target="_blank" rel="noopener"><span></span><strong>${item.label}</strong><em>${item.url.replace(/^https?:\/\//, "")}</em></a>`
        )).join("");
      } else {
        brandingFolderLinks.hidden = true;
        brandingFolderLinks.innerHTML = "";
      }
    }
    if (caseLiveLink) {
      if (study.liveUrl) {
        caseLiveLink.href = study.liveUrl;
        caseLiveLink.hidden = false;
      } else {
        caseLiveLink.hidden = true;
        caseLiveLink.removeAttribute("href");
      }
    }
    caseTags.innerHTML = study.tags.map((tag) => `<li>${tag}</li>`).join("");
  };

  const trapCaseFocus = (event) => {
    if (event.key !== "Tab" || !caseWindowLayer.classList.contains("is-open")) return;

    const focusable = Array.from(caseWindow.querySelectorAll(
      'a[href]:not([hidden]), button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )).filter((element) => element.offsetParent !== null);

    if (!focusable.length) {
      event.preventDefault();
      caseWindowClose?.focus();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
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
      if (folder.dataset.casePage === "true") return;

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
  window.addEventListener("keydown", trapCaseFocus);

  caseWindowBar.addEventListener("pointerdown", (event) => {
    if (!canDragWindow.matches) return;
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
  ".float-card, .ticket-card, .about, .project-card, .section-heading, .memory-piece, .film-strip, .hand-note, .internet-artifact"
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
