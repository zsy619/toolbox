class TextAdventure {
    constructor() {
        this.currentStory = null;
        this.currentChapter = 0;
        this.gameStartTime = null;
        this.choiceCount = 0;
        this.itemCount = 0;
        
        // 玩家状态
        this.player = {
            health: 100,
            maxHealth: 100,
            energy: 100,
            maxEnergy: 100,
            gold: 0,
            experience: 0,
            inventory: []
        };
        
        // 故事数据
        this.stories = {
            dragon: this.getDragonStory(),
            mystery: this.getMysteryStory(),
            space: this.getSpaceStory()
        };
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.showStorySelector();
    }
    
    bindEvents() {
        // 故事卡片点击事件
        document.querySelectorAll('.story-card').forEach(card => {
            card.addEventListener('click', () => {
                const storyId = card.dataset.story;
                this.startStory(storyId);
            });
        });
    }
    
    startStory(storyId) {
        this.currentStory = this.stories[storyId];
        this.currentChapter = 0;
        this.gameStartTime = Date.now();
        this.choiceCount = 0;
        this.itemCount = 0;
        
        // 重置玩家状态
        this.player = {
            health: 100,
            maxHealth: 100,
            energy: 100,
            maxEnergy: 100,
            gold: 0,
            experience: 0,
            inventory: []
        };
        
        // 显示游戏界面
        document.getElementById('storySelector').style.display = 'none';
        document.getElementById('gameInterface').style.display = 'block';
        
        this.showChapter(0);
        this.updateUI();
    }
    
    showChapter(chapterIndex) {
        if (!this.currentStory || chapterIndex >= this.currentStory.chapters.length) {
            return;
        }
        
        this.currentChapter = chapterIndex;
        const chapter = this.currentStory.chapters[chapterIndex];
        
        // 更新界面
        document.getElementById('locationName').textContent = chapter.location;
        document.getElementById('chapterInfo').textContent = `第${chapterIndex + 1}章`;
        document.getElementById('storyText').textContent = chapter.text;
        document.getElementById('asciiArt').textContent = chapter.ascii || '';
        
        // 更新进度条
        const progress = ((chapterIndex + 1) / this.currentStory.chapters.length) * 100;
        document.getElementById('progressFill').style.width = progress + '%';
        
        // 应用章节效果
        if (chapter.effects) {
            this.applyEffects(chapter.effects);
        }
        
        // 显示选择项
        this.showChoices(chapter.choices);
        
        // 检查是否为结局
        if (chapter.isEnding) {
            setTimeout(() => this.showEnding(chapter.ending), 2000);
        }
    }
    
    showChoices(choices) {
        const container = document.getElementById('choicesContainer');
        container.innerHTML = '';
        
        if (!choices || choices.length === 0) {
            return;
        }
        
        choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.className = 'choice-btn';
            button.innerHTML = choice.text;
            
            // 检查选择要求
            const canChoose = this.checkRequirements(choice.requirements);
            if (!canChoose) {
                button.disabled = true;
                if (choice.requirements) {
                    const reqDiv = document.createElement('div');
                    reqDiv.className = 'choice-requirements';
                    reqDiv.textContent = this.getRequirementText(choice.requirements);
                    button.appendChild(reqDiv);
                }
            }
            
            button.addEventListener('click', () => {
                if (canChoose) {
                    this.makeChoice(choice);
                }
            });
            
            container.appendChild(button);
        });
    }
    
    makeChoice(choice) {
        this.choiceCount++;
        
        // 应用选择效果
        if (choice.effects) {
            this.applyEffects(choice.effects);
        }
        
        // 跳转到下一章节
        if (choice.nextChapter !== undefined) {
            setTimeout(() => this.showChapter(choice.nextChapter), 500);
        }
        
        this.updateUI();
    }
    
    applyEffects(effects) {
        if (effects.health) {
            this.player.health = Math.max(0, Math.min(this.player.maxHealth, 
                this.player.health + effects.health));
        }
        
        if (effects.energy) {
            this.player.energy = Math.max(0, Math.min(this.player.maxEnergy, 
                this.player.energy + effects.energy));
        }
        
        if (effects.gold) {
            this.player.gold = Math.max(0, this.player.gold + effects.gold);
        }
        
        if (effects.experience) {
            this.player.experience += effects.experience;
        }
        
        if (effects.addItem) {
            if (this.player.inventory.length < 4) {
                this.player.inventory.push(effects.addItem);
                this.itemCount++;
            }
        }
        
        if (effects.removeItem) {
            const index = this.player.inventory.indexOf(effects.removeItem);
            if (index > -1) {
                this.player.inventory.splice(index, 1);
            }
        }
    }
    
    checkRequirements(requirements) {
        if (!requirements) return true;
        
        if (requirements.health && this.player.health < requirements.health) {
            return false;
        }
        
        if (requirements.energy && this.player.energy < requirements.energy) {
            return false;
        }
        
        if (requirements.gold && this.player.gold < requirements.gold) {
            return false;
        }
        
        if (requirements.item && !this.player.inventory.includes(requirements.item)) {
            return false;
        }
        
        return true;
    }
    
    getRequirementText(requirements) {
        const texts = [];
        
        if (requirements.health) {
            texts.push(`需要生命值 ${requirements.health}`);
        }
        
        if (requirements.energy) {
            texts.push(`需要体力值 ${requirements.energy}`);
        }
        
        if (requirements.gold) {
            texts.push(`需要金币 ${requirements.gold}`);
        }
        
        if (requirements.item) {
            texts.push(`需要物品: ${requirements.item}`);
        }
        
        return texts.join(', ');
    }
    
    updateUI() {
        // 更新生命值
        const healthPercent = (this.player.health / this.player.maxHealth) * 100;
        document.getElementById('healthBar').style.width = healthPercent + '%';
        document.getElementById('healthText').textContent = 
            `${this.player.health}/${this.player.maxHealth}`;
        
        // 更新体力值
        const energyPercent = (this.player.energy / this.player.maxEnergy) * 100;
        document.getElementById('energyBar').style.width = energyPercent + '%';
        document.getElementById('energyText').textContent = 
            `${this.player.energy}/${this.player.maxEnergy}`;
        
        // 更新金币和经验
        document.getElementById('goldValue').textContent = this.player.gold;
        document.getElementById('expValue').textContent = this.player.experience;
        
        // 更新物品栏
        this.updateInventory();
        
        // 检查游戏结束条件
        if (this.player.health <= 0) {
            setTimeout(() => this.showGameOver(), 1000);
        }
    }
    
    updateInventory() {
        const slots = document.querySelectorAll('.inventory-slot');
        
        slots.forEach((slot, index) => {
            if (index < this.player.inventory.length) {
                const item = this.player.inventory[index];
                slot.innerHTML = this.getItemIcon(item);
                slot.classList.remove('empty');
                slot.title = item;
            } else {
                slot.innerHTML = '<span>空</span>';
                slot.classList.add('empty');
                slot.title = '';
            }
        });
    }
    
    getItemIcon(item) {
        const icons = {
            '剑': '⚔️',
            '盾牌': '🛡️',
            '药水': '🧪',
            '钥匙': '🔑',
            '宝石': '💎',
            '地图': '🗺️',
            '食物': '🍖',
            '工具': '🔧',
            '魔法书': '📚',
            '护身符': '🧿'
        };
        
        return icons[item] || '📦';
    }
    
    showEnding(ending) {
        document.getElementById('endingTitle').textContent = ending.title;
        document.getElementById('endingText').textContent = ending.text;
        document.getElementById('endingAscii').textContent = ending.ascii || '';
        
        // 更新统计
        document.getElementById('adventureTime').textContent = this.getGameTime();
        document.getElementById('choiceCount').textContent = this.choiceCount;
        document.getElementById('itemCount').textContent = this.itemCount;
        document.getElementById('endingType').textContent = ending.type;
        
        document.getElementById('endingPopup').classList.add('show');
    }
    
    showGameOver() {
        const gameOverEnding = {
            title: '💀 冒险结束',
            text: '你的生命值耗尽了，冒险到此结束。也许下次会有不同的选择...',
            type: '死亡结局',
            ascii: `
    ☠️
   /|\\
    |
   / \\
            `
        };
        
        this.showEnding(gameOverEnding);
    }
    
    getGameTime() {
        if (!this.gameStartTime) return '00:00';
        
        const elapsedMs = Date.now() - this.gameStartTime;
        const minutes = Math.floor(elapsedMs / 60000);
        const seconds = Math.floor((elapsedMs % 60000) / 1000);
        
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    restartStory() {
        this.closeEnding();
        this.closeMenu();
        
        if (this.currentStory) {
            this.currentChapter = 0;
            this.gameStartTime = Date.now();
            this.choiceCount = 0;
            this.itemCount = 0;
            
            // 重置玩家状态
            this.player = {
                health: 100,
                maxHealth: 100,
                energy: 100,
                maxEnergy: 100,
                gold: 0,
                experience: 0,
                inventory: []
            };
            
            this.showChapter(0);
            this.updateUI();
        }
    }
    
    selectNewStory() {
        this.closeEnding();
        this.closeMenu();
        this.showStorySelector();
    }
    
    showStorySelector() {
        document.getElementById('storySelector').style.display = 'block';
        document.getElementById('gameInterface').style.display = 'none';
        this.currentStory = null;
    }
    
    saveGame() {
        if (!this.currentStory) return;
        
        const saveData = {
            storyId: Object.keys(this.stories).find(key => this.stories[key] === this.currentStory),
            currentChapter: this.currentChapter,
            player: { ...this.player },
            gameStartTime: this.gameStartTime,
            choiceCount: this.choiceCount,
            itemCount: this.itemCount
        };
        
        localStorage.setItem('textAdventure_save', JSON.stringify(saveData));
        
        // 显示保存成功提示
        this.showNotification('游戏已保存！');
    }
    
    loadGame() {
        const saveData = localStorage.getItem('textAdventure_save');
        if (!saveData) {
            this.showNotification('没有找到存档！');
            return;
        }
        
        const data = JSON.parse(saveData);
        
        this.currentStory = this.stories[data.storyId];
        this.currentChapter = data.currentChapter;
        this.player = { ...data.player };
        this.gameStartTime = data.gameStartTime;
        this.choiceCount = data.choiceCount;
        this.itemCount = data.itemCount;
        
        // 显示游戏界面
        document.getElementById('storySelector').style.display = 'none';
        document.getElementById('gameInterface').style.display = 'block';
        
        this.showChapter(this.currentChapter);
        this.updateUI();
        
        this.showNotification('游戏已读取！');
    }
    
    showNotification(message) {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(76, 175, 80, 0.9);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            z-index: 9999;
            font-weight: 600;
            backdrop-filter: blur(10px);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // 显示动画
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // 自动消失
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
    }
    
    showMenu() {
        document.getElementById('menuPopup').classList.add('show');
    }
    
    closeMenu() {
        document.getElementById('menuPopup').classList.remove('show');
    }
    
    closeEnding() {
        document.getElementById('endingPopup').classList.remove('show');
    }
    
    showHelp() {
        document.getElementById('helpPopup').classList.add('show');
    }
    
    closeHelp() {
        document.getElementById('helpPopup').classList.remove('show');
    }
    
    showSettings() {
        // 这里可以添加设置功能
        this.showNotification('设置功能开发中...');
    }
    
    // 故事数据定义
    getDragonStory() {
        return {
            title: '龙与勇士',
            chapters: [
                {
                    location: '村庄广场',
                    text: '你是一名年轻的勇士，站在村庄的广场上。村民们聚集在你身边，眼中充满希望。村长告诉你，邪恶的巨龙抓走了公主，并要求巨额赎金。作为村里最勇敢的战士，拯救公主的重任落在了你的肩上。',
                    ascii: `
    🏰
   /   \\
  🚪   🚪
 ________
    `,
                    choices: [
                        {
                            text: '立即出发前往龙穴',
                            nextChapter: 1,
                            effects: { experience: 10 }
                        },
                        {
                            text: '先去武器店购买装备',
                            nextChapter: 2,
                            effects: { gold: 50 }
                        },
                        {
                            text: '寻找其他冒险者组队',
                            nextChapter: 3,
                            effects: { health: 20 }
                        }
                    ]
                },
                {
                    location: '黑暗森林',
                    text: '你独自一人穿过黑暗的森林。突然，一群哥布林跳了出来，挥舞着粗糙的武器向你冲来。你必须决定如何应对这个危险。',
                    ascii: `
    🌲 👹 🌲
      \\ | /
       \\|/
        ⚔️
    `,
                    choices: [
                        {
                            text: '拔剑迎战',
                            nextChapter: 4,
                            effects: { health: -20, experience: 15 }
                        },
                        {
                            text: '尝试绕过它们',
                            nextChapter: 5,
                            effects: { energy: -10 }
                        }
                    ]
                },
                {
                    location: '武器店',
                    text: '武器店老板是一位经验丰富的铁匠。他为你展示了各种武器和防具。"选择合适的装备很重要，年轻人。"他说道。',
                    ascii: `
    ⚔️ 🛡️ 🏹
     \\ | /
      \\|/
    👨‍🔧
    `,
                    choices: [
                        {
                            text: '购买魔法剑（花费30金币）',
                            nextChapter: 6,
                            requirements: { gold: 30 },
                            effects: { gold: -30, addItem: '剑' }
                        },
                        {
                            text: '购买坚固盾牌（花费20金币）',
                            nextChapter: 6,
                            requirements: { gold: 20 },
                            effects: { gold: -20, addItem: '盾牌' }
                        },
                        {
                            text: '什么都不买，保存金币',
                            nextChapter: 1
                        }
                    ]
                },
                {
                    location: '冒险者酒馆',
                    text: '酒馆里坐着各种各样的冒险者。你看到了一位精灵法师和一位矮人战士，他们似乎也对龙的传说很感兴趣。',
                    ascii: `
    🍺 🧙‍♀️ 🍺
      \\ | /
       \\|/
      🧔‍♂️
    `,
                    choices: [
                        {
                            text: '邀请精灵法师同行',
                            nextChapter: 7,
                            effects: { addItem: '魔法书' }
                        },
                        {
                            text: '邀请矮人战士同行',
                            nextChapter: 7,
                            effects: { health: 30 }
                        },
                        {
                            text: '独自行动',
                            nextChapter: 1
                        }
                    ]
                },
                {
                    location: '战斗后的森林',
                    text: '经过激烈的战斗，你击败了哥布林。虽然受了一些伤，但你获得了宝贵的战斗经验。在哥布林的营地里，你发现了一些有用的物品。',
                    choices: [
                        {
                            text: '继续前往龙穴',
                            nextChapter: 8,
                            effects: { addItem: '药水' }
                        }
                    ]
                },
                {
                    location: '森林小径',
                    text: '你成功地绕过了哥布林，虽然消耗了一些体力，但避免了不必要的战斗。前方就是龙穴的入口。',
                    choices: [
                        {
                            text: '进入龙穴',
                            nextChapter: 8
                        }
                    ]
                },
                {
                    location: '装备完毕',
                    text: '购买了装备后，你感到更有信心了。现在是时候前往龙穴，面对最终的挑战。',
                    choices: [
                        {
                            text: '前往龙穴',
                            nextChapter: 8
                        }
                    ]
                },
                {
                    location: '组队出发',
                    text: '有了同伴的帮助，你们一起前往龙穴。团队合作让你们更容易克服路上的障碍。',
                    choices: [
                        {
                            text: '进入龙穴',
                            nextChapter: 8,
                            effects: { health: 10 }
                        }
                    ]
                },
                {
                    location: '龙穴入口',
                    text: '巨大的龙穴入口就在眼前，里面传来低沉的咆哮声。公主的声音从深处传来，她还活着！但是巨龙显然已经发现了你的到来。',
                    ascii: `
    🐉
   😱👸
  ⚔️🛡️
    `,
                    choices: [
                        {
                            text: '勇敢地冲向巨龙',
                            nextChapter: 9,
                            effects: { health: -30 }
                        },
                        {
                            text: '使用策略，寻找巨龙的弱点',
                            nextChapter: 10,
                            effects: { energy: -20 }
                        },
                        {
                            text: '尝试与巨龙谈判',
                            nextChapter: 11,
                            requirements: { item: '魔法书' }
                        }
                    ]
                },
                {
                    location: '激烈战斗',
                    text: '你与巨龙展开了激烈的战斗。虽然受了重伤，但你的勇气感动了巨龙。最终，你们达成了和解。',
                    isEnding: true,
                    ending: {
                        title: '🗡️ 勇者结局',
                        text: '通过勇气和决心，你不仅救出了公主，还与巨龙成为了朋友。村民们为你举办了盛大的庆祝仪式，你成为了传说中的英雄。',
                        type: '英雄结局',
                        ascii: `
    👑
   🎉👸🎉
    🏆
        `
                    }
                },
                {
                    location: '智慧对决',
                    text: '你仔细观察，发现了巨龙的弱点。通过巧妙的战术，你成功击败了巨龙，救出了公主。',
                    isEnding: true,
                    ending: {
                        title: '🧠 智者结局',
                        text: '你用智慧而非蛮力解决了问题。公主对你的聪明才智印象深刻，你们一起回到了村庄，并且你被任命为王国的军师。',
                        type: '智慧结局',
                        ascii: `
    📜
   👸🤝🧙‍♂️
    ⭐
        `
                    }
                },
                {
                    location: '和平谈判',
                    text: '使用魔法书的力量，你与巨龙进行了心灵沟通，了解到它的苦衷，最终通过和平方式解决了冲突。',
                    isEnding: true,
                    ending: {
                        title: '🕊️ 和平结局',
                        text: '你发现巨龙其实是被诅咒的王子，通过魔法解除了诅咒。三人一起回到王国，开创了人类与龙族和平共处的新时代。',
                        type: '完美结局',
                        ascii: `
    🌈
   👸🤝🐲
    🕊️
        `
                    }
                }
            ]
        };
    }
    
    getMysteryStory() {
        return {
            title: '神秘侦探',
            chapters: [
                {
                    location: '古堡大厅',
                    text: '你是一名著名的侦探，被邀请到一座古老的城堡。主人刚刚被发现死在书房里，门从里面锁着。其他客人都有不在场证明，但你知道事情没有表面看起来那么简单...',
                    ascii: `
    🕵️‍♂️
   🔍 💀
    🏰
    `,
                    choices: [
                        {
                            text: '检查犯罪现场',
                            nextChapter: 1,
                            effects: { experience: 10 }
                        },
                        {
                            text: '询问其他客人',
                            nextChapter: 2,
                            effects: { gold: 10 }
                        }
                    ]
                },
                {
                    location: '书房现场',
                    text: '书房里一片凌乱，但你注意到一些奇怪的细节：窗户是开着的，桌上有一杯还温热的茶，书架上有一本书掉在了地上...',
                    choices: [
                        {
                            text: '检查那本掉落的书',
                            nextChapter: 3,
                            effects: { addItem: '线索' }
                        },
                        {
                            text: '检查茶杯',
                            nextChapter: 4,
                            effects: { experience: 15 }
                        }
                    ]
                },
                {
                    location: '客厅调查',
                    text: '你与其他客人交谈，发现每个人都有自己的秘密。管家显得很紧张，女继承人似乎在隐瞒什么，而医生的回答有些前后矛盾...',
                    choices: [
                        {
                            text: '深入调查管家',
                            nextChapter: 5
                        },
                        {
                            text: '质疑女继承人',
                            nextChapter: 6
                        }
                    ]
                },
                {
                    location: '重要发现',
                    text: '这本书是关于毒药的，你在某一页发现了指纹。这个发现可能是解开谜题的关键...',
                    isEnding: true,
                    ending: {
                        title: '🔍 真相大白',
                        text: '通过仔细的调查，你发现了凶手的身份并成功破解了这个看似不可能的密室杀人案。你的名声传遍了整个国家。',
                        type: '侦探结局',
                        ascii: `
    🏆
   🔍👮‍♂️
    ⭐
        `
                    }
                }
            ]
        };
    }
    
    getSpaceStory() {
        return {
            title: '太空漂流',
            chapters: [
                {
                    location: '损坏的飞船',
                    text: '你的宇宙飞船在一次意外中严重损坏，现在漂浮在未知的星系中。氧气还能维持几个小时，你必须找到生存的方法...',
                    ascii: `
    🚀💥
     | 
    🌌⭐
    `,
                    choices: [
                        {
                            text: '尝试修复飞船',
                            nextChapter: 1,
                            effects: { energy: -20 }
                        },
                        {
                            text: '寻找附近的星球',
                            nextChapter: 2,
                            effects: { experience: 10 }
                        }
                    ]
                },
                {
                    location: '修复进行中',
                    text: '你成功修复了部分系统，但燃料不足以返回地球。不过你发现了一个信号，似乎来自附近的空间站...',
                    choices: [
                        {
                            text: '前往空间站',
                            nextChapter: 3,
                            effects: { addItem: '工具' }
                        }
                    ]
                },
                {
                    location: '神秘星球',
                    text: '你发现了一个适合人类居住的星球，但这里似乎有其他智慧生命的迹象...',
                    isEnding: true,
                    ending: {
                        title: '🌍 新世界',
                        text: '你成功在这个新星球上建立了基地，并与当地的外星生命建立了友好关系。你成为了两个文明之间的桥梁。',
                        type: '探索结局',
                        ascii: `
    🌍
   👽🤝👨‍🚀
    🚀
        `
                    }
                },
                {
                    location: '废弃空间站',
                    text: '空间站看起来已经废弃很久了，但里面还有一些有用的设备和足够返回地球的燃料...',
                    isEnding: true,
                    ending: {
                        title: '🏠 回家之路',
                        text: '你成功获得了足够的燃料和补给，安全返回了地球。你的冒险经历成为了太空探索史上的传奇。',
                        type: '归家结局',
                        ascii: `
    🌍
   🚀➡️🏠
    ⭐
        `
                    }
                }
            ]
        };
    }
}

// 全局变量供HTML onclick调用
let textAdventure;

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    textAdventure = new TextAdventure();
});