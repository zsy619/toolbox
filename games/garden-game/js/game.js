class GardenGame {
    constructor() {
        this.player = {
            money: 100,
            level: 1,
            exp: 0,
            expToNext: 100
        };
        
        this.garden = [];
        this.inventory = {};
        this.selectedSeed = null;
        this.selectedTool = null;
        
        this.seeds = {
            carrot: { name: '胡萝卜', icon: '🥕', price: 10, growTime: 30, value: 20, stages: ['🌱', '🌿', '🥕'] },
            tomato: { name: '番茄', icon: '🍅', price: 15, growTime: 45, value: 30, stages: ['🌱', '🌿', '🍅'] },
            corn: { name: '玉米', icon: '🌽', price: 20, growTime: 60, value: 40, stages: ['🌱', '🌿', '🌽'] },
            sunflower: { name: '向日葵', icon: '🌻', price: 25, growTime: 90, value: 60, stages: ['🌱', '🌿', '🌻'] },
            pumpkin: { name: '南瓜', icon: '🎃', price: 30, growTime: 120, value: 80, stages: ['🌱', '🌿', '🎃'] },
            strawberry: { name: '草莓', icon: '🍓', price: 35, growTime: 75, value: 70, stages: ['🌱', '🌿', '🍓'] }
        };
        
        this.weather = {
            current: 'sunny',
            types: {
                sunny: { icon: '☀️', name: '晴天', growthBonus: 1.0 },
                rainy: { icon: '🌧️', name: '雨天', growthBonus: 1.5 },
                cloudy: { icon: '☁️', name: '阴天', growthBonus: 0.8 },
                stormy: { icon: '⛈️', name: '暴风雨', growthBonus: 0.5 }
            }
        };
        
        this.initializeGame();
        this.bindEvents();
        this.startGameLoop();
    }
    
    initializeGame() {
        this.createGarden();
        this.createSeedShop();
        this.createInventory();
        this.updateDisplay();
        this.changeWeather();
    }
    
    createGarden() {
        const gardenGrid = document.getElementById('gardenGrid');
        gardenGrid.innerHTML = '';
        
        for (let i = 0; i < 48; i++) {
            const plot = document.createElement('div');
            plot.className = 'garden-plot';
            plot.dataset.index = i;
            gardenGrid.appendChild(plot);
            
            this.garden[i] = {
                planted: false,
                seedType: null,
                plantTime: 0,
                growthStage: 0,
                watered: false,
                fertilized: false,
                ready: false
            };
        }
    }
    
    createSeedShop() {
        const seedList = document.getElementById('seedList');
        seedList.innerHTML = '';
        
        Object.keys(this.seeds).forEach(seedKey => {
            const seed = this.seeds[seedKey];
            const seedItem = document.createElement('div');
            seedItem.className = 'seed-item';
            seedItem.dataset.seed = seedKey;
            
            seedItem.innerHTML = `
                <div class="seed-info">
                    <div class="seed-icon">${seed.icon}</div>
                    <div class="seed-details">
                        <div class="seed-name">${seed.name}</div>
                        <div class="seed-time">${seed.growTime}秒成熟</div>
                    </div>
                </div>
                <div class="seed-price">${seed.price}💰</div>
            `;
            
            seedList.appendChild(seedItem);
        });
    }
    
    createInventory() {
        const inventoryGrid = document.getElementById('inventoryGrid');
        inventoryGrid.innerHTML = '';
        
        for (let i = 0; i < 16; i++) {
            const item = document.createElement('div');
            item.className = 'inventory-item empty';
            item.dataset.slot = i;
            inventoryGrid.appendChild(item);
        }
    }
    
    bindEvents() {
        // 花园点击事件
        document.getElementById('gardenGrid').addEventListener('click', (e) => {
            if (e.target.classList.contains('garden-plot')) {
                this.handlePlotClick(parseInt(e.target.dataset.index));
            }
        });
        
        // 种子选择事件
        document.getElementById('seedList').addEventListener('click', (e) => {
            const seedItem = e.target.closest('.seed-item');
            if (seedItem) {
                this.selectSeed(seedItem.dataset.seed);
            }
        });
        
        // 工具选择事件
        document.getElementById('waterBtn').addEventListener('click', () => this.selectTool('water'));
        document.getElementById('fertilizeBtn').addEventListener('click', () => this.selectTool('fertilize'));
        document.getElementById('harvestBtn').addEventListener('click', () => this.selectTool('harvest'));
        document.getElementById('clearBtn').addEventListener('click', () => this.selectTool('clear'));
    }
    
    selectSeed(seedType) {
        // 清除之前的选择
        document.querySelectorAll('.seed-item').forEach(item => {
            item.classList.remove('selected');
        });
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // 选择新种子
        document.querySelector(`[data-seed="${seedType}"]`).classList.add('selected');
        this.selectedSeed = seedType;
        this.selectedTool = null;
    }
    
    selectTool(toolType) {
        // 清除之前的选择
        document.querySelectorAll('.seed-item').forEach(item => {
            item.classList.remove('selected');
        });
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // 选择新工具
        document.getElementById(toolType + 'Btn').classList.add('active');
        this.selectedTool = toolType;
        this.selectedSeed = null;
    }
    
    handlePlotClick(plotIndex) {
        const plot = this.garden[plotIndex];
        const plotElement = document.querySelector(`[data-index="${plotIndex}"]`);
        
        if (this.selectedSeed) {
            this.plantSeed(plotIndex);
        } else if (this.selectedTool) {
            this.useTool(plotIndex);
        }
    }
    
    plantSeed(plotIndex) {
        const plot = this.garden[plotIndex];
        const seed = this.seeds[this.selectedSeed];
        
        if (!plot.planted && this.player.money >= seed.price) {
            this.player.money -= seed.price;
            plot.planted = true;
            plot.seedType = this.selectedSeed;
            plot.plantTime = Date.now();
            plot.growthStage = 0;
            plot.watered = false;
            plot.fertilized = false;
            plot.ready = false;
            
            this.updatePlotDisplay(plotIndex);
            this.updateDisplay();
            this.gainExp(2);
        } else if (plot.planted) {
            alert('这里已经种了植物！');
        } else {
            alert('金币不足！');
        }
    }
    
    useTool(plotIndex) {
        const plot = this.garden[plotIndex];
        
        switch (this.selectedTool) {
            case 'water':
                if (plot.planted && !plot.watered) {
                    plot.watered = true;
                    this.updatePlotDisplay(plotIndex);
                    this.gainExp(1);
                }
                break;
                
            case 'fertilize':
                if (plot.planted && !plot.fertilized && this.player.money >= 5) {
                    this.player.money -= 5;
                    plot.fertilized = true;
                    this.updatePlotDisplay(plotIndex);
                    this.updateDisplay();
                    this.gainExp(1);
                } else if (!plot.planted) {
                    alert('这里没有植物可以施肥！');
                } else if (plot.fertilized) {
                    alert('已经施过肥了！');
                } else {
                    alert('金币不足！需要5金币');
                }
                break;
                
            case 'harvest':
                if (plot.ready) {
                    this.harvestPlant(plotIndex);
                } else if (plot.planted) {
                    alert('植物还没有成熟！');
                } else {
                    alert('这里没有植物可以收获！');
                }
                break;
                
            case 'clear':
                if (plot.planted) {
                    plot.planted = false;
                    plot.seedType = null;
                    plot.plantTime = 0;
                    plot.growthStage = 0;
                    plot.watered = false;
                    plot.fertilized = false;
                    plot.ready = false;
                    this.updatePlotDisplay(plotIndex);
                }
                break;
        }
    }
    
    harvestPlant(plotIndex) {
        const plot = this.garden[plotIndex];
        const seed = this.seeds[plot.seedType];
        
        let value = seed.value;
        if (plot.watered) value *= 1.2;
        if (plot.fertilized) value *= 1.5;
        
        this.player.money += Math.floor(value);
        this.addToInventory(plot.seedType, 1);
        this.gainExp(5);
        
        // 重置地块
        plot.planted = false;
        plot.seedType = null;
        plot.plantTime = 0;
        plot.growthStage = 0;
        plot.watered = false;
        plot.fertilized = false;
        plot.ready = false;
        
        this.updatePlotDisplay(plotIndex);
        this.updateDisplay();
    }
    
    addToInventory(itemType, count) {
        if (this.inventory[itemType]) {
            this.inventory[itemType] += count;
        } else {
            this.inventory[itemType] = count;
        }
        this.updateInventoryDisplay();
    }
    
    updatePlotDisplay(plotIndex) {
        const plot = this.garden[plotIndex];
        const plotElement = document.querySelector(`[data-index="${plotIndex}"]`);
        
        plotElement.className = 'garden-plot';
        plotElement.innerHTML = '';
        
        if (plot.planted) {
            const seed = this.seeds[plot.seedType];
            
            if (plot.ready) {
                plotElement.classList.add('ready');
                plotElement.innerHTML = seed.icon;
            } else {
                plotElement.classList.add('planted');
                if (plot.watered) plotElement.classList.add('watered');
                if (plot.fertilized) plotElement.classList.add('fertilized');
                
                const stageIcon = seed.stages[plot.growthStage] || seed.stages[0];
                plotElement.innerHTML = stageIcon;
                
                if (plot.growthStage < seed.stages.length - 1) {
                    const stageElement = document.createElement('div');
                    stageElement.className = 'growth-stage';
                    stageElement.textContent = plot.growthStage + 1;
                    plotElement.appendChild(stageElement);
                }
            }
        }
    }
    
    updateInventoryDisplay() {
        const inventoryItems = document.querySelectorAll('.inventory-item');
        let slotIndex = 0;
        
        // 清空所有槽位
        inventoryItems.forEach(item => {
            item.className = 'inventory-item empty';
            item.innerHTML = '';
        });
        
        // 填充物品
        Object.keys(this.inventory).forEach(itemType => {
            if (slotIndex < inventoryItems.length && this.inventory[itemType] > 0) {
                const item = inventoryItems[slotIndex];
                const seed = this.seeds[itemType];
                
                item.className = 'inventory-item';
                item.innerHTML = `
                    <div class="item-icon">${seed.icon}</div>
                    <div class="item-count">${this.inventory[itemType]}</div>
                `;
                slotIndex++;
            }
        });
    }
    
    gainExp(amount) {
        this.player.exp += amount;
        if (this.player.exp >= this.player.expToNext) {
            this.levelUp();
        }
    }
    
    levelUp() {
        this.player.level++;
        this.player.exp = 0;
        this.player.expToNext = this.player.level * 100;
        this.player.money += 50;
        alert(`恭喜升级！现在是${this.player.level}级！获得50金币奖励！`);
    }
    
    changeWeather() {
        const weatherTypes = Object.keys(this.weather.types);
        this.weather.current = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
        
        const currentWeather = this.weather.types[this.weather.current];
        document.getElementById('weatherIcon').textContent = currentWeather.icon;
        document.getElementById('weatherDesc').textContent = currentWeather.name;
        
        // 5-10分钟后改变天气
        setTimeout(() => this.changeWeather(), (5 + Math.random() * 5) * 60 * 1000);
    }
    
    updateDisplay() {
        document.getElementById('money').textContent = Math.floor(this.player.money);
        document.getElementById('level').textContent = this.player.level;
        document.getElementById('exp').textContent = `${this.player.exp}/${this.player.expToNext}`;
        
        const plantsCount = this.garden.filter(plot => plot.planted).length;
        document.getElementById('plantsCount').textContent = plantsCount;
    }
    
    startGameLoop() {
        setInterval(() => {
            const now = Date.now();
            const weatherBonus = this.weather.types[this.weather.current].growthBonus;
            
            this.garden.forEach((plot, index) => {
                if (plot.planted && !plot.ready) {
                    const seed = this.seeds[plot.seedType];
                    const timeElapsed = (now - plot.plantTime) / 1000;
                    
                    let growthTime = seed.growTime;
                    if (plot.watered) growthTime *= 0.8;
                    if (plot.fertilized) growthTime *= 0.7;
                    growthTime *= (2 - weatherBonus); // 天气影响
                    
                    const progress = timeElapsed / growthTime;
                    const newStage = Math.min(Math.floor(progress * seed.stages.length), seed.stages.length - 1);
                    
                    if (newStage !== plot.growthStage) {
                        plot.growthStage = newStage;
                        this.updatePlotDisplay(index);
                    }
                    
                    if (progress >= 1) {
                        plot.ready = true;
                        this.updatePlotDisplay(index);
                    }
                }
            });
            
            // 自动获得少量金币
            if (Math.random() < 0.1) {
                this.player.money += 1;
                this.updateDisplay();
            }
        }, 1000);
    }
}

// 启动游戏
document.addEventListener('DOMContentLoaded', () => {
    new GardenGame();
});