class GameControls {
    constructor(game) {
        this.game = game;
        this.lastDirection = { dx: 0, dy: 0 };
        this.keyPressed = false;
        
        this.bindKeyboardEvents();
        this.bindTouchEvents();
    }
    
    bindKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            if (this.keyPressed) return;
            this.keyPressed = true;
            
            switch(e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    e.preventDefault();
                    this.game.changeDirection(0, -1);
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    e.preventDefault();
                    this.game.changeDirection(0, 1);
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    e.preventDefault();
                    this.game.changeDirection(-1, 0);
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    e.preventDefault();
                    this.game.changeDirection(1, 0);
                    break;
                case ' ':
                    e.preventDefault();
                    this.game.togglePause();
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (!this.game.gameRunning) {
                        this.game.startGame();
                    }
                    break;
                case 'r':
                case 'R':
                    e.preventDefault();
                    this.game.resetGame();
                    break;
            }
        });
        
        document.addEventListener('keyup', () => {
            this.keyPressed = false;
        });
    }
    
    bindTouchEvents() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;
        
        const canvas = this.game.canvas;
        
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
        }, { passive: false });
        
        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
        }, { passive: false });
        
        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            
            if (e.changedTouches.length === 0) return;
            
            const touch = e.changedTouches[0];
            endX = touch.clientX;
            endY = touch.clientY;
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            const minSwipeDistance = 30;
            
            if (Math.abs(deltaX) < minSwipeDistance && Math.abs(deltaY) < minSwipeDistance) {
                if (!this.game.gameRunning) {
                    this.game.startGame();
                } else {
                    this.game.togglePause();
                }
                return;
            }
            
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (deltaX > 0) {
                    this.game.changeDirection(1, 0);
                } else {
                    this.game.changeDirection(-1, 0);
                }
            } else {
                if (deltaY > 0) {
                    this.game.changeDirection(0, 1);
                } else {
                    this.game.changeDirection(0, -1);
                }
            }
        }, { passive: false });
        
        canvas.addEventListener('touchcancel', (e) => {
            e.preventDefault();
        }, { passive: false });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (typeof game !== 'undefined') {
        new GameControls(game);
    }
});