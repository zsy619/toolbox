class Blackjack {
    constructor() {
        this.deck = [];
        this.dealerCards = [];
        this.playerCards = [];
        this.chips = 1000;
        this.currentBet = 0;
        this.gameState = 'betting'; // betting, playing, dealer, finished
        this.dealerScore = 0;
        this.playerScore = 0;
        this.gameStats = {
            totalGames: 0,
            wins: 0,
            losses: 0,
            ties: 0
        };
        
        this.init();
        this.loadStats();
    }
    
    init() {
        this.createDeck();
        this.bindEvents();
        this.updateUI();
    }
    
    createDeck() {
        const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
        const values = [
            { name: 'A', value: 11, rank: 1 },
            { name: '2', value: 2, rank: 2 },
            { name: '3', value: 3, rank: 3 },
            { name: '4', value: 4, rank: 4 },
            { name: '5', value: 5, rank: 5 },
            { name: '6', value: 6, rank: 6 },
            { name: '7', value: 7, rank: 7 },
            { name: '8', value: 8, rank: 8 },
            { name: '9', value: 9, rank: 9 },
            { name: '10', value: 10, rank: 10 },
            { name: 'J', value: 10, rank: 11 },
            { name: 'Q', value: 10, rank: 12 },
            { name: 'K', value: 10, rank: 13 }
        ];
        
        const suitSymbols = { hearts: '♥️', diamonds: '♦️', clubs: '♣️', spades: '♠️' };
        
        this.deck = [];
        for (let i = 0; i < 6; i++) { // 6副牌
            suits.forEach(suit => {
                values.forEach(value => {
                    this.deck.push({
                        suit,
                        name: value.name,
                        value: value.value,
                        rank: value.rank,
                        color: (suit === 'hearts' || suit === 'diamonds') ? 'red' : 'black',
                        symbol: suitSymbols[suit]
                    });
                });
            });
        }
        
        this.shuffleDeck();
    }
    
    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }
    
    bindEvents() {
        // 下注按钮
        document.querySelectorAll('.bet-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const amount = e.target.dataset.amount;
                if (amount === 'all') {
                    this.placeBet(this.chips);
                } else {
                    this.placeBet(parseInt(amount));
                }
            });
        });
        
        // 自定义下注
        document.getElementById('customBetBtn').addEventListener('click', () => {
            const amount = parseInt(document.getElementById('customBet').value);
            if (amount > 0) {
                this.placeBet(amount);
            }
        });
        
        // 游戏控制按钮
        document.getElementById('hitBtn').addEventListener('click', () => this.hit());
        document.getElementById('standBtn').addEventListener('click', () => this.stand());
        document.getElementById('doubleBtn').addEventListener('click', () => this.double());
        document.getElementById('surrenderBtn').addEventListener('click', () => this.surrender());
        document.getElementById('newGameBtn').addEventListener('click', () => this.newGame());
    }
    
    placeBet(amount) {
        if (amount > this.chips) {
            alert('筹码不足！');
            return;
        }
        
        if (amount <= 0) {
            alert('下注金额必须大于0');
            return;
        }
        
        this.currentBet = amount;
        this.chips -= amount;
        this.startGame();
    }
    
    startGame() {
        this.gameState = 'playing';
        this.dealerCards = [];
        this.playerCards = [];
        
        // 发初始牌
        this.dealCard('player');
        this.dealCard('dealer', true); // 庄家第一张牌面朝下
        this.dealCard('player');
        this.dealCard('dealer');
        
        this.updateScores();
        this.updateUI();
        
        // 检查是否有黑杰克
        if (this.playerScore === 21) {
            if (this.dealerScore === 21) {
                this.endGame('tie', '双方都是黑杰克！');
            } else {
                this.endGame('blackjack', '黑杰克！');
            }
        }
    }
    
    dealCard(target, hidden = false) {
        if (this.deck.length < 10) {
            this.createDeck(); // 重新洗牌
        }
        
        const card = this.deck.pop();
        card.hidden = hidden;
        
        if (target === 'player') {
            this.playerCards.push(card);
            this.renderCard(card, 'playerCards');
        } else {
            this.dealerCards.push(card);
            this.renderCard(card, 'dealerCards');
        }
    }
    
    renderCard(card, containerId) {
        const container = document.getElementById(containerId);
        const cardElement = document.createElement('div');
        cardElement.className = `card ${card.color} deal-animation`;
        
        if (card.hidden) {
            cardElement.classList.add('hidden');
            cardElement.innerHTML = '';
        } else {
            cardElement.innerHTML = `
                <div class="card-value">${card.name}</div>
                <div class="card-suit">${card.symbol}</div>
            `;
        }
        
        container.appendChild(cardElement);
    }
    
    calculateScore(cards) {
        let score = 0;
        let aces = 0;
        
        cards.forEach(card => {
            if (!card.hidden) {
                if (card.name === 'A') {
                    aces++;
                    score += 11;
                } else {
                    score += card.value;
                }
            }
        });
        
        // 调整A的值
        while (score > 21 && aces > 0) {
            score -= 10;
            aces--;
        }
        
        return score;
    }
    
    updateScores() {
        this.playerScore = this.calculateScore(this.playerCards);
        this.dealerScore = this.calculateScore(this.dealerCards);
    }
    
    hit() {
        this.dealCard('player');
        this.updateScores();
        this.updateUI();
        
        if (this.playerScore > 21) {
            this.endGame('bust', '爆牌了！');
        }
    }
    
    stand() {
        this.gameState = 'dealer';
        this.revealDealerCard();
        this.dealerPlay();
    }
    
    double() {
        if (this.chips < this.currentBet) {
            alert('筹码不足无法双倍！');
            return;
        }
        
        this.chips -= this.currentBet;
        this.currentBet *= 2;
        
        this.dealCard('player');
        this.updateScores();
        this.updateUI();
        
        if (this.playerScore > 21) {
            this.endGame('bust', '爆牌了！');
        } else {
            this.stand();
        }
    }
    
    surrender() {
        this.chips += Math.floor(this.currentBet / 2);
        this.endGame('surrender', '投降，返还一半筹码');
    }
    
    revealDealerCard() {
        if (this.dealerCards.length > 0) {
            this.dealerCards[0].hidden = false;
            const cardElement = document.querySelector('#dealerCards .card.hidden');
            if (cardElement) {
                cardElement.classList.remove('hidden');
                cardElement.innerHTML = `
                    <div class="card-value">${this.dealerCards[0].name}</div>
                    <div class="card-suit">${this.dealerCards[0].symbol}</div>
                `;
            }
        }
        this.updateScores();
        this.updateUI();
    }
    
    dealerPlay() {
        const dealerPlayStep = () => {
            if (this.dealerScore < 17) {
                setTimeout(() => {
                    this.dealCard('dealer');
                    this.updateScores();
                    this.updateUI();
                    dealerPlayStep();
                }, 1000);
            } else {
                this.endGame(this.determineWinner());
            }
        };
        
        dealerPlayStep();
    }
    
    determineWinner() {
        if (this.dealerScore > 21) {
            return 'win';
        } else if (this.dealerScore > this.playerScore) {
            return 'lose';
        } else if (this.dealerScore < this.playerScore) {
            return 'win';
        } else {
            return 'tie';
        }
    }
    
    endGame(result, message = '') {
        this.gameState = 'finished';
        let resultMessage = '';
        let payout = 0;
        
        switch (result) {
            case 'blackjack':
                payout = Math.floor(this.currentBet * 2.5); // 3:2 赔率
                this.chips += payout;
                resultMessage = `黑杰克！赢得 ${payout} 筹码`;
                this.gameStats.wins++;
                break;
            case 'win':
                payout = this.currentBet * 2;
                this.chips += payout;
                resultMessage = `获胜！赢得 ${payout} 筹码`;
                this.gameStats.wins++;
                break;
            case 'lose':
            case 'bust':
                resultMessage = message || '失败！';
                this.gameStats.losses++;
                break;
            case 'tie':
                this.chips += this.currentBet;
                resultMessage = '平局！返还筹码';
                this.gameStats.ties++;
                break;
            case 'surrender':
                resultMessage = message;
                this.gameStats.losses++;
                break;
        }
        
        this.gameStats.totalGames++;
        this.currentBet = 0;
        
        // 显示结果
        document.getElementById('resultMessage').textContent = resultMessage;
        document.getElementById('resultMessage').className = `result-message ${result}`;
        
        this.updateUI();
        this.saveStats();
        
        // 检查是否破产
        if (this.chips <= 0) {
            setTimeout(() => {
                alert('破产了！重新开始游戏');
                this.chips = 1000;
                this.updateUI();
            }, 2000);
        }
    }
    
    newGame() {
        if (this.chips <= 0) {
            this.chips = 1000;
        }
        
        this.gameState = 'betting';
        this.currentBet = 0;
        this.dealerCards = [];
        this.playerCards = [];
        
        document.getElementById('dealerCards').innerHTML = '';
        document.getElementById('playerCards').innerHTML = '';
        
        this.updateUI();
    }
    
    updateUI() {
        // 更新显示
        document.getElementById('chips').textContent = this.chips;
        document.getElementById('bet').textContent = this.currentBet;
        
        // 更新分数显示
        document.getElementById('playerScore').textContent = this.playerScore;
        if (this.gameState === 'betting' || (this.dealerCards.length > 0 && this.dealerCards[0].hidden)) {
            document.getElementById('dealerScore').classList.add('hidden');
            document.getElementById('dealerScore').textContent = '?';
        } else {
            document.getElementById('dealerScore').classList.remove('hidden');
            document.getElementById('dealerScore').textContent = this.dealerScore;
        }
        
        // 更新按钮状态
        const bettingArea = document.getElementById('bettingArea');
        const gameControls = document.getElementById('gameControls');
        const resultArea = document.getElementById('resultArea');
        
        if (this.gameState === 'betting') {
            bettingArea.style.display = 'block';
            gameControls.style.display = 'none';
            resultArea.style.display = 'none';
            
            // 更新下注按钮状态
            document.querySelectorAll('.bet-btn').forEach(btn => {
                const amount = btn.dataset.amount === 'all' ? this.chips : parseInt(btn.dataset.amount);
                btn.disabled = amount > this.chips || amount <= 0;
            });
        } else if (this.gameState === 'playing') {
            bettingArea.style.display = 'none';
            gameControls.style.display = 'flex';
            resultArea.style.display = 'none';
            
            // 更新游戏控制按钮
            document.getElementById('doubleBtn').disabled = this.chips < this.currentBet || this.playerCards.length > 2;
            document.getElementById('surrenderBtn').disabled = this.playerCards.length > 2;
        } else if (this.gameState === 'finished') {
            bettingArea.style.display = 'none';
            gameControls.style.display = 'none';
            resultArea.style.display = 'block';
        } else {
            bettingArea.style.display = 'none';
            gameControls.style.display = 'none';
            resultArea.style.display = 'none';
        }
        
        // 更新统计信息
        this.updateStats();
    }
    
    updateStats() {
        document.getElementById('totalGames').textContent = this.gameStats.totalGames;
        document.getElementById('wins').textContent = this.gameStats.wins;
        document.getElementById('losses').textContent = this.gameStats.losses;
        document.getElementById('ties').textContent = this.gameStats.ties;
        
        const winRate = this.gameStats.totalGames > 0 ? 
            Math.round((this.gameStats.wins / this.gameStats.totalGames) * 100) : 0;
        document.getElementById('winRate').textContent = `${winRate}%`;
    }
    
    saveStats() {
        localStorage.setItem('blackjack_stats', JSON.stringify(this.gameStats));
    }
    
    loadStats() {
        const saved = localStorage.getItem('blackjack_stats');
        if (saved) {
            this.gameStats = JSON.parse(saved);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Blackjack();
});