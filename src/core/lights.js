import * as THREE from 'three';

export function createLights() {
  const lights = new THREE.Group();
  const ambient = new THREE.HemisphereLight('#fffaf0', '#a89a87', 2.4);
  const key = new THREE.DirectionalLight('#fff1d9', 2.8);
  key.position.set(-4, 8, 5);
  lights.add(ambient, key);
  return lights;
}
