export class InputManager {
    constructor() {
        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            brake: false,
            boost: false
        };

        this.init();
    }

    init() {
        window.addEventListener('keydown', (e) => this.onKeyDown(e));
        window.addEventListener('keyup', (e) => this.onKeyUp(e));
    }

    onKeyDown(e) {
        switch (e.code) {
            case 'ArrowUp':
            case 'KeyW':
                this.keys.forward = true;
                break;
            case 'ArrowDown':
            case 'KeyS':
                this.keys.backward = true;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                this.keys.left = true;
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.keys.right = true;
                break;
            case 'Space':
                this.keys.brake = true;
                break;
            case 'ShiftLeft':
            case 'ShiftRight':
                this.keys.boost = true;
                break;
        }
    }

    onKeyUp(e) {
        switch (e.code) {
            case 'ArrowUp':
            case 'KeyW':
                this.keys.forward = false;
                break;
            case 'ArrowDown':
            case 'KeyS':
                this.keys.backward = false;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                this.keys.left = false;
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.keys.right = false;
                break;
            case 'Space':
                this.keys.brake = false;
                break;
            case 'ShiftLeft':
            case 'ShiftRight':
                this.keys.boost = false;
                break;
        }
    }

    getAxis() {
        return {
            throttle: (this.keys.forward ? 1 : 0) - (this.keys.backward ? 1 : 0),
            steering: (this.keys.left ? 1 : 0) - (this.keys.right ? 1 : 0),
            brake: this.keys.brake,
            boost: this.keys.boost
        };
    }
}
