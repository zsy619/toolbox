class SimCityGame {
    constructor() {
        this.money = 50000;
        this.population = 0;
        this.happiness = 50;
        this.power = { used: 0, total: 0 };
        this.selectedBuilding = null;
        this.gameSpeed = 1;
        this.isPaused = false;
        this.cityGrid = [];
        this.buildings = this.initializeBuildings();
        
        this.initializeGrid();
        this.bindEvents();
        this.updateDisplay();
        this.startGameLoop();
    }

    initializeBuildings() {
        return {
            residential: [
                { name: '小房子', icon: '🏠', cost: 1000, population: 4, power: 1, happiness: 0 },
                { name: '公寓楼', icon: '🏢', cost: 5000, population: 20, power: 5, happiness: -2 },
                { name: '豪华别墅', icon: '🏘️', cost: 15000, population: 8, power: 3, happiness: 5 }
            ],
            commercial: [
                { name: '小商店', icon: '🏪', cost: 2000, income: 100, power: 2, happiness: 2 },
                { name: '购物中心', icon: '🏬', cost: 10000, income: 500, power: 10, happiness: 5 },
                { name: '办公大楼', icon: '🏢', cost: 20000, income: 800, power: 15, happiness: 0 }
            ],
            industrial: [
                { name: '小工厂', icon: '🏭', cost: 3000, income: 200, power: 5, happiness: -5 },
                { name: '大工厂', icon: '🏗️', cost: 15000, income: 800, power: 20, happiness: -10 },
                { name: '科技园', icon: '🏢', cost: 25000, income: 1200, power: 8, happiness: 3 }
            ],
            service: [
                { name: '医院', icon: '🏥', cost: 8000, power: 8, happiness: 15 },
                { name: '学校', icon: '🏫', cost: 6000, power: 5, happiness: 10 },
                { name: '公园', icon: '🌳', cost: 2000, power: 0, happiness: 8 },
                { name: '警察局', icon: '🚔', cost: 5000, power: 3, happiness: 12 }
            ],
            utility: [
                { name: '发电厂', icon: '⚡', cost: 10000, power: -50, happiness: -8 },
                { name: '太阳能板', icon: '☀️', cost: 15000, power: -30, happiness: 5 },
                { name: '风力发电', icon: '💨', cost: 12000, power: -25, happiness: 2 }
            ]
        };
    }

    initializeGrid() {
        const gridElement = document.getElementById('cityGrid');
        const isMobile = window.innerWidth <= 768;
        const cols = isMobile ? 15 : 20;
        const rows = isMobile ? 12 : 15;
        
        gridElement.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        gridElement.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
        
        this.cityGrid = [];
        gridElement.innerHTML = '';
        
        for (let row = 0; row < rows; row++) {
            this.cityGrid[row] = [];
            for (let col = 0; col < cols; col++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.addEventListener('click', () => this.handleCellClick(row, col));
                
                gridElement.appendChild(cell);
                this.cityGrid[row][col] = { building: null, element: cell };
            }
        }
    }

    bindEvents() {
        // 建筑分类切换
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.showBuildingCategory(btn.dataset.category);
            });
        });

        // 控制按钮
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('speedBtn').addEventListener('click', () => this.changeSpeed());
        document.getElementById('saveBtn').addEventListener('click', () => this.saveGame());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());

        // 初始显示住宅建筑
        this.showBuildingCategory('residential');
    }

    showBuildingCategory(category) {
        const buildingList = document.getElementById('buildingList');
        buildingList.innerHTML = '';
        
        this.buildings[category].forEach((building, index) => {
            const buildingItem = document.createElement('div');
            buildingItem.className = 'building-item';
            buildingItem.dataset.category = category;
            buildingItem.dataset.index = index;
            
            buildingItem.innerHTML = `
                <div class="building-name">${building.icon} ${building.name}</div>
                <div class="building-cost">💰 ${building.cost}</div>
            `;
            
            buildingItem.addEventListener('click', () => this.selectBuilding(category, index, buildingItem));
            buildingList.appendChild(buildingItem);
        });
    }

    selectBuilding(category, index, element) {
        document.querySelectorAll('.building-item').forEach(item => item.classList.remove('selected'));
        element.classList.add('selected');
        
        this.selectedBuilding = {
            category: category,
            index: index,
            data: this.buildings[category][index]
        };
    }

    handleCellClick(row, col) {
        const cell = this.cityGrid[row][col];
        
        if (cell.building) {
            this.showBuildingInfo(cell.building);
            return;
        }
        
        if (!this.selectedBuilding) {
            alert('请先选择要建造的建筑！');
            return;
        }
        
        const building = this.selectedBuilding.data;
        
        if (this.money < building.cost) {
            alert('资金不足！');
            return;
        }
        
        this.buildStructure(row, col, this.selectedBuilding);
    }

    buildStructure(row, col, buildingInfo) {
        const building = buildingInfo.data;
        const cell = this.cityGrid[row][col];
        
        // 扣除费用
        this.money -= building.cost;
        
        // 放置建筑
        cell.building = {
            ...building,
            category: buildingInfo.category,
            row: row,
            col: col
        };
        
        // 更新视觉效果
        cell.element.classList.add('occupied', buildingInfo.category);
        cell.element.textContent = building.icon;
        
        // 更新城市数据
        this.updateCityStats();
        this.updateDisplay();
    }

    updateCityStats() {
        let totalPopulation = 0;
        let totalIncome = 0;
        let totalPowerUsed = 0;
        let totalPowerGenerated = 0;
        let totalHappiness = 0;
        let buildingCount = 0;
        
        this.cityGrid.forEach(row => {
            row.forEach(cell => {
                if (cell.building) {
                    const building = cell.building;
                    buildingCount++;
                    
                    if (building.population) totalPopulation += building.population;
                    if (building.income) totalIncome += building.income;
                    if (building.power > 0) totalPowerUsed += building.power;
                    if (building.power < 0) totalPowerGenerated += Math.abs(building.power);
                    if (building.happiness) totalHappiness += building.happiness;
                }
            });
        });
        
        this.population = totalPopulation;
        this.power = { used: totalPowerUsed, total: totalPowerGenerated };
        
        // 计算满意度
        if (buildingCount > 0) {
            this.happiness = Math.max(0, Math.min(100, 50 + (totalHappiness / buildingCount) * 2));
        }
        
        // 每秒收入
        this.income = totalIncome;
    }

    updateDisplay() {
        document.getElementById('money').textContent = this.money.toLocaleString();
        document.getElementById('population').textContent = this.population.toLocaleString();
        document.getElementById('happiness').textContent = Math.round(this.happiness) + '%';
        document.getElementById('power').textContent = `${this.power.used}/${this.power.total}`;
    }

    showBuildingInfo(building) {
        const infoPanel = document.getElementById('buildingInfo');
        infoPanel.innerHTML = `
            <div style="font-size: 1.2em; margin-bottom: 10px;">
                ${building.icon} ${building.name}
            </div>
            <div>类型: ${this.getCategoryName(building.category)}</div>
            ${building.population ? `<div>人口: +${building.population}</div>` : ''}
            ${building.income ? `<div>收入: +${building.income}/秒</div>` : ''}
            <div>电力: ${building.power > 0 ? '+' : ''}${building.power}</div>
            <div>满意度: ${building.happiness > 0 ? '+' : ''}${building.happiness}</div>
        `;
    }

    getCategoryName(category) {
        const names = {
            residential: '住宅',
            commercial: '商业',
            industrial: '工业',
            service: '服务',
            utility: '公用设施'
        };
        return names[category] || category;
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        const btn = document.getElementById('pauseBtn');
        btn.textContent = this.isPaused ? '▶️ 继续' : '⏸️ 暂停';
    }

    changeSpeed() {
        this.gameSpeed = this.gameSpeed === 1 ? 2 : this.gameSpeed === 2 ? 3 : 1;
        const btn = document.getElementById('speedBtn');
        const speedText = this.gameSpeed === 1 ? '⏩ 加速' : 
                         this.gameSpeed === 2 ? '⏩⏩ 快速' : '⏩⏩⏩ 极速';
        btn.textContent = speedText;
    }

    saveGame() {
        const gameData = {
            money: this.money,
            population: this.population,
            happiness: this.happiness,
            power: this.power,
            cityGrid: this.cityGrid.map(row => 
                row.map(cell => ({
                    building: cell.building
                }))
            )
        };
        
        localStorage.setItem('simCityGame', JSON.stringify(gameData));
        alert('游戏已保存！');
    }

    resetGame() {
        if (confirm('确定要重置游戏吗？所有进度将丢失！')) {
            location.reload();
        }
    }

    startGameLoop() {
        setInterval(() => {
            if (!this.isPaused) {
                // 每秒增加收入
                if (this.income > 0) {
                    this.money += this.income * this.gameSpeed;
                }
                
                // 检查电力不足
                if (this.power.used > this.power.total) {
                    this.happiness = Math.max(0, this.happiness - 1);
                }
                
                this.updateDisplay();
            }
        }, 1000);
    }
}

// 启动游戏
document.addEventListener('DOMContentLoaded', () => {
    new SimCityGame();
});