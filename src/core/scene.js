import * as THREE from 'three';

export function createScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#f1ece3');
  scene.fog = new THREE.Fog('#f1ece3', 34, 86);
  return scene;
}
