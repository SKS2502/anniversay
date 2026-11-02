const JOYSTICK_RADIUS = 42;

export function createMobileControls(canvas, joystick, knob, cameraController) {
  const movement = { x: 0, forward: 0 };
  let joystickPointerId = null;
  let cameraPointerId = null;
  let cameraLastX = 0;
  let cameraLastY = 0;
  let enabled = false;

  function updateJoystick(event) {
    const bounds = joystick.getBoundingClientRect();
    const centerX = bounds.left + bounds.width / 2;
    const centerY = bounds.top + bounds.height / 2;
    const deltaX = event.clientX - centerX;
    const deltaY = event.clientY - centerY;
    const distance = Math.min(Math.hypot(deltaX, deltaY), JOYSTICK_RADIUS);
    const angle = Math.atan2(deltaY, deltaX);
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    movement.x = x / JOYSTICK_RADIUS;
    movement.forward = -y / JOYSTICK_RADIUS;
    knob.style.transform = `translate(${x}px, ${y}px)`;
  }

  function releaseJoystick() {
    joystickPointerId = null;
    movement.x = 0;
    movement.forward = 0;
    knob.style.transform = 'translate(0, 0)';
  }

  function onJoystickPointerDown(event) {
    if (!enabled || joystickPointerId !== null) return;
    event.preventDefault();
    joystickPointerId = event.pointerId;
    joystick.setPointerCapture(event.pointerId);
    updateJoystick(event);
  }

  function onJoystickPointerMove(event) {
    if (event.pointerId === joystickPointerId) {
      event.preventDefault();
      updateJoystick(event);
    }
  }

  function onJoystickPointerEnd(event) {
    if (event.pointerId === joystickPointerId) releaseJoystick();
  }

  function onCanvasPointerDown(event) {
    if (
      !enabled ||
      event.pointerType !== 'touch' ||
      event.clientX < window.innerWidth * 0.45
    ) {
      return;
    }

    cameraPointerId = event.pointerId;
    cameraLastX = event.clientX;
    cameraLastY = event.clientY;
    canvas.setPointerCapture(event.pointerId);
  }

  function onCanvasPointerMove(event) {
    if (event.pointerId !== cameraPointerId) return;
    event.preventDefault();
    cameraController.rotateBy(
      (event.clientX - cameraLastX) * 2,
      (event.clientY - cameraLastY) * 2,
    );
    cameraLastX = event.clientX;
    cameraLastY = event.clientY;
  }

  function onCanvasPointerEnd(event) {
    if (event.pointerId === cameraPointerId) cameraPointerId = null;
  }

  joystick.addEventListener('pointerdown', onJoystickPointerDown);
  joystick.addEventListener('pointermove', onJoystickPointerMove);
  joystick.addEventListener('pointerup', onJoystickPointerEnd);
  joystick.addEventListener('pointercancel', onJoystickPointerEnd);
  canvas.addEventListener('pointerdown', onCanvasPointerDown);
  canvas.addEventListener('pointermove', onCanvasPointerMove);
  canvas.addEventListener('pointerup', onCanvasPointerEnd);
  canvas.addEventListener('pointercancel', onCanvasPointerEnd);

  return {
    enable() {
      enabled = true;
    },
    getMovement() {
      return movement;
    },
    clear() {
      if (
        joystickPointerId !== null &&
        joystick.hasPointerCapture(joystickPointerId)
      ) {
        joystick.releasePointerCapture(joystickPointerId);
      }
      releaseJoystick();
      cameraPointerId = null;
    },
  };
}
