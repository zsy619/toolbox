class PVZGame {
            constructor() {
                this.sun = 50;
                this.wave = 1;
                this.gameStarted = false;
                this.gamePaused = false;
                this.selectedPlant = null;
                this.grid = [];
                this.plants = [];
                this.zombies = [];
                this.projectiles = [];
                this.suns = [];
                
                this.plantTypes = [
                    { id: 'peashooter', name: '豌豆射手', cost: 100, hp: 300, damage: 20, description: '发射豌豆攻击僵尸' },
                    { id: 'sunflower', name: '向日葵', cost: 50, hp: 200, sunProduction: 25, description: '产生阳光' },
                    { id: 'walnut', name: '坚果墙', cost: 50, hp: 4000, description: '阻挡僵尸前进' },
                    { id: 'cherry', name: '樱桃炸弹', cost: 150, hp: 300, damage: 1800, description: '爆炸伤害周围僵尸' }
                ];
                
                this.zombieTypes = [
                    { id: 'basic', name: '普通僵尸', hp: 200, speed: 1, damage: 100 },
                    { id: 'cone', name: '路障僵尸', hp: 640, speed: 1, damage: 100 },
                    { id: 'bucket', name: '铁桶僵尸', hp: 1370, speed: 1, damage: 100 }
                ];
                
                this.init();
            }

            init() {
                this.generateGrid();
                this.updatePlantMenu();
                this.updateDisplay();
                this.startGameLoop();
                this.startSunProduction();
            }

            generateGrid() {
                const grid = document.getElementById('gameGrid');
                grid.innerHTML = '';
                this.grid = [];
                
                for (let row = 0; row < 5; row++) {
                    this.grid[row] = [];
                    for (let col = 0; col < 9; col++) {
                        const cell = document.createElement('div');
                        cell.className = 'cell';
                        cell.dataset.row = row;
                        cell.dataset.col = col;
                        cell.onclick = () => this.plantSeed(row, col);
                        
                        this.grid[row][col] = { plant: null, zombies: [] };
                        grid.appendChild(cell);
                    }
                }
            }

            updatePlantMenu() {
                const menu = document.getElementById('plantMenu');
                menu.innerHTML = '';
                
                this.plantTypes.forEach(plantType => {
                    const plantItem = document.createElement('div');
                    const canAfford = this.sun >= plantType.cost;
                    plantItem.className = `plant-item ${canAfford ? 'affordable' : 'expensive'} ${this.selectedPlant === plantType.id ? 'selected' : ''}`;
                    plantItem.onclick = () => this.selectPlant(plantType.id);
                    
                    plantItem.innerHTML = `
                        <div class="plant-name">${plantType.name}</div>
                        <div class="plant-cost">阳光: ${plantType.cost}</div>
                    `;
                    
                    menu.appendChild(plantItem);
                });
            }

            selectPlant(plantId) {
                this.selectedPlant = this.selectedPlant === plantId ? null : plantId;
                this.updatePlantMenu();
            }

            plantSeed(row, col) {
                if (!this.selectedPlant || this.grid[row][col].plant) return;
                
                const plantType = this.plantTypes.find(p => p.id === this.selectedPlant);
                if (!plantType || this.sun < plantType.cost) return;
                
                this.sun -= plantType.cost;
                
                const plant = {
                    id: Date.now(),
                    type: this.selectedPlant,
                    row: row,
                    col: col,
                    hp: plantType.hp,
                    maxHp: plantType.hp,
                    lastShot: 0,
                    lastSun: 0
                };
                
                this.plants.push(plant);
                this.grid[row][col].plant = plant;
                this.renderPlant(plant);
                this.updateDisplay();
                this.updatePlantMenu();
            }

            renderPlant(plant) {
                const cell = document.querySelector(`[data-row="${plant.row}"][data-col="${plant.col}"]`);
                const plantElement = document.createElement('div');
                plantElement.className = `plant ${plant.type}`;
                plantElement.dataset.plantId = plant.id;
                
                const plantIcons = {
                    peashooter: '🌱',
                    sunflower: '🌻',
                    walnut: '🥜',
                    cherry: '🍒'
                };
                plantElement.textContent = plantIcons[plant.type];
                
                const healthBar = document.createElement('div');
                healthBar.className = 'health-bar';
                const healthFill = document.createElement('div');
                healthFill.className = 'health-fill';
                healthFill.style.width = `${(plant.hp / plant.maxHp) * 100}%`;
                healthBar.appendChild(healthFill);
                plantElement.appendChild(healthBar);
                
                cell.appendChild(plantElement);
            }

            spawnZombie() {
                const row = Math.floor(Math.random() * 5);
                const zombieType = this.zombieTypes[Math.floor(Math.random() * Math.min(this.zombieTypes.length, Math.ceil(this.wave / 2)))];
                
                const zombie = {
                    id: Date.now() + Math.random(),
                    type: zombieType.id,
                    row: row,
                    position: 8.5,
                    hp: zombieType.hp,
                    maxHp: zombieType.hp,
                    speed: zombieType.speed * 0.01,
                    damage: zombieType.damage,
                    lastAttack: 0
                };
                
                this.zombies.push(zombie);
                this.renderZombie(zombie);
            }

            renderZombie(zombie) {
                const existingZombie = document.querySelector(`[data-zombie-id="${zombie.id}"]`);
                if (existingZombie) existingZombie.remove();
                
                const zombieElement = document.createElement('div');
                zombieElement.className = `zombie ${zombie.type}`;
                zombieElement.dataset.zombieId = zombie.id;
                zombieElement.style.position = 'absolute';
                zombieElement.style.left = `${zombie.position * 11.11}%`;
                zombieElement.style.top = `${zombie.row * 20}%`;
                
                const zombieIcons = {
                    basic: '🧟',
                    cone: '🧟‍♂️',
                    bucket: '🧟‍♀️'
                };
                zombieElement.textContent = zombieIcons[zombie.type];
                
                const healthBar = document.createElement('div');
                healthBar.className = 'health-bar';
                const healthFill = document.createElement('div');
                healthFill.className = 'health-fill';
                healthFill.style.width = `${(zombie.hp / zombie.maxHp) * 100}%`;
                if (zombie.hp < zombie.maxHp * 0.3) healthFill.style.background = '#DC143C';
                healthBar.appendChild(healthFill);
                zombieElement.appendChild(healthBar);
                
                document.getElementById('gameGrid').appendChild(zombieElement);
            }

            updateZombies() {
                this.zombies.forEach(zombie => {
                    const col = Math.floor(zombie.position);
                    
                    if (col >= 0 && this.grid[zombie.row] && this.grid[zombie.row][col] && this.grid[zombie.row][col].plant) {
                        // 攻击植物
                        const plant = this.grid[zombie.row][col].plant;
                        const currentTime = Date.now();
                        
                        if (currentTime - zombie.lastAttack > 1000) {
                            plant.hp -= zombie.damage;
                            zombie.lastAttack = currentTime;
                            
                            if (plant.hp <= 0) {
                                this.removePlant(plant);
                            }
                        }
                    } else {
                        // 移动
                        zombie.position -= zombie.speed;
                        
                        if (zombie.position < -0.5) {
                            this.endGame(false, '僵尸突破了防线！');
                            return;
                        }
                    }
                    
                    this.renderZombie(zombie);
                });
            }

            updatePlants() {
                this.plants.forEach(plant => {
                    const currentTime = Date.now();
                    
                    if (plant.type === 'peashooter' && currentTime - plant.lastShot > 1500) {
                        // 寻找同行的僵尸
                        const targetZombie = this.zombies.find(z => 
                            z.row === plant.row && z.position > plant.col
                        );
                        
                        if (targetZombie) {
                            this.createProjectile(plant.row, plant.col, targetZombie);
                            plant.lastShot = currentTime;
                        }
                    } else if (plant.type === 'sunflower' && currentTime - plant.lastSun > 10000) {
                        this.createSun(plant.row, plant.col);
                        plant.lastSun = currentTime;
                    } else if (plant.type === 'cherry' && plant.hp < plant.maxHp) {
                        // 樱桃炸弹被攻击后爆炸
                        this.explodeCherry(plant);
                    }
                    
                    // 更新植物显示
                    const plantElement = document.querySelector(`[data-plant-id="${plant.id}"]`);
                    if (plantElement) {
                        const healthFill = plantElement.querySelector('.health-fill');
                        if (healthFill) {
                            healthFill.style.width = `${(plant.hp / plant.maxHp) * 100}%`;
                        }
                    }
                });
            }

            createProjectile(row, col, target) {
                const projectile = {
                    id: Date.now(),
                    row: row,
                    startCol: col,
                    target: target,
                    damage: 20
                };
                
                this.projectiles.push(projectile);
                
                const projectileElement = document.createElement('div');
                projectileElement.className = 'projectile';
                projectileElement.dataset.projectileId = projectile.id;
                projectileElement.style.position = 'absolute';
                projectileElement.style.left = `${col * 11.11}%`;
                projectileElement.style.top = `${row * 20 + 10}%`;
                
                document.getElementById('gameGrid').appendChild(projectileElement);
                
                // 动画移动到目标
                setTimeout(() => {
                    projectileElement.style.left = `${target.position * 11.11}%`;
                }, 50);
                
                // 500ms后命中
                setTimeout(() => {
                    this.hitTarget(projectile);
                }, 500);
            }

            hitTarget(projectile) {
                const projectileElement = document.querySelector(`[data-projectile-id="${projectile.id}"]`);
                if (projectileElement) projectileElement.remove();
                
                if (projectile.target && projectile.target.hp > 0) {
                    projectile.target.hp -= projectile.damage;
                    
                    if (projectile.target.hp <= 0) {
                        this.removeZombie(projectile.target);
                    }
                }
                
                this.projectiles = this.projectiles.filter(p => p.id !== projectile.id);
            }

            createSun(row, col) {
                const sunElement = document.createElement('div');
                sunElement.className = 'sun';
                sunElement.textContent = '25';
                sunElement.style.position = 'absolute';
                sunElement.style.left = `${col * 11.11}%`;
                sunElement.style.top = '0px';
                sunElement.onclick = () => this.collectSun(sunElement, 25);
                
                document.getElementById('gameGrid').appendChild(sunElement);
                
                setTimeout(() => {
                    if (sunElement.parentNode) {
                        sunElement.remove();
                    }
                }, 3000);
            }

            collectSun(sunElement, amount) {
                this.sun += amount;
                sunElement.remove();
                this.updateDisplay();
                this.updatePlantMenu();
            }

            explodeCherry(cherry) {
                // 移除樱桃炸弹
                this.removePlant(cherry);
                
                // 伤害周围的僵尸
                this.zombies.forEach(zombie => {
                    const distance = Math.abs(zombie.row - cherry.row) + Math.abs(Math.floor(zombie.position) - cherry.col);
                    if (distance <= 2) {
                        zombie.hp -= 1800;
                        if (zombie.hp <= 0) {
                            this.removeZombie(zombie);
                        }
                    }
                });
            }

            removePlant(plant) {
                this.plants = this.plants.filter(p => p.id !== plant.id);
                this.grid[plant.row][plant.col].plant = null;
                
                const plantElement = document.querySelector(`[data-plant-id="${plant.id}"]`);
                if (plantElement) plantElement.remove();
            }

            removeZombie(zombie) {
                this.zombies = this.zombies.filter(z => z.id !== zombie.id);
                
                const zombieElement = document.querySelector(`[data-zombie-id="${zombie.id}"]`);
                if (zombieElement) zombieElement.remove();
            }

            nextWave() {
                this.wave++;
                
                // 增加僵尸数量
                const zombieCount = Math.min(10, 2 + this.wave);
                for (let i = 0; i < zombieCount; i++) {
                    setTimeout(() => {
                        if (this.gameStarted && !this.gamePaused) {
                            this.spawnZombie();
                        }
                    }, i * 2000);
                }
                
                this.updateDisplay();
            }

            startGameLoop() {
                this.gameStarted = true;
                
                setInterval(() => {
                    if (!this.gamePaused && this.gameStarted) {
                        this.updateZombies();
                        this.updatePlants();
                        this.updateDisplay();
                        
                        // 检查胜利条件
                        if (this.zombies.length === 0 && this.wave >= 5) {
                            this.endGame(true, '恭喜！你成功防守了所有波次的僵尸！');
                        }
                    }
                }, 100);
            }

            startSunProduction() {
                setInterval(() => {
                    if (!this.gamePaused && this.gameStarted) {
                        // 天空掉落阳光
                        if (Math.random() < 0.3) {
                            const sunElement = document.createElement('div');
                            sunElement.className = 'sun';
                            sunElement.textContent = '25';
                            sunElement.style.position = 'absolute';
                            sunElement.style.left = `${Math.random() * 80}%`;
                            sunElement.style.top = '0px';
                            sunElement.onclick = () => this.collectSun(sunElement, 25);
                            
                            document.getElementById('gameGrid').appendChild(sunElement);
                            
                            setTimeout(() => {
                                if (sunElement.parentNode) {
                                    sunElement.remove();
                                }
                            }, 3000);
                        }
                    }
                }, 5000);
            }

            updateDisplay() {
                document.getElementById('sunCount').textContent = this.sun;
                document.getElementById('sunDisplay').textContent = this.sun;
                document.getElementById('waveCount').textContent = this.wave;
                document.getElementById('currentWave').textContent = this.wave;
                document.getElementById('zombieCount').textContent = this.zombies.length;
                document.getElementById('plantCount').textContent = this.plants.length;
            }

            pauseGame() {
                this.gamePaused = !this.gamePaused;
                const btn = document.getElementById('pauseBtn');
                btn.textContent = this.gamePaused ? '继续' : '暂停';
            }

            newGame() {
                location.reload();
            }

            endGame(victory, message) {
                this.gameStarted = false;
                
                document.getElementById('victoryTitle').textContent = victory ? '🎉 胜利 🎉' : '💀 失败 💀';
                document.getElementById('victoryText').textContent = message;
                document.getElementById('victoryModal').style.display = 'flex';
            }

            closeVictoryModal() {
                document.getElementById('victoryModal').style.display = 'none';
                this.newGame();
            }

            showRules() {
                alert(`植物大战僵尸游戏规则：

目标：
• 阻止僵尸进入房屋，坚持到第5波

植物介绍：
• 豌豆射手：发射豌豆攻击僵尸
• 向日葵：产生阳光资源
• 坚果墙：高血量阻挡僵尸
• 樱桃炸弹：爆炸伤害周围僵尸

僵尸类型：
• 普通僵尸：基础血量
• 路障僵尸：中等血量
• 铁桶僵尸：高血量

游戏技巧：
• 合理搭配不同植物
• 及时收集阳光
• 在僵尸密集时使用炸弹
• 用坚果墙保护射手植物`);
            }
        }

        // 初始化游戏
        const pvz = new PVZGame();