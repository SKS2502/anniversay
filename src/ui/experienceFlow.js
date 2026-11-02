const FINALE_POSITION = { x: 0, z: -19.7 };
const FINALE_DISTANCE = 3.2;

export function createExperienceFlow({
  player,
  prompt,
  copy,
  controls,
  mobileControls,
  memoryPopup,
  onPauseChange,
  touchMode = false,
}) {
  const intro = document.querySelector('#intro-message');
  const pauseButton = document.querySelector('#pause-button');
  const pauseMenu = document.querySelector('#pause-menu');
  const resumeButton = document.querySelector('#resume-button');
  const finale = document.querySelector('#finale');
  const finaleTitle = document.querySelector('#finale-title');
  const finaleMessage = document.querySelector('#finale-message');
  const finaleSignoff = document.querySelector('#finale-signoff');
  const finaleClose = document.querySelector('#finale-close');
  let started = false;
  let paused = false;
  let finaleOpen = false;
  let nearFinale = false;
  let introTimer = 0;

  finaleTitle.textContent = copy.finaleTitle;
  finaleMessage.textContent = copy.finaleMessage;
  finaleSignoff.textContent = copy.finaleSignoff;

  function setPaused(nextPaused) {
    if (!started || paused === nextPaused || finaleOpen || memoryPopup.isOpen()) {
      return;
    }

    paused = nextPaused;
    pauseMenu.hidden = !paused;
    prompt.hidden = paused;
    if (paused) {
      if (document.pointerLockElement) document.exitPointerLock();
      controls.clear();
      mobileControls.clear();
    }
    onPauseChange(paused);
    if (paused) resumeButton.focus();
    else pauseButton.focus();
  }

  function openFinale() {
    if (!nearFinale || finaleOpen || paused || memoryPopup.isOpen()) return false;
    finaleOpen = true;
    prompt.hidden = true;
    if (document.pointerLockElement) document.exitPointerLock();
    finale.hidden = false;
    finaleClose.focus();
    return true;
  }

  function closeFinale() {
    if (!finaleOpen) return;
    finaleOpen = false;
    finale.hidden = true;
  }

  function onKeyDown(event) {
    if (!started || memoryPopup.isOpen()) return;
    if (finaleOpen) {
      if (event.code === 'Escape') {
        event.preventDefault();
        closeFinale();
      }
      return;
    }
    if (
      event.code === 'Escape' &&
      document.pointerLockElement !== null
    ) {
      return;
    }

    if (event.code === 'Escape' || event.code === 'KeyP') {
      event.preventDefault();
      setPaused(!paused);
    }
  }

  pauseButton.addEventListener('click', () => setPaused(true));
  resumeButton.addEventListener('click', () => setPaused(false));
  finaleClose.addEventListener('click', closeFinale);
  finale.addEventListener('click', (event) => {
    if (event.target === finale) closeFinale();
  });
  window.addEventListener('keydown', onKeyDown);

  return {
    start() {
      started = true;
      pauseButton.hidden = false;
      pauseButton.classList.add('pause-control--visible');
      intro.textContent = copy.introduction;
      intro.hidden = false;
      window.clearTimeout(introTimer);
      introTimer = window.setTimeout(() => {
        intro.classList.add('intro-message--hidden');
        window.setTimeout(() => {
          intro.hidden = true;
          intro.classList.remove('intro-message--hidden');
        }, 800);
      }, 3600);
    },
    update() {
      if (!started || paused || finaleOpen || memoryPopup.isOpen()) return;
      const distance = Math.hypot(
        player.group.position.x - FINALE_POSITION.x,
        player.group.position.z - FINALE_POSITION.z,
      );
      nearFinale = distance < FINALE_DISTANCE;
      if (nearFinale) {
        prompt.textContent = touchMode
          ? 'Tap · Read your anniversary message'
          : 'E · Read your anniversary message';
        prompt.hidden = false;
      }
    },
    interact: openFinale,
    isPaused: () => paused,
    isFinaleOpen: () => finaleOpen,
  };
}
