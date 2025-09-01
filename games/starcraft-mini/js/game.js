class StarcraftGame {
            constructor() {
                this.resources = {
                    minerals: 100,
                    gas: 50,
                    supply: 12,
                    maxSupply: 200
                };
                
                this.map = [];
                this.units = [];
                this.selectedUnit = null;
                this.gameStarted = false;
                this.gamePaused = false;
                this.autoMode = false;
                this.gameTime = 0;
                this.killCount = 0;
                
                this.unitTypes = [
                    {
                        id: 'marine',
                        name: '机枪兵',
                        cost: { minerals: 50, gas: 0, supply: 1 },
                        hp: 40,
                        attack: 6,
                        speed: 1,
                        range: 4,
                        description: '基础步兵单位'
                    },
                    {
                        id: 'tank',
                        name: '坦克',
                        cost: { minerals: 150, gas: 100, supply: 2 },
                        hp: 150,
                        attack: 30,
                        speed: 0.5,
                        range: 7,
                        description: '重型装甲单位'
                    },
                    {
                        id: 'aircraft',
                        name: '战机',
                        cost: { minerals: 100, gas: 150, supply: 2 },
                        hp: 80,
                        attack: 12,
                        speed: 2,
                        range: 5,
                        description: '空中作战单位'
                    }
                ];
                
                this.gameStats = JSON.parse(localStorage.getItem('starcraftStats') || '{}');
                
                this.init();
            }

            init() {
                this.generateMap();
                this.initializeUnits();
                this.updateDisplay();
                this.updateBuildMenu();
                this.startGameLoop();
                this.addLogEntry('指挥官，欢迎来到战场！', 'build');
            }

            generateMap() {
                this.map = [];
                for (let row = 0; row < 8; row++) {
                    this.map[row] = [];
                    for (let col = 0; col < 12; col++) {
                        let cellType = 'empty';
                        
                        // 玩家基地
                        if ((row === 0 || row === 1) && (col === 0 || col === 1)) {
                            cellType = 'base';
                        }
                        // 敌人基地
                        else if ((row === 6 || row === 7) && (col === 10 || col === 11)) {
                            cellType = 'enemy-base';
                        }
                        // 资源点
                        else if (Math.random() < 0.1) {
                            cellType = 'resource';
                        }
                        
                        this.map[row][col] = {
                            type: cellType,
                            row: row,
                            col: col,
                            units: []
                        };
                    }
                }
                
                this.renderMap();
            }

            initializeUnits() {
                this.units = [];
                
                // 玩家初始单位
                this.createUnit('marine', 0, 2, 'player');
                this.createUnit('marine', 1, 2, 'player');
                this.createUnit('tank', 2, 1, 'player');
                
                // 敌人初始单位
                this.createUnit('marine', 7, 9, 'enemy');
                this.createUnit('marine', 6, 9, 'enemy');
                this.createUnit('tank', 5, 10, 'enemy');
                this.createUnit('aircraft', 4, 11, 'enemy');
            }

            createUnit(type, row, col, owner) {
                const unitConfig = this.unitTypes.find(u => u.id === type);
                if (!unitConfig) return;
                
                const unit = {
                    id: Date.now() + Math.random(),
                    type: type,
                    owner: owner,
                    row: row,
                    col: col,
                    hp: unitConfig.hp,
                    maxHp: unitConfig.hp,
                    attack: unitConfig.attack,
                    speed: unitConfig.speed,
                    range: unitConfig.range,
                    target: null,
                    lastMove: 0,
                    selected: false
                };
                
                this.units.push(unit);
                this.map[row][col].units.push(unit);
                this.renderUnit(unit);
                
                if (owner === 'player') {
                    this.addLogEntry(`${unitConfig.name} 已就位`, 'build');
                }
            }

            renderMap() {
                const grid = document.getElementById('mapGrid');
                grid.innerHTML = '';
                
                for (let row = 0; row < 8; row++) {
                    for (let col = 0; col < 12; col++) {
                        const cell = this.map[row][col];
                        const cellElement = document.createElement('div');
                        cellElement.className = `cell ${cell.type}`;
                        cellElement.dataset.row = row;
                        cellElement.dataset.col = col;
                        cellElement.onclick = () => this.selectCell(row, col);
                        
                        if (cell.type === 'resource') {
                            cellElement.textContent = '⛏️';
                        } else if (cell.type === 'base') {
                            cellElement.textContent = '🏠';
                        } else if (cell.type === 'enemy-base') {
                            cellElement.textContent = '🏭';
                        }
                        
                        grid.appendChild(cellElement);
                    }
                }
                
                this.renderMinimap();
            }

            renderUnit(unit) {
                const cell = document.querySelector(`[data-row="${unit.row}"][data-col="${unit.col}"]`);
                if (!cell) return;
                
                // 移除旧的单位元素
                const oldUnit = cell.querySelector(`.unit[data-unit-id="${unit.id}"]`);
                if (oldUnit) {
                    oldUnit.remove();
                }
                
                const unitElement = document.createElement('div');
                unitElement.className = `unit ${unit.owner} ${unit.owner}-${unit.type}`;
                unitElement.dataset.unitId = unit.id;
                unitElement.onclick = (e) => {
                    e.stopPropagation();
                    this.selectUnit(unit);
                };
                
                // 单位图标
                const unitIcons = {
                    marine: '🎖️',
                    tank: '🚗',
                    aircraft: '✈️'
                };
                unitElement.textContent = unitIcons[unit.type] || '⚪';
                
                // 血条
                const healthBar = document.createElement('div');
                healthBar.className = 'health-bar';
                const healthFill = document.createElement('div');
                healthFill.className = 'health-fill';
                healthFill.style.width = `${(unit.hp / unit.maxHp) * 100}%`;
                healthBar.appendChild(healthFill);
                unitElement.appendChild(healthBar);
                
                if (unit.selected) {
                    cell.classList.add('selected');
                }
                
                cell.appendChild(unitElement);
            }

            renderMinimap() {
                const minimapGrid = document.getElementById('minimapGrid');
                minimapGrid.innerHTML = '';
                
                for (let row = 0; row < 8; row++) {
                    for (let col = 0; col < 12; col++) {
                        const cell = this.map[row][col];
                        const minimapCell = document.createElement('div');
                        minimapCell.className = 'minimap-cell';
                        
                        if (cell.type === 'resource') {
                            minimapCell.classList.add('resource');
                        } else if (cell.units.some(u => u.owner === 'player')) {
                            minimapCell.classList.add('player');
                        } else if (cell.units.some(u => u.owner === 'enemy')) {
                            minimapCell.classList.add('enemy');
                        }
                        
                        minimapGrid.appendChild(minimapCell);
                    }
                }
            }

            selectCell(row, col) {
                if (this.selectedUnit && this.selectedUnit.owner === 'player') {
                    this.moveUnit(this.selectedUnit, row, col);
                }
            }

            selectUnit(unit) {
                // 清除之前的选择
                this.units.forEach(u => u.selected = false);
                document.querySelectorAll('.cell.selected').forEach(cell => {
                    cell.classList.remove('selected');
                });
                
                if (unit.owner === 'player') {
                    unit.selected = true;
                    this.selectedUnit = unit;
                    
                    const cell = document.querySelector(`[data-row="${unit.row}"][data-col="${unit.col}"]`);
                    cell.classList.add('selected');
                    
                    document.getElementById('attackBtn').disabled = false;
                    
                    this.addLogEntry(`已选择${this.getUnitName(unit.type)}`, 'build');
                }
            }

            moveUnit(unit, targetRow, targetCol) {
                if (!this.canMoveTo(targetRow, targetCol)) {
                    return;
                }
                
                // 从原位置移除
                const oldCell = this.map[unit.row][unit.col];
                oldCell.units = oldCell.units.filter(u => u.id !== unit.id);
                
                // 移动到新位置
                unit.row = targetRow;
                unit.col = targetCol;
                this.map[targetRow][targetCol].units.push(unit);
                
                this.renderMap();
                this.renderAllUnits();
                
                this.addLogEntry(`${this.getUnitName(unit.type)} 移动到 (${targetRow}, ${targetCol})`, 'build');
            }

            canMoveTo(row, col) {
                if (row < 0 || row >= 8 || col < 0 || col >= 12) {
                    return false;
                }
                
                const cell = this.map[row][col];
                return cell.units.length === 0 || cell.type !== 'enemy-base';
            }

            buildUnit(unitType) {
                const unitConfig = this.unitTypes.find(u => u.id === unitType);
                if (!unitConfig) return;
                
                // 检查资源
                if (!this.canAfford(unitConfig.cost)) {
                    this.addLogEntry('资源不足', 'combat');
                    return;
                }
                
                // 检查人口
                if (this.resources.supply + unitConfig.cost.supply > this.resources.maxSupply) {
                    this.addLogEntry('人口不足', 'combat');
                    return;
                }
                
                // 寻找基地附近的空位置
                const spawnPoints = [];
                for (let row = 0; row < 3; row++) {
                    for (let col = 0; col < 3; col++) {
                        if (this.canMoveTo(row, col)) {
                            spawnPoints.push({ row, col });
                        }
                    }
                }
                
                if (spawnPoints.length === 0) {
                    this.addLogEntry('没有空闲位置建造单位', 'combat');
                    return;
                }
                
                const spawnPoint = spawnPoints[Math.floor(Math.random() * spawnPoints.length)];
                
                // 扣除资源
                this.resources.minerals -= unitConfig.cost.minerals;
                this.resources.gas -= unitConfig.cost.gas;
                this.resources.supply += unitConfig.cost.supply;
                
                // 创建单位
                this.createUnit(unitType, spawnPoint.row, spawnPoint.col, 'player');
                
                this.updateDisplay();
                this.updateBuildMenu();
            }

            attackMove() {
                if (!this.selectedUnit || this.selectedUnit.owner !== 'player') {
                    return;
                }
                
                const enemyUnits = this.units.filter(u => u.owner === 'enemy');
                if (enemyUnits.length === 0) {
                    this.addLogEntry('没有发现敌军', 'combat');
                    return;
                }
                
                // 寻找最近的敌人
                let nearestEnemy = null;
                let minDistance = Infinity;
                
                enemyUnits.forEach(enemy => {
                    const distance = Math.abs(this.selectedUnit.row - enemy.row) + 
                                   Math.abs(this.selectedUnit.col - enemy.col);
                    if (distance < minDistance) {
                        minDistance = distance;
                        nearestEnemy = enemy;
                    }
                });
                
                if (nearestEnemy) {
                    this.selectedUnit.target = nearestEnemy;
                    this.addLogEntry(`${this.getUnitName(this.selectedUnit.type)} 攻击 ${this.getUnitName(nearestEnemy.type)}`, 'combat');
                }
            }

            performCombat() {
                this.units.forEach(unit => {
                    if (!unit.target || unit.target.hp <= 0) {
                        // 寻找新目标
                        const enemies = this.units.filter(u => 
                            u.owner !== unit.owner && 
                            u.hp > 0 &&
                            this.getDistance(unit, u) <= unit.range
                        );
                        
                        if (enemies.length > 0) {
                            unit.target = enemies[Math.floor(Math.random() * enemies.length)];
                        }
                    }
                    
                    if (unit.target && unit.target.hp > 0) {
                        const distance = this.getDistance(unit, unit.target);
                        
                        if (distance <= unit.range) {
                            // 攻击
                            unit.target.hp -= unit.attack;
                            
                            if (unit.target.hp <= 0) {
                                this.killUnit(unit.target);
                                if (unit.owner === 'player') {
                                    this.killCount++;
                                }
                                unit.target = null;
                            }
                        } else {
                            // 移动到目标附近
                            this.moveUnitTowards(unit, unit.target);
                        }
                    }
                });
            }

            moveUnitTowards(unit, target) {
                const currentTime = Date.now();
                if (currentTime - unit.lastMove < 1000 / unit.speed) {
                    return; // 还未到移动时间
                }
                
                const deltaRow = target.row - unit.row;
                const deltaCol = target.col - unit.col;
                
                let newRow = unit.row;
                let newCol = unit.col;
                
                if (Math.abs(deltaRow) > Math.abs(deltaCol)) {
                    newRow += deltaRow > 0 ? 1 : -1;
                } else {
                    newCol += deltaCol > 0 ? 1 : -1;
                }
                
                if (this.canMoveTo(newRow, newCol)) {
                    this.map[unit.row][unit.col].units = this.map[unit.row][unit.col].units.filter(u => u.id !== unit.id);
                    unit.row = newRow;
                    unit.col = newCol;
                    this.map[newRow][newCol].units.push(unit);
                    unit.lastMove = currentTime;
                }
            }

            killUnit(unit) {
                // 从地图移除
                this.map[unit.row][unit.col].units = this.map[unit.row][unit.col].units.filter(u => u.id !== unit.id);
                
                // 从单位列表移除
                this.units = this.units.filter(u => u.id !== unit.id);
                
                const unitName = this.getUnitName(unit.type);
                if (unit.owner === 'player') {
                    this.addLogEntry(`我军 ${unitName} 阵亡`, 'combat');
                } else {
                    this.addLogEntry(`击毁敌军 ${unitName}`, 'combat');
                }
                
                this.renderAllUnits();
            }

            getDistance(unit1, unit2) {
                return Math.abs(unit1.row - unit2.row) + Math.abs(unit1.col - unit2.col);
            }

            renderAllUnits() {
                // 清除所有单位元素
                document.querySelectorAll('.unit').forEach(unit => unit.remove());
                
                // 重新渲染所有单位
                this.units.forEach(unit => {
                    this.renderUnit(unit);
                });
                
                this.renderMinimap();
            }

            gatherResources() {
                // 寻找资源点附近的单位
                let resourceGathered = false;
                
                for (let row = 0; row < 8; row++) {
                    for (let col = 0; col < 12; col++) {
                        const cell = this.map[row][col];
                        if (cell.type === 'resource' && cell.units.some(u => u.owner === 'player')) {
                            this.resources.minerals += 25;
                            this.resources.gas += 10;
                            resourceGathered = true;
                        }
                    }
                }
                
                if (resourceGathered) {
                    this.addLogEntry('采集资源成功', 'resource');
                } else {
                    this.addLogEntry('没有单位在资源点附近', 'resource');
                }
                
                this.updateDisplay();
            }

            defendBase() {
                const playerUnits = this.units.filter(u => u.owner === 'player');
                playerUnits.forEach(unit => {
                    if (unit.row > 3 || unit.col > 3) {
                        unit.target = null;
                        // 移动回基地附近
                        this.moveUnit(unit, Math.min(unit.row, 2), Math.min(unit.col, 2));
                    }
                });
                
                this.addLogEntry('部队回防基地', 'build');
            }

            scoutEnemy() {
                const scouts = this.units.filter(u => u.owner === 'player' && u.type === 'aircraft');
                if (scouts.length > 0) {
                    const scout = scouts[0];
                    this.moveUnit(scout, 6, 10); // 移动到敌人基地附近
                    this.addLogEntry('派遣侦察机前往敌方基地', 'build');
                } else {
                    this.addLogEntry('没有可用的侦察单位', 'combat');
                }
            }

            upgradeUnits() {
                if (this.resources.minerals >= 100 && this.resources.gas >= 100) {
                    this.resources.minerals -= 100;
                    this.resources.gas -= 100;
                    
                    // 升级所有玩家单位
                    this.units.filter(u => u.owner === 'player').forEach(unit => {
                        unit.attack += 2;
                        unit.maxHp += 10;
                        unit.hp += 10;
                    });
                    
                    this.addLogEntry('单位升级完成', 'build');
                    this.updateDisplay();
                } else {
                    this.addLogEntry('升级资源不足', 'combat');
                }
            }

            canAfford(cost) {
                return this.resources.minerals >= cost.minerals && 
                       this.resources.gas >= cost.gas;
            }

            getUnitName(type) {
                const unitConfig = this.unitTypes.find(u => u.id === type);
                return unitConfig ? unitConfig.name : type;
            }

            updateDisplay() {
                document.getElementById('minerals').textContent = this.resources.minerals;
                document.getElementById('gas').textContent = this.resources.gas;
                document.getElementById('supply').textContent = `${this.resources.supply}/${this.resources.maxSupply}`;
                document.getElementById('armySize').textContent = this.units.filter(u => u.owner === 'player').length;
                document.getElementById('baseCount').textContent = 1;
                document.getElementById('killCount').textContent = this.killCount;
                
                document.getElementById('mineralsDisplay').textContent = this.resources.minerals;
                document.getElementById('gasDisplay').textContent = this.resources.gas;
                document.getElementById('supplyDisplay').textContent = `${this.resources.supply}/${this.resources.maxSupply}`;
            }

            updateBuildMenu() {
                const container = document.getElementById('buildMenu');
                container.innerHTML = '';
                
                this.unitTypes.forEach(unitType => {
                    const buildItem = document.createElement('div');
                    const canAfford = this.canAfford(unitType.cost);
                    buildItem.className = `build-item ${canAfford ? 'affordable' : 'expensive'}`;
                    buildItem.onclick = () => this.buildUnit(unitType.id);
                    
                    buildItem.innerHTML = `
                        <div class="unit-name">${unitType.name}</div>
                        <div class="unit-cost">矿物:${unitType.cost.minerals} 气体:${unitType.cost.gas}</div>
                        <div class="unit-stats">血量:${unitType.hp} 攻击:${unitType.attack}</div>
                    `;
                    
                    container.appendChild(buildItem);
                });
            }

            startGameLoop() {
                this.gameStarted = true;
                
                setInterval(() => {
                    if (!this.gamePaused && this.gameStarted) {
                        this.gameTime++;
                        
                        // 执行战斗
                        this.performCombat();
                        
                        // AI行为
                        this.performAI();
                        
                        // 渲染更新
                        this.renderAllUnits();
                        
                        // 检查胜负
                        this.checkVictoryCondition();
                        
                        // 自动模式
                        if (this.autoMode) {
                            this.performAutoActions();
                        }
                    }
                }, 1000);
                
                // 资源增长
                setInterval(() => {
                    if (!this.gamePaused && this.gameStarted) {
                        this.resources.minerals += 5;
                        this.resources.gas += 2;
                        this.updateDisplay();
                    }
                }, 3000);
            }

            performAI() {
                // 简单的敌人AI
                const enemyUnits = this.units.filter(u => u.owner === 'enemy');
                const playerUnits = this.units.filter(u => u.owner === 'player');
                
                if (enemyUnits.length === 0 || playerUnits.length === 0) {
                    return;
                }
                
                // 随机产生新的敌军单位
                if (Math.random() < 0.05 && enemyUnits.length < 8) {
                    const unitTypes = ['marine', 'tank', 'aircraft'];
                    const randomType = unitTypes[Math.floor(Math.random() * unitTypes.length)];
                    
                    const spawnPoints = [
                        { row: 6, col: 8 },
                        { row: 7, col: 8 },
                        { row: 5, col: 9 }
                    ];
                    
                    const availableSpawns = spawnPoints.filter(point => 
                        this.canMoveTo(point.row, point.col)
                    );
                    
                    if (availableSpawns.length > 0) {
                        const spawn = availableSpawns[Math.floor(Math.random() * availableSpawns.length)];
                        this.createUnit(randomType, spawn.row, spawn.col, 'enemy');
                    }
                }
            }

            performAutoActions() {
                // 自动建造单位
                if (Math.random() < 0.3) {
                    const buildableUnits = this.unitTypes.filter(unit => 
                        this.canAfford(unit.cost) && 
                        this.resources.supply + unit.cost.supply <= this.resources.maxSupply
                    );
                    
                    if (buildableUnits.length > 0) {
                        const randomUnit = buildableUnits[Math.floor(Math.random() * buildableUnits.length)];
                        this.buildUnit(randomUnit.id);
                    }
                }
                
                // 自动采集资源
                if (Math.random() < 0.2) {
                    this.gatherResources();
                }
                
                // 自动攻击
                if (Math.random() < 0.4) {
                    const playerUnits = this.units.filter(u => u.owner === 'player');
                    if (playerUnits.length > 0) {
                        const randomUnit = playerUnits[Math.floor(Math.random() * playerUnits.length)];
                        this.selectedUnit = randomUnit;
                        this.attackMove();
                    }
                }
            }

            checkVictoryCondition() {
                const playerUnits = this.units.filter(u => u.owner === 'player').length;
                const enemyUnits = this.units.filter(u => u.owner === 'enemy').length;
                
                if (playerUnits === 0) {
                    this.endGame('defeat', '任务失败！我军全军覆没！');
                } else if (enemyUnits === 0) {
                    this.endGame('victory', '任务完成！成功击败所有敌军！');
                }
            }

            endGame(result, message) {
                this.gameStarted = false;
                
                // 更新统计
                if (!this.gameStats[result]) {
                    this.gameStats[result] = 0;
                }
                this.gameStats[result]++;
                localStorage.setItem('starcraftStats', JSON.stringify(this.gameStats));
                
                document.getElementById('victoryTitle').textContent = result === 'victory' ? '🎉 胜利 🎉' : '💀 失败 💀';
                document.getElementById('victoryText').textContent = message;
                document.getElementById('finalKills').textContent = this.killCount;
                document.getElementById('finalUnits').textContent = this.units.filter(u => u.owner === 'player').length;
                document.getElementById('battleTime').textContent = this.gameTime;
                document.getElementById('victoryModal').style.display = 'flex';
                
                this.addLogEntry(message, 'combat');
            }

            closeVictoryModal() {
                document.getElementById('victoryModal').style.display = 'none';
                this.newGame();
            }

            togglePause() {
                this.gamePaused = !this.gamePaused;
                const btn = document.getElementById('pauseBtn');
                btn.textContent = this.gamePaused ? '继续' : '暂停';
                
                this.addLogEntry(this.gamePaused ? '游戏暂停' : '游戏继续', 'build');
            }

            toggleAuto() {
                this.autoMode = !this.autoMode;
                const btn = document.getElementById('autoBtn');
                btn.textContent = this.autoMode ? '手动模式' : '自动模式';
                btn.style.background = this.autoMode ? '#ff4500' : '#00d4ff';
                
                this.addLogEntry(this.autoMode ? '启用自动模式' : '切换到手动模式', 'build');
            }

            newGame() {
                location.reload();
            }

            showRules() {
                alert(`星际争霸游戏规则：

游戏目标：
• 消灭所有敌军单位获得胜利
• 保护己方单位避免全军覆没

资源管理：
• 矿物：建造基础单位的主要资源
• 气体：建造高级单位的稀有资源
• 人口：限制同时存在的单位数量

单位类型：
• 机枪兵：基础步兵，成本低，攻击力中等
• 坦克：重型单位，攻击力强，移动慢
• 战机：空中单位，移动快，攻击力中等

操作方法：
• 点击单位选择，点击地面移动
• 选择单位后点击"攻击移动"进行攻击
• 使用各种动作按钮管理部队
• 可以开启自动模式让AI代为操作

战略提示：
• 合理搭配不同类型的单位
• 控制好资源的使用和积累
• 利用地形和单位特性进行战斗`);
            }

            addLogEntry(message, type = 'normal') {
                const logContainer = document.getElementById('gameLog');
                const logEntry = document.createElement('div');
                logEntry.className = `log-entry ${type}`;
                logEntry.textContent = `${new Date().toLocaleTimeString()}: ${message}`;
                
                logContainer.appendChild(logEntry);
                logContainer.scrollTop = logContainer.scrollHeight;
                
                // 限制日志条目数量
                while (logContainer.children.length > 30) {
                    logContainer.removeChild(logContainer.firstChild);
                }
            }
        }

        // 初始化游戏
        const starcraft = new StarcraftGame();