import * as THREE from 'three';

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
    resources.placeholderMaterials[memory.section] ??
      resources.placeholderMaterial,
  );
  imagePanel.position.z = 0.086;

  const lightBar = new THREE.Mesh(
    resources.lightBarGeometries[styleIndex],
    resources.lightBarMaterial,
  );
  lightBar.position.set(
    0,
    resources.frameGeometries[styleIndex].parameters.height / 2 + 0.08,
    0.04,
  );

  group.add(trim, imagePanel, lightBar);
  group.name = `photo-frame-${memory.id}`;

  return { group, imagePanel, hitTarget: trim };
}
