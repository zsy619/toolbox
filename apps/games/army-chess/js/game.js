class ArmyChess {
            constructor() {
                this.board = [];
                this.currentPlayer = 'red';
                this.selectedPiece = null;
                this.gameStarted = false;
                this.gameEnded = false;
                
                // 军棋棋子定义
                this.pieces = {
                    '司令': { rank: 1, count: 1, symbol: '司' },
                    '军长': { rank: 2, count: 1, symbol: '军' },
                    '师长': { rank: 3, count: 2, symbol: '师' },
                    '旅长': { rank: 4, count: 2, symbol: '旅' },
                    '团长': { rank: 5, count: 2, symbol: '团' },
                    '营长': { rank: 6, count: 2, symbol: '营' },
                    '连长': { rank: 7, count: 3, symbol: '连' },
                    '排长': { rank: 8, count: 3, symbol: '排' },
                    '工兵': { rank: 9, count: 3, symbol: '工' },
                    '地雷': { rank: 10, count: 3, symbol: '雷' },
                    '炸弹': { rank: 11, count: 2, symbol: '炸' },
                    '军旗': { rank: 12, count: 1, symbol: '旗' }
                };
                
                this.initBoard();
                this.bindEvents();
                this.renderBoard();
                this.updatePieceCount();
            }

            initBoard() {
                // 初始化12x5的棋盘
                this.board = Array(12).fill(null).map(() => Array(5).fill(null));
                
                // 设置特殊地形
                this.setupTerrain();
                
                // 放置棋子
                this.setupPieces();
            }

            setupTerrain() {
                // 设置铁路线（可以快速移动）
                for (let col = 1; col < 4; col++) {
                    this.board[1][col] = { type: 'railway' };
                    this.board[5][col] = { type: 'railway' };
                    this.board[6][col] = { type: 'railway' };
                    this.board[10][col] = { type: 'railway' };
                }
                
                // 设置大本营
                this.board[0][1] = { type: 'headquarters', camp: 'red' };
                this.board[0][3] = { type: 'headquarters', camp: 'red' };
                this.board[11][1] = { type: 'headquarters', camp: 'blue' };
                this.board[11][3] = { type: 'headquarters', camp: 'blue' };
            }

            setupPieces() {
                // 随机布置红军棋子（下方）
                this.placePiecesRandomly('red', 7, 11);
                
                // 随机布置蓝军棋子（上方）
                this.placePiecesRandomly('blue', 0, 4);
            }

            placePiecesRandomly(color, startRow, endRow) {
                const availablePositions = [];
                
                // 收集可用位置
                for (let row = startRow; row <= endRow; row++) {
                    for (let col = 0; col < 5; col++) {
                        if (!this.board[row][col] || 
                            (this.board[row][col].type !== 'headquarters')) {
                            availablePositions.push([row, col]);
                        }
                    }
                }
                
                // 创建棋子列表
                const pieceList = [];
                Object.entries(this.pieces).forEach(([name, info]) => {
                    for (let i = 0; i < info.count; i++) {
                        pieceList.push({
                            name,
                            rank: info.rank,
                            symbol: info.symbol,
                            color,
                            hidden: true // 军棋中棋子是暗棋
                        });
                    }
                });
                
                // 随机放置
                for (let i = 0; i < pieceList.length && availablePositions.length > 0; i++) {
                    const randomIndex = Math.floor(Math.random() * availablePositions.length);
                    const [row, col] = availablePositions[randomIndex];
                    
                    this.board[row][col] = {
                        ...this.board[row][col],
                        piece: pieceList[i]
                    };
                    
                    availablePositions.splice(randomIndex, 1);
                }
                
                // 特殊处理：军旗和地雷只能放在后排
                this.adjustSpecialPieces(color, startRow, endRow);
            }

            adjustSpecialPieces(color, startRow, endRow) {
                // 确保军旗在大本营，地雷在后两排
                const flagRow = color === 'red' ? 11 : 0;
                const mineRows = color === 'red' ? [10, 11] : [0, 1];
                
                // 找到军旗并移到大本营
                for (let row = startRow; row <= endRow; row++) {
                    for (let col = 0; col < 5; col++) {
                        if (this.board[row][col]?.piece?.name === '军旗') {
                            const piece = this.board[row][col].piece;
                            this.board[row][col] = { ...this.board[row][col], piece: null };
                            
                            // 放到大本营
                            const flagPositions = [[flagRow, 1], [flagRow, 3]];
                            const randomFlag = flagPositions[Math.floor(Math.random() * 2)];
                            this.board[randomFlag[0]][randomFlag[1]] = {
                                ...this.board[randomFlag[0]][randomFlag[1]],
                                piece
                            };
                            break;
                        }
                    }
                }
            }

            bindEvents() {
                document.getElementById('startButton').addEventListener('click', () => {
                    this.startGame();
                });

                document.getElementById('resetButton').addEventListener('click', () => {
                    this.resetGame();
                });

                document.getElementById('hintButton').addEventListener('click', () => {
                    this.showHint();
                });

                document.getElementById('chessBoard').addEventListener('click', (e) => {
                    if (e.target.classList.contains('chess-cell')) {
                        const row = parseInt(e.target.dataset.row);
                        const col = parseInt(e.target.dataset.col);
                        this.handleCellClick(row, col);
                    }
                });
            }

            startGame() {
                this.gameStarted = true;
                this.gameEnded = false;
                this.currentPlayer = 'red';
                document.getElementById('startButton').style.display = 'none';
                this.showMessage('游戏开始！红军先行', 'info');
                this.renderBoard();
            }

            resetGame() {
                this.gameStarted = false;
                this.gameEnded = false;
                this.selectedPiece = null;
                this.currentPlayer = 'red';
                this.initBoard();
                this.renderBoard();
                this.updatePieceCount();
                document.getElementById('startButton').style.display = 'inline-block';
                this.hideMessage();
            }

            handleCellClick(row, col) {
                if (!this.gameStarted || this.gameEnded) return;

                const cell = this.board[row][col];
                
                if (this.selectedPiece) {
                    // 尝试移动棋子
                    this.attemptMove(this.selectedPiece.row, this.selectedPiece.col, row, col);
                } else if (cell?.piece && cell.piece.color === this.currentPlayer) {
                    // 选择棋子
                    this.selectPiece(row, col);
                }
            }

            selectPiece(row, col) {
                this.selectedPiece = { row, col };
                this.renderBoard();
                this.showPossibleMoves(row, col);
            }

            showPossibleMoves(row, col) {
                const piece = this.board[row][col]?.piece;
                if (!piece) return;

                const moves = this.getPossibleMoves(row, col);
                moves.forEach(([r, c]) => {
                    const cell = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
                    if (cell) {
                        cell.classList.add('possible-move');
                    }
                });
            }

            getPossibleMoves(row, col) {
                const piece = this.board[row][col]?.piece;
                if (!piece) return [];

                const moves = [];
                const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]; // 上下左右

                if (piece.name === '工兵') {
                    // 工兵可以沿铁路线移动
                    return this.getEngineerMoves(row, col);
                }

                // 普通棋子只能移动一格
                directions.forEach(([dr, dc]) => {
                    const newRow = row + dr;
                    const newCol = col + dc;
                    
                    if (this.isValidPosition(newRow, newCol)) {
                        const targetCell = this.board[newRow][newCol];
                        
                        // 可以移动到空位或敌方棋子位置
                        if (!targetCell?.piece || 
                            targetCell.piece.color !== piece.color) {
                            moves.push([newRow, newCol]);
                        }
                    }
                });

                return moves;
            }

            getEngineerMoves(row, col) {
                // 工兵特殊移动规则（简化版）
                const moves = [];
                const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

                directions.forEach(([dr, dc]) => {
                    let newRow = row + dr;
                    let newCol = col + dc;
                    
                    while (this.isValidPosition(newRow, newCol)) {
                        const targetCell = this.board[newRow][newCol];
                        
                        if (!targetCell?.piece) {
                            moves.push([newRow, newCol]);
                        } else if (targetCell.piece.color !== this.currentPlayer) {
                            moves.push([newRow, newCol]);
                            break;
                        } else {
                            break;
                        }
                        
                        newRow += dr;
                        newCol += dc;
                    }
                });

                return moves;
            }

            attemptMove(fromRow, fromCol, toRow, toCol) {
                const piece = this.board[fromRow][fromCol]?.piece;
                const target = this.board[toRow][toCol];

                if (!piece) return;

                const possibleMoves = this.getPossibleMoves(fromRow, fromCol);
                const isValidMove = possibleMoves.some(([r, c]) => r === toRow && c === toCol);

                if (!isValidMove) {
                    this.showMessage('无效移动！', 'error');
                    this.clearSelection();
                    return;
                }

                // 处理战斗
                if (target?.piece) {
                    const battleResult = this.resolveBattle(piece, target.piece);
                    this.showMessage(battleResult.message, battleResult.type);
                    
                    if (battleResult.winner === piece) {
                        this.movePiece(fromRow, fromCol, toRow, toCol);
                    } else if (battleResult.winner === target.piece) {
                        // 攻击方失败，移除攻击方棋子
                        this.board[fromRow][fromCol] = { ...this.board[fromRow][fromCol], piece: null };
                        this.revealPiece(toRow, toCol);
                    } else {
                        // 同归于尽
                        this.board[fromRow][fromCol] = { ...this.board[fromRow][fromCol], piece: null };
                        this.board[toRow][toCol] = { ...this.board[toRow][toCol], piece: null };
                    }
                } else {
                    this.movePiece(fromRow, fromCol, toRow, toCol);
                    this.showMessage(`${piece.name}移动到新位置`, 'info');
                }

                this.clearSelection();
                this.checkGameEnd();
                this.switchPlayer();
                this.updatePieceCount();
                this.renderBoard();
            }

            movePiece(fromRow, fromCol, toRow, toCol) {
                const piece = this.board[fromRow][fromCol].piece;
                this.board[toRow][toCol] = { ...this.board[toRow][toCol], piece };
                this.board[fromRow][fromCol] = { ...this.board[fromRow][fromCol], piece: null };
                this.revealPiece(toRow, toCol);
            }

            revealPiece(row, col) {
                const piece = this.board[row][col]?.piece;
                if (piece) {
                    piece.hidden = false;
                }
            }

            resolveBattle(attacker, defender) {
                // 军棋战斗规则
                this.revealPiece(this.selectedPiece.row, this.selectedPiece.col);
                
                // 特殊规则
                if (defender.name === '地雷') {
                    if (attacker.name === '工兵') {
                        return {
                            winner: attacker,
                            message: '工兵成功排雷！',
                            type: 'success'
                        };
                    } else {
                        return {
                            winner: defender,
                            message: `${attacker.name}触雷阵亡！`,
                            type: 'error'
                        };
                    }
                }

                if (defender.name === '军旗') {
                    return {
                        winner: attacker,
                        message: `${attacker.name}夺取军旗！游戏结束！`,
                        type: 'success'
                    };
                }

                if (attacker.name === '炸弹') {
                    return {
                        winner: null,
                        message: '炸弹爆炸！同归于尽！',
                        type: 'info'
                    };
                }

                if (defender.name === '炸弹') {
                    return {
                        winner: null,
                        message: '触发炸弹！同归于尽！',
                        type: 'info'
                    };
                }

                // 按军衔比较
                if (attacker.rank < defender.rank) {
                    return {
                        winner: attacker,
                        message: `${attacker.name}击败${defender.name}！`,
                        type: 'success'
                    };
                } else if (attacker.rank > defender.rank) {
                    return {
                        winner: defender,
                        message: `${defender.name}击败${attacker.name}！`,
                        type: 'error'
                    };
                } else {
                    return {
                        winner: null,
                        message: `${attacker.name}与${defender.name}同归于尽！`,
                        type: 'info'
                    };
                }
            }

            clearSelection() {
                this.selectedPiece = null;
                this.renderBoard();
            }

            switchPlayer() {
                this.currentPlayer = this.currentPlayer === 'red' ? 'blue' : 'red';
                document.getElementById('currentTurn').textContent = 
                    this.currentPlayer === 'red' ? '红军' : '蓝军';
            }

            checkGameEnd() {
                let redFlag = false, blueFlag = false;
                let redPieces = 0, bluePieces = 0;

                for (let row = 0; row < 12; row++) {
                    for (let col = 0; col < 5; col++) {
                        const piece = this.board[row][col]?.piece;
                        if (piece) {
                            if (piece.color === 'red') {
                                redPieces++;
                                if (piece.name === '军旗') redFlag = true;
                            } else {
                                bluePieces++;
                                if (piece.name === '军旗') blueFlag = true;
                            }
                        }
                    }
                }

                if (!redFlag) {
                    this.endGame('蓝军胜利！夺取红军军旗！');
                } else if (!blueFlag) {
                    this.endGame('红军胜利！夺取蓝军军旗！');
                } else if (redPieces <= 1) {
                    this.endGame('蓝军胜利！红军无子可动！');
                } else if (bluePieces <= 1) {
                    this.endGame('红军胜利！蓝军无子可动！');
                }
            }

            endGame(message) {
                this.gameEnded = true;
                this.showMessage(message, 'success');
                
                // 显示所有棋子
                for (let row = 0; row < 12; row++) {
                    for (let col = 0; col < 5; col++) {
                        const piece = this.board[row][col]?.piece;
                        if (piece) {
                            piece.hidden = false;
                        }
                    }
                }
                
                this.renderBoard();
            }

            showHint() {
                if (!this.gameStarted || this.gameEnded) return;

                const currentPieces = [];
                for (let row = 0; row < 12; row++) {
                    for (let col = 0; col < 5; col++) {
                        const piece = this.board[row][col]?.piece;
                        if (piece && piece.color === this.currentPlayer) {
                            const moves = this.getPossibleMoves(row, col);
                            if (moves.length > 0) {
                                currentPieces.push({ row, col, moves: moves.length });
                            }
                        }
                    }
                }

                if (currentPieces.length > 0) {
                    // 建议移动最多可能移动的棋子
                    const bestPiece = currentPieces.reduce((best, current) => 
                        current.moves > best.moves ? current : best
                    );
                    
                    this.selectPiece(bestPiece.row, bestPiece.col);
                    this.showMessage(`建议移动位置 (${bestPiece.row}, ${bestPiece.col}) 的棋子`, 'info');
                } else {
                    this.showMessage('无可移动棋子！', 'error');
                }
            }

            isValidPosition(row, col) {
                return row >= 0 && row < 12 && col >= 0 && col < 5;
            }

            renderBoard() {
                const board = document.getElementById('chessBoard');
                board.innerHTML = '';

                for (let row = 0; row < 12; row++) {
                    for (let col = 0; col < 5; col++) {
                        const cell = document.createElement('div');
                        cell.className = 'chess-cell';
                        cell.dataset.row = row;
                        cell.dataset.col = col;

                        const cellData = this.board[row][col];
                        
                        // 设置地形样式
                        if (cellData?.type === 'railway') {
                            cell.classList.add('railway');
                        } else if (cellData?.type === 'headquarters') {
                            cell.classList.add('headquarters');
                            if (cellData.camp) {
                                cell.classList.add(`${cellData.camp}-camp`);
                            }
                        }

                        // 显示棋子
                        if (cellData?.piece) {
                            const piece = cellData.piece;
                            const pieceDiv = document.createElement('div');
                            pieceDiv.className = `chess-piece ${piece.color}-piece`;
                            
                            if (piece.hidden && this.gameStarted && !this.gameEnded) {
                                pieceDiv.textContent = '?';
                            } else {
                                pieceDiv.textContent = piece.symbol;
                            }
                            
                            cell.appendChild(pieceDiv);
                        }

                        // 高亮选中的棋子
                        if (this.selectedPiece && 
                            this.selectedPiece.row === row && 
                            this.selectedPiece.col === col) {
                            cell.classList.add('selected');
                        }

                        board.appendChild(cell);
                    }
                }
            }

            updatePieceCount() {
                let redCount = 0, blueCount = 0;
                const redPieces = {}, bluePieces = {};

                for (let row = 0; row < 12; row++) {
                    for (let col = 0; col < 5; col++) {
                        const piece = this.board[row][col]?.piece;
                        if (piece) {
                            if (piece.color === 'red') {
                                redCount++;
                                redPieces[piece.name] = (redPieces[piece.name] || 0) + 1;
                            } else {
                                blueCount++;
                                bluePieces[piece.name] = (bluePieces[piece.name] || 0) + 1;
                            }
                        }
                    }
                }

                document.getElementById('redCount').textContent = redCount;
                document.getElementById('blueCount').textContent = blueCount;

                this.updatePieceCountDisplay('redPieceCount', redPieces);
                this.updatePieceCountDisplay('bluePieceCount', bluePieces);
            }

            updatePieceCountDisplay(elementId, pieceCount) {
                const container = document.getElementById(elementId);
                container.innerHTML = '';

                Object.entries(this.pieces).forEach(([name, info]) => {
                    const count = pieceCount[name] || 0;
                    const item = document.createElement('div');
                    item.className = 'piece-item';
                    item.innerHTML = `${info.symbol}<br>${count}`;
                    container.appendChild(item);
                });
            }

            showMessage(text, type) {
                const message = document.getElementById('message');
                message.textContent = text;
                message.className = `message ${type} show`;
            }

            hideMessage() {
                const message = document.getElementById('message');
                message.classList.remove('show');
            }
        }

        // 启动游戏
        window.addEventListener('load', () => {
            new ArmyChess();
        });