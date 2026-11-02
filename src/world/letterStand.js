import * as THREE from 'three';

function createPosterTexture(message) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 720;
  const context = canvas.getContext('2d');
  const background = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  background.addColorStop(0, '#fffaf1');
  background.addColorStop(1, '#f4eadb');
  context.fillStyle = background;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.strokeStyle = '#c9ad83';
  context.lineWidth = 3;
  context.strokeRect(22, 22, canvas.width - 44, canvas.height - 44);
  context.strokeStyle = 'rgba(201, 173, 131, 0.52)';
  context.lineWidth = 1;
  context.strokeRect(31, 31, canvas.width - 62, canvas.height - 62);

  context.textAlign = 'center';
  context.fillStyle = '#b28b60';
  context.font = '32px Georgia, serif';
  context.fillText('♥', canvas.width / 2, 94);

  context.fillStyle = '#655747';
  context.font = '600 30px Georgia, serif';
  const titleWords = message.title.split(' ');
  const titleLines = [];
  let titleLine = '';
  for (const word of titleWords) {
    const candidate = titleLine ? `${titleLine} ${word}` : word;
    if (context.measureText(candidate).width > 420 && titleLine) {
      titleLines.push(titleLine);
      titleLine = word;
    } else {
      titleLine = candidate;
    }
  }
  if (titleLine) titleLines.push(titleLine);
  titleLines.forEach((line, index) => {
    context.fillText(line, canvas.width / 2, 163 + index * 38);
  });

  context.strokeStyle = '#c9ad83';
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(130, 212 + (titleLines.length - 1) * 38);
  context.lineTo(382, 212 + (titleLines.length - 1) * 38);
  context.stroke();

  context.fillStyle = '#726553';
  context.font = '26px Georgia, serif';
  message.lines.forEach((line, index) => {
    context.fillText(line, canvas.width / 2, 293 + index * 48);
  });

  context.fillStyle = '#a27c55';
  context.font = 'italic 25px Georgia, serif';
  context.fillText('with all my love', canvas.width / 2, 622);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function createLeg(start, end, radius, material) {
  const startPoint = new THREE.Vector3(...start);
  const endPoint = new THREE.Vector3(...end);
  const difference = endPoint.clone().sub(startPoint);
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 0.82, radius, difference.length(), 8),
    material,
  );
  mesh.position.copy(startPoint).add(endPoint).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    difference.normalize(),
  );
  return mesh;
}

export function createLetterStand(message, angle, radius) {
  const stand = new THREE.Group();
  const gold = new THREE.MeshStandardMaterial({
    color: '#b9986d',
    metalness: 0.58,
    roughness: 0.32,
  });
  const board = new THREE.MeshStandardMaterial({
    color: '#f5ead8',
    roughness: 0.66,
    metalness: 0.04,
  });
  const legs = new THREE.Group();
  legs.add(
    createLeg([-0.58, 1.02, 0.08], [-0.8, 0.04, 0.36], 0.035, gold),
    createLeg([0.58, 1.02, 0.08], [0.8, 0.04, 0.36], 0.035, gold),
    createLeg([0, 1.38, -0.02], [0, 0.04, -0.63], 0.04, gold),
  );
  const crossbar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.035, 0.035, 1.62, 8),
    gold,
  );
  crossbar.rotation.z = Math.PI / 2;
  crossbar.position.set(0, 0.74, 0.23);
  legs.add(crossbar);
  stand.add(legs);

  const mountingBoard = new THREE.Mesh(
    new THREE.BoxGeometry(1.7, 2.2, 0.13),
    gold,
  );
  mountingBoard.position.set(0, 1.92, 0);
  stand.add(mountingBoard);

  const paper = new THREE.Mesh(
    new THREE.BoxGeometry(1.55, 2.05, 0.035),
    board,
  );
  paper.position.set(0, 1.92, 0.083);
  stand.add(paper);

  const poster = new THREE.Mesh(
    new THREE.PlaneGeometry(1.48, 1.97),
    new THREE.MeshBasicMaterial({
      map: createPosterTexture(message),
      toneMapped: false,
    }),
  );
  poster.position.set(0, 1.92, 0.105);
  stand.add(poster);

  const topFinial = new THREE.Mesh(
    new THREE.SphereGeometry(0.075, 12, 8),
    gold,
  );
  topFinial.position.set(0, 3.1, 0);
  stand.add(topFinial);

  const footRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.68, 0.018, 5, 32),
    gold,
  );
  footRing.rotation.x = Math.PI / 2;
  footRing.position.y = 0.035;
  stand.add(footRing);

  stand.position.set(radius * Math.cos(angle), 0, radius * Math.sin(angle));
  stand.rotation.y = -angle - Math.PI / 2;
  stand.name = `letter-stand-${message.title.toLowerCase().replaceAll(' ', '-')}`;
  return stand;
}
