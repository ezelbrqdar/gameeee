export class UIManager {
    constructor(game) {
        this.game = game;

        // Screens
        this.startScreen = document.getElementById('start-screen');
        this.pauseScreen = document.getElementById('pause-screen');
        this.resultsScreen = document.getElementById('results-screen');
        this.hud = document.getElementById('hud');

        // Buttons
        document.getElementById('start-btn').addEventListener('click', () => this.startGame());
        document.getElementById('resume-btn').addEventListener('click', () => this.resumeGame());
        document.getElementById('restart-btn').addEventListener('click', () => location.reload()); // Simple restart
        document.getElementById('play-again-btn').addEventListener('click', () => location.reload());

        // Key Listener for Pause
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Escape') {
                this.togglePause();
            }
        });
    }

    startGame() {
        console.log("Start Game clicked");
        this.startScreen.classList.add('hidden');
        this.hud.classList.remove('hidden');
        this.game.start();
    }

    resumeGame() {
        this.pauseScreen.classList.add('hidden');
        this.game.resume();
    }

    togglePause() {
        if (this.game.isRunning) {
            this.game.pause();
            this.pauseScreen.classList.remove('hidden');
        } else if (!this.startScreen.classList.contains('hidden')) {
            // Do nothing if on start screen
        } else {
            this.resumeGame();
        }
    }

    showResults(rank, bestLap) {
        this.hud.classList.add('hidden');
        this.resultsScreen.classList.remove('hidden');
        document.getElementById('final-rank').innerText = `${rank}${this.getSuffix(rank)} Place`;
        // document.getElementById('best-lap').innerText = ...
    }

    getSuffix(n) {
        if (n >= 11 && n <= 13) return 'th';
        switch (n % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    }
}
