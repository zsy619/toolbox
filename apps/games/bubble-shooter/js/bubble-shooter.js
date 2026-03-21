class BubbleShooter {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // 游戏状态
        this.gameState = 'menu'; // menu, playing, paused, gameOver
        this.score = 0;
        this.level = 1;
        this.combo = 0;
        this.maxCombo = 0;
        this.highScore = parseInt(localStorage.getItem('bubbleShooterHighScore')) || 0;
        
        // 游戏设置
        this.bubbleRadius = 20;
        this.bubbleColors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink'];
        this.gridRows = 12;
        this.gridCols = 15;
        this.shooterX = this.canvas.width / 2;
        this.shooterY = this.canvas.height - 80;
        
        // 游戏对象
        this.bubbles = [];
        this.currentBubble = null;
        this.nextBubble = null;
        this.shootingBubble = null;
        this.particles = [];
        
        // 瞄准和射击
        this.aimAngle = -Math.PI / 2;
        this.isAiming = false;
        this.mouseX = 0;
        this.mouseY = 0;
        
        // 动画和时间
        this.animationId = null;
        this.lastTime = 0;
        this.dropTimer = 0;
        this.dropInterval = 30000; // 30秒下降一次
        
        this.initGame();
        this.bindEvents();
        this.updateDisplay();
    }
    
    initGame() {
        // 初始化泡泡网格
        this.bubbles = [];
        this.initBubbleGrid();
        
        // 初始化射击泡泡
        this.currentBubble = this.createRandomBubble();
        this.nextBubble = this.createRandomBubble();
        this.shootingBubble = null;
        
        // 重置状态
        this.combo = 0;
        this.maxCombo = 0;
        this.dropTimer = 0;
        this.particles = [];
        
        this.updateBubbleDisplay();
    }
    
    initBubbleGrid() {
        const colors = this.bubbleColors.slice(0, Math.min(5 + Math.floor(this.level / 3), this.bubbleColors.length));
        
        for (let row = 0; row < Math.min(8, this.gridRows); row++) {
            for (let col = 0; col < this.gridCols; col++) {
                // 奇偶行错位排列
                const offset = row % 2 === 1 ? this.bubbleRadius : 0;
                const x = col * this.bubbleRadius * 2 + this.bubbleRadius + offset;
                const y = row * this.bubbleRadius * 1.8 + this.bubbleRadius;
                
                // 不是每个位置都放泡泡，创造一些随机性
                if (Math.random() > 0.1) {
                    this.bubbles.push({
                        x: x,
                        y: y,
                        color: colors[Math.floor(Math.random() * colors.length)],
                        row: row,
                        col: col,
                        falling: false,
                        connected: false
                    });
                }
            }
        }
    }
    
    createRandomBubble() {
        const colors = this.getAvailableColors();
        return {
            color: colors[Math.floor(Math.random() * colors.length)],
            x: this.shooterX,
            y: this.shooterY - this.bubbleRadius,
            vx: 0,
            vy: 0,
            moving: false
        };
    }
    
    getAvailableColors() {
        const usedColors = new Set();
        for (const bubble of this.bubbles) {
            usedColors.add(bubble.color);
        }
        
        // 如果网格中没有泡泡了，返回所有颜色
        if (usedColors.size === 0) {
            return this.bubbleColors.slice(0, Math.min(5, this.bubbleColors.length));
        }
        
        return Array.from(usedColors);
    }
    
    updateBubbleDisplay() {
        const currentBubbleEl = document.getElementById('currentBubble');
        const nextBubbleEl = document.getElementById('nextBubble');
        
        currentBubbleEl.className = `current-bubble bubble-${this.currentBubble.color}`;
        nextBubbleEl.className = `next-bubble bubble-${this.nextBubble.color}`;
    }
    
    startGame() {
        if (this.gameState === 'menu' || this.gameState === 'gameOver') {
            this.gameState = 'playing';
            this.score = 0;
            this.level = 1;
            this.combo = 0;
            this.maxCombo = 0;
            this.dropInterval = 30000;
            this.initGame();
            this.updateDisplay();
            this.gameLoop();
        }
        
        document.getElementById('startBtn').disabled = true;
        document.getElementById('pauseBtn').disabled = false;
    }
    
    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            document.getElementById('pauseBtn').textContent = '继续';
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
            document.getElementById('pauseBtn').textContent = '暂停';
            this.gameLoop();
        }
    }
    
    restartGame() {
        this.gameState = 'menu';
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.initGame();
        this.updateDisplay();
        this.draw();
        
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
        document.getElementById('pauseBtn').textContent = '暂停';
        
        // 移除弹窗
        this.removePopups();
    }
    
    gameLoop(currentTime = 0) {
        if (this.gameState !== 'playing') return;
        
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        this.update(deltaTime);
        this.draw();
        
        this.animationId = requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    update(deltaTime) {
        // 更新射击的泡泡
        if (this.shootingBubble) {
            this.updateShootingBubble(deltaTime);
        }
        
        // 更新粒子效果
        this.updateParticles(deltaTime);
        
        // 更新下降计时器
        this.dropTimer += deltaTime;
        if (this.dropTimer >= this.dropInterval) {
            this.dropBubbles();
            this.dropTimer = 0;
        }
        
        // 检查游戏状态
        this.checkGameState();
    }
    
    updateShootingBubble(deltaTime) {
        const bubble = this.shootingBubble;
        
        bubble.x += bubble.vx * deltaTime * 0.001;
        bubble.y += bubble.vy * deltaTime * 0.001;
        
        // 边界碰撞检测
        if (bubble.x - this.bubbleRadius <= 0 || bubble.x + this.bubbleRadius >= this.canvas.width) {
            bubble.vx = -bubble.vx;
            bubble.x = Math.max(this.bubbleRadius, Math.min(this.canvas.width - this.bubbleRadius, bubble.x));
        }
        
        // 与网格泡泡碰撞检测
        let collision = false;
        let targetRow = -1, targetCol = -1;
        
        for (const gridBubble of this.bubbles) {
            const distance = Math.sqrt(
                Math.pow(bubble.x - gridBubble.x, 2) + 
                Math.pow(bubble.y - gridBubble.y, 2)
            );
            
            if (distance <= this.bubbleRadius * 2) {
                collision = true;
                // 找到最近的有效位置
                const pos = this.findNearestValidPosition(bubble.x, bubble.y);
                targetRow = pos.row;
                targetCol = pos.col;
                break;
            }
        }
        
        // 到达顶部
        if (bubble.y - this.bubbleRadius <= 0) {
            collision = true;
            const pos = this.findNearestValidPosition(bubble.x, this.bubbleRadius);
            targetRow = pos.row;
            targetCol = pos.col;
        }
        
        if (collision) {
            // 将泡泡添加到网格
            this.addBubbleToGrid(bubble, targetRow, targetCol);
            
            // 检查匹配和处理消除
            this.processMatches(targetRow, targetCol);
            
            // 准备下一发
            this.currentBubble = this.nextBubble;
            this.nextBubble = this.createRandomBubble();
            this.shootingBubble = null;
            this.updateBubbleDisplay();
        }
    }
    
    findNearestValidPosition(x, y) {
        let bestRow = 0, bestCol = 0;
        let minDistance = Infinity;
        
        for (let row = 0; row < this.gridRows; row++) {
            for (let col = 0; col < this.gridCols; col++) {
                const offset = row % 2 === 1 ? this.bubbleRadius : 0;
                const gridX = col * this.bubbleRadius * 2 + this.bubbleRadius + offset;
                const gridY = row * this.bubbleRadius * 1.8 + this.bubbleRadius;
                
                // 检查这个位置是否被占用
                const occupied = this.bubbles.some(b => 
                    Math.abs(b.x - gridX) < 1 && Math.abs(b.y - gridY) < 1
                );
                
                if (!occupied) {
                    const distance = Math.sqrt(Math.pow(x - gridX, 2) + Math.pow(y - gridY, 2));
                    if (distance < minDistance) {
                        minDistance = distance;
                        bestRow = row;
                        bestCol = col;
                    }
                }
            }
        }
        
        return { row: bestRow, col: bestCol };
    }
    
    addBubbleToGrid(bubble, row, col) {
        const offset = row % 2 === 1 ? this.bubbleRadius : 0;
        const x = col * this.bubbleRadius * 2 + this.bubbleRadius + offset;
        const y = row * this.bubbleRadius * 1.8 + this.bubbleRadius;
        
        this.bubbles.push({
            x: x,
            y: y,
            color: bubble.color,
            row: row,
            col: col,
            falling: false,
            connected: false
        });
    }
    
    processMatches(row, col) {
        const targetBubble = this.bubbles.find(b => b.row === row && b.col === col);
        if (!targetBubble) return;
        
        // 找到连接的相同颜色泡泡
        const matches = this.findConnectedBubbles(targetBubble);
        
        if (matches.length >= 3) {
            // 消除匹配的泡泡
            this.popBubbles(matches);
            
            // 检查悬空的泡泡
            setTimeout(() => {
                this.dropFloatingBubbles();
            }, 300);
            
            // 更新分数和连击
            const baseScore = matches.length * 10;
            const comboBonus = this.combo * 5;
            const totalScore = baseScore + comboBonus;
            
            this.score += totalScore;
            this.combo++;
            this.maxCombo = Math.max(this.maxCombo, this.combo);
            
            // 显示分数
            this.showScorePopup(targetBubble.x, targetBubble.y, totalScore);
            
            // 更新最高分
            if (this.score > this.highScore) {
                this.highScore = this.score;
                localStorage.setItem('bubbleShooterHighScore', this.highScore.toString());
            }
        } else {
            // 没有匹配，重置连击
            this.combo = 0;
        }
        
        this.updateDisplay();
        this.updateComboDisplay();
    }
    
    findConnectedBubbles(startBubble) {
        const visited = new Set();
        const connected = [];
        const queue = [startBubble];
        
        while (queue.length > 0) {
            const current = queue.shift();
            const key = `${current.row}-${current.col}`;
            
            if (visited.has(key)) continue;
            visited.add(key);
            
            if (current.color === startBubble.color) {
                connected.push(current);
                
                // 检查邻居
                const neighbors = this.getNeighbors(current);
                for (const neighbor of neighbors) {
                    const neighborKey = `${neighbor.row}-${neighbor.col}`;
                    if (!visited.has(neighborKey)) {
                        queue.push(neighbor);
                    }
                }
            }
        }
        
        return connected;
    }
    
    getNeighbors(bubble) {
        const neighbors = [];
        const { row, col } = bubble;
        
        // 六边形邻居位置（奇偶行不同）
        const isOddRow = row % 2 === 1;
        const directions = isOddRow ? [
            [-1, 0], [-1, 1], [0, -1], [0, 1], [1, 0], [1, 1]
        ] : [
            [-1, -1], [-1, 0], [0, -1], [0, 1], [1, -1], [1, 0]
        ];
        
        for (const [dRow, dCol] of directions) {
            const newRow = row + dRow;
            const newCol = col + dCol;
            
            const neighbor = this.bubbles.find(b => b.row === newRow && b.col === newCol);
            if (neighbor) {
                neighbors.push(neighbor);
            }
        }
        
        return neighbors;
    }
    
    popBubbles(bubbles) {
        for (const bubble of bubbles) {
            // 创建爆炸粒子效果
            this.createExplosion(bubble.x, bubble.y, bubble.color);
            
            // 从数组中移除
            const index = this.bubbles.findIndex(b => b === bubble);
            if (index > -1) {
                this.bubbles.splice(index, 1);
            }
        }
    }
    
    dropFloatingBubbles() {
        // 标记所有连接到顶部的泡泡
        this.markConnectedToTop();
        
        // 找到所有悬空的泡泡
        const floatingBubbles = this.bubbles.filter(b => !b.connected);
        
        if (floatingBubbles.length > 0) {
            // 给悬空泡泡添加分数奖励
            const bonusScore = floatingBubbles.length * 5;
            this.score += bonusScore;
            
            // 显示奖励分数
            if (floatingBubbles.length > 0) {
                const centerX = floatingBubbles.reduce((sum, b) => sum + b.x, 0) / floatingBubbles.length;
                const centerY = floatingBubbles.reduce((sum, b) => sum + b.y, 0) / floatingBubbles.length;
                this.showScorePopup(centerX, centerY, bonusScore);
            }
            
            // 移除悬空的泡泡
            for (const bubble of floatingBubbles) {
                bubble.falling = true;
                this.createExplosion(bubble.x, bubble.y, bubble.color);
                
                const index = this.bubbles.findIndex(b => b === bubble);
                if (index > -1) {
                    this.bubbles.splice(index, 1);
                }
            }
        }
    }
    
    markConnectedToTop() {
        // 重置连接状态
        for (const bubble of this.bubbles) {
            bubble.connected = false;
        }
        
        // 从顶部开始标记
        const topBubbles = this.bubbles.filter(b => b.row === 0);
        const queue = [...topBubbles];
        
        while (queue.length > 0) {
            const current = queue.shift();
            if (current.connected) continue;
            
            current.connected = true;
            
            const neighbors = this.getNeighbors(current);
            for (const neighbor of neighbors) {
                if (!neighbor.connected) {
                    queue.push(neighbor);
                }
            }
        }
    }
    
    dropBubbles() {
        // 所有泡泡下移一行
        for (const bubble of this.bubbles) {
            bubble.row++;
            bubble.y += this.bubbleRadius * 1.8;
        }
        
        // 检查是否有泡泡到达底部
        const bottomBubbles = this.bubbles.filter(b => b.y >= this.canvas.height - 100);
        if (bottomBubbles.length > 0) {
            this.endGame();
        }
    }
    
    shoot(targetX, targetY) {
        if (this.gameState !== 'playing' || this.shootingBubble) return;
        
        const angle = Math.atan2(targetY - this.shooterY, targetX - this.shooterX);
        const speed = 600;
        
        this.shootingBubble = {
            x: this.shooterX,
            y: this.shooterY,
            color: this.currentBubble.color,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            moving: true
        };
        
        // 发射动画
        const currentBubbleEl = document.getElementById('currentBubble');
        currentBubbleEl.classList.add('shooting');
        setTimeout(() => {
            currentBubbleEl.classList.remove('shooting');
        }, 200);
    }
    
    createExplosion(x, y, color) {
        for (let i = 0; i < 8; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 200,
                vy: (Math.random() - 0.5) * 200,
                life: 800,
                maxLife: 800,
                alpha: 1,
                color: color,
                size: Math.random() * 6 + 2
            });
        }
    }
    
    updateParticles(deltaTime) {
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx * deltaTime * 0.001;
            particle.y += particle.vy * deltaTime * 0.001;
            particle.life -= deltaTime;
            particle.alpha = particle.life / particle.maxLife;
            
            return particle.life > 0;
        });
    }
    
    showScorePopup(x, y, score) {
        const popup = document.createElement('div');
        popup.className = 'score-popup';
        popup.textContent = `+${score}`;
        popup.style.left = `${x}px`;
        popup.style.top = `${y}px`;
        
        document.querySelector('.game-board').appendChild(popup);
        
        setTimeout(() => {
            if (popup.parentNode) {
                popup.parentNode.removeChild(popup);
            }
        }, 1000);
    }
    
    updateComboDisplay() {
        let comboDisplay = document.querySelector('.combo-display');
        
        if (this.combo > 1) {
            if (!comboDisplay) {
                comboDisplay = document.createElement('div');
                comboDisplay.className = 'combo-display';
                document.querySelector('.game-board').appendChild(comboDisplay);
            }
            
            comboDisplay.textContent = `连击 x${this.combo}`;
            comboDisplay.classList.add('visible');
        } else {
            if (comboDisplay) {
                comboDisplay.classList.remove('visible');
            }
        }
    }
    
    checkGameState() {
        // 检查是否清除所有泡泡
        if (this.bubbles.length === 0) {
            this.nextLevel();
        }
        
        // 检查是否泡泡到达底部
        const dangerousBubbles = this.bubbles.filter(b => b.y >= this.canvas.height - 150);
        if (dangerousBubbles.length > 0) {
            this.endGame();
        }
    }
    
    nextLevel() {
        this.level++;
        this.dropInterval = Math.max(15000, this.dropInterval - 2000);
        
        this.showLevelComplete();
        
        setTimeout(() => {
            this.hideLevelComplete();
            this.initGame();
            this.updateDisplay();
        }, 3000);
    }
    
    endGame() {
        this.gameState = 'gameOver';
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        this.showGameOver();
        
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
        document.getElementById('pauseBtn').textContent = '暂停';
    }
    
    showLevelComplete() {
        const levelCompleteDiv = document.createElement('div');
        levelCompleteDiv.className = 'level-complete';
        levelCompleteDiv.innerHTML = `
            <h2>🎉 第${this.level - 1}关完成! 🎉</h2>
            <div class="level-stats">
                <div>🏆 得分: ${this.score}</div>
                <div>⚡ 最高连击: ${this.maxCombo}</div>
                <div>🚀 进入第${this.level}关</div>
            </div>
        `;
        document.body.appendChild(levelCompleteDiv);
    }
    
    hideLevelComplete() {
        const levelCompleteDiv = document.querySelector('.level-complete');
        if (levelCompleteDiv) {
            levelCompleteDiv.remove();
        }
    }
    
    showGameOver() {
        const gameOverDiv = document.createElement('div');
        gameOverDiv.className = 'game-over';
        gameOverDiv.innerHTML = `
            <h2>🫧 游戏结束 🫧</h2>
            <div class="game-over-stats">
                <div>🏆 最终得分: ${this.score}</div>
                <div>⭐ 最高记录: ${this.highScore}</div>
                <div>🚀 到达关卡: ${this.level}</div>
                <div>⚡ 最高连击: ${this.maxCombo}</div>
            </div>
            <button onclick="bubbleShooter.restartGame()" style="margin-top: 20px;">重新开始</button>
        `;
        document.body.appendChild(gameOverDiv);
    }
    
    removePopups() {
        ['game-over', 'level-complete', 'combo-display'].forEach(className => {
            const element = document.querySelector('.' + className);
            if (element) {
                element.remove();
            }
        });
    }
    
    draw() {
        // 清空画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制网格泡泡
        for (const bubble of this.bubbles) {
            this.drawBubble(bubble.x, bubble.y, bubble.color);
        }
        
        // 绘制射击中的泡泡
        if (this.shootingBubble) {
            this.drawBubble(this.shootingBubble.x, this.shootingBubble.y, this.shootingBubble.color);
        }
        
        // 绘制瞄准线
        if (this.isAiming && this.gameState === 'playing' && !this.shootingBubble) {
            this.drawAimLine();
        }
        
        // 绘制粒子效果
        this.drawParticles();
    }
    
    drawBubble(x, y, color) {
        const gradient = this.ctx.createRadialGradient(
            x - this.bubbleRadius * 0.3, y - this.bubbleRadius * 0.3, 0,
            x, y, this.bubbleRadius
        );
        
        // 根据颜色设置渐变
        const colorMap = {
            'red': ['#ff6b6b', '#ee5a52'],
            'blue': ['#74b9ff', '#0984e3'],
            'green': ['#00b894', '#00a085'],
            'yellow': ['#fdcb6e', '#f39c12'],
            'purple': ['#a29bfe', '#6c5ce7'],
            'orange': ['#fd79a8', '#e17055'],
            'pink': ['#fd79a8', '#e84393']
        };
        
        const colors = colorMap[color] || ['#ddd', '#aaa'];
        gradient.addColorStop(0, colors[0]);
        gradient.addColorStop(1, colors[1]);
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.bubbleRadius, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // 高光效果
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.beginPath();
        this.ctx.arc(x - this.bubbleRadius * 0.3, y - this.bubbleRadius * 0.3, this.bubbleRadius * 0.3, 0, 2 * Math.PI);
        this.ctx.fill();
    }
    
    drawAimLine() {
        const angle = Math.atan2(this.mouseY - this.shooterY, this.mouseX - this.shooterX);
        const length = 100;
        const endX = this.shooterX + Math.cos(angle) * length;
        const endY = this.shooterY + Math.sin(angle) * length;
        
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([10, 5]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.shooterX, this.shooterY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }
    
    drawParticles() {
        for (const particle of this.particles) {
            this.ctx.globalAlpha = particle.alpha;
            const colorMap = {
                'red': '#ff6b6b',
                'blue': '#74b9ff',
                'green': '#00b894',
                'yellow': '#fdcb6e',
                'purple': '#a29bfe',
                'orange': '#fd79a8',
                'pink': '#fd79a8'
            };
            
            this.ctx.fillStyle = colorMap[particle.color] || '#ddd';
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, 2 * Math.PI);
            this.ctx.fill();
        }
        this.ctx.globalAlpha = 1;
    }
    
    updateDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
        document.getElementById('remaining').textContent = this.bubbles.length;
        document.getElementById('combo').textContent = this.combo;
        document.getElementById('highScore').textContent = this.highScore;
    }
    
    bindEvents() {
        // 鼠标事件
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
            this.isAiming = true;
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            this.isAiming = false;
        });
        
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;
            this.shoot(clickX, clickY);
        });
        
        // 触摸事件
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            this.mouseX = touch.clientX - rect.left;
            this.mouseY = touch.clientY - rect.top;
            this.isAiming = true;
        });
        
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            this.mouseX = touch.clientX - rect.left;
            this.mouseY = touch.clientY - rect.top;
        });
        
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.shoot(this.mouseX, this.mouseY);
            this.isAiming = false;
        });
        
        // 键盘事件
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'p':
                case 'P':
                    e.preventDefault();
                    if (this.gameState === 'playing' || this.gameState === 'paused') {
                        this.togglePause();
                    }
                    break;
                case ' ':
                    e.preventDefault();
                    if (this.gameState === 'menu' || this.gameState === 'gameOver') {
                        this.startGame();
                    }
                    break;
                case 'r':
                case 'R':
                    e.preventDefault();
                    this.restartGame();
                    break;
            }
        });
    }
}

// 全局变量
let bubbleShooter;

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    bubbleShooter = new BubbleShooter();
});