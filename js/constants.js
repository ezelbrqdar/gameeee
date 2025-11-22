export const CONSTANTS = {
    GRAVITY: 9.8,
    MAX_SPEED: 30, // Units per second
    ACCELERATION: 15,
    BRAKE_FORCE: 30,
    TURN_SPEED: 2.5,
    FRICTION: 0.98,
    BOOST_MULTIPLIER: 1.5,
    CAMERA: {
        FOV: 60,
        NEAR: 0.1,
        FAR: 1000,
        OFFSET: { x: 0, y: 3, z: -6 }, // Behind and above
        LOOK_AT_OFFSET: { x: 0, y: 1, z: 5 }
    },
    TRACK: {
        WIDTH: 10,
        SEGMENTS: 200
    },
    COLORS: {
        SKY: 0x87CEEB,
        GROUND: 0x354a21,
        TRACK: 0x333333,
        FOG: 0xaaccff
    }
};
