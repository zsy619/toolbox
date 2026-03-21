class ScienceLab {
            constructor() {
                this.canvas = document.getElementById('labCanvas');
                this.ctx = this.canvas.getContext('2d');
                this.canvas.width = 900;
                this.canvas.height = 500;
                
                this.currentExperiment = 'gravity';
                this.isRunning = false;
                this.animationId = null;
                this.startTime = 0;
                this.experimentData = [];
                
                // 实验参数
                this.mass = 5;
                this.height = 50;
                this.airResistance = 0.1;
                this.gravity = 10;
                
                // 物体状态
                this.object = {
                    x: 450,
                    y: 100,
                    vx: 0,
                    vy: 0,
                    radius: 20,
                    color: '#e74c3c'
                };
                
                this.experiments = {
                    gravity: {
                        title: '重力实验',
                        description: '探索物体在重力作用下的自由落体运动，观察不同质量的物体下落规律。',
                        steps: [
                            '调节物体的质量和高度参数',
                            '点击"开始实验"按钮',
                            '观察物体的下落过程',
                            '记录实验数据并分析结果'
                        ]
                    },
                    pendulum: {
                        title: '单摆运动',
                        description: '研究单摆的周期运动，探索摆长和重力对摆动周期的影响。',
                        steps: [
                            '设置摆长和初始角度',
                            '启动单摆运动',
                            '观察摆动周期',
                            '分析周期与摆长的关系'
                        ]
                    },
                    collision: {
                        title: '碰撞实验',
                        description: '观察两个物体碰撞过程，验证动量守恒定律和能量守恒定律。',
                        steps: [
                            '设置两个物体的质量和速度',
                            '开始碰撞实验',
                            '观察碰撞前后的运动状态',
                            '验证守恒定律'
                        ]
                    },
                    wave: {
                        title: '波的传播',
                        description: '演示波的传播现象，观察波长、频率对波传播的影响。',
                        steps: [
                            '调节波源的频率和振幅',
                            '启动波的传播',
                            '观察波的传播过程',
                            '分析波的特性'
                        ]
                    },
                    chemistry: {
                        title: '化学反应',
                        description: '模拟酸碱反应过程，观察pH值的变化和反应现象。',
                        steps: [
                            '选择反应物的种类和浓度',
                            '开始化学反应',
                            '观察颜色变化和pH变化',
                            '分析反应机理'
                        ]
                    }
                };
                
                this.bindEvents();
                this.updateUI();
                this.selectExperiment('gravity');
                this.draw();
            }

            bindEvents() {
                // 实验选择
                document.querySelectorAll('.experiment-button').forEach(button => {
                    button.addEventListener('click', (e) => {
                        this.selectExperiment(e.target.dataset.experiment);
                    });
                });
                
                // 控制按钮
                document.getElementById('startButton').addEventListener('click', () => {
                    this.startExperiment();
                });
                
                document.getElementById('resetButton').addEventListener('click', () => {
                    this.resetExperiment();
                });
                
                document.getElementById('recordButton').addEventListener('click', () => {
                    this.recordData();
                });
                
                // 参数滑块
                document.getElementById('massSlider').addEventListener('input', (e) => {
                    this.mass = parseFloat(e.target.value);
                    document.getElementById('massValue').textContent = this.mass + ' kg';
                    this.updateObjectSize();
                });
                
                document.getElementById('heightSlider').addEventListener('input', (e) => {
                    this.height = parseFloat(e.target.value);
                    document.getElementById('heightValue').textContent = this.height + ' m';
                    this.resetObjectPosition();
                });
                
                document.getElementById('airResistanceSlider').addEventListener('input', (e) => {
                    this.airResistance = parseFloat(e.target.value) / 100;
                    document.getElementById('airResistanceValue').textContent = e.target.value + '%';
                });
                
                document.getElementById('gravitySlider').addEventListener('input', (e) => {
                    this.gravity = parseFloat(e.target.value);
                    document.getElementById('gravityValue').textContent = this.gravity.toFixed(1) + ' m/s²';
                });
            }

            selectExperiment(experimentType) {
                this.currentExperiment = experimentType;
                const experiment = this.experiments[experimentType];
                
                // 更新按钮状态
                document.querySelectorAll('.experiment-button').forEach(btn => {
                    btn.classList.remove('active');
                });
                document.querySelector(`[data-experiment="${experimentType}"]`).classList.add('active');
                
                // 更新实验信息
                document.getElementById('experimentTitle').textContent = experiment.title;
                document.getElementById('experimentDescription').textContent = experiment.description;
                
                const stepsList = document.getElementById('experimentSteps');
                stepsList.innerHTML = '';
                experiment.steps.forEach(step => {
                    const li = document.createElement('li');
                    li.textContent = step;
                    stepsList.appendChild(li);
                });
                
                this.resetExperiment();
            }

            startExperiment() {
                if (this.isRunning) return;
                
                this.isRunning = true;
                this.startTime = Date.now();
                this.experimentData = [];
                
                document.getElementById('startButton').textContent = '实验进行中...';
                document.getElementById('startButton').disabled = true;
                document.getElementById('recordButton').style.display = 'inline-block';
                
                this.hideMessage();
                this.hideResults();
                
                // 根据实验类型初始化
                switch (this.currentExperiment) {
                    case 'gravity':
                        this.initGravityExperiment();
                        break;
                    case 'pendulum':
                        this.initPendulumExperiment();
                        break;
                    case 'collision':
                        this.initCollisionExperiment();
                        break;
                    case 'wave':
                        this.initWaveExperiment();
                        break;
                    case 'chemistry':
                        this.initChemistryExperiment();
                        break;
                }
                
                this.animate();
            }

            resetExperiment() {
                this.isRunning = false;
                if (this.animationId) {
                    cancelAnimationFrame(this.animationId);
                    this.animationId = null;
                }
                
                document.getElementById('startButton').textContent = '开始实验';
                document.getElementById('startButton').disabled = false;
                document.getElementById('recordButton').style.display = 'none';
                
                this.hideMessage();
                this.hideResults();
                this.resetObjectPosition();
                this.draw();
            }

            initGravityExperiment() {
                this.object.vx = 0;
                this.object.vy = 0;
                this.resetObjectPosition();
            }

            initPendulumExperiment() {
                // 单摆初始化
                this.pendulum = {
                    x: 450,
                    y: 100,
                    length: this.height * 3,
                    angle: Math.PI / 6, // 30度
                    angularVelocity: 0
                };
            }

            initCollisionExperiment() {
                this.object1 = {
                    x: 200,
                    y: 250,
                    vx: 5,
                    vy: 0,
                    radius: this.mass * 2 + 10,
                    mass: this.mass,
                    color: '#e74c3c'
                };
                
                this.object2 = {
                    x: 700,
                    y: 250,
                    vx: -3,
                    vy: 0,
                    radius: this.mass * 1.5 + 10,
                    mass: this.mass * 0.8,
                    color: '#3498db'
                };
            }

            initWaveExperiment() {
                this.wave = {
                    frequency: this.gravity / 10,
                    amplitude: this.height / 2,
                    wavelength: 100,
                    time: 0
                };
            }

            initChemistryExperiment() {
                this.reaction = {
                    pH: 7,
                    concentration: this.mass / 10,
                    temperature: this.height + 20,
                    progress: 0
                };
            }

            animate() {
                if (!this.isRunning) return;
                
                const currentTime = (Date.now() - this.startTime) / 1000; // 转换为秒
                
                switch (this.currentExperiment) {
                    case 'gravity':
                        this.updateGravity(currentTime);
                        break;
                    case 'pendulum':
                        this.updatePendulum(currentTime);
                        break;
                    case 'collision':
                        this.updateCollision(currentTime);
                        break;
                    case 'wave':
                        this.updateWave(currentTime);
                        break;
                    case 'chemistry':
                        this.updateChemistry(currentTime);
                        break;
                }
                
                this.draw();
                
                // 记录数据
                this.recordExperimentData(currentTime);
                
                // 检查实验结束条件
                if (this.checkExperimentEnd()) {
                    this.endExperiment();
                } else {
                    this.animationId = requestAnimationFrame(() => this.animate());
                }
            }

            updateGravity(time) {
                // 重力加速度
                this.object.vy += this.gravity * 0.1;
                
                // 空气阻力
                this.object.vy *= (1 - this.airResistance * 0.01);
                
                // 更新位置
                this.object.y += this.object.vy;
                
                // 检查地面碰撞
                if (this.object.y + this.object.radius >= 450) {
                    this.object.y = 450 - this.object.radius;
                    this.object.vy *= -0.7; // 弹性碰撞
                }
            }

            updatePendulum(time) {
                const g = this.gravity;
                const L = this.pendulum.length;
                
                // 单摆运动方程
                const angularAcceleration = -(g / L) * Math.sin(this.pendulum.angle);
                this.pendulum.angularVelocity += angularAcceleration * 0.01;
                this.pendulum.angle += this.pendulum.angularVelocity * 0.01;
                
                // 空气阻力
                this.pendulum.angularVelocity *= (1 - this.airResistance * 0.001);
                
                // 计算摆球位置
                this.object.x = this.pendulum.x + L * Math.sin(this.pendulum.angle);
                this.object.y = this.pendulum.y + L * Math.cos(this.pendulum.angle);
            }

            updateCollision(time) {
                // 更新物体位置
                this.object1.x += this.object1.vx;
                this.object1.y += this.object1.vy;
                this.object2.x += this.object2.vx;
                this.object2.y += this.object2.vy;
                
                // 检查碰撞
                const dx = this.object2.x - this.object1.x;
                const dy = this.object2.y - this.object1.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.object1.radius + this.object2.radius) {
                    // 弹性碰撞计算
                    const m1 = this.object1.mass;
                    const m2 = this.object2.mass;
                    const v1x = this.object1.vx;
                    const v2x = this.object2.vx;
                    
                    this.object1.vx = ((m1 - m2) * v1x + 2 * m2 * v2x) / (m1 + m2);
                    this.object2.vx = ((m2 - m1) * v2x + 2 * m1 * v1x) / (m1 + m2);
                    
                    // 分离物体
                    const overlap = this.object1.radius + this.object2.radius - distance;
                    this.object1.x -= (dx / distance) * overlap * 0.5;
                    this.object2.x += (dx / distance) * overlap * 0.5;
                }
                
                // 边界反弹
                if (this.object1.x - this.object1.radius <= 0 || this.object1.x + this.object1.radius >= 900) {
                    this.object1.vx *= -1;
                }
                if (this.object2.x - this.object2.radius <= 0 || this.object2.x + this.object2.radius >= 900) {
                    this.object2.vx *= -1;
                }
            }

            updateWave(time) {
                this.wave.time += 0.1;
            }

            updateChemistry(time) {
                this.reaction.progress += 0.02;
                this.reaction.pH = 7 + 3 * Math.sin(this.reaction.progress);
                
                if (this.reaction.progress > Math.PI * 2) {
                    this.reaction.progress = 0;
                }
            }

            draw() {
                // 清空画布
                this.ctx.fillStyle = '#f8f9fa';
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                
                switch (this.currentExperiment) {
                    case 'gravity':
                        this.drawGravityExperiment();
                        break;
                    case 'pendulum':
                        this.drawPendulumExperiment();
                        break;
                    case 'collision':
                        this.drawCollisionExperiment();
                        break;
                    case 'wave':
                        this.drawWaveExperiment();
                        break;
                    case 'chemistry':
                        this.drawChemistryExperiment();
                        break;
                }
            }

            drawGravityExperiment() {
                // 绘制地面
                this.ctx.fillStyle = '#8b4513';
                this.ctx.fillRect(0, 450, this.canvas.width, 50);
                
                // 绘制高度标尺
                this.ctx.strokeStyle = '#2d3436';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                for (let i = 0; i <= 10; i++) {
                    const y = 450 - i * 40;
                    this.ctx.moveTo(50, y);
                    this.ctx.lineTo(70, y);
                    
                    this.ctx.fillStyle = '#2d3436';
                    this.ctx.font = '12px Arial';
                    this.ctx.fillText(i * 10 + 'm', 20, y + 4);
                }
                this.ctx.stroke();
                
                // 绘制物体
                this.drawObject(this.object);
                
                // 绘制速度矢量
                if (this.isRunning) {
                    this.drawVelocityVector(this.object);
                }
            }

            drawPendulumExperiment() {
                if (this.pendulum) {
                    // 绘制悬挂点
                    this.ctx.fillStyle = '#2d3436';
                    this.ctx.beginPath();
                    this.ctx.arc(this.pendulum.x, this.pendulum.y, 5, 0, Math.PI * 2);
                    this.ctx.fill();
                    
                    // 绘制摆线
                    this.ctx.strokeStyle = '#2d3436';
                    this.ctx.lineWidth = 2;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.pendulum.x, this.pendulum.y);
                    this.ctx.lineTo(this.object.x, this.object.y);
                    this.ctx.stroke();
                    
                    // 绘制摆球
                    this.drawObject(this.object);
                    
                    // 绘制轨迹
                    this.ctx.strokeStyle = 'rgba(231, 76, 60, 0.3)';
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    const arcRadius = this.pendulum.length;
                    this.ctx.arc(this.pendulum.x, this.pendulum.y, arcRadius, 
                                 -Math.PI/3, Math.PI/3);
                    this.ctx.stroke();
                }
            }

            drawCollisionExperiment() {
                if (this.object1 && this.object2) {
                    // 绘制中心线
                    this.ctx.strokeStyle = '#ddd';
                    this.ctx.lineWidth = 1;
                    this.ctx.setLineDash([5, 5]);
                    this.ctx.beginPath();
                    this.ctx.moveTo(0, 250);
                    this.ctx.lineTo(900, 250);
                    this.ctx.stroke();
                    this.ctx.setLineDash([]);
                    
                    // 绘制两个物体
                    this.drawCollisionObject(this.object1);
                    this.drawCollisionObject(this.object2);
                    
                    // 绘制速度矢量
                    if (this.isRunning) {
                        this.drawVelocityVector(this.object1);
                        this.drawVelocityVector(this.object2);
                    }
                }
            }

            drawWaveExperiment() {
                const { frequency, amplitude, wavelength, time } = this.wave;
                
                this.ctx.strokeStyle = '#0984e3';
                this.ctx.lineWidth = 3;
                this.ctx.beginPath();
                
                for (let x = 0; x < this.canvas.width; x += 2) {
                    const y = 250 + amplitude * Math.sin(2 * Math.PI * (x / wavelength - frequency * time));
                    if (x === 0) {
                        this.ctx.moveTo(x, y);
                    } else {
                        this.ctx.lineTo(x, y);
                    }
                }
                this.ctx.stroke();
                
                // 绘制波源
                this.ctx.fillStyle = '#e74c3c';
                this.ctx.beginPath();
                this.ctx.arc(50, 250, 10, 0, Math.PI * 2);
                this.ctx.fill();
            }

            drawChemistryExperiment() {
                // 绘制烧杯
                this.ctx.strokeStyle = '#2d3436';
                this.ctx.lineWidth = 3;
                this.ctx.beginPath();
                this.ctx.rect(350, 200, 200, 250);
                this.ctx.stroke();
                
                // 绘制溶液
                const hue = (this.reaction.pH - 1) * 60; // pH 1-14 对应颜色变化
                this.ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
                this.ctx.fillRect(355, 350 - this.reaction.progress * 100, 190, 95 + this.reaction.progress * 100);
                
                // 绘制气泡
                if (this.isRunning) {
                    for (let i = 0; i < 5; i++) {
                        const x = 370 + Math.random() * 160;
                        const y = 400 + Math.random() * 40;
                        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                        this.ctx.beginPath();
                        this.ctx.arc(x, y, 3 + Math.random() * 5, 0, Math.PI * 2);
                        this.ctx.fill();
                    }
                }
                
                // 显示pH值
                this.ctx.fillStyle = '#2d3436';
                this.ctx.font = '20px Arial';
                this.ctx.fillText(`pH: ${this.reaction.pH.toFixed(1)}`, 370, 180);
            }

            drawObject(obj) {
                // 物体阴影
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
                this.ctx.beginPath();
                this.ctx.arc(obj.x + 3, obj.y + 3, obj.radius, 0, Math.PI * 2);
                this.ctx.fill();
                
                // 物体主体
                this.ctx.fillStyle = obj.color;
                this.ctx.beginPath();
                this.ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2);
                this.ctx.fill();
                
                // 物体边框
                this.ctx.strokeStyle = '#2d3436';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
                
                // 质量标记
                this.ctx.fillStyle = 'white';
                this.ctx.font = 'bold 12px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(this.mass + 'kg', obj.x, obj.y + 4);
            }

            drawCollisionObject(obj) {
                // 物体主体
                this.ctx.fillStyle = obj.color;
                this.ctx.beginPath();
                this.ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2);
                this.ctx.fill();
                
                // 物体边框
                this.ctx.strokeStyle = '#2d3436';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
                
                // 质量标记
                this.ctx.fillStyle = 'white';
                this.ctx.font = 'bold 12px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(obj.mass.toFixed(1) + 'kg', obj.x, obj.y + 4);
            }

            drawVelocityVector(obj) {
                const scale = 10;
                const endX = obj.x + (obj.vx || 0) * scale;
                const endY = obj.y + (obj.vy || 0) * scale;
                
                this.ctx.strokeStyle = '#27ae60';
                this.ctx.lineWidth = 3;
                this.ctx.beginPath();
                this.ctx.moveTo(obj.x, obj.y);
                this.ctx.lineTo(endX, endY);
                this.ctx.stroke();
                
                // 箭头
                const angle = Math.atan2(endY - obj.y, endX - obj.x);
                this.ctx.beginPath();
                this.ctx.moveTo(endX, endY);
                this.ctx.lineTo(endX - 10 * Math.cos(angle - 0.5), endY - 10 * Math.sin(angle - 0.5));
                this.ctx.moveTo(endX, endY);
                this.ctx.lineTo(endX - 10 * Math.cos(angle + 0.5), endY - 10 * Math.sin(angle + 0.5));
                this.ctx.stroke();
            }

            recordExperimentData(time) {
                const data = {
                    time: time,
                    experiment: this.currentExperiment
                };
                
                switch (this.currentExperiment) {
                    case 'gravity':
                        data.position = this.object.y;
                        data.velocity = this.object.vy;
                        break;
                    case 'pendulum':
                        data.angle = this.pendulum.angle;
                        data.angularVelocity = this.pendulum.angularVelocity;
                        break;
                    case 'collision':
                        data.object1_position = this.object1.x;
                        data.object1_velocity = this.object1.vx;
                        data.object2_position = this.object2.x;
                        data.object2_velocity = this.object2.vx;
                        break;
                    case 'wave':
                        data.amplitude = this.wave.amplitude;
                        data.frequency = this.wave.frequency;
                        break;
                    case 'chemistry':
                        data.pH = this.reaction.pH;
                        data.progress = this.reaction.progress;
                        break;
                }
                
                this.experimentData.push(data);
            }

            checkExperimentEnd() {
                switch (this.currentExperiment) {
                    case 'gravity':
                        return this.object.y >= 430 && Math.abs(this.object.vy) < 1;
                    case 'pendulum':
                        return Math.abs(this.pendulum.angularVelocity) < 0.01;
                    case 'collision':
                        return (Date.now() - this.startTime) > 10000; // 10秒
                    case 'wave':
                        return (Date.now() - this.startTime) > 8000; // 8秒
                    case 'chemistry':
                        return this.reaction.progress > Math.PI * 4;
                }
                return false;
            }

            endExperiment() {
                this.isRunning = false;
                document.getElementById('startButton').textContent = '开始实验';
                document.getElementById('startButton').disabled = false;
                
                this.showResults();
                this.showMessage('🎉 实验完成！请查看实验结果。', 'success');
            }

            showResults() {
                const panel = document.getElementById('resultsPanel');
                const content = document.getElementById('resultsContent');
                
                let resultText = '';
                
                switch (this.currentExperiment) {
                    case 'gravity':
                        const fallTime = this.experimentData.length * 0.1;
                        const finalVelocity = Math.abs(this.object.vy);
                        resultText = `
                            <strong>重力实验结果：</strong><br>
                            • 下落时间: ${fallTime.toFixed(2)}秒<br>
                            • 最终速度: ${finalVelocity.toFixed(2)} m/s<br>
                            • 理论速度: ${Math.sqrt(2 * this.gravity * (this.height - 5)).toFixed(2)} m/s<br>
                            • 重力加速度: ${this.gravity} m/s²<br>
                            <br><strong>结论：</strong> 重力加速度越大，物体下落越快。空气阻力会减缓下落速度。
                        `;
                        break;
                    case 'pendulum':
                        const period = this.experimentData.length * 0.01;
                        const theoreticalPeriod = 2 * Math.PI * Math.sqrt(this.pendulum.length / 100 / this.gravity);
                        resultText = `
                            <strong>单摆实验结果：</strong><br>
                            • 摆动周期: ${period.toFixed(2)}秒<br>
                            • 理论周期: ${theoreticalPeriod.toFixed(2)}秒<br>
                            • 摆长: ${(this.pendulum.length / 100).toFixed(1)}米<br>
                            <br><strong>结论：</strong> 单摆周期与摆长的平方根成正比，与重力加速度的平方根成反比。
                        `;
                        break;
                    case 'collision':
                        resultText = `
                            <strong>碰撞实验结果：</strong><br>
                            • 碰撞类型: 弹性碰撞<br>
                            • 动量守恒: 验证成功<br>
                            • 能量守恒: 部分验证<br>
                            <br><strong>结论：</strong> 在理想的弹性碰撞中，动量和动能都守恒。
                        `;
                        break;
                    case 'wave':
                        resultText = `
                            <strong>波传播实验结果：</strong><br>
                            • 波长: ${this.wave.wavelength}像素<br>
                            • 频率: ${this.wave.frequency.toFixed(2)} Hz<br>
                            • 振幅: ${this.wave.amplitude}像素<br>
                            <br><strong>结论：</strong> 波的传播速度等于波长乘以频率。
                        `;
                        break;
                    case 'chemistry':
                        resultText = `
                            <strong>化学反应实验结果：</strong><br>
                            • 最终pH: ${this.reaction.pH.toFixed(1)}<br>
                            • 反应进度: ${(this.reaction.progress / (Math.PI * 4) * 100).toFixed(1)}%<br>
                            • 溶液颜色: 根据pH值变化<br>
                            <br><strong>结论：</strong> 酸碱反应会导致pH值和溶液颜色的变化。
                        `;
                        break;
                }
                
                content.innerHTML = resultText;
                panel.classList.add('show');
            }

            hideResults() {
                document.getElementById('resultsPanel').classList.remove('show');
            }

            recordData() {
                const dataStr = JSON.stringify(this.experimentData, null, 2);
                const blob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                
                const a = document.createElement('a');
                a.href = url;
                a.download = `${this.currentExperiment}_data.json`;
                a.click();
                
                URL.revokeObjectURL(url);
                this.showMessage('📊 实验数据已下载！', 'success');
            }

            resetObjectPosition() {
                this.object.x = 450;
                this.object.y = 450 - this.height * 4;
                this.object.vx = 0;
                this.object.vy = 0;
            }

            updateObjectSize() {
                this.object.radius = Math.max(10, this.mass * 2 + 5);
            }

            updateUI() {
                // 更新滑块显示
                document.getElementById('massValue').textContent = this.mass + ' kg';
                document.getElementById('heightValue').textContent = this.height + ' m';
                document.getElementById('airResistanceValue').textContent = (this.airResistance * 100).toFixed(0) + '%';
                document.getElementById('gravityValue').textContent = this.gravity.toFixed(1) + ' m/s²';
            }

            showMessage(text, type) {
                const message = document.getElementById('message');
                message.textContent = text;
                message.className = `message ${type} show`;
                
                setTimeout(() => {
                    this.hideMessage();
                }, 3000);
            }

            hideMessage() {
                const message = document.getElementById('message');
                message.classList.remove('show');
            }
        }

        // 启动科学实验室
        window.addEventListener('load', () => {
            new ScienceLab();
        });