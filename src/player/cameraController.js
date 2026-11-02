import * as THREE from 'three';
import { GALLERY_CAMERA_RADIUS } from '../config/gallery.js';

const EYE_HEIGHT = 1.7;
const MOUSE_SENSITIVITY = 0.002;
const MIN_PITCH = -0.08;
const MAX_PITCH = 0.82;
const WALK_BOB_HEIGHT = 0.022;
const WALK_BOB_SPEED = 9;

export function createCameraController(camera, player) {
  const lookTarget = new THREE.Vector3();
  let yaw = 0;
  let pitch = 0;
  let walkPhase = 0;
  let bobAmount = 0;

  function updateCamera(moving, deltaTime) {
    const playerPosition = player.group.position;
    const targetBobAmount = moving ? 1 : 0;
    bobAmount = THREE.MathUtils.damp(bobAmount, targetBobAmount, 10, deltaTime);
    if (moving) walkPhase += deltaTime * WALK_BOB_SPEED;

    camera.position.set(
      playerPosition.x,
      playerPosition.y + EYE_HEIGHT + Math.sin(walkPhase) * WALK_BOB_HEIGHT * bobAmount,
      playerPosition.z,
    );
    constrainCameraToGallery();
    lookTarget.set(
      camera.position.x + Math.sin(yaw) * Math.cos(pitch),
      camera.position.y + Math.sin(pitch),
      camera.position.z - Math.cos(yaw) * Math.cos(pitch),
    );
    camera.lookAt(lookTarget);
  }

  function constrainCameraToGallery() {
    const radius = Math.hypot(camera.position.x, camera.position.z);
    if (radius <= GALLERY_CAMERA_RADIUS) return;
    const scale = GALLERY_CAMERA_RADIUS / radius;
    camera.position.x *= scale;
    camera.position.z *= scale;
  }

  return {
    eyeHeight: EYE_HEIGHT,
    snap() {
      updateCamera(false, 0);
    },
    update(deltaTime, moving = false) {
      updateCamera(moving, deltaTime);
    },
    rotateBy(movementX, movementY) {
      yaw -= movementX * MOUSE_SENSITIVITY;
      pitch = THREE.MathUtils.clamp(
        pitch - movementY * MOUSE_SENSITIVITY,
        MIN_PITCH,
        MAX_PITCH,
      );
    },
    getYaw() {
      return yaw;
    },
  };
}
