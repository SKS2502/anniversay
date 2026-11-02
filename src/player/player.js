import * as THREE from 'three';

export function createPlayer() {
  const position = new THREE.Group();
  position.position.set(0, 0, 5.5);
  position.name = 'first-person-player';

  return { group: position };
}
