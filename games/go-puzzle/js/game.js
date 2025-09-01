class GoPuzzleGame {
            constructor() {
                this.currentPuzzleIndex = 0;
                this.board = Array(11).fill(null).map(() => Array(11).fill(0)); // 0=空, 1=黑, 2=白
                this.moveHistory = [];
                this.startTime = Date.now();
                this.solvedPuzzles = new Set(JSON.parse(localStorage.getItem('solvedGoPuzzles') || '[]'));
                this.currentPlayer = 1; // 1=黑先, 2=白
                
                this.puzzles = [
                    {
                        name: "基础死活",
                        description: "黑先，争取做活",
                        type: "life",
                        goal: "做活黑棋",
                        difficulty: 2,
                        board: [
                            [0,0,0,0,0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0,0,0,0,0],
                            [0,0,0,2,2,2,0,0,0,0,0],
                            [0,0,2,1,1,1,2,0,0,0,0],
                            [0,0,2,1,0,1,2,0,0,0,0],
                            [0,0,2,1,1,1,2,0,0,0,0],
                            [0,0,0,2,2,2,0,0,0,0,0],
                            [0,0,0,0,0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0,0,0,0,0]
                        ],
                        solution: [{row: 5, col: 4}],
                        firstMove: 1
                    },
                    {
                        name: "角部死活",
                        description: "黑先，杀死白棋",
                        type: "death",
                        goal: "杀死白棋",
                        difficulty: 3,
                        board: [
                            [1,1,2,0,0,0,0,0,0,0,0],
                            [0,1,2,0,0,0,0,0,0,0,0],
                            [1,1,2,0,0,0,0,0,0,0,0],
                            [2,2,2,0,0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0,0,0,0,0]
                        ],
                        solution: [{row: 1, col: 0}],
                        firstMove: 1
                    },
                    {
                        name: "手筋练习",
                        description: "黑先，找出妙手",
                        type: "tesuji",
                        goal: "找出最佳手筋",
                        difficulty: 4,
                        board: [
                            [0,0,0,0,0,0,0,0,0,0,0],
                            [0,0,1,2,2,1,0,0,0,0,0],
                            [0,1,1,2,0,2,1,1,0,0,0],
                            [0,1,2,2,2,2,2,1,0,0,0],
                            [0,1,2,1,1,1,2,1,0,0,0],
                            [0,1,2,1,0,1,2,1,0,0,0],
                            [0,1,2,1,1,1,2,1,0,0,0],
                            [0,1,2,2,2,2,2,1,0,0,0],
                            [0,1,1,1,1,1,1,1,0,0,0],
                            [0,0,0,0,0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0,0,0,0,0]
                        ],
                        solution: [{row: 5, col: 4}],
                        firstMove: 1
                    }
                ];
                
                // 生成更多题目
                for (let i = 4; i <= 15; i++) {
                    this.puzzles.push({
                        name: `死活题${i}`,
                        description: `第${i}题：围棋基础训练`,
                        type: ["life", "death", "tesuji"][i % 3],
                        goal: "完成目标",
                        difficulty: Math.floor(i / 3) + 1,
                        board: this.generateRandomPuzzle(),
                        solution: [],
                        firstMove: 1
                    });
                }
                
                this.init();
            }

            init() {
                this.createBoard();
                this.loadPuzzle(0);
                this.updateDisplay();
                this.updatePuzzleList();
                this.startTimer();
            }

            createBoard() {
                const board = document.getElementById('goBoard');
                // 清除现有内容但保留坐标标签
                const cells = board.querySelectorAll('.go-cell');
                cells.forEach(cell => cell.remove());
                
                for (let row = 0; row < 11; row++) {
                    for (let col = 0; col < 11; col++) {
                        const cell = document.createElement('div');
                        cell.className = 'go-cell';
                        cell.dataset.row = row;
                        cell.dataset.col = col;
                        cell.onclick = () => this.handleCellClick(row, col);
                        
                        // 添加棋盘线条样式
                        if (row === 0) cell.style.borderTop = 'none';
                        if (row === 10) cell.style.borderBottom = 'none';
                        if (col === 0) cell.style.borderLeft = 'none';
                        if (col === 10) cell.style.borderRight = 'none';
                        
                        // 星位标记
                        if ((row === 3 && col === 3) || (row === 3 && col === 7) || 
                            (row === 7 && col === 3) || (row === 7 && col === 7) || 
                            (row === 5 && col === 5)) {
                            cell.style.background = 'radial-gradient(circle, #8B4513 1px, transparent 1px)';
                        }
                        
                        board.appendChild(cell);
                    }
                }
            }

            loadPuzzle(index) {
                if (index < 0 || index >= this.puzzles.length) return;
                
                this.currentPuzzleIndex = index;
                const puzzle = this.puzzles[index];
                
                // 复制棋盘状态
                this.board = puzzle.board.map(row => [...row]);
                this.moveHistory = [];
                this.currentPlayer = puzzle.firstMove || 1;
                this.startTime = Date.now();
                
                // 更新UI
                document.getElementById('puzzleTitle').textContent = puzzle.name;
                document.getElementById('puzzleDescription').textContent = puzzle.description;
                document.getElementById('puzzleGoal').textContent = puzzle.goal;
                document.getElementById('puzzleDifficulty').textContent = '★'.repeat(puzzle.difficulty) + '☆'.repeat(5 - puzzle.difficulty);
                
                const typeElement = document.getElementById('puzzleType');
                const typeNames = { life: '做活题', death: '杀棋题', tesuji: '手筋题' };
                typeElement.textContent = typeNames[puzzle.type] || '综合题';
                typeElement.className = `puzzle-type type-${puzzle.type}`;
                
                this.renderBoard();
                this.updateDisplay();
                this.updateMoveSequence();
            }

            renderBoard() {
                const cells = document.querySelectorAll('.go-cell');
                
                cells.forEach(cell => {
                    const row = parseInt(cell.dataset.row);
                    const col = parseInt(cell.dataset.col);
                    const stone = this.board[row][col];
                    
                    // 清除现有棋子和标记
                    cell.innerHTML = '';
                    cell.classList.remove('last-move');
                    
                    if (stone !== 0) {
                        const stoneElement = document.createElement('div');
                        stoneElement.className = `go-stone ${stone === 1 ? 'black' : 'white'}`;
                        
                        // 显示手数
                        const moveIndex = this.moveHistory.findIndex(move => move.row === row && move.col === col);
                        if (moveIndex >= 0) {
                            stoneElement.textContent = moveIndex + 1;
                        }
                        
                        cell.appendChild(stoneElement);
                    }
                    
                    // 标记最后一手
                    if (this.moveHistory.length > 0) {
                        const lastMove = this.moveHistory[this.moveHistory.length - 1];
                        if (lastMove.row === row && lastMove.col === col) {
                            cell.classList.add('last-move');
                        }
                    }
                });
            }

            handleCellClick(row, col) {
                // 检查是否可以落子
                if (this.board[row][col] !== 0) return;
                
                // 落子
                this.makeMove(row, col);
            }

            makeMove(row, col) {
                // 记录移动
                const move = {
                    row: row,
                    col: col,
                    player: this.currentPlayer,
                    captured: []
                };
                
                // 落子
                this.board[row][col] = this.currentPlayer;
                
                // 检查提子
                const captured = this.checkCaptures(row, col);
                move.captured = captured;
                
                // 移除被提的子
                captured.forEach(pos => {
                    this.board[pos.row][pos.col] = 0;
                });
                
                this.moveHistory.push(move);
                
                // 切换玩家
                this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
                
                this.renderBoard();
                this.updateDisplay();
                this.updateMoveSequence();
                
                // 检查是否解决问题
                this.checkPuzzleSolved();
            }

            checkCaptures(row, col) {
                const player = this.board[row][col];
                const opponent = player === 1 ? 2 : 1;
                const captured = [];
                
                // 检查四个方向的敌子
                const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
                
                directions.forEach(([dr, dc]) => {
                    const newRow = row + dr;
                    const newCol = col + dc;
                    
                    if (this.isValidPosition(newRow, newCol) && this.board[newRow][newCol] === opponent) {
                        const group = this.getGroup(newRow, newCol);
                        if (this.countLiberties(group) === 0) {
                            captured.push(...group);
                        }
                    }
                });
                
                return captured;
            }

            getGroup(row, col) {
                const player = this.board[row][col];
                const group = [];
                const visited = new Set();
                const stack = [{row, col}];
                
                while (stack.length > 0) {
                    const {row: r, col: c} = stack.pop();
                    const key = `${r},${c}`;
                    
                    if (visited.has(key)) continue;
                    visited.add(key);
                    
                    if (this.board[r][c] === player) {
                        group.push({row: r, col: c});
                        
                        // 检查四个方向
                        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
                        directions.forEach(([dr, dc]) => {
                            const newRow = r + dr;
                            const newCol = c + dc;
                            if (this.isValidPosition(newRow, newCol)) {
                                stack.push({row: newRow, col: newCol});
                            }
                        });
                    }
                }
                
                return group;
            }

            countLiberties(group) {
                const liberties = new Set();
                
                group.forEach(({row, col}) => {
                    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
                    directions.forEach(([dr, dc]) => {
                        const newRow = row + dr;
                        const newCol = col + dc;
                        if (this.isValidPosition(newRow, newCol) && this.board[newRow][newCol] === 0) {
                            liberties.add(`${newRow},${newCol}`);
                        }
                    });
                });
                
                return liberties.size;
            }

            isValidPosition(row, col) {
                return row >= 0 && row < 11 && col >= 0 && col < 11;
            }

            checkPuzzleSolved() {
                const puzzle = this.puzzles[this.currentPuzzleIndex];
                
                // 简化的解决检查
                if (puzzle.solution && puzzle.solution.length > 0) {
                    const solution = puzzle.solution[0];
                    const lastMove = this.moveHistory[this.moveHistory.length - 1];
                    
                    if (lastMove && lastMove.row === solution.row && lastMove.col === solution.col) {
                        this.solvePuzzle();
                    }
                } else {
                    // 对于没有预设解答的题目，检查特定条件
                    if (this.moveHistory.length >= 3) {
                        // 简单判断：如果下了3手以上，就算解决
                        this.solvePuzzle();
                    }
                }
            }

            solvePuzzle() {
                this.solvedPuzzles.add(this.currentPuzzleIndex);
                localStorage.setItem('solvedGoPuzzles', JSON.stringify([...this.solvedPuzzles]));
                
                const solveTime = Math.floor((Date.now() - this.startTime) / 1000);
                const minutes = Math.floor(solveTime / 60);
                const seconds = solveTime % 60;
                const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                
                document.getElementById('finalTime').textContent = timeString;
                document.getElementById('finalMoves').textContent = this.moveHistory.length;
                document.getElementById('successText').textContent = `你成功解决了"${this.puzzles[this.currentPuzzleIndex].name}"！`;
                document.getElementById('successModal').style.display = 'flex';
                
                this.updateDisplay();
                this.updatePuzzleList();
            }

            undoMove() {
                if (this.moveHistory.length === 0) return;
                
                const lastMove = this.moveHistory.pop();
                
                // 恢复棋盘状态
                this.board[lastMove.row][lastMove.col] = 0;
                
                // 恢复被提的子
                lastMove.captured.forEach(pos => {
                    const opponent = lastMove.player === 1 ? 2 : 1;
                    this.board[pos.row][pos.col] = opponent;
                });
                
                // 切换玩家
                this.currentPlayer = lastMove.player;
                
                this.renderBoard();
                this.updateDisplay();
                this.updateMoveSequence();
            }

            resetPuzzle() {
                this.loadPuzzle(this.currentPuzzleIndex);
            }

            nextPuzzle() {
                if (this.currentPuzzleIndex < this.puzzles.length - 1) {
                    this.loadPuzzle(this.currentPuzzleIndex + 1);
                }
            }

            previousPuzzle() {
                if (this.currentPuzzleIndex > 0) {
                    this.loadPuzzle(this.currentPuzzleIndex - 1);
                }
            }

            randomPuzzle() {
                const randomIndex = Math.floor(Math.random() * this.puzzles.length);
                this.loadPuzzle(randomIndex);
            }

            showHint() {
                const puzzle = this.puzzles[this.currentPuzzleIndex];
                if (puzzle.solution && puzzle.solution.length > 0) {
                    const hint = puzzle.solution[0];
                    const coord = this.positionToCoordinate(hint.row, hint.col);
                    alert(`提示：考虑在 ${coord} 位置落子`);
                } else {
                    alert('这道题目暂无提示，请仔细分析棋形！');
                }
            }

            checkSolution() {
                // 简化的答案检查
                if (this.moveHistory.length === 0) {
                    alert('请先下棋！');
                    return;
                }
                
                const puzzle = this.puzzles[this.currentPuzzleIndex];
                if (puzzle.solution && puzzle.solution.length > 0) {
                    const solution = puzzle.solution[0];
                    const hasCorrectMove = this.moveHistory.some(move => 
                        move.row === solution.row && move.col === solution.col
                    );
                    
                    if (hasCorrectMove) {
                        alert('恭喜！你找到了正确答案！');
                        this.solvePuzzle();
                    } else {
                        alert('还没找到最佳解答，继续思考！');
                    }
                } else {
                    alert('这道题目的答案有多种可能，继续探索！');
                }
            }

            analyzePosition() {
                // 简化的形势分析
                let blackTerritory = 0;
                let whiteTerritory = 0;
                let blackStones = 0;
                let whiteStones = 0;
                
                for (let row = 0; row < 11; row++) {
                    for (let col = 0; col < 11; col++) {
                        if (this.board[row][col] === 1) {
                            blackStones++;
                        } else if (this.board[row][col] === 2) {
                            whiteStones++;
                        }
                    }
                }
                
                alert(`棋局分析：
                
黑棋：${blackStones} 子
白棋：${whiteStones} 子
手数：${this.moveHistory.length}

当前轮到：${this.currentPlayer === 1 ? '黑棋' : '白棋'}
                
提示：分析各块棋的死活状态，寻找关键点。`);
            }

            generateRandomPuzzle() {
                // 生成随机题目布局
                const board = Array(11).fill(null).map(() => Array(11).fill(0));
                
                // 随机放置一些棋子形成死活问题
                const patterns = [
                    // 基础死活模式
                    [[1,1,1], [1,0,1], [1,1,1]],
                    // 角部死活
                    [[2,2,0], [1,2,0], [1,1,0]],
                    // 边部死活
                    [[0,2,2,2,0], [1,1,1,1,1], [0,1,0,1,0]]
                ];
                
                const pattern = patterns[Math.floor(Math.random() * patterns.length)];
                const startRow = Math.floor(Math.random() * (11 - pattern.length));
                const startCol = Math.floor(Math.random() * (11 - pattern[0].length));
                
                for (let i = 0; i < pattern.length; i++) {
                    for (let j = 0; j < pattern[i].length; j++) {
                        if (pattern[i][j] !== 0) {
                            board[startRow + i][startCol + j] = pattern[i][j];
                        }
                    }
                }
                
                return board;
            }

            positionToCoordinate(row, col) {
                const letters = 'ABCDEFGHJKLMNOPQRS';
                return `${letters[col]}${11 - row}`;
            }

            updateDisplay() {
                document.getElementById('currentPuzzle').textContent = this.currentPuzzleIndex + 1;
                document.getElementById('moveCount').textContent = this.moveHistory.length;
                document.getElementById('solvedCount').textContent = `${this.solvedPuzzles.size}/${this.puzzles.length}`;
                document.getElementById('undoBtn').disabled = this.moveHistory.length === 0;
            }

            updateMoveSequence() {
                const container = document.getElementById('moveSequence');
                container.innerHTML = '';
                
                this.moveHistory.forEach((move, index) => {
                    const entry = document.createElement('div');
                    entry.className = `move-entry ${move.player === 1 ? 'black' : 'white'}`;
                    const coord = this.positionToCoordinate(move.row, move.col);
                    const player = move.player === 1 ? '●' : '○';
                    entry.textContent = `${index + 1}. ${player} ${coord}`;
                    container.appendChild(entry);
                });
                
                container.scrollTop = container.scrollHeight;
            }

            updatePuzzleList() {
                const container = document.getElementById('puzzleList');
                container.innerHTML = '';
                
                this.puzzles.forEach((puzzle, index) => {
                    const item = document.createElement('div');
                    let className = 'puzzle-item';
                    if (index === this.currentPuzzleIndex) className += ' current';
                    if (this.solvedPuzzles.has(index)) className += ' solved';
                    
                    item.className = className;
                    item.onclick = () => this.loadPuzzle(index);
                    
                    const solved = this.solvedPuzzles.has(index) ? ' ✓' : '';
                    const typeNames = { life: '活', death: '杀', tesuji: '筋' };
                    
                    item.innerHTML = `
                        <div style="font-weight: bold;">${index + 1}. ${puzzle.name}${solved}</div>
                        <div style="font-size: 0.8rem; color: #666;">${typeNames[puzzle.type]} ★${puzzle.difficulty}</div>
                    `;
                    
                    container.appendChild(item);
                });
            }

            startTimer() {
                setInterval(() => {
                    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
                    const minutes = Math.floor(elapsed / 60);
                    const seconds = elapsed % 60;
                    document.getElementById('solveTime').textContent = 
                        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                }, 1000);
            }

            closeSuccessModal() {
                document.getElementById('successModal').style.display = 'none';
                this.nextPuzzle();
            }

            showRules() {
                alert(`围棋死活题游戏规则：

目标：
• 根据题目要求完成做活、杀棋或手筋任务
• 通常黑先，找到最佳着点

基本规则：
• 点击棋盘空点落子
• 遵循围棋基本规则（气、提子等）
• 可以悔棋和重置

题目类型：
• 做活题：让己方棋子获得两眼做活
• 杀棋题：杀死对方棋子
• 手筋题：找出精妙的技巧着法

操作说明：
• 左键点击空点落子
• 使用悔棋可以撤销上一步
• 检查答案验证解法正确性
• 提示功能帮助思考

围棋知识：
• 气：棋子直接相邻的空点
• 眼：被己方棋子围住的空点
• 死活：棋子能否做成两眼存活

解题技巧：
• 仔细分析双方棋子的气数
• 寻找关键的做眼点或破眼点
• 考虑先手和后手的差别
• 注意对杀中的缓手和急手`);
            }
        }

        // 初始化游戏
        const goPuzzle = new GoPuzzleGame();