class TowerDefense {
            constructor() {
                this.canvas = document.getElementById('gameCanvas');
                this.ctx = this.canvas.getContext('2d');
                
                // 游戏状态
                this.gameActive = false;
                this.gamePaused = false;
                this.health = 100;
                this.money = 500;
                this.score = 0;
                this.kills = 0;
                this.wave = 0;
                this.towersBuilt = 0;
                
                // 游戏对象
                this.towers = [];
                this.enemies = [];
                this.projectiles = [];
                this.selectedTowerType = null;
                
                // 路径点
                this.path = [
                    {x: 0, y: 200},
                    {x: 150, y: 200},
                    {x: 150, y: 100},
                    {x: 300, y: 100},
                    {x: 300, y: 300},
                    {x: 450, y: 300},
                    {x: 450, y: 150},
                    {x: 600, y: 150}
                ];
                
                // 防御塔配置
                this.towerTypes = {
                    basic: {
                        cost: 50,
                        damage: 20,
                        range: 80,
                        fireRate: 1000,
                        color: '#FF9800',
                        projectileSpeed: 200
                    },
                    cannon: {
                        cost: 100,
                        damage: 60,
                        range: 100,
                        fireRate: 2000,
                        color: '#F44336',
                        projectileSpeed: 150,
                        splash: 40
                    },
                    laser: {
                        cost: 150,
                        damage: 8,
                        range: 120,
                        fireRate: 100,
                        color: '#E91E63',
                        continuous: true
                    },
                    ice: {
                        cost: 80,
                        damage: 5,
                        range: 90,
                        fireRate: 800,
                        color: '#00BCD4',
                        slow: 0.5,
                        slowDuration: 2000
                    }
                };
                
                // 敌人配置
                this.enemyTypes = {
                    basic: {
                        health: 50,
                        speed: 50,
                        reward: 15,
                        color: '#4CAF50'
                    },
                    fast: {
                        health: 30,
                        speed: 80,
                        reward: 20,
                        color: '#FFEB3B'
                    },
                    tank: {
                        health: 150,
                        speed: 30,
                        reward: 40,
                        color: '#795548'
                    },
                    boss: {
                        health: 300,
                        speed: 40,
                        reward: 100,
                        color: '#9C27B0'
                    }
                };
                
                // 波次配置
                this.waves = [
                    {enemies: [{type: 'basic', count: 5, interval: 1000}]},
                    {enemies: [{type: 'basic', count: 8, interval: 800}]},
                    {enemies: [{type: 'basic', count: 5, interval: 800}, {type: 'fast', count: 3, interval: 1200}]},
                    {enemies: [{type: 'basic', count: 10, interval: 600}, {type: 'fast', count: 5, interval: 800}]},
                    {enemies: [{type: 'tank', count: 2, interval: 2000}, {type: 'basic', count: 8, interval: 600}]},
                    {enemies: [{type: 'boss', count: 1, interval: 3000}, {type: 'fast', count: 8, interval: 800}]}
                ];
                
                // 当前波次状态
                this.currentWave = null;
                this.waveInProgress = false;
                this.enemySpawnQueue = [];
                this.lastSpawnTime = 0;
                
                this.gameLoop = null;
                this.lastTime = 0;
                
                this.bindEvents();
            }
            
            bindEvents() {
                this.canvas.addEventListener('click', (e) => {
                    if (this.gameActive && !this.gamePaused) {
                        this.handleCanvasClick(e);
                    }
                });
                
                // 键盘快捷键
                document.addEventListener('keydown', (e) => {
                    if (e.key === ' ') {
                        e.preventDefault();
                        if (this.gameActive) {
                            this.pauseGame();
                        }
                    } else if (e.key >= '1' && e.key <= '4') {
                        const towers = ['basic', 'cannon', 'laser', 'ice'];
                        this.selectTower(towers[parseInt(e.key) - 1]);
                    }
                });
            }
            
            handleCanvasClick(e) {
                const rect = this.canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                if (this.selectedTowerType) {
                    this.placeTower(x, y);
                }
            }
            
            selectTower(type) {
                if (!this.gameActive) return;
                
                const cost = this.towerTypes[type].cost;
                if (this.money < cost) return;
                
                // 清除之前的选择
                document.querySelectorAll('.tower-btn').forEach(btn => {
                    btn.classList.remove('selected');
                });
                
                // 选择新塔
                this.selectedTowerType = type;
                document.getElementById(type + 'TowerBtn').classList.add('selected');
            }
            
            placeTower(x, y) {
                if (!this.selectedTowerType) return;
                
                const towerConfig = this.towerTypes[this.selectedTowerType];
                
                // 检查是否在路径上
                if (this.isOnPath(x, y, 30)) return;
                
                // 检查是否与其他塔重叠
                if (this.towers.some(tower => 
                    Math.hypot(tower.x - x, tower.y - y) < 60)) return;
                
                // 检查金币
                if (this.money < towerConfig.cost) return;
                
                // 创建塔
                const tower = {
                    x: x,
                    y: y,
                    type: this.selectedTowerType,
                    ...towerConfig,
                    lastFire: 0,
                    target: null,
                    level: 1
                };
                
                this.towers.push(tower);
                this.money -= towerConfig.cost;
                this.towersBuilt++;
                
                // 取消选择
                this.selectedTowerType = null;
                document.querySelectorAll('.tower-btn').forEach(btn => {
                    btn.classList.remove('selected');
                });
                
                this.updateDisplay();
            }
            
            isOnPath(x, y, radius = 25) {
                for (let i = 0; i < this.path.length - 1; i++) {
                    const start = this.path[i];
                    const end = this.path[i + 1];
                    
                    const distance = this.distanceToLineSegment(x, y, start.x, start.y, end.x, end.y);
                    if (distance < radius) return true;
                }
                return false;
            }
            
            distanceToLineSegment(px, py, x1, y1, x2, y2) {
                const A = px - x1;
                const B = py - y1;
                const C = x2 - x1;
                const D = y2 - y1;
                
                const dot = A * C + B * D;
                const lenSq = C * C + D * D;
                
                if (lenSq === 0) return Math.hypot(A, B);
                
                let t = Math.max(0, Math.min(1, dot / lenSq));
                
                const projX = x1 + t * C;
                const projY = y1 + t * D;
                
                return Math.hypot(px - projX, py - projY);
            }
            
            startGame() {
                this.gameActive = true;
                this.gamePaused = false;
                this.health = 100;
                this.money = 500;
                this.score = 0;
                this.kills = 0;
                this.wave = 0;
                this.towersBuilt = 0;
                
                this.towers = [];
                this.enemies = [];
                this.projectiles = [];
                this.selectedTowerType = null;
                
                this.waveInProgress = false;
                this.enemySpawnQueue = [];
                
                document.getElementById('startBtn').disabled = true;
                document.getElementById('waveBtn').disabled = false;
                document.getElementById('pauseBtn').disabled = false;
                
                this.updateDisplay();
                this.updateTowerButtons();
                this.startGameLoop();
            }
            
            startWave() {
                if (this.waveInProgress || this.wave >= this.waves.length) return;
                
                this.wave++;
                this.waveInProgress = true;
                
                const waveConfig = this.waves[this.wave - 1];
                this.enemySpawnQueue = [];
                
                // 准备敌人生成队列
                waveConfig.enemies.forEach(enemyGroup => {
                    for (let i = 0; i < enemyGroup.count; i++) {
                        this.enemySpawnQueue.push({
                            type: enemyGroup.type,
                            spawnTime: Date.now() + i * enemyGroup.interval
                        });
                    }
                });
                
                // 按时间排序
                this.enemySpawnQueue.sort((a, b) => a.spawnTime - b.spawnTime);
                
                document.getElementById('waveBtn').disabled = true;
                this.updateWaveDisplay();
            }
            
            pauseGame() {
                if (!this.gameActive) return;
                
                this.gamePaused = !this.gamePaused;
                const pauseBtn = document.getElementById('pauseBtn');
                
                if (this.gamePaused) {
                    pauseBtn.textContent = '▶️ 继续';
                } else {
                    pauseBtn.textContent = '⏸️ 暂停';
                }
            }
            
            resetGame() {
                this.gameActive = false;
                this.gamePaused = false;
                
                if (this.gameLoop) {
                    cancelAnimationFrame(this.gameLoop);
                    this.gameLoop = null;
                }
                
                document.getElementById('startBtn').disabled = false;
                document.getElementById('waveBtn').disabled = true;
                document.getElementById('pauseBtn').disabled = true;
                document.getElementById('pauseBtn').textContent = '⏸️ 暂停';
                
                this.selectedTowerType = null;
                document.querySelectorAll('.tower-btn').forEach(btn => {
                    btn.classList.remove('selected');
                });
                
                this.updateDisplay();
                this.updateTowerButtons();
                this.updateWaveDisplay();
                this.draw();
            }
            
            startGameLoop() {
                const loop = (currentTime) => {
                    if (this.gameActive) {
                        const deltaTime = currentTime - this.lastTime;
                        this.lastTime = currentTime;
                        
                        if (!this.gamePaused) {
                            this.update(deltaTime);
                        }
                        this.draw();
                        
                        this.gameLoop = requestAnimationFrame(loop);
                    }
                };
                this.gameLoop = requestAnimationFrame(loop);
            }
            
            update(deltaTime) {
                this.spawnEnemies();
                this.updateEnemies(deltaTime);
                this.updateTowers(deltaTime);
                this.updateProjectiles(deltaTime);
                this.checkWaveComplete();
                this.checkGameOver();
            }
            
            spawnEnemies() {
                const now = Date.now();
                
                while (this.enemySpawnQueue.length > 0 && this.enemySpawnQueue[0].spawnTime <= now) {
                    const enemyData = this.enemySpawnQueue.shift();
                    const enemyConfig = this.enemyTypes[enemyData.type];
                    
                    const enemy = {
                        x: this.path[0].x,
                        y: this.path[0].y,
                        type: enemyData.type,
                        health: enemyConfig.health,
                        maxHealth: enemyConfig.health,
                        speed: enemyConfig.speed,
                        reward: enemyConfig.reward,
                        color: enemyConfig.color,
                        pathIndex: 0,
                        pathProgress: 0,
                        slowFactor: 1,
                        slowEnd: 0
                    };
                    
                    this.enemies.push(enemy);
                }
            }
            
            updateEnemies(deltaTime) {
                for (let i = this.enemies.length - 1; i >= 0; i--) {
                    const enemy = this.enemies[i];
                    
                    // 更新减速效果
                    if (Date.now() > enemy.slowEnd) {
                        enemy.slowFactor = 1;
                    }
                    
                    // 移动敌人
                    this.moveEnemy(enemy, deltaTime);
                    
                    // 检查是否到达终点
                    if (enemy.pathIndex >= this.path.length - 1) {
                        this.health -= 10;
                        this.enemies.splice(i, 1);
                        continue;
                    }
                    
                    // 检查是否死亡
                    if (enemy.health <= 0) {
                        this.money += enemy.reward;
                        this.score += enemy.reward * 10;
                        this.kills++;
                        this.enemies.splice(i, 1);
                    }
                }
            }
            
            moveEnemy(enemy, deltaTime) {
                if (enemy.pathIndex >= this.path.length - 1) return;
                
                const currentPoint = this.path[enemy.pathIndex];
                const nextPoint = this.path[enemy.pathIndex + 1];
                
                const dx = nextPoint.x - currentPoint.x;
                const dy = nextPoint.y - currentPoint.y;
                const distance = Math.hypot(dx, dy);
                
                const moveDistance = (enemy.speed * enemy.slowFactor * deltaTime) / 1000;
                enemy.pathProgress += moveDistance / distance;
                
                if (enemy.pathProgress >= 1) {
                    enemy.pathIndex++;
                    enemy.pathProgress = 0;
                    if (enemy.pathIndex < this.path.length) {
                        enemy.x = this.path[enemy.pathIndex].x;
                        enemy.y = this.path[enemy.pathIndex].y;
                    }
                } else {
                    enemy.x = currentPoint.x + dx * enemy.pathProgress;
                    enemy.y = currentPoint.y + dy * enemy.pathProgress;
                }
            }
            
            updateTowers(deltaTime) {
                const now = Date.now();
                
                this.towers.forEach(tower => {
                    // 寻找目标
                    if (!tower.target || tower.target.health <= 0 || 
                        Math.hypot(tower.x - tower.target.x, tower.y - tower.target.y) > tower.range) {
                        tower.target = this.findNearestEnemy(tower);
                    }
                    
                    // 攻击目标
                    if (tower.target && now - tower.lastFire >= tower.fireRate) {
                        this.towerAttack(tower);
                        tower.lastFire = now;
                    }
                });
            }
            
            findNearestEnemy(tower) {
                let nearest = null;
                let minDistance = tower.range;
                
                this.enemies.forEach(enemy => {
                    const distance = Math.hypot(tower.x - enemy.x, tower.y - enemy.y);
                    if (distance < minDistance) {
                        minDistance = distance;
                        nearest = enemy;
                    }
                });
                
                return nearest;
            }
            
            towerAttack(tower) {
                if (!tower.target) return;
                
                if (tower.continuous) {
                    // 激光塔持续伤害
                    tower.target.health -= tower.damage;
                } else {
                    // 发射子弹
                    const dx = tower.target.x - tower.x;
                    const dy = tower.target.y - tower.y;
                    const distance = Math.hypot(dx, dy);
                    
                    const projectile = {
                        x: tower.x,
                        y: tower.y,
                        dx: (dx / distance) * tower.projectileSpeed,
                        dy: (dy / distance) * tower.projectileSpeed,
                        damage: tower.damage,
                        splash: tower.splash,
                        slow: tower.slow,
                        slowDuration: tower.slowDuration,
                        color: tower.color,
                        target: tower.target
                    };
                    
                    this.projectiles.push(projectile);
                }
            }
            
            updateProjectiles(deltaTime) {
                for (let i = this.projectiles.length - 1; i >= 0; i--) {
                    const projectile = this.projectiles[i];
                    
                    projectile.x += (projectile.dx * deltaTime) / 1000;
                    projectile.y += (projectile.dy * deltaTime) / 1000;
                    
                    // 检查碰撞
                    let hit = false;
                    this.enemies.forEach(enemy => {
                        const distance = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
                        if (distance < 15) {
                            // 造成伤害
                            enemy.health -= projectile.damage;
                            
                            // 减速效果
                            if (projectile.slow) {
                                enemy.slowFactor = projectile.slow;
                                enemy.slowEnd = Date.now() + projectile.slowDuration;
                            }
                            
                            // 溅射伤害
                            if (projectile.splash) {
                                this.enemies.forEach(splashEnemy => {
                                    const splashDistance = Math.hypot(projectile.x - splashEnemy.x, projectile.y - splashEnemy.y);
                                    if (splashDistance < projectile.splash && splashDistance > 0) {
                                        splashEnemy.health -= projectile.damage * 0.5;
                                    }
                                });
                            }
                            
                            hit = true;
                        }
                    });
                    
                    // 移除击中的子弹或出界的子弹
                    if (hit || projectile.x < 0 || projectile.x > this.canvas.width || 
                        projectile.y < 0 || projectile.y > this.canvas.height) {
                        this.projectiles.splice(i, 1);
                    }
                }
            }
            
            checkWaveComplete() {
                if (this.waveInProgress && this.enemies.length === 0 && this.enemySpawnQueue.length === 0) {
                    this.waveInProgress = false;
                    this.score += this.wave * 100;
                    this.money += 50;
                    
                    if (this.wave < this.waves.length) {
                        document.getElementById('waveBtn').disabled = false;
                    }
                    
                    this.updateWaveDisplay();
                }
            }
            
            checkGameOver() {
                if (this.health <= 0) {
                    this.endGame(false);
                } else if (this.wave >= this.waves.length && !this.waveInProgress) {
                    this.endGame(true);
                }
            }
            
            endGame(victory) {
                this.gameActive = false;
                
                if (this.gameLoop) {
                    cancelAnimationFrame(this.gameLoop);
                    this.gameLoop = null;
                }
                
                document.getElementById('startBtn').disabled = false;
                document.getElementById('waveBtn').disabled = true;
                document.getElementById('pauseBtn').disabled = true;
                
                this.showGameOver(victory);
            }
            
            showGameOver(victory) {
                document.getElementById('finalScore').textContent = this.score;
                document.getElementById('finalWave').textContent = this.wave;
                document.getElementById('finalKills').textContent = this.kills;
                document.getElementById('towersBuilt').textContent = this.towersBuilt;
                
                const title = document.getElementById('gameOverTitle');
                if (victory) {
                    title.textContent = '🏆 胜利！';
                } else if (this.wave >= 3) {
                    title.textContent = '👍 不错的表现！';
                } else {
                    title.textContent = '💥 游戏结束';
                }
                
                document.getElementById('gameOverPopup').classList.add('show');
            }
            
            closeGameOver() {
                document.getElementById('gameOverPopup').classList.remove('show');
            }
            
            updateDisplay() {
                document.getElementById('health').textContent = this.health;
                document.getElementById('money').textContent = this.money;
                document.getElementById('score').textContent = this.score;
                document.getElementById('kills').textContent = this.kills;
            }
            
            updateTowerButtons() {
                Object.keys(this.towerTypes).forEach(type => {
                    const btn = document.getElementById(type + 'TowerBtn');
                    const cost = this.towerTypes[type].cost;
                    
                    if (this.money < cost || !this.gameActive) {
                        btn.classList.add('disabled');
                    } else {
                        btn.classList.remove('disabled');
                    }
                });
            }
            
            updateWaveDisplay() {
                const waveText = document.getElementById('waveText');
                const waveProgress = document.getElementById('waveProgress');
                
                if (!this.gameActive) {
                    waveText.textContent = '点击开始游戏';
                    waveProgress.style.width = '0%';
                } else if (this.waveInProgress) {
                    const remaining = this.enemies.length + this.enemySpawnQueue.length;
                    const total = this.waves[this.wave - 1].enemies.reduce((sum, group) => sum + group.count, 0);
                    const progress = ((total - remaining) / total) * 100;
                    
                    waveText.textContent = `波次 ${this.wave} - 剩余敌人: ${remaining}`;
                    waveProgress.style.width = progress + '%';
                } else if (this.wave >= this.waves.length) {
                    waveText.textContent = '所有波次完成！';
                    waveProgress.style.width = '100%';
                } else {
                    waveText.textContent = `准备波次 ${this.wave + 1}`;
                    waveProgress.style.width = '0%';
                }
            }
            
            draw() {
                // 清空画布
                this.ctx.fillStyle = '#2E7D32';
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                
                // 绘制路径
                this.drawPath();
                
                // 绘制塔的射程（选中塔时）
                if (this.selectedTowerType) {
                    this.drawTowerRange();
                }
                
                // 绘制塔
                this.drawTowers();
                
                // 绘制敌人
                this.drawEnemies();
                
                // 绘制子弹
                this.drawProjectiles();
                
                // 绘制激光
                this.drawLasers();
            }
            
            drawPath() {
                this.ctx.strokeStyle = '#8BC34A';
                this.ctx.lineWidth = 40;
                this.ctx.lineCap = 'round';
                this.ctx.lineJoin = 'round';
                
                this.ctx.beginPath();
                this.ctx.moveTo(this.path[0].x, this.path[0].y);
                
                for (let i = 1; i < this.path.length; i++) {
                    this.ctx.lineTo(this.path[i].x, this.path[i].y);
                }
                
                this.ctx.stroke();
                
                // 绘制起点和终点
                this.ctx.fillStyle = '#4CAF50';
                this.ctx.beginPath();
                this.ctx.arc(this.path[0].x, this.path[0].y, 20, 0, Math.PI * 2);
                this.ctx.fill();
                
                this.ctx.fillStyle = '#F44336';
                this.ctx.beginPath();
                this.ctx.arc(this.path[this.path.length - 1].x, this.path[this.path.length - 1].y, 20, 0, Math.PI * 2);
                this.ctx.fill();
            }
            
            drawTowerRange() {
                // 在鼠标位置绘制射程预览
                this.canvas.addEventListener('mousemove', (e) => {
                    if (this.selectedTowerType && this.gameActive && !this.gamePaused) {
                        const rect = this.canvas.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        
                        this.ctx.save();
                        this.ctx.globalAlpha = 0.3;
                        this.ctx.fillStyle = '#FFD54F';
                        this.ctx.beginPath();
                        this.ctx.arc(x, y, this.towerTypes[this.selectedTowerType].range, 0, Math.PI * 2);
                        this.ctx.fill();
                        this.ctx.restore();
                    }
                });
            }
            
            drawTowers() {
                this.towers.forEach(tower => {
                    // 塔基座
                    this.ctx.fillStyle = '#424242';
                    this.ctx.beginPath();
                    this.ctx.arc(tower.x, tower.y, 18, 0, Math.PI * 2);
                    this.ctx.fill();
                    
                    // 塔主体
                    this.ctx.fillStyle = tower.color;
                    this.ctx.beginPath();
                    this.ctx.arc(tower.x, tower.y, 12, 0, Math.PI * 2);
                    this.ctx.fill();
                    
                    // 射程显示（选中时）
                    if (tower.target) {
                        this.ctx.save();
                        this.ctx.globalAlpha = 0.2;
                        this.ctx.strokeStyle = tower.color;
                        this.ctx.lineWidth = 2;
                        this.ctx.beginPath();
                        this.ctx.arc(tower.x, tower.y, tower.range, 0, Math.PI * 2);
                        this.ctx.stroke();
                        this.ctx.restore();
                    }
                });
            }
            
            drawEnemies() {
                this.enemies.forEach(enemy => {
                    // 敌人主体
                    this.ctx.fillStyle = enemy.color;
                    this.ctx.beginPath();
                    this.ctx.arc(enemy.x, enemy.y, 12, 0, Math.PI * 2);
                    this.ctx.fill();
                    
                    // 血条
                    const healthPercent = enemy.health / enemy.maxHealth;
                    this.ctx.fillStyle = '#424242';
                    this.ctx.fillRect(enemy.x - 15, enemy.y - 20, 30, 4);
                    
                    this.ctx.fillStyle = healthPercent > 0.5 ? '#4CAF50' : 
                                       healthPercent > 0.25 ? '#FF9800' : '#F44336';
                    this.ctx.fillRect(enemy.x - 15, enemy.y - 20, 30 * healthPercent, 4);
                });
            }
            
            drawProjectiles() {
                this.projectiles.forEach(projectile => {
                    this.ctx.fillStyle = projectile.color;
                    this.ctx.beginPath();
                    this.ctx.arc(projectile.x, projectile.y, 4, 0, Math.PI * 2);
                    this.ctx.fill();
                });
            }
            
            drawLasers() {
                this.towers.forEach(tower => {
                    if (tower.continuous && tower.target) {
                        this.ctx.strokeStyle = tower.color;
                        this.ctx.lineWidth = 3;
                        this.ctx.beginPath();
                        this.ctx.moveTo(tower.x, tower.y);
                        this.ctx.lineTo(tower.target.x, tower.target.y);
                        this.ctx.stroke();
                    }
                });
            }
            
            showHelp() {
                document.getElementById('helpPopup').classList.add('show');
            }
            
            closeHelp() {
                document.getElementById('helpPopup').classList.remove('show');
            }
        }

        // 全局变量
        let towerDefense;

        // 页面加载完成后初始化
        document.addEventListener('DOMContentLoaded', () => {
            towerDefense = new TowerDefense();
            towerDefense.draw();
        });