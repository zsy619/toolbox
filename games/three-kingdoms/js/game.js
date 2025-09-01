class ThreeKingdomsGame {
            constructor() {
                this.players = [];
                this.currentPlayerIndex = 0;
                this.gamePhase = 'prepare';
                this.roundCount = 0;
                this.gameStarted = false;
                this.deckCards = 24;
                this.discardCards = 0;
                this.selectedCard = null;
                this.gameLog = [];
                
                this.characters = [
                    { name: '刘备', skill: '仁德', hp: 4, description: '可以将手牌给予其他角色' },
                    { name: '关羽', skill: '武圣', hp: 4, description: '红色手牌可以当作杀使用' },
                    { name: '张飞', skill: '咆哮', hp: 4, description: '出牌阶段可以使用任意数量的杀' },
                    { name: '赵云', skill: '龙胆', hp: 4, description: '可以将杀当作闪使用，闪当作杀使用' },
                    { name: '马超', skill: '马术', hp: 4, description: '计算与其他角色的距离-1' },
                    { name: '黄忠', skill: '烈弓', hp: 4, description: '可以对距离2以内的角色使用杀' },
                    { name: '曹操', skill: '奸雄', hp: 4, description: '受到伤害后可以获得对应的牌' },
                    { name: '郭嘉', skill: '天妒', hp: 3, description: '每当失去一点体力，可以摸两张牌' },
                    { name: '司马懿', skill: '反馈', hp: 3, description: '受到伤害后可以获得伤害来源的一张手牌' },
                    { name: '夏侯惇', skill: '刚烈', hp: 4, description: '受到伤害后可以进行判定造成伤害' }
                ];
                
                this.cardTypes = ['attack', 'dodge', 'peach', 'equip'];
                this.roles = ['lord', 'loyal', 'rebel', 'spy'];
                this.roleNames = { 'lord': '主公', 'loyal': '忠臣', 'rebel': '反贼', 'spy': '内奸' };
                
                this.gameStats = JSON.parse(localStorage.getItem('threeKingdomsStats') || '{}');
                
                this.init();
            }

            init() {
                this.updateDisplay();
                this.addLogEntry('游戏初始化完成，点击新游戏开始');
            }

            newGame() {
                this.gameStarted = false;
                this.currentPlayerIndex = 0;
                this.gamePhase = 'prepare';
                this.roundCount = 0;
                this.deckCards = 24;
                this.discardCards = 0;
                this.selectedCard = null;
                this.gameLog = [];
                
                // 创建玩家
                this.createPlayers();
                this.assignRoles();
                this.updateDisplay();
                this.addLogEntry('新游戏开始！各玩家开始选择武将');
                
                document.getElementById('winnerModal').style.display = 'none';
                this.showCharacterSelection();
            }

            createPlayers() {
                this.players = [];
                const playerNames = ['玩家1', '玩家2', '玩家3', '玩家4', '玩家5'];
                
                for (let i = 0; i < 5; i++) {
                    this.players.push({
                        id: i,
                        name: playerNames[i],
                        character: null,
                        role: null,
                        hp: 4,
                        maxHp: 4,
                        handCards: [],
                        equipment: [],
                        alive: true,
                        isAI: i > 0 // 除了玩家1，其他都是AI
                    });
                }
            }

            assignRoles() {
                const roles = ['lord', 'loyal', 'loyal', 'rebel', 'spy'];
                const shuffledRoles = this.shuffleArray([...roles]);
                
                this.players.forEach((player, index) => {
                    player.role = shuffledRoles[index];
                    if (player.role === 'lord') {
                        player.maxHp = 5;
                        player.hp = 5;
                    }
                });
            }

            showCharacterSelection() {
                const selectionDiv = document.getElementById('characterSelection');
                const charactersGrid = document.getElementById('charactersGrid');
                
                charactersGrid.innerHTML = '';
                
                // 随机选择可用武将
                const availableCharacters = this.shuffleArray([...this.characters]).slice(0, 8);
                
                availableCharacters.forEach(character => {
                    const characterCard = document.createElement('div');
                    characterCard.className = 'character-card';
                    characterCard.onclick = () => this.selectCharacter(character);
                    characterCard.innerHTML = `
                        <div class="character-name">${character.name}</div>
                        <div class="character-skill">${character.skill}</div>
                        <div class="character-skill" style="font-size: 0.7rem;">${character.description}</div>
                    `;
                    charactersGrid.appendChild(characterCard);
                });
                
                selectionDiv.style.display = 'block';
            }

            selectCharacter(character) {
                document.querySelectorAll('.character-card.selected').forEach(card => {
                    card.classList.remove('selected');
                });
                
                event.target.closest('.character-card').classList.add('selected');
                this.selectedCharacter = character;
            }

            confirmCharacter() {
                if (!this.selectedCharacter) {
                    alert('请先选择一个武将！');
                    return;
                }
                
                this.players[0].character = this.selectedCharacter;
                this.players[0].hp = this.selectedCharacter.hp;
                this.players[0].maxHp = this.selectedCharacter.hp;
                
                // AI自动选择武将
                for (let i = 1; i < this.players.length; i++) {
                    const availableCharacters = this.characters.filter(char => 
                        !this.players.some(p => p.character && p.character.name === char.name)
                    );
                    
                    if (availableCharacters.length > 0) {
                        const randomCharacter = availableCharacters[Math.floor(Math.random() * availableCharacters.length)];
                        this.players[i].character = randomCharacter;
                        this.players[i].hp = randomCharacter.hp;
                        this.players[i].maxHp = randomCharacter.hp;
                    }
                }
                
                document.getElementById('characterSelection').style.display = 'none';
                this.startGame();
            }

            randomCharacter() {
                const availableCharacters = this.characters;
                const randomCharacter = availableCharacters[Math.floor(Math.random() * availableCharacters.length)];
                
                document.querySelectorAll('.character-card.selected').forEach(card => {
                    card.classList.remove('selected');
                });
                
                // 找到对应的武将卡片并选中
                const characterCards = document.querySelectorAll('.character-card');
                characterCards.forEach(card => {
                    if (card.querySelector('.character-name').textContent === randomCharacter.name) {
                        card.classList.add('selected');
                    }
                });
                
                this.selectedCharacter = randomCharacter;
            }

            startGame() {
                this.gameStarted = true;
                this.gamePhase = 'draw';
                this.currentPlayerIndex = this.players.findIndex(p => p.role === 'lord');
                
                // 发初始手牌
                this.players.forEach(player => {
                    for (let i = 0; i < 4; i++) {
                        this.dealCard(player);
                    }
                });
                
                this.addLogEntry(`游戏开始！${this.players[this.currentPlayerIndex].name}(${this.players[this.currentPlayerIndex].character.name})的回合`);
                this.updateDisplay();
                this.nextPhase();
            }

            nextPhase() {
                const currentPlayer = this.players[this.currentPlayerIndex];
                
                switch (this.gamePhase) {
                    case 'draw':
                        this.drawPhase();
                        break;
                    case 'play':
                        this.playPhase();
                        break;
                    case 'discard':
                        this.discardPhase();
                        break;
                    case 'end':
                        this.endPhase();
                        break;
                }
            }

            drawPhase() {
                const currentPlayer = this.players[this.currentPlayerIndex];
                this.addLogEntry(`${currentPlayer.name} 进入摸牌阶段`);
                
                // 摸两张牌
                for (let i = 0; i < 2; i++) {
                    this.dealCard(currentPlayer);
                }
                
                this.gamePhase = 'play';
                this.updateDisplay();
                
                if (currentPlayer.isAI) {
                    setTimeout(() => this.aiPlayPhase(), 1000);
                }
            }

            playPhase() {
                const currentPlayer = this.players[this.currentPlayerIndex];
                this.addLogEntry(`${currentPlayer.name} 进入出牌阶段`);
                this.updateDisplay();
            }

            aiPlayPhase() {
                const currentPlayer = this.players[this.currentPlayerIndex];
                
                // AI简单策略：随机使用一张牌或跳过
                if (currentPlayer.handCards.length > 0 && Math.random() > 0.3) {
                    const randomCard = currentPlayer.handCards[Math.floor(Math.random() * currentPlayer.handCards.length)];
                    this.aiUseCard(currentPlayer, randomCard);
                }
                
                setTimeout(() => this.endTurn(), 1500);
            }

            aiUseCard(player, card) {
                const targets = this.players.filter(p => p.alive && p.id !== player.id);
                if (targets.length === 0) return;
                
                const target = targets[Math.floor(Math.random() * targets.length)];
                
                switch (card.type) {
                    case 'attack':
                        if (target.hp > 0) {
                            this.addLogEntry(`${player.name} 对 ${target.name} 使用了杀`);
                            this.dealDamage(target, 1);
                        }
                        break;
                    case 'peach':
                        if (player.hp < player.maxHp) {
                            this.addLogEntry(`${player.name} 使用了桃，回复1点体力`);
                            player.hp = Math.min(player.hp + 1, player.maxHp);
                        }
                        break;
                }
                
                // 移除使用的牌
                const cardIndex = player.handCards.indexOf(card);
                if (cardIndex > -1) {
                    player.handCards.splice(cardIndex, 1);
                    this.discardCards++;
                }
            }

            discardPhase() {
                const currentPlayer = this.players[this.currentPlayerIndex];
                const excessCards = currentPlayer.handCards.length - currentPlayer.hp;
                
                if (excessCards > 0) {
                    this.addLogEntry(`${currentPlayer.name} 需要弃置 ${excessCards} 张牌`);
                    
                    if (currentPlayer.isAI) {
                        // AI自动弃牌
                        for (let i = 0; i < excessCards; i++) {
                            if (currentPlayer.handCards.length > 0) {
                                const discardedCard = currentPlayer.handCards.pop();
                                this.discardCards++;
                            }
                        }
                    } else {
                        // 玩家手动弃牌（简化处理）
                        while (currentPlayer.handCards.length > currentPlayer.hp) {
                            currentPlayer.handCards.pop();
                            this.discardCards++;
                        }
                    }
                }
                
                this.gamePhase = 'end';
                this.nextPhase();
            }

            endPhase() {
                this.gamePhase = 'draw';
                this.nextPlayer();
                
                if (this.checkWinCondition()) {
                    return;
                }
                
                this.updateDisplay();
                setTimeout(() => this.nextPhase(), 500);
            }

            nextPlayer() {
                do {
                    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
                } while (!this.players[this.currentPlayerIndex].alive);
                
                if (this.currentPlayerIndex === 0) {
                    this.roundCount++;
                }
            }

            endTurn() {
                this.gamePhase = 'discard';
                this.nextPhase();
            }

            drawCard() {
                const currentPlayer = this.players[this.currentPlayerIndex];
                if (!this.gameStarted || currentPlayer.isAI || this.gamePhase !== 'play') return;
                
                this.dealCard(currentPlayer);
                this.updateDisplay();
            }

            dealCard(player) {
                if (this.deckCards <= 0) {
                    this.reshuffleDeck();
                }
                
                const cardTypes = ['attack', 'dodge', 'peach', 'equip'];
                const randomType = cardTypes[Math.floor(Math.random() * cardTypes.length)];
                
                const card = {
                    id: Date.now() + Math.random(),
                    type: randomType,
                    name: this.getCardName(randomType),
                    suit: ['♠', '♥', '♣', '♦'][Math.floor(Math.random() * 4)],
                    value: Math.floor(Math.random() * 13) + 1
                };
                
                player.handCards.push(card);
                this.deckCards--;
            }

            getCardName(type) {
                const names = {
                    'attack': '杀',
                    'dodge': '闪',
                    'peach': '桃',
                    'equip': '装备'
                };
                return names[type] || '未知';
            }

            reshuffleDeck() {
                this.deckCards = this.discardCards;
                this.discardCards = 0;
                this.addLogEntry('重新洗牌');
            }

            useCard(cardType) {
                const currentPlayer = this.players[this.currentPlayerIndex];
                if (!this.gameStarted || currentPlayer.isAI || this.gamePhase !== 'play') return;
                
                const card = currentPlayer.handCards.find(c => c.type === cardType);
                if (!card) {
                    this.addLogEntry('没有可用的牌');
                    return;
                }
                
                this.executeCardEffect(currentPlayer, card);
                
                // 移除使用的牌
                const cardIndex = currentPlayer.handCards.indexOf(card);
                currentPlayer.handCards.splice(cardIndex, 1);
                this.discardCards++;
                
                this.updateDisplay();
            }

            executeCardEffect(player, card) {
                const enemies = this.players.filter(p => p.alive && p.id !== player.id && this.isEnemy(player, p));
                
                switch (card.type) {
                    case 'attack':
                        if (enemies.length > 0) {
                            const target = enemies[Math.floor(Math.random() * enemies.length)];
                            this.addLogEntry(`${player.name} 对 ${target.name} 使用了杀`);
                            this.dealDamage(target, 1);
                        }
                        break;
                        
                    case 'peach':
                        if (player.hp < player.maxHp) {
                            player.hp++;
                            this.addLogEntry(`${player.name} 使用了桃，回复1点体力`);
                        }
                        break;
                        
                    case 'equip':
                        player.equipment.push(card);
                        this.addLogEntry(`${player.name} 装备了 ${card.name}`);
                        break;
                }
            }

            isEnemy(player1, player2) {
                if (player1.role === 'lord') {
                    return player2.role === 'rebel' || player2.role === 'spy';
                } else if (player1.role === 'loyal') {
                    return player2.role === 'rebel' || player2.role === 'spy';
                } else if (player1.role === 'rebel') {
                    return player2.role === 'lord' || player2.role === 'loyal' || player2.role === 'spy';
                } else if (player1.role === 'spy') {
                    return true; // 内奸与所有人为敌
                }
                return false;
            }

            dealDamage(target, damage) {
                target.hp -= damage;
                
                if (target.hp <= 0) {
                    target.alive = false;
                    this.addLogEntry(`${target.name}(${target.character.name}) 阵亡`, true);
                    
                    // 奖励和惩罚
                    this.handleDeathReward(target);
                }
                
                this.updateDisplay();
            }

            handleDeathReward(deadPlayer) {
                const killer = this.players[this.currentPlayerIndex];
                
                if (deadPlayer.role === 'rebel') {
                    // 杀死反贼奖励摸牌
                    for (let i = 0; i < 3; i++) {
                        this.dealCard(killer);
                    }
                    this.addLogEntry(`${killer.name} 击杀反贼，奖励摸3张牌`);
                } else if (deadPlayer.role === 'loyal' && killer.role === 'lord') {
                    // 主公误杀忠臣惩罚
                    killer.handCards = [];
                    killer.equipment = [];
                    this.addLogEntry(`${killer.name} 误杀忠臣，弃置所有牌`);
                }
            }

            checkWinCondition() {
                const alivePlayers = this.players.filter(p => p.alive);
                const lordAlive = alivePlayers.some(p => p.role === 'lord');
                const rebelsAlive = alivePlayers.some(p => p.role === 'rebel');
                const spyAlive = alivePlayers.some(p => p.role === 'spy');
                
                if (!lordAlive) {
                    if (spyAlive && alivePlayers.length === 1) {
                        this.endGame('spy', '内奸获胜！');
                        return true;
                    } else if (rebelsAlive) {
                        this.endGame('rebel', '反贼获胜！');
                        return true;
                    }
                } else if (!rebelsAlive && !spyAlive) {
                    this.endGame('loyal', '主公和忠臣获胜！');
                    return true;
                }
                
                return false;
            }

            endGame(winnerRole, message) {
                this.gameStarted = false;
                
                // 更新统计
                if (!this.gameStats[winnerRole]) {
                    this.gameStats[winnerRole] = 0;
                }
                this.gameStats[winnerRole]++;
                localStorage.setItem('threeKingdomsStats', JSON.stringify(this.gameStats));
                
                document.getElementById('winnerTitle').textContent = '🎉 游戏结束 🎉';
                document.getElementById('winnerText').textContent = message;
                document.getElementById('winnerModal').style.display = 'flex';
                
                this.addLogEntry(message, true);
            }

            closeWinnerModal() {
                document.getElementById('winnerModal').style.display = 'none';
                this.newGame();
            }

            showRules() {
                alert(`三国杀游戏规则：
                
身份介绍：
• 主公：统领全局，需要消灭所有反贼和内奸
• 忠臣：辅佐主公，与主公共同获胜
• 反贼：推翻主公，杀死主公即可获胜
• 内奸：最后存活的玩家，需要在最后单挑主公

游戏流程：
1. 摸牌阶段：摸两张牌
2. 出牌阶段：可以使用手牌
3. 弃牌阶段：手牌数不能超过当前体力值
4. 结束阶段：回合结束

基本牌：
• 杀：攻击其他角色
• 闪：抵挡杀的攻击
• 桃：回复1点体力

获胜条件：
• 主公/忠臣：杀死所有反贼和内奸
• 反贼：杀死主公
• 内奸：成为最后存活的角色`);
            }

            showStats() {
                let statsText = '游戏统计：\n\n';
                const roleNames = { 'lord': '主公/忠臣', 'rebel': '反贼', 'spy': '内奸' };
                
                Object.entries(this.gameStats).forEach(([role, wins]) => {
                    statsText += `${roleNames[role] || role}：${wins}次获胜\n`;
                });
                
                if (Object.keys(this.gameStats).length === 0) {
                    statsText += '暂无统计数据';
                }
                
                alert(statsText);
            }

            selectCard(cardElement, card) {
                // 清除之前的选择
                document.querySelectorAll('.card.selected').forEach(c => {
                    c.classList.remove('selected');
                });
                
                cardElement.classList.add('selected');
                this.selectedCard = card;
            }

            updateDisplay() {
                // 更新当前玩家信息
                const currentPlayer = this.players[this.currentPlayerIndex];
                if (currentPlayer) {
                    document.getElementById('currentPlayer').textContent = 
                        `${currentPlayer.name}(${currentPlayer.character ? currentPlayer.character.name : '未选择'})`;
                }
                
                document.getElementById('gamePhase').textContent = this.getPhaseText();
                document.getElementById('phaseDisplay').textContent = this.getPhaseText();
                document.getElementById('roundCount').textContent = this.roundCount;
                document.getElementById('aliveCount').textContent = this.players.filter(p => p.alive).length;
                document.getElementById('deckCount').textContent = this.deckCards;
                document.getElementById('discardCount').textContent = this.discardCards;
                
                // 更新玩家列表
                this.updatePlayersDisplay();
                
                // 更新手牌显示
                this.updateHandCardsDisplay();
                
                // 更新按钮状态
                this.updateButtonStates();
            }

            updatePlayersDisplay() {
                const container = document.getElementById('playersContainer');
                container.innerHTML = '';
                
                this.players.forEach((player, index) => {
                    const playerCard = document.createElement('div');
                    playerCard.className = `player-card ${index === this.currentPlayerIndex ? 'current' : ''} ${!player.alive ? 'dead' : ''}`;
                    
                    const hpPercentage = (player.hp / player.maxHp) * 100;
                    let hpClass = '';
                    if (hpPercentage <= 25) hpClass = 'critical';
                    else if (hpPercentage <= 50) hpClass = 'low';
                    
                    playerCard.innerHTML = `
                        <div class="player-name">${player.name}</div>
                        <div class="player-role ${player.role}">${this.roleNames[player.role] || '未知'}</div>
                        <div style="font-size: 0.8rem; color: #666;">${player.character ? player.character.name : '未选择武将'}</div>
                        <div class="hp-bar">
                            <div class="hp-fill ${hpClass}" style="width: ${hpPercentage}%"></div>
                        </div>
                        <div class="player-stats">
                            <span>体力: ${player.hp}/${player.maxHp}</span>
                            <span>手牌: ${player.handCards.length}</span>
                        </div>
                    `;
                    
                    container.appendChild(playerCard);
                });
            }

            updateHandCardsDisplay() {
                const container = document.getElementById('handCards');
                container.innerHTML = '';
                
                if (this.gameStarted && !this.players[this.currentPlayerIndex].isAI) {
                    const currentPlayer = this.players[this.currentPlayerIndex];
                    
                    currentPlayer.handCards.forEach(card => {
                        const cardElement = document.createElement('div');
                        cardElement.className = 'card';
                        cardElement.onclick = () => this.selectCard(cardElement, card);
                        
                        cardElement.innerHTML = `
                            <div class="card-name">${card.name}</div>
                            <div class="card-type">${card.type}</div>
                            <div style="font-size: 0.7rem;">${card.suit}${card.value}</div>
                        `;
                        
                        container.appendChild(cardElement);
                    });
                }
            }

            updateButtonStates() {
                const gameRunning = this.gameStarted && this.gamePhase === 'play' && !this.players[this.currentPlayerIndex].isAI;
                
                document.getElementById('endTurnBtn').disabled = !gameRunning;
                document.getElementById('attackBtn').disabled = !gameRunning;
                document.getElementById('dodgeBtn').disabled = !gameRunning;
                document.getElementById('peachBtn').disabled = !gameRunning;
                document.getElementById('equipBtn').disabled = !gameRunning;
            }

            getPhaseText() {
                const phases = {
                    'prepare': '准备阶段',
                    'draw': '摸牌阶段',
                    'play': '出牌阶段',
                    'discard': '弃牌阶段',
                    'end': '结束阶段'
                };
                return phases[this.gamePhase] || '未知阶段';
            }

            addLogEntry(message, important = false) {
                this.gameLog.push({ message, important, timestamp: new Date() });
                
                const logContainer = document.getElementById('gameLog');
                const logEntry = document.createElement('div');
                logEntry.className = `log-entry ${important ? 'important' : ''}`;
                logEntry.textContent = `${new Date().toLocaleTimeString()}: ${message}`;
                
                logContainer.appendChild(logEntry);
                logContainer.scrollTop = logContainer.scrollHeight;
                
                // 限制日志条目数量
                if (this.gameLog.length > 50) {
                    this.gameLog.shift();
                    if (logContainer.firstChild) {
                        logContainer.removeChild(logContainer.firstChild);
                    }
                }
            }

            shuffleArray(array) {
                const shuffled = [...array];
                for (let i = shuffled.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
                }
                return shuffled;
            }
        }

        // 初始化游戏
        const threeKingdoms = new ThreeKingdomsGame();