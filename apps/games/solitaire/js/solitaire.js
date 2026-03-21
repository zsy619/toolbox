class Solitaire {
    constructor() {
        this.deck = [];
        this.stock = [];
        this.waste = [];
        this.foundations = { hearts: [], diamonds: [], clubs: [], spades: [] };
        this.tableau = [[], [], [], [], [], [], []];
        this.selectedCards = [];
        this.selectedPile = null;
        this.moves = 0;
        this.score = 0;
        this.timer = 0;
        this.timerInterval = null;
        this.gameStarted = false;
        this.moveHistory = [];
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        
        this.init();
    }
    
    init() {
        this.createDeck();
        this.bindEvents();
        this.newGame();
    }
    
    createDeck() {
        const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
        const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        const suitSymbols = { hearts: '♥️', diamonds: '♦️', clubs: '♣️', spades: '♠️' };
        
        this.deck = [];
        suits.forEach(suit => {
            values.forEach((value, index) => {
                this.deck.push({
                    suit,
                    value,
                    rank: index + 1,
                    color: (suit === 'hearts' || suit === 'diamonds') ? 'red' : 'black',
                    symbol: suitSymbols[suit],
                    faceUp: false,
                    id: `${suit}-${value}`
                });
            });
        });
    }
    
    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }
    
    newGame() {
        this.createDeck();
        this.shuffleDeck();
        
        // 重置游戏状态
        this.stock = [];
        this.waste = [];
        this.foundations = { hearts: [], diamonds: [], clubs: [], spades: [] };
        this.tableau = [[], [], [], [], [], [], []];
        this.selectedCards = [];
        this.selectedPile = null;
        this.moves = 0;
        this.score = 0;
        this.timer = 0;
        this.gameStarted = false;
        this.moveHistory = [];
        
        // 发牌到tableau
        let cardIndex = 0;
        for (let pile = 0; pile < 7; pile++) {
            for (let card = 0; card <= pile; card++) {
                const currentCard = this.deck[cardIndex++];
                currentCard.faceUp = (card === pile);
                this.tableau[pile].push(currentCard);
            }
        }
        
        // 剩余的牌放到stock
        this.stock = this.deck.slice(cardIndex);
        
        this.render();
        this.updateStats();
        this.startTimer();
    }
    
    startTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            this.timer++;
            this.updateTimer();
        }, 1000);
    }
    
    updateTimer() {
        const minutes = Math.floor(this.timer / 60);
        const seconds = this.timer % 60;
        document.getElementById('timer').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    updateStats() {
        document.getElementById('moves').textContent = this.moves;
        document.getElementById('score').textContent = this.score;
    }
    
    bindEvents() {
        document.getElementById('newGameBtn').addEventListener('click', () => this.newGame());
        document.getElementById('undoBtn').addEventListener('click', () => this.undo());
        document.getElementById('hintBtn').addEventListener('click', () => this.showHint());
        document.getElementById('autoCompleteBtn').addEventListener('click', () => this.autoComplete());
        document.getElementById('playAgainBtn').addEventListener('click', () => {
            this.hideMessage();
            this.newGame();
        });
        
        // Stock点击事件
        document.getElementById('stockPile').addEventListener('click', () => this.dealFromStock());
        
        // 全局拖拽事件
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        document.addEventListener('mouseup', (e) => this.onMouseUp(e));
        
        // 阻止默认拖拽行为
        document.addEventListener('dragstart', (e) => e.preventDefault());
    }
    
    dealFromStock() {
        if (this.stock.length > 0) {
            // 一次翻3张牌（克朗代克规则）
            const cardsToFlip = Math.min(3, this.stock.length);
            for (let i = 0; i < cardsToFlip; i++) {
                const card = this.stock.pop();
                card.faceUp = true;
                this.waste.push(card);
            }
            this.addMove();
        } else if (this.waste.length > 0) {
            // 重新翻转waste到stock
            this.stock = this.waste.reverse().map(card => {
                card.faceUp = false;
                return card;
            });
            this.waste = [];
            this.addMove();
        }
        this.render();
    }
    
    addMove() {
        this.moves++;
        this.updateStats();
        this.gameStarted = true;
    }
    
    render() {
        this.renderStock();
        this.renderWaste();
        this.renderFoundations();
        this.renderTableau();
    }
    
    renderStock() {
        const stockSlot = document.querySelector('.stock-slot');
        stockSlot.innerHTML = '';
        
        if (this.stock.length > 0) {
            const cardEl = this.createCardElement(null, true);
            stockSlot.appendChild(cardEl);
        } else {
            stockSlot.innerHTML = '<div class="empty-slot">🔄</div>';
            stockSlot.style.cursor = this.waste.length > 0 ? 'pointer' : 'default';
        }
    }
    
    renderWaste() {
        const wasteSlot = document.querySelector('.waste-slot');
        wasteSlot.innerHTML = '';
        
        if (this.waste.length > 0) {
            // 显示最多3张牌的叠放效果
            const cardsToShow = Math.min(3, this.waste.length);
            const startIndex = this.waste.length - cardsToShow;
            
            for (let i = 0; i < cardsToShow; i++) {
                const card = this.waste[startIndex + i];
                const cardEl = this.createCardElement(card);
                cardEl.style.position = 'absolute';
                cardEl.style.left = `${i * 20}px`;
                cardEl.style.zIndex = i + 1;
                
                // 只有最上面的牌可以拖拽
                if (i === cardsToShow - 1) {
                    this.makeCardDraggable(cardEl, card, 'waste');
                }
                
                wasteSlot.appendChild(cardEl);
            }
        }
    }
    
    renderFoundations() {
        const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
        suits.forEach(suit => {
            const foundationSlot = document.querySelector(`[data-suit="${suit}"]`);
            foundationSlot.innerHTML = '';
            
            const foundation = this.foundations[suit];
            if (foundation.length > 0) {
                const topCard = foundation[foundation.length - 1];
                const cardEl = this.createCardElement(topCard);
                foundationSlot.appendChild(cardEl);
            } else {
                const symbols = { hearts: '♥️', diamonds: '♦️', clubs: '♣️', spades: '♠️' };
                foundationSlot.innerHTML = `<div class="empty-foundation">${symbols[suit]}</div>`;
            }
            
            // 设置放置目标
            this.makeDropTarget(foundationSlot, 'foundation', suit);
        });
    }
    
    renderTableau() {
        for (let pileIndex = 0; pileIndex < 7; pileIndex++) {
            const pileElement = document.querySelector(`[data-pile="${pileIndex}"]`);
            pileElement.innerHTML = '';
            
            const pile = this.tableau[pileIndex];
            
            if (pile.length === 0) {
                const emptySlot = document.createElement('div');
                emptySlot.className = 'empty-tableau';
                emptySlot.textContent = 'K';
                this.makeDropTarget(emptySlot, 'tableau', pileIndex);
                pileElement.appendChild(emptySlot);
            } else {
                pile.forEach((card, cardIndex) => {
                    const cardEl = this.createCardElement(card);
                    cardEl.style.position = 'absolute';
                    cardEl.style.top = `${cardIndex * 25}px`;
                    cardEl.style.zIndex = cardIndex + 1;
                    
                    if (card.faceUp) {
                        this.makeCardDraggable(cardEl, card, 'tableau', pileIndex, cardIndex);
                    }
                    
                    pileElement.appendChild(cardEl);
                });
                
                // 设置整个pile为放置目标
                this.makeDropTarget(pileElement, 'tableau', pileIndex);
            }
        }
    }
    
    createCardElement(card, faceDown = false) {
        const cardEl = document.createElement('div');
        cardEl.className = 'card';
        
        if (faceDown || !card || !card.faceUp) {
            cardEl.classList.add('face-down');
            cardEl.innerHTML = '<div class="card-back">🂠</div>';
        } else {
            cardEl.classList.add(card.color);
            cardEl.innerHTML = `
                <div class="card-corner top-left">
                    <div class="card-value">${card.value}</div>
                    <div class="card-suit">${card.symbol}</div>
                </div>
                <div class="card-center">${card.symbol}</div>
                <div class="card-corner bottom-right">
                    <div class="card-value">${card.value}</div>
                    <div class="card-suit">${card.symbol}</div>
                </div>
            `;
            cardEl.dataset.cardId = card.id;
        }
        
        return cardEl;
    }
    
    makeCardDraggable(cardEl, card, pileType, pileIndex = null, cardIndex = null) {
        cardEl.style.cursor = 'grab';
        
        cardEl.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.startDrag(cardEl, card, pileType, pileIndex, cardIndex, e);
        });
        
        cardEl.addEventListener('click', (e) => {
            e.stopPropagation();
            this.selectCard(card, pileType, pileIndex, cardIndex);
        });
        
        cardEl.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            this.autoMoveToFoundation(card, pileType, pileIndex, cardIndex);
        });
    }
    
    startDrag(cardEl, card, pileType, pileIndex, cardIndex, event) {
        this.isDragging = true;
        this.selectedCards = [];
        this.selectedPile = { type: pileType, index: pileIndex, cardIndex };
        
        // 如果是tableau中的牌，选择该牌及其下面的所有牌
        if (pileType === 'tableau' && cardIndex !== null) {
            this.selectedCards = this.tableau[pileIndex].slice(cardIndex);
            // 验证序列是否有效
            if (!this.isValidSequence(this.selectedCards)) {
                this.selectedCards = [card];
            }
        } else {
            this.selectedCards = [card];
        }
        
        // 计算拖拽偏移
        const rect = cardEl.getBoundingClientRect();
        this.dragOffset = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
        
        // 创建拖拽代理
        this.createDragProxy(event.clientX, event.clientY);
        
        // 高亮可拖拽的牌
        this.selectedCards.forEach((selectedCard, index) => {
            const cardElement = document.querySelector(`[data-card-id="${selectedCard.id}"]`);
            if (cardElement) {
                cardElement.classList.add('dragging');
                cardElement.style.transform = `translateY(${index * 5}px)`;
            }
        });
        
        cardEl.style.cursor = 'grabbing';
    }
    
    createDragProxy(x, y) {
        this.dragProxy = document.createElement('div');
        this.dragProxy.className = 'drag-proxy';
        this.dragProxy.style.position = 'fixed';
        this.dragProxy.style.left = `${x - this.dragOffset.x}px`;
        this.dragProxy.style.top = `${y - this.dragOffset.y}px`;
        this.dragProxy.style.zIndex = '1000';
        this.dragProxy.style.pointerEvents = 'none';
        this.dragProxy.style.opacity = '0.8';
        
        // 添加拖拽的牌
        this.selectedCards.forEach((card, index) => {
            const cardEl = this.createCardElement(card);
            cardEl.style.position = 'absolute';
            cardEl.style.top = `${index * 5}px`;
            this.dragProxy.appendChild(cardEl);
        });
        
        document.body.appendChild(this.dragProxy);
    }
    
    onMouseMove(event) {
        if (!this.isDragging || !this.dragProxy) return;
        
        this.dragProxy.style.left = `${event.clientX - this.dragOffset.x}px`;
        this.dragProxy.style.top = `${event.clientY - this.dragOffset.y}px`;
        
        // 更新放置目标高亮
        this.updateDropTargets(event.clientX, event.clientY);
    }
    
    onMouseUp(event) {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        
        // 移除拖拽代理
        if (this.dragProxy) {
            document.body.removeChild(this.dragProxy);
            this.dragProxy = null;
        }
        
        // 移除拖拽样式
        document.querySelectorAll('.card.dragging').forEach(card => {
            card.classList.remove('dragging');
            card.style.transform = '';
            card.style.cursor = 'grab';
        });
        
        // 检查放置目标
        const dropTarget = this.getDropTargetAt(event.clientX, event.clientY);
        if (dropTarget) {
            this.attemptDrop(dropTarget);
        }
        
        this.clearDropTargetHighlights();
        this.clearSelection();
    }
    
    makeDropTarget(element, type, index) {
        element.dataset.dropType = type;
        element.dataset.dropIndex = index;
        
        element.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });
        
        element.addEventListener('drop', (e) => {
            e.preventDefault();
            this.attemptDrop({ type, index });
        });
    }
    
    updateDropTargets(x, y) {
        // 清除之前的高亮
        this.clearDropTargetHighlights();
        
        const dropTarget = this.getDropTargetAt(x, y);
        if (dropTarget && this.canDropOn(dropTarget)) {
            const element = this.getDropTargetElement(dropTarget);
            if (element) {
                element.classList.add('valid-drop-target');
            }
        }
    }
    
    getDropTargetAt(x, y) {
        const elements = document.elementsFromPoint(x, y);
        for (const element of elements) {
            if (element.dataset.dropType) {
                return {
                    type: element.dataset.dropType,
                    index: element.dataset.dropIndex
                };
            }
        }
        return null;
    }
    
    getDropTargetElement(dropTarget) {
        if (dropTarget.type === 'foundation') {
            return document.querySelector(`[data-suit="${dropTarget.index}"]`);
        } else if (dropTarget.type === 'tableau') {
            return document.querySelector(`[data-pile="${dropTarget.index}"]`);
        }
        return null;
    }
    
    canDropOn(dropTarget) {
        if (this.selectedCards.length === 0) return false;
        
        const firstCard = this.selectedCards[0];
        
        if (dropTarget.type === 'foundation') {
            return this.canMoveToFoundation(firstCard, dropTarget.index);
        } else if (dropTarget.type === 'tableau') {
            return this.canMoveToTableau(this.selectedCards, parseInt(dropTarget.index));
        }
        
        return false;
    }
    
    canMoveToFoundation(card, suit) {
        if (this.selectedCards.length !== 1) return false;
        if (card.suit !== suit) return false;
        
        const foundation = this.foundations[suit];
        
        if (foundation.length === 0) {
            return card.rank === 1; // A
        } else {
            return card.rank === foundation[foundation.length - 1].rank + 1;
        }
    }
    
    canMoveToTableau(cards, pileIndex) {
        const pile = this.tableau[pileIndex];
        const firstCard = cards[0];
        
        if (pile.length === 0) {
            return firstCard.rank === 13; // K
        } else {
            const topCard = pile[pile.length - 1];
            return topCard.faceUp && 
                   firstCard.color !== topCard.color && 
                   firstCard.rank === topCard.rank - 1;
        }
    }
    
    isValidSequence(cards) {
        if (cards.length <= 1) return true;
        
        for (let i = 1; i < cards.length; i++) {
            const prev = cards[i - 1];
            const curr = cards[i];
            
            if (prev.color === curr.color || prev.rank !== curr.rank + 1) {
                return false;
            }
        }
        return true;
    }
    
    attemptDrop(dropTarget) {
        if (!this.canDropOn(dropTarget)) return;
        
        if (dropTarget.type === 'foundation') {
            this.moveToFoundation(dropTarget.index);
        } else if (dropTarget.type === 'tableau') {
            this.moveToTableau(parseInt(dropTarget.index));
        }
    }
    
    moveToFoundation(suit) {
        const card = this.selectedCards[0];
        
        // 从原位置移除
        this.removeCardsFromSource();
        
        // 添加到foundation
        this.foundations[suit].push(card);
        this.score += 10;
        this.addMove();
        
        this.render();
        
        if (this.checkWin()) {
            this.showWinMessage();
        }
    }
    
    moveToTableau(pileIndex) {
        // 从原位置移除
        this.removeCardsFromSource();
        
        // 添加到tableau
        this.tableau[pileIndex].push(...this.selectedCards);
        this.score += 5;
        this.addMove();
        
        this.render();
    }
    
    removeCardsFromSource() {
        if (this.selectedPile.type === 'waste') {
            this.waste.pop();
        } else if (this.selectedPile.type === 'tableau') {
            const sourcePile = this.tableau[this.selectedPile.index];
            sourcePile.splice(this.selectedPile.cardIndex);
            
            // 翻开下一张牌
            if (sourcePile.length > 0 && !sourcePile[sourcePile.length - 1].faceUp) {
                sourcePile[sourcePile.length - 1].faceUp = true;
                this.score += 5;
            }
        }
    }
    
    selectCard(card, pileType, pileIndex = null, cardIndex = null) {
        this.clearSelection();
        
        this.selectedCards = [card];
        this.selectedPile = { type: pileType, index: pileIndex, cardIndex };
        
        // 高亮选中的卡片
        const cardElement = document.querySelector(`[data-card-id="${card.id}"]`);
        if (cardElement) {
            cardElement.classList.add('selected');
        }
    }
    
    clearSelection() {
        document.querySelectorAll('.card.selected').forEach(card => {
            card.classList.remove('selected');
        });
        this.selectedCards = [];
        this.selectedPile = null;
    }
    
    clearDropTargetHighlights() {
        document.querySelectorAll('.valid-drop-target, .invalid-drop-target').forEach(el => {
            el.classList.remove('valid-drop-target', 'invalid-drop-target');
        });
    }
    
    autoMoveToFoundation(card, pileType, pileIndex, cardIndex) {
        // 尝试自动移动到foundation
        const foundationSuit = card.suit;
        if (this.canMoveToFoundation(card, foundationSuit)) {
            this.selectedCards = [card];
            this.selectedPile = { type: pileType, index: pileIndex, cardIndex };
            this.moveToFoundation(foundationSuit);
        }
    }
    
    checkWin() {
        return Object.values(this.foundations).every(foundation => foundation.length === 13);
    }
    
    showWinMessage() {
        clearInterval(this.timerInterval);
        document.getElementById('finalTime').textContent = document.getElementById('timer').textContent;
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameMessage').classList.add('show');
        
        // 庆祝动画
        document.querySelector('.game-board').classList.add('win-celebration');
    }
    
    hideMessage() {
        document.getElementById('gameMessage').classList.remove('show');
        document.querySelector('.game-board').classList.remove('win-celebration');
    }
    
    showHint() {
        // 寻找可能的移动
        let hint = this.findBestMove();
        if (hint) {
            alert(`提示：${hint}`);
        } else {
            alert('暂时没有明显的好移动，尝试翻开更多牌或重新排列！');
        }
    }
    
    findBestMove() {
        // 检查是否有牌可以移动到foundation
        for (let suit of ['hearts', 'diamonds', 'clubs', 'spades']) {
            const foundation = this.foundations[suit];
            const nextRank = foundation.length + 1;
            
            // 检查waste
            if (this.waste.length > 0) {
                const wasteCard = this.waste[this.waste.length - 1];
                if (wasteCard.suit === suit && wasteCard.rank === nextRank) {
                    return `将 ${wasteCard.value}${wasteCard.symbol} 从废牌堆移动到基础堆`;
                }
            }
            
            // 检查tableau
            for (let i = 0; i < 7; i++) {
                const pile = this.tableau[i];
                if (pile.length > 0) {
                    const topCard = pile[pile.length - 1];
                    if (topCard.faceUp && topCard.suit === suit && topCard.rank === nextRank) {
                        return `将 ${topCard.value}${topCard.symbol} 从第${i+1}列移动到基础堆`;
                    }
                }
            }
        }
        
        // 检查是否有背面朝上的牌可以翻开
        for (let i = 0; i < 7; i++) {
            const pile = this.tableau[i];
            if (pile.length > 0 && !pile[pile.length - 1].faceUp) {
                return `尝试移动第${i+1}列的正面朝上的牌来翻开背面的牌`;
            }
        }
        
        return null;
    }
    
    autoComplete() {
        let moved = true;
        let autoMoves = 0;
        const maxAutoMoves = 100; // 防止无限循环
        
        while (moved && autoMoves < maxAutoMoves) {
            moved = false;
            autoMoves++;
            
            // 检查所有可以移动到foundation的牌
            for (let suit of ['hearts', 'diamonds', 'clubs', 'spades']) {
                const foundation = this.foundations[suit];
                const nextRank = foundation.length + 1;
                
                // 检查waste
                if (this.waste.length > 0) {
                    const card = this.waste[this.waste.length - 1];
                    if (card.suit === suit && card.rank === nextRank) {
                        this.waste.pop();
                        foundation.push(card);
                        this.score += 10;
                        moved = true;
                        break;
                    }
                }
                
                // 检查tableau
                if (!moved) {
                    for (let i = 0; i < 7; i++) {
                        const pile = this.tableau[i];
                        if (pile.length > 0) {
                            const card = pile[pile.length - 1];
                            if (card.faceUp && card.suit === suit && card.rank === nextRank) {
                                pile.pop();
                                foundation.push(card);
                                this.score += 10;
                                
                                // 翻开下一张牌
                                if (pile.length > 0 && !pile[pile.length - 1].faceUp) {
                                    pile[pile.length - 1].faceUp = true;
                                    this.score += 5;
                                }
                                
                                moved = true;
                                break;
                            }
                        }
                    }
                }
                
                if (moved) break;
            }
        }
        
        this.render();
        
        if (this.checkWin()) {
            this.showWinMessage();
        } else if (autoMoves > 0) {
            this.addMove();
        }
    }
    
    undo() {
        // 简化版撤销 - 实际项目中需要完整的历史记录
        alert('撤销功能需要完整的移动历史记录，当前版本暂未实现');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Solitaire();
});