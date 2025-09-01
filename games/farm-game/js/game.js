class FarmGame {
            constructor() {
                this.canvas = document.getElementById('gameCanvas');
                this.ctx = this.canvas.getContext('2d');
                this.canvas.width = 900;
                this.canvas.height = 500;
                
                this.gameState = 'menu';
                this.money = 100;
                this.level = 1;
                this.day = 1;
                this.exp = 0;
                this.expNeeded = 100;
                
                this.selectedSeed = 'wheat';
                this.inventory = {};
                this.farm = [];
                this.gameTime = 0;
                this.dayLength = 30000; // 30秒一天
                
                this.seeds = {
                    wheat: { name: '小麦', cost: 10, growTime: 5000, sellPrice: 15, emoji: '🌾' },
                    corn: { name: '玉米', cost: 20, growTime: 8000, sellPrice: 35, emoji: '🌽' },
                    tomato: { name: '番茄', cost: 30, growTime: 12000, sellPrice: 50, emoji: '🍅' },
                    carrot: { name: '胡萝卜', cost: 15, growTime: 6000, sellPrice: 25, emoji: '🥕' },
                    potato: { name: '土豆', cost: 25, growTime: 10000, sellPrice: 40, emoji: '🥔' },
                    strawberry: { name: '草莓', cost: 40, growTime: 15000, sellPrice: 70, emoji: '🍓' }
                };
                
                this.farmGrid = {
                    rows: 6,
                    cols: 10,
                    cellSize: 80,
                    startX: 50,
                    startY: 50
                };
                
                this.initializeFarm();
                this.bindEvents();
                this.updateUI();
            }

            initializeFarm() {
                this.farm = [];
                for (let row = 0; row < this.farmGrid.rows; row++) {
                    this.farm[row] = [];
                    for (let col = 0; col < this.farmGrid.cols; col++) {
                        this.farm[row][col] = {
                            type: 'empty',
                            plantTime: 0,
                            seedType: null,
                            x: this.farmGrid.startX + col * this.farmGrid.cellSize,
                            y: this.farmGrid.startY + row * this.farmGrid.cellSize,
                            width: this.farmGrid.cellSize - 5,
                            height: this.farmGrid.cellSize - 5
                        };
                    }
                }
                
                // 初始化仓库
                this.inventory = {
                    wheat: 0,
                    corn: 0,
                    tomato: 0,
                    carrot: 0,
                    potato: 0,
                    strawberry: 0
                };
            }

            bindEvents() {
                document.getElementById('startButton').addEventListener('click', () => {
                    this.startGame();
                });
                
                // 种子选择
                document.querySelectorAll('.shop-item').forEach(item => {
                    item.addEventListener('click', (e) => {
                        this.selectSeed(e.currentTarget.dataset.seed);
                    });
                });
                
                this.canvas.addEventListener('click', (e) => {
                    if (this.gameState === 'playing') {
                        this.handleCanvasClick(e);
                    }
                });
            }

            selectSeed(seedType) {
                this.selectedSeed = seedType;
                document.querySelectorAll('.shop-item').forEach(item => {
                    item.classList.remove('selected');
                });
                document.querySelector(`[data-seed="${seedType}"]`).classList.add('selected');
            }

            handleCanvasClick(e) {
                const rect = this.canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // 确定点击的格子
                const col = Math.floor((x - this.farmGrid.startX) / this.farmGrid.cellSize);
                const row = Math.floor((y - this.farmGrid.startY) / this.farmGrid.cellSize);
                
                if (row >= 0 && row < this.farmGrid.rows && col >= 0 && col < this.farmGrid.cols) {
                    const plot = this.farm[row][col];
                    
                    if (plot.type === 'empty') {
                        this.plantSeed(row, col);
                    } else if (plot.type === 'mature') {
                        this.harvestCrop(row, col);
                    }
                }
            }

            plantSeed(row, col) {
                const seed = this.seeds[this.selectedSeed];
                if (this.money >= seed.cost) {
                    this.money -= seed.cost;
                    this.farm[row][col] = {
                        ...this.farm[row][col],
                        type: 'growing',
                        seedType: this.selectedSeed,
                        plantTime: Date.now()
                    };
                    
                    this.showMessage(`种植了${seed.name}！`, 'plant');
                    this.updateUI();
                } else {
                    this.showMessage('金币不足！', 'plant');
                }
            }

            harvestCrop(row, col) {
                const plot = this.farm[row][col];
                const seed = this.seeds[plot.seedType];
                
                this.inventory[plot.seedType]++;
                this.money += seed.sellPrice;
                this.exp += 10;
                
                this.farm[row][col] = {
                    ...this.farm[row][col],
                    type: 'empty',
                    seedType: null,
                    plantTime: 0
                };
                
                this.showMessage(`收获了${seed.name}！+${seed.sellPrice}金币`, 'harvest');
                this.checkLevelUp();
                this.updateUI();
            }

            checkLevelUp() {
                if (this.exp >= this.expNeeded) {
                    this.level++;
                    this.exp -= this.expNeeded;
                    this.expNeeded = Math.floor(this.expNeeded * 1.5);
                    this.showMessage(`升级了！现在是${this.level}级！`, 'level-up');
                }
            }

            startGame() {
                this.gameState = 'playing';
                this.gameTime = Date.now();
                this.initializeFarm();
                this.money = 100;
                this.level = 1;
                this.day = 1;
                this.exp = 0;
                this.expNeeded = 100;
                this.updateUI();
                this.hideMessage();
                document.getElementById('startButton').style.display = 'none';
                this.gameLoop();
            }

            gameLoop() {
                if (this.gameState === 'playing') {
                    this.update();
                    this.draw();
                    requestAnimationFrame(() => this.gameLoop());
                }
            }

            update() {
                const currentTime = Date.now();
                
                // 更新天数
                if (currentTime - this.gameTime > this.dayLength) {
                    this.day++;
                    this.gameTime = currentTime;
                    this.showMessage(`新的一天开始了！第${this.day}天`, 'plant');
                }
                
                // 更新作物生长状态
                for (let row = 0; row < this.farmGrid.rows; row++) {
                    for (let col = 0; col < this.farmGrid.cols; col++) {
                        const plot = this.farm[row][col];
                        if (plot.type === 'growing') {
                            const growTime = this.seeds[plot.seedType].growTime;
                            if (currentTime - plot.plantTime > growTime) {
                                plot.type = 'mature';
                            }
                        }
                    }
                }
            }

            draw() {
                // 清空画布
                this.ctx.fillStyle = '#55a3ff';
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                
                // 绘制农场背景
                this.drawFarmBackground();
                
                // 绘制农场格子
                this.drawFarmGrid();
                
                // 绘制作物
                this.drawCrops();
            }

            drawFarmBackground() {
                // 绘制天空渐变
                const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
                gradient.addColorStop(0, '#87CEEB');
                gradient.addColorStop(1, '#98FB98');
                this.ctx.fillStyle = gradient;
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                
                // 绘制云朵
                this.drawClouds();
                
                // 绘制太阳
                this.ctx.fillStyle = '#FFD700';
                this.ctx.beginPath();
                this.ctx.arc(this.canvas.width - 80, 80, 40, 0, Math.PI * 2);
                this.ctx.fill();
                
                // 太阳光线
                this.ctx.strokeStyle = '#FFD700';
                this.ctx.lineWidth = 3;
                for (let i = 0; i < 8; i++) {
                    const angle = (Math.PI * 2 / 8) * i;
                    const startX = (this.canvas.width - 80) + Math.cos(angle) * 50;
                    const startY = 80 + Math.sin(angle) * 50;
                    const endX = (this.canvas.width - 80) + Math.cos(angle) * 70;
                    const endY = 80 + Math.sin(angle) * 70;
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(startX, startY);
                    this.ctx.lineTo(endX, endY);
                    this.ctx.stroke();
                }
            }

            drawClouds() {
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                
                // 云朵1
                this.ctx.beginPath();
                this.ctx.arc(150, 80, 25, 0, Math.PI * 2);
                this.ctx.arc(180, 80, 35, 0, Math.PI * 2);
                this.ctx.arc(210, 80, 25, 0, Math.PI * 2);
                this.ctx.fill();
                
                // 云朵2
                this.ctx.beginPath();
                this.ctx.arc(400, 60, 20, 0, Math.PI * 2);
                this.ctx.arc(425, 60, 30, 0, Math.PI * 2);
                this.ctx.arc(450, 60, 20, 0, Math.PI * 2);
                this.ctx.fill();
            }

            drawFarmGrid() {
                for (let row = 0; row < this.farmGrid.rows; row++) {
                    for (let col = 0; col < this.farmGrid.cols; col++) {
                        const plot = this.farm[row][col];
                        
                        // 绘制土地
                        this.ctx.fillStyle = plot.type === 'empty' ? '#8B4513' : '#654321';
                        this.ctx.fillRect(plot.x, plot.y, plot.width, plot.height);
                        
                        // 绘制边框
                        this.ctx.strokeStyle = '#2F4F2F';
                        this.ctx.lineWidth = 2;
                        this.ctx.strokeRect(plot.x, plot.y, plot.width, plot.height);
                        
                        // 绘制网格纹理
                        if (plot.type === 'empty') {
                            this.ctx.strokeStyle = '#A0522D';
                            this.ctx.lineWidth = 1;
                            for (let i = 0; i < 4; i++) {
                                this.ctx.beginPath();
                                this.ctx.moveTo(plot.x + 10 + i * 15, plot.y + 10);
                                this.ctx.lineTo(plot.x + 25 + i * 15, plot.y + plot.height - 10);
                                this.ctx.stroke();
                            }
                        }
                    }
                }
            }

            drawCrops() {
                for (let row = 0; row < this.farmGrid.rows; row++) {
                    for (let col = 0; col < this.farmGrid.cols; col++) {
                        const plot = this.farm[row][col];
                        
                        if (plot.type === 'growing' || plot.type === 'mature') {
                            const seed = this.seeds[plot.seedType];
                            const centerX = plot.x + plot.width / 2;
                            const centerY = plot.y + plot.height / 2;
                            
                            if (plot.type === 'growing') {
                                // 绘制生长中的作物
                                const currentTime = Date.now();
                                const growProgress = (currentTime - plot.plantTime) / seed.growTime;
                                const size = Math.min(growProgress, 0.8) * 40;
                                
                                this.ctx.fillStyle = '#228B22';
                                this.ctx.fillRect(centerX - size/2, centerY - size/2, size, size/2);
                                
                                // 进度条
                                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                                this.ctx.fillRect(plot.x + 5, plot.y + 5, plot.width - 10, 4);
                                this.ctx.fillStyle = '#00FF00';
                                this.ctx.fillRect(plot.x + 5, plot.y + 5, (plot.width - 10) * growProgress, 4);
                            } else if (plot.type === 'mature') {
                                // 绘制成熟的作物
                                this.ctx.font = '36px Arial';
                                this.ctx.textAlign = 'center';
                                this.ctx.fillText(seed.emoji, centerX, centerY + 12);
                                
                                // 闪烁效果
                                if (Math.floor(Date.now() / 500) % 2) {
                                    this.ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
                                    this.ctx.fillRect(plot.x, plot.y, plot.width, plot.height);
                                }
                            }
                        }
                    }
                }
            }

            updateUI() {
                document.getElementById('money').textContent = this.money;
                document.getElementById('level').textContent = this.level;
                document.getElementById('day').textContent = this.day;
                document.getElementById('exp').textContent = `${this.exp}/${this.expNeeded}`;
                
                // 更新仓库
                const inventoryContainer = document.getElementById('inventoryItems');
                inventoryContainer.innerHTML = '';
                
                Object.entries(this.inventory).forEach(([type, count]) => {
                    if (count > 0) {
                        const item = document.createElement('div');
                        item.className = 'inventory-item';
                        item.innerHTML = `${this.seeds[type].emoji}<br>${this.seeds[type].name}<br>×${count}`;
                        inventoryContainer.appendChild(item);
                    }
                });
            }

            showMessage(text, type) {
                const message = document.getElementById('message');
                message.textContent = text;
                message.className = `message ${type} show`;
                
                setTimeout(() => {
                    this.hideMessage();
                }, 2000);
            }

            hideMessage() {
                const message = document.getElementById('message');
                message.classList.remove('show');
            }
        }

        // 启动游戏
        window.addEventListener('load', () => {
            new FarmGame();
        });