class ChessPuzzleGame {
    constructor() {
        this.currentPuzzleIndex = 0;
        this.board = [];
        this.selectedPiece = null;
        this.moveHistory = [];
        this.startTime = Date.now();
        this.gameTime = 0;
        this.completedPuzzles = new Set(JSON.parse(localStorage.getItem('completedChessPuzzles') || '[]'));

        this.puzzles = [
            {
                name: "楚河汉界",
                description: "红方先行，三步内将死黑方",
                difficulty: "easy",
                board: [
                    ['', '', '', '', '将', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '炮', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '炮', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '帅', '', '', '', '']
                ],
                solution: [
                    { from: [6, 4], to: [0, 4], piece: '炮' },
                    { from: [3, 4], to: [1, 4], piece: '炮' }
                ]
            },
            {
                name: "双炮将军",
                description: "红方双炮配合，四步内获胜",
                difficulty: "medium",
                board: [
                    ['', '', '', '', '将', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '炮', '', '', '', '炮', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '帅', '', '', '', '']
                ],
                solution: [
                    { from: [3, 2], to: [0, 2], piece: '炮' },
                    { from: [3, 6], to: [0, 6], piece: '炮' }
                ]
            },
            {
                name: "车马配合",
                description: "车马联手，五步内制胜",
                difficulty: "medium",
                board: [
                    ['', '', '', '', '将', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '马', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '车', '', '', '', ''],
                    ['', '', '', '', '帅', '', '', '', '']
                ],
                solution: [
                    { from: [8, 4], to: [0, 4], piece: '车' },
                    { from: [4, 6], to: [2, 5], piece: '马' }
                ]
            },
            {
                name: "马后炮杀法",
                description: "红方马炮配合，四步内制胜",
                difficulty: "medium",
                board: [
                    ['', '', '', '', '将', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '马', '', '', '', '', ''],
                    ['', '', '', '', '炮', '', '', '', ''],
                    ['', '', '', '', '帅', '', '', '', '']
                ],
                solution: [
                    { from: [7, 3], to: [5, 4], piece: '马' },
                    { from: [8, 4], to: [0, 4], piece: '炮' }
                ]
            },
            {
                name: "双车错位",
                description: "红方双车配合，五步制胜",
                difficulty: "hard",
                board: [
                    ['', '', '', '', '将', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['车', '', '', '', '', '', '', '', '车'],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '帅', '', '', '', '']
                ],
                solution: [
                    { from: [7, 0], to: [0, 0], piece: '车' },
                    { from: [7, 8], to: [0, 8], piece: '车' }
                ]
            },
            {
                name: "三子归边",
                description: "红方车马炮联合作战",
                difficulty: "easy",
                board: [
                    ['', '', '', '', '将', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['车', '', '', '马', '', '炮', '', '', ''],
                    ['', '', '', '', '帅', '', '', '', '']
                ],
                solution: [
                    { from: [8, 0], to: [0, 0], piece: '车' }
                ]
            }
        ];

        // 添加更多经典象棋残局案例
        this.puzzles.push(
            {
                name: "海底捞月",
                description: "红方巧用车马配合，模拟海底捞月之势",
                difficulty: "hard",
                board: [
                    ['', '', '', '', '将', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '马', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '帅', '', '', '车', '']
                ],
                solution: [
                    { from: [9, 7], to: [0, 7], piece: '车' },
                    { from: [7, 7], to: [5, 6], piece: '马' }
                ]
            },
            {
                name: "白脸将军",
                description: "利用将帅不见面规则的经典杀法",
                difficulty: "medium",
                board: [
                    ['', '', '', '', '将', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '帅', '', '', '', '']
                ],
                solution: [
                    { from: [9, 4], to: [0, 4], piece: '帅' }
                ]
            },
            {
                name: "铁门栓",
                description: "红方利用车的威力形成铁门栓杀法",
                difficulty: "hard",
                board: [
                    ['', '', '', '', '将', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['车', '', '', '', '', '', '', '', '车'],
                    ['', '', '', '', '帅', '', '', '', '']
                ],
                solution: [
                    { from: [8, 0], to: [1, 0], piece: '车' },
                    { from: [8, 8], to: [1, 8], piece: '车' }
                ]
            },
            {
                name: "困毙杀",
                description: "红方通过限制对方将军的活动空间获胜",
                difficulty: "medium",
                board: [
                    ['', '', '', '', '将', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '兵', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '帅', '', '', '', '']
                ],
                solution: [
                    { from: [7, 4], to: [6, 4], piece: '兵' }
                ]
            }
        );
    }

    init() {
        console.log('开始初始化游戏...');
        this.createBoard();
        console.log('棋盘创建完成');
        this.loadPuzzle(this.currentPuzzleIndex);
        console.log('加载谜题完成:', this.puzzles[this.currentPuzzleIndex].name);
        this.updateDisplay();
        this.updatePuzzleList();
        this.startTimer();
        console.log('游戏初始化完成');

        // 添加快捷键支持
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F12' || (e.ctrlKey && e.key === 'd')) {
                e.preventDefault();
                this.debugGame();
            }
        });

        // 添加窗口大小变化监听器，确保响应式布局正确
        window.addEventListener('resize', () => {
            setTimeout(() => {
                this.createBoard();
                this.renderBoard();
                // 确保棋子位置精确
                setTimeout(() => this.calibratePiecePositions(), 50);
            }, 100);
        });
    }

    createBoard() {
        console.log('创建棋盘交叉点...');
        const board = document.getElementById('chessBoard');
        if (!board) {
            console.error('找不到棋盘元素！');
            return;
        }

        // 清除现有内容
        board.innerHTML = '';

        // 创建棋盘内容容器
        const boardContent = document.createElement('div');
        boardContent.className = 'board-content';
        board.appendChild(boardContent);

        // 响应式参数配置 - 基于标准象棋棋盘尺寸
        const isMobile = window.innerWidth <= 768;
        const startX = isMobile ? 25 : 30;
        const startY = isMobile ? 25 : 30;
        const cellWidth = isMobile ? 35 : 60;
        const cellHeight = isMobile ? 35 : 60;
        
        // 动态设置容器尺寸
        const contentWidth = startX * 2 + 8 * cellWidth;
        const contentHeight = startY * 2 + 9 * cellHeight;
        boardContent.style.width = contentWidth + 'px';
        boardContent.style.height = contentHeight + 'px';

        // 创建10x9的交叉点网格（象棋标准）
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 9; col++) {
                const intersection = document.createElement('div');
                intersection.className = 'board-intersection';
                intersection.dataset.row = row;
                intersection.dataset.col = col;

                // 精确定位到交叉点 - 相对于board-content容器
                const x = startX + col * cellWidth;
                const y = startY + row * cellHeight;
                intersection.style.left = x + 'px';
                intersection.style.top = y + 'px';

                // 添加点击和拖拽事件
                intersection.addEventListener('click', (e) => this.handleIntersectionClick(e));
                intersection.addEventListener('dragover', (e) => this.handleDragOver(e));
                intersection.addEventListener('drop', (e) => this.handleDrop(e));

                boardContent.appendChild(intersection);
            }
        }
        console.log('交叉点创建完成: 90个交叉点');

        // 创建SVG棋盘线条
        this.createBoardLines(boardContent);
        
        // 创建楚河汉界标识
        this.createRiverText(boardContent);
    }

    createBoardLines(board) {
        // 响应式参数配置 - 与交叉点创建保持一致
        const isMobile = window.innerWidth <= 768;
        const startX = isMobile ? 25 : 30;
        const startY = isMobile ? 25 : 30;
        const cellWidth = isMobile ? 35 : 60;
        const cellHeight = isMobile ? 35 : 60;
        const boardWidth = startX * 2 + 8 * cellWidth;
        const boardHeight = startY * 2 + 9 * cellHeight;

        // 创建SVG元素
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'board-lines');
        svg.setAttribute('viewBox', `0 0 ${boardWidth} ${boardHeight}`);
        svg.setAttribute('width', boardWidth.toString());
        svg.setAttribute('height', boardHeight.toString());

        // 创建横线组
        const horizontalLines = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        horizontalLines.setAttribute('stroke', '#654321');
        horizontalLines.setAttribute('stroke-width', '2');
        horizontalLines.setAttribute('fill', 'none');

        // 10条横线
        for (let i = 0; i < 10; i++) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            const y = startY + i * cellHeight;
            line.setAttribute('x1', startX.toString());
            line.setAttribute('y1', y.toString());
            line.setAttribute('x2', (startX + 8 * cellWidth).toString());
            line.setAttribute('y2', y.toString());
            if (i === 0 || i === 9) {
                line.setAttribute('stroke-width', '3'); // 边界线加粗
            }
            horizontalLines.appendChild(line);
        }

        // 创建竖线组
        const verticalLines = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        verticalLines.setAttribute('stroke', '#654321');
        verticalLines.setAttribute('stroke-width', '2');
        verticalLines.setAttribute('fill', 'none');

        // 9条竖线，河界分段
        for (let i = 0; i < 9; i++) {
            const x = startX + i * cellWidth;
            
            if (i === 0 || i === 8) {
                // 边界竖线完整贯通
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', x.toString());
                line.setAttribute('y1', startY.toString());
                line.setAttribute('x2', x.toString());
                line.setAttribute('y2', (startY + 9 * cellHeight).toString());
                line.setAttribute('stroke-width', '3');
                verticalLines.appendChild(line);
            } else {
                // 中间竖线分段（河界分开）
                // 上半部分（黑方区域）
                const upperLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                upperLine.setAttribute('x1', x.toString());
                upperLine.setAttribute('y1', startY.toString());
                upperLine.setAttribute('x2', x.toString());
                upperLine.setAttribute('y2', (startY + 4 * cellHeight).toString());
                verticalLines.appendChild(upperLine);

                // 下半部分（红方区域）
                const lowerLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                lowerLine.setAttribute('x1', x.toString());
                lowerLine.setAttribute('y1', (startY + 5 * cellHeight).toString());
                lowerLine.setAttribute('x2', x.toString());
                lowerLine.setAttribute('y2', (startY + 9 * cellHeight).toString());
                verticalLines.appendChild(lowerLine);
            }
        }

        // 创建士线（九宫格对角线）
        const palaceLines = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        palaceLines.setAttribute('id', 'palaceLines');

        // 黑方九宫格士线
        const blackLine1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        blackLine1.setAttribute('x1', (startX + 3 * cellWidth).toString());
        blackLine1.setAttribute('y1', startY.toString());
        blackLine1.setAttribute('x2', (startX + 5 * cellWidth).toString());
        blackLine1.setAttribute('y2', (startY + 2 * cellHeight).toString());
        blackLine1.setAttribute('class', 'palace-line');

        const blackLine2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        blackLine2.setAttribute('x1', (startX + 5 * cellWidth).toString());
        blackLine2.setAttribute('y1', startY.toString());
        blackLine2.setAttribute('x2', (startX + 3 * cellWidth).toString());
        blackLine2.setAttribute('y2', (startY + 2 * cellHeight).toString());
        blackLine2.setAttribute('class', 'palace-line');

        // 红方九宫格士线
        const redLine1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        redLine1.setAttribute('x1', (startX + 3 * cellWidth).toString());
        redLine1.setAttribute('y1', (startY + 7 * cellHeight).toString());
        redLine1.setAttribute('x2', (startX + 5 * cellWidth).toString());
        redLine1.setAttribute('y2', (startY + 9 * cellHeight).toString());
        redLine1.setAttribute('class', 'palace-line');

        const redLine2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        redLine2.setAttribute('x1', (startX + 5 * cellWidth).toString());
        redLine2.setAttribute('y1', (startY + 7 * cellHeight).toString());
        redLine2.setAttribute('x2', (startX + 3 * cellWidth).toString());
        redLine2.setAttribute('y2', (startY + 9 * cellHeight).toString());
        redLine2.setAttribute('class', 'palace-line');

        palaceLines.appendChild(blackLine1);
        palaceLines.appendChild(blackLine2);
        palaceLines.appendChild(redLine1);
        palaceLines.appendChild(redLine2);

        // 添加河界中心虚线
        const riverLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        riverLine.setAttribute('x1', '0');
        riverLine.setAttribute('y1', '270'); // 4.5*60
        riverLine.setAttribute('x2', '480'); // 8*60
        riverLine.setAttribute('y2', '270');
        riverLine.setAttribute('stroke', '#8B4513');
        riverLine.setAttribute('stroke-width', '1');
        riverLine.setAttribute('stroke-dasharray', '5,5');
        riverLine.setAttribute('opacity', '0.6');

        // 组装SVG
        svg.appendChild(horizontalLines);
        svg.appendChild(verticalLines);
        svg.appendChild(riverLine);
        svg.appendChild(palaceLines);

        board.appendChild(svg);
        console.log('SVG棋盘线条创建完成');
    }

    createRiverText(board) {
        // 响应式参数配置
        const isMobile = window.innerWidth <= 768;
        const startY = isMobile ? 25 : 30;
        const cellHeight = isMobile ? 35 : 60;
        
        // 创建楚河汉界文字
        const riverText = document.createElement('div');
        riverText.className = 'river-text';
        riverText.textContent = isMobile ? '楚河 —— 汉界' : '楚河 ————————— 汉界';
        
        // 精确定位到河界中央
        const riverY = startY + 4.5 * cellHeight;
        riverText.style.top = riverY + 'px';
        
        board.appendChild(riverText);
        
        console.log('楚河汉界标识创建完成');
    }

    createElephantLines(board) {
        // 红方象线
        for (let i = 1; i <= 8; i++) {
            const elephantLine = document.createElement('div');
            elephantLine.className = `elephant-line red-elephant-line-${i}`;
            board.appendChild(elephantLine);
        }

        // 黑方象线
        for (let i = 1; i <= 8; i++) {
            const elephantLine = document.createElement('div');
            elephantLine.className = `elephant-line black-elephant-line-${i}`;
            board.appendChild(elephantLine);
        }

        console.log('象线创建完成: 16条对角线');
    }
    loadPuzzle(index) {
        if (index < 0 || index >= this.puzzles.length) return;

        this.currentPuzzleIndex = index;
        const puzzle = this.puzzles[index];

        // 复制棋盘状态
        this.board = puzzle.board.map(row => [...row]);
        this.selectedPiece = null;
        this.moveHistory = [];
        this.startTime = Date.now();

        // 更新UI
        document.getElementById('puzzleTitle').textContent = puzzle.name;
        document.getElementById('puzzleDescription').textContent = puzzle.description;

        const difficultyElement = document.getElementById('puzzleDifficulty');
        difficultyElement.textContent = this.getDifficultyText(puzzle.difficulty);
        difficultyElement.className = `puzzle-difficulty difficulty-${puzzle.difficulty}`;

        this.renderBoard();
        this.updateDisplay();
        this.updateMoveHistory();
        this.updatePuzzleList(); // 确保题目列表状态正确更新
    }

    renderBoard() {
        console.log('开始渲染棋盘...');
        // 清除现有棋子
        document.querySelectorAll('.chess-piece').forEach(piece => piece.remove());

        const board = document.getElementById('chessBoard');
        if (!board) {
            console.error('找不到棋盘元素！');
            return;
        }

        // 响应式参数配置 - 与createBoard保持完全一致
        const isMobile = window.innerWidth <= 768;
        const startX = isMobile ? 25 : 30;
        const startY = isMobile ? 25 : 30;
        const cellWidth = isMobile ? 35 : 60;
        const cellHeight = isMobile ? 35 : 60;

        let pieceCount = 0;

        // 遍历棋盘数组，渲染棋子
        for (let row = 0; row < this.board.length; row++) {
            for (let col = 0; col < this.board[row].length; col++) {
                const piece = this.board[row][col];
                if (piece) {
                    const pieceElement = document.createElement('div');
                    pieceElement.className = 'chess-piece';
                    pieceElement.textContent = piece;
                    pieceElement.dataset.row = row;
                    pieceElement.dataset.col = col;
                    pieceElement.dataset.piece = piece;

                    // 判断棋子颜色
                    const redPieces = ['帅', '车', '马', '炮', '兵', '相', '仕'];
                    const isRed = redPieces.includes(piece);
                    pieceElement.classList.add(isRed ? 'red' : 'black');

                    // 只有红方棋子可以拖拽
                    if (isRed) {
                        pieceElement.draggable = true;
                        pieceElement.addEventListener('dragstart', (e) => this.handleDragStart(e));
                        pieceElement.addEventListener('dragend', (e) => this.handleDragEnd(e));
                    }

                    // 精确定位到交叉点中心 - 完美对齐系统
                    const x = startX + col * cellWidth;
                    const y = startY + row * cellHeight;
                    
                    // 使用transform实现精确居中，确保棋子中心与交叉点完美对齐
                    pieceElement.style.left = x + 'px';
                    pieceElement.style.top = y + 'px';
                    pieceElement.style.transform = 'translate(-50%, -50%)';
                    
                    // 添加数据属性用于调试
                    pieceElement.dataset.expectedX = x;
                    pieceElement.dataset.expectedY = y;

                    // 添加点击事件
                    pieceElement.addEventListener('click', (e) => this.handlePieceClick(e));

                    // 将棋子添加到与交叉点相同的容器中，确保定位一致
                    const boardContent = board.querySelector('.board-content') || board;
                    boardContent.appendChild(pieceElement);
                    pieceCount++;
                }
            }
        }
        console.log(`棋子渲染完成: ${pieceCount}个棋子`);
        
        // 渲染完成后进行精确校准
        setTimeout(() => this.calibratePiecePositions(), 10);
    }

    handlePieceClick(event) {
        const piece = event.target;
        const row = parseInt(piece.dataset.row);
        const col = parseInt(piece.dataset.col);

        // 只能选择红方棋子
        if (!piece.classList.contains('red')) return;

        // 清除之前的选择
        document.querySelectorAll('.chess-piece.selected').forEach(p => p.classList.remove('selected'));
        document.querySelectorAll('.board-intersection.possible-move').forEach(i => i.classList.remove('possible-move'));

        // 选择当前棋子
        piece.classList.add('selected');
        this.selectedPiece = { row, col, piece: piece.dataset.piece, element: piece };

        // 显示可能的移动位置
        this.showPossibleMoves(row, col, piece.dataset.piece);
    }

    handleIntersectionClick(event) {
        if (!this.selectedPiece) return;

        const intersection = event.target;
        const toRow = parseInt(intersection.dataset.row);
        const toCol = parseInt(intersection.dataset.col);

        this.movePiece(this.selectedPiece.row, this.selectedPiece.col, toRow, toCol);
    }

    handleDragStart(event) {
        const piece = event.target;
        piece.classList.add('dragging');

        const row = parseInt(piece.dataset.row);
        const col = parseInt(piece.dataset.col);

        this.selectedPiece = { row, col, piece: piece.dataset.piece, element: piece };
        this.showPossibleMoves(row, col, piece.dataset.piece);
    }

    handleDragEnd(event) {
        event.target.classList.remove('dragging');
        document.querySelectorAll('.board-intersection.drag-over').forEach(i => i.classList.remove('drag-over'));
    }

    handleDragOver(event) {
        event.preventDefault();
        const intersection = event.target;
        if (intersection.classList.contains('possible-move')) {
            intersection.classList.add('drag-over');
        }
    }

    handleDrop(event) {
        event.preventDefault();
        const intersection = event.target;
        intersection.classList.remove('drag-over');

        if (!this.selectedPiece || !intersection.classList.contains('possible-move')) return;

        const toRow = parseInt(intersection.dataset.row);
        const toCol = parseInt(intersection.dataset.col);

        this.movePiece(this.selectedPiece.row, this.selectedPiece.col, toRow, toCol);
    }

    showPossibleMoves(row, col, piece) {
        // 清除之前的可能移动标记
        document.querySelectorAll('.board-intersection.possible-move').forEach(i => i.classList.remove('possible-move'));

        const moves = this.getPossibleMoves(row, col, piece);
        moves.forEach(([moveRow, moveCol]) => {
            const intersection = document.querySelector(`[data-row="${moveRow}"][data-col="${moveCol}"]`);
            if (intersection) {
                intersection.classList.add('possible-move');
            }
        });
    }

    getPossibleMoves(row, col, piece) {
        const moves = [];

        switch (piece) {
            case '帅':
                // 帅只能在九宫格内移动，一次一格
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        if (Math.abs(dr) + Math.abs(dc) === 1) { // 只能直线移动
                            const newRow = row + dr;
                            const newCol = col + dc;
                            if (newRow >= 7 && newRow <= 9 && newCol >= 3 && newCol <= 5) {
                                if (!this.board[newRow][newCol] || !this.isRedPiece(this.board[newRow][newCol])) {
                                    moves.push([newRow, newCol]);
                                }
                            }
                        }
                    }
                }
                break;

            case '车':
                // 车可以直线移动任意距离
                const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
                for (let [dr, dc] of directions) {
                    for (let i = 1; i < 10; i++) {
                        const newRow = row + dr * i;
                        const newCol = col + dc * i;
                        if (newRow < 0 || newRow >= 10 || newCol < 0 || newCol >= 9) break;

                        if (this.board[newRow][newCol]) {
                            if (!this.isRedPiece(this.board[newRow][newCol])) {
                                moves.push([newRow, newCol]);
                            }
                            break;
                        } else {
                            moves.push([newRow, newCol]);
                        }
                    }
                }
                break;

            case '炮':
                // 炮的移动规则：直线移动，吃子时需要跳过一个棋子
                const cannonDirections = [[-1, 0], [1, 0], [0, -1], [0, 1]];
                for (let [dr, dc] of cannonDirections) {
                    let hasJumped = false;
                    for (let i = 1; i < 10; i++) {
                        const newRow = row + dr * i;
                        const newCol = col + dc * i;
                        if (newRow < 0 || newRow >= 10 || newCol < 0 || newCol >= 9) break;

                        if (this.board[newRow][newCol]) {
                            if (!hasJumped) {
                                hasJumped = true; // 遇到第一个棋子，作为炮架
                            } else {
                                // 遇到第二个棋子，如果是敌方棋子可以吃掉
                                if (!this.isRedPiece(this.board[newRow][newCol])) {
                                    moves.push([newRow, newCol]);
                                }
                                break;
                            }
                        } else if (!hasJumped) {
                            // 没有跳过棋子时可以移动到空位
                            moves.push([newRow, newCol]);
                        }
                    }
                }
                break;

            case '马':
                // 马的移动：日字形，需要检查蹩马腿
                const horseMovesWithBlocking = [
                    [[-2, -1], [-1, 0]], [[-2, 1], [-1, 0]],
                    [[2, -1], [1, 0]], [[2, 1], [1, 0]],
                    [[-1, -2], [0, -1]], [[1, -2], [0, -1]],
                    [[-1, 2], [0, 1]], [[1, 2], [0, 1]]
                ];

                for (let [[dr, dc], [blockDr, blockDc]] of horseMovesWithBlocking) {
                    const newRow = row + dr;
                    const newCol = col + dc;
                    const blockRow = row + blockDr;
                    const blockCol = col + blockDc;

                    if (newRow >= 0 && newRow < 10 && newCol >= 0 && newCol < 9) {
                        // 检查是否被蹩马腿
                        if (!this.board[blockRow][blockCol]) {
                            if (!this.board[newRow][newCol] || !this.isRedPiece(this.board[newRow][newCol])) {
                                moves.push([newRow, newCol]);
                            }
                        }
                    }
                }
                break;

            case '兵':
                // 兵的移动：过河前只能向前，过河后可以左右移动
                if (row >= 5) { // 过河了
                    const pawnMoves = [[-1, 0], [0, -1], [0, 1]];
                    for (let [dr, dc] of pawnMoves) {
                        const newRow = row + dr;
                        const newCol = col + dc;
                        if (newRow >= 0 && newRow < 10 && newCol >= 0 && newCol < 9) {
                            if (!this.board[newRow][newCol] || !this.isRedPiece(this.board[newRow][newCol])) {
                                moves.push([newRow, newCol]);
                            }
                        }
                    }
                } else { // 没过河，只能向前
                    const newRow = row - 1;
                    if (newRow >= 0) {
                        if (!this.board[newRow][col] || !this.isRedPiece(this.board[newRow][col])) {
                            moves.push([newRow, col]);
                        }
                    }
                }
                break;
        }

        return moves;
    }

    isRedPiece(piece) {
        const redPieces = ['帅', '车', '马', '炮', '兵', '相', '仕'];
        return redPieces.includes(piece);
    }

    movePiece(fromRow, fromCol, toRow, toCol) {
        // 检查移动是否合法
        const piece = this.board[fromRow][fromCol];
        const possibleMoves = this.getPossibleMoves(fromRow, fromCol, piece);
        const isValidMove = possibleMoves.some(([r, c]) => r === toRow && c === toCol);

        if (!isValidMove) return;

        // 记录移动
        const capturedPiece = this.board[toRow][toCol];
        this.moveHistory.push({
            from: [fromRow, fromCol],
            to: [toRow, toCol],
            piece: piece,
            captured: capturedPiece,
            timestamp: Date.now()
        });

        // 执行移动
        this.board[toRow][toCol] = piece;
        this.board[fromRow][fromCol] = '';

        // 清除选择状态
        this.selectedPiece = null;
        document.querySelectorAll('.chess-piece.selected').forEach(p => p.classList.remove('selected'));
        document.querySelectorAll('.board-intersection.possible-move').forEach(i => i.classList.remove('possible-move'));

        // 重新渲染棋盘
        this.renderBoard();
        this.updateDisplay();
        this.updateMoveHistory();

        // 检查胜利条件
        this.checkVictory();
    }

    checkVictory() {
        // 简化的胜利条件检查
        const hasBlackKing = this.board.some(row => row.includes('将'));
        if (!hasBlackKing) {
            this.completedPuzzles.add(this.currentPuzzleIndex);
            localStorage.setItem('completedChessPuzzles', JSON.stringify([...this.completedPuzzles]));

            document.getElementById('solveTime').textContent =
                `${Math.floor(this.gameTime / 60).toString().padStart(2, '0')}:${(this.gameTime % 60).toString().padStart(2, '0')}`;
            document.getElementById('solveSteps').textContent = this.moveHistory.length;
            document.getElementById('successModal').style.display = 'flex';

            this.updateDisplay();
            this.updatePuzzleList();
        }
    }

    resetPuzzle() {
        this.loadPuzzle(this.currentPuzzleIndex);
    }

    undoMove() {
        if (this.moveHistory.length === 0) return;

        const lastMove = this.moveHistory.pop();

        // 恢复棋子位置
        this.board[lastMove.from[0]][lastMove.from[1]] = lastMove.piece;
        this.board[lastMove.to[0]][lastMove.to[1]] = lastMove.captured || '';

        // 清除选择状态
        this.selectedPiece = null;
        document.querySelectorAll('.chess-piece.selected').forEach(p => p.classList.remove('selected'));
        document.querySelectorAll('.board-intersection.possible-move').forEach(i => i.classList.remove('possible-move'));

        // 重新渲染
        this.renderBoard();
        this.updateDisplay();
        this.updateMoveHistory();
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
        const hintMessages = {
            "楚河汉界": "观察炮的位置，考虑如何利用炮的特性",
            "双炮将军": "两门炮可以形成交叉火力",
            "车马配合": "车和马的配合可以形成强大的攻击",
            "马后炮杀法": "马在前开路，炮在后支援",
            "双车错位": "两辆车从不同角度进攻",
            "三子归边": "多子配合，形成合围之势",
            "海底捞月": "车马配合的经典战术",
            "白脸将军": "利用将帅不能见面的规则",
            "铁门栓": "双车封锁，形成铁门栓",
            "困毙杀": "限制对方活动空间"
        };

        const hint = hintMessages[puzzle.name] || "仔细观察棋局，寻找制胜之道";
        alert(`💡 提示：${hint}`);
    }

    showSolution() {
        const puzzle = this.puzzles[this.currentPuzzleIndex];
        if (puzzle.solution && puzzle.solution.length > 0) {
            let solutionText = `📋 ${puzzle.name} 解答步骤：\n\n`;
            puzzle.solution.forEach((step, index) => {
                const fromPos = `${String.fromCharCode(97 + step.from[1])}${10 - step.from[0]}`;
                const toPos = `${String.fromCharCode(97 + step.to[1])}${10 - step.to[0]}`;
                solutionText += `${index + 1}. ${step.piece} ${fromPos} → ${toPos}\n`;
            });
            alert(solutionText);
        } else {
            alert("暂无解答步骤");
        }
    }

    showRules() {
        const rules = `
🎯 象棋残局游戏规则：

1. 🔴 红方先行，目标是将死黑方
2. 🎮 点击红方棋子选择，再点击目标位置移动
3. 🖱️ 支持拖拽操作，将棋子拖到目标位置
4. ⏰ 每个残局都有推荐的步数限制
5. 💡 可以使用提示功能获得解题思路
6. 🔄 支持悔棋功能，可以撤销上一步操作
7. 📋 可以查看标准解答步骤
8. 🏆 完成残局后会记录解题时间和步数

🎲 棋子移动规则：
• 帅：九宫格内一步一格
• 车：直线任意距离
• 马：日字形，不能蹩马腿  
• 炮：直线移动，吃子需跳过一子
• 兵：过河前只能前进，过河后可左右移动

祝您游戏愉快！🎉
        `;
        alert(rules);
    }

    debugGame() {
        console.log('=== 象棋残局调试信息 ===');
        console.log('当前题目索引:', this.currentPuzzleIndex);
        console.log('当前题目:', this.puzzles[this.currentPuzzleIndex].name);
        console.log('棋盘状态:', this.board);
        console.log('移动历史:', this.moveHistory);
        console.log('已完成题目:', [...this.completedPuzzles]);
        console.log('选中棋子:', this.selectedPiece);
        console.log('游戏时间:', this.gameTime);
        
        // 检查棋子与交叉点的对齐情况
        console.log('=== 棋子对齐检查 ===');
        document.querySelectorAll('.chess-piece').forEach(piece => {
            const row = parseInt(piece.dataset.row);
            const col = parseInt(piece.dataset.col);
            const pieceRect = piece.getBoundingClientRect();
            const pieceCenterX = pieceRect.left + pieceRect.width / 2;
            const pieceCenterY = pieceRect.top + pieceRect.height / 2;
            
            // 找到对应的交叉点
            const intersection = document.querySelector(`[data-row="${row}"][data-col="${col}"].board-intersection`);
            if (intersection) {
                const intersectionRect = intersection.getBoundingClientRect();
                const intersectionCenterX = intersectionRect.left + intersectionRect.width / 2;
                const intersectionCenterY = intersectionRect.top + intersectionRect.height / 2;
                
                const offsetX = Math.abs(pieceCenterX - intersectionCenterX);
                const offsetY = Math.abs(pieceCenterY - intersectionCenterY);
                
                console.log(`棋子 ${piece.textContent} (${row},${col}): 偏移 X=${offsetX.toFixed(1)}px, Y=${offsetY.toFixed(1)}px`);
                
                if (offsetX > 2 || offsetY > 2) {
                    console.warn(`⚠️ 棋子 ${piece.textContent} 对齐偏差较大!`);
                } else {
                    console.log(`✅ 棋子 ${piece.textContent} 对齐良好`);
                }
            }
        });
        
        // 显示响应式参数
        const isMobile = window.innerWidth <= 768;
        console.log('=== 响应式参数 ===');
        console.log('移动端模式:', isMobile);
        console.log('起始坐标:', isMobile ? '25, 25' : '30, 30');
        console.log('网格尺寸:', isMobile ? '35x35' : '60x60');
        console.log('棋子尺寸:', isMobile ? '32x32' : '48x48');
        console.log('==================');
        
        // 切换交叉点可视化
        this.toggleIntersectionDebug();
        
        // 执行棋子位置校准
        this.calibratePiecePositions();
    }
    
    toggleIntersectionDebug() {
        const intersections = document.querySelectorAll('.board-intersection');
        const isDebugMode = intersections[0]?.classList.contains('debug-visible');
        
        intersections.forEach(intersection => {
            if (isDebugMode) {
                intersection.classList.remove('debug-visible');
            } else {
                intersection.classList.add('debug-visible');
            }
        });
        
        console.log(isDebugMode ? '关闭交叉点调试显示' : '开启交叉点调试显示');
    }
    
    // 精确校准棋子位置
    calibratePiecePositions() {
        console.log('=== 开始棋子位置校准 ===');
        
        const isMobile = window.innerWidth <= 768;
        const startX = isMobile ? 25 : 30;
        const startY = isMobile ? 25 : 30;
        const cellWidth = isMobile ? 35 : 60;
        const cellHeight = isMobile ? 35 : 60;
        
        document.querySelectorAll('.chess-piece').forEach(piece => {
            const row = parseInt(piece.dataset.row);
            const col = parseInt(piece.dataset.col);
            
            // 重新计算精确位置
            const x = startX + col * cellWidth;
            const y = startY + row * cellHeight;
            
            // 应用精确定位
            piece.style.left = x + 'px';
            piece.style.top = y + 'px';
            piece.style.transform = 'translate(-50%, -50%)';
            
            console.log(`校准棋子 ${piece.textContent} (${row},${col}) 到位置 (${x}, ${y})`);
        });
        
        console.log('=== 棋子位置校准完成 ===');
    }

    updateDisplay() {
        document.getElementById('currentPuzzle').textContent = this.currentPuzzleIndex + 1;
        document.getElementById('moveCount').textContent = this.moveHistory.length;
        document.getElementById('completedCount').textContent = `${this.completedPuzzles.size}/${this.puzzles.length}`;

        // 更新悔棋按钮状态
        const undoBtn = document.getElementById('undoBtn');
        if (undoBtn) {
            undoBtn.disabled = this.moveHistory.length === 0;
        }
    }

    updateMoveHistory() {
        const container = document.getElementById('moveHistory');
        container.innerHTML = '';

        this.moveHistory.forEach((move, index) => {
            const entry = document.createElement('div');
            entry.className = 'move-entry';

            const fromPos = `${String.fromCharCode(97 + move.from[1])}${10 - move.from[0]}`;
            const toPos = `${String.fromCharCode(97 + move.to[1])}${10 - move.to[0]}`;
            const captureText = move.captured ? ` 吃${move.captured}` : '';

            entry.textContent = `${index + 1}. ${move.piece} ${fromPos}→${toPos}${captureText}`;
            container.appendChild(entry);
        });

        // 滚动到底部
        container.scrollTop = container.scrollHeight;
    }

    updatePuzzleList() {
        const container = document.getElementById('puzzleList');
        container.innerHTML = '';

        this.puzzles.forEach((puzzle, index) => {
            const item = document.createElement('div');
            const isCompleted = this.completedPuzzles.has(index);
            const isCurrent = index === this.currentPuzzleIndex;

            // 确保只有当前选中的题目有current样式，其他都没有
            let className = 'puzzle-item';
            if (isCurrent) {
                className += ' current';
            }
            if (isCompleted) {
                className += ' completed';
            }

            item.className = className;
            item.onclick = () => {
                // 点击时切换到新题目，loadPuzzle会自动更新列表状态
                this.loadPuzzle(index);
            };

            item.innerHTML = `
                <div style="font-weight: bold; margin-bottom: 4px;">
                    ${index + 1}. ${puzzle.name}
                </div>
                <div style="font-size: 0.8rem; color: #666;">
                    ${this.getDifficultyText(puzzle.difficulty)}
                </div>
            `;

            container.appendChild(item);
        });
    }

    startTimer() {
        setInterval(() => {
            this.gameTime = Math.floor((Date.now() - this.startTime) / 1000);
            const minutes = Math.floor(this.gameTime / 60);
            const seconds = this.gameTime % 60;
            document.getElementById('puzzleTime').textContent =
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    getDifficultyText(difficulty) {
        const difficultyMap = {
            'easy': '初级',
            'medium': '中级',
            'hard': '高级'
        };
        return difficultyMap[difficulty] || '未知';
    }

    closeSuccessModal() {
        document.getElementById('successModal').style.display = 'none';
        this.nextPuzzle();
    }
}

// 全局变量
let chessPuzzle;

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', function () {
    try {
        chessPuzzle = new ChessPuzzleGame();
        chessPuzzle.init();
        console.log('象棋残局游戏初始化成功！');
        console.log('当前谜题数量:', chessPuzzle.puzzles.length);
    } catch (error) {
        console.error('游戏初始化失败:', error);
    }
});