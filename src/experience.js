import { createCamera } from './core/camera.js';
import { createLights } from './core/lights.js';
import { createRenderer } from './core/renderer.js';
import { createScene } from './core/scene.js';
import { experienceCopy } from './config/experience.js';
import { memories } from './config/memories.js';
import { createMemoryManager } from './memories/memoryManager.js';
import { createMemoryPopup } from './memories/memoryPopup.js';
import { createCameraController } from './player/cameraController.js';
import { createDesktopControls } from './player/desktopControls.js';
import { createMobileControls } from './player/mobileControls.js';
import { createMouseCameraControls } from './player/mouseCameraControls.js';
import { createMovement } from './player/movement.js';
import { createPlayer } from './player/player.js';
import { createExperienceFlow } from './ui/experienceFlow.js';
import { createRoom } from './world/room.js';

const mount = document.querySelector('#scene');
const welcome = document.querySelector('#welcome');
const hint = document.querySelector('#experience-hint');
const interactionPrompt = document.querySelector('#interaction-prompt');
const pauseButton = document.querySelector('#pause-button');
const musicButton = document.querySelector('#music-button');
const mobileControlsElement = document.querySelector('#mobile-controls');
const joystick = document.querySelector('#joystick');
const joystickKnob = document.querySelector('#joystick-knob');

const scene = createScene();
const camera = createCamera();
const renderer = createRenderer(mount);
const player = createPlayer();
const movement = createMovement(player);
const cameraController = createCameraController(camera, player);
const controls = createDesktopControls();
const supportsTouch =
  'ontouchstart' in window || navigator.maxTouchPoints > 0;
const mobileControls = createMobileControls(
  renderer.domElement,
  joystick,
  joystickKnob,
  cameraController,
);
const memoryPopup = createMemoryPopup();

scene.add(createLights());
scene.add(createRoom());
cameraController.snap();
const memoryManager = createMemoryManager({
  memories,
  scene,
  camera,
  canvas: renderer.domElement,
  player,
  prompt: interactionPrompt,
  popup: memoryPopup,
  touchMode: supportsTouch,
});
const mouseControls = createMouseCameraControls(
  renderer.domElement,
  cameraController,
  (status) => {
    if (status === 'locked') {
      hint.textContent = 'Mouse look on · Press Esc to release.';
      hint.classList.add('experience__hint--visible');
    } else if (status === 'released') {
      hint.innerHTML =
        'Click the scene to look around. <span>Use W A S D to move · Esc to release mouse.</span>';
      hint.classList.add('experience__hint--visible');
      window.setTimeout(
        () => hint.classList.remove('experience__hint--visible'),
        4500,
      );
    } else if (status === 'unavailable') {
      hint.textContent = 'Mouse look could not be enabled in this browser.';
      hint.classList.add('experience__hint--visible');
    }
  },
);
const experienceFlow = createExperienceFlow({
  player,
  prompt: interactionPrompt,
  copy: experienceCopy,
  controls,
  mobileControls,
  memoryPopup,
  touchMode: supportsTouch,
  onPauseChange(paused) {
    pauseButton.setAttribute('aria-label', paused ? 'Resume experience' : 'Pause experience');
    hint.classList.toggle('experience__hint--visible', !paused);
    mobileControlsElement.classList.toggle('mobile-controls--paused', paused);
  },
});

let experienceStarted = false;
let previousTime = 0;

function resize() {
  const width = mount.clientWidth;
  const height = mount.clientHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

function animate(time) {
  requestAnimationFrame(animate);
  const deltaTime = Math.min((time - previousTime) / 1000, 0.05);
  previousTime = time;

  if (experienceStarted) {
    const keyboardInput = controls.getMovement();
    const touchInput = mobileControls.getMovement();
    if (
      !memoryManager.isOpen() &&
      !experienceFlow.isPaused() &&
      !experienceFlow.isFinaleOpen()
    ) {
      movement.update(
        {
          x: keyboardInput.x + touchInput.x,
          forward: keyboardInput.forward + touchInput.forward,
        },
        deltaTime,
        cameraController.getYaw(),
      );
      memoryManager.update();
      experienceFlow.update();
      if (controls.consumeInteraction()) interact();
      cameraController.update(
        deltaTime,
        Math.hypot(keyboardInput.x + touchInput.x, keyboardInput.forward + touchInput.forward) > 0.05,
      );
    } else {
      controls.consumeInteraction();
      movement.stop();
    }
  }

  renderer.render(scene, camera);
}

function interact() {
  if (!experienceFlow.interact()) memoryManager.interact();
}

export function startExperience() {
  experienceStarted = true;
  controls.enable();
  mobileControls.enable();
  mouseControls.enable();
  experienceFlow.start();
  welcome.classList.add('welcome--hidden');
  mount.classList.add('scene--active');
  if (supportsTouch) {
    mobileControlsElement.classList.add('mobile-controls--visible');
    hint.innerHTML =
      'Your little world is just beginning. <span>Left joystick to move · Drag the right side to look.</span>';
  } else {
    hint.innerHTML =
      'Your little world is just beginning. <span>Click the scene to look around · Use W A S D to move.</span>';
  }
  musicButton.hidden = false;
  musicButton.classList.add('music-control--visible');
  hint.classList.add('experience__hint--visible');
  window.setTimeout(
    () => hint.classList.remove('experience__hint--visible'),
    5500,
  );
  mount.focus({ preventScroll: true });
}

interactionPrompt.addEventListener('click', interact);
window.addEventListener('resize', resize);

resize();
requestAnimationFrame(animate);
