class Match3Game {
    constructor() {
        console.log('🎮 Match3Game constructor started');
        
        // 游戏状态
        this.gameState = 'menu'; // menu, playing, paused, gameOver
        this.score = 0;
        this.level = 1;
        this.moves = 30;
        this.target = 1000;
        this.combo = 0;
        this.maxCombo = 0;
        this.gameStartTime = 0;
        this.gameTime = 0;
        this.timer = null;
        
        // 游戏设置 - 必须先初始化这些
        this.gridSize = 8;
        this.gemTypes = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
        
        console.log('📊 Basic properties initialized');
        console.log('🎯 Grid size:', this.gridSize);
        console.log('💎 Gem types:', this.gemTypes);
        
        this.gemEmojis = {
            'red': '🔴',
            'blue': '🔵', 
            'green': '🟢',
            'yellow': '🟡',
            'purple': '🟣',
            'orange': '🟠',
            'pink': '🩷',
            'bomb': '💣',
            'rainbow': '🌈',
            'lightning': '⚡'
        };
        
        // 道具系统
        this.powerUps = {
            bomb: 3,
            rainbow: 2,
            shuffle: 2,
            extraMoves: 1
        };
        this.activePowerUp = null;
        
        // 设置
        this.settings = {
            difficulty: 'normal',
            autoHint: false,
            animation: true,
            sound: true,
            volume: 50
        };
        
        // 统计数据
        this.stats = {
            totalGames: 0,
            highScore: 0,
            maxLevel: 1,
            totalPlayTime: 0
        };
        
        // 成就系统
        this.achievements = {
            firstWin: { name: '初次胜利', desc: '完成第一关', icon: '🎉', unlocked: false },
            combo5: { name: '连击高手', desc: '达成5连击', icon: '⚡', unlocked: false },
            score10k: { name: '得分达人', desc: '单局得分超过10000', icon: '💎', unlocked: false },
            level10: { name: '关卡挑战者', desc: '到达第10关', icon: '🚀', unlocked: false },
            perfectGame: { name: '完美游戏', desc: '一局游戏中无失误', icon: '⭐', unlocked: false },
            speedRunner: { name: '速度之王', desc: '3分钟内完成一关', icon: '🏃', unlocked: false },
            bombMaster: { name: '爆破专家', desc: '使用炸弹道具10次', icon: '💥', unlocked: false },
            rainbowCollector: { name: '彩虹收集者', desc: '创造彩虹宝石20次', icon: '🌈', unlocked: false }
        };
        
        // 游戏网格和选择状态
        this.grid = [];
        this.selectedGem = null;
        this.isAnimating = false;
        this.hintGems = [];
        this.hintTimer = null;
        
        console.log('📦 All properties initialized');
        
        try {
            console.log('📂 Loading data...');
            this.loadData();
            
            console.log('🔄 Initializing game...');
            this.initGame();
            
            console.log('🔗 Binding events...');
            this.bindEvents();
            
            console.log('📊 Updating display...');
            this.updateDisplay();
            
            console.log('🏆 Rendering achievements...');
            this.renderAchievements();
            
            console.log('✅ Match3Game constructor completed successfully');
        } catch (error) {
            console.error('❌ Error in constructor:', error);
            console.error('📍 Error occurred at:', error.stack);
            throw error; // 重新抛出错误以便外部捕获
        }
        
        // 添加全局测试函数
        window.testMatch3 = () => {
            console.log('🧪 Testing Match3 game...');
            console.log('Game state:', this.gameState);
            console.log('Grid:', this.grid);
            this.startGame();
        };
    }
    
    initGame() {
        console.log('🔄 initGame called');
        
        try {
            this.grid = this.createGrid();
            this.selectedGem = null;
            this.isAnimating = false;
            this.combo = 0;
            this.hintGems = [];
            
            console.log('📊 Grid created with', this.gridSize * this.gridSize, 'gems');
            console.log('🎯 Grid sample:', this.grid[0] ? this.grid[0][0] : 'No grid data');
            
            this.renderGrid();
            console.log('🎨 renderGrid completed');
        } catch (error) {
            console.error('❌ Error in initGame:', error);
            console.error('📍 Stack trace:', error.stack);
            throw error;
        }
    }
    
    createGrid() {
        const grid = [];
        
        // 创建初始网格，避免初始匹配
        for (let row = 0; row < this.gridSize; row++) {
            grid[row] = [];
            for (let col = 0; col < this.gridSize; col++) {
                let gemType;
                do {
                    gemType = this.getRandomGemType();
                } while (this.wouldCreateMatch(grid, row, col, gemType));
                
                grid[row][col] = {
                    type: gemType,
                    special: null,
                    element: null
                };
            }
        }
        
        return grid;
    }
    
    wouldCreateMatch(grid, row, col, gemType) {
        // 安全检查
        if (!grid || !gemType || row < 0 || col < 0 || row >= this.gridSize || col >= this.gridSize) {
            return false;
        }
        
        // 检查水平匹配
        let horizontalCount = 1;
        // 向左检查
        for (let c = col - 1; c >= 0; c--) {
            if (grid[row] && grid[row][c] && grid[row][c].type === gemType) {
                horizontalCount++;
            } else {
                break;
            }
        }
        // 向右检查
        for (let c = col + 1; c < this.gridSize; c++) {
            if (grid[row] && grid[row][c] && grid[row][c].type === gemType) {
                horizontalCount++;
            } else {
                break;
            }
        }
        
        // 检查垂直匹配
        let verticalCount = 1;
        // 向上检查
        for (let r = row - 1; r >= 0; r--) {
            if (grid[r] && grid[r][col] && grid[r][col].type === gemType) {
                verticalCount++;
            } else {
                break;
            }
        }
        // 向下检查
        for (let r = row + 1; r < this.gridSize; r++) {
            if (grid[r] && grid[r][col] && grid[r][col].type === gemType) {
                verticalCount++;
            } else {
                break;
            }
        }
        
        return horizontalCount >= 3 || verticalCount >= 3;
    }
    
    getRandomGemType() {
        if (!this.gemTypes || this.gemTypes.length === 0) {
            console.error('❌ gemTypes array is not initialized!');
            return 'red'; // 默认返回红色
        }
        return this.gemTypes[Math.floor(Math.random() * this.gemTypes.length)];
    }
    
    renderGrid() {
        const container = document.getElementById('gridContainer');
        if (!container) {
            console.error('❌ Grid container not found! HTML可能有问题');
            alert('错误：找不到游戏网格容器！请检查HTML文件。');
            return;
        }
        
        console.log('🎮 开始渲染游戏网格...');
        container.innerHTML = '';
        
        let gemCount = 0;
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const gem = this.grid[row][col];
                if (!gem) {
                    console.error(`❌ 第${row}行${col}列没有宝石数据！`);
                    continue;
                }
                
                const gemElement = document.createElement('div');
                gemElement.className = `gem ${gem.type}`;
                gemElement.dataset.row = row;
                gemElement.dataset.col = col;
                
                // 添加特殊宝石类
                if (gem.special) {
                    gemElement.classList.add(gem.special);
                }
                
                // 设置宝石图标
                gemElement.textContent = this.gemEmojis[gem.special || gem.type];
                
                // 添加点击事件
                gemElement.addEventListener('click', (e) => this.handleGemClick(e));
                
                gem.element = gemElement;
                container.appendChild(gemElement);
                gemCount++;
            }
        }
        
        console.log(`✅ 游戏网格渲染完成！创建了 ${gemCount} 个宝石`);
    }
    
    areAdjacent(gem1, gem2) {
        const rowDiff = Math.abs(gem1.row - gem2.row);
        const colDiff = Math.abs(gem1.col - gem2.col);
        return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
    }
    
    async attemptSwap(gem1, gem2) {
        this.selectedGem = null;
        this.isAnimating = true;
        
        // 交换宝石
        this.swapGems(gem1, gem2);
        
        // 检查匹配
        const matches = this.findAllMatches();
        
        if (matches.length > 0) {
            // 有匹配，消耗移动次数
            this.moves--;
            this.updateDisplay();
            
            // 处理匹配
            await this.processMatches();
        } else {
            // 没有匹配，交换回来
            await this.animateSwap(gem1, gem2);
            this.swapGems(gem1, gem2);
        }
        
        this.isAnimating = false;
    }
    
    swapGems(gem1, gem2) {
        const temp = this.grid[gem1.row][gem1.col];
        this.grid[gem1.row][gem1.col] = this.grid[gem2.row][gem2.col];
        this.grid[gem2.row][gem2.col] = temp;
        
        // 更新元素的位置数据
        if (this.grid[gem1.row][gem1.col].element) {
            this.grid[gem1.row][gem1.col].element.dataset.row = gem1.row;
            this.grid[gem1.row][gem1.col].element.dataset.col = gem1.col;
        }
        if (this.grid[gem2.row][gem2.col].element) {
            this.grid[gem2.row][gem2.col].element.dataset.row = gem2.row;
            this.grid[gem2.row][gem2.col].element.dataset.col = gem2.col;
        }
    }
    
    async animateSwap(gem1, gem2) {
        return new Promise(resolve => {
            setTimeout(() => {
                this.renderGrid();
                resolve();
            }, 300);
        });
    }
    
    findAllMatches() {
        const matches = [];
        const marked = Array(this.gridSize).fill().map(() => Array(this.gridSize).fill(false));
        
        // 检查水平匹配
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize - 2; col++) {
                const gem = this.grid[row][col];
                if (!gem) continue;
                
                let count = 1;
                let endCol = col;
                
                for (let c = col + 1; c < this.gridSize; c++) {
                    const nextGem = this.grid[row][c];
                    if (nextGem && nextGem.type === gem.type) {
                        count++;
                        endCol = c;
                    } else {
                        break;
                    }
                }
                
                if (count >= 3) {
                    for (let c = col; c <= endCol; c++) {
                        if (!marked[row][c]) {
                            marked[row][c] = true;
                            matches.push({ row, col: c });
                        }
                    }
                }
            }
        }
        
        // 检查垂直匹配
        for (let col = 0; col < this.gridSize; col++) {
            for (let row = 0; row < this.gridSize - 2; row++) {
                const gem = this.grid[row][col];
                if (!gem) continue;
                
                let count = 1;
                let endRow = row;
                
                for (let r = row + 1; r < this.gridSize; r++) {
                    const nextGem = this.grid[r][col];
                    if (nextGem && nextGem.type === gem.type) {
                        count++;
                        endRow = r;
                    } else {
                        break;
                    }
                }
                
                if (count >= 3) {
                    for (let r = row; r <= endRow; r++) {
                        if (!marked[r][col]) {
                            marked[r][col] = true;
                            matches.push({ row: r, col });
                        }
                    }
                }
            }
        }
        
        return matches;
    }
    
    createSpecialGems(matches) {
        // 根据匹配数量创建特殊宝石
        if (matches.length >= 5) {
            // 创建彩虹宝石
            const centerMatch = matches[Math.floor(matches.length / 2)];
            if (this.grid[centerMatch.row] && this.grid[centerMatch.row][centerMatch.col]) {
                this.grid[centerMatch.row][centerMatch.col] = {
                    type: 'rainbow',
                    special: 'rainbow',
                    element: null
                };
            }
        } else if (matches.length === 4) {
            // 创建炸弹宝石
            const centerMatch = matches[Math.floor(matches.length / 2)];
            if (this.grid[centerMatch.row] && this.grid[centerMatch.row][centerMatch.col]) {
                this.grid[centerMatch.row][centerMatch.col] = {
                    type: this.grid[centerMatch.row][centerMatch.col]?.type || 'red',
                    special: 'bomb',
                    element: null
                };
            }
        }
    }
    
    explodeGems(positions) {
        for (const pos of positions) {
            if (this.grid[pos.row] && this.grid[pos.row][pos.col]) {
                const gem = this.grid[pos.row][pos.col];
                if (gem.element) {
                    gem.element.classList.add('exploding');
                    this.createParticleEffect(pos.row, pos.col, this.gemEmojis[gem.type]);
                }
            }
        }
        
        // 延迟后移除宝石
        setTimeout(() => {
            for (const pos of positions) {
                if (this.grid[pos.row] && this.grid[pos.row][pos.col]) {
                    this.grid[pos.row][pos.col] = null;
                }
            }
            this.renderGrid();
            
            // 处理掉落和填充
            this.dropGems().then(() => {
                this.fillEmptySpaces().then(() => {
                    this.processMatches();
                });
            });
        }, 600);
    }
    
    async dropGems() {
        let moved = false;
        
        for (let col = 0; col < this.gridSize; col++) {
            let writePos = this.gridSize - 1;
            
            for (let row = this.gridSize - 1; row >= 0; row--) {
                if (this.grid[row][col] !== null) {
                    if (row !== writePos) {
                        this.grid[writePos][col] = this.grid[row][col];
                        this.grid[row][col] = null;
                        
                        // 更新元素位置数据
                        if (this.grid[writePos][col] && this.grid[writePos][col].element) {
                            this.grid[writePos][col].element.dataset.row = writePos;
                            this.grid[writePos][col].element.dataset.col = col;
                        }
                        
                        moved = true;
                    }
                    writePos--;
                }
            }
        }
        
        if (moved) {
            this.renderGrid();
            await this.delay(300);
        }
    }
    
    async fillEmptySpaces() {
        let filled = false;
        
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                if (this.grid[row][col] === null) {
                    this.grid[row][col] = {
                        type: this.getRandomGemType(),
                        special: null,
                        element: null
                    };
                    filled = true;
                }
            }
        }
        
        if (filled) {
            this.renderGrid();
            
            // 添加掉落动画
            for (let row = 0; row < this.gridSize; row++) {
                for (let col = 0; col < this.gridSize; col++) {
                    const gem = this.grid[row][col];
                    if (gem && gem.element) {
                        gem.element.classList.add('falling');
                    }
                }
            }
            
            await this.delay(500);
            
            // 移除动画类
            for (let row = 0; row < this.gridSize; row++) {
                for (let col = 0; col < this.gridSize; col++) {
                    const gem = this.grid[row][col];
                    if (gem && gem.element) {
                        gem.element.classList.remove('falling');
                    }
                }
            }
        }
    }
    
    // 数据管理
    loadData() {
        try {
            const savedSettings = localStorage.getItem('match3-settings');
            if (savedSettings) {
                this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
            }
            
            const savedStats = localStorage.getItem('match3-stats');
            if (savedStats) {
                this.stats = { ...this.stats, ...JSON.parse(savedStats) };
            }
            
            const savedAchievements = localStorage.getItem('match3-achievements');
            if (savedAchievements) {
                const achievements = JSON.parse(savedAchievements);
                Object.keys(achievements).forEach(key => {
                    if (this.achievements[key]) {
                        this.achievements[key].unlocked = achievements[key].unlocked;
                    }
                });
            }
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }
    
    saveData() {
        try {
            localStorage.setItem('match3-settings', JSON.stringify(this.settings));
            localStorage.setItem('match3-stats', JSON.stringify(this.stats));
            
            const achievementData = {};
            Object.keys(this.achievements).forEach(key => {
                achievementData[key] = { unlocked: this.achievements[key].unlocked };
            });
            localStorage.setItem('match3-achievements', JSON.stringify(achievementData));
        } catch (error) {
            console.error('Error saving data:', error);
        }
    }
    
    // 计时器管理
    startTimer() {
        this.gameStartTime = Date.now();
        this.timer = setInterval(() => {
            this.gameTime = Math.floor((Date.now() - this.gameStartTime) / 1000);
            this.updateTimerDisplay();
        }, 1000);
    }
    
    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
    
    updateTimerDisplay() {
        const timerElement = document.getElementById('timer');
        if (timerElement) {
            const minutes = Math.floor(this.gameTime / 60);
            const seconds = this.gameTime % 60;
            timerElement.textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }
    
    // 游戏控制方法
    startGame() {
        console.log('▶️ startGame called, current state:', this.gameState);
        
        if (this.gameState === 'menu' || this.gameState === 'gameOver') {
            this.gameState = 'playing';
            this.score = 0;
            this.level = 1;
            this.moves = this.getDifficultyMoves();
            this.target = this.getDifficultyTarget();
            this.combo = 0;
            this.maxCombo = 0;
            this.gameTime = 0;
            
            // 重置道具
            this.powerUps = {
                bomb: 3,
                rainbow: 2,
                shuffle: 2,
                extraMoves: 1
            };
            this.activePowerUp = null;
            
            this.initGame();
            this.updateDisplay();
            this.updatePowerUpDisplay();
            this.startTimer();
            
            // 显示道具栏
            const powerUpsSection = document.getElementById('powerUpsSection');
            if (powerUpsSection) {
                powerUpsSection.style.display = 'block';
            }
            
            // 更新按钮状态
            const startBtn = document.getElementById('startBtn');
            const pauseBtn = document.getElementById('pauseBtn');
            
            if (startBtn) startBtn.disabled = true;
            if (pauseBtn) pauseBtn.disabled = false;
            
            this.playSound('start');
            console.log('✅ Game started successfully');
        }
    }
    
    togglePause() {
        console.log('⏸️ togglePause called');
        
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            this.stopTimer();
            const pauseBtn = document.getElementById('pauseBtn');
            if (pauseBtn) pauseBtn.textContent = '▶️ 继续';
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
            this.startTimer();
            const pauseBtn = document.getElementById('pauseBtn');
            if (pauseBtn) pauseBtn.textContent = '⏸️ 暂停';
        }
    }
    
    restartGame() {
        console.log('🔄 restartGame called');
        
        this.gameState = 'menu';
        this.stopTimer();
        this.clearAutoHint();
        this.initGame();
        this.updateDisplay();
        
        const startBtn = document.getElementById('startBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        const powerUpsSection = document.getElementById('powerUpsSection');
        
        if (startBtn) startBtn.disabled = false;
        if (pauseBtn) {
            pauseBtn.disabled = true;
            pauseBtn.textContent = '⏸️ 暂停';
        }
        if (powerUpsSection) powerUpsSection.style.display = 'none';
        
        this.removePopups();
    }
    
    getDifficultyMoves() {
        const moves = {
            easy: 35,
            normal: 30,
            hard: 25,
            expert: 20
        };
        return moves[this.settings.difficulty] || 30;
    }
    
    getDifficultyTarget() {
        const targets = {
            easy: 800,
            normal: 1000,
            hard: 1200,
            expert: 1500
        };
        return targets[this.settings.difficulty] || 1000;
    }
    
    // 道具系统
    activatePowerUp(type) {
        console.log('🔧 activatePowerUp:', type);
        
        if (this.gameState !== 'playing' || this.powerUps[type] <= 0) return;
        
        if (this.activePowerUp === type) {
            // 取消激活
            this.activePowerUp = null;
            this.updatePowerUpDisplay();
            return;
        }
        
        this.activePowerUp = type;
        this.updatePowerUpDisplay();
        
        if (type === 'shuffle') {
            this.useShuffle();
        } else if (type === 'extraMoves') {
            this.useExtraMoves();
        }
        
        this.playSound('powerup');
    }
    
    usePowerUp(row, col) {
        if (!this.activePowerUp || this.powerUps[this.activePowerUp] <= 0) return false;
        
        this.powerUps[this.activePowerUp]--;
        
        switch (this.activePowerUp) {
            case 'bomb':
                this.useBomb(row, col);
                break;
            case 'rainbow':
                this.useRainbow(row, col);
                break;
        }
        
        this.activePowerUp = null;
        this.updatePowerUpDisplay();
        return true;
    }
    
    useBomb(row, col) {
        // 炸弹效果：消除3x3范围内的宝石
        const positions = [];
        for (let r = Math.max(0, row - 1); r <= Math.min(this.gridSize - 1, row + 1); r++) {
            for (let c = Math.max(0, col - 1); c <= Math.min(this.gridSize - 1, col + 1); c++) {
                positions.push({ row: r, col: c });
            }
        }
        
        this.explodeGems(positions);
        this.createParticleEffect(row, col, '💥');
    }
    
    useRainbow(row, col) {
        // 彩虹效果：消除所有同色宝石
        const targetType = this.grid[row][col].type;
        const positions = [];
        
        for (let r = 0; r < this.gridSize; r++) {
            for (let c = 0; c < this.gridSize; c++) {
                if (this.grid[r][c] && this.grid[r][c].type === targetType) {
                    positions.push({ row: r, col: c });
                }
            }
        }
        
        this.explodeGems(positions);
        this.createParticleEffect(row, col, '🌈');
    }
    
    useShuffle() {
        // 重新排列棋盘
        this.powerUps.shuffle--;
        this.shuffleBoard();
        this.activePowerUp = null;
        this.updatePowerUpDisplay();
    }
    
    useExtraMoves() {
        // 增加5步移动
        this.powerUps.extraMoves--;
        this.moves += 5;
        this.activePowerUp = null;
        this.updateDisplay();
        this.updatePowerUpDisplay();
        this.showFloatingText('+5 移动', '#27ae60');
    }
    
    shuffleBoard() {
        const gems = [];
        
        // 收集所有宝石
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                if (this.grid[row][col]) {
                    gems.push(this.grid[row][col].type);
                }
            }
        }
        
        // 打乱数组
        for (let i = gems.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [gems[i], gems[j]] = [gems[j], gems[i]];
        }
        
        // 重新分配
        let index = 0;
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                if (this.grid[row][col]) {
                    this.grid[row][col].type = gems[index++];
                    this.grid[row][col].special = null;
                }
            }
        }
        
        this.renderGrid();
        this.createParticleEffect(this.gridSize / 2, this.gridSize / 2, '🔀');
    }
    
    updatePowerUpDisplay() {
        Object.keys(this.powerUps).forEach(type => {
            const element = document.getElementById(`${type}PowerUp`);
            const countElement = document.getElementById(`${type}Count`);
            
            if (element && countElement) {
                countElement.textContent = this.powerUps[type];
                
                if (this.powerUps[type] <= 0) {
                    element.classList.add('disabled');
                } else {
                    element.classList.remove('disabled');
                }
                
                if (this.activePowerUp === type) {
                    element.classList.add('active');
                } else {
                    element.classList.remove('active');
                }
            }
        });
    }
    
    // 提示系统
    showHint() {
        console.log('💡 showHint called');
        
        if (this.gameState !== 'playing' || this.isAnimating) return;
        
        this.clearHints();
        
        // 寻找可能的移动
        const possibleMoves = this.findPossibleMoves();
        
        if (possibleMoves.length > 0) {
            const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            
            this.hintGems = [randomMove.gem1, randomMove.gem2];
            
            for (const gem of this.hintGems) {
                if (this.grid[gem.row] && this.grid[gem.row][gem.col] && this.grid[gem.row][gem.col].element) {
                    this.grid[gem.row][gem.col].element.classList.add('hint');
                }
            }
            
            // 3秒后清除提示
            setTimeout(() => {
                this.clearHints();
            }, 3000);
        } else {
            this.showFloatingText('没有可用移动，重新排列！', '#e74c3c');
            setTimeout(() => {
                this.shuffleBoard();
            }, 1000);
        }
    }
    
    findPossibleMoves() {
        const moves = [];
        
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                // 检查右边的宝石
                if (col + 1 < this.gridSize) {
                    this.swapGems({ row, col }, { row, col: col + 1 });
                    if (this.findAllMatches().length > 0) {
                        moves.push({
                            gem1: { row, col },
                            gem2: { row, col: col + 1 }
                        });
                    }
                    this.swapGems({ row, col }, { row, col: col + 1 }); // 交换回来
                }
                
                // 检查下面的宝石
                if (row + 1 < this.gridSize) {
                    this.swapGems({ row, col }, { row: row + 1, col });
                    if (this.findAllMatches().length > 0) {
                        moves.push({
                            gem1: { row, col },
                            gem2: { row: row + 1, col }
                        });
                    }
                    this.swapGems({ row, col }, { row: row + 1, col }); // 交换回来
                }
            }
        }
        
        return moves;
    }
    
    clearHints() {
        for (const gem of this.hintGems) {
            if (this.grid[gem.row] && this.grid[gem.row][gem.col] && this.grid[gem.row][gem.col].element) {
                this.grid[gem.row][gem.col].element.classList.remove('hint');
            }
        }
        this.hintGems = [];
    }
    
    clearAutoHint() {
        if (this.hintTimer) {
            clearTimeout(this.hintTimer);
            this.hintTimer = null;
        }
    }
    
    // 设置界面管理
    showSettings() {
        console.log('⚙️ showSettings called');
        
        const settingsOverlay = document.getElementById('settingsOverlay');
        if (settingsOverlay) {
            settingsOverlay.style.display = 'flex';
            this.updateSettingsDisplay();
            this.updateStatsDisplay();
        }
    }
    
    hideSettings() {
        console.log('❌ hideSettings called');
        
        const settingsOverlay = document.getElementById('settingsOverlay');
        if (settingsOverlay) {
            settingsOverlay.style.display = 'none';
            this.saveData();
        }
    }
    
    updateSettingsDisplay() {
        const difficultySelect = document.getElementById('difficultySelect');
        const autoHintToggle = document.getElementById('autoHintToggle');
        const animationToggle = document.getElementById('animationToggle');
        const soundToggle = document.getElementById('soundToggle');
        const volumeSlider = document.getElementById('volumeSlider');
        const volumeValue = document.getElementById('volumeValue');
        
        if (difficultySelect) difficultySelect.value = this.settings.difficulty;
        if (autoHintToggle) autoHintToggle.classList.toggle('active', this.settings.autoHint);
        if (animationToggle) animationToggle.classList.toggle('active', this.settings.animation);
        if (soundToggle) soundToggle.classList.toggle('active', this.settings.sound);
        if (volumeSlider) volumeSlider.value = this.settings.volume;
        if (volumeValue) volumeValue.textContent = this.settings.volume + '%';
    }
    
    updateStatsDisplay() {
        const totalGames = document.getElementById('totalGames');
        const highScore = document.getElementById('highScore');
        const maxLevel = document.getElementById('maxLevel');
        const totalPlayTime = document.getElementById('totalPlayTime');
        
        if (totalGames) totalGames.textContent = this.stats.totalGames;
        if (highScore) highScore.textContent = this.stats.highScore;
        if (maxLevel) maxLevel.textContent = this.stats.maxLevel;
        if (totalPlayTime) totalPlayTime.textContent = Math.round(this.stats.totalPlayTime / 60000) + '分钟';
    }
    
    resetStats() {
        if (confirm('确定要重置所有统计数据和成就吗？此操作不可撤销！')) {
            this.stats = {
                totalGames: 0,
                highScore: 0,
                maxLevel: 1,
                totalPlayTime: 0
            };
            
            Object.keys(this.achievements).forEach(key => {
                this.achievements[key].unlocked = false;
            });
            
            this.saveData();
            this.updateStatsDisplay();
            this.renderAchievements();
        }
    }
    
    // 事件处理
    handleGemClick(event) {
        if (this.gameState !== 'playing' || this.isAnimating) return;
        
        const row = parseInt(event.target.dataset.row);
        const col = parseInt(event.target.dataset.col);
        
        this.clearHints();
        this.clearAutoHint();
        
        // 如果有激活的道具
        if (this.activePowerUp && (this.activePowerUp === 'bomb' || this.activePowerUp === 'rainbow')) {
            if (this.usePowerUp(row, col)) {
                this.processMatches();
                return;
            }
        }
        
        if (!this.selectedGem) {
            // 选择第一个宝石
            this.selectedGem = { row, col };
            event.target.classList.add('selected');
        } else {
            // 选择第二个宝石
            const firstGem = this.selectedGem;
            
            // 取消选择状态
            if (this.grid[firstGem.row] && this.grid[firstGem.row][firstGem.col] && this.grid[firstGem.row][firstGem.col].element) {
                this.grid[firstGem.row][firstGem.col].element.classList.remove('selected');
            }
            
            if (firstGem.row === row && firstGem.col === col) {
                // 点击同一个宝石，取消选择
                this.selectedGem = null;
                return;
            }
            
            // 检查是否相邻
            if (this.areAdjacent(firstGem, { row, col })) {
                this.attemptSwap(firstGem, { row, col });
            } else {
                // 不相邻，选择新的宝石
                this.selectedGem = { row, col };
                event.target.classList.add('selected');
            }
        }
    }
    
    async processMatches() {
        let totalMatches = 0;
        let cascadeLevel = 0;
        
        while (true) {
            const matches = this.findAllMatches();
            if (matches.length === 0) break;
            
            // 计算分数
            const baseScore = matches.length * 10;
            const cascadeBonus = cascadeLevel * 5;
            const comboBonus = this.combo * 2;
            const difficultyMultiplier = this.getDifficultyMultiplier();
            const totalScore = Math.round((baseScore + cascadeBonus + comboBonus) * difficultyMultiplier);
            
            this.score += totalScore;
            this.combo++;
            this.maxCombo = Math.max(this.maxCombo, this.combo);
            
            // 显示分数弹窗
            this.showScorePopup(totalScore);
            
            // 创建特殊宝石
            this.createSpecialGems(matches);
            
            // 播放音效
            if (this.combo > 1) {
                this.playSound('combo');
                this.showComboEffect();
            } else {
                this.playSound('match');
            }
            
            // 标记匹配的宝石
            for (const match of matches) {
                const gem = this.grid[match.row][match.col];
                if (gem && gem.element) {
                    gem.element.classList.add('exploding');
                    this.createParticleEffect(match.row, match.col, this.gemEmojis[gem.type]);
                }
            }
            
            // 等待动画完成
            await this.delay(600);
            
            // 移除匹配的宝石
            for (const match of matches) {
                this.grid[match.row][match.col] = null;
            }
            
            // 掉落宝石
            await this.dropGems();
            
            // 填充新宝石
            await this.fillEmptySpaces();
            
            totalMatches += matches.length;
            cascadeLevel++;
        }
        
        // 重置连击如果没有匹配
        if (totalMatches === 0) {
            this.combo = 0;
        }
        
        this.updateDisplay();
        this.checkGameState();
    }
    
    getDifficultyMultiplier() {
        const multipliers = {
            easy: 0.8,
            normal: 1.0,
            hard: 1.2,
            expert: 1.5
        };
        return multipliers[this.settings.difficulty] || 1.0;
    }
    
    showComboEffect() {
        const existing = document.querySelector('.combo-display');
        if (existing) {
            existing.remove();
        }
        
        const comboDisplay = document.createElement('div');
        comboDisplay.className = 'combo-display';
        comboDisplay.textContent = `${this.combo}x 连击！`;
        
        const gameBoard = document.querySelector('.game-board');
        if (gameBoard) {
            gameBoard.appendChild(comboDisplay);
            
            setTimeout(() => {
                if (comboDisplay.parentNode) {
                    comboDisplay.parentNode.removeChild(comboDisplay);
                }
            }, 2000);
        }
    }
    
    checkGameState() {
        if (this.score >= this.target) {
            // 过关
            this.nextLevel();
        } else if (this.moves <= 0) {
            // 游戏结束
            this.endGame();
        }
    }
    
    nextLevel() {
        this.level++;
        this.moves = this.getDifficultyMoves();
        this.target = this.target + this.level * 500;
        
        // 奖励道具
        if (this.level % 3 === 0) {
            this.powerUps.bomb++;
        }
        if (this.level % 5 === 0) {
            this.powerUps.rainbow++;
        }
        
        this.showLevelComplete();
        this.playSound('levelComplete');
        
        setTimeout(() => {
            this.hideLevelComplete();
            this.combo = 0;
            this.updateDisplay();
            this.updatePowerUpDisplay();
        }, 3000);
    }
    
    endGame() {
        this.gameState = 'gameOver';
        this.stopTimer();
        this.clearAutoHint();
        
        // 更新统计
        this.stats.totalGames++;
        this.stats.highScore = Math.max(this.stats.highScore, this.score);
        this.stats.maxLevel = Math.max(this.stats.maxLevel, this.level);
        this.stats.totalPlayTime += this.gameTime * 1000;
        
        this.saveData();
        this.showGameOver();
        this.playSound('gameOver');
        
        const startBtn = document.getElementById('startBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        const powerUpsSection = document.getElementById('powerUpsSection');
        
        if (startBtn) startBtn.disabled = false;
        if (pauseBtn) {
            pauseBtn.disabled = true;
            pauseBtn.textContent = '⏸️ 暂停';
        }
        if (powerUpsSection) powerUpsSection.style.display = 'none';
    }
    
    showLevelComplete() {
        const levelCompleteDiv = document.createElement('div');
        levelCompleteDiv.className = 'level-complete';
        levelCompleteDiv.innerHTML = `
            <h2>🎉 关卡${this.level - 1}完成! 🎉</h2>
            <div class="level-stats">
                <div>🏆 得分: ${this.score}</div>
                <div>⚡ 最高连击: ${this.maxCombo}</div>
                <div>🎯 下一关目标: ${this.target}</div>
                <div>⏱️ 用时: ${Math.floor(this.gameTime / 60)}:${(this.gameTime % 60).toString().padStart(2, '0')}</div>
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
            <h2>💎 游戏结束 💎</h2>
            <div class="game-over-stats">
                <div>🏆 最终得分: ${this.score}</div>
                <div>🚀 到达关卡: ${this.level}</div>
                <div>⚡ 最高连击: ${this.maxCombo}</div>
                <div>⏱️ 游戏时长: ${Math.floor(this.gameTime / 60)}:${(this.gameTime % 60).toString().padStart(2, '0')}</div>
                <div>🎯 目标完成: ${Math.round((this.score / this.target) * 100)}%</div>
            </div>
            <div style="display: flex; gap: 15px; justify-content: center; margin-top: 20px;">
                <button class="btn" onclick="match3Game.startGame()">重新开始</button>
                <button class="btn" onclick="match3Game.showSettings()">查看统计</button>
            </div>
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
    
    updateDisplay() {
        const scoreEl = document.getElementById('score');
        const levelEl = document.getElementById('level');
        const targetEl = document.getElementById('target');
        const movesEl = document.getElementById('moves');
        const comboEl = document.getElementById('combo');
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        if (scoreEl) scoreEl.textContent = this.score;
        if (levelEl) levelEl.textContent = this.level;
        if (targetEl) targetEl.textContent = this.target;
        if (movesEl) movesEl.textContent = this.moves;
        if (comboEl) comboEl.textContent = this.combo;
        
        // 更新进度条
        if (progressFill && progressText) {
            const progress = Math.min((this.score / this.target) * 100, 100);
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `${this.score} / ${this.target}`;
        }
    }
    
    showScorePopup(score) {
        const container = document.getElementById('gridContainer');
        if (!container) return;
        
        const popup = document.createElement('div');
        popup.className = 'score-popup';
        popup.textContent = `+${score}`;
        popup.style.position = 'absolute';
        popup.style.top = '20px';
        popup.style.left = '50%';
        popup.style.transform = 'translateX(-50%)';
        popup.style.color = '#27ae60';
        popup.style.fontSize = '1.5rem';
        popup.style.fontWeight = '700';
        popup.style.pointerEvents = 'none';
        popup.style.zIndex = '1000';
        popup.style.animation = 'scoreFloat 2s ease-out forwards';
        
        container.appendChild(popup);
        
        setTimeout(() => {
            if (popup.parentNode) {
                popup.parentNode.removeChild(popup);
            }
        }, 2000);
    }
    
    showFloatingText(text, color = '#27ae60') {
        const container = document.getElementById('gridContainer');
        if (!container) return;
        
        const floatingText = document.createElement('div');
        floatingText.className = 'floating-text';
        floatingText.textContent = text;
        floatingText.style.position = 'absolute';
        floatingText.style.top = '50%';
        floatingText.style.left = '50%';
        floatingText.style.transform = 'translate(-50%, -50%)';
        floatingText.style.color = color;
        floatingText.style.fontSize = '1.5rem';
        floatingText.style.fontWeight = '700';
        floatingText.style.pointerEvents = 'none';
        floatingText.style.zIndex = '1000';
        floatingText.style.animation = 'floatUp 2s ease-out forwards';
        
        container.appendChild(floatingText);
        
        setTimeout(() => {
            if (floatingText.parentNode) {
                floatingText.parentNode.removeChild(floatingText);
            }
        }, 2000);
    }
    
    createParticleEffect(row, col, emoji) {
        console.log(`💥 Particle effect at [${row},${col}]: ${emoji}`);
        // 可以在这里添加更复杂的粒子效果
    }
    
    playSound(type) {
        if (!this.settings.sound) return;
        console.log(`🔊 Playing sound: ${type}`);
        // 可以在这里添加真实的音效播放
    }
    
    renderAchievements() {
        const container = document.getElementById('achievementGrid');
        if (!container) return;
        
        container.innerHTML = '';
        
        Object.keys(this.achievements).forEach(key => {
            const achievement = this.achievements[key];
            const item = document.createElement('div');
            item.className = `achievement-item ${achievement.unlocked ? 'unlocked' : ''}`;
            item.innerHTML = `
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-desc">${achievement.desc}</div>
            `;
            container.appendChild(item);
        });
    }
    
    // 绑定所有事件
    bindEvents() {
        console.log('🔗 Binding all events...');
        
        // 主要控制按钮
        const startBtn = document.getElementById('startBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        const restartBtn = document.getElementById('restartBtn');
        const hintBtn = document.getElementById('hintBtn');
        const settingsBtn = document.getElementById('settingsBtn');
        
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                console.log('▶️ Start button clicked');
                this.startGame();
            });
        }
        
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                console.log('⏸️ Pause button clicked');
                this.togglePause();
            });
        }
        
        if (restartBtn) {
            restartBtn.addEventListener('click', () => {
                console.log('🔄 Restart button clicked');
                this.restartGame();
            });
        }
        
        if (hintBtn) {
            hintBtn.addEventListener('click', () => {
                console.log('💡 Hint button clicked');
                this.showHint();
            });
        }
        
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                console.log('⚙️ Settings button clicked');
                this.showSettings();
            });
        }
        
        // 道具按钮
        const bombPowerUp = document.getElementById('bombPowerUp');
        const rainbowPowerUp = document.getElementById('rainbowPowerUp');
        const shufflePowerUp = document.getElementById('shufflePowerUp');
        const extraMovesPowerUp = document.getElementById('extraMovesPowerUp');
        
        if (bombPowerUp) {
            bombPowerUp.addEventListener('click', () => {
                console.log('💣 Bomb power-up clicked');
                this.activatePowerUp('bomb');
            });
        }
        
        if (rainbowPowerUp) {
            rainbowPowerUp.addEventListener('click', () => {
                console.log('🌈 Rainbow power-up clicked');
                this.activatePowerUp('rainbow');
            });
        }
        
        if (shufflePowerUp) {
            shufflePowerUp.addEventListener('click', () => {
                console.log('🔀 Shuffle power-up clicked');
                this.activatePowerUp('shuffle');
            });
        }
        
        if (extraMovesPowerUp) {
            extraMovesPowerUp.addEventListener('click', () => {
                console.log('➕ Extra moves power-up clicked');
                this.activatePowerUp('extraMoves');
            });
        }
        
        // 设置界面按钮
        const closeSettingsBtn = document.getElementById('closeSettingsBtn');
        const resetStatsBtn = document.getElementById('resetStatsBtn');
        
        if (closeSettingsBtn) {
            closeSettingsBtn.addEventListener('click', () => {
                console.log('❌ Close settings button clicked');
                this.hideSettings();
            });
        }
        
        if (resetStatsBtn) {
            resetStatsBtn.addEventListener('click', () => {
                console.log('🗑️ Reset stats button clicked');
                this.resetStats();
            });
        }
        
        // 设置控件
        const difficultySelect = document.getElementById('difficultySelect');
        const autoHintToggle = document.getElementById('autoHintToggle');
        const animationToggle = document.getElementById('animationToggle');
        const soundToggle = document.getElementById('soundToggle');
        const volumeSlider = document.getElementById('volumeSlider');
        const volumeValue = document.getElementById('volumeValue');
        
        if (difficultySelect) {
            difficultySelect.addEventListener('change', (e) => {
                console.log('🎯 Difficulty changed to:', e.target.value);
                this.settings.difficulty = e.target.value;
            });
        }
        
        if (autoHintToggle) {
            autoHintToggle.addEventListener('click', () => {
                console.log('💡 Auto hint toggle clicked');
                this.settings.autoHint = !this.settings.autoHint;
                autoHintToggle.classList.toggle('active', this.settings.autoHint);
            });
        }
        
        if (animationToggle) {
            animationToggle.addEventListener('click', () => {
                console.log('🎬 Animation toggle clicked');
                this.settings.animation = !this.settings.animation;
                animationToggle.classList.toggle('active', this.settings.animation);
            });
        }
        
        if (soundToggle) {
            soundToggle.addEventListener('click', () => {
                console.log('🔊 Sound toggle clicked');
                this.settings.sound = !this.settings.sound;
                soundToggle.classList.toggle('active', this.settings.sound);
            });
        }
        
        if (volumeSlider && volumeValue) {
            volumeSlider.addEventListener('input', (e) => {
                console.log('🔊 Volume changed to:', e.target.value);
                this.settings.volume = parseInt(e.target.value);
                volumeValue.textContent = e.target.value + '%';
            });
        }
        
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
                case 'h':
                case 'H':
                    e.preventDefault();
                    this.showHint();
                    break;
                case 'r':
                case 'R':
                    e.preventDefault();
                    this.restartGame();
                    break;
                case 'Escape':
                    e.preventDefault();
                    const settingsOverlay = document.getElementById('settingsOverlay');
                    if (settingsOverlay && settingsOverlay.style.display === 'flex') {
                        this.hideSettings();
                    }
                    break;
            }
        });
        
        // 点击设置遮罩关闭
        const settingsOverlay = document.getElementById('settingsOverlay');
        if (settingsOverlay) {
            settingsOverlay.addEventListener('click', (e) => {
                if (e.target.id === 'settingsOverlay') {
                    this.hideSettings();
                }
            });
        }
        
        console.log('✅ All events bound successfully');
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// 全局变量
let match3Game;

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    console.log('📱 DOM loaded, initializing Match3 game...');
    
    try {
        match3Game = new Match3Game();
        console.log('✅ Match3 game initialized successfully');
        
        // 测试渲染
        setTimeout(() => {
            const container = document.getElementById('gridContainer');
            console.log('📦 Container found:', !!container);
            if (container) {
                console.log('🎯 Container children count:', container.children.length);
            }
        }, 1000);
        
    } catch (error) {
        console.error('❌ Error initializing Match3 game:', error);
        console.error('📍 Error stack:', error.stack);
        alert('游戏初始化失败！请检查浏览器控制台获取详细错误信息。');
    }
});