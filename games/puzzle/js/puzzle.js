class PuzzleGame {
    constructor() {
        this.size = 3; // 默认3x3
        this.pieces = [];
        this.emptyIndex = null;
        this.moveCount = 0;
        this.gameStartTime = null;
        this.gameTimer = null;
        this.gameFinished = false;
        this.currentImage = 'numbers';
        this.customImageData = null;
        
        // 预设图片数据
        this.presetImages = {
            landscape: this.generateGradientImage('#4facfe', '#00f2fe'),
            animal: this.generateGradientImage('#fa709a', '#fee140'), 
            abstract: this.generateGradientImage('#a8edea', '#fed6e3')
        };
        
        this.initGame();
        this.bindEvents();
        this.loadBestScores();
        this.updateDisplay();
    }
    
    initGame() {
        this.generateSolvedState();
        this.createPuzzleGrid();
        this.updateReferenceImage();
        this.updateStatus('点击"新游戏"开始挑战');
    }
    
    generateSolvedState() {
        this.pieces = Array.from({length: this.size * this.size}, (_, i) => i);
        this.emptyIndex = this.size * this.size - 1;
    }
    
    generateGradientImage(color1, color2) {
        const canvas = document.createElement('canvas');
        canvas.width = 240;
        canvas.height = 240;
        const ctx = canvas.getContext('2d');
        
        const gradient = ctx.createLinearGradient(0, 0, 240, 240);
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 240, 240);
        
        // 添加一些装饰图案
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * 240;
            const y = Math.random() * 240;
            const radius = Math.random() * 20 + 5;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        }
        
        return canvas.toDataURL();
    }
    
    setDifficulty(newSize) {
        if (this.gameTimer) {
            this.stopTimer();
        }
        
        this.size = newSize;
        this.gameFinished = false;
        this.moveCount = 0;
        this.updateDisplay();
        
        // 更新难度按钮状态
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
        
        this.initGame();
    }
    
    changeImage(imageType) {
        this.currentImage = imageType;
        
        if (imageType === 'custom') {
            document.getElementById('customImage').click();
        } else {
            this.customImageData = null;
            this.updateReferenceImage();
            this.createPuzzleGrid();
        }
    }
    
    loadCustomImage(input) {
        const file = input.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = 240;
                canvas.height = 240;
                const ctx = canvas.getContext('2d');
                
                // 绘制图片并调整大小
                ctx.drawImage(img, 0, 0, 240, 240);
                this.customImageData = canvas.toDataURL();
                
                this.updateReferenceImage();
                this.createPuzzleGrid();
            };
            img.src = e.target.result;
        };
        
        reader.readAsDataURL(file);
    }
    
    createPuzzleGrid() {
        const grid = document.getElementById('puzzleGrid');
        grid.innerHTML = '';
        grid.style.gridTemplateColumns = `repeat(${this.size}, 1fr)`;
        
        for (let i = 0; i < this.size * this.size; i++) {
            const piece = document.createElement('div');
            piece.className = 'puzzle-piece';
            piece.dataset.index = i;
            
            if (i === this.emptyIndex) {
                piece.classList.add('empty');
            } else {
                this.setPieceContent(piece, this.pieces[i]);
            }
            
            piece.addEventListener('click', () => this.movePiece(i));
            grid.appendChild(piece);
        }
        
        this.updateMovablePieces();
    }
    
    setPieceContent(piece, value) {
        if (this.currentImage === 'numbers') {
            piece.textContent = value + 1;
            piece.style.backgroundImage = '';
        } else {
            piece.textContent = '';
            const imageData = this.getImageData();
            if (imageData) {
                const pieceSize = 240 / this.size;
                const row = Math.floor(value / this.size);
                const col = value % this.size;
                
                piece.style.background = `url(${imageData}) no-repeat`;
                piece.style.backgroundSize = '240px 240px';
                piece.style.backgroundPosition = `-${col * pieceSize}px -${row * pieceSize}px`;
            }
        }
    }
    
    getImageData() {
        if (this.currentImage === 'custom' && this.customImageData) {
            return this.customImageData;
        }
        return this.presetImages[this.currentImage];
    }
    
    updateReferenceImage() {
        const referenceDisplay = document.getElementById('referenceDisplay');
        
        if (this.currentImage === 'numbers') {
            referenceDisplay.className = 'reference-display numbers';
            referenceDisplay.innerHTML = `完整的${this.size}×${this.size}拼图`;
            referenceDisplay.style.backgroundImage = '';
        } else {
            referenceDisplay.className = 'reference-display';
            referenceDisplay.innerHTML = '';
            const imageData = this.getImageData();
            if (imageData) {
                const img = document.createElement('img');
                img.src = imageData;
                img.alt = '参考图片';
                referenceDisplay.appendChild(img);
            }
        }
    }
    
    newGame() {
        this.gameFinished = false;
        this.moveCount = 0;
        this.generateSolvedState();
        this.shuffle();
        this.startTimer();
        this.updateDisplay();
        this.updateStatus('开始游戏！移动拼图块完成拼图');
    }
    
    shuffle() {
        // 使用合法的移动来打乱，确保有解
        const shuffleCount = this.size * this.size * 50;
        
        for (let i = 0; i < shuffleCount; i++) {
            const movableIndices = this.getMovableIndices();
            if (movableIndices.length > 0) {
                const randomIndex = movableIndices[Math.floor(Math.random() * movableIndices.length)];
                this.swapPieces(randomIndex, this.emptyIndex);
            }
        }
        
        this.createPuzzleGrid();
        this.updateProgress();
    }
    
    movePiece(index) {
        if (this.gameFinished || !this.isMovable(index)) {
            return;
        }
        
        this.swapPieces(index, this.emptyIndex);
        this.moveCount++;
        
        this.createPuzzleGrid();
        this.updateDisplay();
        this.updateProgress();
        
        if (this.checkWin()) {
            this.gameWin();
        } else {
            this.updateStatus(`已移动 ${this.moveCount} 步`);
        }
    }
    
    swapPieces(index1, index2) {
        [this.pieces[index1], this.pieces[index2]] = [this.pieces[index2], this.pieces[index1]];
        
        if (index1 === this.emptyIndex) {
            this.emptyIndex = index2;
        } else if (index2 === this.emptyIndex) {
            this.emptyIndex = index1;
        }
    }
    
    isMovable(index) {
        const row = Math.floor(index / this.size);
        const col = index % this.size;
        const emptyRow = Math.floor(this.emptyIndex / this.size);
        const emptyCol = this.emptyIndex % this.size;
        
        return (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
               (Math.abs(col - emptyCol) === 1 && row === emptyRow);
    }
    
    getMovableIndices() {
        const movable = [];
        for (let i = 0; i < this.size * this.size; i++) {
            if (this.isMovable(i)) {
                movable.push(i);
            }
        }
        return movable;
    }
    
    updateMovablePieces() {
        const pieces = document.querySelectorAll('.puzzle-piece');
        pieces.forEach((piece, index) => {
            piece.classList.remove('movable');
            if (this.isMovable(index) && !this.gameFinished) {
                piece.classList.add('movable');
            }
        });
    }
    
    checkWin() {
        for (let i = 0; i < this.size * this.size - 1; i++) {
            if (this.pieces[i] !== i) {
                return false;
            }
        }
        return true;
    }
    
    gameWin() {
        this.gameFinished = true;
        this.stopTimer();
        
        const finalTime = this.getGameTime();
        const isNewRecord = this.checkNewRecord(finalTime, this.moveCount);
        
        if (isNewRecord) {
            this.saveBestScore(finalTime, this.moveCount);
        }
        
        this.showVictoryPopup(finalTime, isNewRecord);
        this.updateStatus('🎉 恭喜完成拼图！');
        
        // 显示完成效果
        document.querySelectorAll('.puzzle-piece:not(.empty)').forEach(piece => {
            piece.classList.add('correct');
        });
    }
    
    showVictoryPopup(finalTime, isNewRecord) {
        document.getElementById('finalMoves').textContent = this.moveCount;
        document.getElementById('finalTime').textContent = this.formatTime(finalTime);
        document.getElementById('newRecord').style.display = isNewRecord ? 'block' : 'none';
        document.getElementById('victoryPopup').style.display = 'flex';
    }
    
    closeVictory() {
        document.getElementById('victoryPopup').style.display = 'none';
    }
    
    showHint() {
        if (this.gameFinished) return;
        
        // 高亮一个正确位置的拼图块
        const pieces = document.querySelectorAll('.puzzle-piece');
        let hintShown = false;
        
        for (let i = 0; i < this.size * this.size - 1; i++) {
            if (this.pieces[i] === i) {
                pieces[i].classList.add('correct');
                setTimeout(() => {
                    pieces[i].classList.remove('correct');
                }, 1000);
                
                if (!hintShown) {
                    this.updateStatus('绿色高亮的拼图块位置正确！');
                    hintShown = true;
                }
            }
        }
        
        if (!hintShown) {
            this.updateStatus('还没有拼图块在正确位置');
        }
    }
    
    autoSolve() {
        if (this.gameFinished) return;
        
        // 简单的自动求解：逐步移动到正确位置
        const solveMoves = this.findSolution();
        if (solveMoves.length === 0) {
            this.updateStatus('拼图已经完成！');
            return;
        }
        
        this.updateStatus('自动求解中...');
        
        let moveIndex = 0;
        const executeMoves = () => {
            if (moveIndex < solveMoves.length && !this.gameFinished) {
                this.movePiece(solveMoves[moveIndex]);
                moveIndex++;
                setTimeout(executeMoves, 300);
            }
        };
        
        executeMoves();
    }
    
    findSolution() {
        // 简化的求解算法：找到需要移动的步骤
        const solution = [];
        const tempPieces = [...this.pieces];
        let tempEmpty = this.emptyIndex;
        
        // 简单的贪心算法，优先移动到正确位置
        for (let target = 0; target < this.size * this.size - 1; target++) {
            if (tempPieces[target] !== target) {
                // 找到目标数字的当前位置
                const currentPos = tempPieces.indexOf(target);
                // 如果可以直接移动到目标位置，记录这步移动
                if (this.canMoveDirectly(currentPos, target, tempEmpty)) {
                    solution.push(currentPos);
                    // 更新临时状态
                    [tempPieces[currentPos], tempPieces[tempEmpty]] = [tempPieces[tempEmpty], tempPieces[currentPos]];
                    tempEmpty = currentPos;
                }
            }
        }
        
        return solution.slice(0, 10); // 限制自动求解步数
    }
    
    canMoveDirectly(from, to, emptyPos) {
        // 简化判断：只检查是否可以移动到空位
        const row1 = Math.floor(from / this.size);
        const col1 = from % this.size;
        const emptyRow = Math.floor(emptyPos / this.size);
        const emptyCol = emptyPos % this.size;
        
        return (Math.abs(row1 - emptyRow) === 1 && col1 === emptyCol) ||
               (Math.abs(col1 - emptyCol) === 1 && row1 === emptyRow);
    }
    
    updateProgress() {
        let correctPieces = 0;
        for (let i = 0; i < this.size * this.size - 1; i++) {
            if (this.pieces[i] === i) {
                correctPieces++;
            }
        }
        
        const progress = (correctPieces / (this.size * this.size - 1)) * 100;
        document.getElementById('progressFill').style.width = progress + '%';
    }
    
    startTimer() {
        this.gameStartTime = Date.now();
        this.gameTimer = setInterval(() => {
            this.updateGameTime();
        }, 1000);
    }
    
    stopTimer() {
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }
    }
    
    getGameTime() {
        if (!this.gameStartTime) return 0;
        return Math.floor((Date.now() - this.gameStartTime) / 1000);
    }
    
    updateGameTime() {
        const timeDisplay = document.getElementById('gameTime');
        timeDisplay.textContent = this.formatTime(this.getGameTime());
    }
    
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    updateDisplay() {
        document.getElementById('difficulty').textContent = `${this.size}×${this.size}`;
        document.getElementById('moveCount').textContent = this.moveCount;
        this.updateMovablePieces();
        this.loadBestScores();
    }
    
    updateStatus(message) {
        document.getElementById('statusMessage').textContent = message;
    }
    
    saveBestScore(time, moves) {
        const key = `puzzleBest_${this.size}x${this.size}`;
        const bestScore = {
            time: time,
            moves: moves,
            date: new Date().toISOString()
        };
        localStorage.setItem(key, JSON.stringify(bestScore));
    }
    
    loadBestScores() {
        const key = `puzzleBest_${this.size}x${this.size}`;
        const saved = localStorage.getItem(key);
        
        if (saved) {
            const bestScore = JSON.parse(saved);
            document.getElementById('bestScore').textContent = 
                `${this.formatTime(bestScore.time)} (${bestScore.moves}步)`;
        } else {
            document.getElementById('bestScore').textContent = '--';
        }
    }
    
    checkNewRecord(time, moves) {
        const key = `puzzleBest_${this.size}x${this.size}`;
        const saved = localStorage.getItem(key);
        
        if (!saved) return true;
        
        const bestScore = JSON.parse(saved);
        return time < bestScore.time || (time === bestScore.time && moves < bestScore.moves);
    }
    
    bindEvents() {
        // 键盘控制
        document.addEventListener('keydown', (e) => {
            if (this.gameFinished) return;
            
            const emptyRow = Math.floor(this.emptyIndex / this.size);
            const emptyCol = this.emptyIndex % this.size;
            let targetIndex = -1;
            
            switch (e.key) {
                case 'ArrowUp':
                    if (emptyRow < this.size - 1) {
                        targetIndex = (emptyRow + 1) * this.size + emptyCol;
                    }
                    break;
                case 'ArrowDown':
                    if (emptyRow > 0) {
                        targetIndex = (emptyRow - 1) * this.size + emptyCol;
                    }
                    break;
                case 'ArrowLeft':
                    if (emptyCol < this.size - 1) {
                        targetIndex = emptyRow * this.size + emptyCol + 1;
                    }
                    break;
                case 'ArrowRight':
                    if (emptyCol > 0) {
                        targetIndex = emptyRow * this.size + emptyCol - 1;
                    }
                    break;
            }
            
            if (targetIndex >= 0) {
                e.preventDefault();
                this.movePiece(targetIndex);
            }
        });
    }
}

// 全局变量
let puzzleGame;

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    puzzleGame = new PuzzleGame();
});