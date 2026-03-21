class Checkers {
    constructor() {
        // 游戏设置
        this.currentPlayer = 'red'; // 'red' 或 'black'
        this.gameOver = false;
        this.isAIMode = false;
        this.aiPlayer = 'black';
        this.selectedPiece = null;
        this.validMoves = [];
        this.moveHistory = [];
        this.mustCapture = false;
        this.captureSequence = [];
        
        // 棋子计数
        this.pieceCounts = { red: 12, black: 12 };
        
        this.initGame();
        this.bindEvents();
        this.updateDisplay();
    }
    
    initGame() {
        // 初始化8x8棋盘
        this.board = Array(8).fill(null).map(() => Array(8).fill(null));
        
        // 重置游戏状态
        this.currentPlayer = 'red';
        this.gameOver = false;
        this.selectedPiece = null;
        this.validMoves = [];
        this.moveHistory = [];
        this.mustCapture = false;
        this.captureSequence = [];
        this.pieceCounts = { red: 12, black: 12 };
        
        // 初始化棋子位置
        this.setupInitialPosition();
        
        // 创建棋盘UI
        this.createBoard();
        
        this.updateStatus('请红方走棋');
        this.updateDisplay();
    }
    
    setupInitialPosition() {
        // 黑方棋子 (上方 3 行)
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 8; col++) {
                if ((row + col) % 2 === 1) { // 只在深色格子上放棋子
                    this.board[row][col] = { color: 'black', isKing: false };
                }
            }
        }
        
        // 红方棋子 (下方 3 行)
        for (let row = 5; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if ((row + col) % 2 === 1) { // 只在深色格子上放棋子
                    this.board[row][col] = { color: 'red', isKing: false };
                }
            }
        }
    }
    
    createBoard() {
        const boardElement = document.getElementById('checkersBoard');
        boardElement.innerHTML = '';
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = `square ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
                square.dataset.row = row;
                square.dataset.col = col;
                
                square.addEventListener('click', (e) => this.handleClick(e));
                
                // 如果有棋子，创建棋子元素
                const piece = this.board[row][col];
                if (piece) {
                    const pieceElement = document.createElement('div');
                    pieceElement.className = `piece ${piece.color}${piece.isKing ? ' king' : ''}`;
                    pieceElement.dataset.row = row;
                    pieceElement.dataset.col = col;
                    square.appendChild(pieceElement);
                }
                
                boardElement.appendChild(square);
            }
        }
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
        
        // 如果必须吃子但这个棋子没有吃子机会，不能选择
        if (this.mustCapture && !this.validMoves.some(move => move.isCapture)) {
            this.clearSelection();
            return;
        }
        
        // 高亮选中的棋子
        const square = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        if (square) {
            square.classList.add('selected');
        }
        
        // 高亮可移动位置
        this.validMoves.forEach(move => {
            const square = document.querySelector(`[data-row="${move.row}"][data-col="${move.col}"]`);
            if (square) {
                square.classList.add('valid-move');
            }
        });
    }
    
    clearSelection() {
        // 清除选中状态
        document.querySelectorAll('.square.selected').forEach(el => {
            el.classList.remove('selected');
        });
        
        // 清除可移动位置高亮
        document.querySelectorAll('.square.valid-move').forEach(el => {
            el.classList.remove('valid-move');
        });
        
        // 清除上次移动高亮
        document.querySelectorAll('.square.last-move').forEach(el => {
            el.classList.remove('last-move');
        });
        
        this.selectedPiece = null;
        this.validMoves = [];
    }
    
    makeMove(fromRow, fromCol, toRow, toCol) {
        const piece = this.board[fromRow][fromCol];
        const move = this.validMoves.find(m => m.row === toRow && m.col === toCol);
        
        if (!move) return;
        
        // 记录移动历史
        const moveRecord = {
            from: { row: fromRow, col: fromCol },
            to: { row: toRow, col: toCol },
            piece: { ...piece },
            capturedPieces: [],
            wasKing: piece.isKing,
            player: this.currentPlayer
        };
        
        // 移动棋子
        this.board[toRow][toCol] = piece;
        this.board[fromRow][fromCol] = null;
        
        // 处理吃子
        if (move.isCapture) {
            move.capturedPositions.forEach(pos => {
                const capturedPiece = this.board[pos.row][pos.col];
                moveRecord.capturedPieces.push({
                    piece: { ...capturedPiece },
                    position: { ...pos }
                });
                
                this.board[pos.row][pos.col] = null;
                this.pieceCounts[capturedPiece.color]--;
            });
        }
        
        // 检查是否升级为王棋
        if (!piece.isKing) {
            if ((piece.color === 'red' && toRow === 0) || 
                (piece.color === 'black' && toRow === 7)) {
                piece.isKing = true;
                moveRecord.becameKing = true;
            }
        }
        
        this.moveHistory.push(moveRecord);
        
        // 清除选择状态
        this.clearSelection();
        
        // 重新创建棋盘
        this.createBoard();
        
        // 高亮最后移动
        const fromSquare = document.querySelector(`[data-row="${fromRow}"][data-col="${fromCol}"]`);
        const toSquare = document.querySelector(`[data-row="${toRow}"][data-col="${toCol}"]`);
        if (fromSquare) fromSquare.classList.add('last-move');
        if (toSquare) toSquare.classList.add('last-move');
        
        // 检查是否有连续跳跃机会
        if (move.isCapture) {
            const additionalCaptures = this.getCaptureMoves(toRow, toCol);
            if (additionalCaptures.length > 0) {
                // 继续同一玩家的回合，但必须用同一棋子
                this.mustCapture = true;
                this.captureSequence = [{ row: toRow, col: toCol }];
                this.selectPiece(toRow, toCol);
                this.updateStatus(`${this.currentPlayer === 'red' ? '红方' : '黑方'}必须继续跳跃`);
                return;
            }
        }
        
        // 重置吃子状态
        this.mustCapture = false;
        this.captureSequence = [];
        
        // 检查游戏结束
        if (this.isGameOver()) {
            this.endGame();
        } else {
            // 切换玩家
            this.currentPlayer = this.currentPlayer === 'red' ? 'black' : 'red';
            
            // 检查新玩家是否必须吃子
            this.checkMustCapture();
            
            this.updateDisplay();
            
            // 如果是AI模式且轮到AI
            if (this.isAIMode && this.currentPlayer === this.aiPlayer) {
                this.updateStatus('🤔 AI正在思考...');
                document.getElementById('thinkingIndicator').style.display = 'block';
                
                setTimeout(() => {
                    this.makeAIMove();
                }, 1000);
            } else {
                const captureMsg = this.mustCapture ? '必须吃子！' : '';
                this.updateStatus(`请${this.currentPlayer === 'red' ? '红方' : '黑方'}走棋 ${captureMsg}`);
            }
        }
        
        // 更新撤销按钮状态
        document.getElementById('undoBtn').disabled = this.moveHistory.length === 0 || this.gameOver;
    }
    
    isValidMove(fromRow, fromCol, toRow, toCol) {
        return this.validMoves.some(move => move.row === toRow && move.col === toCol);
    }
    
    getValidMoves(row, col) {
        const piece = this.board[row][col];
        if (!piece || piece.color !== this.currentPlayer) return [];
        
        // 如果处于连续跳跃状态，只能移动指定的棋子
        if (this.captureSequence.length > 0) {
            const canMove = this.captureSequence.some(pos => pos.row === row && pos.col === col);
            if (!canMove) return [];
        }
        
        const moves = [];
        
        // 获取基本移动
        const basicMoves = this.getBasicMoves(row, col);
        const captureMoves = this.getCaptureMoves(row, col);
        
        // 如果必须吃子，只返回吃子移动
        if (this.mustCapture || captureMoves.length > 0) {
            moves.push(...captureMoves);
        } else {
            moves.push(...basicMoves);
        }
        
        return moves;
    }
    
    getBasicMoves(row, col) {
        const piece = this.board[row][col];
        const moves = [];
        
        // 确定移动方向
        const directions = [];
        
        if (piece.isKing) {
            // 王棋可以向四个斜向移动
            directions.push([-1, -1], [-1, 1], [1, -1], [1, 1]);
        } else {
            // 普通棋子只能向前移动
            if (piece.color === 'red') {
                directions.push([-1, -1], [-1, 1]); // 红方向上
            } else {
                directions.push([1, -1], [1, 1]); // 黑方向下
            }
        }
        
        directions.forEach(([dRow, dCol]) => {
            const newRow = row + dRow;
            const newCol = col + dCol;
            
            if (this.isValidPosition(newRow, newCol) && !this.board[newRow][newCol]) {
                moves.push({ row: newRow, col: newCol, isCapture: false });
            }
        });
        
        return moves;
    }
    
    getCaptureMoves(row, col) {
        const piece = this.board[row][col];
        const moves = [];
        
        // 确定移动方向
        const directions = [];
        
        if (piece.isKing) {
            directions.push([-1, -1], [-1, 1], [1, -1], [1, 1]);
        } else {
            if (piece.color === 'red') {
                directions.push([-1, -1], [-1, 1]);
            } else {
                directions.push([1, -1], [1, 1]);
            }
        }
        
        directions.forEach(([dRow, dCol]) => {
            const captureRow = row + dRow;
            const captureCol = col + dCol;
            const landRow = row + dRow * 2;
            const landCol = col + dCol * 2;
            
            if (this.isValidPosition(captureRow, captureCol) && 
                this.isValidPosition(landRow, landCol)) {
                
                const capturedPiece = this.board[captureRow][captureCol];
                const landingSquare = this.board[landRow][landCol];
                
                if (capturedPiece && 
                    capturedPiece.color !== piece.color && 
                    !landingSquare) {
                    
                    moves.push({
                        row: landRow,
                        col: landCol,
                        isCapture: true,
                        capturedPositions: [{ row: captureRow, col: captureCol }]
                    });
                }
            }
        });
        
        return moves;
    }
    
    isValidPosition(row, col) {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }
    
    checkMustCapture() {
        // 检查当前玩家是否有吃子机会
        let hasCaptures = false;
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && piece.color === this.currentPlayer) {
                    const captures = this.getCaptureMoves(row, col);
                    if (captures.length > 0) {
                        hasCaptures = true;
                        break;
                    }
                }
            }
            if (hasCaptures) break;
        }
        
        this.mustCapture = hasCaptures;
    }
    
    isGameOver() {
        // 检查是否有棋子剩余
        if (this.pieceCounts.red === 0 || this.pieceCounts.black === 0) {
            return true;
        }
        
        // 检查当前玩家是否有合法移动
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && piece.color === this.currentPlayer) {
                    const moves = this.getValidMoves(row, col);
                    if (moves.length > 0) {
                        return false; // 还有合法移动
                    }
                }
            }
        }
        
        return true; // 没有合法移动
    }
    
    makeAIMove() {
        if (this.gameOver) return;
        
        // 简单AI：选择第一个可用的移动
        const aiPieces = [];
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && piece.color === this.aiPlayer) {
                    const validMoves = this.getValidMoves(row, col);
                    if (validMoves.length > 0) {
                        aiPieces.push({ row, col, moves: validMoves });
                    }
                }
            }
        }
        
        if (aiPieces.length > 0) {
            // 优先选择吃子移动
            let selectedPiece = aiPieces.find(p => p.moves.some(m => m.isCapture));
            if (!selectedPiece) {
                selectedPiece = aiPieces[Math.floor(Math.random() * aiPieces.length)];
            }
            
            const captureMoves = selectedPiece.moves.filter(m => m.isCapture);
            const move = captureMoves.length > 0 ? 
                captureMoves[Math.floor(Math.random() * captureMoves.length)] :
                selectedPiece.moves[Math.floor(Math.random() * selectedPiece.moves.length)];
            
            document.getElementById('thinkingIndicator').style.display = 'none';
            this.makeMove(selectedPiece.row, selectedPiece.col, move.row, move.col);
        }
    }
    
    undo() {
        if (this.moveHistory.length === 0 || this.gameOver) return;
        
        const lastMove = this.moveHistory.pop();
        
        // 恢复棋子位置
        this.board[lastMove.from.row][lastMove.from.col] = lastMove.piece;
        this.board[lastMove.to.row][lastMove.to.col] = null;
        
        // 恢复王棋状态
        if (lastMove.becameKing) {
            this.board[lastMove.from.row][lastMove.from.col].isKing = lastMove.wasKing;
        }
        
        // 恢复被吃的棋子
        lastMove.capturedPieces.forEach(captured => {
            this.board[captured.position.row][captured.position.col] = captured.piece;
            this.pieceCounts[captured.piece.color]++;
        });
        
        // 恢复玩家
        this.currentPlayer = lastMove.player;
        
        // 重置状态
        this.mustCapture = false;
        this.captureSequence = [];
        this.checkMustCapture();
        
        // 重新创建棋盘
        this.createBoard();
        this.updateDisplay();
        
        const captureMsg = this.mustCapture ? '必须吃子！' : '';
        this.updateStatus(`请${this.currentPlayer === 'red' ? '红方' : '黑方'}走棋 ${captureMsg}`);
        
        document.getElementById('undoBtn').disabled = this.moveHistory.length === 0;
        document.getElementById('thinkingIndicator').style.display = 'none';
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
    
    showRules() {
        const rulesModal = document.createElement('div');
        rulesModal.className = 'rules-modal';
        rulesModal.innerHTML = `
            <h2>🔴 跳棋游戏规则 ⚫</h2>
            <div class="rules-content">
                <h3>📋 基本规则</h3>
                <ul>
                    <li>跳棋在8×8的棋盘上进行，只使用深色格子</li>
                    <li>每方开始时有12个棋子，红方在下方，黑方在上方</li>
                    <li>红方先走，双方轮流行棋</li>
                </ul>
                
                <h3>🚶 移动规则</h3>
                <ul>
                    <li>普通棋子只能斜向前进一格到空格</li>
                    <li>王棋（升级后）可以向前后四个斜向移动</li>
                    <li>不能向后移动（除非是王棋）</li>
                </ul>
                
                <h3>⚡ 吃子规则</h3>
                <ul>
                    <li>跳过相邻的对方棋子到空格即可吃掉该棋子</li>
                    <li>可以连续跳跃吃掉多个棋子</li>
                    <li>如果能吃子，必须吃子（强制吃子）</li>
                    <li>连续跳跃时必须用同一个棋子完成</li>
                </ul>
                
                <h3>👑 王棋升级</h3>
                <ul>
                    <li>棋子到达对方底线时升级为王棋</li>
                    <li>王棋可以向前后四个斜向移动和吃子</li>
                    <li>王棋用王冠标识</li>
                </ul>
                
                <h3>🏆 胜利条件</h3>
                <ul>
                    <li>吃掉对方所有棋子</li>
                    <li>封锁对方使其无法移动</li>
                </ul>
            </div>
            <button onclick="this.parentElement.remove()" style="margin-top: 20px;">知道了</button>
        `;
        document.body.appendChild(rulesModal);
    }
    
    endGame() {
        this.gameOver = true;
        
        let winner, message;
        if (this.pieceCounts.red === 0) {
            winner = 'black';
            message = '⚫ 黑方获胜！';
        } else if (this.pieceCounts.black === 0) {
            winner = 'red';
            message = '🔴 红方获胜！';
        } else {
            // 无法移动
            winner = this.currentPlayer === 'red' ? 'black' : 'red';
            message = `${winner === 'red' ? '🔴 红方' : '⚫ 黑方'}获胜！(对方无法移动)`;
        }
        
        this.updateStatus(message);
        document.getElementById('thinkingIndicator').style.display = 'none';
        
        this.showVictoryMessage(message);
    }
    
    showVictoryMessage(message) {
        const victoryDiv = document.createElement('div');
        victoryDiv.className = 'victory-message';
        victoryDiv.innerHTML = `
            <h2>${message}</h2>
            <div class="victory-stats">
                <div>🔴 红方剩余: ${this.pieceCounts.red}</div>
                <div>⚫ 黑方剩余: ${this.pieceCounts.black}</div>
                <div>🔄 总步数: ${this.moveHistory.length}</div>
            </div>
            <button onclick="checkers.newGame(); this.parentElement.remove();" style="margin-top: 20px;">再来一局</button>
        `;
        document.body.appendChild(victoryDiv);
    }
    
    updateStatus(message) {
        document.getElementById('statusMessage').textContent = message;
    }
    
    updateDisplay() {
        const currentPlayerEl = document.getElementById('currentPlayer');
        currentPlayerEl.textContent = `${this.currentPlayer === 'red' ? '🔴 红方' : '⚫ 黑方'}`;
        currentPlayerEl.className = `current-player ${this.currentPlayer}`;
        
        document.getElementById('redPieces').textContent = this.pieceCounts.red;
        document.getElementById('blackPieces').textContent = this.pieceCounts.black;
        document.getElementById('moveCount').textContent = this.moveHistory.length;
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
                case 'r':
                case 'R':
                    e.preventDefault();
                    this.showRules();
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
let checkers;

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    checkers = new Checkers();
});