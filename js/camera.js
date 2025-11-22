import * as THREE from 'three';
import { CONSTANTS } from './constants.js';

export class CameraController {
    constructor(camera) {
        this.camera = camera;
        this.target = null;
        this.offset = new THREE.Vector3(
            CONSTANTS.CAMERA.OFFSET.x,
            CONSTANTS.CAMERA.OFFSET.y,
            CONSTANTS.CAMERA.OFFSET.z
        );
        this.lookAtOffset = new THREE.Vector3(
            CONSTANTS.CAMERA.LOOK_AT_OFFSET.x,
            CONSTANTS.CAMERA.LOOK_AT_OFFSET.y,
            CONSTANTS.CAMERA.LOOK_AT_OFFSET.z
        );

        this.currentPosition = new THREE.Vector3();
        this.currentLookAt = new THREE.Vector3();
    }

    setTarget(target) {
        this.target = target;
        // Initialize position immediately to avoid jumping
        this.update(0, true);
    }

    update(dt, snap = false) {
        if (!this.target) return;

        // Calculate desired position relative to target
        // We want the camera behind the bike, based on bike's rotation
        const rotation = this.target.rotation.y;

        const desiredX = this.target.position.x - Math.sin(rotation) * Math.abs(this.offset.z);
        const desiredZ = this.target.position.z - Math.cos(rotation) * Math.abs(this.offset.z);
        const desiredY = this.target.position.y + this.offset.y;

        const desiredPosition = new THREE.Vector3(desiredX, desiredY, desiredZ);

        // Calculate desired look-at point
        const lookAtX = this.target.position.x + Math.sin(rotation) * this.lookAtOffset.z;
        const lookAtZ = this.target.position.z + Math.cos(rotation) * this.lookAtOffset.z;
        const lookAtY = this.target.position.y + this.lookAtOffset.y;

        const desiredLookAt = new THREE.Vector3(lookAtX, lookAtY, lookAtZ);

        if (snap) {
            this.currentPosition.copy(desiredPosition);
            this.currentLookAt.copy(desiredLookAt);
        } else {
            // Smoothly interpolate
            const lerpFactor = 5 * dt;
            this.currentPosition.lerp(desiredPosition, lerpFactor);
            this.currentLookAt.lerp(desiredLookAt, lerpFactor);
        }

        this.camera.position.copy(this.currentPosition);
        this.camera.lookAt(this.currentLookAt);
    }
}
