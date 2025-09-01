class FlightChessGame {
            constructor() {
                this.players = [
                    { id: 0, name: '红方', color: 'red', pieces: [], position: 'home' },
                    { id: 1, name: '蓝方', color: 'blue', pieces: [], position: 'home' },
                    { id: 2, name: '绿方', color: 'green', pieces: [], position: 'home' },
                    { id: 3, name: '黄方', color: 'yellow', pieces: [], position: 'home' }
                ];
                this.currentPlayer = 0;
                this.gameStarted = false;
                this.gameTime = 0;
                this.roundCount = 1;
                this.diceValue = 0;
                this.autoPlay = false;
                this.board = [];
                this.gameRecords = JSON.parse(localStorage.getItem('flightChessRecords') || '[]');
                
                this.init();
            }

            init() {
                this.createBoard();
                this.initializePieces();
                this.updateDisplay();
                this.startTimer();
            }

            createBoard() {
                const board = document.getElementById('gameBoard');
                board.innerHTML = '';
                
                // 创建15x15的棋盘
                for (let i = 0; i < 15; i++) {
                    this.board[i] = [];
                    for (let j = 0; j < 15; j++) {
                        const cell = document.createElement('div');
                        cell.className = 'cell';
                        cell.dataset.row = i;
                        cell.dataset.col = j;
                        
                        // 设置特殊格子类型
                        this.setCellType(cell, i, j);
                        
                        board.appendChild(cell);
                        this.board[i][j] = cell;
                    }
                }
            }

            setCellType(cell, row, col) {
                // 外圈路径
                if ((row === 0 || row === 14) && col >= 6 && col <= 8) {
                    cell.classList.add('path');
                } else if ((col === 0 || col === 14) && row >= 6 && row <= 8) {
                    cell.classList.add('path');
                } else if (row === 6 && (col <= 5 || col >= 9)) {
                    cell.classList.add('path');
                } else if (row === 8 && (col <= 5 || col >= 9)) {
                    cell.classList.add('path');
                } else if (col === 6 && (row <= 5 || row >= 9)) {
                    cell.classList.add('path');
                } else if (col === 8 && (row <= 5 || row >= 9)) {
                    cell.classList.add('path');
                }
                
                // 家园区域
                else if (row <= 5 && col <= 5) {
                    cell.classList.add('home');
                    cell.dataset.player = '0'; // 红方
                } else if (row <= 5 && col >= 9) {
                    cell.classList.add('home');
                    cell.dataset.player = '1'; // 蓝方
                } else if (row >= 9 && col <= 5) {
                    cell.classList.add('home');
                    cell.dataset.player = '2'; // 绿方
                } else if (row >= 9 && col >= 9) {
                    cell.classList.add('home');
                    cell.dataset.player = '3'; // 黄方
                }
                
                // 终点区域
                else if (row >= 6 && row <= 8 && col >= 6 && col <= 8) {
                    cell.classList.add('finish');
                }
                
                // 快速通道
                if ((row === 1 && col === 7) || (row === 7 && col === 1) || 
                    (row === 7 && col === 13) || (row === 13 && col === 7)) {
                    cell.classList.add('shortcut');
                }
                
                // 安全区
                if ((row === 2 && col === 7) || (row === 7 && col === 2) || 
                    (row === 7 && col === 12) || (row === 12 && col === 7)) {
                    cell.classList.add('safe-zone');
                }
            }

            initializePieces() {
                this.players.forEach((player, playerIndex) => {
                    player.pieces = [];
                    for (let i = 0; i < 4; i++) {
                        const piece = {
                            id: `${playerIndex}-${i}`,
                            player: playerIndex,
                            position: 'home',
                            row: this.getHomePosition(playerIndex).row + Math.floor(i / 2),
                            col: this.getHomePosition(playerIndex).col + (i % 2)
                        };
                        player.pieces.push(piece);
                        this.renderPiece(piece);
                    }
                });
            }

            getHomePosition(playerIndex) {
                const positions = [
                    { row: 1, col: 1 }, // 红方
                    { row: 1, col: 11 }, // 蓝方
                    { row: 11, col: 1 }, // 绿方
                    { row: 11, col: 11 }  // 黄方
                ];
                return positions[playerIndex];
            }

            renderPiece(piece) {
                const existingPiece = document.getElementById(piece.id);
                if (existingPiece) {
                    existingPiece.remove();
                }
                
                const pieceElement = document.createElement('div');
                pieceElement.className = `piece ${this.players[piece.player].color}`;
                pieceElement.id = piece.id;
                pieceElement.onclick = () => this.selectPiece(piece);
                
                const cell = this.board[piece.row][piece.col];
                cell.appendChild(pieceElement);
            }

            selectPiece(piece) {
                if (!this.gameStarted || this.currentPlayer !== piece.player || this.diceValue === 0) {
                    return;
                }
                
                // 清除之前的选择
                document.querySelectorAll('.piece.selected').forEach(p => {
                    p.classList.remove('selected');
                });
                
                const pieceElement = document.getElementById(piece.id);
                pieceElement.classList.add('selected');
                
                // 移动棋子
                this.movePiece(piece);
            }

            movePiece(piece) {
                if (piece.position === 'home' && this.diceValue !== 6) {
                    this.showMessage('需要掷出6点才能出发');
                    return;
                }
                
                let newRow = piece.row;
                let newCol = piece.col;
                
                if (piece.position === 'home') {
                    // 从家园出发到起始位置
                    const startPos = this.getStartPosition(piece.player);
                    newRow = startPos.row;
                    newCol = startPos.col;
                    piece.position = 'path';
                } else {
                    // 在路径上移动
                    const nextPos = this.getNextPosition(piece, this.diceValue);
                    newRow = nextPos.row;
                    newCol = nextPos.col;
                    piece.position = nextPos.position;
                }
                
                // 检查是否有其他棋子
                const targetCell = this.board[newRow][newCol];
                const existingPieces = targetCell.querySelectorAll('.piece');
                
                existingPieces.forEach(existingPiece => {
                    const existingPieceId = existingPiece.id;
                    const [existingPlayer, existingIndex] = existingPieceId.split('-').map(Number);
                    
                    if (existingPlayer !== piece.player) {
                        // 撞飞对方棋子
                        this.sendPieceHome(existingPlayer, existingIndex);
                        this.showMessage(`${this.players[piece.player].name} 撞飞了 ${this.players[existingPlayer].name} 的棋子！`);
                    }
                });
                
                // 更新棋子位置
                piece.row = newRow;
                piece.col = newCol;
                this.renderPiece(piece);
                
                // 检查获胜条件
                if (this.checkWin(piece.player)) {
                    this.endGame(piece.player);
                    return;
                }
                
                // 如果不是掷出6点，切换玩家
                if (this.diceValue !== 6) {
                    this.nextPlayer();
                }
                
                this.diceValue = 0;
                this.updateDisplay();
            }

            getStartPosition(playerIndex) {
                const positions = [
                    { row: 6, col: 5 }, // 红方起始
                    { row: 5, col: 8 }, // 蓝方起始
                    { row: 8, col: 9 }, // 绿方起始
                    { row: 9, col: 6 }  // 黄方起始
                ];
                return positions[playerIndex];
            }

            getNextPosition(piece, steps) {
                // 简化的位置计算，实际需要根据棋盘路径规则
                let newRow = piece.row;
                let newCol = piece.col;
                
                // 这里应该实现完整的路径计算逻辑
                // 暂时使用简单的移动方式
                for (let i = 0; i < steps; i++) {
                    if (newCol < 14 && newRow === 6) newCol++;
                    else if (newRow < 14 && newCol === 14) newRow++;
                    else if (newCol > 0 && newRow === 14) newCol--;
                    else if (newRow > 0 && newCol === 0) newRow--;
                }
                
                return { row: newRow, col: newCol, position: 'path' };
            }

            sendPieceHome(playerIndex, pieceIndex) {
                const piece = this.players[playerIndex].pieces[pieceIndex];
                const homePos = this.getHomePosition(playerIndex);
                piece.row = homePos.row + Math.floor(pieceIndex / 2);
                piece.col = homePos.col + (pieceIndex % 2);
                piece.position = 'home';
                this.renderPiece(piece);
            }

            checkWin(playerIndex) {
                return this.players[playerIndex].pieces.every(piece => piece.position === 'finish');
            }

            rollDice() {
                if (!this.gameStarted) {
                    this.gameStarted = true;
                }
                
                const dice1 = document.getElementById('dice1');
                const dice2 = document.getElementById('dice2');
                
                dice1.classList.add('rolling');
                dice2.classList.add('rolling');
                
                setTimeout(() => {
                    this.diceValue = Math.floor(Math.random() * 6) + 1;
                    const diceValue2 = Math.floor(Math.random() * 6) + 1;
                    
                    dice1.textContent = this.diceValue;
                    dice2.textContent = diceValue2;
                    
                    dice1.classList.remove('rolling');
                    dice2.classList.remove('rolling');
                    
                    this.diceValue = this.diceValue; // 使用第一个骰子的值
                    
                    document.getElementById('diceResult').textContent = this.diceValue;
                    
                    this.showMessage(`${this.players[this.currentPlayer].name} 掷出了 ${this.diceValue} 点`);
                    
                    // AI自动移动
                    if (this.autoPlay) {
                        setTimeout(() => this.autoMovePiece(), 1000);
                    }
                    
                    this.updateDisplay();
                }, 500);
            }

            autoMovePiece() {
                const currentPlayerPieces = this.players[this.currentPlayer].pieces;
                const movablePieces = currentPlayerPieces.filter(piece => {
                    return piece.position !== 'home' || this.diceValue === 6;
                });
                
                if (movablePieces.length > 0) {
                    const randomPiece = movablePieces[Math.floor(Math.random() * movablePieces.length)];
                    this.selectPiece(randomPiece);
                }
            }

            nextPlayer() {
                this.currentPlayer = (this.currentPlayer + 1) % 4;
                if (this.currentPlayer === 0) {
                    this.roundCount++;
                }
                this.updateDisplay();
            }

            newGame() {
                this.currentPlayer = 0;
                this.gameStarted = false;
                this.gameTime = 0;
                this.roundCount = 1;
                this.diceValue = 0;
                this.autoPlay = false;
                
                document.getElementById('dice1').textContent = '🎲';
                document.getElementById('dice2').textContent = '🎲';
                document.getElementById('diceResult').textContent = '-';
                
                // 清除所有棋子
                document.querySelectorAll('.piece').forEach(piece => piece.remove());
                
                this.initializePieces();
                this.updateDisplay();
                this.showMessage('新游戏开始！点击掷骰子');
                
                document.getElementById('winnerModal').style.display = 'none';
            }

            toggleAutoPlay() {
                this.autoPlay = !this.autoPlay;
                const btn = document.getElementById('autoPlayBtn');
                btn.textContent = this.autoPlay ? '停止自动' : '自动游戏';
                btn.style.background = this.autoPlay ? '#ff4757' : '#667eea';
            }

            showRules() {
                alert(`飞行棋游戏规则：
                
1. 4名玩家轮流掷骰子移动棋子
2. 掷出6点才能让棋子从家园出发
3. 掷出6点可以再掷一次
4. 棋子可以撞飞其他玩家的棋子
5. 被撞飞的棋子回到家园
6. 安全区内的棋子不能被撞飞
7. 快速通道可以快速移动
8. 所有棋子到达终点的玩家获胜`);
            }

            showRecords() {
                if (this.gameRecords.length === 0) {
                    alert('暂无游戏记录');
                    return;
                }
                
                let recordsText = '游戏记录：\n\n';
                this.gameRecords.slice(-10).forEach((record, index) => {
                    recordsText += `${index + 1}. ${record.winner} 获胜 (${record.date})\n`;
                });
                
                alert(recordsText);
            }

            endGame(winnerIndex) {
                const winner = this.players[winnerIndex];
                const record = {
                    winner: winner.name,
                    date: new Date().toLocaleDateString(),
                    time: this.formatTime(this.gameTime),
                    rounds: this.roundCount
                };
                
                this.gameRecords.push(record);
                localStorage.setItem('flightChessRecords', JSON.stringify(this.gameRecords));
                
                document.getElementById('winnerText').textContent = 
                    `${winner.name} 获得胜利！游戏时间：${this.formatTime(this.gameTime)}，总轮次：${this.roundCount}`;
                document.getElementById('winnerModal').style.display = 'flex';
                
                this.showAchievement(`🏆 ${winner.name} 获得胜利！`);
            }

            closeWinnerModal() {
                document.getElementById('winnerModal').style.display = 'none';
                this.newGame();
            }

            showMessage(message) {
                document.getElementById('gameMessage').textContent = message;
                
                setTimeout(() => {
                    document.getElementById('gameMessage').textContent = 
                        this.gameStarted ? '选择要移动的棋子' : '点击掷骰子开始游戏';
                }, 3000);
            }

            showAchievement(text) {
                const achievement = document.getElementById('achievement');
                achievement.textContent = text;
                achievement.style.display = 'block';
                
                setTimeout(() => {
                    achievement.style.display = 'none';
                }, 3000);
            }

            updateDisplay() {
                const currentPlayerElement = document.getElementById('currentPlayer');
                currentPlayerElement.textContent = this.players[this.currentPlayer].name;
                currentPlayerElement.className = `current-player player-${this.players[this.currentPlayer].color}`;
                
                document.getElementById('roundCount').textContent = this.roundCount;
                document.getElementById('gameTime').textContent = this.formatTime(this.gameTime);
                
                // 更新玩家状态
                const statusContainer = document.getElementById('playersStatus');
                statusContainer.innerHTML = '';
                
                this.players.forEach((player, index) => {
                    const finishedPieces = player.pieces.filter(p => p.position === 'finish').length;
                    const homePieces = player.pieces.filter(p => p.position === 'home').length;
                    
                    const statusDiv = document.createElement('div');
                    statusDiv.className = `player-status player-${player.color}`;
                    statusDiv.innerHTML = `
                        <span>${player.name}: </span>
                        <span>完成${finishedPieces}/4, 家园${homePieces}/4</span>
                    `;
                    statusContainer.appendChild(statusDiv);
                });
            }

            startTimer() {
                setInterval(() => {
                    if (this.gameStarted) {
                        this.gameTime++;
                        this.updateDisplay();
                    }
                }, 1000);
            }

            formatTime(seconds) {
                const mins = Math.floor(seconds / 60);
                const secs = seconds % 60;
                return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            }
        }

        // 初始化游戏
        const flightChess = new FlightChessGame();