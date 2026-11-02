import * as THREE from 'three';
import {
  GALLERY_FRAME_RADIUS,
  GALLERY_WALL_RADIUS,
  gallerySections,
  letterStandMessages,
  LETTER_STAND_RADIUS,
  PLANTER_POSITIONS,
} from '../config/gallery.js';
import { createLetterStand } from './letterStand.js';

const WALL_HEIGHT = 9.2;
const RADIAL_SEGMENTS = 96;

function createFloor() {
  const floor = new THREE.Group();
  const floorMaterial = new THREE.MeshStandardMaterial({
    color: '#e8e0d5',
    roughness: 0.78,
    metalness: 0.025,
  });
  const floorDisc = new THREE.Mesh(
    new THREE.CircleGeometry(GALLERY_WALL_RADIUS, RADIAL_SEGMENTS),
    floorMaterial,
  );
  floorDisc.rotation.x = -Math.PI / 2;
  floorDisc.position.y = -0.035;
  floor.add(floorDisc);

  const inlayMaterial = new THREE.MeshStandardMaterial({
    color: '#c6a77d',
    metalness: 0.52,
    roughness: 0.38,
  });
  for (const radius of [5.2, 10.4, 15.6, GALLERY_FRAME_RADIUS - 1.4]) {
    const inlay = new THREE.Mesh(
      new THREE.TorusGeometry(radius, 0.025, 5, RADIAL_SEGMENTS),
      inlayMaterial,
    );
    inlay.rotation.x = Math.PI / 2;
    inlay.position.y = 0.006;
    floor.add(inlay);
  }

  const centerMedallion = new THREE.Mesh(
    new THREE.CircleGeometry(2.3, 64),
    new THREE.MeshStandardMaterial({
      color: '#eee4dd',
      roughness: 0.62,
      metalness: 0.04,
    }),
  );
  centerMedallion.rotation.x = -Math.PI / 2;
  centerMedallion.position.y = 0.008;
  floor.add(centerMedallion);

  return floor;
}

function createCurvedArchitecture() {
  const architecture = new THREE.Group();
  const wallMaterial = new THREE.MeshStandardMaterial({
    color: '#f5f1e9',
    roughness: 0.88,
    side: THREE.BackSide,
  });
  const ceilingMaterial = new THREE.MeshStandardMaterial({
    color: '#fffaf0',
    roughness: 0.9,
  });
  const wall = new THREE.Mesh(
    new THREE.CylinderGeometry(
      GALLERY_WALL_RADIUS,
      GALLERY_WALL_RADIUS,
      WALL_HEIGHT,
      RADIAL_SEGMENTS,
      1,
      true,
    ),
    wallMaterial,
  );
  wall.position.y = WALL_HEIGHT / 2;
  architecture.add(wall);

  const ceiling = new THREE.Mesh(
    new THREE.CircleGeometry(GALLERY_WALL_RADIUS, RADIAL_SEGMENTS),
    ceilingMaterial,
  );
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = WALL_HEIGHT;
  architecture.add(ceiling);

  const champagne = new THREE.MeshStandardMaterial({
    color: '#d3b88f',
    metalness: 0.55,
    roughness: 0.34,
  });
  const pearl = new THREE.MeshStandardMaterial({
    color: '#fff4dc',
    emissive: '#dbc5a0',
    emissiveIntensity: 0.24,
    roughness: 0.48,
  });

  const cove = new THREE.Mesh(
    new THREE.CylinderGeometry(
      GALLERY_WALL_RADIUS - 0.6,
      GALLERY_WALL_RADIUS - 0.6,
      0.58,
      RADIAL_SEGMENTS,
      1,
      true,
    ),
    new THREE.MeshStandardMaterial({
      color: '#ebe4d9',
      roughness: 0.82,
      side: THREE.BackSide,
    }),
  );
  cove.position.y = WALL_HEIGHT - 1.12;
  architecture.add(cove);

  for (const [radius, tube, y, material] of [
    [GALLERY_WALL_RADIUS - 0.14, 0.12, 0.2, champagne],
    [GALLERY_WALL_RADIUS - 0.14, 0.16, 0.78, pearl],
    [GALLERY_WALL_RADIUS - 0.14, 0.16, WALL_HEIGHT - 0.18, champagne],
    [GALLERY_WALL_RADIUS - 0.68, 0.08, WALL_HEIGHT - 0.48, pearl],
    [GALLERY_WALL_RADIUS - 1.05, 0.035, WALL_HEIGHT - 0.88, champagne],
    [4.6, 0.1, WALL_HEIGHT - 0.42, pearl],
    [3.2, 0.045, WALL_HEIGHT - 0.42, champagne],
  ]) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(radius, tube, 8, RADIAL_SEGMENTS),
      material,
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = y;
    architecture.add(ring);
  }

  const skylight = new THREE.Mesh(
    new THREE.CircleGeometry(3.05, 64),
    new THREE.MeshStandardMaterial({
      color: '#fff8e9',
      emissive: '#fff0d5',
      emissiveIntensity: 0.38,
      roughness: 0.45,
    }),
  );
  skylight.rotation.x = Math.PI / 2;
  skylight.position.y = WALL_HEIGHT - 0.12;
  architecture.add(skylight);

  return architecture;
}

function createWallPanels() {
  const panels = new THREE.Group();
  const panelGeometry = new THREE.BoxGeometry(3.55, 5.2, 0.14);
  const panelMaterial = new THREE.MeshStandardMaterial({
    color: '#f0ebe2',
    roughness: 0.86,
    metalness: 0.015,
  });
  const panelMesh = new THREE.InstancedMesh(panelGeometry, panelMaterial, 16);
  const pilasterGeometry = new THREE.CylinderGeometry(0.13, 0.16, 7.25, 8);
  const pilasterMaterial = new THREE.MeshStandardMaterial({
    color: '#e8e0d4',
    roughness: 0.72,
    metalness: 0.04,
  });
  const pilasters = new THREE.InstancedMesh(
    pilasterGeometry,
    pilasterMaterial,
    16,
  );
  const detail = new THREE.Object3D();
  const panelRadius = GALLERY_WALL_RADIUS - 0.25;
  const detailRadius = GALLERY_WALL_RADIUS - 0.62;
  const frameStep = (Math.PI * 2) / 16;
  const firstFrameAngle = -Math.PI / 2 + frameStep / 2;
  let pilasterIndex = 0;

  for (let index = 0; index < 16; index += 1) {
    const angle = firstFrameAngle + index * frameStep;
    const frameRotation = -angle - Math.PI / 2;
    detail.position.set(
      panelRadius * Math.cos(angle),
      3.75,
      panelRadius * Math.sin(angle),
    );
    detail.rotation.set(0, frameRotation, 0);
    detail.updateMatrix();
    panelMesh.setMatrixAt(index, detail.matrix);
    panelMesh.setColorAt(
      index,
      new THREE.Color(
        ['#eee8de', '#f3eee6', '#f0e5e2', '#e9e9df'][index % 4],
      ),
    );
    const pilasterAngle = angle + frameStep / 2;
    const distanceToFocal = Math.abs(
      Math.atan2(
        Math.sin(pilasterAngle + Math.PI / 2),
        Math.cos(pilasterAngle + Math.PI / 2),
      ),
    );
    if (distanceToFocal < frameStep / 4) continue;
    detail.position.set(
      detailRadius * Math.cos(pilasterAngle),
      4.45,
      detailRadius * Math.sin(pilasterAngle),
    );
    detail.rotation.set(0, -pilasterAngle - Math.PI / 2, 0);
    detail.updateMatrix();
    pilasters.setMatrixAt(pilasterIndex, detail.matrix);
    pilasterIndex += 1;
  }

  panelMesh.instanceMatrix.needsUpdate = true;
  pilasters.count = pilasterIndex;
  pilasters.instanceMatrix.needsUpdate = true;
  if (panelMesh.instanceColor) panelMesh.instanceColor.needsUpdate = true;
  panels.add(panelMesh, pilasters);
  return panels;
}

function createSectionPlaque(title, angle) {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 112;
  const context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = '#7b6b58';
  context.font = '500 33px sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.letterSpacing = '5px';
  context.fillText(title, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const plaque = new THREE.Mesh(
    new THREE.PlaneGeometry(4.4, 0.78),
    new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
    }),
  );
  plaque.position.set(
    (GALLERY_FRAME_RADIUS - 0.18) * Math.cos(angle),
    6.55,
    (GALLERY_FRAME_RADIUS - 0.18) * Math.sin(angle),
  );
  plaque.rotation.y = -angle - Math.PI / 2;
  return plaque;
}

function createGalleryLabels() {
  const labels = new THREE.Group();
  let frameIndex = 0;
  const step = (Math.PI * 2) / 16;
  const halfStep = step / 2;

  for (const section of gallerySections) {
    const firstAngle = -Math.PI / 2 + halfStep + frameIndex * step;
    const lastAngle = firstAngle + (section.memories.length - 1) * step;
    let centerAngle = (firstAngle + lastAngle) / 2;
    const pilasterStep = Math.PI / 8;
    const nearestPilaster =
      -((3 * Math.PI) / 8) +
      Math.round((centerAngle + (3 * Math.PI) / 8) / pilasterStep) *
        pilasterStep;
    const pilasterOffset = Math.atan2(
      Math.sin(centerAngle - nearestPilaster),
      Math.cos(centerAngle - nearestPilaster),
    );
    if (Math.abs(pilasterOffset) < 0.01) centerAngle += halfStep;
    labels.add(createSectionPlaque(section.title, centerAngle));
    frameIndex += section.memories.length;
  }
  return labels;
}

function createAnniversaryBanner(
  text,
  angle,
  boardGeometry,
  boardMaterial,
  faceGeometry,
  studGeometry,
  studMaterial,
) {
  const banner = new THREE.Group();
  const board = new THREE.Mesh(boardGeometry, boardMaterial);
  banner.add(board);

  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 240;
  const context = canvas.getContext('2d');
  const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#fffaf1');
  gradient.addColorStop(0.5, '#f4eadb');
  gradient.addColorStop(1, '#fffaf1');
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.strokeStyle = '#c7a576';
  context.lineWidth = 5;
  context.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
  context.strokeStyle = 'rgba(199, 165, 118, 0.58)';
  context.lineWidth = 2;
  context.strokeRect(32, 32, canvas.width - 64, canvas.height - 64);

  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillStyle = '#a9855c';
  context.font = '44px Georgia, serif';
  context.fillText('♥', 92, canvas.height / 2);
  context.fillText('♥', canvas.width - 92, canvas.height / 2);

  context.fillStyle = '#655747';
  let fontSize = 58;
  context.font = `600 ${fontSize}px Georgia, serif`;
  while (context.measureText(text).width > 900 && fontSize > 36) {
    fontSize -= 2;
    context.font = `600 ${fontSize}px Georgia, serif`;
  }
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  const face = new THREE.Mesh(
    faceGeometry,
    new THREE.MeshBasicMaterial({
      map: texture,
      toneMapped: false,
    }),
  );
  face.position.z = 0.061;
  banner.add(face);

  for (const x of [-2.48, 2.48]) {
    const stud = new THREE.Mesh(studGeometry, studMaterial);
    stud.position.set(x, 0, 0.075);
    banner.add(stud);
  }

  banner.position.set(
    (GALLERY_WALL_RADIUS - 1) * Math.cos(angle),
    7.25,
    (GALLERY_WALL_RADIUS - 1) * Math.sin(angle),
  );
  banner.rotation.y = -angle - Math.PI / 2;
  return banner;
}

function createAnniversaryBanners() {
  const banners = new THREE.Group();
  const boardGeometry = new THREE.BoxGeometry(5.55, 1.19, 0.12);
  const faceGeometry = new THREE.PlaneGeometry(5.45, 1.09);
  const studGeometry = new THREE.SphereGeometry(0.055, 8, 6);
  const boardMaterial = new THREE.MeshStandardMaterial({
    color: '#c4a477',
    metalness: 0.48,
    roughness: 0.4,
  });
  const studMaterial = new THREE.MeshStandardMaterial({
    color: '#bd9a68',
    metalness: 0.52,
    roughness: 0.38,
  });
  const placements = [
    { text: 'HAPPY 2ND ANNIVERSARY', angle: -(5 * Math.PI) / 16 },
    { text: 'TWO YEARS OF US', angle: (7 * Math.PI) / 16 },
    { text: 'OUR FAVORITE STORY', angle: (19 * Math.PI) / 16 },
  ];

  placements.forEach(({ text, angle }) => {
    banners.add(
      createAnniversaryBanner(
        text,
        angle,
        boardGeometry,
        boardMaterial,
        faceGeometry,
        studGeometry,
        studMaterial,
      ),
    );
  });
  banners.name = 'anniversary-wall-banners';
  return banners;
}

function createPlanterRing() {
  const planters = new THREE.Group();
  const potGeometry = new THREE.LatheGeometry(
    [
      [0, 0],
      [0.26, 0],
      [0.3, 0.08],
      [0.4, 0.34],
      [0.44, 0.49],
      [0.39, 0.56],
      [0.34, 0.56],
      [0.34, 0.5],
      [0.36, 0.34],
      [0.26, 0.08],
      [0, 0.08],
    ].map(([radius, height]) => new THREE.Vector2(radius, height)),
    16,
  );
  const potMaterial = new THREE.MeshStandardMaterial({
    color: '#c89c87',
    roughness: 0.58,
    metalness: 0.04,
  });
  const pots = new THREE.InstancedMesh(
    potGeometry,
    potMaterial,
    PLANTER_POSITIONS.length,
  );
  const rimGeometry = new THREE.TorusGeometry(0.405, 0.025, 6, 20);
  const rimMaterial = new THREE.MeshStandardMaterial({
    color: '#c6a77d',
    metalness: 0.46,
    roughness: 0.4,
  });
  const rims = new THREE.InstancedMesh(
    rimGeometry,
    rimMaterial,
    PLANTER_POSITIONS.length,
  );
  const soilGeometry = new THREE.CircleGeometry(0.34, 16);
  const soilMaterial = new THREE.MeshStandardMaterial({
    color: '#6f6556',
    roughness: 0.96,
  });
  const soil = new THREE.InstancedMesh(
    soilGeometry,
    soilMaterial,
    PLANTER_POSITIONS.length,
  );
  const stemGeometry = new THREE.CylinderGeometry(0.018, 0.025, 1, 5);
  const stemMaterial = new THREE.MeshStandardMaterial({
    color: '#72866e',
    roughness: 0.88,
  });
  const stems = new THREE.InstancedMesh(
    stemGeometry,
    stemMaterial,
    PLANTER_POSITIONS.length * 5,
  );
  const leafGeometry = new THREE.SphereGeometry(1, 7, 5);
  const leafMaterial = new THREE.MeshStandardMaterial({
    color: '#91a184',
    roughness: 0.84,
  });
  const leaves = new THREE.InstancedMesh(
    leafGeometry,
    leafMaterial,
    PLANTER_POSITIONS.length * 10,
  );
  const petalGeometry = new THREE.SphereGeometry(1, 7, 5);
  const petalMaterial = new THREE.MeshStandardMaterial({
    color: '#f0c2bd',
    roughness: 0.76,
  });
  const petals = new THREE.InstancedMesh(
    petalGeometry,
    petalMaterial,
    PLANTER_POSITIONS.length * 25,
  );
  const centerGeometry = new THREE.SphereGeometry(0.045, 7, 5);
  const centerMaterial = new THREE.MeshStandardMaterial({
    color: '#e5c785',
    roughness: 0.64,
  });
  const flowerCenters = new THREE.InstancedMesh(
    centerGeometry,
    centerMaterial,
    PLANTER_POSITIONS.length * 5,
  );
  const transform = new THREE.Object3D();
  const potColors = ['#c58f80', '#b6a287', '#9caa98', '#d2a49b'];
  const flowerColors = ['#f0c2bd', '#f1dfbd', '#d8c6df', '#f6e8df'];
  const leafColors = ['#82957b', '#a0aa83', '#849d91'];

  PLANTER_POSITIONS.forEach(({ x, z }, planterIndex) => {
    transform.position.set(x, 0, z);
    transform.rotation.set(0, planterIndex * 0.37, 0);
    transform.scale.set(1, 1, 1);
    transform.updateMatrix();
    pots.setMatrixAt(planterIndex, transform.matrix);
    pots.setColorAt(planterIndex, new THREE.Color(potColors[planterIndex % 4]));

    transform.position.set(x, 0.555, z);
    transform.rotation.set(Math.PI / 2, planterIndex * 0.37, 0);
    transform.updateMatrix();
    rims.setMatrixAt(planterIndex, transform.matrix);

    transform.position.set(x, 0.515, z);
    transform.rotation.set(-Math.PI / 2, 0, 0);
    transform.updateMatrix();
    soil.setMatrixAt(planterIndex, transform.matrix);

    for (let flowerIndex = 0; flowerIndex < 5; flowerIndex += 1) {
      const angle = (flowerIndex / 5) * Math.PI * 2 + planterIndex * 0.43;
      const radius = flowerIndex === 0 ? 0 : 0.2;
      const flowerX = x + Math.cos(angle) * radius;
      const flowerZ = z + Math.sin(angle) * radius;
      const flowerHeight = 1.22 + ((flowerIndex + planterIndex) % 3) * 0.13;
      const stemIndex = planterIndex * 5 + flowerIndex;
      transform.position.set(flowerX, (0.56 + flowerHeight) / 2, flowerZ);
      transform.rotation.set(0.08 * Math.cos(angle), 0, 0.08 * Math.sin(angle));
      transform.scale.set(1, flowerHeight - 0.56, 1);
      transform.updateMatrix();
      stems.setMatrixAt(stemIndex, transform.matrix);

      for (let leafIndex = 0; leafIndex < 2; leafIndex += 1) {
        const side = leafIndex === 0 ? -1 : 1;
        transform.position.set(
          flowerX + Math.cos(angle + side) * 0.11,
          0.83 + leafIndex * 0.2,
          flowerZ + Math.sin(angle + side) * 0.11,
        );
        transform.rotation.set(0.18 * side, -angle, 0.62 * side);
        transform.scale.set(0.19, 0.055, 0.08);
        transform.updateMatrix();
        const leafNumber = planterIndex * 10 + flowerIndex * 2 + leafIndex;
        leaves.setMatrixAt(leafNumber, transform.matrix);
        leaves.setColorAt(
          leafNumber,
          new THREE.Color(leafColors[(planterIndex + leafIndex) % 3]),
        );
      }

      for (let petalIndex = 0; petalIndex < 5; petalIndex += 1) {
        const petalAngle = (petalIndex / 5) * Math.PI * 2;
        transform.position.set(
          flowerX + Math.cos(petalAngle) * 0.075,
          flowerHeight,
          flowerZ + Math.sin(petalAngle) * 0.075,
        );
        transform.rotation.set(0.12, -petalAngle, 0);
        transform.scale.set(0.09, 0.052, 0.065);
        transform.updateMatrix();
        const petalNumber = planterIndex * 25 + flowerIndex * 5 + petalIndex;
        petals.setMatrixAt(petalNumber, transform.matrix);
        petals.setColorAt(
          petalNumber,
          new THREE.Color(
            flowerColors[(planterIndex + flowerIndex) % flowerColors.length],
          ),
        );
      }

      transform.position.set(flowerX, flowerHeight + 0.008, flowerZ);
      transform.rotation.set(0, 0, 0);
      transform.scale.set(1, 1, 1);
      transform.updateMatrix();
      flowerCenters.setMatrixAt(stemIndex, transform.matrix);
      flowerCenters.setColorAt(
        stemIndex,
        new THREE.Color(
          planterIndex % 3 === 0 ? '#dba66e' : '#e5c785',
        ),
      );
    }
  });

  for (const mesh of [pots, rims, soil, stems, leaves, petals, flowerCenters]) {
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }
  planters.add(pots, rims, soil, stems, leaves, petals, flowerCenters);
  planters.name = 'circular-gallery-planters';
  return planters;
}

function createFocalDisplay() {
  const display = new THREE.Group();
  const gold = new THREE.MeshStandardMaterial({
    color: '#c4a477',
    metalness: 0.56,
    roughness: 0.32,
  });
  const ivory = new THREE.MeshStandardMaterial({
    color: '#fff9ee',
    emissive: '#9e8460',
    emissiveIntensity: 0.12,
    roughness: 0.7,
  });

  const backing = new THREE.Mesh(
    new THREE.CircleGeometry(2.5, 64),
    ivory,
  );
  backing.position.set(0, 3.6, -GALLERY_WALL_RADIUS + 0.08);
  display.add(backing);

  for (const [radius, tube, material] of [
    [2.62, 0.09, gold],
    [2.34, 0.025, gold],
  ]) {
    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(radius, tube, 8, 64),
      material,
    );
    halo.position.set(0, 3.6, -GALLERY_WALL_RADIUS + 0.025);
    display.add(halo);
  }

  const messageCanvas = document.createElement('canvas');
  messageCanvas.width = 768;
  messageCanvas.height = 512;
  const messageContext = messageCanvas.getContext('2d');
  messageContext.fillStyle = '#78674e';
  messageContext.textAlign = 'center';
  messageContext.font = '500 74px Georgia, serif';
  messageContext.fillText('OUR STORY', 384, 240);
  messageContext.font = '400 72px Georgia, serif';
  messageContext.fillText('♥', 384, 350);
  const messageTexture = new THREE.CanvasTexture(messageCanvas);
  messageTexture.colorSpace = THREE.SRGBColorSpace;
  const message = new THREE.Mesh(
    new THREE.PlaneGeometry(3.15, 2.1),
    new THREE.MeshBasicMaterial({
      map: messageTexture,
      transparent: true,
      depthWrite: false,
    }),
  );
  message.position.set(0, 3.6, -GALLERY_WALL_RADIUS + 0.15);
  display.add(message);

  const floorDisc = new THREE.Mesh(
    new THREE.CylinderGeometry(1.65, 1.85, 0.14, 64),
    new THREE.MeshStandardMaterial({
      color: '#eee4d6',
      roughness: 0.62,
      metalness: 0.08,
    }),
  );
  floorDisc.position.set(0, 0.07, -GALLERY_FRAME_RADIUS + 3.1);
  display.add(floorDisc);

  return display;
}

function createGalleryLights() {
  const lights = new THREE.Group();
  for (const x of [-8, 8]) {
    const fill = new THREE.PointLight('#fff5e6', 24, 45, 2);
    fill.position.set(x, 7.1, 0);
    lights.add(fill);
  }
  const focalLight = new THREE.PointLight('#fff1d7', 48, 12, 2);
  focalLight.position.set(0, 5.8, -16.3);
  lights.add(focalLight);
  return lights;
}

function createCenterpiece() {
  const centerpiece = new THREE.Group();
  const plinth = new THREE.Mesh(
    new THREE.CylinderGeometry(1.02, 1.15, 0.2, 48),
    new THREE.MeshStandardMaterial({
      color: '#f8f2e9',
      roughness: 0.48,
      metalness: 0.1,
    }),
  );
  plinth.position.y = 0.12;
  centerpiece.add(plinth);

  const centerpieceGold = new THREE.MeshStandardMaterial({
    color: '#c6a77d',
    metalness: 0.52,
    roughness: 0.34,
  });
  const goldRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.08, 0.022, 5, 48),
    centerpieceGold,
  );
  goldRing.rotation.x = Math.PI / 2;
  goldRing.position.y = 0.205;
  centerpiece.add(goldRing);

  const support = new THREE.Mesh(
    new THREE.CylinderGeometry(0.085, 0.12, 0.78, 16),
    centerpieceGold,
  );
  support.position.y = 0.68;
  centerpiece.add(support);

  const loopGeometry = new THREE.TorusGeometry(0.68, 0.026, 8, 48);
  for (const [rotationY, rotationZ] of [
    [-0.48, 0.48],
    [0.48, -0.48],
  ]) {
    const loop = new THREE.Mesh(loopGeometry, centerpieceGold);
    loop.scale.set(0.78, 1.18, 1);
    loop.position.y = 1.48;
    loop.rotation.set(0, rotationY, rotationZ);
    centerpiece.add(loop);
  }

  const heartCanvas = document.createElement('canvas');
  heartCanvas.width = 256;
  heartCanvas.height = 256;
  const heartContext = heartCanvas.getContext('2d');
  heartContext.fillStyle = '#e8b8b2';
  heartContext.beginPath();
  heartContext.moveTo(128, 222);
  heartContext.bezierCurveTo(28, 155, 22, 68, 78, 60);
  heartContext.bezierCurveTo(108, 56, 128, 82, 128, 94);
  heartContext.bezierCurveTo(128, 82, 148, 56, 178, 60);
  heartContext.bezierCurveTo(234, 68, 228, 155, 128, 222);
  heartContext.fill();
  const heartTexture = new THREE.CanvasTexture(heartCanvas);
  heartTexture.colorSpace = THREE.SRGBColorSpace;
  const heartMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(0.9, 0.9),
    new THREE.MeshBasicMaterial({
      map: heartTexture,
      transparent: true,
      depthWrite: false,
      toneMapped: false,
    }),
  );
  heartMesh.position.set(0, 1.56, 0.06);
  centerpiece.add(heartMesh);
  return centerpiece;
}

function createLetterStands() {
  const stands = new THREE.Group();
  letterStandMessages.forEach((message, index) => {
    const angle = Math.PI / 4 + index * (Math.PI / 2);
    stands.add(createLetterStand(message, angle, LETTER_STAND_RADIUS));
  });
  return stands;
}

export function createRoom() {
  const room = new THREE.Group();
  room.name = 'anniversary-rotunda';
  room.add(
    createFloor(),
    createCurvedArchitecture(),
    createWallPanels(),
    createGalleryLabels(),
    createAnniversaryBanners(),
    createFocalDisplay(),
    createGalleryLights(),
    createCenterpiece(),
    createPlanterRing(),
    createLetterStands(),
  );
  return room;
}
