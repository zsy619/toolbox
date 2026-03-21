class MemoryGame {
    constructor() {
        this.difficulties = {
            easy: { rows: 4, cols: 4 },
            medium: { rows: 4, cols: 6 },
            hard: { rows: 4, cols: 8 }
        };
        
        this.emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔'];
        
        this.currentDifficulty = 'easy';
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.timer = 0;
        this.timerInterval = null;
        this.gameStarted = false;
        this.gamePaused = false;
        
        this.initializeGame();
        this.bindEvents();
    }
    
    initializeGame() {
        const config = this.difficulties[this.currentDifficulty];
        this.rows = config.rows;
        this.cols = config.cols;
        this.totalPairs = (this.rows * this.cols) / 2;
        
        this.resetGameState();
        this.createCards();
        this.renderBoard();
        this.updateUI();
    }
    
    resetGameState() {
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.timer = 0;
        this.gameStarted = false;
        this.gamePaused = false;
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
    
    createCards() {
        const selectedEmojis = this.emojis.slice(0, this.totalPairs);
        const cardPairs = [...selectedEmojis, ...selectedEmojis];
        
        // Shuffle cards
        for (let i = cardPairs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cardPairs[i], cardPairs[j]] = [cardPairs[j], cardPairs[i]];
        }
        
        this.cards = cardPairs.map((emoji, index) => ({
            id: index,
            emoji: emoji,
            isFlipped: false,
            isMatched: false
        }));
    }
    
    renderBoard() {
        const gameBoard = document.getElementById('gameBoard');
        gameBoard.innerHTML = '';
        gameBoard.style.gridTemplateColumns = `repeat(${this.cols}, 1fr)`;
        gameBoard.style.gridTemplateRows = `repeat(${this.rows}, 1fr)`;
        
        this.cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            cardElement.dataset.cardId = card.id;
            
            cardElement.innerHTML = `
                <div class="card-front">${card.emoji}</div>
                <div class="card-back">?</div>
            `;
            
            cardElement.addEventListener('click', () => this.handleCardClick(card.id));
            gameBoard.appendChild(cardElement);
        });
    }
    
    bindEvents() {
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.changeDifficulty(e.target.dataset.level);
            });
        });
        
        document.getElementById('newGameBtn').addEventListener('click', () => {
            this.newGame();
        });
        
        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.togglePause();
        });
        
        document.getElementById('playAgainBtn').addEventListener('click', () => {
            this.hideMessage();
            this.newGame();
        });
    }
    
    handleCardClick(cardId) {
        if (!this.gameStarted) {
            this.startGame();
        }
        
        if (this.gamePaused) return;
        
        const card = this.cards[cardId];
        const cardElement = document.querySelector(`[data-card-id="${cardId}"]`);
        
        if (card.isFlipped || card.isMatched || this.flippedCards.length >= 2) {
            return;
        }
        
        this.flipCard(card, cardElement);
        this.flippedCards.push(card);
        
        if (this.flippedCards.length === 2) {
            this.moves++;
            this.updateUI();
            
            setTimeout(() => {
                this.checkMatch();
            }, 800);
        }
    }
    
    flipCard(card, cardElement) {
        card.isFlipped = true;
        cardElement.classList.add('flipped');
    }
    
    checkMatch() {
        const [card1, card2] = this.flippedCards;
        const card1Element = document.querySelector(`[data-card-id="${card1.id}"]`);
        const card2Element = document.querySelector(`[data-card-id="${card2.id}"]`);
        
        if (card1.emoji === card2.emoji) {
            // Match found
            card1.isMatched = true;
            card2.isMatched = true;
            card1Element.classList.add('matched');
            card2Element.classList.add('matched');
            this.matchedPairs++;
            
            if (this.matchedPairs === this.totalPairs) {
                this.endGame();
            }
        } else {
            // No match, flip back
            card1.isFlipped = false;
            card2.isFlipped = false;
            card1Element.classList.remove('flipped');
            card2Element.classList.remove('flipped');
        }
        
        this.flippedCards = [];
    }
    
    startGame() {
        this.gameStarted = true;
        this.timerInterval = setInterval(() => {
            if (!this.gamePaused) {
                this.timer++;
                this.updateUI();
            }
        }, 1000);
    }
    
    endGame() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        document.getElementById('finalTime').textContent = this.timer;
        document.getElementById('finalMoves').textContent = this.moves;
        this.showMessage();
    }
    
    togglePause() {
        if (!this.gameStarted) return;
        
        this.gamePaused = !this.gamePaused;
        const pauseBtn = document.getElementById('pauseBtn');
        
        if (this.gamePaused) {
            pauseBtn.textContent = '继续';
            // Hide all cards when paused
            document.querySelectorAll('.card').forEach(card => {
                if (!card.classList.contains('matched')) {
                    card.style.visibility = 'hidden';
                }
            });
        } else {
            pauseBtn.textContent = '暂停';
            // Show all cards when resumed
            document.querySelectorAll('.card').forEach(card => {
                card.style.visibility = 'visible';
            });
        }
    }
    
    changeDifficulty(level) {
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-level="${level}"]`).classList.add('active');
        
        this.currentDifficulty = level;
        this.newGame();
    }
    
    newGame() {
        this.hideMessage();
        this.initializeGame();
        document.getElementById('pauseBtn').textContent = '暂停';
    }
    
    showMessage() {
        document.getElementById('gameMessage').classList.add('show');
    }
    
    hideMessage() {
        document.getElementById('gameMessage').classList.remove('show');
    }
    
    updateUI() {
        document.getElementById('timer').textContent = this.timer;
        document.getElementById('moves').textContent = this.moves;
        document.getElementById('matches').textContent = this.matchedPairs;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MemoryGame();
});