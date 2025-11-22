export class AudioManager {
    constructor() {
        this.context = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.context.createGain();
        this.masterGain.connect(this.context.destination);
        this.masterGain.gain.value = 0.5;
    }

    playSound(name) {
        // Placeholder for sound playback
        // In a real game, we'd load buffers and play them here
        // console.log(`Playing sound: ${name}`);
    }

    setVolume(value) {
        this.masterGain.gain.value = value;
    }
}
