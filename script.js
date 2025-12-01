// ---------- Make NO button run away but START under the dialog ----------
const noButton = document.getElementById("noBtn");
const headerEl = document.querySelector(".site-nav");

function getHeaderBottom() {
  const rect = headerEl?.getBoundingClientRect();
  return rect ? rect.bottom + 10 : 60;
}

function activatedNoButton() {
  // When hovered first time → switch to absolute positioning
  if (noButton.style.position !== "absolute") {
    const rect = noButton.getBoundingClientRect();
    noButton.style.position = "absolute";
    noButton.style.left = rect.left + "px";
    noButton.style.top = rect.top + "px";
  }
}

function moveNoButton() {
  activatedNoButton();

  const btnW = noButton.offsetWidth;
  const btnH = noButton.offsetHeight;

  const margin = 20;
  const headerLimit = getHeaderBottom();

  const maxLeft = window.innerWidth - btnW - margin;
  const maxTop = window.innerHeight - btnH - margin;

  const randomX = Math.random() * (maxLeft - margin) + margin;
  const randomY = Math.random() * (maxTop - headerLimit) + headerLimit;

  noButton.style.left = randomX + "px";
  noButton.style.top = randomY + "px";
}

// Run away on hover or click
noButton.addEventListener("mouseenter", moveNoButton);
noButton.addEventListener("click", moveNoButton);


// ---------- Sparkle trail (throttled) ----------
(function sparkleTrail() {
  let last = 0;
  const throttleMs = 20; // every 20ms max (adjustable)

  function makeSparkle(x, y) {
    const s = document.createElement('div');
    s.className = 'sparkle';

    // small random size + hue variation
    const size = 6 + Math.random() * 10;
    s.style.width = s.style.height = size + 'px';

    // random tint subtle
    const hues = [
      'rgba(255, 140, 238, 1)', // pink
      'rgba(135, 206, 250, 1)', // sky
      'rgba(255, 250, 205, 1)'  // soft yellow
    ];
    s.style.background = `radial-gradient(circle, ${hues[Math.floor(Math.random()*hues.length)]} 30%, rgba(255,255,255,0) 70%)`;

    s.style.left = x + 'px';
    s.style.top  = y + 'px';

    document.body.appendChild(s);

    // cleanup after animation duration
    setTimeout(() => {
      if (s && s.parentNode) s.parentNode.removeChild(s);
    }, 700);
  }

  document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - last < throttleMs) return;
    last = now;

    // create 1-2 sparkles per tick for richer trail
    makeSparkle(e.clientX + (Math.random()*8 - 4), e.clientY + (Math.random()*8 - 4));
    if (Math.random() > 0.5) makeSparkle(e.clientX + (Math.random()*12 - 6), e.clientY + (Math.random()*12 - 6));
  }, { passive: true });

  // Also add support for touch (mobile)
  document.addEventListener('touchmove', (e) => {
    const t = e.touches[0];
    if (!t) return;
    makeSparkle(t.clientX, t.clientY);
  }, { passive: true });
})();


/* ---------- BACKGROUND MUSIC TOGGLE & ANIMATION ---------- */
(function musicSystem() {
  const musicBtn = document.getElementById('musicToggle');
  const audio = document.getElementById('bgMusic');

  if (!musicBtn || !audio) return;

  // Build equalizer bars inside .eq (in case HTML didn't include them for some reason)
  // (HTML already includes .eq and bars — this is a safe-guard)

  function setPlayingState(isPlaying) {
    if (isPlaying) {
      musicBtn.classList.add('playing');
      musicBtn.setAttribute('aria-pressed', 'true');
    } else {
      musicBtn.classList.remove('playing');
      musicBtn.setAttribute('aria-pressed', 'false');
    }
  }

  // Try autoplaying once (many browsers block this if not user-initiated)
  audio.volume = 0.6; // gentle volume
  audio.play().then(() => {
    setPlayingState(true);
  }).catch(() => {
    // Autoplay blocked — show not-playing state until user clicks
    setPlayingState(false);
  });

  // Toggle when user clicks the music button
  musicBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    if (audio.paused) {
      try {
        await audio.play();
        setPlayingState(true);
      } catch (err) {
        console.warn('Playback failed:', err);
        setPlayingState(false);
      }
    } else {
      audio.pause();
      setPlayingState(false);
    }
  });

  // Keep button state in sync with audio events (e.g., ended)
  audio.addEventListener('pause', () => setPlayingState(false));
  audio.addEventListener('play', () => setPlayingState(true));

  // small UX: let pressing 'm' toggle music
  document.addEventListener('keydown', (ev) => {
    if (ev.key.toLowerCase() === 'm') {
      musicBtn.click();
    }
  });
})();


// POPUP ELEMENTS
const popup = document.getElementById("lovePopup");
const closePopup = document.getElementById("closePopup");
const yesButton = document.getElementById("yesBtn");

// YES → SHOW POPUP
yesButton.addEventListener("click", () => {
  popup.style.display = "flex";  // show modal popup
});

// CLOSE BUTTON → HIDE POPUP
closePopup.addEventListener("click", () => {
  popup.style.display = "none";
});

