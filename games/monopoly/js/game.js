class Monopoly {
            constructor() {
                this.players = [
                    { id: 1, name: '玩家1', money: 1500, position: 0, properties: [], inJail: false, jailTurns: 0 },
                    { id: 2, name: '玩家2', money: 1500, position: 0, properties: [], inJail: false, jailTurns: 0 },
                    { id: 3, name: '玩家3', money: 1500, position: 0, properties: [], inJail: false, jailTurns: 0 },
                    { id: 4, name: '玩家4', money: 1500, position: 0, properties: [], inJail: false, jailTurns: 0 }
                ];
                this.currentPlayer = 0;
                this.gamePhase = 'roll'; // roll, action, end
                this.lastDiceRoll = 0;
                
                this.properties = this.initProperties();
                this.initBoard();
                this.updateGameInfo();
                this.bindEvents();
            }

            initProperties() {
                return [
                    { id: 0, name: '起点', type: 'start', price: 0, rent: 0, color: 'none' },
                    { id: 1, name: '中山路', type: 'property', price: 60, rent: 2, color: 'brown', owner: null, houses: 0 },
                    { id: 2, name: '社区基金', type: 'chance', price: 0, rent: 0, color: 'none' },
                    { id: 3, name: '南京路', type: 'property', price: 60, rent: 4, color: 'brown', owner: null, houses: 0 },
                    { id: 4, name: '所得税', type: 'tax', price: 200, rent: 0, color: 'none' },
                    { id: 5, name: '东站', type: 'station', price: 200, rent: 25, color: 'station', owner: null },
                    { id: 6, name: '东方路', type: 'property', price: 100, rent: 6, color: 'lightblue', owner: null, houses: 0 },
                    { id: 7, name: '机会', type: 'chance', price: 0, rent: 0, color: 'none' },
                    { id: 8, name: '西藏路', type: 'property', price: 100, rent: 6, color: 'lightblue', owner: null, houses: 0 },
                    { id: 9, name: '监狱', type: 'jail', price: 0, rent: 0, color: 'none' },
                    { id: 10, name: '福州路', type: 'property', price: 120, rent: 8, color: 'pink', owner: null, houses: 0 },
                    { id: 11, name: '电力公司', type: 'utility', price: 150, rent: 0, color: 'utility', owner: null },
                    { id: 12, name: '南昌路', type: 'property', price: 140, rent: 10, color: 'pink', owner: null, houses: 0 },
                    { id: 13, name: '四川路', type: 'property', price: 160, rent: 12, color: 'pink', owner: null, houses: 0 },
                    { id: 14, name: '西站', type: 'station', price: 200, rent: 25, color: 'station', owner: null },
                    { id: 15, name: '北京路', type: 'property', price: 180, rent: 14, color: 'orange', owner: null, houses: 0 },
                    { id: 16, name: '社区基金', type: 'chance', price: 0, rent: 0, color: 'none' },
                    { id: 17, name: '天津路', type: 'property', price: 180, rent: 14, color: 'orange', owner: null, houses: 0 },
                    { id: 18, name: '免费停车', type: 'free', price: 0, rent: 0, color: 'none' },
                    { id: 19, name: '浙江路', type: 'property', price: 220, rent: 18, color: 'red', owner: null, houses: 0 },
                    { id: 20, name: '机会', type: 'chance', price: 0, rent: 0, color: 'none' },
                    { id: 21, name: '湖南路', type: 'property', price: 220, rent: 18, color: 'red', owner: null, houses: 0 },
                    { id: 22, name: '广东路', type: 'property', price: 240, rent: 20, color: 'red', owner: null, houses: 0 },
                    { id: 23, name: '南站', type: 'station', price: 200, rent: 25, color: 'station', owner: null },
                    { id: 24, name: '江苏路', type: 'property', price: 260, rent: 22, color: 'yellow', owner: null, houses: 0 },
                    { id: 25, name: '安徽路', type: 'property', price: 260, rent: 22, color: 'yellow', owner: null, houses: 0 },
                    { id: 26, name: '自来水公司', type: 'utility', price: 150, rent: 0, color: 'utility', owner: null },
                    { id: 27, name: '进监狱', type: 'gotoJail', price: 0, rent: 0, color: 'none' },
                    { id: 28, name: '河北路', type: 'property', price: 300, rent: 26, color: 'green', owner: null, houses: 0 },
                    { id: 29, name: '河南路', type: 'property', price: 300, rent: 26, color: 'green', owner: null, houses: 0 },
                    { id: 30, name: '社区基金', type: 'chance', price: 0, rent: 0, color: 'none' },
                    { id: 31, name: '湖北路', type: 'property', price: 320, rent: 28, color: 'green', owner: null, houses: 0 },
                    { id: 32, name: '北站', type: 'station', price: 200, rent: 25, color: 'station', owner: null },
                    { id: 33, name: '机会', type: 'chance', price: 0, rent: 0, color: 'none' },
                    { id: 34, name: '台湾路', type: 'property', price: 350, rent: 35, color: 'darkblue', owner: null, houses: 0 },
                    { id: 35, name: '香港路', type: 'property', price: 400, rent: 50, color: 'darkblue', owner: null, houses: 0 }
                ];
            }

            initBoard() {
                const board = document.getElementById('board');
                
                // 创建地产格子
                this.properties.forEach((property, index) => {
                    const propertyDiv = document.createElement('div');
                    propertyDiv.className = `property property-${index}`;
                    propertyDiv.innerHTML = `
                        <div style="font-size: 8px; text-align: center; padding: 2px;">
                            ${property.name}
                        </div>
                    `;
                    
                    if (property.color !== 'none') {
                        const colorBar = document.createElement('div');
                        colorBar.style.cssText = `
                            position: absolute;
                            top: 0;
                            left: 0;
                            right: 0;
                            height: 15px;
                            background: ${this.getColorCode(property.color)};
                        `;
                        propertyDiv.appendChild(colorBar);
                    }
                    
                    propertyDiv.addEventListener('click', () => this.showPropertyInfo(property));
                    board.appendChild(propertyDiv);
                });

                // 创建玩家棋子
                this.players.forEach((player, index) => {
                    const playerDiv = document.createElement('div');
                    playerDiv.className = `player player-${player.id}`;
                    playerDiv.id = `player-${player.id}`;
                    board.appendChild(playerDiv);
                    this.updatePlayerPosition(player.id, 0);
                });
            }

            getColorCode(color) {
                const colors = {
                    'brown': '#8B4513',
                    'lightblue': '#87CEEB',
                    'pink': '#FF69B4',
                    'orange': '#FFA500',
                    'red': '#FF0000',
                    'yellow': '#FFFF00',
                    'green': '#008000',
                    'darkblue': '#000080',
                    'station': '#000000',
                    'utility': '#708090'
                };
                return colors[color] || '#CCCCCC';
            }

            updatePlayerPosition(playerId, position) {
                const playerElement = document.getElementById(`player-${playerId}`);
                const propertyElement = document.querySelector(`.property-${position}`);
                
                if (playerElement && propertyElement) {
                    const rect = propertyElement.getBoundingClientRect();
                    const boardRect = document.getElementById('board').getBoundingClientRect();
                    
                    const x = rect.left - boardRect.left + (playerId - 1) * 22 + 10;
                    const y = rect.top - boardRect.top + 10;
                    
                    playerElement.style.left = `${x}px`;
                    playerElement.style.top = `${y}px`;
                }
            }

            updateGameInfo() {
                const gameInfo = document.getElementById('gameInfo');
                gameInfo.innerHTML = this.players.map((player, index) => `
                    <div class="player-info ${index === this.currentPlayer ? 'current' : ''}">
                        <div class="player-name">🏃 ${player.name}</div>
                        <div class="player-money">💰 $${player.money}</div>
                        <div style="font-size: 0.9em; color: #666; margin-top: 5px;">
                            地产: ${player.properties.length}个
                            ${player.inJail ? '🏢 在监狱' : ''}
                        </div>
                    </div>
                `).join('');
            }

            bindEvents() {
                document.getElementById('rollDice').addEventListener('click', () => this.rollDice());
                document.getElementById('buyProperty').addEventListener('click', () => this.buyProperty());
                document.getElementById('endTurn').addEventListener('click', () => this.endTurn());
            }

            rollDice() {
                if (this.gamePhase !== 'roll') return;
                
                const currentPlayer = this.players[this.currentPlayer];
                
                if (currentPlayer.inJail) {
                    if (currentPlayer.jailTurns >= 3) {
                        currentPlayer.money -= 50;
                        currentPlayer.inJail = false;
                        currentPlayer.jailTurns = 0;
                        this.showMessage(`${currentPlayer.name} 缴纳$50出狱！`);
                    } else {
                        currentPlayer.jailTurns++;
                        this.showMessage(`${currentPlayer.name} 在监狱第${currentPlayer.jailTurns}回合`);
                        this.endTurn();
                        return;
                    }
                }
                
                const dice1 = Math.floor(Math.random() * 6) + 1;
                const dice2 = Math.floor(Math.random() * 6) + 1;
                this.lastDiceRoll = dice1 + dice2;
                
                document.getElementById('diceResult').textContent = `🎲 ${dice1} + ${dice2} = ${this.lastDiceRoll}`;
                document.getElementById('diceResult').style.display = 'inline-block';
                
                // 移动玩家
                currentPlayer.position = (currentPlayer.position + this.lastDiceRoll) % 36;
                this.updatePlayerPosition(currentPlayer.id, currentPlayer.position);
                
                // 经过起点获得$200
                if (currentPlayer.position + this.lastDiceRoll >= 36) {
                    currentPlayer.money += 200;
                    this.showMessage(`${currentPlayer.name} 经过起点，获得$200！`);
                }
                
                this.handleLanding();
                this.gamePhase = 'action';
                document.getElementById('rollDice').style.display = 'none';
            }

            handleLanding() {
                const currentPlayer = this.players[this.currentPlayer];
                const property = this.properties[currentPlayer.position];
                
                this.showPropertyInfo(property);
                
                switch (property.type) {
                    case 'property':
                    case 'station':
                    case 'utility':
                        if (property.owner === null) {
                            // 可购买
                            document.getElementById('buyProperty').style.display = 'inline-block';
                        } else if (property.owner !== currentPlayer.id) {
                            // 需要缴纳租金
                            const rent = this.calculateRent(property);
                            currentPlayer.money -= rent;
                            const owner = this.players.find(p => p.id === property.owner);
                            owner.money += rent;
                            this.showMessage(`${currentPlayer.name} 向${owner.name}支付租金$${rent}`);
                        }
                        break;
                        
                    case 'tax':
                        currentPlayer.money -= property.price;
                        this.showMessage(`${currentPlayer.name} 缴纳税费$${property.price}`);
                        break;
                        
                    case 'gotoJail':
                        currentPlayer.position = 9; // 监狱位置
                        currentPlayer.inJail = true;
                        currentPlayer.jailTurns = 0;
                        this.updatePlayerPosition(currentPlayer.id, 9);
                        this.showMessage(`${currentPlayer.name} 被抓进监狱！`);
                        break;
                        
                    case 'chance':
                        this.drawChanceCard();
                        break;
                        
                    case 'start':
                        currentPlayer.money += 200;
                        this.showMessage(`${currentPlayer.name} 到达起点，获得$200！`);
                        break;
                }
                
                document.getElementById('endTurn').style.display = 'inline-block';
            }

            calculateRent(property) {
                if (property.type === 'utility') {
                    return this.lastDiceRoll * 4;
                }
                return property.rent + (property.houses || 0) * 50;
            }

            drawChanceCard() {
                const currentPlayer = this.players[this.currentPlayer];
                const cards = [
                    { text: '获得银行股息$50', money: 50 },
                    { text: '缴纳房屋修理费$25', money: -25 },
                    { text: '中奖获得$100', money: 100 },
                    { text: '缴纳罚款$50', money: -50 },
                    { text: '前进到起点', position: 0, passStart: true },
                    { text: '后退3格', move: -3 }
                ];
                
                const card = cards[Math.floor(Math.random() * cards.length)];
                
                if (card.money) {
                    currentPlayer.money += card.money;
                }
                
                if (card.position !== undefined) {
                    if (card.passStart && currentPlayer.position > card.position) {
                        currentPlayer.money += 200;
                    }
                    currentPlayer.position = card.position;
                    this.updatePlayerPosition(currentPlayer.id, currentPlayer.position);
                }
                
                if (card.move) {
                    currentPlayer.position = Math.max(0, currentPlayer.position + card.move);
                    this.updatePlayerPosition(currentPlayer.id, currentPlayer.position);
                }
                
                this.showMessage(`${currentPlayer.name} 抽到: ${card.text}`);
            }

            buyProperty() {
                const currentPlayer = this.players[this.currentPlayer];
                const property = this.properties[currentPlayer.position];
                
                if (currentPlayer.money >= property.price) {
                    currentPlayer.money -= property.price;
                    currentPlayer.properties.push(property.id);
                    property.owner = currentPlayer.id;
                    
                    // 标记为已拥有
                    const propertyElement = document.querySelector(`.property-${currentPlayer.position}`);
                    propertyElement.classList.add('owned');
                    propertyElement.style.borderColor = this.getPlayerColor(currentPlayer.id);
                    
                    this.showMessage(`${currentPlayer.name} 购买了${property.name}！`);
                    document.getElementById('buyProperty').style.display = 'none';
                } else {
                    this.showMessage(`${currentPlayer.name} 资金不足！`);
                }
            }

            getPlayerColor(playerId) {
                const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12'];
                return colors[playerId - 1];
            }

            endTurn() {
                this.gamePhase = 'roll';
                this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
                
                document.getElementById('rollDice').style.display = 'inline-block';
                document.getElementById('buyProperty').style.display = 'none';
                document.getElementById('endTurn').style.display = 'none';
                document.getElementById('diceResult').style.display = 'none';
                document.getElementById('propertyInfo').style.display = 'none';
                
                this.updateGameInfo();
                
                // 检查是否有玩家破产
                this.checkBankruptcy();
            }

            checkBankruptcy() {
                const activePlayers = this.players.filter(p => p.money >= 0);
                if (activePlayers.length === 1) {
                    this.showMessage(`🎉 游戏结束！${activePlayers[0].name} 获胜！`);
                    document.getElementById('rollDice').disabled = true;
                }
            }

            showPropertyInfo(property) {
                const propertyInfo = document.getElementById('propertyInfo');
                const owner = property.owner ? this.players.find(p => p.id === property.owner) : null;
                
                propertyInfo.innerHTML = `
                    <h3>📍 ${property.name}</h3>
                    ${property.color !== 'none' ? `<div class="property-color" style="background: ${this.getColorCode(property.color)};"></div>` : ''}
                    <p><strong>类型:</strong> ${this.getPropertyTypeText(property.type)}</p>
                    ${property.price > 0 ? `<p><strong>价格:</strong> $${property.price}</p>` : ''}
                    ${property.rent > 0 ? `<p><strong>租金:</strong> $${property.rent}</p>` : ''}
                    ${owner ? `<p><strong>拥有者:</strong> ${owner.name}</p>` : ''}
                    ${property.houses > 0 ? `<p><strong>房屋:</strong> ${property.houses}栋</p>` : ''}
                `;
                propertyInfo.style.display = 'block';
            }

            getPropertyTypeText(type) {
                const types = {
                    'property': '地产',
                    'station': '车站',
                    'utility': '公用事业',
                    'start': '起点',
                    'jail': '监狱',
                    'free': '免费停车',
                    'gotoJail': '进监狱',
                    'tax': '税收',
                    'chance': '机会/社区基金'
                };
                return types[type] || '未知';
            }

            showMessage(message) {
                // 简单的消息显示，可以扩展为更好的UI
                console.log(message);
                // 可以添加一个消息显示区域
            }
        }

        // 启动游戏
        window.addEventListener('load', () => {
            new Monopoly();
        });