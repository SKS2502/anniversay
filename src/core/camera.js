import * as THREE from 'three';

export function createCamera() {
  return new THREE.PerspectiveCamera(52, 1, 0.1, 100);
}
