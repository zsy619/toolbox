// 单词拼图游戏 - 主要逻辑
class WordPuzzle {
    constructor() {
        this.difficulty = 'easy';
        this.score = 0;
        this.level = 1;
        this.combo = 0;
        this.maxCombo = 0;
        this.timeLeft = 120;
        this.gameActive = false;
        this.currentWord = null;
        this.completedWords = [];
        this.hintsUsed = 0;
        this.timer = null;
        
        // 单词库
        this.wordList = {
            easy: [
                { word: 'CAT', clue: '一种小型家养动物，喜欢抓老鼠' },
                { word: 'DOG', clue: '人类最忠实的朋友' },
                { word: 'SUN', clue: '太阳系的中心，给地球带来光和热' },
                { word: 'BOOK', clue: '知识的载体，学习的工具' },
                { word: 'TREE', clue: '高大的植物，有树干和树叶' },
                { word: 'FISH', clue: '生活在水中的动物' },
                { word: 'BIRD', clue: '有翅膀会飞的动物' },
                { word: 'HAND', clue: '人体的一部分，用来抓握' },
                { word: 'FACE', clue: '头部前面的部分' },
                { word: 'HOME', clue: '我们居住的地方' },
                { word: 'LOVE', clue: '一种深厚的情感' },
                { word: 'MOON', clue: '夜晚的明亮天体' },
                { word: 'STAR', clue: '夜空中闪闪发光的点' },
                { word: 'RAIN', clue: '从天空落下的水滴' },
                { word: 'WIND', clue: '空气的流动' }
            ],
            medium: [
                { word: 'OCEAN', clue: '广阔的水域，比海更大' },
                { word: 'FOREST', clue: '茂密的树木聚集地' },
                { word: 'CASTLE', clue: '中世纪贵族居住的堡垒' },
                { word: 'BRIDGE', clue: '连接两岸的建筑结构' },
                { word: 'GARDEN', clue: '种植花草的地方' },
                { word: 'PLANET', clue: '围绕恒星运行的天体' },
                { word: 'SCHOOL', clue: '学生学习的地方' },
                { word: 'CAMERA', clue: '用来拍照的设备' },
                { word: 'ROCKET', clue: '用于太空探索的飞行器' },
                { word: 'PUZZLE', clue: '需要解决的问题或游戏' },
                { word: 'FRIEND', clue: '关系密切的伙伴' },
                { word: 'GUITAR', clue: '有六根弦的乐器' },
                { word: 'FLOWER', clue: '植物美丽的开花部分' },
                { word: 'DOCTOR', clue: '治疗疾病的专业人士' },
                { word: 'WINTER', clue: '一年中最寒冷的季节' }
            ],
            hard: [
                { word: 'ELEPHANT', clue: '世界上最大的陆地哺乳动物' },
                { word: 'RAINBOW', clue: '雨后天空中的彩色弧线' },
                { word: 'COMPUTER', clue: '用于处理信息的电子设备' },
                { word: 'MOUNTAIN', clue: '地表隆起的高峻地形' },
                { word: 'TREASURE', clue: '珍贵的财富或物品' },
                { word: 'DIAMOND', clue: '最坚硬的天然矿物' },
                { word: 'BUTTERFLY', clue: '美丽的昆虫，有彩色翅膀' },
                { word: 'KEYBOARD', clue: '计算机的输入设备' },
                { word: 'ADVENTURE', clue: '充满刺激的旅程或经历' },
                { word: 'LANGUAGE', clue: '人类交流的工具和系统' },
                { word: 'UNIVERSE', clue: '包含所有物质和能量的整体' },
                { word: 'CHAMPION', clue: '获得冠军的人' },
                { word: 'QUESTION', clue: '需要回答的询问' },
                { word: 'BIRTHDAY', clue: '庆祝出生的特殊日子' },
                { word: 'SANDWICH', clue: '两片面包中间夹着食物' }
            ]
        };
        
        this.bindEvents();
    }
    
    bindEvents() {
        // 键盘事件
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.gameActive) {
                e.preventDefault();
                this.startGame();
            } else if (e.code === 'Enter' && this.gameActive) {
                this.checkWord();
            } else if (e.code === 'Escape' && this.gameActive) {
                this.clearWord();
            }
        });
        
        // 拖拽事件绑定将在generateLetters中进行
    }
    
    setDifficulty(difficulty) {
        if (this.gameActive) return;
        
        this.difficulty = difficulty;
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
    }
    
    startGame() {
        this.resetGame();
        this.gameActive = true;
        this.timeLeft = 120;
        
        document.getElementById('startBtn').disabled = true;
        document.getElementById('checkBtn').disabled = false;
        document.getElementById('clearBtn').disabled = false;
        document.getElementById('skipBtn').disabled = false;
        
        this.generateNewWord();
        this.startTimer();
        this.updateDisplay();
    }
    
    resetGame() {
        this.score = 0;
        this.level = 1;
        this.combo = 0;
        this.timeLeft = 120;
        this.completedWords = [];
        this.hintsUsed = 0;
        this.currentWord = null;
        
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        document.getElementById('startBtn').disabled = false;
        document.getElementById('checkBtn').disabled = true;
        document.getElementById('clearBtn').disabled = true;
        document.getElementById('skipBtn').disabled = true;
        
        document.getElementById('wordClue').textContent = '点击开始游戏查看提示';
        document.getElementById('wordSlots').innerHTML = '';
        document.getElementById('lettersContainer').innerHTML = '';
        document.getElementById('completedWords').innerHTML = '<div class="empty-state">完成单词后将在这里显示</div>';
        
        this.updateDisplay();
    }
    
    startTimer() {
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateDisplay();
            
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
    }
    
    generateNewWord() {
        const words = this.wordList[this.difficulty];
        const availableWords = words.filter(w => !this.completedWords.includes(w.word));
        
        if (availableWords.length === 0) {
            // 所有单词都完成了，升级难度或结束游戏
            this.handleAllWordsCompleted();
            return;
        }
        
        this.currentWord = availableWords[Math.floor(Math.random() * availableWords.length)];
        
        document.getElementById('wordClue').textContent = this.currentWord.clue;
        this.generateWordSlots();
        this.generateLetters();
    }
    
    generateWordSlots() {
        const container = document.getElementById('wordSlots');
        container.innerHTML = '';
        
        for (let i = 0; i < this.currentWord.word.length; i++) {
            const slot = document.createElement('div');
            slot.className = 'letter-slot';
            slot.dataset.index = i;
            slot.addEventListener('click', () => this.removeLetterFromSlot(slot));
            
            // 拖放事件
            slot.addEventListener('dragover', this.handleDragOver.bind(this));
            slot.addEventListener('drop', this.handleDrop.bind(this));
            
            container.appendChild(slot);
        }
    }
    
    generateLetters() {
        const container = document.getElementById('lettersContainer');
        container.innerHTML = '';
        
        // 获取单词字母并添加一些干扰字母
        const wordLetters = this.currentWord.word.split('');
        const distractors = this.generateDistractorLetters(wordLetters.length);
        const allLetters = [...wordLetters, ...distractors];
        
        // 打乱字母顺序
        for (let i = allLetters.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allLetters[i], allLetters[j]] = [allLetters[j], allLetters[i]];
        }
        
        allLetters.forEach(letter => {
            const tile = this.createLetterTile(letter);
            container.appendChild(tile);
        });
    }
    
    createLetterTile(letter) {
        const tile = document.createElement('div');
        tile.className = 'letter-tile';
        tile.textContent = letter;
        tile.draggable = true;
        
        // 拖拽事件
        tile.addEventListener('dragstart', this.handleDragStart.bind(this));
        tile.addEventListener('dragend', this.handleDragEnd.bind(this));
        
        // 点击事件（自动放置）
        tile.addEventListener('click', () => this.autoPlaceLetter(tile));
        
        return tile;
    }
    
    generateDistractorLetters(count) {
        const consonants = 'BCDFGHJKLMNPQRSTVWXYZ';
        const vowels = 'AEIOU';
        const distractors = [];
        
        for (let i = 0; i < Math.max(2, count - 2); i++) {
            if (Math.random() < 0.7) {
                distractors.push(consonants[Math.floor(Math.random() * consonants.length)]);
            } else {
                distractors.push(vowels[Math.floor(Math.random() * vowels.length)]);
            }
        }
        
        return distractors;
    }
    
    // 拖拽处理
    handleDragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.textContent);
        e.target.classList.add('dragging');
    }
    
    handleDragEnd(e) {
        e.target.classList.remove('dragging');
    }
    
    handleDragOver(e) {
        e.preventDefault();
        e.currentTarget.classList.add('drag-over');
    }
    
    handleDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        
        const letter = e.dataTransfer.getData('text/plain');
        const slot = e.currentTarget;
        
        if (slot.classList.contains('letter-slot') && !slot.textContent) {
            this.placeLetterInSlot(letter, slot);
        }
    }
    
    placeLetterInSlot(letter, slot) {
        if (slot.textContent) return; // 槽位已被占用
        
        slot.textContent = letter;
        slot.classList.add('filled');
        
        // 移除字母池中的对应字母
        const letterTiles = document.querySelectorAll('.letter-tile');
        for (let tile of letterTiles) {
            if (tile.textContent === letter && !tile.dataset.used) {
                tile.style.display = 'none';
                tile.dataset.used = 'true';
                break;
            }
        }
    }
    
    autoPlaceLetter(tile) {
        if (tile.dataset.used) return;
        
        const letter = tile.textContent;
        const emptySlots = document.querySelectorAll('.letter-slot:not(.filled)');
        
        if (emptySlots.length > 0) {
            this.placeLetterInSlot(letter, emptySlots[0]);
        }
    }
    
    removeLetterFromSlot(slot) {
        if (!slot.textContent) return;
        
        const letter = slot.textContent;
        slot.textContent = '';
        slot.classList.remove('filled');
        
        // 将字母返回到字母池
        const letterTiles = document.querySelectorAll('.letter-tile');
        for (let tile of letterTiles) {
            if (tile.textContent === letter && tile.dataset.used) {
                tile.style.display = 'flex';
                tile.dataset.used = 'false';
                break;
            }
        }
    }
    
    checkWord() {
        if (!this.gameActive) return;
        
        const slots = document.querySelectorAll('.letter-slot');
        let formedWord = '';
        
        for (let slot of slots) {
            if (!slot.textContent) {
                alert('请先完成单词！');
                return;
            }
            formedWord += slot.textContent;
        }
        
        if (formedWord === this.currentWord.word) {
            this.handleCorrectWord();
        } else {
            this.handleIncorrectWord();
        }
    }
    
    handleCorrectWord() {
        this.combo++;
        this.maxCombo = Math.max(this.maxCombo, this.combo);
        this.completedWords.push(this.currentWord.word);
        
        // 计算分数
        const baseScore = this.currentWord.word.length * 10;
        const comboBonus = this.combo * 5;
        const timeBonus = Math.floor(this.timeLeft / 10);
        const difficultyMultiplier = { easy: 1, medium: 1.5, hard: 2 }[this.difficulty];
        
        this.score += Math.floor((baseScore + comboBonus + timeBonus) * difficultyMultiplier);
        
        // 升级检查
        if (this.completedWords.length % 5 === 0) {
            this.level++;
        }
        
        // 标记正确
        document.querySelectorAll('.letter-slot').forEach(slot => {
            slot.classList.add('correct');
        });
        
        // 更新完成单词显示
        this.updateCompletedWords();
        
        setTimeout(() => {
            this.generateNewWord();
        }, 1500);
        
        this.updateDisplay();
    }
    
    handleIncorrectWord() {
        this.combo = 0;
        
        // 显示错误效果
        document.querySelectorAll('.letter-slot').forEach(slot => {
            slot.style.animation = 'shake 0.6s ease';
        });
        
        setTimeout(() => {
            document.querySelectorAll('.letter-slot').forEach(slot => {
                slot.style.animation = '';
            });
        }, 600);
    }
    
    clearWord() {
        if (!this.gameActive) return;
        
        const slots = document.querySelectorAll('.letter-slot');
        slots.forEach(slot => {
            if (slot.textContent) {
                this.removeLetterFromSlot(slot);
            }
        });
    }
    
    skipWord() {
        if (!this.gameActive) return;
        
        this.combo = 0;
        this.generateNewWord();
        this.updateDisplay();
    }
    
    shuffleLetters() {
        if (!this.gameActive) return;
        
        const container = document.getElementById('lettersContainer');
        const tiles = Array.from(container.querySelectorAll('.letter-tile:not([data-used="true"])'));
        
        // 打乱顺序
        for (let i = tiles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            container.insertBefore(tiles[j], tiles[i].nextSibling);
        }
    }
    
    showHint() {
        if (!this.gameActive || !this.currentWord) return;
        
        this.hintsUsed++;
        const word = this.currentWord.word;
        const slots = document.querySelectorAll('.letter-slot');
        
        // 找到第一个空槽位并填入正确字母
        for (let i = 0; i < slots.length; i++) {
            if (!slots[i].textContent) {
                const correctLetter = word[i];
                this.placeLetterInSlot(correctLetter, slots[i]);
                break;
            }
        }
        
        // 扣除分数
        this.score = Math.max(0, this.score - 5);
        this.updateDisplay();
    }
    
    updateCompletedWords() {
        const container = document.getElementById('completedWords');
        
        if (this.completedWords.length === 0) {
            container.innerHTML = '<div class="empty-state">完成单词后将在这里显示</div>';
        } else {
            container.innerHTML = '';
            this.completedWords.forEach(word => {
                const wordDiv = document.createElement('div');
                wordDiv.className = 'completed-word';
                wordDiv.textContent = word;
                container.appendChild(wordDiv);
            });
        }
    }
    
    updateDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
        document.getElementById('combo').textContent = this.combo;
        
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        document.getElementById('timer').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    handleAllWordsCompleted() {
        // 如果当前难度的所有单词都完成了，尝试升级难度
        if (this.difficulty === 'easy') {
            this.difficulty = 'medium';
            this.generateNewWord();
        } else if (this.difficulty === 'medium') {
            this.difficulty = 'hard';
            this.generateNewWord();
        } else {
            // 所有难度都完成，游戏胜利
            this.endGame(true);
        }
    }
    
    endGame(victory = false) {
        this.gameActive = false;
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        document.getElementById('startBtn').disabled = false;
        document.getElementById('checkBtn').disabled = true;
        document.getElementById('clearBtn').disabled = true;
        document.getElementById('skipBtn').disabled = true;
        
        this.showGameOver(victory);
    }
    
    showGameOver(victory = false) {
        const title = document.getElementById('gameOverTitle');
        if (victory) {
            title.textContent = '🏆 完美通关！';
        } else if (this.score > 300) {
            title.textContent = '🎉 出色表现！';
        } else if (this.score > 150) {
            title.textContent = '👍 不错的成绩！';
        } else {
            title.textContent = '🎮 游戏结束';
        }
        
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('wordsCompleted').textContent = this.completedWords.length;
        document.getElementById('maxCombo').textContent = this.maxCombo;
        document.getElementById('maxLevel').textContent = this.level;
        
        document.getElementById('gameOverPopup').classList.add('show');
    }
    
    closeGameOver() {
        document.getElementById('gameOverPopup').classList.remove('show');
    }
    
    showHelp() {
        document.getElementById('helpPopup').classList.add('show');
    }
    
    closeHelp() {
        document.getElementById('helpPopup').classList.remove('show');
    }
}

// 全局变量
let wordPuzzle;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    wordPuzzle = new WordPuzzle();
});