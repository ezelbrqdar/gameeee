import * as THREE from 'three';
import { CONSTANTS } from './constants.js';
import { InputManager } from './input.js';
import { Track } from './track.js';
import { Physics } from './physics.js';
import { CameraController } from './camera.js';
import { AIController } from './ai.js';
import { RaceManager } from './race.js';
import { UIManager } from './ui.js';

class Game {
    constructor() {
        this.container = document.getElementById('game-container');
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.clock = new THREE.Clock();
        this.isRunning = false;

        // Systems
        this.input = null;
        this.track = null;
        this.physics = null;
        this.cameraController = null;
        this.raceManager = null;
        this.uiManager = null;

        // Game Objects
        this.player = null;
        this.opponents = [];

        this.init();
    }

    init() {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(CONSTANTS.COLORS.SKY);
        this.scene.fog = new THREE.Fog(CONSTANTS.COLORS.FOG, 20, 100);

        // Camera
        this.camera = new THREE.PerspectiveCamera(
            CONSTANTS.CAMERA.FOV,
            window.innerWidth / window.innerHeight,
            CONSTANTS.CAMERA.NEAR,
            CONSTANTS.CAMERA.FAR
        );

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.container.appendChild(this.renderer.domElement);

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(50, 100, 50);
        dirLight.castShadow = true;
        dirLight.shadow.camera.top = 50;
        dirLight.shadow.camera.bottom = -50;
        dirLight.shadow.camera.left = -50;
        dirLight.shadow.camera.right = 50;
        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;
        this.scene.add(dirLight);

        // Ground
        const groundGeo = new THREE.PlaneGeometry(500, 500);
        const groundMat = new THREE.MeshStandardMaterial({ color: CONSTANTS.COLORS.GROUND });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // Initialize Systems
        this.input = new InputManager();
        this.track = new Track(this.scene);
        this.physics = new Physics();
        this.cameraController = new CameraController(this.camera);
        this.raceManager = new RaceManager();
        this.uiManager = new UIManager(this);

        // Create Player
        this.createPlayer();

        // Create Opponents
        this.createOpponents();

        // Event Listeners
        window.addEventListener('resize', () => this.onWindowResize(), false);

        // Start Loop
        this.animate();
    }

    createPlayer() {
        const geometry = new THREE.BoxGeometry(1, 2, 3);
        const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        this.player = new THREE.Mesh(geometry, material);
        this.player.position.y = 1;
        this.player.castShadow = true;
        this.scene.add(this.player);

        this.cameraController.setTarget(this.player);
    }

    createOpponents() {
        // Add 3 opponents
        for (let i = 0; i < 3; i++) {
            const startOffset = 0.02 * (i + 1); // Start slightly ahead
            const ai = new AIController(this.scene, this.track, startOffset);
            this.opponents.push(ai);
        }
    }

    start() {
        this.isRunning = true;
        this.raceManager.startRace();
    }

    pause() {
        this.isRunning = false;
    }

    resume() {
        this.isRunning = true;
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const dt = this.clock.getDelta();

        if (this.isRunning) {
            // Update Player Physics
            const inputState = this.input.getAxis();
            this.physics.update(dt, inputState, this.player.position, this.player.rotation);

            // Update Opponents
            this.opponents.forEach(ai => ai.update(dt));

            // Update Race Logic
            this.raceManager.update(dt);

            // Update Camera
            this.cameraController.update(dt);

            // Update HUD
            const speed = Math.abs(Math.round(this.physics.speed * 3.6));
            document.getElementById('speedometer').innerText = `${speed} km/h`;
        }

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize Game when DOM is ready
// Initialize Game
function startGame() {
    if (!window.game) {
        window.game = new Game();
        console.log("Game initialized");
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startGame);
} else {
    startGame();
}
