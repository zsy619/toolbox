class ShopTycoonGame {
    constructor() {
        this.player = {
            money: 1000,
            reputation: 50,
            level: 1,
            exp: 0
        };
        
        this.shop = {
            isOpen: true,
            size: 24, // 6x4 grid
            shelves: Array(24).fill(null),
            customers: [],
            dailyRevenue: 0,
            dailyCustomers: 0
        };
        
        this.gameTime = {
            hour: 9,
            minute: 0,
            day: 1,
            speed: 1
        };
        
        this.inventory = {};
        this.staff = [];
        this.events = [];
        
        this.products = {
            food: [
                { id: 'bread', name: '面包', icon: '🍞', cost: 2, price: 5, demand: 0.8 },
                { id: 'milk', name: '牛奶', icon: '🥛', cost: 3, price: 6, demand: 0.7 },
                { id: 'apple', name: '苹果', icon: '🍎', cost: 1, price: 3, demand: 0.9 },
                { id: 'cheese', name: '奶酪', icon: '🧀', cost: 4, price: 8, demand: 0.6 },
                { id: 'juice', name: '果汁', icon: '🧃', cost: 2, price: 4, demand: 0.8 }
            ],
            electronics: [
                { id: 'phone', name: '手机', icon: '📱', cost: 200, price: 350, demand: 0.3 },
                { id: 'laptop', name: '笔记本', icon: '💻', cost: 500, price: 800, demand: 0.2 },
                { id: 'headphones', name: '耳机', icon: '🎧', cost: 50, price: 80, demand: 0.5 },
                { id: 'camera', name: '相机', icon: '📷', cost: 300, price: 500, demand: 0.3 },
                { id: 'watch', name: '手表', icon: '⌚', cost: 100, price: 180, demand: 0.4 }
            ],
            clothing: [
                { id: 'shirt', name: '衬衫', icon: '👔', cost: 15, price: 30, demand: 0.6 },
                { id: 'jeans', name: '牛仔裤', icon: '👖', cost: 20, price: 40, demand: 0.7 },
                { id: 'shoes', name: '鞋子', icon: '👟', cost: 30, price: 60, demand: 0.5 },
                { id: 'hat', name: '帽子', icon: '🧢', cost: 10, price: 20, demand: 0.4 },
                { id: 'jacket', name: '夹克', icon: '🧥', cost: 40, price: 80, demand: 0.3 }
            ],
            books: [
                { id: 'novel', name: '小说', icon: '📚', cost: 8, price: 15, demand: 0.5 },
                { id: 'textbook', name: '教科书', icon: '📖', cost: 25, price: 45, demand: 0.4 },
                { id: 'magazine', name: '杂志', icon: '📰', cost: 3, price: 6, demand: 0.8 },
                { id: 'comic', name: '漫画', icon: '📙', cost: 5, price: 10, demand: 0.7 },
                { id: 'dictionary', name: '词典', icon: '📕', cost: 15, price: 30, demand: 0.3 }
            ]
        };
        
        this.customerTypes = [
            { icon: '👨', patience: 100, budget: 50 },
            { icon: '👩', patience: 120, budget: 80 },
            { icon: '👴', patience: 80, budget: 30 },
            { icon: '👵', patience: 90, budget: 40 },
            { icon: '👦', patience: 60, budget: 20 },
            { icon: '👧', patience: 70, budget: 25 }
        ];
        
        this.upgrades = [
            { id: 'expand', name: '扩大店面', cost: 2000, effect: 'size', value: 12 },
            { id: 'security', name: '安全系统', cost: 1500, effect: 'theft', value: -50 },
            { id: 'ac', name: '空调系统', cost: 1000, effect: 'comfort', value: 20 },
            { id: 'lighting', name: '照明升级', cost: 800, effect: 'attraction', value: 15 }
        ];
        
        this.selectedCategory = 'food';
        
        this.initializeGame();
        this.bindEvents();
        this.startGameLoop();
    }
    
    initializeGame() {
        this.createShopGrid();
        this.createProductList();
        this.updateInventory();
        this.updateDisplay();
        this.addEvent('🏪', '商店开业', '欢迎来到你的商店！开始你的商业之旅吧！');
    }
    
    bindEvents() {
        // 商店控制
        document.getElementById('openCloseBtn').addEventListener('click', () => this.toggleShop());
        document.getElementById('upgradeBtn').addEventListener('click', () => this.showUpgradeModal());
        document.getElementById('marketingBtn').addEventListener('click', () => this.runMarketing());
        document.getElementById('staffBtn').addEventListener('click', () => this.showStaffModal());
        document.getElementById('restockBtn').addEventListener('click', () => this.restockInventory());
        
        // 产品分类
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectCategory(btn.dataset.category);
            });
        });
    }
    
    createShopGrid() {
        const shopGrid = document.getElementById('shopGrid');
        shopGrid.innerHTML = '';
        
        for (let i = 0; i < this.shop.size; i++) {
            const shelf = document.createElement('div');
            shelf.className = 'shop-shelf empty';
            shelf.dataset.index = i;
            
            shelf.addEventListener('click', () => this.selectShelf(i));
            
            shopGrid.appendChild(shelf);
        }
    }
    
    selectShelf(index) {
        // 这里可以添加货架选择逻辑
        console.log(`Selected shelf ${index}`);
    }
    
    createProductList() {
        this.updateProductList();
    }
    
    updateProductList() {
        const productList = document.getElementById('productList');
        productList.innerHTML = '';
        
        this.products[this.selectedCategory].forEach(product => {
            const productItem = document.createElement('div');
            productItem.className = 'product-item';
            
            const profit = product.price - product.cost;
            const profitMargin = ((profit / product.price) * 100).toFixed(1);
            
            productItem.innerHTML = `
                <div class="product-info">
                    <div class="product-icon">${product.icon}</div>
                    <div class="product-details">
                        <div class="product-name">${product.name}</div>
                        <div class="product-price">售价: ¥${product.price}</div>
                    </div>
                </div>
                <div class="product-profit">利润: ¥${profit} (${profitMargin}%)</div>
            `;
            
            productItem.addEventListener('click', () => this.selectProduct(product));
            
            productList.appendChild(productItem);
        });
    }
    
    selectCategory(category) {
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');
        this.selectedCategory = category;
        this.updateProductList();
    }
    
    selectProduct(product) {
        if (this.player.money >= product.cost * 10) {
            this.player.money -= product.cost * 10;
            this.addToInventory(product.id, 10);
            this.updateDisplay();
            this.updateInventory();
            this.addEvent('📦', '进货完成', `购买了10个${product.name}`);
        } else {
            alert('资金不足！');
        }
    }
    
    addToInventory(productId, quantity) {
        if (this.inventory[productId]) {
            this.inventory[productId] += quantity;
        } else {
            this.inventory[productId] = quantity;
        }
    }
    
    updateInventory() {
        const inventoryGrid = document.getElementById('inventoryGrid');
        inventoryGrid.innerHTML = '';
        
        // 显示所有产品类别的库存
        Object.values(this.products).flat().forEach(product => {
            const stock = this.inventory[product.id] || 0;
            
            const inventoryItem = document.createElement('div');
            inventoryItem.className = 'inventory-item';
            
            inventoryItem.innerHTML = `
                <div class="item-icon">${product.icon}</div>
                <div class="item-name">${product.name}</div>
                <div class="item-stock">库存: ${stock}</div>
            `;
            
            inventoryItem.addEventListener('click', () => this.stockShelf(product));
            
            inventoryGrid.appendChild(inventoryItem);
        });
    }
    
    stockShelf(product) {
        const stock = this.inventory[product.id] || 0;
        if (stock > 0) {
            // 找到空货架
            const emptyShelfIndex = this.shop.shelves.findIndex(shelf => shelf === null);
            if (emptyShelfIndex !== -1) {
                this.shop.shelves[emptyShelfIndex] = {
                    product: product,
                    stock: Math.min(stock, 20) // 每个货架最多20个商品
                };
                this.inventory[product.id] -= Math.min(stock, 20);
                this.updateShelfDisplay();
                this.updateInventory();
                this.addEvent('📋', '上架商品', `${product.name}已上架`);
            } else {
                alert('没有空闲货架！');
            }
        } else {
            alert('库存不足！');
        }
    }
    
    updateShelfDisplay() {
        const shelves = document.querySelectorAll('.shop-shelf');
        
        shelves.forEach((shelf, index) => {
            const shelfData = this.shop.shelves[index];
            
            shelf.className = 'shop-shelf';
            shelf.innerHTML = '';
            
            if (shelfData) {
                shelf.classList.add('stocked');
                
                const productElement = document.createElement('div');
                productElement.className = 'shelf-product';
                productElement.textContent = shelfData.product.icon;
                
                const stockElement = document.createElement('div');
                stockElement.className = 'shelf-stock';
                stockElement.textContent = shelfData.stock;
                
                shelf.appendChild(productElement);
                shelf.appendChild(stockElement);
            } else {
                shelf.classList.add('empty');
                shelf.textContent = '空';
            }
        });
    }
    
    toggleShop() {
        this.shop.isOpen = !this.shop.isOpen;
        const openCloseBtn = document.getElementById('openCloseBtn');
        const shopStatus = document.getElementById('shopStatus');
        
        if (this.shop.isOpen) {
            openCloseBtn.textContent = '🔒 关店';
            shopStatus.textContent = '营业中';
            shopStatus.style.color = '#4caf50';
        } else {
            openCloseBtn.textContent = '🔓 开店';
            shopStatus.textContent = '已关店';
            shopStatus.style.color = '#f44336';
        }
    }
    
    generateCustomer() {
        if (!this.shop.isOpen || this.shop.customers.length >= 5) return;
        
        const customerType = this.customerTypes[Math.floor(Math.random() * this.customerTypes.length)];
        const customer = {
            id: Date.now(),
            ...customerType,
            x: -50,
            patience: customerType.patience,
            maxPatience: customerType.patience,
            wantedProduct: this.getRandomProduct(),
            satisfied: false
        };
        
        this.shop.customers.push(customer);
        this.addCustomerToDisplay(customer);
    }
    
    getRandomProduct() {
        const allProducts = Object.values(this.products).flat();
        return allProducts[Math.floor(Math.random() * allProducts.length)];
    }
    
    addCustomerToDisplay(customer) {
        const customerArea = document.getElementById('customerArea');
        const customerElement = document.createElement('div');
        customerElement.className = 'customer';
        customerElement.dataset.customerId = customer.id;
        customerElement.textContent = customer.icon;
        customerElement.style.left = customer.x + 'px';
        
        customerElement.addEventListener('click', () => this.serveCustomer(customer.id));
        
        customerArea.appendChild(customerElement);
    }
    
    serveCustomer(customerId) {
        const customer = this.shop.customers.find(c => c.id === customerId);
        if (!customer) return;
        
        // 查找顾客想要的商品
        const shelfIndex = this.shop.shelves.findIndex(shelf => 
            shelf && shelf.product.id === customer.wantedProduct.id && shelf.stock > 0
        );
        
        if (shelfIndex !== -1) {
            // 成功销售
            const shelf = this.shop.shelves[shelfIndex];
            const product = shelf.product;
            
            shelf.stock--;
            if (shelf.stock === 0) {
                this.shop.shelves[shelfIndex] = null;
            }
            
            this.player.money += product.price;
            this.shop.dailyRevenue += product.price;
            this.shop.dailyCustomers++;
            this.player.reputation += 1;
            
            customer.satisfied = true;
            this.removeCustomer(customerId);
            
            this.addEvent('💰', '销售成功', `售出${product.name}，获得¥${product.price}`);
        } else {
            // 没有商品，顾客不满意
            this.player.reputation -= 2;
            customer.satisfied = false;
            this.removeCustomer(customerId);
            
            this.addEvent('😞', '顾客不满', `没有${customer.wantedProduct.name}，顾客离开`);
        }
        
        this.updateShelfDisplay();
        this.updateDisplay();
    }
    
    removeCustomer(customerId) {
        this.shop.customers = this.shop.customers.filter(c => c.id !== customerId);
        const customerElement = document.querySelector(`[data-customer-id="${customerId}"]`);
        if (customerElement) {
            customerElement.remove();
        }
    }
    
    restockInventory() {
        const restockCost = 500;
        if (this.player.money >= restockCost) {
            this.player.money -= restockCost;
            
            // 随机补充库存
            Object.values(this.products).flat().forEach(product => {
                const quantity = Math.floor(Math.random() * 10) + 5;
                this.addToInventory(product.id, quantity);
            });
            
            this.updateInventory();
            this.updateDisplay();
            this.addEvent('🚚', '进货完成', '库存已补充');
        } else {
            alert('资金不足！需要¥500');
        }
    }
    
    runMarketing() {
        const marketingCost = 200;
        if (this.player.money >= marketingCost) {
            this.player.money -= marketingCost;
            this.player.reputation += 10;
            
            // 增加顾客流量
            for (let i = 0; i < 3; i++) {
                setTimeout(() => this.generateCustomer(), i * 1000);
            }
            
            this.updateDisplay();
            this.addEvent('📢', '营销活动', '开展营销活动，吸引更多顾客');
        } else {
            alert('资金不足！需要¥200');
        }
    }
    
    showUpgradeModal() {
        const modal = document.getElementById('upgradeModal');
        const upgradeOptions = document.getElementById('upgradeOptions');
        
        upgradeOptions.innerHTML = '';
        
        this.upgrades.forEach(upgrade => {
            const upgradeItem = document.createElement('div');
            upgradeItem.className = 'upgrade-item';
            
            upgradeItem.innerHTML = `
                <h4>${upgrade.name}</h4>
                <p>费用: ¥${upgrade.cost}</p>
                <p>效果: ${this.getUpgradeDescription(upgrade)}</p>
            `;
            
            upgradeItem.addEventListener('click', () => {
                if (this.player.money >= upgrade.cost) {
                    this.player.money -= upgrade.cost;
                    this.applyUpgrade(upgrade);
                    this.updateDisplay();
                    closeModal('upgradeModal');
                    this.addEvent('⬆️', '升级完成', `${upgrade.name}升级完成`);
                } else {
                    alert('资金不足！');
                }
            });
            
            upgradeOptions.appendChild(upgradeItem);
        });
        
        modal.classList.add('active');
    }
    
    getUpgradeDescription(upgrade) {
        const descriptions = {
            size: '增加货架数量',
            theft: '减少商品丢失',
            comfort: '提高顾客满意度',
            attraction: '吸引更多顾客'
        };
        return descriptions[upgrade.effect] || '未知效果';
    }
    
    applyUpgrade(upgrade) {
        switch (upgrade.effect) {
            case 'size':
                this.shop.size += upgrade.value;
                this.shop.shelves = this.shop.shelves.concat(Array(upgrade.value).fill(null));
                this.createShopGrid();
                break;
            case 'comfort':
                this.player.reputation += upgrade.value;
                break;
        }
    }
    
    showStaffModal() {
        const modal = document.getElementById('staffModal');
        modal.classList.add('active');
    }
    
    addEvent(icon, title, description) {
        const event = {
            icon,
            title,
            description,
            time: this.formatTime(this.gameTime.hour, this.gameTime.minute)
        };
        
        this.events.unshift(event);
        if (this.events.length > 10) {
            this.events.pop();
        }
        
        this.updateEventsDisplay();
    }
    
    updateEventsDisplay() {
        const eventsList = document.getElementById('eventsList');
        eventsList.innerHTML = '';
        
        this.events.forEach(event => {
            const eventItem = document.createElement('div');
            eventItem.className = 'event-item';
            
            eventItem.innerHTML = `
                <div class="event-icon">${event.icon}</div>
                <div class="event-content">
                    <div class="event-title">${event.title}</div>
                    <div class="event-description">${event.description}</div>
                </div>
                <div class="event-time">${event.time}</div>
            `;
            
            eventsList.appendChild(eventItem);
        });
    }
    
    formatTime(hour, minute) {
        return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    }
    
    updateDisplay() {
        document.getElementById('money').textContent = Math.floor(this.player.money);
        document.getElementById('customers').textContent = this.shop.dailyCustomers;
        document.getElementById('revenue').textContent = Math.floor(this.shop.dailyRevenue);
        document.getElementById('reputation').textContent = Math.floor(this.player.reputation);
        
        document.getElementById('currentTime').textContent = this.formatTime(this.gameTime.hour, this.gameTime.minute);
        
        // 更新分析图表
        const maxRevenue = 1000;
        const salesPercentage = Math.min((this.shop.dailyRevenue / maxRevenue) * 100, 100);
        document.getElementById('salesChart').style.width = salesPercentage + '%';
        document.getElementById('salesValue').textContent = '¥' + Math.floor(this.shop.dailyRevenue);
        
        const profitMargin = this.shop.dailyRevenue > 0 ? 30 : 0; // 简化的利润率计算
        document.getElementById('profitChart').style.width = profitMargin + '%';
        document.getElementById('profitValue').textContent = profitMargin + '%';
        
        const satisfaction = Math.min(this.player.reputation, 100);
        document.getElementById('satisfactionChart').style.width = satisfaction + '%';
        document.getElementById('satisfactionValue').textContent = satisfaction + '%';
    }
    
    updateCustomers() {
        this.shop.customers.forEach(customer => {
            customer.patience--;
            
            if (customer.patience <= 0) {
                this.removeCustomer(customer.id);
                this.player.reputation -= 3;
                this.addEvent('😡', '顾客愤怒', '顾客等待太久，愤怒离开');
            }
        });
    }
    
    startGameLoop() {
        // 主游戏循环
        setInterval(() => {
            this.gameTime.minute += this.gameTime.speed;
            
            if (this.gameTime.minute >= 60) {
                this.gameTime.minute = 0;
                this.gameTime.hour++;
                
                if (this.gameTime.hour >= 24) {
                    this.gameTime.hour = 0;
                    this.gameTime.day++;
                    this.shop.dailyRevenue = 0;
                    this.shop.dailyCustomers = 0;
                }
            }
            
            this.updateDisplay();
        }, 1000);
        
        // 顾客生成
        setInterval(() => {
            if (Math.random() < 0.3) {
                this.generateCustomer();
            }
        }, 3000);
        
        // 顾客更新
        setInterval(() => {
            this.updateCustomers();
        }, 2000);
    }
}

// 模态框控制函数
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// 启动游戏
document.addEventListener('DOMContentLoaded', () => {
    new ShopTycoonGame();
});