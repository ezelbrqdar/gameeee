export class RaceManager {
    constructor(totalLaps = 3) {
        this.totalLaps = totalLaps;
        this.currentLap = 1;
        this.startTime = 0;
        this.elapsedTime = 0;
        this.isRacing = false;
        this.finished = false;

        // DOM Elements
        this.lapEl = document.getElementById('lap-counter');
        this.timerEl = document.getElementById('timer');
    }

    startRace() {
        this.isRacing = true;
        this.startTime = Date.now();
        this.currentLap = 1;
        this.finished = false;
        this.updateHUD();
    }

    update(dt, playerProgress) {
        if (!this.isRacing || this.finished) return;

        // Timer
        const now = Date.now();
        this.elapsedTime = (now - this.startTime) / 1000;
        this.timerEl.innerText = this.formatTime(this.elapsedTime);

        // Lap Counting (Simplified: assumes playerProgress goes 0->1)
        // In a real implementation with physics, we'd check checkpoints.
        // For now, we'll rely on the main loop to feed us progress or checkpoint hits.
    }

    onCheckpointPassed(checkpointIndex, totalCheckpoints) {
        // Logic to detect lap completion
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        const ms = Math.floor((seconds * 100) % 100);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
    }

    updateHUD() {
        this.lapEl.innerText = `Lap ${this.currentLap}/${this.totalLaps}`;
    }
}
