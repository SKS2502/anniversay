import * as THREE from 'three';
import {
  GALLERY_CENTER_KEEP_OUT_RADIUS,
  GALLERY_WALK_RADIUS,
  LETTER_STAND_COLLISION_RADIUS,
  LETTER_STAND_RADIUS,
  PLANTER_POSITIONS,
} from '../config/gallery.js';

const PLAYER_SPEED = 2.4;
const ACCELERATION = 12;

export function createMovement(player) {
  const velocity = new THREE.Vector2();
  const desiredVelocity = new THREE.Vector2();
  const direction = new THREE.Vector2();

  function update(input, deltaTime, cameraYaw = 0) {
    const inputLength = Math.hypot(input.x, input.forward);
    if (inputLength > 0) {
      const inputScale = Math.min(inputLength, 1) / inputLength;
      const inputX = input.x * inputScale;
      const inputForward = input.forward * inputScale;
      const cosYaw = Math.cos(cameraYaw);
      const sinYaw = Math.sin(cameraYaw);

      desiredVelocity.set(
        (inputX * cosYaw - inputForward * sinYaw) * PLAYER_SPEED,
        (-inputX * sinYaw - inputForward * cosYaw) * PLAYER_SPEED,
      );
    } else {
      desiredVelocity.set(0, 0);
    }

    const response = 1 - Math.exp(-ACCELERATION * deltaTime);
    velocity.lerp(desiredVelocity, response);

    let nextX = player.group.position.x + velocity.x * deltaTime;
    let nextZ = player.group.position.z + velocity.y * deltaTime;
    const nextRadius = Math.hypot(nextX, nextZ);
    const boundaryScale =
      nextRadius > GALLERY_WALK_RADIUS ? GALLERY_WALK_RADIUS / nextRadius : 1;
    nextX *= boundaryScale;
    nextZ *= boundaryScale;

    const centerRadius = Math.hypot(nextX, nextZ);
    if (centerRadius < GALLERY_CENTER_KEEP_OUT_RADIUS) {
      const current = player.group.position;
      const angle =
        centerRadius > 0.001
          ? Math.atan2(nextX, nextZ)
          : Math.atan2(current.x, current.z);
      nextX = Math.sin(angle) * GALLERY_CENTER_KEEP_OUT_RADIUS;
      nextZ = Math.cos(angle) * GALLERY_CENTER_KEEP_OUT_RADIUS;
    }

    const obstacles = [
      ...Array.from({ length: 4 }, (_, index) => {
      const angle = Math.PI / 4 + index * (Math.PI / 2);
        return {
          x: Math.cos(angle) * LETTER_STAND_RADIUS,
          z: Math.sin(angle) * LETTER_STAND_RADIUS,
          radius: LETTER_STAND_COLLISION_RADIUS,
        };
      }),
      ...PLANTER_POSITIONS,
    ];
    for (const obstacle of obstacles) {
      const offsetX = nextX - obstacle.x;
      const offsetZ = nextZ - obstacle.z;
      const distance = Math.hypot(offsetX, offsetZ);
      if (distance >= obstacle.radius) continue;

      const currentX = player.group.position.x - obstacle.x;
      const currentZ = player.group.position.z - obstacle.z;
      const safeDistance = distance > 0.001 ? distance : Math.hypot(currentX, currentZ);
      const normalX =
        distance > 0.001
          ? offsetX / distance
          : safeDistance > 0.001
            ? currentX / safeDistance
            : 1;
      const normalZ =
        distance > 0.001
          ? offsetZ / distance
          : safeDistance > 0.001
            ? currentZ / safeDistance
            : 0;
      nextX = obstacle.x + normalX * obstacle.radius;
      nextZ = obstacle.z + normalZ * obstacle.radius;
    }

    player.group.position.x = nextX;
    player.group.position.z = nextZ;

    direction.set(velocity.x, velocity.y);
    if (direction.lengthSq() > 0.01) {
      const targetRotation = Math.atan2(direction.x, direction.y);
      const rotationDifference = THREE.MathUtils.euclideanModulo(
        targetRotation - player.group.rotation.y + Math.PI,
        Math.PI * 2,
      ) - Math.PI;
      player.group.rotation.y += rotationDifference * response;
    }
  }

  function stop() {
    velocity.set(0, 0);
    desiredVelocity.set(0, 0);
  }

  return { update, stop };
}
