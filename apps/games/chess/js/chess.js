class ChineseChess {
    constructor() {
        // 游戏设置
        this.currentPlayer = 'red'; // 'red' 或 'black'
        this.gameOver = false;
        this.isAIMode = false;
        this.aiPlayer = 'black';
        this.selectedPiece = null;
        this.validMoves = [];
        this.moveHistory = [];
        this.capturedPieces = { red: [], black: [] };
        
        // 计时器
        this.gameStartTime = null;
        this.gameTimer = null;
        
        // 棋子定义
        this.pieces = {
            red: {
                将: '将', 士: '士', 象: '相', 马: '马', 车: '车', 炮: '炮', 兵: '兵'
            },
            black: {
                将: '帅', 士: '仕', 象: '象', 马: '馬', 车: '車', 炮: '砲', 兵: '卒'
            }
        };
        
        this.initGame();
        this.bindEvents();
        this.updateDisplay();
    }
    
    initGame() {
        // 初始化棋盘 (9x10)
        this.board = Array(10).fill(null).map(() => Array(9).fill(null));
        
        // 重置游戏状态
        this.currentPlayer = 'red';
        this.gameOver = false;
        this.selectedPiece = null;
        this.validMoves = [];
        this.moveHistory = [];
        this.capturedPieces = { red: [], black: [] };
        
        // 初始化棋子位置
        this.setupInitialPosition();
        
        // 创建棋盘UI
        this.createBoard();
        
        // 开始计时
        this.startTimer();
        
        this.updateStatus('请红方走棋');
        this.updateDisplay();
    }
    
    setupInitialPosition() {
        // 黑方 (上方)
        this.board[0][0] = { type: '车', color: 'black', char: '車' };
        this.board[0][1] = { type: '马', color: 'black', char: '馬' };
        this.board[0][2] = { type: '象', color: 'black', char: '象' };
        this.board[0][3] = { type: '士', color: 'black', char: '仕' };
        this.board[0][4] = { type: '将', color: 'black', char: '帅' };
        this.board[0][5] = { type: '士', color: 'black', char: '仕' };
        this.board[0][6] = { type: '象', color: 'black', char: '象' };
        this.board[0][7] = { type: '马', color: 'black', char: '馬' };
        this.board[0][8] = { type: '车', color: 'black', char: '車' };
        
        this.board[2][1] = { type: '炮', color: 'black', char: '砲' };
        this.board[2][7] = { type: '炮', color: 'black', char: '砲' };
        
        for (let i = 0; i < 9; i += 2) {
            this.board[3][i] = { type: '兵', color: 'black', char: '卒' };
        }
        
        // 红方 (下方)
        this.board[9][0] = { type: '车', color: 'red', char: '车' };
        this.board[9][1] = { type: '马', color: 'red', char: '马' };
        this.board[9][2] = { type: '象', color: 'red', char: '相' };
        this.board[9][3] = { type: '士', color: 'red', char: '士' };
        this.board[9][4] = { type: '将', color: 'red', char: '将' };
        this.board[9][5] = { type: '士', color: 'red', char: '士' };
        this.board[9][6] = { type: '象', color: 'red', char: '相' };
        this.board[9][7] = { type: '马', color: 'red', char: '马' };
        this.board[9][8] = { type: '车', color: 'red', char: '车' };
        
        this.board[7][1] = { type: '炮', color: 'red', char: '炮' };
        this.board[7][7] = { type: '炮', color: 'red', char: '炮' };
        
        for (let i = 0; i < 9; i += 2) {
            this.board[6][i] = { type: '兵', color: 'red', char: '兵' };
        }
    }
    
    createBoard() {
        const boardElement = document.getElementById('chessBoard');
        boardElement.innerHTML = '';
        
        // 创建棋盘线条
        const linesElement = document.createElement('div');
        linesElement.className = 'board-lines';
        linesElement.innerHTML = this.createBoardLines();
        boardElement.appendChild(linesElement);
        
        // 创建交叉点
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 9; col++) {
                const intersection = document.createElement('div');
                intersection.className = 'intersection';
                intersection.dataset.row = row;
                intersection.dataset.col = col;
                
                // 计算位置
                const x = 75 + col * 56.25;
                const y = 40 + row * 60;
                intersection.style.left = x + 'px';
                intersection.style.top = y + 'px';
                
                intersection.addEventListener('click', (e) => this.handleClick(e));
                
                // 如果有棋子，创建棋子元素
                const piece = this.board[row][col];
                if (piece) {
                    const pieceElement = document.createElement('div');
                    pieceElement.className = `chess-piece ${piece.color}`;
                    pieceElement.textContent = piece.char;
                    pieceElement.dataset.row = row;
                    pieceElement.dataset.col = col;
                    intersection.appendChild(pieceElement);
                }
                
                boardElement.appendChild(intersection);
            }
        }
        
        this.updateCapturedPieces();
    }
    
    createBoardLines() {
        let svg = '<svg viewBox="0 0 600 660">';
        
        // 横线
        for (let i = 0; i <= 9; i++) {
            const y = 40 + i * 60;
            svg += `<line x1="75" y1="${y}" x2="525" y2="${y}"/>`;
        }
        
        // 竖线
        for (let i = 0; i <= 8; i++) {
            const x = 75 + i * 56.25;
            // 上半部分
            svg += `<line x1="${x}" y1="40" x2="${x}" y2="280"/>`;
            // 下半部分
            svg += `<line x1="${x}" y1="340" x2="${x}" y2="580"/>`;
        }
        
        // 九宫格对角线
        // 上方九宫格
        svg += '<line x1="243.75" y1="40" x2="356.25" y2="160"/>';
        svg += '<line x1="356.25" y1="40" x2="243.75" y2="160"/>';
        
        // 下方九宫格
        svg += '<line x1="243.75" y1="460" x2="356.25" y2="580"/>';
        svg += '<line x1="356.25" y1="460" x2="243.75" y2="580"/>';
        
        svg += '</svg>';
        return svg;
    }
    
    handleClick(event) {
        if (this.gameOver) return;
        
        // 如果是AI回合，不允许操作
        if (this.isAIMode && this.currentPlayer === this.aiPlayer) {
            return;
        }
        
        const row = parseInt(event.currentTarget.dataset.row);
        const col = parseInt(event.currentTarget.dataset.col);
        
        const piece = this.board[row][col];
        
        if (this.selectedPiece) {
            // 已选择棋子，尝试移动
            if (this.isValidMove(this.selectedPiece.row, this.selectedPiece.col, row, col)) {
                this.makeMove(this.selectedPiece.row, this.selectedPiece.col, row, col);
            } else {
                // 如果点击的是己方棋子，重新选择
                if (piece && piece.color === this.currentPlayer) {
                    this.selectPiece(row, col);
                } else {
                    this.clearSelection();
                }
            }
        } else {
            // 未选择棋子，尝试选择
            if (piece && piece.color === this.currentPlayer) {
                this.selectPiece(row, col);
            }
        }
    }
    
    selectPiece(row, col) {
        this.clearSelection();
        
        this.selectedPiece = { row, col };
        this.validMoves = this.getValidMoves(row, col);
        
        // 高亮选中的棋子
        const pieceElement = document.querySelector(`[data-row="${row}"][data-col="${col}"] .chess-piece`);
        if (pieceElement) {
            pieceElement.classList.add('selected');
        }
        
        // 高亮可移动位置
        this.validMoves.forEach(move => {
            const intersection = document.querySelector(`.intersection[data-row="${move.row}"][data-col="${move.col}"]`);
            if (intersection) {
                intersection.classList.add('valid-move');
            }
        });
    }
    
    clearSelection() {
        // 清除选中状态
        document.querySelectorAll('.chess-piece.selected').forEach(el => {
            el.classList.remove('selected');
        });
        
        // 清除可移动位置高亮
        document.querySelectorAll('.intersection.valid-move').forEach(el => {
            el.classList.remove('valid-move');
        });
        
        // 清除上次移动高亮
        document.querySelectorAll('.intersection.last-move').forEach(el => {
            el.classList.remove('last-move');
        });
        
        this.selectedPiece = null;
        this.validMoves = [];
    }
    
    makeMove(fromRow, fromCol, toRow, toCol) {
        const piece = this.board[fromRow][fromCol];
        const capturedPiece = this.board[toRow][toCol];
        
        // 记录移动历史
        this.moveHistory.push({
            from: { row: fromRow, col: fromCol },
            to: { row: toRow, col: toCol },
            piece: { ...piece },
            capturedPiece: capturedPiece ? { ...capturedPiece } : null,
            player: this.currentPlayer
        });
        
        // 如果吃子，添加到被吃棋子列表
        if (capturedPiece) {
            this.capturedPieces[capturedPiece.color].push(capturedPiece);
        }
        
        // 移动棋子
        this.board[toRow][toCol] = piece;
        this.board[fromRow][fromCol] = null;
        
        // 清除选择状态
        this.clearSelection();
        
        // 重新创建棋盘
        this.createBoard();
        
        // 高亮最后移动
        const fromIntersection = document.querySelector(`.intersection[data-row="${fromRow}"][data-col="${fromCol}"]`);
        const toIntersection = document.querySelector(`.intersection[data-row="${toRow}"][data-col="${toCol}"]`);
        if (fromIntersection) fromIntersection.classList.add('last-move');
        if (toIntersection) toIntersection.classList.add('last-move');
        
        // 检查游戏结束
        if (this.isGameOver()) {
            this.endGame();
        } else {
            // 切换玩家
            this.currentPlayer = this.currentPlayer === 'red' ? 'black' : 'red';
            this.updateDisplay();
            
            // 如果是AI模式且轮到AI
            if (this.isAIMode && this.currentPlayer === this.aiPlayer) {
                this.updateStatus('🤔 AI正在思考...');
                document.getElementById('thinkingIndicator').style.display = 'block';
                
                setTimeout(() => {
                    this.makeAIMove();
                }, 1500);
            } else {
                this.updateStatus(`请${this.currentPlayer === 'red' ? '红方' : '黑方'}走棋`);
            }
        }
        
        // 更新按钮状态
        document.getElementById('undoBtn').disabled = this.moveHistory.length === 0 || this.gameOver;
        document.getElementById('exportBtn').disabled = this.moveHistory.length === 0;
    }
    
    isValidMove(fromRow, fromCol, toRow, toCol) {
        return this.validMoves.some(move => move.row === toRow && move.col === toCol);
    }
    
    getValidMoves(row, col) {
        const piece = this.board[row][col];
        if (!piece) return [];
        
        const moves = [];
        
        switch (piece.type) {
            case '将':
                moves.push(...this.getGeneralMoves(row, col, piece.color));
                break;
            case '士':
                moves.push(...this.getAdvisorMoves(row, col, piece.color));
                break;
            case '象':
                moves.push(...this.getElephantMoves(row, col, piece.color));
                break;
            case '马':
                moves.push(...this.getHorseMoves(row, col));
                break;
            case '车':
                moves.push(...this.getChariotMoves(row, col));
                break;
            case '炮':
                moves.push(...this.getCannonMoves(row, col));
                break;
            case '兵':
                moves.push(...this.getSoldierMoves(row, col, piece.color));
                break;
        }
        
        // 过滤掉会导致将军的移动
        return moves.filter(move => !this.wouldCauseCheck(row, col, move.row, move.col));
    }
    
    getGeneralMoves(row, col, color) {
        const moves = [];
        const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
        
        // 确定九宫格范围
        const minRow = color === 'red' ? 7 : 0;
        const maxRow = color === 'red' ? 9 : 2;
        const minCol = 3;
        const maxCol = 5;
        
        directions.forEach(([dRow, dCol]) => {
            const newRow = row + dRow;
            const newCol = col + dCol;
            
            if (newRow >= minRow && newRow <= maxRow && 
                newCol >= minCol && newCol <= maxCol) {
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
        
        // 确定九宫格范围
        const minRow = color === 'red' ? 7 : 0;
        const maxRow = color === 'red' ? 9 : 2;
        const minCol = 3;
        const maxCol = 5;
        
        directions.forEach(([dRow, dCol]) => {
            const newRow = row + dRow;
            const newCol = col + dCol;
            
            if (newRow >= minRow && newRow <= maxRow && 
                newCol >= minCol && newCol <= maxCol) {
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
        
        // 象不能过河
        const riverLine = color === 'red' ? 4 : 5;
        
        directions.forEach(([dRow, dCol]) => {
            const newRow = row + dRow;
            const newCol = col + dCol;
            const blockRow = row + dRow / 2;
            const blockCol = col + dCol / 2;
            
            if (newRow >= 0 && newRow <= 9 && newCol >= 0 && newCol <= 8) {
                // 检查是否过河
                if ((color === 'red' && newRow >= riverLine) || 
                    (color === 'black' && newRow <= riverLine)) {
                    // 检查塞象眼
                    if (!this.board[blockRow][blockCol]) {
                        const targetPiece = this.board[newRow][newCol];
                        if (!targetPiece || targetPiece.color !== color) {
                            moves.push({ row: newRow, col: newCol });
                        }
                    }
                }
            }
        });
        
        return moves;
    }
    
    getHorseMoves(row, col) {
        const moves = [];
        const horseMoves = [
            { move: [-2, -1], block: [-1, 0] },
            { move: [-2, 1], block: [-1, 0] },
            { move: [-1, -2], block: [0, -1] },
            { move: [-1, 2], block: [0, 1] },
            { move: [1, -2], block: [0, -1] },
            { move: [1, 2], block: [0, 1] },
            { move: [2, -1], block: [1, 0] },
            { move: [2, 1], block: [1, 0] }
        ];
        
        horseMoves.forEach(({ move: [dRow, dCol], block: [bRow, bCol] }) => {
            const newRow = row + dRow;
            const newCol = col + dCol;
            const blockRow = row + bRow;
            const blockCol = col + bCol;
            
            if (newRow >= 0 && newRow <= 9 && newCol >= 0 && newCol <= 8) {
                // 检查别马腿
                if (!this.board[blockRow][blockCol]) {
                    const targetPiece = this.board[newRow][newCol];
                    if (!targetPiece || targetPiece.color !== this.board[row][col].color) {
                        moves.push({ row: newRow, col: newCol });
                    }
                }
            }
        });
        
        return moves;
    }
    
    getChariotMoves(row, col) {
        const moves = [];
        const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
        const currentColor = this.board[row][col].color;
        
        directions.forEach(([dRow, dCol]) => {
            for (let i = 1; i < 10; i++) {
                const newRow = row + dRow * i;
                const newCol = col + dCol * i;
                
                if (newRow < 0 || newRow > 9 || newCol < 0 || newCol > 8) break;
                
                const targetPiece = this.board[newRow][newCol];
                if (targetPiece) {
                    if (targetPiece.color !== currentColor) {
                        moves.push({ row: newRow, col: newCol });
                    }
                    break;
                } else {
                    moves.push({ row: newRow, col: newCol });
                }
            }
        });
        
        return moves;
    }
    
    getCannonMoves(row, col) {
        const moves = [];
        const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
        const currentColor = this.board[row][col].color;
        
        directions.forEach(([dRow, dCol]) => {
            let hasJumped = false;
            
            for (let i = 1; i < 10; i++) {
                const newRow = row + dRow * i;
                const newCol = col + dCol * i;
                
                if (newRow < 0 || newRow > 9 || newCol < 0 || newCol > 8) break;
                
                const targetPiece = this.board[newRow][newCol];
                
                if (!hasJumped) {
                    if (targetPiece) {
                        hasJumped = true;
                    } else {
                        moves.push({ row: newRow, col: newCol });
                    }
                } else {
                    if (targetPiece) {
                        if (targetPiece.color !== currentColor) {
                            moves.push({ row: newRow, col: newCol });
                        }
                        break;
                    }
                }
            }
        });
        
        return moves;
    }
    
    getSoldierMoves(row, col, color) {
        const moves = [];
        const forward = color === 'red' ? -1 : 1;
        const riverLine = color === 'red' ? 4 : 5;
        const hasPassedRiver = (color === 'red' && row < riverLine) || 
                              (color === 'black' && row > riverLine);
        
        // 向前移动
        const forwardRow = row + forward;
        if (forwardRow >= 0 && forwardRow <= 9) {
            const targetPiece = this.board[forwardRow][col];
            if (!targetPiece || targetPiece.color !== color) {
                moves.push({ row: forwardRow, col });
            }
        }
        
        // 过河后可以左右移动
        if (hasPassedRiver) {
            // 向左移动
            if (col > 0) {
                const targetPiece = this.board[row][col - 1];
                if (!targetPiece || targetPiece.color !== color) {
                    moves.push({ row, col: col - 1 });
                }
            }
            
            // 向右移动
            if (col < 8) {
                const targetPiece = this.board[row][col + 1];
                if (!targetPiece || targetPiece.color !== color) {
                    moves.push({ row, col: col + 1 });
                }
            }
        }
        
        return moves;
    }
    
    wouldCauseCheck(fromRow, fromCol, toRow, toCol) {
        // 临时移动
        const originalPiece = this.board[toRow][toCol];
        const movingPiece = this.board[fromRow][fromCol];
        
        this.board[toRow][toCol] = movingPiece;
        this.board[fromRow][fromCol] = null;
        
        // 检查是否被将军
        const inCheck = this.isInCheck(movingPiece.color);
        
        // 恢复原状
        this.board[fromRow][fromCol] = movingPiece;
        this.board[toRow][toCol] = originalPiece;
        
        return inCheck;
    }
    
    isInCheck(color) {
        // 找到己方将帅位置
        let generalPos = null;
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 9; col++) {
                const piece = this.board[row][col];
                if (piece && piece.type === '将' && piece.color === color) {
                    generalPos = { row, col };
                    break;
                }
            }
            if (generalPos) break;
        }
        
        if (!generalPos) return false;
        
        // 检查是否被对方棋子攻击
        const opponentColor = color === 'red' ? 'black' : 'red';
        
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 9; col++) {
                const piece = this.board[row][col];
                if (piece && piece.color === opponentColor) {
                    const moves = this.getValidMovesForCheck(row, col);
                    if (moves.some(move => move.row === generalPos.row && move.col === generalPos.col)) {
                        return true;
                    }
                }
            }
        }
        
        return false;
    }
    
    getValidMovesForCheck(row, col) {
        // 获取移动不考虑将军检查的版本
        const piece = this.board[row][col];
        if (!piece) return [];
        
        switch (piece.type) {
            case '将': return this.getGeneralMoves(row, col, piece.color);
            case '士': return this.getAdvisorMoves(row, col, piece.color);
            case '象': return this.getElephantMoves(row, col, piece.color);
            case '马': return this.getHorseMoves(row, col);
            case '车': return this.getChariotMoves(row, col);
            case '炮': return this.getCannonMoves(row, col);
            case '兵': return this.getSoldierMoves(row, col, piece.color);
            default: return [];
        }
    }
    
    isGameOver() {
        // 检查当前玩家的将帅是否被将死
        const color = this.currentPlayer === 'red' ? 'black' : 'red'; // 检查对方
        
        // 找到所有己方棋子
        const myPieces = [];
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 9; col++) {
                const piece = this.board[row][col];
                if (piece && piece.color === color) {
                    myPieces.push({ row, col, piece });
                }
            }
        }
        
        // 如果没有合法移动，则游戏结束
        for (const { row, col } of myPieces) {
            const validMoves = this.getValidMoves(row, col);
            if (validMoves.length > 0) {
                return false; // 还有合法移动
            }
        }
        
        return true; // 没有合法移动，游戏结束
    }
    
    makeAIMove() {
        if (this.gameOver) return;
        
        // 智能AI：使用评估函数选择最佳移动
        const aiPieces = [];
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 9; col++) {
                const piece = this.board[row][col];
                if (piece && piece.color === this.aiPlayer) {
                    const validMoves = this.getValidMoves(row, col);
                    if (validMoves.length > 0) {
                        aiPieces.push({ row, col, moves: validMoves, piece });
                    }
                }
            }
        }
        
        if (aiPieces.length > 0) {
            let bestMove = null;
            let bestScore = -Infinity;
            
            // 评估每个可能的移动
            for (const pieceData of aiPieces) {
                for (const move of pieceData.moves) {
                    const score = this.evaluateMove(pieceData.row, pieceData.col, move.row, move.col);
                    if (score > bestScore) {
                        bestScore = score;
                        bestMove = {
                            fromRow: pieceData.row,
                            fromCol: pieceData.col,
                            toRow: move.row,
                            toCol: move.col
                        };
                    }
                }
            }
            
            if (bestMove) {
                document.getElementById('thinkingIndicator').style.display = 'none';
                this.makeMove(bestMove.fromRow, bestMove.fromCol, bestMove.toRow, bestMove.toCol);
            }
        }
    }
    
    evaluateMove(fromRow, fromCol, toRow, toCol) {
        let score = 0;
        const piece = this.board[fromRow][fromCol];
        const targetPiece = this.board[toRow][toCol];
        
        // 吃子奖励
        if (targetPiece) {
            score += this.getPieceValue(targetPiece.type) * 10;
            
            // 吃将帅获得巨大奖励
            if (targetPiece.type === '将') {
                score += 10000;
            }
        }
        
        // 位置奖励
        score += this.getPositionValue(piece.type, toRow, toCol, piece.color);
        
        // 攻击奖励：能攻击到对方重要棋子
        const attacks = this.getAttackedPieces(toRow, toCol, piece);
        attacks.forEach(attackedPiece => {
            score += this.getPieceValue(attackedPiece.type) * 2;
        });
        
        // 保护奖励：移动后能保护己方棋子
        const protects = this.getProtectedPieces(toRow, toCol, piece);
        protects.forEach(protectedPiece => {
            score += this.getPieceValue(protectedPiece.type);
        });
        
        // 临时移动以检查是否会被将军
        const originalPiece = this.board[toRow][toCol];
        this.board[toRow][toCol] = piece;
        this.board[fromRow][fromCol] = null;
        
        // 如果移动后被将军，扣分
        if (this.isInCheck(piece.color)) {
            score -= 1000;
        }
        
        // 恢复棋盘
        this.board[fromRow][fromCol] = piece;
        this.board[toRow][toCol] = originalPiece;
        
        // 添加随机性
        score += Math.random() * 10;
        
        return score;
    }
    
    getPieceValue(type) {
        const values = {
            '将': 1000,
            '车': 90,
            '马': 45,
            '炮': 45,
            '士': 20,
            '象': 20,
            '兵': 10
        };
        return values[type] || 0;
    }
    
    getPositionValue(type, row, col, color) {
        // 简单的位置价值评估
        let value = 0;
        
        // 中心位置更有价值
        const centerCol = Math.abs(col - 4);
        value += (4 - centerCol) * 2;
        
        // 兵过河后价值增加
        if (type === '兵') {
            if ((color === 'red' && row < 5) || (color === 'black' && row > 4)) {
                value += 20;
            }
        }
        
        // 马在中心位置价值更高
        if (type === '马') {
            if (row >= 2 && row <= 7 && col >= 1 && col <= 7) {
                value += 10;
            }
        }
        
        return value;
    }
    
    getAttackedPieces(row, col, piece) {
        const attacked = [];
        const moves = this.getValidMovesForCheck(row, col);
        
        moves.forEach(move => {
            const targetPiece = this.board[move.row][move.col];
            if (targetPiece && targetPiece.color !== piece.color) {
                attacked.push(targetPiece);
            }
        });
        
        return attacked;
    }
    
    getProtectedPieces(row, col, piece) {
        const protectedPieces = [];
        const moves = this.getValidMovesForCheck(row, col);
        
        moves.forEach(move => {
            const targetPiece = this.board[move.row][move.col];
            if (targetPiece && targetPiece.color === piece.color) {
                protectedPieces.push(targetPiece);
            }
        });
        
        return protectedPieces;
    }
    
    undo() {
        if (this.moveHistory.length === 0 || this.gameOver) return;
        
        const lastMove = this.moveHistory.pop();
        
        // 恢复棋子位置
        this.board[lastMove.from.row][lastMove.from.col] = lastMove.piece;
        this.board[lastMove.to.row][lastMove.to.col] = lastMove.capturedPiece;
        
        // 如果有被吃的棋子，从被吃列表中移除
        if (lastMove.capturedPiece) {
            const capturedList = this.capturedPieces[lastMove.capturedPiece.color];
            const index = capturedList.findIndex(p => 
                p.type === lastMove.capturedPiece.type && 
                p.char === lastMove.capturedPiece.char
            );
            if (index > -1) {
                capturedList.splice(index, 1);
            }
        }
        
        // 恢复玩家
        this.currentPlayer = lastMove.player;
        
        // 重新创建棋盘
        this.createBoard();
        this.updateDisplay();
        this.updateStatus(`请${this.currentPlayer === 'red' ? '红方' : '黑方'}走棋`);
        
        document.getElementById('undoBtn').disabled = this.moveHistory.length === 0;
        document.getElementById('thinkingIndicator').style.display = 'none';
    }
    
    surrender() {
        if (this.gameOver) return;
        
        const winner = this.currentPlayer === 'red' ? '黑方' : '红方';
        this.endGame(`${winner}获胜！(${this.currentPlayer === 'red' ? '红方' : '黑方'}认输)`);
    }
    
    endGame(message) {
        this.gameOver = true;
        this.stopTimer();
        
        if (!message) {
            const winner = this.currentPlayer === 'red' ? '黑方' : '红方';
            message = `${winner}获胜！`;
        }
        
        // 保存游戏记录
        this.saveGameRecord();
        
        this.updateStatus(message);
        document.getElementById('thinkingIndicator').style.display = 'none';
        
        this.showVictoryMessage(message);
    }
    
    showVictoryMessage(message) {
        const victoryDiv = document.createElement('div');
        victoryDiv.className = 'victory-message';
        
        const minutes = Math.floor(this.getGameTime() / 60);
        const seconds = this.getGameTime() % 60;
        const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        victoryDiv.innerHTML = `
            <h2>${message}</h2>
            <div class="victory-stats">
                <div>🕐 用时: ${timeStr}</div>
                <div>🔄 总步数: ${this.moveHistory.length}</div>
                <div>🎯 红方被吃: ${this.capturedPieces.red.length}</div>
                <div>🎯 黑方被吃: ${this.capturedPieces.black.length}</div>
            </div>
            <button onclick="chessGame.newGame(); this.parentElement.remove();" style="margin-top: 20px;">再来一局</button>
        `;
        document.body.appendChild(victoryDiv);
    }
    
    newGame() {
        // 移除胜利消息
        const victoryMessage = document.querySelector('.victory-message');
        if (victoryMessage) {
            victoryMessage.remove();
        }
        
        this.initGame();
    }
    
    toggleAIMode() {
        this.isAIMode = !this.isAIMode;
        const button = document.getElementById('aiModeBtn');
        
        if (this.isAIMode) {
            button.textContent = '双人对战';
            button.classList.add('ai-active');
            this.updateStatus('🤖 人机对战模式 - 你是红方');
        } else {
            button.textContent = '人机对战';
            button.classList.remove('ai-active');
            this.updateStatus('👥 双人对战模式');
        }
        
        this.newGame();
    }
    
    startTimer() {
        this.gameStartTime = Date.now();
        this.stopTimer();
        
        this.gameTimer = setInterval(() => {
            this.updateGameTime();
        }, 1000);
    }
    
    stopTimer() {
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }
    }
    
    getGameTime() {
        if (!this.gameStartTime) return 0;
        return Math.floor((Date.now() - this.gameStartTime) / 1000);
    }
    
    updateGameTime() {
        const time = this.getGameTime();
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        document.getElementById('gameTime').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    updateCapturedPieces() {
        const redList = document.getElementById('capturedRedList');
        const blackList = document.getElementById('capturedBlackList');
        
        redList.innerHTML = '';
        blackList.innerHTML = '';
        
        this.capturedPieces.red.forEach(piece => {
            const pieceEl = document.createElement('div');
            pieceEl.className = 'captured-piece red';
            pieceEl.textContent = piece.char;
            redList.appendChild(pieceEl);
        });
        
        this.capturedPieces.black.forEach(piece => {
            const pieceEl = document.createElement('div');
            pieceEl.className = 'captured-piece black';
            pieceEl.textContent = piece.char;
            blackList.appendChild(pieceEl);
        });
    }
    
    updateStatus(message) {
        document.getElementById('statusMessage').textContent = message;
    }
    
    updateDisplay() {
        const currentPlayerEl = document.getElementById('currentPlayer');
        currentPlayerEl.textContent = `${this.currentPlayer === 'red' ? '🔴 红方' : '⚫ 黑方'}`;
        currentPlayerEl.className = `current-player ${this.currentPlayer}`;
        
        // 检查将军状态
        let gameStatus = this.gameOver ? '已结束' : '进行中';
        if (!this.gameOver && this.isInCheck(this.currentPlayer)) {
            gameStatus = '被将军';
            currentPlayerEl.style.animation = 'checkWarning 1s infinite';
        } else {
            currentPlayerEl.style.animation = 'none';
        }
        
        document.getElementById('gameStatus').textContent = gameStatus;
        document.getElementById('moveCount').textContent = this.moveHistory.length;
        
        this.updateGameTime();
        this.updateCapturedPieces();
    }
    
    // 添加将军警告动画CSS
    addCheckWarningCSS() {
        if (!document.getElementById('checkWarningCSS')) {
            const style = document.createElement('style');
            style.id = 'checkWarningCSS';
            style.textContent = `
                @keyframes checkWarning {
                    0%, 100% { 
                        background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
                        box-shadow: 0 0 10px rgba(239, 68, 68, 0.3);
                    }
                    50% { 
                        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                        box-shadow: 0 0 20px rgba(239, 68, 68, 0.8);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // 播放移动音效（模拟）
    playMoveSound(isCapture = false) {
        // 在实际应用中，这里可以播放真实的音效文件
        if (isCapture) {
            console.log('🎵 播放吃子音效');
        } else {
            console.log('🎵 播放移动音效');
        }
    }
    
    // 保存游戏记录
    saveGameRecord() {
        const gameRecord = {
            date: new Date().toISOString(),
            moves: this.moveHistory,
            winner: this.gameOver ? this.getWinner() : null,
            duration: this.getGameTime(),
            isAIMode: this.isAIMode
        };
        
        const records = JSON.parse(localStorage.getItem('chessGameRecords') || '[]');
        records.unshift(gameRecord);
        
        // 只保留最近50局记录
        if (records.length > 50) {
            records.splice(50);
        }
        
        localStorage.setItem('chessGameRecords', JSON.stringify(records));
    }
    
    getWinner() {
        if (!this.gameOver) return null;
        
        // 检查哪方被将死或无法移动
        const redCanMove = this.hasValidMoves('red');
        const blackCanMove = this.hasValidMoves('black');
        
        if (!redCanMove) return 'black';
        if (!blackCanMove) return 'red';
        
        return null; // 平局
    }
    
    hasValidMoves(color) {
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 9; col++) {
                const piece = this.board[row][col];
                if (piece && piece.color === color) {
                    const moves = this.getValidMoves(row, col);
                    if (moves.length > 0) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    
    // 显示游戏记录
    showGameRecords() {
        const records = JSON.parse(localStorage.getItem('chessGameRecords') || '[]');
        
        const modal = document.createElement('div');
        modal.className = 'victory-message';
        modal.style.maxHeight = '80vh';
        modal.style.overflowY = 'auto';
        
        let recordsHTML = '<h2>📊 游戏记录</h2><div style="text-align: left; margin: 20px 0;">';
        
        if (records.length === 0) {
            recordsHTML += '<p>暂无游戏记录</p>';
        } else {
            records.slice(0, 10).forEach((record, index) => {
                const date = new Date(record.date).toLocaleString();
                const duration = Math.floor(record.duration / 60) + ':' + 
                    (record.duration % 60).toString().padStart(2, '0');
                const winner = record.winner === 'red' ? '🔴 红方' : 
                    record.winner === 'black' ? '⚫ 黑方' : '🤝 平局';
                const mode = record.isAIMode ? '🤖 人机' : '👥 双人';
                
                recordsHTML += `
                    <div style="border-bottom: 1px solid rgba(255,255,255,0.3); padding: 10px 0;">
                        <div><strong>第${index + 1}局</strong> - ${date}</div>
                        <div>获胜方: ${winner} | 模式: ${mode}</div>
                        <div>用时: ${duration} | 步数: ${record.moves.length}</div>
                    </div>
                `;
            });
        }
        
        recordsHTML += '</div>';
        recordsHTML += '<button onclick="this.parentElement.remove()">关闭</button>';
        
        if (records.length > 0) {
            recordsHTML += '<button onclick="chessGame.clearGameRecords(); this.parentElement.remove();" style="margin-left: 10px;">清空记录</button>';
        }
        
        modal.innerHTML = recordsHTML;
        document.body.appendChild(modal);
    }
    
    clearGameRecords() {
        if (confirm('确定要清空所有游戏记录吗？')) {
            localStorage.removeItem('chessGameRecords');
        }
    }
    
    // 获取棋谱字符串（简化版）
    getGameNotation() {
        const notation = [];
        this.moveHistory.forEach((move, index) => {
            const moveNum = Math.floor(index / 2) + 1;
            const player = move.player === 'red' ? '红' : '黑';
            const piece = move.piece.char;
            const from = `${String.fromCharCode(97 + move.from.col)}${10 - move.from.row}`;
            const to = `${String.fromCharCode(97 + move.to.col)}${10 - move.to.row}`;
            
            if (index % 2 === 0) {
                notation.push(`${moveNum}. ${piece}${from}-${to}`);
            } else {
                notation[notation.length - 1] += ` ${piece}${from}-${to}`;
            }
        });
        
        return notation.join('\n');
    }
    
    // 导出棋谱
    exportGame() {
        const notation = this.getGameNotation();
        const gameInfo = `
中国象棋对局记录
================
日期: ${new Date().toLocaleString()}
模式: ${this.isAIMode ? '人机对战' : '双人对战'}
用时: ${Math.floor(this.getGameTime() / 60)}:${(this.getGameTime() % 60).toString().padStart(2, '0')}
步数: ${this.moveHistory.length}

棋谱:
${notation}
        `;
        
        const blob = new Blob([gameInfo], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `象棋对局_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }
    
    positionToChineseNotation(row, col) {
        const colNames = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];
        const rowNames = ['１', '２', '３', '４', '５', '６', '７', '８', '９', '１０'];
        return colNames[col] + rowNames[row];
    }
    
    exportCurrentGame() {
        if (this.moveHistory.length === 0) {
            alert('没有棋步可以导出！');
            return;
        }
        
        let notation = '';
        for (let i = 0; i < this.moveHistory.length; i++) {
            const move = this.moveHistory[i];
            const moveNum = Math.floor(i / 2) + 1;
            const isRed = i % 2 === 0;
            
            const fromPos = this.positionToChineseNotation(move.from.row, move.from.col);
            const toPos = this.positionToChineseNotation(move.to.row, move.to.col);
            
            if (isRed) {
                notation += `${moveNum}. ${move.piece.char}${fromPos}-${toPos}`;
            } else {
                notation += ` ${move.piece.char}${fromPos}-${toPos}\n`;
            }
        }
        
        const gameInfo = `中国象棋对局记录
时间: ${new Date().toLocaleString()}
对局模式: ${this.isAIMode ? '人机对战' : '双人对战'}
胜负: ${this.gameOver ? this.getWinner() : '进行中'}
用时: ${this.getGameTime()}
步数: ${this.moveHistory.length}

棋谱:
${notation}
        `;
        
        const blob = new Blob([gameInfo], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `象棋对局_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }
    
    showGameRecords() {
        const records = this.getGameRecords();
        
        const recordsModal = document.createElement('div');
        recordsModal.className = 'records-modal';
        recordsModal.innerHTML = `
            <div class="modal-content">
                <h2>🏆 对局记录</h2>
                <div class="records-list">
                    ${records.length === 0 ? 
                        '<p class="no-records">暂无对局记录</p>' : 
                        records.map((record, index) => `
                            <div class="record-item">
                                <div class="record-header">
                                    <span class="record-date">${new Date(record.date).toLocaleString()}</span>
                                    <span class="record-result ${record.winner}">${record.winner ? (record.winner === 'red' ? '红方胜' : '黑方胜') : '未完成'}</span>
                                </div>
                                <div class="record-details">
                                    <span>模式: ${record.isAIMode ? '人机对战' : '双人对战'}</span>
                                    <span>步数: ${record.moves.length}</span>
                                    <span>用时: ${record.duration}</span>
                                </div>
                                <div class="record-actions">
                                    <button onclick="chessGame.viewGameRecord(${index})" class="view-btn">查看</button>
                                    <button onclick="chessGame.deleteGameRecord(${index})" class="delete-btn">删除</button>
                                </div>
                            </div>
                        `).join('')
                    }
                </div>
                <div class="modal-actions">
                    <button onclick="chessGame.clearAllRecords()" class="clear-all-btn">清空记录</button>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" class="close-btn">关闭</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(recordsModal);
    }
    
    viewGameRecord(index) {
        const records = this.getGameRecords();
        const record = records[index];
        
        if (!record) return;
        
        const detailModal = document.createElement('div');
        detailModal.className = 'record-detail-modal';
        
        let notation = '';
        for (let i = 0; i < record.moves.length; i++) {
            const move = record.moves[i];
            const moveNum = Math.floor(i / 2) + 1;
            const isRed = i % 2 === 0;
            
            if (isRed) {
                notation += `${moveNum}. ${move.piece.char}${move.from.row}${move.from.col}-${move.to.row}${move.to.col}`;
            } else {
                notation += ` ${move.piece.char}${move.from.row}${move.from.col}-${move.to.row}${move.to.col}<br>`;
            }
        }
        
        detailModal.innerHTML = `
            <div class="modal-content">
                <h2>📋 对局详情</h2>
                <div class="game-info-detail">
                    <p><strong>日期:</strong> ${new Date(record.date).toLocaleString()}</p>
                    <p><strong>模式:</strong> ${record.isAIMode ? '人机对战' : '双人对战'}</p>
                    <p><strong>结果:</strong> ${record.winner ? (record.winner === 'red' ? '红方胜' : '黑方胜') : '未完成'}</p>
                    <p><strong>步数:</strong> ${record.moves.length}</p>
                    <p><strong>用时:</strong> ${record.duration}</p>
                </div>
                <div class="moves-notation">
                    <h3>棋谱记录:</h3>
                    <div class="notation-content">${notation}</div>
                </div>
                <div class="modal-actions">
                    <button onclick="chessGame.exportGameRecord(${index})" class="export-btn">导出此局</button>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" class="close-btn">关闭</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(detailModal);
    }
    
    deleteGameRecord(index) {
        if (confirm('确定要删除此对局记录吗？')) {
            const records = this.getGameRecords();
            records.splice(index, 1);
            localStorage.setItem('chessGameRecords', JSON.stringify(records));
            
            document.querySelector('.records-modal').remove();
            this.showGameRecords();
        }
    }
    
    clearAllRecords() {
        if (confirm('确定要清空所有对局记录吗？此操作不可撤销！')) {
            localStorage.removeItem('chessGameRecords');
            document.querySelector('.records-modal').remove();
            this.showGameRecords();
        }
    }
    
    exportGameRecord(index) {
        const records = this.getGameRecords();
        const record = records[index];
        
        if (!record) return;
        
        let notation = '';
        for (let i = 0; i < record.moves.length; i++) {
            const move = record.moves[i];
            const moveNum = Math.floor(i / 2) + 1;
            const isRed = i % 2 === 0;
            
            if (isRed) {
                notation += `${moveNum}. ${move.piece.char}${move.from.row}${move.from.col}-${move.to.row}${move.to.col}`;
            } else {
                notation += ` ${move.piece.char}${move.from.row}${move.from.col}-${move.to.row}${move.to.col}\n`;
            }
        }
        
        const gameInfo = `中国象棋对局记录
时间: ${new Date(record.date).toLocaleString()}
对局模式: ${record.isAIMode ? '人机对战' : '双人对战'}
胜负: ${record.winner ? (record.winner === 'red' ? '红方胜' : '黑方胜') : '未完成'}
用时: ${record.duration}
步数: ${record.moves.length}

棋谱:
${notation}
        `;
        
        const blob = new Blob([gameInfo], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `象棋对局_${new Date(record.date).toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }

    bindEvents() {
        // 键盘事件
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'u':
                case 'U':
                    e.preventDefault();
                    this.undo();
                    break;
                case 'n':
                case 'N':
                    e.preventDefault();
                    this.newGame();
                    break;
                case 'Escape':
                    this.clearSelection();
                    break;
            }
        });
        
        // 防止右键菜单
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }
}

// 全局变量
let chessGame;

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    try {
        chessGame = new ChineseChess();
        console.log('中国象棋游戏初始化成功');
    } catch (error) {
        console.error('中国象棋游戏初始化失败:', error);
    }
});