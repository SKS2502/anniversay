import * as THREE from 'three';
import { createPhotoFrame } from '../world/photoFrame.js';

const INTERACTION_DISTANCE = 2.8;
const IMAGE_PRELOAD_DISTANCE = 6.5;

function createPlaceholderMaterial(colors) {
  const canvas = document.createElement('canvas');
  canvas.width = 160;
  canvas.height = 220;
  const context = canvas.getContext('2d');
  const sky = context.createLinearGradient(0, 0, 0, canvas.height);
  sky.addColorStop(0, colors.sky);
  sky.addColorStop(1, colors.horizon);
  context.fillStyle = sky;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = colors.sun;
  context.beginPath();
  context.arc(112, 62, 22, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = colors.distant;
  context.beginPath();
  context.moveTo(0, 150);
  context.bezierCurveTo(35, 108, 48, 124, 80, 148);
  context.bezierCurveTo(110, 108, 132, 112, 160, 142);
  context.lineTo(160, 220);
  context.lineTo(0, 220);
  context.fill();

  context.fillStyle = colors.near;
  context.beginPath();
  context.moveTo(0, 174);
  context.bezierCurveTo(42, 145, 84, 162, 108, 177);
  context.bezierCurveTo(128, 164, 144, 164, 160, 171);
  context.lineTo(160, 220);
  context.lineTo(0, 220);
  context.fill();

  context.fillStyle = 'rgba(255, 250, 239, 0.72)';
  context.fillRect(0, 205, canvas.width, 15);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.86,
  });
}

export function createMemoryManager({
  memories,
  scene,
  camera,
  canvas,
  player,
  prompt,
  popup,
  touchMode = false,
}) {
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const frameMeshes = [];
  const framesById = new Map();
  const textureLoader = new THREE.TextureLoader();
  const frameSizes = [
    { width: 2.5, height: 3.05 },
    { width: 2.05, height: 2.65 },
    { width: 2.35, height: 1.9 },
  ];
  const resources = {
    frameGeometries: frameSizes.map(
      ({ width, height }) => new THREE.BoxGeometry(width, height, 0.16),
    ),
    imageGeometries: frameSizes.map(
      ({ width, height }) =>
        new THREE.PlaneGeometry(width - 0.32, height - 0.42),
    ),
    lightBarGeometries: frameSizes.map(
      ({ width }) => new THREE.BoxGeometry(width - 0.5, 0.075, 0.09),
    ),
    trimMaterial: new THREE.MeshStandardMaterial({
      color: '#c4a477',
      metalness: 0.55,
      roughness: 0.34,
    }),
    lightBarMaterial: new THREE.MeshStandardMaterial({
      color: '#fff2dc',
      emissive: '#e4cb9f',
      emissiveIntensity: 0.42,
      roughness: 0.36,
    }),
    placeholderMaterials: {
      'WHERE IT STARTED': createPlaceholderMaterial({
        sky: '#ead9c5',
        horizon: '#d8b8a0',
        sun: '#fff1d2',
        distant: '#b88879',
        near: '#73816f',
      }),
      'OUR LITTLE MOMENTS': createPlaceholderMaterial({
        sky: '#d9d7d0',
        horizon: '#c4b8aa',
        sun: '#fff4d9',
        distant: '#a49a8b',
        near: '#748176',
      }),
      'ADVENTURES TOGETHER': createPlaceholderMaterial({
        sky: '#d4e0df',
        horizon: '#b8ccca',
        sun: '#fff1d1',
        distant: '#78959a',
        near: '#54756e',
      }),
      'THE MEMORIES': createPlaceholderMaterial({
        sky: '#e8d2d1',
        horizon: '#d8b7b0',
        sun: '#fff0d3',
        distant: '#b98b87',
        near: '#8a8b75',
      }),
      'FOREVER US': createPlaceholderMaterial({
        sky: '#dfd6e0',
        horizon: '#c9bbca',
        sun: '#fff2d6',
        distant: '#9f879d',
        near: '#728080',
      }),
    },
    placeholderMaterial: new THREE.MeshStandardMaterial({
      color: '#eee8de',
      roughness: 0.82,
    }),
  };
  let nearbyMemory = null;
  let isOpen = false;

  for (const memory of memories) {
    const { group: frame, imagePanel, hitTarget } = createPhotoFrame(
      memory,
      resources,
    );
    framesById.set(memory.id, {
      memory,
      frame,
      imagePanel,
      imageLoadStarted: false,
    });
    frameMeshes.push(hitTarget);
    scene.add(frame);
  }

  function loadPhoto(entry) {
    const { memory, imagePanel } = entry;
    if (!memory.image || entry.imageLoadStarted) return;
    entry.imageLoadStarted = true;
    textureLoader.load(
      memory.image,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        const imageAspect = texture.image.width / texture.image.height;
        const panelAspect =
          imagePanel.geometry.parameters.width /
          imagePanel.geometry.parameters.height;
        if (imageAspect > panelAspect) {
          texture.repeat.x = panelAspect / imageAspect;
          texture.offset.x = (1 - texture.repeat.x) / 2;
        } else {
          texture.repeat.y = imageAspect / panelAspect;
          texture.offset.y = (1 - texture.repeat.y) / 2;
        }
        imagePanel.material = new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.85,
        });
      },
      undefined,
      (error) => {
        console.error(
          `Unable to load photo for ${memory.id} from ${memory.image}`,
          error,
        );
      },
    );
  }

  for (const entry of framesById.values()) loadPhoto(entry);

  function showMemory(memory) {
    if (isOpen) return;
    isOpen = true;
    if (document.pointerLockElement) document.exitPointerLock();
    prompt.hidden = true;
    popup.open(memory, () => {
      isOpen = false;
    });
  }

  function openNearest() {
    if (nearbyMemory) showMemory(nearbyMemory);
  }

  function onCanvasClick(event) {
    if (isOpen || document.pointerLockElement) return;
    const bounds = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(frameMeshes, false)[0];
    if (!hit) return;

    const selected = framesById.get(hit.object.parent.userData.memoryId);
    if (selected) {
      event.preventDefault();
      showMemory(selected.memory);
    }
  }

  canvas.addEventListener('click', onCanvasClick);

  return {
    update() {
      if (isOpen) return;
      let closest = null;
      let closestDistance = INTERACTION_DISTANCE;

      for (const entry of framesById.values()) {
        const { memory, frame } = entry;
        const distance = Math.hypot(
          player.group.position.x - frame.position.x,
          player.group.position.z - frame.position.z,
        );
        if (distance < IMAGE_PRELOAD_DISTANCE) loadPhoto(entry);
        if (distance < closestDistance) {
          closest = memory;
          closestDistance = distance;
        }
      }

      nearbyMemory = closest;
      if (nearbyMemory) {
        prompt.textContent = touchMode
          ? `Tap · Open “${nearbyMemory.title}”`
          : `E · Open “${nearbyMemory.title}”`;
        prompt.hidden = false;
      } else {
        prompt.hidden = true;
      }
    },
    interact: openNearest,
    isOpen: () => isOpen,
  };
}
