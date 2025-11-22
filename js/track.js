import * as THREE from 'three';
import { CONSTANTS } from './constants.js';

export class Track {
    constructor(scene) {
        this.scene = scene;
        this.curve = null;
        this.mesh = null;
        this.checkpoints = [];

        this.init();
    }

    init() {
        // Define track points (Simple Loop for now)
        const points = [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(50, 0, 50),
            new THREE.Vector3(100, 0, 0),
            new THREE.Vector3(50, 0, -50),
            new THREE.Vector3(0, 0, -100),
            new THREE.Vector3(-50, 0, -50),
            new THREE.Vector3(-100, 0, 0),
            new THREE.Vector3(-50, 0, 50)
        ];

        this.curve = new THREE.CatmullRomCurve3(points, true); // Closed loop

        // Create Geometry
        const geometry = new THREE.TubeGeometry(
            this.curve,
            CONSTANTS.TRACK.SEGMENTS,
            CONSTANTS.TRACK.WIDTH / 2,
            8,
            true
        );

        // Texture (Basic Grid for now)
        const texture = new THREE.TextureLoader().load('https://threejs.org/examples/textures/grid.png');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(50, 2);

        const material = new THREE.MeshStandardMaterial({
            map: texture,
            side: THREE.DoubleSide,
            color: CONSTANTS.COLORS.TRACK
        });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.receiveShadow = true;
        this.mesh.position.y = 0.1; // Slightly above ground to avoid z-fighting
        this.scene.add(this.mesh);

        // Generate Checkpoints
        this.generateCheckpoints();
    }

    generateCheckpoints() {
        // Place checkpoints along the curve
        const divisions = 20;
        for (let i = 0; i < divisions; i++) {
            const t = i / divisions;
            const point = this.curve.getPointAt(t);
            const tangent = this.curve.getTangentAt(t);

            // Simple visual marker (optional) or just data
            this.checkpoints.push({
                position: point,
                tangent: tangent,
                t: t
            });
        }
    }

    getPointAt(t) {
        return this.curve.getPointAt(t % 1);
    }

    getTangentAt(t) {
        return this.curve.getTangentAt(t % 1);
    }
}
