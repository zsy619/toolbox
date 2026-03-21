class JigsawPuzzle {
            constructor() {
                this.boardSize = 4;
                this.pieces = [];
                this.correctPositions = [];
                this.selectedPiece = null;
                this.moves = 0;
                this.startTime = Date.now();
                this.gameTimer = null;
                this.currentImage = null;
                this.isGameActive = false;
                
                this.presetImages = {
                    landscape: 'data:image/svg+xml;base64,' + btoa(`
                        <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" style="stop-color:#87CEEB"/>
                                    <stop offset="100%" style="stop-color:#98FB98"/>
                                </linearGradient>
                                <linearGradient id="mountain" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" style="stop-color:#8B4513"/>
                                    <stop offset="100%" style="stop-color:#654321"/>
                                </linearGradient>
                            </defs>
                            <rect width="400" height="400" fill="url(#sky)"/>
                            <polygon points="0,200 100,100 200,150 300,80 400,120 400,400 0,400" fill="url(#mountain)"/>
                            <polygon points="50,120 150,50 250,100 200,200 100,180" fill="#228B22"/>
                            <circle cx="80" cy="80" r="25" fill="#FFD700"/>
                            <rect x="180" y="220" width="40" height="60" fill="#8B4513"/>
                            <polygon points="180,220 200,200 220,220" fill="#654321"/>
                        </svg>
                    `),
                    animal: 'data:image/svg+xml;base64,' + btoa(`
                        <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
                            <rect width="400" height="400" fill="#E6F3FF"/>
                            <ellipse cx="200" cy="250" rx="80" ry="60" fill="#FFA500"/>
                            <circle cx="200" cy="200" r="50" fill="#FFA500"/>
                            <circle cx="180" cy="185" r="8" fill="#000"/>
                            <circle cx="220" cy="185" r="8" fill="#000"/>
                            <ellipse cx="200" cy="210" rx="15" ry="8" fill="#000"/>
                            <ellipse cx="120" cy="180" rx="25" ry="35" fill="#FFA500"/>
                            <ellipse cx="280" cy="180" rx="25" ry="35" fill="#FFA500"/>
                            <ellipse cx="160" cy="320" rx="20" ry="40" fill="#FFA500"/>
                            <ellipse cx="240" cy="320" rx="20" ry="40" fill="#FFA500"/>
                            <path d="M160 340 Q200 350 240 340" stroke="#000" stroke-width="3" fill="none"/>
                        </svg>
                    `),
                    abstract: 'data:image/svg+xml;base64,' + btoa(`
                        <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <radialGradient id="grad1">
                                    <stop offset="0%" style="stop-color:#FF6B6B"/>
                                    <stop offset="100%" style="stop-color:#4ECDC4"/>
                                </radialGradient>
                                <radialGradient id="grad2">
                                    <stop offset="0%" style="stop-color:#45B7D1"/>
                                    <stop offset="100%" style="stop-color:#FFA07A"/>
                                </radialGradient>
                            </defs>
                            <rect width="400" height="400" fill="url(#grad1)"/>
                            <circle cx="150" cy="150" r="80" fill="url(#grad2)" opacity="0.8"/>
                            <polygon points="250,100 350,150 300,250 200,200" fill="#FFD700" opacity="0.7"/>
                            <ellipse cx="300" cy="300" rx="60" ry="80" fill="#9B59B6" opacity="0.6"/>
                            <path d="M50 350 Q200 300 350 350 Q200 400 50 350" fill="#2ECC71" opacity="0.5"/>
                        </svg>
                    `),
                    city: 'data:image/svg+xml;base64,' + btoa(`
                        <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" style="stop-color:#1e3c72"/>
                                    <stop offset="100%" style="stop-color:#2a5298"/>
                                </linearGradient>
                            </defs>
                            <rect width="400" height="400" fill="url(#skyGrad)"/>
                            <rect x="50" y="200" width="60" height="200" fill="#34495e"/>
                            <rect x="120" y="150" width="50" height="250" fill="#2c3e50"/>
                            <rect x="180" y="100" width="70" height="300" fill="#34495e"/>
                            <rect x="260" y="180" width="45" height="220" fill="#2c3e50"/>
                            <rect x="315" y="160" width="55" height="240" fill="#34495e"/>
                            <rect x="60" y="210" width="8" height="12" fill="#f1c40f"/>
                            <rect x="75" y="220" width="8" height="12" fill="#f1c40f"/>
                            <rect x="90" y="205" width="8" height="12" fill="#f1c40f"/>
                            <rect x="130" y="170" width="6" height="10" fill="#f1c40f"/>
                            <rect x="145" y="180" width="6" height="10" fill="#f1c40f"/>
                            <rect x="190" y="120" width="10" height="15" fill="#f1c40f"/>
                            <rect x="210" y="135" width="10" height="15" fill="#f1c40f"/>
                            <rect x="230" y="125" width="10" height="15" fill="#f1c40f"/>
                            <circle cx="80" cy="80" r="30" fill="#f39c12" opacity="0.7"/>
                        </svg>
                    `)
                };
                
                this.initializeGame();
                this.bindEvents();
            }

            initializeGame() {
                this.currentImage = this.presetImages.landscape;
                this.updateReferenceImage();
                this.createPuzzle();
                this.shuffle();
                this.startTimer();
            }

            bindEvents() {
                document.getElementById('newGame').addEventListener('click', () => this.newGame());
                document.getElementById('shuffle').addEventListener('click', () => this.shuffle());
                document.getElementById('hint').addEventListener('click', () => this.showHint());
                document.getElementById('solve').addEventListener('click', () => this.solve());
                
                document.getElementById('difficulty').addEventListener('change', (e) => {
                    this.boardSize = parseInt(e.target.value);
                    document.getElementById('difficultyIndicator').textContent = `${this.boardSize}×${this.boardSize}`;
                    this.newGame();
                });
                
                document.getElementById('imageSelect').addEventListener('change', (e) => {
                    this.currentImage = this.presetImages[e.target.value];
                    this.updateReferenceImage();
                    this.newGame();
                });
                
                document.getElementById('customImage').addEventListener('change', (e) => {
                    this.handleCustomImage(e);
                });
            }

            createPuzzle() {
                const board = document.getElementById('puzzleBoard');
                board.style.gridTemplateColumns = `repeat(${this.boardSize}, 1fr)`;
                board.style.gridTemplateRows = `repeat(${this.boardSize}, 1fr)`;
                board.innerHTML = '';
                
                this.pieces = [];
                this.correctPositions = [];
                
                for (let i = 0; i < this.boardSize * this.boardSize; i++) {
                    const piece = document.createElement('div');
                    piece.className = 'puzzle-piece';
                    piece.dataset.index = i;
                    piece.dataset.correctIndex = i;
                    
                    const row = Math.floor(i / this.boardSize);
                    const col = i % this.boardSize;
                    
                    const bgPosX = -col * (100 / (this.boardSize - 1));
                    const bgPosY = -row * (100 / (this.boardSize - 1));
                    
                    piece.style.backgroundImage = `url(${this.currentImage})`;
                    piece.style.backgroundPosition = `${bgPosX}% ${bgPosY}%`;
                    piece.style.backgroundSize = `${this.boardSize * 100}%`;
                    
                    piece.addEventListener('click', () => this.selectPiece(i));
                    
                    board.appendChild(piece);
                    this.pieces.push(piece);
                    this.correctPositions.push(i);
                }
                
                this.isGameActive = true;
            }

            selectPiece(index) {
                if (!this.isGameActive) return;
                
                const piece = this.pieces[index];
                
                if (this.selectedPiece === null) {
                    this.selectedPiece = index;
                    piece.classList.add('selected');
                } else if (this.selectedPiece === index) {
                    piece.classList.remove('selected');
                    this.selectedPiece = null;
                } else {
                    this.swapPieces(this.selectedPiece, index);
                    this.pieces[this.selectedPiece].classList.remove('selected');
                    this.selectedPiece = null;
                    this.moves++;
                    this.updateUI();
                    this.checkCompletion();
                }
            }

            swapPieces(index1, index2) {
                const piece1 = this.pieces[index1];
                const piece2 = this.pieces[index2];
                
                const tempCorrectIndex = piece1.dataset.correctIndex;
                piece1.dataset.correctIndex = piece2.dataset.correctIndex;
                piece2.dataset.correctIndex = tempCorrectIndex;
                
                const tempBgImage = piece1.style.backgroundImage;
                const tempBgPos = piece1.style.backgroundPosition;
                const tempBgSize = piece1.style.backgroundSize;
                
                piece1.style.backgroundImage = piece2.style.backgroundImage;
                piece1.style.backgroundPosition = piece2.style.backgroundPosition;
                piece1.style.backgroundSize = piece2.style.backgroundSize;
                
                piece2.style.backgroundImage = tempBgImage;
                piece2.style.backgroundPosition = tempBgPos;
                piece2.style.backgroundSize = tempBgSize;
            }

            shuffle() {
                for (let i = 0; i < this.boardSize * this.boardSize * 10; i++) {
                    const index1 = Math.floor(Math.random() * this.pieces.length);
                    const index2 = Math.floor(Math.random() * this.pieces.length);
                    if (index1 !== index2) {
                        this.swapPieces(index1, index2);
                    }
                }
                this.moves = 0;
                this.updateUI();
            }

            checkCompletion() {
                let correctPieces = 0;
                
                this.pieces.forEach((piece, index) => {
                    if (parseInt(piece.dataset.correctIndex) === index) {
                        piece.classList.add('correct');
                        correctPieces++;
                    } else {
                        piece.classList.remove('correct');
                    }
                });
                
                const progress = Math.round((correctPieces / this.pieces.length) * 100);
                document.getElementById('progress').textContent = `${progress}%`;
                document.getElementById('progressFill').style.width = `${progress}%`;
                
                if (correctPieces === this.pieces.length) {
                    this.completeGame();
                }
            }

            completeGame() {
                this.isGameActive = false;
                clearInterval(this.gameTimer);
                
                const timeString = document.getElementById('timer').textContent;
                document.getElementById('completionText').innerHTML = 
                    `你用时 ${timeString}，移动了 ${this.moves} 次完成了 ${this.boardSize}×${this.boardSize} 拼图！`;
                
                document.getElementById('completionModal').style.display = 'flex';
                
                this.saveStats();
            }

            showHint() {
                if (!this.isGameActive) return;
                
                let incorrectPieces = [];
                this.pieces.forEach((piece, index) => {
                    if (parseInt(piece.dataset.correctIndex) !== index) {
                        incorrectPieces.push(index);
                    }
                });
                
                if (incorrectPieces.length > 0) {
                    const randomIncorrect = incorrectPieces[Math.floor(Math.random() * incorrectPieces.length)];
                    const piece = this.pieces[randomIncorrect];
                    
                    piece.style.border = '3px solid #ff6b6b';
                    piece.style.animation = 'pulse 1s infinite';
                    
                    setTimeout(() => {
                        piece.style.border = '2px solid transparent';
                        piece.style.animation = '';
                    }, 3000);
                }
            }

            solve() {
                if (!confirm('确定要显示答案吗？这将结束当前游戏。')) return;
                
                this.pieces.forEach((piece, index) => {
                    const correctIndex = parseInt(piece.dataset.correctIndex);
                    const row = Math.floor(correctIndex / this.boardSize);
                    const col = correctIndex % this.boardSize;
                    
                    const bgPosX = -col * (100 / (this.boardSize - 1));
                    const bgPosY = -row * (100 / (this.boardSize - 1));
                    
                    piece.style.backgroundPosition = `${bgPosX}% ${bgPosY}%`;
                    piece.dataset.correctIndex = index;
                    piece.classList.add('correct');
                });
                
                this.isGameActive = false;
                document.getElementById('progress').textContent = '100%';
                document.getElementById('progressFill').style.width = '100%';
            }

            newGame() {
                this.moves = 0;
                this.selectedPiece = null;
                this.startTime = Date.now();
                clearInterval(this.gameTimer);
                
                this.createPuzzle();
                this.shuffle();
                this.startTimer();
                this.updateUI();
            }

            startTimer() {
                this.gameTimer = setInterval(() => {
                    if (this.isGameActive) {
                        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
                        const minutes = Math.floor(elapsed / 60);
                        const seconds = elapsed % 60;
                        document.getElementById('timer').textContent = 
                            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                    }
                }, 1000);
            }

            updateUI() {
                document.getElementById('moves').textContent = this.moves;
                this.checkCompletion();
            }

            updateReferenceImage() {
                document.getElementById('referenceImage').style.backgroundImage = `url(${this.currentImage})`;
            }

            handleCustomImage(event) {
                const file = event.target.files[0];
                if (!file) return;
                
                if (!file.type.startsWith('image/')) {
                    alert('请选择有效的图片文件！');
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.currentImage = e.target.result;
                    this.updateReferenceImage();
                    this.newGame();
                };
                reader.readAsDataURL(file);
            }

            hideCompletionModal() {
                document.getElementById('completionModal').style.display = 'none';
            }

            saveStats() {
                const stats = JSON.parse(localStorage.getItem('jigsawPuzzleStats') || '{}');
                const difficulty = `${this.boardSize}x${this.boardSize}`;
                
                if (!stats[difficulty]) {
                    stats[difficulty] = {
                        gamesPlayed: 0,
                        bestTime: Infinity,
                        bestMoves: Infinity,
                        totalTime: 0,
                        totalMoves: 0
                    };
                }
                
                const currentTime = Math.floor((Date.now() - this.startTime) / 1000);
                
                stats[difficulty].gamesPlayed++;
                stats[difficulty].totalTime += currentTime;
                stats[difficulty].totalMoves += this.moves;
                
                if (currentTime < stats[difficulty].bestTime) {
                    stats[difficulty].bestTime = currentTime;
                }
                
                if (this.moves < stats[difficulty].bestMoves) {
                    stats[difficulty].bestMoves = this.moves;
                }
                
                localStorage.setItem('jigsawPuzzleStats', JSON.stringify(stats));
            }
        }

        const jigsawPuzzle = new JigsawPuzzle();

        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
        `;
        document.head.appendChild(style);