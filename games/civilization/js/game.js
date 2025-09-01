class CivilizationGame {
            constructor() {
                this.turn = 1;
                this.resources = {
                    food: 50,
                    wood: 30,
                    stone: 20,
                    science: 10,
                    population: 100
                };
                
                this.resourcesPerTurn = {
                    food: 5,
                    wood: 3,
                    stone: 2,
                    science: 1
                };
                
                this.map = [];
                this.selectedTile = null;
                this.selectedBuilding = null;
                this.selectedTech = null;
                
                this.buildings = [
                    { 
                        id: 'farm', 
                        name: '农场', 
                        cost: { food: 0, wood: 10, stone: 5 }, 
                        effect: { food: 3 },
                        description: '增加食物产量',
                        terrain: ['plains', 'forest']
                    },
                    { 
                        id: 'lumber', 
                        name: '伐木场', 
                        cost: { food: 5, wood: 0, stone: 5 }, 
                        effect: { wood: 3 },
                        description: '增加木材产量',
                        terrain: ['forest']
                    },
                    { 
                        id: 'mine', 
                        name: '采石场', 
                        cost: { food: 10, wood: 15, stone: 0 }, 
                        effect: { stone: 4 },
                        description: '增加石料产量',
                        terrain: ['mountain', 'desert']
                    },
                    { 
                        id: 'barracks', 
                        name: '兵营', 
                        cost: { food: 20, wood: 25, stone: 30 }, 
                        effect: { population: 20 },
                        description: '增加人口上限',
                        terrain: ['plains', 'desert']
                    },
                    { 
                        id: 'library', 
                        name: '图书馆', 
                        cost: { food: 30, wood: 40, stone: 25 }, 
                        effect: { science: 3 },
                        description: '增加科技点产量',
                        terrain: ['plains']
                    },
                    { 
                        id: 'city', 
                        name: '城市', 
                        cost: { food: 50, wood: 60, stone: 80 }, 
                        effect: { food: 5, wood: 3, stone: 2, science: 2, population: 50 },
                        description: '综合发展城市',
                        terrain: ['plains', 'forest']
                    }
                ];
                
                this.technologies = [
                    { 
                        id: 'agriculture', 
                        name: '农业', 
                        cost: { science: 20 }, 
                        effect: { food: 2 },
                        description: '提高农业产量',
                        researched: false
                    },
                    { 
                        id: 'woodworking', 
                        name: '木工技术', 
                        cost: { science: 25 }, 
                        effect: { wood: 2 },
                        description: '提高木材利用效率',
                        researched: false
                    },
                    { 
                        id: 'mining', 
                        name: '采矿技术', 
                        cost: { science: 30 }, 
                        effect: { stone: 3 },
                        description: '提高石料开采效率',
                        researched: false
                    },
                    { 
                        id: 'writing', 
                        name: '文字', 
                        cost: { science: 40 }, 
                        effect: { science: 2 },
                        description: '促进知识传播',
                        researched: false
                    },
                    { 
                        id: 'mathematics', 
                        name: '数学', 
                        cost: { science: 60 }, 
                        effect: { science: 3 },
                        description: '推动科学发展',
                        researched: false,
                        prerequisite: 'writing'
                    },
                    { 
                        id: 'engineering', 
                        name: '工程学', 
                        cost: { science: 80 }, 
                        effect: { wood: 3, stone: 3 },
                        description: '提高建设效率',
                        researched: false,
                        prerequisite: 'mathematics'
                    }
                ];
                
                this.gameStats = JSON.parse(localStorage.getItem('civilizationStats') || '{}');
                
                this.init();
            }

            init() {
                this.generateMap();
                this.updateDisplay();
                this.updateBuildingsDisplay();
                this.updateTechDisplay();
                this.showAchievement('文明建设游戏开始！建造你的伟大文明！');
            }

            generateMap() {
                this.map = [];
                const terrainTypes = ['plains', 'forest', 'mountain', 'water', 'desert'];
                const terrainWeights = [0.3, 0.25, 0.2, 0.15, 0.1];
                
                for (let row = 0; row < 6; row++) {
                    this.map[row] = [];
                    for (let col = 0; col < 8; col++) {
                        const random = Math.random();
                        let cumulativeWeight = 0;
                        let terrain = 'plains';
                        
                        for (let i = 0; i < terrainTypes.length; i++) {
                            cumulativeWeight += terrainWeights[i];
                            if (random <= cumulativeWeight) {
                                terrain = terrainTypes[i];
                                break;
                            }
                        }
                        
                        this.map[row][col] = {
                            terrain: terrain,
                            building: null,
                            row: row,
                            col: col
                        };
                    }
                }
                
                // 在中心放置初始城市
                this.map[2][3].building = 'city';
                this.map[3][4].building = 'city';
                
                this.renderMap();
            }

            renderMap() {
                const grid = document.getElementById('cityGrid');
                grid.innerHTML = '';
                
                for (let row = 0; row < 6; row++) {
                    for (let col = 0; col < 8; col++) {
                        const tile = this.map[row][col];
                        const tileElement = document.createElement('div');
                        tileElement.className = `tile ${tile.terrain}`;
                        tileElement.dataset.row = row;
                        tileElement.dataset.col = col;
                        tileElement.onclick = () => this.selectTile(row, col);
                        
                        // 显示地形类型
                        const terrainNames = {
                            plains: '平原',
                            forest: '森林',
                            mountain: '山地',
                            water: '水域',
                            desert: '沙漠'
                        };
                        
                        tileElement.textContent = terrainNames[tile.terrain];
                        
                        // 如果有建筑，显示建筑
                        if (tile.building) {
                            const buildingElement = document.createElement('div');
                            buildingElement.className = `building ${tile.building}`;
                            const buildingConfig = this.buildings.find(b => b.id === tile.building);
                            buildingElement.textContent = buildingConfig ? buildingConfig.name : tile.building;
                            tileElement.appendChild(buildingElement);
                        }
                        
                        grid.appendChild(tileElement);
                    }
                }
            }

            selectTile(row, col) {
                // 清除之前的选择
                document.querySelectorAll('.tile.selected').forEach(tile => {
                    tile.classList.remove('selected');
                });
                
                // 选择新的地块
                const tileElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                tileElement.classList.add('selected');
                
                this.selectedTile = { row, col };
                const tile = this.map[row][col];
                
                const terrainNames = {
                    plains: '平原',
                    forest: '森林',
                    mountain: '山地',
                    water: '水域',
                    desert: '沙漠'
                };
                
                let tileInfo = `${terrainNames[tile.terrain]}`;
                if (tile.building) {
                    const buildingConfig = this.buildings.find(b => b.id === tile.building);
                    tileInfo += ` (${buildingConfig ? buildingConfig.name : tile.building})`;
                }
                
                document.getElementById('selectedTile').textContent = tileInfo;
                
                this.updateBuildingsDisplay();
            }

            buildBuilding(buildingId) {
                if (!this.selectedTile) {
                    this.showInfo('请先选择一个地块', '建造提示');
                    return;
                }
                
                const building = this.buildings.find(b => b.id === buildingId);
                const tile = this.map[this.selectedTile.row][this.selectedTile.col];
                
                // 检查地形适合性
                if (!building.terrain.includes(tile.terrain)) {
                    this.showInfo(`${building.name}不能建在${this.getTerrainName(tile.terrain)}上`, '建造失败');
                    return;
                }
                
                // 检查是否已有建筑
                if (tile.building) {
                    this.showInfo('该地块已有建筑', '建造失败');
                    return;
                }
                
                // 检查资源是否足够
                if (!this.canAfford(building.cost)) {
                    this.showInfo('资源不足', '建造失败');
                    return;
                }
                
                this.selectedBuilding = building;
                document.getElementById('buildingDetails').innerHTML = `
                    <h4>${building.name}</h4>
                    <p>${building.description}</p>
                    <p><strong>消耗：</strong>${this.formatCost(building.cost)}</p>
                    <p><strong>效果：</strong>${this.formatEffect(building.effect)}</p>
                `;
                document.getElementById('buildingModal').style.display = 'flex';
            }

            confirmBuilding() {
                if (!this.selectedBuilding || !this.selectedTile) return;
                
                const building = this.selectedBuilding;
                const tile = this.map[this.selectedTile.row][this.selectedTile.col];
                
                // 扣除资源
                Object.entries(building.cost).forEach(([resource, cost]) => {
                    this.resources[resource] -= cost;
                });
                
                // 增加每回合产量
                Object.entries(building.effect).forEach(([resource, bonus]) => {
                    if (resource === 'population') {
                        // 人口是上限，不是每回合产量
                        return;
                    }
                    this.resourcesPerTurn[resource] += bonus;
                });
                
                // 建造建筑
                tile.building = building.id;
                
                this.showAchievement(`成功建造了${building.name}！`);
                this.updateDisplay();
                this.renderMap();
                this.updateBuildingsDisplay();
                this.closeBuildingModal();
            }

            closeBuildingModal() {
                document.getElementById('buildingModal').style.display = 'none';
                this.selectedBuilding = null;
            }

            researchTech(techId) {
                const tech = this.technologies.find(t => t.id === techId);
                
                if (tech.researched) {
                    this.showInfo('该技术已经研究过了', '研究失败');
                    return;
                }
                
                if (tech.prerequisite && !this.technologies.find(t => t.id === tech.prerequisite).researched) {
                    this.showInfo('需要先研究前置技术', '研究失败');
                    return;
                }
                
                if (!this.canAfford(tech.cost)) {
                    this.showInfo('科技点不足', '研究失败');
                    return;
                }
                
                this.selectedTech = tech;
                document.getElementById('techDetails').innerHTML = `
                    <h4>${tech.name}</h4>
                    <p>${tech.description}</p>
                    <p><strong>消耗：</strong>${this.formatCost(tech.cost)}</p>
                    <p><strong>效果：</strong>${this.formatEffect(tech.effect)}</p>
                `;
                document.getElementById('techModal').style.display = 'flex';
            }

            confirmTech() {
                if (!this.selectedTech) return;
                
                const tech = this.selectedTech;
                
                // 扣除科技点
                Object.entries(tech.cost).forEach(([resource, cost]) => {
                    this.resources[resource] -= cost;
                });
                
                // 应用科技效果
                Object.entries(tech.effect).forEach(([resource, bonus]) => {
                    this.resourcesPerTurn[resource] += bonus;
                });
                
                tech.researched = true;
                
                this.showAchievement(`成功研究了${tech.name}！`);
                this.updateDisplay();
                this.updateTechDisplay();
                this.closeTechModal();
            }

            closeTechModal() {
                document.getElementById('techModal').style.display = 'none';
                this.selectedTech = null;
            }

            nextTurn() {
                this.turn++;
                
                // 增加资源
                Object.entries(this.resourcesPerTurn).forEach(([resource, amount]) => {
                    this.resources[resource] += amount;
                });
                
                // 检查成就
                this.checkAchievements();
                
                this.updateDisplay();
                this.updateBuildingsDisplay();
                this.updateTechDisplay();
            }

            autoPlay() {
                // 自动发展策略
                const strategies = [
                    () => this.autoBuild(),
                    () => this.autoResearch(),
                    () => this.expandTerritory()
                ];
                
                strategies.forEach(strategy => strategy());
                this.nextTurn();
            }

            autoBuild() {
                // 寻找可建造的最佳建筑
                const emptyTiles = [];
                for (let row = 0; row < 6; row++) {
                    for (let col = 0; col < 8; col++) {
                        if (!this.map[row][col].building && this.map[row][col].terrain !== 'water') {
                            emptyTiles.push({ row, col });
                        }
                    }
                }
                
                if (emptyTiles.length === 0) return;
                
                // 根据当前资源状况选择建筑
                let priorityBuilding = null;
                if (this.resources.food < 100) {
                    priorityBuilding = this.buildings.find(b => b.id === 'farm');
                } else if (this.resources.wood < 100) {
                    priorityBuilding = this.buildings.find(b => b.id === 'lumber');
                } else if (this.resources.stone < 100) {
                    priorityBuilding = this.buildings.find(b => b.id === 'mine');
                } else if (this.resources.science < 50) {
                    priorityBuilding = this.buildings.find(b => b.id === 'library');
                }
                
                if (!priorityBuilding || !this.canAfford(priorityBuilding.cost)) {
                    return;
                }
                
                // 寻找合适的地块
                const suitableTiles = emptyTiles.filter(tile => {
                    const terrain = this.map[tile.row][tile.col].terrain;
                    return priorityBuilding.terrain.includes(terrain);
                });
                
                if (suitableTiles.length > 0) {
                    const randomTile = suitableTiles[Math.floor(Math.random() * suitableTiles.length)];
                    this.selectedTile = randomTile;
                    
                    // 直接建造
                    Object.entries(priorityBuilding.cost).forEach(([resource, cost]) => {
                        this.resources[resource] -= cost;
                    });
                    
                    Object.entries(priorityBuilding.effect).forEach(([resource, bonus]) => {
                        if (resource !== 'population') {
                            this.resourcesPerTurn[resource] += bonus;
                        }
                    });
                    
                    this.map[randomTile.row][randomTile.col].building = priorityBuilding.id;
                    this.renderMap();
                }
            }

            autoResearch() {
                // 自动研究可负担的技术
                const availableTechs = this.technologies.filter(tech => 
                    !tech.researched && 
                    this.canAfford(tech.cost) &&
                    (!tech.prerequisite || this.technologies.find(t => t.id === tech.prerequisite).researched)
                );
                
                if (availableTechs.length > 0) {
                    const tech = availableTechs[0];
                    
                    Object.entries(tech.cost).forEach(([resource, cost]) => {
                        this.resources[resource] -= cost;
                    });
                    
                    Object.entries(tech.effect).forEach(([resource, bonus]) => {
                        this.resourcesPerTurn[resource] += bonus;
                    });
                    
                    tech.researched = true;
                    this.showAchievement(`自动研究了${tech.name}！`);
                }
            }

            expandTerritory() {
                // 扩张领土的逻辑（暂时简化）
                if (this.resources.food > 200 && this.resources.wood > 150 && this.resources.stone > 100) {
                    this.showAchievement('领土扩张成功！');
                }
            }

            checkAchievements() {
                const achievements = [
                    { condition: () => this.turn === 10, message: '文明发展10回合！' },
                    { condition: () => this.resources.food >= 200, message: '食物储备丰富！' },
                    { condition: () => this.resources.population >= 500, message: '人口繁荣！' },
                    { condition: () => this.technologies.filter(t => t.researched).length >= 3, message: '科技进步！' },
                    { condition: () => this.getBuildingCount() >= 10, message: '建筑大师！' },
                    { condition: () => this.turn >= 50, message: '文明持久发展！' }
                ];
                
                achievements.forEach(achievement => {
                    if (achievement.condition() && !achievement.triggered) {
                        this.showAchievement(achievement.message);
                        achievement.triggered = true;
                    }
                });
            }

            getBuildingCount() {
                let count = 0;
                for (let row = 0; row < 6; row++) {
                    for (let col = 0; col < 8; col++) {
                        if (this.map[row][col].building) {
                            count++;
                        }
                    }
                }
                return count;
            }

            canAfford(cost) {
                return Object.entries(cost).every(([resource, amount]) => {
                    return this.resources[resource] >= amount;
                });
            }

            formatCost(cost) {
                return Object.entries(cost).map(([resource, amount]) => {
                    const resourceNames = {
                        food: '食物',
                        wood: '木材',
                        stone: '石料',
                        science: '科技点'
                    };
                    return `${resourceNames[resource]}${amount}`;
                }).join(', ');
            }

            formatEffect(effect) {
                return Object.entries(effect).map(([resource, amount]) => {
                    const resourceNames = {
                        food: '食物',
                        wood: '木材',
                        stone: '石料',
                        science: '科技点',
                        population: '人口'
                    };
                    return `+${amount}${resourceNames[resource]}/回合`;
                }).join(', ');
            }

            getTerrainName(terrain) {
                const terrainNames = {
                    plains: '平原',
                    forest: '森林',
                    mountain: '山地',
                    water: '水域',
                    desert: '沙漠'
                };
                return terrainNames[terrain] || terrain;
            }

            updateDisplay() {
                document.getElementById('currentTurn').textContent = this.turn;
                document.getElementById('turnDisplay').textContent = this.turn;
                
                Object.entries(this.resources).forEach(([resource, amount]) => {
                    const element = document.getElementById(resource);
                    if (element) {
                        element.textContent = Math.floor(amount);
                    }
                    
                    const displayElement = document.getElementById(`${resource}Display`);
                    if (displayElement) {
                        displayElement.textContent = Math.floor(amount);
                    }
                });
                
                Object.entries(this.resourcesPerTurn).forEach(([resource, amount]) => {
                    const changeElement = document.getElementById(`${resource}Change`);
                    if (changeElement) {
                        changeElement.textContent = `+${amount}/回合`;
                        changeElement.className = amount > 0 ? 'resource-change' : 'resource-change negative';
                    }
                });
            }

            updateBuildingsDisplay() {
                const container = document.getElementById('buildingsContainer');
                container.innerHTML = '';
                
                this.buildings.forEach(building => {
                    const buildingElement = document.createElement('div');
                    const canAfford = this.canAfford(building.cost);
                    buildingElement.className = `building-item ${canAfford ? 'affordable' : 'expensive'}`;
                    buildingElement.onclick = () => this.buildBuilding(building.id);
                    
                    buildingElement.innerHTML = `
                        <div class="building-name">${building.name}</div>
                        <div class="building-cost">消耗: ${this.formatCost(building.cost)}</div>
                        <div class="building-effect">${this.formatEffect(building.effect)}</div>
                    `;
                    
                    container.appendChild(buildingElement);
                });
            }

            updateTechDisplay() {
                const container = document.getElementById('techContainer');
                container.innerHTML = '';
                
                this.technologies.forEach(tech => {
                    const techElement = document.createElement('div');
                    let className = 'tech-item';
                    
                    if (tech.researched) {
                        className += ' researched';
                    } else if (this.canAfford(tech.cost) && 
                              (!tech.prerequisite || this.technologies.find(t => t.id === tech.prerequisite).researched)) {
                        className += ' affordable';
                    } else {
                        className += ' expensive';
                    }
                    
                    techElement.className = className;
                    techElement.onclick = () => this.researchTech(tech.id);
                    
                    let statusText = tech.researched ? '已研究' : `消耗: ${this.formatCost(tech.cost)}`;
                    
                    techElement.innerHTML = `
                        <div style="font-weight: bold; color: #8e44ad;">${tech.name}</div>
                        <div style="font-size: 0.8rem; color: #666;">${statusText}</div>
                    `;
                    
                    container.appendChild(techElement);
                });
            }

            showProgress() {
                let progressText = '文明发展进度：\n\n';
                progressText += `回合数: ${this.turn}\n`;
                progressText += `建筑数量: ${this.getBuildingCount()}\n`;
                progressText += `已研究技术: ${this.technologies.filter(t => t.researched).length}/${this.technologies.length}\n`;
                progressText += `总人口: ${Math.floor(this.resources.population)}\n`;
                
                this.showInfo(progressText, '发展进度');
            }

            showStats() {
                let statsText = '游戏统计：\n\n';
                if (Object.keys(this.gameStats).length === 0) {
                    statsText += '暂无统计数据';
                } else {
                    Object.entries(this.gameStats).forEach(([key, value]) => {
                        statsText += `${key}: ${value}\n`;
                    });
                }
                
                this.showInfo(statsText, '游戏统计');
            }

            saveGame() {
                const saveData = {
                    turn: this.turn,
                    resources: this.resources,
                    resourcesPerTurn: this.resourcesPerTurn,
                    map: this.map,
                    technologies: this.technologies,
                    timestamp: new Date().toLocaleString()
                };
                
                localStorage.setItem('civilizationSave', JSON.stringify(saveData));
                this.showAchievement('游戏已保存！');
            }

            loadGame() {
                const saveData = localStorage.getItem('civilizationSave');
                if (!saveData) {
                    this.showInfo('没有找到存档', '加载失败');
                    return;
                }
                
                try {
                    const data = JSON.parse(saveData);
                    this.turn = data.turn;
                    this.resources = data.resources;
                    this.resourcesPerTurn = data.resourcesPerTurn;
                    this.map = data.map;
                    this.technologies = data.technologies;
                    
                    this.renderMap();
                    this.updateDisplay();
                    this.updateBuildingsDisplay();
                    this.updateTechDisplay();
                    
                    this.showAchievement(`游戏已加载！(${data.timestamp})`);
                } catch (error) {
                    this.showInfo('存档文件损坏', '加载失败');
                }
            }

            newGame() {
                if (confirm('确定要开始新游戏吗？当前进度将丢失。')) {
                    location.reload();
                }
            }

            showInfo(content, title = '信息') {
                document.getElementById('infoTitle').textContent = title;
                document.getElementById('infoContent').innerHTML = content.replace(/\n/g, '<br>');
                document.getElementById('infoModal').style.display = 'flex';
            }

            closeInfoModal() {
                document.getElementById('infoModal').style.display = 'none';
            }

            showAchievement(message) {
                const achievement = document.getElementById('achievement');
                achievement.textContent = message;
                achievement.style.display = 'block';
                
                setTimeout(() => {
                    achievement.style.display = 'none';
                }, 3000);
            }
        }

        // 初始化游戏
        const civilization = new CivilizationGame();