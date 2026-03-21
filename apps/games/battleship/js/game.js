class Battleship {
            constructor() {
                this.gamePhase = 'setup'; // setup, battle, finished
                this.currentPlayer = 'player';
                this.selectedShip = null;
                this.shipDirection = 'horizontal'; // horizontal, vertical
                
                this.playerBoard = Array(10).fill().map(() => Array(10).fill(0));
                this.enemyBoard = Array(10).fill().map(() => Array(10).fill(0));
                this.playerShots = Array(10).fill().map(() => Array(10).fill(0));
                this.enemyShots = Array(10).fill().map(() => Array(10).fill(0));
                
                this.ships = [
                    { name: '航空母舰', size: 5, placed: false, positions: [] },
                    { name: '战列舰', size: 4, placed: false, positions: [] },
                    { name: '巡洋舰', size: 3, placed: false, positions: [] },
                    { name: '驱逐舰', size: 3, placed: false, positions: [] },
                    { name: '潜水艇', size: 2, placed: false, positions: [] }
                ];
                
                this.enemyShips = [
                    { name: '航空母舰', size: 5, placed: false, positions: [] },
                    { name: '战列舰', size: 4, placed: false, positions: [] },
                    { name: '巡洋舰', size: 3, placed: false, positions: [] },
                    { name: '驱逐舰', size: 3, placed: false, positions: [] },
                    { name: '潜水艇', size: 2, placed: false, positions: [] }
                ];
                
                this.stats = {
                    playerShips: 5,
                    enemyShips: 5,
                    hits: 0,
                    totalShots: 0
                };
                
                this.init();
            }

            init() {
                this.createBoards();
                this.createShipList();
                this.placeEnemyShips();
                this.updateDisplay();
            }

            createBoards() {
                const playerBoard = document.getElementById('playerBoard');
                const enemyBoard = document.getElementById('enemyBoard');
                
                playerBoard.innerHTML = '';
                enemyBoard.innerHTML = '';
                
                // 创建玩家棋盘
                for (let row = 0; row < 10; row++) {
                    for (let col = 0; col < 10; col++) {
                        const cell = document.createElement('div');
                        cell.className = 'cell';
                        cell.dataset.row = row;
                        cell.dataset.col = col;
                        cell.addEventListener('click', () => this.handlePlayerBoardClick(row, col));
                        cell.addEventListener('mouseenter', () => this.handlePlayerBoardHover(row, col));
                        cell.addEventListener('mouseleave', () => this.clearHighlight('player'));
                        playerBoard.appendChild(cell);
                    }
                }
                
                // 创建敌人棋盘
                for (let row = 0; row < 10; row++) {
                    for (let col = 0; col < 10; col++) {
                        const cell = document.createElement('div');
                        cell.className = 'cell';
                        cell.dataset.row = row;
                        cell.dataset.col = col;
                        cell.addEventListener('click', () => this.handleEnemyBoardClick(row, col));
                        enemyBoard.appendChild(cell);
                    }
                }
            }

            createShipList() {
                const shipList = document.getElementById('shipList');
                shipList.innerHTML = '';
                
                this.ships.forEach((ship, index) => {
                    const shipItem = document.createElement('div');
                    shipItem.className = 'ship-item';
                    shipItem.dataset.shipIndex = index;
                    
                    if (ship.placed) {
                        shipItem.classList.add('placed');
                    } else if (this.selectedShip === index) {
                        shipItem.classList.add('selected');
                    }
                    
                    shipItem.innerHTML = `
                        <span class="ship-name">${ship.name}</span>
                        <span class="ship-size">${ship.size}格</span>
                    `;
                    
                    shipItem.addEventListener('click', () => this.selectShip(index));
                    shipList.appendChild(shipItem);
                });
            }

            selectShip(index) {
                if (this.gamePhase !== 'setup' || this.ships[index].placed) return;
                
                this.selectedShip = index;
                this.createShipList();
            }

            handlePlayerBoardClick(row, col) {
                if (this.gamePhase === 'setup' && this.selectedShip !== null) {
                    this.placeShip(row, col);
                }
            }

            handlePlayerBoardHover(row, col) {
                if (this.gamePhase === 'setup' && this.selectedShip !== null) {
                    this.highlightShipPlacement(row, col);
                }
            }

            handleEnemyBoardClick(row, col) {
                if (this.gamePhase === 'battle' && this.currentPlayer === 'player') {
                    this.makeShot(row, col);
                }
            }

            highlightShipPlacement(row, col) {
                this.clearHighlight('player');
                
                if (this.selectedShip === null) return;
                
                const ship = this.ships[this.selectedShip];
                const positions = this.getShipPositions(row, col, ship.size, this.shipDirection);
                
                if (this.canPlaceShip(positions)) {
                    positions.forEach(pos => {
                        const cell = document.querySelector(`#playerBoard [data-row="${pos.row}"][data-col="${pos.col}"]`);
                        if (cell) cell.classList.add('highlight');
                    });
                }
            }

            clearHighlight(board) {
                const boardElement = document.getElementById(board === 'player' ? 'playerBoard' : 'enemyBoard');
                boardElement.querySelectorAll('.cell').forEach(cell => {
                    cell.classList.remove('highlight');
                });
            }

            getShipPositions(row, col, size, direction) {
                const positions = [];
                
                for (let i = 0; i < size; i++) {
                    if (direction === 'horizontal') {
                        positions.push({ row, col: col + i });
                    } else {
                        positions.push({ row: row + i, col });
                    }
                }
                
                return positions;
            }

            canPlaceShip(positions) {
                return positions.every(pos => {
                    return pos.row >= 0 && pos.row < 10 && 
                           pos.col >= 0 && pos.col < 10 && 
                           this.playerBoard[pos.row][pos.col] === 0;
                });
            }

            placeShip(row, col) {
                if (this.selectedShip === null) return;
                
                const ship = this.ships[this.selectedShip];
                const positions = this.getShipPositions(row, col, ship.size, this.shipDirection);
                
                if (!this.canPlaceShip(positions)) return;
                
                // 放置战舰
                positions.forEach(pos => {
                    this.playerBoard[pos.row][pos.col] = this.selectedShip + 1;
                });
                
                ship.placed = true;
                ship.positions = positions;
                this.selectedShip = null;
                
                this.renderPlayerBoard();
                this.createShipList();
                this.checkSetupComplete();
            }

            placeEnemyShips() {
                this.enemyShips.forEach((ship, index) => {
                    let placed = false;
                    let attempts = 0;
                    
                    while (!placed && attempts < 100) {
                        const row = Math.floor(Math.random() * 10);
                        const col = Math.floor(Math.random() * 10);
                        const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';
                        const positions = this.getShipPositions(row, col, ship.size, direction);
                        
                        if (this.canPlaceEnemyShip(positions)) {
                            positions.forEach(pos => {
                                this.enemyBoard[pos.row][pos.col] = index + 1;
                            });
                            ship.placed = true;
                            ship.positions = positions;
                            placed = true;
                        }
                        
                        attempts++;
                    }
                });
            }

            canPlaceEnemyShip(positions) {
                return positions.every(pos => {
                    return pos.row >= 0 && pos.row < 10 && 
                           pos.col >= 0 && pos.col < 10 && 
                           this.enemyBoard[pos.row][pos.col] === 0;
                });
            }

            rotateShip() {
                if (this.gamePhase !== 'setup') return;
                
                this.shipDirection = this.shipDirection === 'horizontal' ? 'vertical' : 'horizontal';
                this.clearHighlight('player');
            }

            randomPlacement() {
                if (this.gamePhase !== 'setup') return;
                
                // 清除现有布置
                this.playerBoard = Array(10).fill().map(() => Array(10).fill(0));
                this.ships.forEach(ship => {
                    ship.placed = false;
                    ship.positions = [];
                });
                
                // 随机放置所有战舰
                this.ships.forEach((ship, index) => {
                    let placed = false;
                    let attempts = 0;
                    
                    while (!placed && attempts < 100) {
                        const row = Math.floor(Math.random() * 10);
                        const col = Math.floor(Math.random() * 10);
                        const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';
                        const positions = this.getShipPositions(row, col, ship.size, direction);
                        
                        if (this.canPlaceShip(positions)) {
                            positions.forEach(pos => {
                                this.playerBoard[pos.row][pos.col] = index + 1;
                            });
                            ship.placed = true;
                            ship.positions = positions;
                            placed = true;
                        }
                        
                        attempts++;
                    }
                });
                
                this.selectedShip = null;
                this.renderPlayerBoard();
                this.createShipList();
                this.checkSetupComplete();
            }

            checkSetupComplete() {
                const allPlaced = this.ships.every(ship => ship.placed);
                const startBattleBtn = document.getElementById('startBattleBtn');
                startBattleBtn.disabled = !allPlaced;
                
                if (allPlaced) {
                    const gamePhase = document.getElementById('gamePhase');
                    gamePhase.innerHTML = `
                        <div class="phase-title">准备完成</div>
                        <div class="phase-description">点击"开始战斗"进入对战</div>
                    `;
                }
            }

            startBattle() {
                this.gamePhase = 'battle';
                this.currentPlayer = 'player';
                
                const gamePhase = document.getElementById('gamePhase');
                gamePhase.innerHTML = `
                    <div class="phase-title">战斗阶段</div>
                    <div class="phase-description">点击敌方海域进行攻击</div>
                `;
                
                const shipsPanel = document.getElementById('shipsPanel');
                shipsPanel.style.display = 'none';
                
                const startBattleBtn = document.getElementById('startBattleBtn');
                startBattleBtn.style.display = 'none';
                
                const randomBtn = document.getElementById('randomBtn');
                randomBtn.style.display = 'none';
                
                const rotateBtn = document.getElementById('rotateBtn');
                rotateBtn.style.display = 'none';
            }

            makeShot(row, col) {
                if (this.playerShots[row][col] !== 0) return;
                
                this.stats.totalShots++;
                
                if (this.enemyBoard[row][col] > 0) {
                    // 命中
                    this.playerShots[row][col] = 1;
                    this.stats.hits++;
                    
                    const shipIndex = this.enemyBoard[row][col] - 1;
                    const ship = this.enemyShips[shipIndex];
                    
                    // 检查是否击沉
                    const allHit = ship.positions.every(pos => 
                        this.playerShots[pos.row][pos.col] === 1
                    );
                    
                    if (allHit) {
                        // 击沉战舰
                        ship.positions.forEach(pos => {
                            this.playerShots[pos.row][pos.col] = 2;
                        });
                        this.stats.enemyShips--;
                        
                        if (this.stats.enemyShips === 0) {
                            this.endGame('player');
                        }
                    }
                } else {
                    // 未命中
                    this.playerShots[row][col] = -1;
                }
                
                this.renderEnemyBoard();
                this.updateDisplay();
                
                // AI回合
                if (this.gamePhase === 'battle' && this.stats.enemyShips > 0) {
                    setTimeout(() => this.makeAIShot(), 1000);
                }
            }

            makeAIShot() {
                let row, col;
                
                // 简单AI：随机攻击未攻击过的格子
                do {
                    row = Math.floor(Math.random() * 10);
                    col = Math.floor(Math.random() * 10);
                } while (this.enemyShots[row][col] !== 0);
                
                if (this.playerBoard[row][col] > 0) {
                    // 命中
                    this.enemyShots[row][col] = 1;
                    
                    const shipIndex = this.playerBoard[row][col] - 1;
                    const ship = this.ships[shipIndex];
                    
                    // 检查是否击沉
                    const allHit = ship.positions.every(pos => 
                        this.enemyShots[pos.row][pos.col] === 1
                    );
                    
                    if (allHit) {
                        // 击沉战舰
                        ship.positions.forEach(pos => {
                            this.enemyShots[pos.row][pos.col] = 2;
                        });
                        this.stats.playerShips--;
                        
                        if (this.stats.playerShips === 0) {
                            this.endGame('enemy');
                        }
                    }
                } else {
                    // 未命中
                    this.enemyShots[row][col] = -1;
                }
                
                this.renderPlayerBoard();
                this.updateDisplay();
            }

            endGame(winner) {
                this.gamePhase = 'finished';
                
                const winnerText = document.getElementById('winnerText');
                winnerText.textContent = winner === 'player' ? '你获得了胜利！' : '敌方获得了胜利！';
                
                document.getElementById('gameOverOverlay').style.display = 'flex';
            }

            renderPlayerBoard() {
                const cells = document.querySelectorAll('#playerBoard .cell');
                
                cells.forEach((cell, index) => {
                    const row = Math.floor(index / 10);
                    const col = index % 10;
                    
                    cell.className = 'cell';
                    cell.textContent = '';
                    
                    // 显示战舰
                    if (this.playerBoard[row][col] > 0) {
                        cell.classList.add('ship');
                        cell.textContent = '🚢';
                    }
                    
                    // 显示攻击结果
                    if (this.enemyShots[row][col] === 1) {
                        cell.classList.add('hit');
                        cell.textContent = '💥';
                    } else if (this.enemyShots[row][col] === -1) {
                        cell.classList.add('miss');
                        cell.textContent = '💧';
                    } else if (this.enemyShots[row][col] === 2) {
                        cell.classList.add('sunk');
                        cell.textContent = '💀';
                    }
                });
            }

            renderEnemyBoard() {
                const cells = document.querySelectorAll('#enemyBoard .cell');
                
                cells.forEach((cell, index) => {
                    const row = Math.floor(index / 10);
                    const col = index % 10;
                    
                    cell.className = 'cell';
                    cell.textContent = '';
                    
                    // 只显示攻击结果，不显示敌方战舰
                    if (this.playerShots[row][col] === 1) {
                        cell.classList.add('hit');
                        cell.textContent = '💥';
                    } else if (this.playerShots[row][col] === -1) {
                        cell.classList.add('miss');
                        cell.textContent = '💧';
                    } else if (this.playerShots[row][col] === 2) {
                        cell.classList.add('sunk');
                        cell.textContent = '💀';
                    }
                });
            }

            newGame() {
                this.gamePhase = 'setup';
                this.currentPlayer = 'player';
                this.selectedShip = null;
                this.shipDirection = 'horizontal';
                
                this.playerBoard = Array(10).fill().map(() => Array(10).fill(0));
                this.enemyBoard = Array(10).fill().map(() => Array(10).fill(0));
                this.playerShots = Array(10).fill().map(() => Array(10).fill(0));
                this.enemyShots = Array(10).fill().map(() => Array(10).fill(0));
                
                this.ships.forEach(ship => {
                    ship.placed = false;
                    ship.positions = [];
                });
                
                this.enemyShips.forEach(ship => {
                    ship.placed = false;
                    ship.positions = [];
                });
                
                this.stats = {
                    playerShips: 5,
                    enemyShips: 5,
                    hits: 0,
                    totalShots: 0
                };
                
                // 重置UI
                const gamePhase = document.getElementById('gamePhase');
                gamePhase.innerHTML = `
                    <div class="phase-title">布置阶段</div>
                    <div class="phase-description">拖拽或点击放置你的战舰</div>
                `;
                
                const shipsPanel = document.getElementById('shipsPanel');
                shipsPanel.style.display = 'block';
                
                const startBattleBtn = document.getElementById('startBattleBtn');
                startBattleBtn.style.display = 'inline-block';
                startBattleBtn.disabled = true;
                
                const randomBtn = document.getElementById('randomBtn');
                randomBtn.style.display = 'inline-block';
                
                const rotateBtn = document.getElementById('rotateBtn');
                rotateBtn.style.display = 'inline-block';
                
                document.getElementById('gameOverOverlay').style.display = 'none';
                
                this.createBoards();
                this.createShipList();
                this.placeEnemyShips();
                this.updateDisplay();
            }

            closeGameOver() {
                document.getElementById('gameOverOverlay').style.display = 'none';
            }

            updateDisplay() {
                document.getElementById('playerShips').textContent = this.stats.playerShips;
                document.getElementById('enemyShips').textContent = this.stats.enemyShips;
                document.getElementById('hits').textContent = this.stats.hits;
                document.getElementById('totalShots').textContent = this.stats.totalShots;
            }
        }

        // 全局游戏实例
        let battleship;

        // 初始化游戏
        document.addEventListener('DOMContentLoaded', () => {
            battleship = new Battleship();
        });