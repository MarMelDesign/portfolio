const footerYear = document.getElementById('footer-year');
const updatedDate = document.getElementById('privacy-last-updated');
const portfolioBackLinks = document.querySelectorAll('a[href="index.html"]');

const initContentProtection = () => {
  const protectedKeys = new Set(['c', 'x', 's', 'u', 'p', 'a']);

  document.querySelectorAll('img').forEach((image) => {
    image.setAttribute('draggable', 'false');
    image.setAttribute('oncontextmenu', 'return false');
  });

  const stopEvent = (event) => {
    event.preventDefault();
    event.stopPropagation();
    return false;
  };

  ['contextmenu', 'dragstart', 'copy', 'cut', 'selectstart'].forEach((eventName) => {
    document.addEventListener(eventName, stopEvent, true);
  });

  document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    const isModifierShortcut = event.ctrlKey || event.metaKey;
    const isDevToolsShortcut =
      event.key === 'F12' ||
      ((event.ctrlKey || event.metaKey) && event.shiftKey && ['i', 'j', 'c'].includes(key)) ||
      (event.metaKey && event.altKey && ['i', 'j', 'c'].includes(key));

    if (isDevToolsShortcut || (isModifierShortcut && protectedKeys.has(key))) {
      stopEvent(event);
    }
  }, true);

  window.addEventListener('beforeprint', (event) => {
    stopEvent(event);
  });

  const shield = document.createElement('div');
  shield.className = 'copyright-shield';
  shield.setAttribute('aria-hidden', 'true');
  shield.textContent = 'Copyright MarMel. All rights reserved.';
  document.body.appendChild(shield);
};

initContentProtection();

if (footerYear) {
  footerYear.textContent = new Date().getFullYear();
}

if (updatedDate) {
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date());
  updatedDate.textContent = formattedDate;
}

portfolioBackLinks.forEach((link) => {
  link.addEventListener('click', () => {
    try {
      sessionStorage.setItem('marmel-loader-seen', 'true');
    } catch (error) {
      // Portfolio navigation still works if session storage is unavailable.
    }
  });
});
