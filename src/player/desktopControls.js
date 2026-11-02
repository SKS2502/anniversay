const MOVEMENT_KEYS = new Set([
  'KeyW',
  'KeyA',
  'KeyS',
  'KeyD',
  'ArrowUp',
  'ArrowLeft',
  'ArrowDown',
  'ArrowRight',
  'KeyE',
]);

export function createDesktopControls() {
  const pressedKeys = new Set();
  let enabled = false;
  let interactionPressed = false;

  function onKeyDown(event) {
    if (!enabled || !MOVEMENT_KEYS.has(event.code)) return;
    event.preventDefault();
    pressedKeys.add(event.code);
    if (event.code === 'KeyE' && !event.repeat) interactionPressed = true;
  }

  function onKeyUp(event) {
    pressedKeys.delete(event.code);
  }

  function onBlur() {
    pressedKeys.clear();
  }

  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  window.addEventListener('blur', onBlur);

  return {
    enable() {
      enabled = true;
    },
    getMovement() {
      return {
        x:
          Number(pressedKeys.has('KeyD') || pressedKeys.has('ArrowRight')) -
          Number(pressedKeys.has('KeyA') || pressedKeys.has('ArrowLeft')),
        forward:
          Number(pressedKeys.has('KeyW') || pressedKeys.has('ArrowUp')) -
          Number(pressedKeys.has('KeyS') || pressedKeys.has('ArrowDown')),
      };
    },
    consumeInteraction() {
      const pressed = interactionPressed;
      interactionPressed = false;
      return pressed;
    },
    clear() {
      pressedKeys.clear();
      interactionPressed = false;
    },
  };
}
