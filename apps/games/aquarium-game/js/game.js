class AquariumGame {
    constructor() {
        this.player = {
            money: 500,
            level: 1,
            exp: 0
        };
        
        this.aquarium = {
            temperature: 25,
            waterQuality: 100,
            phValue: 7.0,
            oxygenLevel: 95,
            lightLevel: 'medium',
            cleanliness: 90
        };
        
        this.fish = [];
        this.decorations = [];
        this.bubbleInterval = null;
        
        this.fishTypes = {
            goldfish: { name: '金鱼', icon: '🐠', price: 50, health: 100, happiness: 80, tempRange: [20, 28] },
            clownfish: { name: '小丑鱼', icon: '🐡', price: 80, health: 100, happiness: 90, tempRange: [24, 30] },
            angelfish: { name: '神仙鱼', icon: '🐟', price: 120, health: 100, happiness: 85, tempRange: [22, 26] },
            betta: { name: '斗鱼', icon: '🐠', price: 60, health: 100, happiness: 75, tempRange: [24, 28] },
            neon: { name: '霓虹鱼', icon: '🐟', price: 40, health: 100, happiness: 95, tempRange: [22, 26] },
            shark: { name: '小鲨鱼', icon: '🦈', price: 200, health: 100, happiness: 70, tempRange: [25, 30] }
        };
        
        this.decorationTypes = {
            coral: { name: '珊瑚', icon: '🪸', price: 30, effect: 'beauty' },
            seaweed: { name: '海草', icon: '🌿', price: 20, effect: 'oxygen' },
            castle: { name: '城堡', icon: '🏰', price: 80, effect: 'hiding' },
            treasure: { name: '宝箱', icon: '💰', price: 60, effect: 'money' },
            rock: { name: '岩石', icon: '🪨', price: 25, effect: 'ph' },
            shell: { name: '贝壳', icon: '🐚', price: 15, effect: 'decoration' }
        };
        
        this.initializeGame();
        this.bindEvents();
        this.startGameLoop();
    }
    
    initializeGame() {
        this.createShops();
        this.updateDisplay();
        this.startBubbles();
        
        // 添加初始装饰
        this.addDecoration('seaweed', 20, 80);
        this.addDecoration('rock', 70, 85);
    }
    
    createShops() {
        this.createFishShop();
        this.createDecorationShop();
    }
    
    createFishShop() {
        const fishList = document.getElementById('fishList');
        fishList.innerHTML = '';
        
        Object.keys(this.fishTypes).forEach(fishKey => {
            const fish = this.fishTypes[fishKey];
            const fishItem = document.createElement('div');
            fishItem.className = 'shop-item';
            fishItem.dataset.fish = fishKey;
            
            fishItem.innerHTML = `
                <div class="item-info">
                    <div class="item-icon">${fish.icon}</div>
                    <div class="item-details">
                        <div class="item-name">${fish.name}</div>
                        <div class="item-description">适温: ${fish.tempRange[0]}-${fish.tempRange[1]}°C</div>
                    </div>
                </div>
                <div class="item-price">${fish.price}💰</div>
            `;
            
            fishList.appendChild(fishItem);
        });
    }
    
    createDecorationShop() {
        const decorationList = document.getElementById('decorationList');
        decorationList.innerHTML = '';
        
        Object.keys(this.decorationTypes).forEach(decorationKey => {
            const decoration = this.decorationTypes[decorationKey];
            const decorationItem = document.createElement('div');
            decorationItem.className = 'shop-item';
            decorationItem.dataset.decoration = decorationKey;
            
            decorationItem.innerHTML = `
                <div class="item-info">
                    <div class="item-icon">${decoration.icon}</div>
                    <div class="item-details">
                        <div class="item-name">${decoration.name}</div>
                        <div class="item-description">效果: ${this.getEffectDescription(decoration.effect)}</div>
                    </div>
                </div>
                <div class="item-price">${decoration.price}💰</div>
            `;
            
            decorationList.appendChild(decorationItem);
        });
    }
    
    getEffectDescription(effect) {
        const effects = {
            beauty: '美化环境',
            oxygen: '增加氧气',
            hiding: '提供躲藏',
            money: '增加收入',
            ph: '调节pH值',
            decoration: '装饰作用'
        };
        return effects[effect] || '未知效果';
    }
    
    bindEvents() {
        // 鱼缸控制按钮
        document.getElementById('feedBtn').addEventListener('click', () => this.feedFish());
        document.getElementById('cleanBtn').addEventListener('click', () => this.cleanAquarium());
        document.getElementById('heaterBtn').addEventListener('click', () => this.adjustTemperature(2));
        document.getElementById('coolerBtn').addEventListener('click', () => this.adjustTemperature(-2));
        
        // 商店点击事件
        document.getElementById('fishList').addEventListener('click', (e) => {
            const fishItem = e.target.closest('.shop-item');
            if (fishItem) {
                this.buyFish(fishItem.dataset.fish);
            }
        });
        
        document.getElementById('decorationList').addEventListener('click', (e) => {
            const decorationItem = e.target.closest('.shop-item');
            if (decorationItem) {
                this.buyDecoration(decorationItem.dataset.decoration);
            }
        });
        
        // 鱼缸点击事件（用于放置装饰）
        document.getElementById('aquarium').addEventListener('click', (e) => {
            if (this.selectedDecoration) {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                this.placeDecoration(this.selectedDecoration, x, y);
                this.selectedDecoration = null;
            }
        });
    }
    
    buyFish(fishType) {
        const fishData = this.fishTypes[fishType];
        
        if (this.player.money >= fishData.price && this.fish.length < 10) {
            this.player.money -= fishData.price;
            
            const newFish = {
                id: Date.now(),
                type: fishType,
                ...fishData,
                x: Math.random() * 80 + 10,
                y: Math.random() * 60 + 20,
                direction: Math.random() > 0.5 ? 'left' : 'right',
                speed: Math.random() * 2 + 1,
                hunger: 100,
                lastFed: Date.now()
            };
            
            this.fish.push(newFish);
            this.addFishToAquarium(newFish);
            this.updateDisplay();
            this.updateFishGrid();
        } else if (this.fish.length >= 10) {
            alert('鱼缸已满！最多只能养10条鱼');
        } else {
            alert('金币不足！');
        }
    }
    
    buyDecoration(decorationType) {
        const decorationData = this.decorationTypes[decorationType];
        
        if (this.player.money >= decorationData.price) {
            this.player.money -= decorationData.price;
            this.selectedDecoration = decorationType;
            alert('请点击鱼缸中的位置来放置装饰');
            this.updateDisplay();
        } else {
            alert('金币不足！');
        }
    }
    
    placeDecoration(decorationType, x, y) {
        const decorationData = this.decorationTypes[decorationType];
        
        const newDecoration = {
            id: Date.now(),
            type: decorationType,
            ...decorationData,
            x: x,
            y: y
        };
        
        this.decorations.push(newDecoration);
        this.addDecorationToAquarium(newDecoration);
        this.applyDecorationEffect(newDecoration);
    }
    
    addDecoration(decorationType, x, y) {
        const decorationData = this.decorationTypes[decorationType];
        
        const newDecoration = {
            id: Date.now(),
            type: decorationType,
            ...decorationData,
            x: x,
            y: y
        };
        
        this.decorations.push(newDecoration);
        this.addDecorationToAquarium(newDecoration);
        this.applyDecorationEffect(newDecoration);
    }
    
    addFishToAquarium(fish) {
        const fishContainer = document.getElementById('fishContainer');
        const fishElement = document.createElement('div');
        fishElement.className = `fish swimming-${fish.direction}`;
        fishElement.dataset.fishId = fish.id;
        fishElement.textContent = fish.icon;
        fishElement.style.left = fish.x + '%';
        fishElement.style.top = fish.y + '%';
        
        fishContainer.appendChild(fishElement);
        
        // 添加点击事件显示鱼的信息
        fishElement.addEventListener('click', () => {
            this.showFishInfo(fish);
        });
    }
    
    addDecorationToAquarium(decoration) {
        const decorationsContainer = document.getElementById('decorationsContainer');
        const decorationElement = document.createElement('div');
        decorationElement.className = 'decoration';
        decorationElement.dataset.decorationId = decoration.id;
        decorationElement.textContent = decoration.icon;
        decorationElement.style.left = decoration.x + '%';
        decorationElement.style.bottom = (100 - decoration.y) + '%';
        
        decorationsContainer.appendChild(decorationElement);
    }
    
    applyDecorationEffect(decoration) {
        switch (decoration.effect) {
            case 'oxygen':
                this.aquarium.oxygenLevel = Math.min(100, this.aquarium.oxygenLevel + 5);
                break;
            case 'ph':
                this.aquarium.phValue = Math.max(6.5, Math.min(7.5, this.aquarium.phValue + 0.1));
                break;
            case 'beauty':
                this.fish.forEach(fish => {
                    fish.happiness = Math.min(100, fish.happiness + 5);
                });
                break;
        }
    }
    
    feedFish() {
        if (this.player.money >= 10) {
            this.player.money -= 10;
            
            // 在鱼缸中显示食物颗粒
            this.showFoodParticles();
            
            // 喂食所有鱼
            this.fish.forEach(fish => {
                fish.hunger = Math.min(100, fish.hunger + 30);
                fish.happiness = Math.min(100, fish.happiness + 10);
                fish.health = Math.min(100, fish.health + 5);
                fish.lastFed = Date.now();
            });
            
            this.updateDisplay();
            this.updateFishGrid();
        } else {
            alert('金币不足！需要10金币');
        }
    }
    
    showFoodParticles() {
        const foodContainer = document.getElementById('foodContainer');
        
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const foodParticle = document.createElement('div');
                foodParticle.className = 'food-particle';
                foodParticle.textContent = '🍤';
                foodParticle.style.left = Math.random() * 90 + 5 + '%';
                foodParticle.style.top = '0%';
                
                foodContainer.appendChild(foodParticle);
                
                setTimeout(() => {
                    foodParticle.remove();
                }, 3000);
            }, i * 200);
        }
    }
    
    cleanAquarium() {
        if (this.player.money >= 20) {
            this.player.money -= 20;
            this.aquarium.waterQuality = Math.min(100, this.aquarium.waterQuality + 20);
            this.aquarium.cleanliness = Math.min(100, this.aquarium.cleanliness + 30);
            
            this.fish.forEach(fish => {
                fish.health = Math.min(100, fish.health + 10);
                fish.happiness = Math.min(100, fish.happiness + 5);
            });
            
            this.updateDisplay();
            this.updateFishGrid();
        } else {
            alert('金币不足！需要20金币');
        }
    }
    
    adjustTemperature(change) {
        const cost = Math.abs(change) * 5;
        
        if (this.player.money >= cost) {
            this.player.money -= cost;
            this.aquarium.temperature = Math.max(18, Math.min(32, this.aquarium.temperature + change));
            this.updateDisplay();
        } else {
            alert(`金币不足！需要${cost}金币`);
        }
    }
    
    showFishInfo(fish) {
        const info = `
鱼类: ${fish.name}
健康: ${Math.floor(fish.health)}%
快乐: ${Math.floor(fish.happiness)}%
饥饿: ${Math.floor(fish.hunger)}%
适宜温度: ${fish.tempRange[0]}-${fish.tempRange[1]}°C
        `;
        alert(info);
    }
    
    startBubbles() {
        this.bubbleInterval = setInterval(() => {
            this.createBubble();
        }, 1000);
    }
    
    createBubble() {
        const bubblesContainer = document.getElementById('bubblesContainer');
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        
        const size = Math.random() * 8 + 4;
        bubble.style.width = size + 'px';
        bubble.style.height = size + 'px';
        bubble.style.left = Math.random() * 100 + '%';
        bubble.style.animationDuration = (Math.random() * 2 + 2) + 's';
        
        bubblesContainer.appendChild(bubble);
        
        setTimeout(() => {
            bubble.remove();
        }, 4000);
    }
    
    updateDisplay() {
        document.getElementById('money').textContent = Math.floor(this.player.money);
        document.getElementById('fishCount').textContent = this.fish.length;
        document.getElementById('temperature').textContent = this.aquarium.temperature;
        document.getElementById('waterQuality').textContent = Math.floor(this.aquarium.waterQuality);
        document.getElementById('phValue').textContent = this.aquarium.phValue.toFixed(1);
        document.getElementById('oxygenLevel').textContent = Math.floor(this.aquarium.oxygenLevel) + '%';
        document.getElementById('cleanliness').textContent = Math.floor(this.aquarium.cleanliness) + '%';
        
        // 更新光照等级
        if (this.aquarium.oxygenLevel > 90) {
            this.aquarium.lightLevel = '充足';
        } else if (this.aquarium.oxygenLevel > 70) {
            this.aquarium.lightLevel = '适中';
        } else {
            this.aquarium.lightLevel = '不足';
        }
        document.getElementById('lightLevel').textContent = this.aquarium.lightLevel;
    }
    
    updateFishGrid() {
        const fishGrid = document.getElementById('fishGrid');
        fishGrid.innerHTML = '';
        
        this.fish.forEach(fish => {
            const fishCard = document.createElement('div');
            fishCard.className = 'fish-card';
            
            fishCard.innerHTML = `
                <div class="fish-card-icon">${fish.icon}</div>
                <div class="fish-card-name">${fish.name}</div>
                <div class="fish-card-stats">
                    <span>健康: ${Math.floor(fish.health)}%</span>
                    <span>快乐: ${Math.floor(fish.happiness)}%</span>
                </div>
                <div class="health-bar">
                    <div class="health-fill" style="width: ${fish.health}%"></div>
                </div>
            `;
            
            fishGrid.appendChild(fishCard);
        });
    }
    
    startGameLoop() {
        setInterval(() => {
            this.updateFishStatus();
            this.updateAquariumStatus();
            this.generateIncome();
            this.updateDisplay();
            this.updateFishGrid();
        }, 5000);
        
        // 鱼的游泳动画
        setInterval(() => {
            this.updateFishMovement();
        }, 100);
    }
    
    updateFishStatus() {
        const now = Date.now();
        
        this.fish.forEach(fish => {
            // 饥饿度随时间下降
            const timeSinceLastFed = (now - fish.lastFed) / 1000;
            fish.hunger = Math.max(0, fish.hunger - timeSinceLastFed * 0.1);
            
            // 温度影响
            const tempDiff = Math.abs(this.aquarium.temperature - (fish.tempRange[0] + fish.tempRange[1]) / 2);
            if (tempDiff > 3) {
                fish.health = Math.max(0, fish.health - 0.5);
                fish.happiness = Math.max(0, fish.happiness - 0.3);
            }
            
            // 水质影响
            if (this.aquarium.waterQuality < 50) {
                fish.health = Math.max(0, fish.health - 0.3);
            }
            
            // 饥饿影响
            if (fish.hunger < 30) {
                fish.health = Math.max(0, fish.health - 0.2);
                fish.happiness = Math.max(0, fish.happiness - 0.5);
            }
            
            // 氧气影响
            if (this.aquarium.oxygenLevel < 70) {
                fish.health = Math.max(0, fish.health - 0.1);
            }
        });
    }
    
    updateAquariumStatus() {
        // 水质随时间下降
        this.aquarium.waterQuality = Math.max(0, this.aquarium.waterQuality - 0.1);
        this.aquarium.cleanliness = Math.max(0, this.aquarium.cleanliness - 0.2);
        
        // 氧气消耗
        const oxygenConsumption = this.fish.length * 0.1;
        this.aquarium.oxygenLevel = Math.max(0, this.aquarium.oxygenLevel - oxygenConsumption);
        
        // 装饰效果
        this.decorations.forEach(decoration => {
            if (decoration.effect === 'oxygen') {
                this.aquarium.oxygenLevel = Math.min(100, this.aquarium.oxygenLevel + 0.5);
            }
        });
    }
    
    updateFishMovement() {
        this.fish.forEach(fish => {
            const fishElement = document.querySelector(`[data-fish-id="${fish.id}"]`);
            if (fishElement) {
                // 更新鱼的位置
                if (fish.direction === 'left') {
                    fish.x -= fish.speed * 0.1;
                    if (fish.x < -5) {
                        fish.x = 105;
                        fish.y = Math.random() * 60 + 20;
                    }
                } else {
                    fish.x += fish.speed * 0.1;
                    if (fish.x > 105) {
                        fish.x = -5;
                        fish.y = Math.random() * 60 + 20;
                    }
                }
                
                fishElement.style.left = fish.x + '%';
                fishElement.style.top = fish.y + '%';
                
                // 随机改变方向
                if (Math.random() < 0.01) {
                    fish.direction = fish.direction === 'left' ? 'right' : 'left';
                    fishElement.className = `fish swimming-${fish.direction}`;
                }
            }
        });
    }
    
    generateIncome() {
        // 健康快乐的鱼会产生金币
        let income = 0;
        this.fish.forEach(fish => {
            if (fish.health > 70 && fish.happiness > 70) {
                income += 2;
            } else if (fish.health > 50 && fish.happiness > 50) {
                income += 1;
            }
        });
        
        this.player.money += income;
    }
}

// 启动游戏
document.addEventListener('DOMContentLoaded', () => {
    new AquariumGame();
});