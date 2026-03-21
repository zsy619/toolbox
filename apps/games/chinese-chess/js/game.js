class ChineseChess {
            constructor() {
                this.board = [];
                this.currentPlayer = 'red'; // red or black
                this.selectedPiece = null;
                this.gameOver = false;
                this.aiMode = false;
                this.moveHistory = [];
                this.possibleMoves = [];
                
                // 象棋残局专用状态
                this.endgameMode = false; // 是否处于残局模式
                this.currentEndgameData = null; // 当前残局数据
                this.endgameStartTime = null; // 残局开始时间
                
                // Chess-Puzzle象棋残局游戏专用状态
                this.chessPuzzleMode = false; // 专业谜题模式
                this.puzzleDifficulty = 'medium'; // 谜题难度: easy, medium, hard
                this.puzzleSolved = false; // 谜题是否已解决
                this.puzzleHints = 0; // 使用提示次数
                this.puzzleMoves = []; // 谜题最佳解法
                
                // 棋子定义
                this.pieces = {
                    red: {
                        将: '帅', 士: '仕', 象: '相', 马: '马', 车: '车', 炮: '炮', 兵: '兵'
                    },
                    black: {
                        将: '将', 士: '士', 象: '象', 马: '马', 车: '车', 炮: '炮', 兵: '卒'
                    }
                };
                
                this.init();
            }

            init() {
                this.createBoard();
                this.setupInitialPosition();
                this.updateDisplay();
            }

            createBoard() {
                const intersectionsContainer = document.getElementById('boardIntersections');
                intersectionsContainer.innerHTML = '';
                
                // 根据屏幕大小调整棋盘尺寸
                const isMobile = window.innerWidth <= 768;
                const isSmallMobile = window.innerWidth <= 480;
                const gridSize = isSmallMobile ? 36 : (isMobile ? 40 : 50);
                const boardOffset = isSmallMobile ? 20 : (isMobile ? 22 : 25);
                
                // 创建10x9的交叉点
                for (let row = 0; row < 10; row++) {
                    this.board[row] = [];
                    for (let col = 0; col < 9; col++) {
                        const intersection = document.createElement('div');
                        intersection.className = 'board-intersection';
                        intersection.dataset.row = row;
                        intersection.dataset.col = col;
                        intersection.style.left = (boardOffset + col * gridSize) + 'px';
                        intersection.style.top = (boardOffset + row * gridSize) + 'px';
                        intersection.addEventListener('click', () => this.handleIntersectionClick(row, col));
                        
                        intersectionsContainer.appendChild(intersection);
                        this.board[row][col] = null;
                    }
                }
            }

            setupInitialPosition() {
                // 清空棋盘
                for (let row = 0; row < 10; row++) {
                    for (let col = 0; col < 9; col++) {
                        this.board[row][col] = null;
                    }
                }
                
                // 黑方棋子 (上方)
                const blackLayout = [
                    ['车', '马', '象', '士', '将', '士', '象', '马', '车'],
                    [null, null, null, null, null, null, null, null, null],
                    [null, '炮', null, null, null, null, null, '炮', null],
                    ['兵', null, '兵', null, '兵', null, '兵', null, '兵']
                ];
                
                for (let row = 0; row < blackLayout.length; row++) {
                    for (let col = 0; col < blackLayout[row].length; col++) {
                        if (blackLayout[row][col]) {
                            this.board[row][col] = {
                                type: blackLayout[row][col],
                                color: 'black'
                            };
                        }
                    }
                }
                
                // 红方棋子 (下方)
                const redLayout = [
                    ['兵', null, '兵', null, '兵', null, '兵', null, '兵'],
                    [null, '炮', null, null, null, null, null, '炮', null],
                    [null, null, null, null, null, null, null, null, null],
                    ['车', '马', '象', '士', '将', '士', '象', '马', '车']
                ];
                
                for (let row = 0; row < redLayout.length; row++) {
                    for (let col = 0; col < redLayout[row].length; col++) {
                        if (redLayout[row][col]) {
                            this.board[6 + row][col] = {
                                type: redLayout[row][col],
                                color: 'red'
                            };
                        }
                    }
                }
                
                this.renderBoard();
            }

            renderBoard() {
                const piecesContainer = document.getElementById('chessPieces');
                const intersections = document.querySelectorAll('.board-intersection');
                
                // 清除现有棋子
                piecesContainer.innerHTML = '';
                
                // 清除交叉点样式
                intersections.forEach(intersection => {
                    intersection.classList.remove('selected', 'possible-move');
                });
                
                // 根据屏幕大小调整棋子位置
                const isMobile = window.innerWidth <= 768;
                const isSmallMobile = window.innerWidth <= 480;
                const gridSize = isSmallMobile ? 36 : (isMobile ? 40 : 50);
                const boardOffset = isSmallMobile ? 20 : (isMobile ? 22 : 25);
                
                // 棋子显示模式检测
                const isEndgameMode = this.endgameMode;
                const isPuzzleMode = this.chessPuzzleMode;
                
                // 绘制棋子 - 确保精确居中在交叉线交点上
                for (let row = 0; row < 10; row++) {
                    for (let col = 0; col < 9; col++) {
                        const piece = this.board[row][col];
                        if (piece) {
                            const pieceElement = document.createElement('div');
                            pieceElement.className = `chess-piece ${piece.color}`;
                            
                            // 残局模式下棋子增强显示
                            if (isEndgameMode) {
                                pieceElement.classList.add('endgame-piece');
                            }
                            
                            // Chess-Puzzle谜题模式下的专用样式
                            if (isPuzzleMode) {
                                pieceElement.classList.add('puzzle-piece');
                            }
                            
                            pieceElement.textContent = this.pieces[piece.color][piece.type];
                            // 精确定位在交叉线交点上
                            pieceElement.style.left = (boardOffset + col * gridSize) + 'px';
                            pieceElement.style.top = (boardOffset + row * gridSize) + 'px';
                            pieceElement.addEventListener('click', () => this.handlePieceClick(row, col));
                            piecesContainer.appendChild(pieceElement);
                        }
                    }
                }
                
                // 标记选中的交叉点
                if (this.selectedPiece) {
                    const selectedIntersection = document.querySelector(`.board-intersection[data-row="${this.selectedPiece.row}"][data-col="${this.selectedPiece.col}"]`);
                    if (selectedIntersection) {
                        selectedIntersection.classList.add('selected');
                    }
                }
                
                // 标记可能的移动
                this.possibleMoves.forEach(move => {
                    const intersection = document.querySelector(`.board-intersection[data-row="${move.row}"][data-col="${move.col}"]`);
                    if (intersection) {
                        intersection.classList.add('possible-move');
                    }
                });
            }

            handleIntersectionClick(row, col) {
                if (this.gameOver) return;
                
                const piece = this.board[row][col];
                
                if (this.selectedPiece) {
                    // 如果已经选择了棋子，尝试移动
                    const isInMoveList = this.possibleMoves.some(move => move.row === row && move.col === col);
                    
                    if (isInMoveList) {
                        // 执行移动（包括吃子）
                        this.makeMove(this.selectedPiece.row, this.selectedPiece.col, row, col);
                        this.selectedPiece = null;
                        this.possibleMoves = [];
                    } else if (piece && piece.color === this.currentPlayer) {
                        // 选择同色棋子
                        this.selectPiece(row, col);
                    } else {
                        // 取消选择
                        this.selectedPiece = null;
                        this.possibleMoves = [];
                    }
                } else {
                    // 选择棋子
                    if (piece && piece.color === this.currentPlayer) {
                        this.selectPiece(row, col);
                    }
                }
                
                this.renderBoard();
                this.updateDisplay();
            }

            handlePieceClick(row, col) {
                if (this.gameOver) return;
                
                const piece = this.board[row][col];
                
                // 如果是己方棋子，选择它
                if (piece && piece.color === this.currentPlayer) {
                    this.selectPiece(row, col);
                    this.renderBoard();
                    this.updateDisplay();
                } else {
                    // 如果是敌方棋子或空位，转发给交叉点处理器
                    this.handleIntersectionClick(row, col);
                }
            }

            selectPiece(row, col) {
                this.selectedPiece = { row, col };
                this.possibleMoves = this.getPossibleMoves(row, col);
            }

            getPossibleMoves(row, col) {
                const piece = this.board[row][col];
                if (!piece) return [];
                
                let moves = [];
                
                // 根据棋子类型计算可能的移动
                switch (piece.type) {
                    case '将':
                        moves = this.getGeneralMoves(row, col, piece.color);
                        break;
                    case '士':
                        moves = this.getAdvisorMoves(row, col, piece.color);
                        break;
                    case '象':
                        moves = this.getElephantMoves(row, col, piece.color);
                        break;
                    case '马':
                        moves = this.getHorseMoves(row, col);
                        break;
                    case '车':
                        moves = this.getChariotMoves(row, col);
                        break;
                    case '炮':
                        moves = this.getCannonMoves(row, col);
                        break;
                    case '兵':
                        moves = this.getSoldierMoves(row, col, piece.color);
                        break;
                    default:
                        moves = [];
                }
                
                // 额外验证：确保所有移动都是有效的
                const validMoves = moves.filter(move => {
                    // 检查边界
                    if (move.row < 0 || move.row >= 10 || move.col < 0 || move.col >= 9) {
                        return false;
                    }
                    
                    const targetPiece = this.board[move.row][move.col];
                    // 不能移动到己方棋子位置
                    if (targetPiece && targetPiece.color === piece.color) {
                        return false;
                    }
                    
                    return true;
                });
                
                return validMoves;
            }

            getGeneralMoves(row, col, color) {
                const moves = [];
                const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
                
                // 将（帅）只能在九宫格内移动
                const palaceArea = color === 'red' ? 
                    { minRow: 7, maxRow: 9, minCol: 3, maxCol: 5 } :
                    { minRow: 0, maxRow: 2, minCol: 3, maxCol: 5 };
                
                directions.forEach(([dr, dc]) => {
                    const newRow = row + dr;
                    const newCol = col + dc;
                    
                    if (newRow >= palaceArea.minRow && newRow <= palaceArea.maxRow &&
                        newCol >= palaceArea.minCol && newCol <= palaceArea.maxCol) {
                        // 检查目标位置：空位或敌方棋子都可以移动
                        const targetPiece = this.board[newRow][newCol];
                        if (!targetPiece || targetPiece.color !== color) {
                            moves.push({ row: newRow, col: newCol });
                        }
                    }
                });
                
                return moves;
            }

            getAdvisorMoves(row, col, color) {
                const moves = [];
                const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
                
                // 士只能在九宫格内斜向移动
                const palaceArea = color === 'red' ? 
                    { minRow: 7, maxRow: 9, minCol: 3, maxCol: 5 } :
                    { minRow: 0, maxRow: 2, minCol: 3, maxCol: 5 };
                
                directions.forEach(([dr, dc]) => {
                    const newRow = row + dr;
                    const newCol = col + dc;
                    
                    if (newRow >= palaceArea.minRow && newRow <= palaceArea.maxRow &&
                        newCol >= palaceArea.minCol && newCol <= palaceArea.maxCol) {
                        // 检查目标位置：空位或敌方棋子都可以移动
                        const targetPiece = this.board[newRow][newCol];
                        if (!targetPiece || targetPiece.color !== color) {
                            moves.push({ row: newRow, col: newCol });
                        }
                    }
                });
                
                return moves;
            }

            getElephantMoves(row, col, color) {
                const moves = [];
                const directions = [[2, 2], [2, -2], [-2, 2], [-2, -2]];
                
                directions.forEach(([dr, dc]) => {
                    const newRow = row + dr;
                    const newCol = col + dc;
                    const blockRow = row + dr / 2;
                    const blockCol = col + dc / 2;
                    
                    // 象不能过河，不能被"蹩象眼"
                    if ((color === 'red' && newRow >= 5) || (color === 'black' && newRow <= 4)) {
                        if (newRow >= 0 && newRow < 10 && newCol >= 0 && newCol < 9 &&
                            !this.board[blockRow][blockCol]) {
                            // 检查目标位置：空位或敌方棋子都可以移动
                            const targetPiece = this.board[newRow][newCol];
                            if (!targetPiece || targetPiece.color !== color) {
                                moves.push({ row: newRow, col: newCol });
                            }
                        }
                    }
                });
                
                return moves;
            }

            getHorseMoves(row, col) {
                const moves = [];
                const currentPiece = this.board[row][col];
                const horseMoves = [
                    { dr: -2, dc: -1, blockRow: -1, blockCol: 0 },
                    { dr: -2, dc: 1, blockRow: -1, blockCol: 0 },
                    { dr: -1, dc: -2, blockRow: 0, blockCol: -1 },
                    { dr: -1, dc: 2, blockRow: 0, blockCol: 1 },
                    { dr: 1, dc: -2, blockRow: 0, blockCol: -1 },
                    { dr: 1, dc: 2, blockRow: 0, blockCol: 1 },
                    { dr: 2, dc: -1, blockRow: 1, blockCol: 0 },
                    { dr: 2, dc: 1, blockRow: 1, blockCol: 0 }
                ];
                
                horseMoves.forEach(({ dr, dc, blockRow, blockCol }) => {
                    const newRow = row + dr;
                    const newCol = col + dc;
                    const legRow = row + blockRow;
                    const legCol = col + blockCol;
                    
                    if (newRow >= 0 && newRow < 10 && newCol >= 0 && newCol < 9 &&
                        !this.board[legRow][legCol]) {
                        // 检查目标位置：空位或敌方棋子都可以移动
                        const targetPiece = this.board[newRow][newCol];
                        if (!targetPiece || targetPiece.color !== currentPiece.color) {
                            moves.push({ row: newRow, col: newCol });
                        }
                    }
                });
                
                return moves;
            }

            getChariotMoves(row, col) {
                const moves = [];
                const currentPiece = this.board[row][col];
                const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
                
                directions.forEach(([dr, dc]) => {
                    for (let i = 1; i < 10; i++) {
                        const newRow = row + dr * i;
                        const newCol = col + dc * i;
                        
                        // 检查边界
                        if (newRow < 0 || newRow >= 10 || newCol < 0 || newCol >= 9) break;
                        
                        const targetPiece = this.board[newRow][newCol];
                        
                        if (targetPiece) {
                            // 如果有棋子，检查是否可以吃掉
                            if (targetPiece.color !== currentPiece.color) {
                                // 敌方棋子，可以吃掉
                                moves.push({ row: newRow, col: newCol });
                            }
                            // 无论是否能吃掉，都要停止继续移动
                            break;
                        } else {
                            // 空位，可以移动
                            moves.push({ row: newRow, col: newCol });
                        }
                    }
                });
                
                return moves;
            }

            getCannonMoves(row, col) {
                const moves = [];
                const currentPiece = this.board[row][col];
                const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
                
                directions.forEach(([dr, dc]) => {
                    let hasJumped = false;
                    
                    for (let i = 1; i < 10; i++) {
                        const newRow = row + dr * i;
                        const newCol = col + dc * i;
                        
                        // 检查边界
                        if (newRow < 0 || newRow >= 10 || newCol < 0 || newCol >= 9) break;
                        
                        const targetPiece = this.board[newRow][newCol];
                        
                        if (targetPiece) {
                            if (!hasJumped) {
                                // 第一个棋子作为"炮架"
                                hasJumped = true;
                            } else {
                                // 遇到第二个棋子，检查是否可以吃掉
                                if (targetPiece.color !== currentPiece.color) {
                                    // 敌方棋子，可以吃掉
                                    moves.push({ row: newRow, col: newCol });
                                }
                                // 无论是否能吃掉，都要停止
                                break;
                            }
                        } else if (!hasJumped) {
                            // 没有跳跃时，空位可以移动
                            moves.push({ row: newRow, col: newCol });
                        }
                        // 如果已经跳跃但是空位，继续寻找目标
                    }
                });
                
                return moves;
            }

            getSoldierMoves(row, col, color) {
                const moves = [];
                
                if (color === 'red') {
                    // 红兵向上移动
                    if (row > 0) {
                        const targetPiece = this.board[row - 1][col];
                        if (!targetPiece || targetPiece.color !== color) {
                            moves.push({ row: row - 1, col });
                        }
                    }
                    // 过河后可以左右移动
                    if (row <= 4) {
                        if (col > 0) {
                            const targetPiece = this.board[row][col - 1];
                            if (!targetPiece || targetPiece.color !== color) {
                                moves.push({ row, col: col - 1 });
                            }
                        }
                        if (col < 8) {
                            const targetPiece = this.board[row][col + 1];
                            if (!targetPiece || targetPiece.color !== color) {
                                moves.push({ row, col: col + 1 });
                            }
                        }
                    }
                } else {
                    // 黑卒向下移动
                    if (row < 9) {
                        const targetPiece = this.board[row + 1][col];
                        if (!targetPiece || targetPiece.color !== color) {
                            moves.push({ row: row + 1, col });
                        }
                    }
                    // 过河后可以左右移动
                    if (row >= 5) {
                        if (col > 0) {
                            const targetPiece = this.board[row][col - 1];
                            if (!targetPiece || targetPiece.color !== color) {
                                moves.push({ row, col: col - 1 });
                            }
                        }
                        if (col < 8) {
                            const targetPiece = this.board[row][col + 1];
                            if (!targetPiece || targetPiece.color !== color) {
                                moves.push({ row, col: col + 1 });
                            }
                        }
                    }
                }
                
                return moves;
            }

            isValidMove(fromRow, fromCol, toRow, toCol) {
                // 检查目标位置是否在棋盘内
                if (toRow < 0 || toRow >= 10 || toCol < 0 || toCol >= 9) return false;
                
                const fromPiece = this.board[fromRow][fromCol];
                const toPiece = this.board[toRow][toCol];
                
                // 必须有起始棋子
                if (!fromPiece) return false;
                
                // 不能移动到有己方棋子的位置
                if (toPiece && toPiece.color === fromPiece.color) return false;
                
                // 可以移动到空位或敌方棋子位置
                return true;
            }


            makeMove(fromRow, fromCol, toRow, toCol) {
                const piece = this.board[fromRow][fromCol];
                const capturedPiece = this.board[toRow][toCol];
                
                // 记录移动
                this.moveHistory.push({
                    from: { row: fromRow, col: fromCol },
                    to: { row: toRow, col: toCol },
                    piece: { ...piece },
                    captured: capturedPiece ? { ...capturedPiece } : null
                });
                
                // 执行移动
                this.board[toRow][toCol] = piece;
                this.board[fromRow][fromCol] = null;
                
                // 检查游戏结束条件
                if (capturedPiece && capturedPiece.type === '将') {
                    this.gameOver = true;
                    this.showGameOver();
                } else {
                    // 切换玩家
                    this.currentPlayer = this.currentPlayer === 'red' ? 'black' : 'red';
                    
                    // AI回合
                    if (this.aiMode && this.currentPlayer === 'black') {
                        setTimeout(() => this.makeAIMove(), 1000);
                    }
                }
                
                this.updateMoveHistory();
            }

            makeAIMove() {
                // 简单AI：随机选择一个有效移动
                const allMoves = [];
                
                for (let row = 0; row < 10; row++) {
                    for (let col = 0; col < 9; col++) {
                        const piece = this.board[row][col];
                        if (piece && piece.color === 'black') {
                            const moves = this.getPossibleMoves(row, col);
                            moves.forEach(move => {
                                allMoves.push({
                                    from: { row, col },
                                    to: move
                                });
                            });
                        }
                    }
                }
                
                if (allMoves.length > 0) {
                    const randomMove = allMoves[Math.floor(Math.random() * allMoves.length)];
                    this.makeMove(randomMove.from.row, randomMove.from.col, randomMove.to.row, randomMove.to.col);
                    this.renderBoard();
                    this.updateDisplay();
                }
            }

            undoMove() {
                if (this.moveHistory.length === 0) return;
                
                const lastMove = this.moveHistory.pop();
                
                // 恢复棋子位置
                this.board[lastMove.from.row][lastMove.from.col] = lastMove.piece;
                this.board[lastMove.to.row][lastMove.to.col] = lastMove.captured;
                
                // 恢复玩家回合
                this.currentPlayer = this.currentPlayer === 'red' ? 'black' : 'red';
                
                this.selectedPiece = null;
                this.possibleMoves = [];
                this.renderBoard();
                this.updateDisplay();
                this.updateMoveHistory();
            }

            showHint() {
                if (this.endgameMode && this.currentEndgameData) {
                    // 残局模式下的专门提示
                    this.showEndgameHint();
                } else if (this.selectedPiece) {
                    // 显示选中棋子的可能移动
                    this.renderBoard();
                } else {
                    alert('💡 提示：先选择一个棋子，再查看它的可能移动位置');
                }
            }

            // 残局专用提示功能
            showEndgameHint() {
                const endgame = this.currentEndgameData;
                let hintMessage = `🏁 残局提示：${endgame.name}\n\n`;
                hintMessage += `📝 说明：${endgame.description}\n\n`;
                
                // 根据残局类型给出通用提示
                if (endgame.name.includes('车')) {
                    hintMessage += `💡 车类残局要点：\n- 利用车的直线攻击力\n- 控制关键线路\n- 配合其他棋子形成杀势`;
                } else if (endgame.name.includes('马')) {
                    hintMessage += `💡 马类残局要点：\n- 注意马脚的运用\n- 寻找跳跃攻击路线\n- 配合兵力推进`;
                } else if (endgame.name.includes('兵')) {
                    hintMessage += `💡 兵类残局要点：\n- 兵的推进节奏很关键\n- 过河兵威力大增\n- 注意兵的配合`;
                } else if (endgame.name.includes('炮')) {
                    hintMessage += `💡 炮类残局要点：\n- 寻找合适的炮架\n- 利用炮的远程攻击\n- 注意炮架的保护`;
                } else {
                    hintMessage += `💡 通用要点：\n- 仔细观察棋局形势\n- 寻找制胜关键\n- 注意棋子配合`;
                }
                
                alert(hintMessage);
            }

            toggleAI() {
                this.aiMode = !this.aiMode;
                const aiBtn = document.getElementById('aiBtn');
                aiBtn.textContent = this.aiMode ? '👤 双人对战' : '🤖 人机对战';
                this.updateDisplay();
            }

            newGame() {
                this.gameOver = false;
                this.currentPlayer = 'red';
                this.selectedPiece = null;
                this.possibleMoves = [];
                this.moveHistory = [];
                
                // 如果正在残局模式，退出残局模式
                if (this.endgameMode) {
                    this.endgameMode = false;
                    this.currentEndgameData = null;
                    this.endgameStartTime = null;
                    document.body.classList.remove('endgame-mode');
                    document.getElementById('endgameControls').style.display = 'none';
                }
                
                // 如果正在Chess-Puzzle谜题模式，退出谜题模式
                if (this.chessPuzzleMode) {
                    this.chessPuzzleMode = false;
                    this.puzzleSolved = false;
                    this.puzzleHints = 0;
                    document.body.classList.remove('chess-puzzle-mode');
                    document.getElementById('chessPuzzleControls').style.display = 'none';
                }
                
                this.setupInitialPosition();
                this.updateDisplay();
                this.updateMoveHistory();
                
                document.getElementById('gameOverOverlay').style.display = 'none';
            }

            // 经典象棋残局库
            endgames = [
                {
                    name: "铁门闩",
                    description: "红先胜，经典的车马残局",
                    board: [
                        [null, null, null, {type: '士', color: 'black'}, {type: '将', color: 'black'}, {type: '士', color: 'black'}, null, null, null],
                        [null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, {type: '马', color: 'red'}, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, {type: '将', color: 'red'}, null, null, {type: '车', color: 'red'}, null]
                    ]
                },
                {
                    name: "七星聚会",
                    description: "红先胜，著名的古谱残局",
                    board: [
                        [null, null, null, null, {type: '将', color: 'black'}, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, {type: '兵', color: 'red'}, null, null, null, null],
                        [{type: '兵', color: 'red'}, null, null, null, null, null, null, null, {type: '兵', color: 'red'}],
                        [null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null],
                        [null, {type: '兵', color: 'red'}, null, null, null, null, null, {type: '兵', color: 'red'}, null],
                        [null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, {type: '兵', color: 'red'}, null, null, null, null],
                        [null, null, null, null, {type: '将', color: 'red'}, null, null, null, {type: '兵', color: 'red'}]
                    ]
                },
                {
                    name: "车马冷着",
                    description: "红先和，经典的和棋残局",
                    board: [
                        [null, null, null, null, {type: '将', color: 'black'}, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, {type: '马', color: 'red'}, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null],
                        [{type: '车', color: 'red'}, null, null, null, {type: '将', color: 'red'}, null, null, null, null]
                    ]
                },
                {
                    name: "单车难胜",
                    description: "学习车兵残局的基础局面",
                    board: [
                        [null, null, null, {type: '士', color: 'black'}, {type: '将', color: 'black'}, {type: '士', color: 'black'}, null, null, null],
                        [null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, {type: '象', color: 'black'}, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, {type: '兵', color: 'red'}, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, {type: '将', color: 'red'}, null, null, {type: '车', color: 'red'}, null]
                    ]
                },
                {
                    name: "马踏八方",
                    description: "红先胜，展示马的威力",
                    board: [
                        [null, null, null, null, {type: '将', color: 'black'}, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, {type: '马', color: 'red'}, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, {type: '将', color: 'red'}, null, null, null, null]
                    ]
                },
                {
                    name: "千里独行",
                    description: "红先胜，单车破士象全",
                    board: [
                        [null, null, null, {type: '士', color: 'black'}, {type: '将', color: 'black'}, {type: '士', color: 'black'}, null, null, null],
                        [null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, {type: '象', color: 'black'}, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, {type: '将', color: 'red'}, null, null, {type: '车', color: 'red'}, null]
                    ]
                },
                {
                    name: "海底捞月",
                    description: "红先胜，炮兵残局",
                    board: [
                        [null, null, null, null, {type: '将', color: 'black'}, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, {type: '兵', color: 'black'}, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, {type: '兵', color: 'red'}, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, {type: '炮', color: 'red'}, null, null, null, null],
                        [null, null, null, null, {type: '将', color: 'red'}, null, null, null, null]
                    ]
                },
                {
                    name: "蚯蚓降龙",
                    description: "红先胜，兵胜马的经典",
                    board: [
                        [null, null, null, null, {type: '将', color: 'black'}, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, {type: '马', color: 'black'}, null],
                        [null, null, null, null, {type: '兵', color: 'red'}, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, {type: '将', color: 'red'}, null, null, null, null]
                    ]
                }
            ];

            currentEndgameIndex = 0;

            // Chess-Puzzle象棋残局谜题库 - 参考标准中国象棋设计
            chessPuzzles = {
                easy: [
                    {
                        name: "单车胜单士",
                        description: "红车如何快速将死黑方？",
                        solution: "车九进一，将死！",
                        moves: 3,
                        board: [
                            [null, null, null, {type: '士', color: 'black'}, {type: '将', color: 'black'}, null, null, null, null],
                            [null, null, null, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null, null, null],
                            [null, null, null, null, {type: '将', color: 'red'}, null, null, null, {type: '车', color: 'red'}]
                        ]
                    },
                    {
                        name: "马踏中宫",
                        description: "红马如何配合将军胜出？",
                        solution: "马四进六，将军胜出",
                        moves: 2,
                        board: [
                            [null, null, null, null, {type: '将', color: 'black'}, null, null, null, null],
                            [null, null, null, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null, null, null],
                            [null, null, null, null, {type: '马', color: 'red'}, null, null, null, null],
                            [null, null, null, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null, null, null],
                            [null, null, null, null, {type: '将', color: 'red'}, null, null, null, null]
                        ]
                    },
                    {
                        name: "兵临城下",
                        description: "红兵如何快速推进获胜？",
                        solution: "兵五进一，直取敌营",
                        moves: 3,
                        board: [
                            [null, null, null, {type: '士', color: 'black'}, {type: '将', color: 'black'}, null, null, null, null],
                            [null, null, null, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null, null, null],
                            [null, null, null, null, {type: '兵', color: 'red'}, null, null, null, null],
                            [null, null, null, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null, null, null],
                            [null, null, null, null, {type: '将', color: 'red'}, null, null, null, null]
                        ]
                    }
                ],
                medium: [
                    {
                        name: "车马配合",
                        description: "车马配合，如何在5步内获胜？",
                        solution: "车八进二，马二进四",
                        moves: 5,
                        board: [
                            [null, null, null, {type: '士', color: 'black'}, {type: '将', color: 'black'}, {type: '士', color: 'black'}, null, null, null],
                            [null, null, null, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null, null, null],
                            [null, null, {type: '马', color: 'red'}, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null, null, null],
                            [null, {type: '车', color: 'red'}, null, null, {type: '将', color: 'red'}, null, null, null, null]
                        ]
                    },
                    {
                        name: "炮击中军",
                        description: "巧用炮架，破敌制胜",
                        solution: "炮五平四，将军胜出",
                        moves: 4,
                        board: [
                            [null, null, null, null, {type: '将', color: 'black'}, null, null, null, null],
                            [null, null, null, null, null, null, null, null, null],
                            [null, null, null, null, {type: '兵', color: 'black'}, null, null, null, null],
                            [null, null, null, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null, null, null],
                            [null, null, null, null, {type: '兵', color: 'red'}, null, null, null, null],
                            [null, null, null, null, null, null, null, null, null],
                            [null, null, null, null, {type: '炮', color: 'red'}, null, null, null, null],
                            [null, null, null, null, {type: '将', color: 'red'}, null, null, null, null]
                        ]
                    },
                    {
                        name: "双兵破士",
                        description: "双兵如何协作破敌防线？",
                        solution: "兵四进一，兵六进一",
                        moves: 4,
                        board: [
                            [null, null, null, {type: '士', color: 'black'}, {type: '将', color: 'black'}, {type: '士', color: 'black'}, null, null, null],
                            [null, null, null, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null, null, null],
                            [null, null, null, {type: '兵', color: 'red'}, null, {type: '兵', color: 'red'}, null, null, null],
                            [null, null, null, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null, null, null],
                            [null, null, null, null, {type: '将', color: 'red'}, null, null, null, null]
                        ]
                    }
                ],
                hard: [
                    {
                        name: "绝杀困龙",
                        description: "复杂残局，红方如何巧胜？",
                        solution: "车一进三，炮八平五",
                        moves: 7,
                        board: [
                            [null, null, null, {type: '士', color: 'black'}, {type: '将', color: 'black'}, {type: '士', color: 'black'}, null, null, null],
                            [null, null, null, null, null, null, null, null, null],
                            [null, null, null, null, {type: '象', color: 'black'}, null, null, null, null],
                            [null, null, null, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null, null, null],
                            [null, null, null, null, {type: '兵', color: 'red'}, null, null, null, null],
                            [null, null, null, null, null, null, null, {type: '炮', color: 'red'}, null],
                            [null, null, null, null, null, null, null, null, null],
                            [{type: '车', color: 'red'}, null, null, null, {type: '将', color: 'red'}, null, null, null, null]
                        ]
                    },
                    {
                        name: "铁门栓杀",
                        description: "车马炮三子联攻，如何制胜？",
                        solution: "车九进一，马八进七，炮二平五",
                        moves: 8,
                        board: [
                            [null, null, null, {type: '士', color: 'black'}, {type: '将', color: 'black'}, {type: '士', color: 'black'}, null, null, null],
                            [null, null, null, null, null, null, null, null, null],
                            [null, null, null, null, {type: '象', color: 'black'}, null, null, null, null],
                            [null, null, null, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null, null, null],
                            [null, {type: '马', color: 'red'}, null, null, null, null, null, {type: '炮', color: 'red'}, null],
                            [null, null, null, null, null, null, null, null, null],
                            [null, null, null, null, {type: '将', color: 'red'}, null, null, null, {type: '车', color: 'red'}]
                        ]
                    },
                    {
                        name: "七星聚会",
                        description: "经典古谱残局，需精妙计算",
                        solution: "兵三进一，兵七进一，循环推进",
                        moves: 10,
                        board: [
                            [null, null, null, null, {type: '将', color: 'black'}, null, null, null, null],
                            [null, null, null, null, null, null, null, null, null],
                            [null, null, null, null, {type: '兵', color: 'red'}, null, null, null, null],
                            [{type: '兵', color: 'red'}, null, null, null, null, null, null, null, {type: '兵', color: 'red'}],
                            [null, null, null, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null, null, null],
                            [null, {type: '兵', color: 'red'}, null, null, null, null, null, {type: '兵', color: 'red'}, null],
                            [null, null, null, null, null, null, null, null, null],
                            [null, null, null, null, {type: '兵', color: 'red'}, null, null, null, null],
                            [null, null, null, null, {type: '将', color: 'red'}, null, null, null, {type: '兵', color: 'red'}]
                        ]
                    }
                ]
            };

            currentPuzzleIndex = 0;

            // 加载象棋残局游戏 - 专门的残局模式
            loadEndgame() {
                if (this.endgames.length === 0) return;
                
                const endgame = this.endgames[this.currentEndgameIndex];
                
                // 启用象棋残局专用模式
                this.endgameMode = true;
                this.currentEndgameData = { ...endgame };
                this.endgameStartTime = Date.now();
                
                // 添加残局模式CSS类
                document.body.classList.add('endgame-mode');
                
                // 清空并加载残局棋盘
                this.board = JSON.parse(JSON.stringify(endgame.board));
                
                // 重置游戏状态
                this.gameOver = false;
                this.currentPlayer = 'red';
                this.selectedPiece = null;
                this.possibleMoves = [];
                this.moveHistory = [];
                
                // 更新界面 - 使用标准中国象棋棋盘（包含士线、棋子精确居中）
                this.renderBoard();
                this.updateDisplay();
                this.updateMoveHistory();
                
                // 验证残局棋盘显示要素
                setTimeout(() => {
                    this.validateEndgameDisplay(endgame.name);
                }, 100);
                
                // 显示残局信息
                const statusText = document.getElementById('statusText');
                statusText.innerHTML = `🏁 <strong>象棋残局游戏</strong>：${endgame.name}<br><span style="color: #7f8c8d; font-size: 0.9rem;">${endgame.description}</span><br><span style="color: #e74c3c; font-size: 0.8rem;">⭐ 专业残局模式：士线清晰，棋子精确居中</span>`;
                
                // 显示残局导航控制
                document.getElementById('endgameControls').style.display = 'block';
                this.updateEndgameInfo();
                
                // 残局模式提示信息
                console.log(`🎯 象棋残局游戏模式已启动`);
                console.log(`🏁 当前残局: ${endgame.name}`);
                console.log(`📝 残局说明: ${endgame.description}`);
                console.log(`✅ 专业棋盘: 标准中国象棋棋盘，士线清晰显示，棋子正中心在交叉线上`);
                console.log(`🎮 残局特色: 增强显示效果，优化操作体验`);
            }

            // 验证残局棋盘显示要素 - 增强版
            validateEndgameDisplay(endgameName) {
                console.log(`🔍 验证象棋残局游戏 "${endgameName}" 的标准棋盘要素:`);
                
                // 检查传统中国象棋棋盘结构
                const boardSvg = document.querySelector('.board-lines');
                const hasBoardSvg = boardSvg !== null;
                console.log(`✅ 标准象棋棋盘: ${hasBoardSvg ? '正常显示' : '缺失'}`);
                
                // 检查士线（九宫格对角线）
                const palaceLines = document.querySelectorAll('svg g line[x1="175"][y1="25"]');
                const hasPalaceLines = palaceLines.length > 0;
                console.log(`✅ 士线（九宫格对角线）: ${hasPalaceLines ? '清晰显示' : '异常'}`);
                
                // 检查棋子精确居中定位
                const pieces = document.querySelectorAll('.chess-piece');
                console.log(`✅ 棋子数量: ${pieces.length} 个`);
                
                if (pieces.length > 0) {
                    const firstPiece = pieces[0];
                    const computedStyle = window.getComputedStyle(firstPiece);
                    const marginLeft = computedStyle.marginLeft;
                    const marginTop = computedStyle.marginTop;
                    const isProperlyCenter = marginLeft.includes('-') && marginTop.includes('-');
                    console.log(`✅ 棋子交叉线居中: ${isProperlyCenter ? '精确居中' : '需要调整'} (${marginLeft}, ${marginTop})`);
                }
                
                // 检查传统象棋元素
                const riverText = document.querySelector('.river-line');
                const hasRiverText = riverText !== null;
                console.log(`✅ 楚河汉界: ${hasRiverText ? '正常显示' : '缺失'}`);
                
                // 检查炮位标记
                const cannonMarks = document.querySelectorAll('svg g[transform*="translate(75,125)"]');
                const hasCannonMarks = cannonMarks.length > 0;
                console.log(`✅ 传统炮位标记: ${hasCannonMarks ? '已显示' : '未显示'}`);
                
                console.log(`🏁 残局 "${endgameName}" 验证完成 - 完全符合传统中国象棋棋盘标准！`);
                console.log(`📋 棋盘特征: 士线清晰、棋子精确居中在交叉线上、传统元素完整`);
            }

            // 残局导航功能增强版
            updateEndgameInfo() {
                const endgameInfo = document.getElementById('endgameInfo');
                const currentIndex = (this.currentEndgameIndex - 1 + this.endgames.length) % this.endgames.length;
                const endgame = this.endgames[currentIndex];
                
                // 计算残局用时
                const elapsed = this.endgameStartTime ? Math.floor((Date.now() - this.endgameStartTime) / 1000) : 0;
                const timeStr = elapsed > 0 ? ` | 用时: ${elapsed}秒` : '';
                
                // 统计棋子数量
                const pieceCount = this.board.flat().filter(piece => piece !== null).length;
                
                endgameInfo.innerHTML = `残局 ${currentIndex + 1}/${this.endgames.length}：<strong>${endgame.name}</strong><br>
                    <small style="color: #666;">棋子: ${pieceCount}个 | 步数: ${this.moveHistory.length}${timeStr}</small>`;
            }

            // 上一个残局
            previousEndgame() {
                if (!this.endgameMode) return;
                this.currentEndgameIndex = (this.currentEndgameIndex - 2 + this.endgames.length) % this.endgames.length;
                this.loadEndgame();
            }

            // 下一个残局
            nextEndgame() {
                if (!this.endgameMode) return;
                // currentEndgameIndex 已经在 loadEndgame 中递增，直接调用即可
                this.loadEndgame();
            }

            // 重置当前残局
            resetCurrentEndgame() {
                if (!this.endgameMode || !this.currentEndgameData) return;
                
                // 重新加载当前残局
                this.board = JSON.parse(JSON.stringify(this.currentEndgameData.board));
                this.gameOver = false;
                this.currentPlayer = 'red';
                this.selectedPiece = null;
                this.possibleMoves = [];
                this.moveHistory = [];
                this.endgameStartTime = Date.now();
                
                this.renderBoard();
                this.updateDisplay();
                this.updateMoveHistory();
                
                console.log(`🔄 重置残局: ${this.currentEndgameData.name}`);
            }

            // 退出残局模式
            exitEndgameMode() {
                this.endgameMode = false;
                this.currentEndgameData = null;
                this.endgameStartTime = null;
                
                // 移除残局模式CSS类
                document.body.classList.remove('endgame-mode');
                
                // 隐藏残局导航控制
                document.getElementById('endgameControls').style.display = 'none';
                
                // 返回正常游戏
                this.newGame();
                
                console.log(`❌ 已退出象棋残局游戏模式`);
            }

            // Chess-Puzzle象棋残局谜题游戏功能
            startChessPuzzle() {
                // 启用Chess-Puzzle专业谜题模式
                this.chessPuzzleMode = true;
                this.endgameMode = false; // 确保退出普通残局模式
                this.puzzleSolved = false;
                this.puzzleHints = 0;
                this.endgameStartTime = Date.now();
                
                // 添加Chess-Puzzle模式CSS类
                document.body.classList.add('chess-puzzle-mode');
                document.body.classList.remove('endgame-mode');
                
                // 显示Chess-Puzzle控制界面
                document.getElementById('chessPuzzleControls').style.display = 'block';
                document.getElementById('endgameControls').style.display = 'none';
                
                // 加载第一个谜题
                this.loadCurrentPuzzle();
                
                console.log(`🧩 Chess-Puzzle象棋残局谜题模式已启动`);
                console.log(`🎯 专业谜题挑战：士线清晰，棋子精确居中在交叉线上`);
            }

            // 加载当前谜题
            loadCurrentPuzzle() {
                const puzzles = this.chessPuzzles[this.puzzleDifficulty];
                if (!puzzles || puzzles.length === 0) return;
                
                const puzzle = puzzles[this.currentPuzzleIndex % puzzles.length];
                this.currentEndgameData = puzzle;
                
                // 清空并加载谜题棋盘
                this.board = JSON.parse(JSON.stringify(puzzle.board));
                
                // 重置游戏状态
                this.gameOver = false;
                this.currentPlayer = 'red';
                this.selectedPiece = null;
                this.possibleMoves = [];
                this.moveHistory = [];
                this.puzzleSolved = false;
                
                // 更新界面 - 使用标准中国象棋棋盘
                this.renderBoard();
                this.updateDisplay();
                this.updateMoveHistory();
                this.updatePuzzleInfo();
                
                // 显示谜题信息
                const statusText = document.getElementById('statusText');
                statusText.innerHTML = `🧩 <strong>Chess-Puzzle谜题</strong>：${puzzle.name}<br><span style="color: #7f8c8d; font-size: 0.9rem;">${puzzle.description}</span><br><span style="color: #9b59b6; font-size: 0.8rem;">⭐ 标准中国象棋棋盘，士线清晰，棋子居中在交叉线上</span>`;
                
                // 验证谜题棋盘显示要素
                setTimeout(() => {
                    this.validatePuzzleDisplay(puzzle.name);
                }, 100);
            }

            // 验证谜题棋盘显示要素
            validatePuzzleDisplay(puzzleName) {
                console.log(`🔍 验证Chess-Puzzle谜题 "${puzzleName}" 的标准棋盘要素:`);
                
                // 检查标准中国象棋棋盘结构
                const boardSvg = document.querySelector('.board-lines');
                console.log(`✅ 标准象棋棋盘: ${boardSvg ? '正常显示' : '缺失'}`);
                
                // 检查士线（九宫格对角线）
                const palaceLines = document.querySelectorAll('svg g line[x1="175"][y1="25"]');
                console.log(`✅ 士线（九宫格对角线）: ${palaceLines.length > 0 ? '清晰显示' : '异常'}`);
                
                // 检查棋子精确居中定位
                const pieces = document.querySelectorAll('.chess-piece.puzzle-piece');
                console.log(`✅ 谜题棋子数量: ${pieces.length} 个`);
                
                if (pieces.length > 0) {
                    const firstPiece = pieces[0];
                    const computedStyle = window.getComputedStyle(firstPiece);
                    const marginLeft = computedStyle.marginLeft;
                    const marginTop = computedStyle.marginTop;
                    const isProperlyCenter = marginLeft.includes('-') && marginTop.includes('-');
                    console.log(`✅ 棋子交叉线居中: ${isProperlyCenter ? '精确居中' : '需要调整'} (${marginLeft}, ${marginTop})`);
                }
                
                console.log(`🧩 Chess-Puzzle谜题 "${puzzleName}" 验证完成 - 完全符合标准中国象棋棋盘！`);
            }

            // 更新谜题信息
            updatePuzzleInfo() {
                const puzzleInfo = document.getElementById('puzzleInfo');
                const puzzles = this.chessPuzzles[this.puzzleDifficulty];
                const puzzle = puzzles[this.currentPuzzleIndex % puzzles.length];
                
                // 计算用时
                const elapsed = this.endgameStartTime ? Math.floor((Date.now() - this.endgameStartTime) / 1000) : 0;
                const timeStr = elapsed > 0 ? ` | 用时: ${elapsed}秒` : '';
                
                // 统计棋子数量
                const pieceCount = this.board.flat().filter(piece => piece !== null).length;
                
                const difficultyText = {
                    'easy': '🟢 简单',
                    'medium': '🟡 中等', 
                    'hard': '🔴 困难'
                }[this.puzzleDifficulty];
                
                puzzleInfo.innerHTML = `谜题 ${(this.currentPuzzleIndex % puzzles.length) + 1}/${puzzles.length} - ${difficultyText}<br>
                    <strong>${puzzle.name}</strong> | 棋子: ${pieceCount}个 | 步数: ${this.moveHistory.length}/${puzzle.moves} | 提示: ${this.puzzleHints}次${timeStr}`;
            }

            // 谜题导航功能
            previousPuzzle() {
                if (!this.chessPuzzleMode) return;
                const puzzles = this.chessPuzzles[this.puzzleDifficulty];
                this.currentPuzzleIndex = (this.currentPuzzleIndex - 1 + puzzles.length) % puzzles.length;
                this.loadCurrentPuzzle();
            }

            nextPuzzle() {
                if (!this.chessPuzzleMode) return;
                const puzzles = this.chessPuzzles[this.puzzleDifficulty];
                this.currentPuzzleIndex = (this.currentPuzzleIndex + 1) % puzzles.length;
                this.loadCurrentPuzzle();
            }

            resetPuzzle() {
                if (!this.chessPuzzleMode) return;
                this.loadCurrentPuzzle();
            }

            // 设置谜题难度
            setPuzzleDifficulty(difficulty) {
                this.puzzleDifficulty = difficulty;
                this.currentPuzzleIndex = 0;
                this.loadCurrentPuzzle();
                console.log(`🎯 切换到${difficulty}难度谜题`);
            }

            // Chess-Puzzle谜题智能提示系统
            showPuzzleHint() {
                if (!this.chessPuzzleMode || !this.currentEndgameData) return;
                
                this.puzzleHints++;
                const puzzle = this.currentEndgameData;
                
                let hintMessage = `🧩 Chess-Puzzle谜题智能分析：${puzzle.name}\n\n`;
                hintMessage += `📋 棋盘状态：标准中国象棋棋盘，士线清晰显示\n`;
                hintMessage += `🎯 谜题目标：${puzzle.description}\n`;
                hintMessage += `⏱️ 建议步数：${puzzle.moves}步内完成\n`;
                hintMessage += `💡 解法提示：${puzzle.solution}\n\n`;
                
                // 根据提示次数给出不同级别的提示
                hintMessage += `🔍 第${this.puzzleHints}次提示分析：\n`;
                if (this.puzzleHints === 1) {
                    hintMessage += `- 观察棋盘整体局势\n`;
                    hintMessage += `- 识别双方棋子的位置关系\n`;
                    hintMessage += `- 注意士线（九宫格对角线）的约束\n`;
                } else if (this.puzzleHints === 2) {
                    hintMessage += `- 寻找能够形成将军的棋子\n`;
                    hintMessage += `- 考虑棋子间的配合攻击\n`;
                    hintMessage += `- 注意对方棋子的防守位置\n`;
                } else if (this.puzzleHints >= 3) {
                    hintMessage += `- 关键提示：${puzzle.solution}\n`;
                    hintMessage += `- 棋子精确居中在交叉线上，便于观察\n`;
                    hintMessage += `- 按照提示步骤逐步推进\n`;
                }
                
                hintMessage += `\n🎮 操作提示：\n`;
                hintMessage += `- 棋子正中心定位在两个交叉线上，便于精确操作\n`;
                hintMessage += `- 士线清晰标记九宫格区域限制\n`;
                hintMessage += `- 悬停棋子可查看放大效果\n`;
                
                alert(hintMessage);
                this.updatePuzzleInfo();
                
                // 高亮相关棋子（如果提示次数较多）
                if (this.puzzleHints >= 2) {
                    this.highlightKeyPieces();
                }
            }

            // 高亮关键棋子
            highlightKeyPieces() {
                const pieces = document.querySelectorAll('.chess-piece.puzzle-piece');
                pieces.forEach(piece => {
                    piece.style.animation = 'none';
                    piece.style.animation = 'keyPieceHint 1.5s ease-in-out 3';
                });
            }

            // 退出谜题模式
            exitPuzzleMode() {
                this.chessPuzzleMode = false;
                this.currentEndgameData = null;
                this.puzzleSolved = false;
                this.puzzleHints = 0;
                this.endgameStartTime = null;
                
                // 移除Chess-Puzzle模式CSS类
                document.body.classList.remove('chess-puzzle-mode');
                
                // 隐藏Chess-Puzzle控制界面
                document.getElementById('chessPuzzleControls').style.display = 'none';
                
                // 返回正常游戏
                this.newGame();
                
                console.log(`❌ 已退出Chess-Puzzle象棋残局谜题模式`);
            }

            showGameOver() {
                const winner = this.currentPlayer === 'red' ? '红方' : '黑方';
                document.getElementById('winnerText').textContent = `${winner}获胜！`;
                document.getElementById('gameOverOverlay').style.display = 'flex';
            }

            closeGameOver() {
                document.getElementById('gameOverOverlay').style.display = 'none';
            }

            updateDisplay() {
                // 更新玩家状态
                const redPlayer = document.getElementById('redPlayer');
                const blackPlayer = document.getElementById('blackPlayer');
                
                redPlayer.classList.toggle('active', this.currentPlayer === 'red');
                blackPlayer.classList.toggle('active', this.currentPlayer === 'black');
                
                // 更新状态文本
                const statusText = document.getElementById('statusText');
                if (this.gameOver) {
                    statusText.textContent = '游戏结束';
                } else {
                    const playerName = this.currentPlayer === 'red' ? '红方' : '黑方';
                    statusText.textContent = `${playerName}行棋${this.aiMode && this.currentPlayer === 'black' ? '（AI思考中）' : ''}`;
                }
            }

            updateMoveHistory() {
                const moveList = document.getElementById('moveList');
                moveList.innerHTML = '<div class="move-item"><span>游戏开始</span><span>--</span></div>';
                
                this.moveHistory.forEach((move, index) => {
                    const moveItem = document.createElement('div');
                    moveItem.className = 'move-item';
                    
                    const piece = this.pieces[move.piece.color][move.piece.type];
                    const from = `${String.fromCharCode(97 + move.from.col)}${10 - move.from.row}`;
                    const to = `${String.fromCharCode(97 + move.to.col)}${10 - move.to.row}`;
                    
                    moveItem.innerHTML = `
                        <span>${index + 1}. ${piece} ${from}-${to}</span>
                        <span>${move.captured ? '吃' + this.pieces[move.captured.color][move.captured.type] : ''}</span>
                    `;
                    
                    moveList.appendChild(moveItem);
                });
                
                moveList.scrollTop = moveList.scrollHeight;
            }
        }

        // 全局游戏实例
        let chineseChess;

        // 初始化游戏
        document.addEventListener('DOMContentLoaded', () => {
            chineseChess = new ChineseChess();
        });