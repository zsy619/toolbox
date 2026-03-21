class TimeManagementGame {
    constructor() {
        this.player = {
            efficiency: 0,
            completedTasks: 0,
            streak: 0,
            level: 1,
            exp: 0
        };

        this.gameTime = {
            hour: 9,
            minute: 0,
            day: 1,
            isPaused: false,
            speed: 1
        };

        this.energy = {
            physical: 100,
            mental: 100,
            emotional: 100
        };

        this.schedule = Array(24).fill(null).map((_, i) => ({
            hour: i,
            activity: null,
            completed: false
        }));

        this.tasks = [];
        this.timeSpent = {
            work: 0,
            study: 0,
            rest: 0,
            exercise: 0
        };

        this.activities = {
            work: [
                { name: '处理邮件', duration: 1, energy: { mental: -10, emotional: -5 }, efficiency: 15 },
                { name: '开会讨论', duration: 2, energy: { mental: -15, emotional: -10 }, efficiency: 20 },
                { name: '项目开发', duration: 3, energy: { mental: -25, physical: -10 }, efficiency: 30 },
                { name: '文档编写', duration: 2, energy: { mental: -20, emotional: -5 }, efficiency: 25 },
                { name: '客户沟通', duration: 1, energy: { mental: -10, emotional: -15 }, efficiency: 20 }
            ],
            study: [
                { name: '阅读学习', duration: 2, energy: { mental: -15, physical: -5 }, efficiency: 25 },
                { name: '在线课程', duration: 3, energy: { mental: -20, physical: -10 }, efficiency: 30 },
                { name: '练习题目', duration: 1, energy: { mental: -10 }, efficiency: 15 },
                { name: '技能训练', duration: 2, energy: { mental: -15, physical: -10 }, efficiency: 20 },
                { name: '知识复习', duration: 1, energy: { mental: -8 }, efficiency: 12 }
            ],
            rest: [
                { name: '短暂休息', duration: 1, energy: { physical: 15, mental: 10, emotional: 10 }, efficiency: 5 },
                { name: '午睡', duration: 2, energy: { physical: 30, mental: 20, emotional: 15 }, efficiency: 10 },
                { name: '冥想放松', duration: 1, energy: { mental: 20, emotional: 25 }, efficiency: 8 },
                { name: '听音乐', duration: 1, energy: { emotional: 20, mental: 10 }, efficiency: 5 },
                { name: '散步', duration: 1, energy: { physical: 10, emotional: 15 }, efficiency: 8 }
            ],
            exercise: [
                { name: '晨跑', duration: 1, energy: { physical: -20, mental: 10, emotional: 15 }, efficiency: 20 },
                { name: '健身训练', duration: 2, energy: { physical: -30, mental: 5, emotional: 10 }, efficiency: 25 },
                { name: '瑜伽', duration: 1, energy: { physical: -10, mental: 15, emotional: 20 }, efficiency: 15 },
                { name: '游泳', duration: 2, energy: { physical: -25, mental: 10, emotional: 15 }, efficiency: 22 },
                { name: '拉伸运动', duration: 1, energy: { physical: -5, mental: 5, emotional: 10 }, efficiency: 10 }
            ]
        };

        this.tips = [
            '番茄工作法：25分钟专注工作，5分钟休息',
            '早晨是大脑最活跃的时间，适合处理重要任务',
            '适当的运动可以提高工作效率和创造力',
            '保持充足的睡眠对提高效率至关重要',
            '学会说"不"，专注于最重要的任务',
            '定期休息可以防止疲劳，保持高效率',
            '制定明确的目标和优先级',
            '避免多任务处理，一次专注一件事',
            '创造一个无干扰的工作环境',
            '奖励自己完成的任务，保持动力'
        ];

        this.currentTip = 0;
        this.selectedActivity = null;

        this.initializeGame();
        this.bindEvents();
        this.startGameLoop();
    }

    initializeGame() {
        this.createScheduleGrid();
        this.createActivityLibrary('work');
        this.updateDisplay();
        this.showTip();
    }

    bindEvents() {
        // 时间控制按钮
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('speedBtn').addEventListener('click', () => this.changeSpeed());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetDay());

        // 任务管理
        document.getElementById('addTaskBtn').addEventListener('click', () => this.addTask());
        document.getElementById('taskInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        // 活动分类
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectCategory(btn.dataset.category);
            });
        });

        // 提示按钮
        document.getElementById('nextTipBtn').addEventListener('click', () => this.nextTip());
    }

    createScheduleGrid() {
        const scheduleGrid = document.getElementById('scheduleGrid');
        scheduleGrid.innerHTML = '';

        for (let hour = 0; hour < 24; hour++) {
            const timeSlot = document.createElement('div');
            timeSlot.className = 'time-slot';
            timeSlot.dataset.hour = hour;

            const timeLabel = document.createElement('div');
            timeLabel.className = 'slot-time';
            timeLabel.textContent = this.formatTime(hour, 0);

            const activityLabel = document.createElement('div');
            activityLabel.className = 'slot-activity';
            activityLabel.textContent = this.schedule[hour].activity ? this.schedule[hour].activity.name : '空闲时间';

            timeSlot.appendChild(timeLabel);
            timeSlot.appendChild(activityLabel);

            timeSlot.addEventListener('click', () => this.selectTimeSlot(hour));

            scheduleGrid.appendChild(timeSlot);
        }
    }

    selectTimeSlot(hour) {
        if (this.selectedActivity) {
            this.scheduleActivity(hour, this.selectedActivity);
            this.selectedActivity = null;
            document.querySelectorAll('.activity-item').forEach(item => {
                item.classList.remove('selected');
            });
        }
    }

    scheduleActivity(hour, activity) {
        // 检查时间冲突
        for (let i = 0; i < activity.duration; i++) {
            if (hour + i >= 24) {
                alert('活动时间超出当天范围！');
                return;
            }
            if (this.schedule[hour + i].activity) {
                alert('时间冲突！请选择其他时间段');
                return;
            }
        }

        // 安排活动
        for (let i = 0; i < activity.duration; i++) {
            this.schedule[hour + i].activity = {
                ...activity,
                isMain: i === 0
            };
        }

        this.updateScheduleDisplay();
    }

    updateScheduleDisplay() {
        const timeSlots = document.querySelectorAll('.time-slot');

        timeSlots.forEach((slot, hour) => {
            const activityLabel = slot.querySelector('.slot-activity');
            const scheduleItem = this.schedule[hour];

            slot.className = 'time-slot';

            if (scheduleItem.activity) {
                slot.classList.add('occupied');
                activityLabel.textContent = scheduleItem.activity.name;
            } else {
                activityLabel.textContent = '空闲时间';
            }

            if (hour === this.gameTime.hour) {
                slot.classList.add('current');
            }

            if (scheduleItem.completed) {
                slot.classList.add('completed');
            }
        });
    }

    createActivityLibrary(category) {
        const activityList = document.getElementById('activityList');
        activityList.innerHTML = '';

        this.activities[category].forEach(activity => {
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item';

            const activityInfo = document.createElement('div');
            activityInfo.className = 'activity-info';

            const activityName = document.createElement('div');
            activityName.className = 'activity-name';
            activityName.textContent = activity.name;

            const activityDuration = document.createElement('div');
            activityDuration.className = 'activity-duration';
            activityDuration.textContent = `${activity.duration}小时`;

            const activityEnergy = document.createElement('div');
            activityEnergy.className = 'activity-energy';
            activityEnergy.textContent = this.getEnergyDescription(activity.energy);

            activityInfo.appendChild(activityName);
            activityInfo.appendChild(activityDuration);
            activityInfo.appendChild(activityEnergy);

            activityItem.appendChild(activityInfo);

            activityItem.addEventListener('click', () => {
                document.querySelectorAll('.activity-item').forEach(item => {
                    item.classList.remove('selected');
                });
                activityItem.classList.add('selected');
                this.selectedActivity = { ...activity, category };
            });

            activityList.appendChild(activityItem);
        });
    }

    getEnergyDescription(energy) {
        const parts = [];
        if (energy.physical) parts.push(`体力${energy.physical > 0 ? '+' : ''}${energy.physical}`);
        if (energy.mental) parts.push(`脑力${energy.mental > 0 ? '+' : ''}${energy.mental}`);
        if (energy.emotional) parts.push(`情绪${energy.emotional > 0 ? '+' : ''}${energy.emotional}`);
        return parts.join(', ');
    }

    selectCategory(category) {
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');
        this.createActivityLibrary(category);
    }

    addTask() {
        const taskInput = document.getElementById('taskInput');
        const taskPriority = document.getElementById('taskPriority');

        if (taskInput.value.trim()) {
            const task = {
                id: Date.now(),
                text: taskInput.value.trim(),
                priority: taskPriority.value,
                completed: false,
                createdAt: Date.now()
            };

            this.tasks.push(task);
            taskInput.value = '';
            this.updateTaskList();
        }
    }

    updateTaskList() {
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = '';

        // 按优先级排序
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        const sortedTasks = this.tasks.sort((a, b) => {
            if (a.completed !== b.completed) return a.completed - b.completed;
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });

        sortedTasks.forEach(task => {
            const taskItem = document.createElement('div');
            taskItem.className = `task-item ${task.priority} ${task.completed ? 'completed' : ''}`;

            const taskContent = document.createElement('div');
            taskContent.className = 'task-content';
            taskContent.textContent = task.text;

            const taskActions = document.createElement('div');
            taskActions.className = 'task-actions';

            if (!task.completed) {
                const completeBtn = document.createElement('button');
                completeBtn.className = 'task-btn complete-btn';
                completeBtn.textContent = '✓';
                completeBtn.addEventListener('click', () => this.completeTask(task.id));
                taskActions.appendChild(completeBtn);
            }

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'task-btn delete-btn';
            deleteBtn.textContent = '✗';
            deleteBtn.addEventListener('click', () => this.deleteTask(task.id));
            taskActions.appendChild(deleteBtn);

            taskItem.appendChild(taskContent);
            taskItem.appendChild(taskActions);
            taskList.appendChild(taskItem);
        });
    }

    completeTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = true;
            this.player.completedTasks++;
            this.player.efficiency += this.getTaskEfficiencyBonus(task.priority);
            this.updateTaskList();
            this.updateDisplay();
        }
    }

    deleteTask(taskId) {
        this.tasks = this.tasks.filter(t => t.id !== taskId);
        this.updateTaskList();
    }

    getTaskEfficiencyBonus(priority) {
        const bonuses = { urgent: 20, high: 15, medium: 10, low: 5 };
        return bonuses[priority] || 5;
    }

    togglePause() {
        this.gameTime.isPaused = !this.gameTime.isPaused;
        const pauseBtn = document.getElementById('pauseBtn');
        pauseBtn.textContent = this.gameTime.isPaused ? '▶️ 继续' : '⏸️ 暂停';
    }

    changeSpeed() {
        this.gameTime.speed = this.gameTime.speed === 1 ? 2 : this.gameTime.speed === 2 ? 4 : 1;
        const speedBtn = document.getElementById('speedBtn');
        const speedText = { 1: '⏩ 加速', 2: '⏩⏩ 快速', 4: '⏩ 正常' };
        speedBtn.textContent = speedText[this.gameTime.speed];
    }

    resetDay() {
        if (confirm('确定要重置今天的安排吗？')) {
            this.gameTime.hour = 9;
            this.gameTime.minute = 0;
            this.schedule.forEach(slot => {
                slot.activity = null;
                slot.completed = false;
            });
            this.energy = { physical: 100, mental: 100, emotional: 100 };
            this.timeSpent = { work: 0, study: 0, rest: 0, exercise: 0 };
            this.updateScheduleDisplay();
            this.updateDisplay();
        }
    }

    processCurrentHour() {
        const currentSlot = this.schedule[this.gameTime.hour];

        if (currentSlot.activity && !currentSlot.completed && currentSlot.activity.isMain) {
            const activity = currentSlot.activity;

            // 应用能量变化
            Object.keys(activity.energy).forEach(type => {
                this.energy[type] = Math.max(0, Math.min(100, this.energy[type] + activity.energy[type]));
            });

            // 增加效率值
            this.player.efficiency += activity.efficiency;

            // 记录时间消耗
            this.timeSpent[activity.category] += 1;

            // 标记为完成
            for (let i = 0; i < activity.duration; i++) {
                if (this.gameTime.hour + i < 24) {
                    this.schedule[this.gameTime.hour + i].completed = true;
                }
            }
        }
    }

    checkLevelUp() {
        const requiredExp = this.player.level * 100;
        if (this.player.efficiency >= requiredExp) {
            this.player.level++;
            this.player.streak++;
            alert(`恭喜升级！现在是${this.player.level}级时间管理大师！`);
        }
    }

    showTip() {
        document.getElementById('tipContent').textContent = this.tips[this.currentTip];
    }

    nextTip() {
        this.currentTip = (this.currentTip + 1) % this.tips.length;
        this.showTip();
    }

    formatTime(hour, minute) {
        return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    }

    updateDisplay() {
        // 更新统计数据
        document.getElementById('efficiency').textContent = Math.floor(this.player.efficiency);
        document.getElementById('completedTasks').textContent = this.player.completedTasks;
        document.getElementById('streak').textContent = this.player.streak;
        document.getElementById('level').textContent = this.player.level;

        // 更新时间显示
        document.getElementById('currentTime').textContent = this.formatTime(this.gameTime.hour, this.gameTime.minute);
        document.getElementById('currentDate').textContent = `第${this.gameTime.day}天`;

        // 更新能量条
        Object.keys(this.energy).forEach(type => {
            const energyFill = document.getElementById(`${type}Energy`);
            const energyValue = document.getElementById(`${type}Value`);
            energyFill.style.width = this.energy[type] + '%';
            energyValue.textContent = Math.floor(this.energy[type]);
        });

        // 更新进度条
        const maxTime = 8; // 假设每类活动最多8小时
        Object.keys(this.timeSpent).forEach(type => {
            const progressFill = document.getElementById(`${type}Progress`);
            const timeValue = document.getElementById(`${type}Time`);
            const percentage = (this.timeSpent[type] / maxTime) * 100;
            progressFill.style.width = Math.min(percentage, 100) + '%';
            timeValue.textContent = this.timeSpent[type] + 'h';
        });

        this.updateScheduleDisplay();
    }

    startGameLoop() {
        setInterval(() => {
            if (!this.gameTime.isPaused) {
                this.gameTime.minute += this.gameTime.speed;

                if (this.gameTime.minute >= 60) {
                    this.gameTime.minute = 0;
                    this.processCurrentHour();
                    this.gameTime.hour++;

                    if (this.gameTime.hour >= 24) {
                        this.gameTime.hour = 0;
                        this.gameTime.day++;
                        this.checkLevelUp();
                    }
                }

                this.updateDisplay();
            }
        }, 100);

        // 自动保存
        setInterval(() => {
            this.autoSave();
        }, 30000);
    }

    autoSave() {
        const gameState = {
            player: this.player,
            gameTime: this.gameTime,
            energy: this.energy,
            schedule: this.schedule,
            tasks: this.tasks,
            timeSpent: this.timeSpent
        };
        localStorage.setItem('timeManagementGame', JSON.stringify(gameState));
    }

    loadGame() {
        const savedGame = localStorage.getItem('timeManagementGame');
        if (savedGame) {
            const gameState = JSON.parse(savedGame);
            this.player = gameState.player || this.player;
            this.gameTime = gameState.gameTime || this.gameTime;
            this.energy = gameState.energy || this.energy;
            this.schedule = gameState.schedule || this.schedule;
            this.tasks = gameState.tasks || this.tasks;
            this.timeSpent = gameState.timeSpent || this.timeSpent;

            this.updateTaskList();
            this.updateDisplay();
        }
    }
}

// 启动游戏
document.addEventListener('DOMContentLoaded', () => {
    const game = new TimeManagementGame();
    game.loadGame();
});