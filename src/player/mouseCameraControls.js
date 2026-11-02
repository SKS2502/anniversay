export function createMouseCameraControls(canvas, cameraController, onStatus) {
  let enabled = false;
  const supportsTouch =
    'ontouchstart' in window || navigator.maxTouchPoints > 0;

  function onCanvasClick(event) {
    if (
      !enabled ||
      event.defaultPrevented ||
      supportsTouch ||
      event.pointerType === 'touch' ||
      document.pointerLockElement === canvas
    ) {
      return;
    }
    canvas.requestPointerLock();
  }

  function onPointerLockChange() {
    if (!enabled) return;
    onStatus(document.pointerLockElement === canvas ? 'locked' : 'released');
  }

  function onPointerLockError() {
    if (enabled) onStatus('unavailable');
  }

  function onKeyDown(event) {
    if (
      enabled &&
      event.code === 'Escape' &&
      document.pointerLockElement === canvas
    ) {
      document.exitPointerLock();
    }
  }

  function onMouseMove(event) {
    if (!enabled || document.pointerLockElement !== canvas) return;
    cameraController.rotateBy(event.movementX, event.movementY);
  }

  canvas.addEventListener('click', onCanvasClick);
  document.addEventListener('pointerlockchange', onPointerLockChange);
  document.addEventListener('pointerlockerror', onPointerLockError);
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('mousemove', onMouseMove);

  return {
    enable() {
      enabled = true;
    },
  };
}
