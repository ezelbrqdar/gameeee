import * as THREE from 'three';
import { CONSTANTS } from './constants.js';
import { Physics } from './physics.js';

export class AIController {
    constructor(scene, track, startOffset) {
        this.scene = scene;
        this.track = track;
        this.physics = new Physics();

        // Visuals
        const geometry = new THREE.BoxGeometry(1, 2, 3);
        const material = new THREE.MeshStandardMaterial({ color: 0x0000ff });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.castShadow = true;
        this.scene.add(this.mesh);

        // State
        this.progress = startOffset || 0; // 0 to 1 along track
        this.laneOffset = (Math.random() - 0.5) * (CONSTANTS.TRACK.WIDTH * 0.6);

        // Initialize position
        this.updatePositionFromTrack();
    }

    updatePositionFromTrack() {
        const point = this.track.getPointAt(this.progress);
        const tangent = this.track.getTangentAt(this.progress);

        // Calculate normal (up x tangent)
        const up = new THREE.Vector3(0, 1, 0);
        const normal = new THREE.Vector3().crossVectors(up, tangent).normalize();

        // Apply lane offset
        this.mesh.position.copy(point).add(normal.multiplyScalar(this.laneOffset));
        this.mesh.position.y = 1;

        // Orientation
        this.mesh.lookAt(point.clone().add(tangent));
    }

    update(dt) {
        // Simple AI: Just move along the track spline
        // In a real game, we'd use physics steering, but for simplicity/performance:

        const speed = CONSTANTS.MAX_SPEED * 0.9; // Slightly slower than max

        // Advance progress based on speed and track length (approximate)
        const trackLength = this.track.curve.getLength();
        const progressDelta = (speed * dt) / trackLength;

        this.progress = (this.progress + progressDelta) % 1;

        this.updatePositionFromTrack();
    }
}
