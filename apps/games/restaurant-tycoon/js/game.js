class RestaurantTycoon {
    constructor() {
        this.money = 1000;
        this.reputation = 50;
        this.customers = 0;
        this.dailyIncome = 0;
        this.gameSpeed = 1;
        this.isPaused = false;
        
        this.menu = [
            { name: '汉堡', price: 15, cost: 8, time: 3, icon: '🍔' },
            { name: '薯条', price: 8, cost: 3, time: 2, icon: '🍟' }
        ];
        
        this.staff = [
            { name: '厨师小王', type: 'chef', salary: 50, efficiency: 1.2, icon: '👨‍🍳' }
        ];
        
        this.kitchen = Array(12).fill(null);
        this.dining = Array(12).fill(null);
        this.customerQueue = [];
        
        this.initializeGame();
        this.bindEvents();
        this.startGameLoop();
    }

    initializeGame() {
        this.renderKitchen();
        this.renderDining();
        this.renderMenu();
        this.renderStaff();
        this.renderUpgrades();
        this.updateDisplay();
    }

    renderKitchen() {
        const kitchenGrid = document.getElementById('kitchenGrid');
        kitchenGrid.innerHTML = '';
        
        this.kitchen.forEach((item, index) => {
            const kitchenItem = document.createElement('div');
            kitchenItem.className = 'kitchen-item';
            kitchenItem.dataset.index = index;
            
            if (item) {
                kitchenItem.classList.add('occupied');
                kitchenItem.textContent = item.icon;
                kitchenItem.title = item.name;
            } else {
                kitchenItem.textContent = '➕';
                kitchenItem.addEventListener('click', () => this.addKitchenEquipment(index));
            }
            
            kitchenGrid.appendChild(kitchenItem);
        });
    }

    renderDining() {
        const diningGrid = document.getElementById('diningGrid');
        diningGrid.innerHTML = '';
        
        this.dining.forEach((item, index) => {
            const diningItem = document.createElement('div');
            diningItem.className = 'dining-item';
            diningItem.dataset.index = index;
            
            if (item) {
                diningItem.classList.add('occupied');
                diningItem.textContent = item.icon;
                diningItem.title = item.name;
            } else {
                diningItem.textContent = '🪑';
                diningItem.addEventListener('click', () => this.addDiningTable(index));
            }
            
            diningGrid.appendChild(diningItem);
        });
    }

    renderMenu() {
        const menuList = document.getElementById('menuList');
        menuList.innerHTML = '';
        
        this.menu.forEach((dish, index) => {
            const menuItem = document.createElement('div');
            menuItem.className = 'menu-item';
            
            menuItem.innerHTML = `
                <div class="item-info">
                    <div class="item-name">${dish.icon} ${dish.name}</div>
                    <div class="item-details">成本: ¥${dish.cost} | 时间: ${dish.time}分钟</div>
                </div>
                <div class="item-price">¥${dish.price}</div>
            `;
            
            menuList.appendChild(menuItem);
        });
    }

    renderStaff() {
        const staffList = document.getElementById('staffList');
        staffList.innerHTML = '';
        
        this.staff.forEach((employee, index) => {
            const staffItem = document.createElement('div');
            staffItem.className = 'staff-item';
            
            staffItem.innerHTML = `
                <div class="item-info">
                    <div class="item-name">${employee.icon} ${employee.name}</div>
                    <div class="item-details">效率: ${employee.efficiency}x | 工资: ¥${employee.salary}/天</div>
                </div>
            `;
            
            staffList.appendChild(staffItem);
        });
    }

    renderUpgrades() {
        const upgradeList = document.getElementById('upgradeList');
        const upgrades = [
            { name: '烤箱', icon: '🔥', cost: 200, description: '提高烹饪速度' },
            { name: '冰箱', icon: '❄️', cost: 150, description: '保持食材新鲜' },
            { name: '咖啡机', icon: '☕', cost: 300, description: '增加饮品选择' },
            { name: '装修', icon: '🎨', cost: 500, description: '提升餐厅声誉' }
        ];
        
        upgradeList.innerHTML = '';
        
        upgrades.forEach(upgrade => {
            const upgradeItem = document.createElement('div');
            upgradeItem.className = 'upgrade-item';
            upgradeItem.style.cursor = 'pointer';
            
            upgradeItem.innerHTML = `
                <div class="item-info">
                    <div class="item-name">${upgrade.icon} ${upgrade.name}</div>
                    <div class="item-details">${upgrade.description}</div>
                </div>
                <div class="item-price">¥${upgrade.cost}</div>
            `;
            
            upgradeItem.addEventListener('click', () => this.buyUpgrade(upgrade));
            upgradeList.appendChild(upgradeItem);
        });
    }

    addKitchenEquipment(index) {
        const equipment = [
            { name: '炉灶', icon: '🔥', cost: 100 },
            { name: '烤箱', icon: '🔥', cost: 200 },
            { name: '微波炉', icon: '📱', cost: 80 },
            { name: '冰箱', icon: '❄️', cost: 150 }
        ];
        
        const selected = equipment[Math.floor(Math.random() * equipment.length)];
        
        if (this.money >= selected.cost) {
            this.money -= selected.cost;
            this.kitchen[index] = selected;
            this.renderKitchen();
            this.updateDisplay();
        } else {
            alert('资金不足！');
        }
    }

    addDiningTable(index) {
        const cost = 50;
        
        if (this.money >= cost) {
            this.money -= cost;
            this.dining[index] = { name: '餐桌', icon: '🍽️', seats: 4 };
            this.renderDining();
            this.updateDisplay();
        } else {
            alert('资金不足！');
        }
    }

    buyUpgrade(upgrade) {
        if (this.money >= upgrade.cost) {
            this.money -= upgrade.cost;
            this.reputation += 10;
            alert(`购买了 ${upgrade.name}！声誉提升！`);
            this.updateDisplay();
        } else {
            alert('资金不足！');
        }
    }

    bindEvents() {
        document.getElementById('addDishBtn').addEventListener('click', () => this.addNewDish());
        document.getElementById('hireStaffBtn').addEventListener('click', () => this.hireStaff());
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('speedBtn').addEventListener('click', () => this.changeSpeed());
        document.getElementById('saveBtn').addEventListener('click', () => this.saveGame());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());
    }

    addNewDish() {
        const dishes = [
            { name: '披萨', price: 25, cost: 12, time: 5, icon: '🍕' },
            { name: '意面', price: 20, cost: 10, time: 4, icon: '🍝' },
            { name: '沙拉', price: 12, cost: 6, time: 2, icon: '🥗' },
            { name: '牛排', price: 35, cost: 20, time: 8, icon: '🥩' },
            { name: '寿司', price: 30, cost: 15, time: 6, icon: '🍣' }
        ];
        
        const newDish = dishes[Math.floor(Math.random() * dishes.length)];
        const cost = 100;
        
        if (this.money >= cost) {
            this.money -= cost;
            this.menu.push(newDish);
            this.renderMenu();
            this.updateDisplay();
            alert(`添加了新菜品：${newDish.name}！`);
        } else {
            alert('资金不足！');
        }
    }

    hireStaff() {
        const staffTypes = [
            { name: '服务员小李', type: 'waiter', salary: 40, efficiency: 1.1, icon: '👨‍💼' },
            { name: '厨师小张', type: 'chef', salary: 60, efficiency: 1.3, icon: '👩‍🍳' },
            { name: '清洁工小陈', type: 'cleaner', salary: 30, efficiency: 1.0, icon: '🧹' }
        ];
        
        const newStaff = staffTypes[Math.floor(Math.random() * staffTypes.length)];
        const cost = 200;
        
        if (this.money >= cost) {
            this.money -= cost;
            this.staff.push(newStaff);
            this.renderStaff();
            this.updateDisplay();
            alert(`招聘了新员工：${newStaff.name}！`);
        } else {
            alert('资金不足！');
        }
    }

    generateCustomer() {
        if (this.customerQueue.length < 10) {
            const customer = {
                id: Date.now(),
                patience: 100,
                order: this.menu[Math.floor(Math.random() * this.menu.length)],
                icon: ['👨', '👩', '👦', '👧', '👴', '👵'][Math.floor(Math.random() * 6)]
            };
            
            this.customerQueue.push(customer);
            this.renderCustomerQueue();
        }
    }

    renderCustomerQueue() {
        const queueArea = document.getElementById('queueArea');
        queueArea.innerHTML = '';
        
        this.customerQueue.forEach(customer => {
            const customerElement = document.createElement('div');
            customerElement.className = 'customer';
            customerElement.textContent = customer.icon;
            customerElement.title = `想要: ${customer.order.name} | 耐心: ${customer.patience}%`;
            queueArea.appendChild(customerElement);
        });
    }

    serveCustomers() {
        if (this.customerQueue.length > 0 && this.dining.some(table => table !== null)) {
            const customer = this.customerQueue.shift();
            const income = customer.order.price;
            
            this.money += income;
            this.dailyIncome += income;
            this.customers++;
            this.reputation += 1;
            
            this.renderCustomerQueue();
            this.updateDisplay();
        }
    }

    updateDisplay() {
        document.getElementById('money').textContent = this.money;
        document.getElementById('reputation').textContent = this.reputation;
        document.getElementById('customers').textContent = this.customers;
        document.getElementById('dailyIncome').textContent = this.dailyIncome;
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
            reputation: this.reputation,
            customers: this.customers,
            dailyIncome: this.dailyIncome,
            menu: this.menu,
            staff: this.staff,
            kitchen: this.kitchen,
            dining: this.dining
        };
        
        localStorage.setItem('restaurantTycoon', JSON.stringify(gameData));
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
                // 生成顾客
                if (Math.random() < 0.3 * this.gameSpeed) {
                    this.generateCustomer();
                }
                
                // 服务顾客
                if (Math.random() < 0.5 * this.gameSpeed) {
                    this.serveCustomers();
                }
                
                // 减少顾客耐心
                this.customerQueue.forEach(customer => {
                    customer.patience -= 2;
                    if (customer.patience <= 0) {
                        this.reputation -= 2;
                    }
                });
                
                // 移除没有耐心的顾客
                this.customerQueue = this.customerQueue.filter(customer => customer.patience > 0);
                
                // 支付员工工资（每30秒）
                if (Date.now() % 30000 < 1000) {
                    this.staff.forEach(employee => {
                        this.money -= employee.salary / 24; // 按小时计算
                    });
                }
                
                this.renderCustomerQueue();
                this.updateDisplay();
            }
        }, 1000);
    }
}

// 启动游戏
document.addEventListener('DOMContentLoaded', () => {
    new RestaurantTycoon();
});