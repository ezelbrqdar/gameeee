import * as THREE from 'three';
import { CONSTANTS } from './constants.js';

export class Physics {
    constructor() {
        this.velocity = new THREE.Vector3();
        this.speed = 0;
        this.heading = 0; // Radians
    }

    update(dt, input, position, rotation) {
        // Input handling
        const throttle = input.throttle;
        const steering = input.steering;
        const brake = input.brake;
        const boost = input.boost;

        // Acceleration
        let accel = throttle * CONSTANTS.ACCELERATION;
        if (boost) accel *= CONSTANTS.BOOST_MULTIPLIER;

        // Braking
        if (brake) {
            if (this.speed > 0) accel = -CONSTANTS.BRAKE_FORCE;
            else if (this.speed < 0) accel = CONSTANTS.BRAKE_FORCE;
        }

        // Apply Acceleration to Speed
        this.speed += accel * dt;

        // Friction / Drag
        this.speed *= Math.pow(CONSTANTS.FRICTION, dt * 60); // Frame-rate independent friction approximation

        // Cap Speed
        const maxSpeed = boost ? CONSTANTS.MAX_SPEED * CONSTANTS.BOOST_MULTIPLIER : CONSTANTS.MAX_SPEED;
        this.speed = Math.max(Math.min(this.speed, maxSpeed), -maxSpeed / 2);

        // Steering (only when moving)
        if (Math.abs(this.speed) > 0.1) {
            const turnFactor = Math.min(Math.abs(this.speed) / 10, 1); // Turn slower at low speeds
            this.heading += steering * CONSTANTS.TURN_SPEED * turnFactor * dt;
        }

        // Update Velocity Vector
        this.velocity.x = Math.sin(this.heading) * this.speed;
        this.velocity.z = Math.cos(this.heading) * this.speed;

        // Update Position
        position.x += this.velocity.x * dt;
        position.z += this.velocity.z * dt;

        // Update Rotation (Visuals)
        // Yaw
        rotation.y = this.heading + Math.PI; // Adjust for model orientation if needed

        // Roll (Lean)
        const targetRoll = -steering * 0.5 * (Math.abs(this.speed) / CONSTANTS.MAX_SPEED);
        rotation.z = THREE.MathUtils.lerp(rotation.z, targetRoll, dt * 5);
    }
}
