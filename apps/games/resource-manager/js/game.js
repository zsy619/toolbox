class ResourceManager {
            constructor() {
                this.gameActive = false;
                this.gamePaused = false;
                this.selectedBuilding = null;
                
                // 资源
                this.resources = {
                    gold: 1000,
                    food: 500,
                    stone: 300,
                    wood: 400,
                    population: 10,
                    energy: 100
                };
                
                this.resourceRates = {
                    gold: 0,
                    food: 0,
                    stone: 0,
                    wood: 0,
                    energy: 0
                };
                
                this.populationCap = 50;
                
                // 建筑配置
                this.buildingTypes = {
                    house: {
                        name: '住房',
                        icon: '🏠',
                        cost: {gold: 100},
                        population: 10,
                        maxLevel: 5
                    },
                    farm: {
                        name: '农场',
                        icon: '🚜',
                        cost: {gold: 150, wood: 50},
                        production: {food: 2},
                        maxLevel: 3
                    },
                    mine: {
                        name: '矿场',
                        icon: '⛏️',
                        cost: {gold: 200, wood: 80},
                        production: {stone: 1.5},
                        maxLevel: 3
                    },
                    lumber: {
                        name: '伐木场',
                        icon: '🪓',
                        cost: {gold: 120},
                        production: {wood: 2},
                        maxLevel: 3
                    },
                    market: {
                        name: '市场',
                        icon: '🏪',
                        cost: {gold: 300, stone: 100},
                        production: {gold: 3},
                        maxLevel: 4
                    },
                    factory: {
                        name: '工厂',
                        icon: '🏭',
                        cost: {gold: 500, stone: 150, wood: 100},
                        production: {energy: 5},
                        consumption: {food: 1},
                        maxLevel: 3
                    }
                };
                
                // 城市网格
                this.citySize = {width: 8, height: 6};
                this.buildings = {};
                
                // 科技
                this.research = {
                    efficiency: {completed: false, progress: 0, cost: 500, time: 10000},
                    capacity: {completed: false, progress: 0, cost: 300, time: 8000},
                    automation: {completed: false, progress: 0, cost: 800, time: 15000}
                };
                this.currentResearch = null;
                
                // 成就
                this.achievements = {
                    first_build: false,
                    rich_city: false,
                    big_population: false
                };
                
                this.gameLoop = null;
                this.lastUpdate = Date.now();
                this.totalGoldEarned = 0;
                
                this.initializeGame();
            }
            
            initializeGame() {
                this.generateCityGrid();
                this.updateDisplay();
                this.updateBuildingButtons();
                this.loadAchievements();
            }
            
            generateCityGrid() {
                const grid = document.getElementById('cityGrid');
                grid.innerHTML = '';
                
                for (let y = 0; y < this.citySize.height; y++) {
                    for (let x = 0; x < this.citySize.width; x++) {
                        const tile = document.createElement('div');
                        tile.className = 'city-tile';
                        tile.dataset.x = x;
                        tile.dataset.y = y;
                        tile.addEventListener('click', () => this.handleTileClick(x, y));
                        grid.appendChild(tile);
                    }
                }
            }
            
            selectBuilding(type) {
                if (!this.gameActive) return;
                
                const building = this.buildingTypes[type];
                if (!this.canAfford(building.cost)) return;
                
                this.selectedBuilding = type;
                this.updateBuildingButtons();
            }
            
            handleTileClick(x, y) {
                if (!this.gameActive || !this.selectedBuilding) return;
                
                const key = `${x},${y}`;
                if (this.buildings[key]) {
                    this.upgradeBuilding(x, y);
                    return;
                }
                
                this.buildBuilding(x, y);
            }
            
            buildBuilding(x, y) {
                const buildingType = this.buildingTypes[this.selectedBuilding];
                
                if (!this.canAfford(buildingType.cost)) return;
                
                // 消耗资源
                Object.keys(buildingType.cost).forEach(resource => {
                    this.resources[resource] -= buildingType.cost[resource];
                });
                
                // 建造建筑
                const key = `${x},${y}`;
                this.buildings[key] = {
                    type: this.selectedBuilding,
                    level: 1,
                    x: x,
                    y: y
                };
                
                // 更新人口容量
                if (buildingType.population) {
                    this.populationCap += buildingType.population;
                }
                
                this.updateTile(x, y);
                this.calculateProduction();
                this.updateDisplay();
                this.updateBuildingButtons();
                
                // 检查成就
                this.checkAchievement('first_build');
                
                this.selectedBuilding = null;
            }
            
            upgradeBuilding(x, y) {
                const key = `${x},${y}`;
                const building = this.buildings[key];
                const buildingType = this.buildingTypes[building.type];
                
                if (building.level >= buildingType.maxLevel) return;
                
                const upgradeCost = this.getUpgradeCost(building.type, building.level);
                if (!this.canAfford(upgradeCost)) return;
                
                // 消耗资源
                Object.keys(upgradeCost).forEach(resource => {
                    this.resources[resource] -= upgradeCost[resource];
                });
                
                building.level++;
                this.updateTile(x, y);
                this.calculateProduction();
                this.updateDisplay();
            }
            
            getUpgradeCost(type, level) {
                const baseCost = this.buildingTypes[type].cost;
                const multiplier = Math.pow(1.5, level);
                
                const cost = {};
                Object.keys(baseCost).forEach(resource => {
                    cost[resource] = Math.floor(baseCost[resource] * multiplier);
                });
                
                return cost;
            }
            
            updateTile(x, y) {
                const tile = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
                const key = `${x},${y}`;
                const building = this.buildings[key];
                
                if (building) {
                    tile.classList.add('occupied');
                    tile.innerHTML = `
                        <div class="building-sprite">${this.buildingTypes[building.type].icon}</div>
                        <div class="building-level">${building.level}</div>
                    `;
                } else {
                    tile.classList.remove('occupied');
                    tile.innerHTML = '';
                }
            }
            
            canAfford(cost) {
                return Object.keys(cost).every(resource => 
                    this.resources[resource] >= cost[resource]
                );
            }
            
            startGame() {
                this.gameActive = true;
                this.gamePaused = false;
                
                document.getElementById('startBtn').disabled = true;
                document.getElementById('pauseBtn').disabled = false;
                
                this.lastUpdate = Date.now();
                this.startGameLoop();
            }
            
            pauseGame() {
                this.gamePaused = !this.gamePaused;
                const pauseBtn = document.getElementById('pauseBtn');
                
                if (this.gamePaused) {
                    pauseBtn.textContent = '▶️ 继续';
                } else {
                    pauseBtn.textContent = '⏸️ 暂停';
                    this.lastUpdate = Date.now();
                }
            }
            
            startGameLoop() {
                const loop = () => {
                    if (this.gameActive) {
                        if (!this.gamePaused) {
                            this.update();
                        }
                        this.gameLoop = requestAnimationFrame(loop);
                    }
                };
                this.gameLoop = requestAnimationFrame(loop);
            }
            
            update() {
                const now = Date.now();
                const deltaTime = now - this.lastUpdate;
                this.lastUpdate = now;
                
                // 更新资源
                this.updateResources(deltaTime);
                
                // 更新研究
                this.updateResearch(deltaTime);
                
                // 检查成就
                this.checkAchievements();
                
                // 更新显示
                this.updateDisplay();
            }
            
            updateResources(deltaTime) {
                const seconds = deltaTime / 1000;
                
                Object.keys(this.resourceRates).forEach(resource => {
                    if (this.resourceRates[resource] > 0) {
                        this.resources[resource] += this.resourceRates[resource] * seconds;
                        
                        if (resource === 'gold') {
                            this.totalGoldEarned += this.resourceRates[resource] * seconds;
                        }
                    }
                });
                
                // 限制资源上限
                const capacity = this.research.capacity.completed ? 1.5 : 1;
                this.resources.gold = Math.min(this.resources.gold, 10000 * capacity);
                this.resources.food = Math.min(this.resources.food, 2000 * capacity);
                this.resources.stone = Math.min(this.resources.stone, 2000 * capacity);
                this.resources.wood = Math.min(this.resources.wood, 2000 * capacity);
                this.resources.energy = Math.min(this.resources.energy, 1000 * capacity);
            }
            
            calculateProduction() {
                // 重置产出率
                this.resourceRates = {
                    gold: 0,
                    food: 0,
                    stone: 0,
                    wood: 0,
                    energy: 0
                };
                
                // 计算建筑产出
                Object.values(this.buildings).forEach(building => {
                    const buildingType = this.buildingTypes[building.type];
                    const efficiency = this.research.efficiency.completed ? 1.2 : 1;
                    
                    if (buildingType.production) {
                        Object.keys(buildingType.production).forEach(resource => {
                            this.resourceRates[resource] += 
                                buildingType.production[resource] * building.level * efficiency;
                        });
                    }
                    
                    if (buildingType.consumption) {
                        Object.keys(buildingType.consumption).forEach(resource => {
                            this.resourceRates[resource] -= 
                                buildingType.consumption[resource] * building.level;
                        });
                    }
                });
                
                this.updateProductionDisplay();
            }
            
            updateProductionDisplay() {
                const display = document.getElementById('productionDisplay');
                const buildingCounts = {};
                
                // 统计建筑数量
                Object.values(this.buildings).forEach(building => {
                    if (!buildingCounts[building.type]) {
                        buildingCounts[building.type] = 0;
                    }
                    buildingCounts[building.type]++;
                });
                
                if (Object.keys(buildingCounts).length === 0) {
                    display.innerHTML = '<div style="text-align: center; opacity: 0.6; padding: 20px;">建造生产建筑后将显示产出信息</div>';
                    return;
                }
                
                let html = '';
                Object.keys(buildingCounts).forEach(type => {
                    const buildingType = this.buildingTypes[type];
                    const count = buildingCounts[type];
                    
                    if (buildingType.production) {
                        Object.keys(buildingType.production).forEach(resource => {
                            const rate = this.resourceRates[resource] || 0;
                            const icon = this.getResourceIcon(resource);
                            
                            html += `
                                <div class="production-item">
                                    <div class="production-building">
                                        <span>${buildingType.icon}</span>
                                        <span>${buildingType.name} x${count}</span>
                                    </div>
                                    <div class="production-rate">+${rate.toFixed(1)}${icon}/s</div>
                                </div>
                            `;
                        });
                    }
                });
                
                display.innerHTML = html;
            }
            
            getResourceIcon(resource) {
                const icons = {
                    gold: '🪙',
                    food: '🌾',
                    stone: '🪨',
                    wood: '🪵',
                    energy: '⚡'
                };
                return icons[resource] || '';
            }
            
            startResearch(type) {
                if (!this.gameActive || this.currentResearch || this.research[type].completed) return;
                
                const researchData = this.research[type];
                if (this.resources.gold < researchData.cost) return;
                
                this.resources.gold -= researchData.cost;
                this.currentResearch = type;
                this.research[type].progress = 0;
                
                this.updateResearchDisplay();
            }
            
            updateResearch(deltaTime) {
                if (!this.currentResearch) return;
                
                const researchData = this.research[this.currentResearch];
                researchData.progress += deltaTime;
                
                if (researchData.progress >= researchData.time) {
                    researchData.completed = true;
                    this.currentResearch = null;
                    this.calculateProduction();
                }
                
                this.updateResearchDisplay();
            }
            
            updateResearchDisplay() {
                const items = document.querySelectorAll('.research-item');
                items.forEach((item, index) => {
                    const types = ['efficiency', 'capacity', 'automation'];
                    const type = types[index];
                    const researchData = this.research[type];
                    
                    item.classList.remove('completed', 'researching');
                    
                    if (researchData.completed) {
                        item.classList.add('completed');
                    } else if (this.currentResearch === type) {
                        item.classList.add('researching');
                    }
                });
            }
            
            checkAchievements() {
                this.checkAchievement('rich_city');
                this.checkAchievement('big_population');
            }
            
            checkAchievement(id) {
                if (this.achievements[id]) return;
                
                let unlocked = false;
                
                switch (id) {
                    case 'first_build':
                        unlocked = Object.keys(this.buildings).length > 0;
                        break;
                    case 'rich_city':
                        unlocked = this.totalGoldEarned >= 10000;
                        break;
                    case 'big_population':
                        unlocked = this.populationCap >= 200;
                        break;
                }
                
                if (unlocked) {
                    this.achievements[id] = true;
                    this.unlockAchievement(id);
                    this.saveAchievements();
                }
            }
            
            unlockAchievement(id) {
                const item = document.querySelector(`[data-id="${id}"]`);
                if (item) {
                    item.classList.add('unlocked');
                    item.style.animation = 'achievement-unlock 2s ease';
                }
            }
            
            updateDisplay() {
                // 更新资源显示
                Object.keys(this.resources).forEach(resource => {
                    const element = document.getElementById(resource);
                    if (element) {
                        element.textContent = Math.floor(this.resources[resource]);
                    }
                });
                
                // 更新资源产出率
                Object.keys(this.resourceRates).forEach(resource => {
                    const element = document.getElementById(resource + 'Rate');
                    if (element && this.resourceRates[resource] !== undefined) {
                        const rate = this.resourceRates[resource];
                        element.textContent = `${rate >= 0 ? '+' : ''}${rate.toFixed(1)}/s`;
                    }
                });
                
                // 更新人口上限
                document.getElementById('populationCap').textContent = `/${this.populationCap}`;
            }
            
            updateBuildingButtons() {
                const buttons = document.querySelectorAll('.building-btn');
                buttons.forEach(button => {
                    button.classList.remove('affordable', 'disabled');
                    
                    const buildingType = button.onclick.toString().match(/selectBuilding\('(\w+)'\)/);
                    if (buildingType) {
                        const type = buildingType[1];
                        const building = this.buildingTypes[type];
                        
                        if (this.canAfford(building.cost) && this.gameActive) {
                            button.classList.add('affordable');
                        } else {
                            button.classList.add('disabled');
                        }
                    }
                });
            }
            
            saveGame() {
                const gameData = {
                    resources: this.resources,
                    buildings: this.buildings,
                    research: this.research,
                    achievements: this.achievements,
                    populationCap: this.populationCap,
                    totalGoldEarned: this.totalGoldEarned
                };
                
                try {
                    localStorage.setItem('resourceManager_save', JSON.stringify(gameData));
                    alert('游戏已保存！');
                } catch (e) {
                    alert('保存失败！');
                }
            }
            
            loadGame() {
                try {
                    const saved = localStorage.getItem('resourceManager_save');
                    if (!saved) {
                        alert('没有找到存档！');
                        return;
                    }
                    
                    const gameData = JSON.parse(saved);
                    this.resources = gameData.resources;
                    this.buildings = gameData.buildings || {};
                    this.research = gameData.research || {};
                    this.achievements = gameData.achievements || {};
                    this.populationCap = gameData.populationCap || 50;
                    this.totalGoldEarned = gameData.totalGoldEarned || 0;
                    
                    // 重新生成城市
                    Object.keys(this.buildings).forEach(key => {
                        const building = this.buildings[key];
                        this.updateTile(building.x, building.y);
                    });
                    
                    this.calculateProduction();
                    this.updateDisplay();
                    this.updateAchievementDisplay();
                    
                    alert('游戏已加载！');
                } catch (e) {
                    alert('加载失败！');
                }
            }
            
            loadAchievements() {
                try {
                    const saved = localStorage.getItem('resourceManager_achievements');
                    if (saved) {
                        this.achievements = JSON.parse(saved);
                        this.updateAchievementDisplay();
                    }
                } catch (e) {
                    console.warn('无法加载成就');
                }
            }
            
            saveAchievements() {
                try {
                    localStorage.setItem('resourceManager_achievements', JSON.stringify(this.achievements));
                } catch (e) {
                    console.warn('无法保存成就');
                }
            }
            
            updateAchievementDisplay() {
                Object.keys(this.achievements).forEach(id => {
                    if (this.achievements[id]) {
                        const item = document.querySelector(`[data-id="${id}"]`);
                        if (item) {
                            item.classList.add('unlocked');
                        }
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
        let resourceManager;

        // 页面加载完成后初始化
        document.addEventListener('DOMContentLoaded', () => {
            resourceManager = new ResourceManager();
        });

        // 成就解锁动画
        const style = document.createElement('style');
        style.textContent = `
            @keyframes achievement-unlock {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); background: rgba(255, 215, 79, 0.5); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);