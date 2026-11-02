import * as THREE from 'three';

function drawWrappedText(context, text, x, maxWidth, lineHeight, maxLines) {
  const lines = [];
  let line = '';

  for (const word of text.split(' ')) {
    const candidate = line ? `${line} ${word}` : word;
    if (context.measureText(candidate).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);

  const visibleLines = lines.slice(0, maxLines);
  visibleLines.forEach((value, index) => {
    context.fillText(value, x, 174 + index * lineHeight);
  });
}

function createCaptionMaterial(memory) {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 300;
  const context = canvas.getContext('2d');
  const background = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  background.addColorStop(0, '#fffaf1');
  background.addColorStop(0.5, '#f4eadb');
  background.addColorStop(1, '#fffaf1');
  context.fillStyle = background;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.strokeStyle = '#c9ad83';
  context.lineWidth = 4;
  context.strokeRect(18, 18, canvas.width - 36, canvas.height - 36);
  context.textAlign = 'center';
  context.textBaseline = 'middle';

  let titleSize = 42;
  context.fillStyle = '#a9855c';
  context.font = `600 ${titleSize}px Georgia, serif`;
  while (context.measureText(memory.title.toUpperCase()).width > 1080 && titleSize > 28) {
    titleSize -= 2;
    context.font = `600 ${titleSize}px Georgia, serif`;
  }
  context.fillText(memory.title.toUpperCase(), canvas.width / 2, 84);

  let messageSize = 37;
  context.fillStyle = '#655747';
  context.font = `italic ${messageSize}px Georgia, serif`;
  while (messageSize > 26) {
    let line = '';
    let lineCount = 1;
    for (const word of memory.message.split(' ')) {
      const candidate = line ? `${line} ${word}` : word;
      if (context.measureText(candidate).width > 1080 && line) {
        lineCount += 1;
        line = word;
      } else {
        line = candidate;
      }
    }
    if (lineCount <= 2) break;
    messageSize -= 2;
    context.font = `italic ${messageSize}px Georgia, serif`;
  }
  drawWrappedText(context, memory.message, canvas.width / 2, 1080, 48, 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return new THREE.MeshBasicMaterial({ map: texture, toneMapped: false });
}

function createKeepsakeMaterial(memory) {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 1100;
  const context = canvas.getContext('2d');
  const background = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  background.addColorStop(0, '#fffaf1');
  background.addColorStop(1, '#eee2d1');
  context.fillStyle = background;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = '#c9ad83';
  context.lineWidth = 5;
  context.strokeRect(28, 28, canvas.width - 56, canvas.height - 56);
  context.strokeStyle = 'rgba(201, 173, 131, 0.55)';
  context.lineWidth = 2;
  context.strokeRect(44, 44, canvas.width - 88, canvas.height - 88);

  context.textAlign = 'center';
  context.fillStyle = '#b28b60';
  context.font = '58px Georgia, serif';
  context.fillText('♥', canvas.width / 2, 175);
  context.fillStyle = '#655747';
  context.font = '600 42px Georgia, serif';
  context.fillText('A LITTLE NOTE FOR US', canvas.width / 2, 292);
  context.strokeStyle = '#c9ad83';
  context.lineWidth = 3;
  context.beginPath();
  context.moveTo(160, 350);
  context.lineTo(640, 350);
  context.stroke();

  context.fillStyle = '#78674e';
  context.font = 'italic 36px Georgia, serif';
  const words = memory.message.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (context.measureText(candidate).width > 570 && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  lines.forEach((value, index) =>
    context.fillText(value, canvas.width / 2, 470 + index * 58),
  );
  context.fillStyle = '#a27c55';
  context.font = 'italic 31px Georgia, serif';
  context.fillText('TWO YEARS, STILL US', canvas.width / 2, 900);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return new THREE.MeshStandardMaterial({ map: texture, roughness: 0.85 });
}

export function createPhotoFrame(memory, resources) {
  const group = new THREE.Group();
  group.position.set(
    memory.position.x,
    memory.position.y,
    memory.position.z,
  );
  group.rotation.y = memory.position.rotationY;
  group.userData.memoryId = memory.id;
  const style = memory.frameStyle ?? 'portrait';
  const styleIndex = style === 'hero' ? 0 : style === 'landscape' ? 2 : 1;

  const trim = new THREE.Mesh(
    resources.frameGeometries[styleIndex],
    resources.trimMaterial,
  );
  const imagePanel = new THREE.Mesh(
    resources.imageGeometries[styleIndex],
    memory.keepsake
      ? createKeepsakeMaterial(memory)
      : resources.placeholderMaterials[memory.section] ??
        resources.placeholderMaterial,
  );
  imagePanel.position.z = memory.fitImage ? 0.095 : 0.086;
  if (memory.fitImage) {
    imagePanel.scale.x = 0.55;
    const photoMatte = new THREE.Mesh(
      resources.imageGeometries[styleIndex],
      new THREE.MeshStandardMaterial({
        color: '#f5eadb',
        roughness: 0.88,
      }),
    );
    photoMatte.position.z = 0.086;
    group.add(photoMatte);
  }

  const caption = new THREE.Mesh(
    resources.captionGeometries[styleIndex],
    resources.captionFrameMaterial,
  );
  caption.position.set(
    0,
    -resources.frameGeometries[styleIndex].parameters.height / 2 - 0.43,
    0.035,
  );
  const captionFace = new THREE.Mesh(
    resources.captionFaceGeometries[styleIndex],
    createCaptionMaterial(memory),
  );
  captionFace.position.set(0, caption.position.y, 0.082);

  const lightBar = new THREE.Mesh(
    resources.lightBarGeometries[styleIndex],
    resources.lightBarMaterial,
  );
  lightBar.position.set(
    0,
    resources.frameGeometries[styleIndex].parameters.height / 2 + 0.08,
    0.04,
  );

  group.add(trim, imagePanel, caption, captionFace, lightBar);
  group.name = `photo-frame-${memory.id}`;

  return { group, imagePanel, hitTarget: trim };
}
