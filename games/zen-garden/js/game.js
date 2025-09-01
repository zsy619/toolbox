class ZenGarden {
            constructor() {
                this.canvas = document.getElementById('gardenCanvas');
                this.ctx = this.canvas.getContext('2d');
                
                // 当前工具和设置
                this.currentTool = 'rake';
                this.currentPattern = 'circles';
                this.brushSize = 15;
                this.opacity = 0.8;
                this.animSpeed = 1;
                
                // 绘制状态
                this.isDrawing = false;
                this.lastX = 0;
                this.lastY = 0;
                
                // 花园元素
                this.elements = [];
                this.sandTextures = [];
                
                // 禅语库
                this.zenQuotes = [
                    "静观万物，心如止水",
                    "一花一世界，一叶一如来",
                    "心静自然凉，意诚则灵",
                    "万物皆空，唯心不空",
                    "行到水穷处，坐看云起时",
                    "采菊东篱下，悠然见南山",
                    "明月松间照，清泉石上流",
                    "空山新雨后，天气晚来秋"
                ];
                
                // 预设场景
                this.presets = {
                    minimal: {
                        elements: [
                            {type: 'stone', x: 300, y: 250, size: 30},
                            {type: 'circles', x: 300, y: 250, radius: 80}
                        ]
                    },
                    traditional: {
                        elements: [
                            {type: 'stone', x: 200, y: 200, size: 25},
                            {type: 'stone', x: 400, y: 300, size: 35},
                            {type: 'lotus', x: 150, y: 350},
                            {type: 'bamboo', x: 500, y: 150},
                            {type: 'waves', x: 300, y: 400}
                        ]
                    },
                    modern: {
                        elements: [
                            {type: 'lines', x: 100, y: 100, length: 400},
                            {type: 'stone', x: 300, y: 250, size: 40},
                            {type: 'plant', x: 500, y: 400}
                        ]
                    },
                    nature: {
                        elements: [
                            {type: 'bamboo', x: 100, y: 100},
                            {type: 'lotus', x: 300, y: 300},
                            {type: 'bridge', x: 400, y: 200},
                            {type: 'water', x: 350, y: 350}
                        ]
                    }
                };
                
                this.meditationActive = false;
                this.bindEvents();
                this.initializeGarden();
            }
            
            bindEvents() {
                // 画布事件
                this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
                this.canvas.addEventListener('mousemove', (e) => this.draw(e));
                this.canvas.addEventListener('mouseup', () => this.stopDrawing());
                this.canvas.addEventListener('mouseout', () => this.stopDrawing());
                
                // 触摸事件
                this.canvas.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    const touch = e.touches[0];
                    const mouseEvent = new MouseEvent('mousedown', {
                        clientX: touch.clientX,
                        clientY: touch.clientY
                    });
                    this.canvas.dispatchEvent(mouseEvent);
                });
                
                this.canvas.addEventListener('touchmove', (e) => {
                    e.preventDefault();
                    const touch = e.touches[0];
                    const mouseEvent = new MouseEvent('mousemove', {
                        clientX: touch.clientX,
                        clientY: touch.clientY
                    });
                    this.canvas.dispatchEvent(mouseEvent);
                });
                
                this.canvas.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    const mouseEvent = new MouseEvent('mouseup', {});
                    this.canvas.dispatchEvent(mouseEvent);
                });
                
                // 呼吸练习
                document.getElementById('breathingCircle').addEventListener('click', () => {
                    this.toggleMeditation();
                });
                
                // 定期更换禅语
                setInterval(() => {
                    this.updateZenQuote();
                }, 30000);
            }
            
            initializeGarden() {
                this.clearCanvas();
                this.updateZenQuote();
            }
            
            clearCanvas() {
                // 绘制沙地背景
                const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
                gradient.addColorStop(0, '#F5DEB3');
                gradient.addColorStop(0.5, '#DEB887');
                gradient.addColorStop(1, '#D2B48C');
                
                this.ctx.fillStyle = gradient;
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                
                // 添加细微的纹理
                this.ctx.globalAlpha = 0.1;
                for (let i = 0; i < 1000; i++) {
                    const x = Math.random() * this.canvas.width;
                    const y = Math.random() * this.canvas.height;
                    this.ctx.fillStyle = Math.random() > 0.5 ? '#DDD' : '#BBB';
                    this.ctx.fillRect(x, y, 1, 1);
                }
                this.ctx.globalAlpha = 1;
            }
            
            getMousePos(e) {
                const rect = this.canvas.getBoundingClientRect();
                return {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                };
            }
            
            startDrawing(e) {
                this.isDrawing = true;
                const pos = this.getMousePos(e);
                this.lastX = pos.x;
                this.lastY = pos.y;
                
                this.createRippleEffect(pos.x, pos.y);
            }
            
            draw(e) {
                if (!this.isDrawing) return;
                
                const pos = this.getMousePos(e);
                
                switch (this.currentTool) {
                    case 'rake':
                        this.drawSandPattern(pos.x, pos.y);
                        break;
                    case 'stone':
                        this.placeStone(pos.x, pos.y);
                        this.stopDrawing();
                        break;
                    case 'plant':
                        this.placePlant(pos.x, pos.y);
                        this.stopDrawing();
                        break;
                    case 'water':
                        this.createWaterRipple(pos.x, pos.y);
                        this.stopDrawing();
                        break;
                }
                
                this.lastX = pos.x;
                this.lastY = pos.y;
            }
            
            stopDrawing() {
                this.isDrawing = false;
            }
            
            drawSandPattern(x, y) {
                this.ctx.save();
                this.ctx.globalAlpha = this.opacity;
                this.ctx.strokeStyle = '#8B7355';
                this.ctx.lineWidth = 2;
                this.ctx.lineCap = 'round';
                
                switch (this.currentPattern) {
                    case 'circles':
                        this.drawCircles(x, y);
                        break;
                    case 'waves':
                        this.drawWaves(x, y);
                        break;
                    case 'lines':
                        this.drawLines(x, y);
                        break;
                    case 'spiral':
                        this.drawSpiral(x, y);
                        break;
                }
                
                this.ctx.restore();
            }
            
            drawCircles(x, y) {
                for (let r = 5; r < this.brushSize * 2; r += 3) {
                    this.ctx.beginPath();
                    this.ctx.arc(x, y, r, 0, Math.PI * 2);
                    this.ctx.stroke();
                }
            }
            
            drawWaves(x, y) {
                this.ctx.beginPath();
                this.ctx.moveTo(this.lastX, this.lastY);
                
                const dx = x - this.lastX;
                const dy = y - this.lastY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                for (let i = 0; i < distance; i += 5) {
                    const progress = i / distance;
                    const currentX = this.lastX + dx * progress;
                    const currentY = this.lastY + dy * progress;
                    const offset = Math.sin(i * 0.3) * 5;
                    
                    this.ctx.lineTo(currentX + offset, currentY);
                }
                
                this.ctx.stroke();
            }
            
            drawLines(x, y) {
                this.ctx.beginPath();
                this.ctx.moveTo(this.lastX, this.lastY);
                this.ctx.lineTo(x, y);
                this.ctx.stroke();
                
                // 平行线
                const angle = Math.atan2(y - this.lastY, x - this.lastX);
                const perpAngle = angle + Math.PI / 2;
                
                for (let i = -10; i <= 10; i += 5) {
                    const offsetX = Math.cos(perpAngle) * i;
                    const offsetY = Math.sin(perpAngle) * i;
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.lastX + offsetX, this.lastY + offsetY);
                    this.ctx.lineTo(x + offsetX, y + offsetY);
                    this.ctx.stroke();
                }
            }
            
            drawSpiral(x, y) {
                this.ctx.beginPath();
                for (let angle = 0; angle < Math.PI * 4; angle += 0.1) {
                    const radius = angle * 2;
                    const spiralX = x + Math.cos(angle) * radius;
                    const spiralY = y + Math.sin(angle) * radius;
                    
                    if (angle === 0) {
                        this.ctx.moveTo(spiralX, spiralY);
                    } else {
                        this.ctx.lineTo(spiralX, spiralY);
                    }
                }
                this.ctx.stroke();
            }
            
            placeStone(x, y) {
                const size = this.brushSize + Math.random() * 20;
                const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, size);
                gradient.addColorStop(0, '#696969');
                gradient.addColorStop(0.7, '#4A4A4A');
                gradient.addColorStop(1, '#2F2F2F');
                
                this.ctx.save();
                this.ctx.globalAlpha = this.opacity;
                this.ctx.fillStyle = gradient;
                this.ctx.beginPath();
                this.ctx.arc(x, y, size, 0, Math.PI * 2);
                this.ctx.fill();
                
                // 添加高光
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                this.ctx.beginPath();
                this.ctx.arc(x - size * 0.3, y - size * 0.3, size * 0.3, 0, Math.PI * 2);
                this.ctx.fill();
                
                this.ctx.restore();
                
                this.elements.push({type: 'stone', x, y, size});
            }
            
            placePlant(x, y) {
                this.ctx.save();
                this.ctx.globalAlpha = this.opacity;
                
                // 绘制植物
                const plants = ['🌱', '🌿', '🍀', '🌾'];
                const plant = plants[Math.floor(Math.random() * plants.length)];
                
                this.ctx.font = `${this.brushSize * 2}px serif`;
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(plant, x, y);
                
                this.ctx.restore();
                
                this.elements.push({type: 'plant', x, y, emoji: plant});
            }
            
            createWaterRipple(x, y) {
                this.animateRipple(x, y, 0);
                this.elements.push({type: 'water', x, y});
            }
            
            animateRipple(x, y, radius) {
                if (radius > 50) return;
                
                this.ctx.save();
                this.ctx.globalAlpha = 0.3 * (1 - radius / 50);
                this.ctx.strokeStyle = '#4FC3F7';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.arc(x, y, radius, 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.restore();
                
                setTimeout(() => {
                    this.animateRipple(x, y, radius + 2);
                }, 50 / this.animSpeed);
            }
            
            createRippleEffect(x, y) {
                const ripple = document.createElement('div');
                ripple.className = 'ripple-effect';
                ripple.style.left = (x - 10) + 'px';
                ripple.style.top = (y - 10) + 'px';
                ripple.style.width = '20px';
                ripple.style.height = '20px';
                
                this.canvas.parentNode.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 1000);
            }
            
            selectTool(tool) {
                this.currentTool = tool;
                this.updateToolSelection();
            }
            
            selectPattern(pattern) {
                this.currentPattern = pattern;
                this.updatePatternSelection();
            }
            
            updateToolSelection() {
                document.querySelectorAll('.tool-btn').forEach(btn => {
                    btn.classList.remove('selected');
                });
                document.querySelector(`[onclick="zenGarden.selectTool('${this.currentTool}')"]`)
                    ?.classList.add('selected');
            }
            
            updatePatternSelection() {
                document.querySelectorAll('.pattern-btn').forEach(btn => {
                    btn.classList.remove('selected');
                });
                document.querySelector(`[onclick="zenGarden.selectPattern('${this.currentPattern}')"]`)
                    ?.classList.add('selected');
            }
            
            setBrushSize(size) {
                this.brushSize = parseInt(size);
            }
            
            setOpacity(opacity) {
                this.opacity = parseFloat(opacity);
            }
            
            setAnimSpeed(speed) {
                this.animSpeed = parseFloat(speed);
            }
            
            addElement(type) {
                const x = this.canvas.width / 2 + (Math.random() - 0.5) * 200;
                const y = this.canvas.height / 2 + (Math.random() - 0.5) * 200;
                
                this.ctx.save();
                this.ctx.font = '40px serif';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                
                const elements = {
                    lotus: '🪷',
                    bamboo: '🎋',
                    bridge: '🌉',
                    lantern: '🏮'
                };
                
                this.ctx.fillText(elements[type], x, y);
                this.ctx.restore();
                
                this.elements.push({type, x, y, emoji: elements[type]});
            }
            
            loadPreset(presetName) {
                this.clearGarden();
                const preset = this.presets[presetName];
                
                if (preset) {
                    preset.elements.forEach(element => {
                        switch (element.type) {
                            case 'stone':
                                this.placeStone(element.x, element.y);
                                break;
                            case 'circles':
                                this.drawCircles(element.x, element.y);
                                break;
                            case 'waves':
                                this.drawWaves(element.x, element.y);
                                break;
                            case 'lines':
                                this.drawLines(element.x, element.y);
                                break;
                            default:
                                this.addElement(element.type);
                        }
                    });
                }
            }
            
            clearGarden() {
                this.elements = [];
                this.sandTextures = [];
                this.initializeGarden();
            }
            
            saveGarden() {
                const gardenData = {
                    elements: this.elements,
                    imageData: this.canvas.toDataURL()
                };
                
                try {
                    localStorage.setItem('zenGarden_save', JSON.stringify(gardenData));
                    alert('花园已保存！');
                } catch (e) {
                    alert('保存失败！');
                }
            }
            
            loadGarden() {
                try {
                    const saved = localStorage.getItem('zenGarden_save');
                    if (!saved) {
                        alert('没有找到保存的花园！');
                        return;
                    }
                    
                    const gardenData = JSON.parse(saved);
                    this.elements = gardenData.elements || [];
                    
                    if (gardenData.imageData) {
                        const img = new Image();
                        img.onload = () => {
                            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                            this.ctx.drawImage(img, 0, 0);
                        };
                        img.src = gardenData.imageData;
                    }
                    
                    alert('花园已加载！');
                } catch (e) {
                    alert('加载失败！');
                }
            }
            
            toggleMeditation() {
                const circle = document.getElementById('breathingCircle');
                const text = document.getElementById('meditationText');
                
                this.meditationActive = !this.meditationActive;
                
                if (this.meditationActive) {
                    circle.classList.add('breathing');
                    text.textContent = '深呼吸...跟随圆圈的节奏';
                } else {
                    circle.classList.remove('breathing');
                    text.textContent = '点击圆圈开始呼吸练习';
                }
            }
            
            updateZenQuote() {
                const quote = this.zenQuotes[Math.floor(Math.random() * this.zenQuotes.length)];
                document.getElementById('zenQuote').textContent = quote;
            }
            
            showHelp() {
                document.getElementById('helpPopup').classList.add('show');
            }
            
            closeHelp() {
                document.getElementById('helpPopup').classList.remove('show');
            }
        }

        // 全局变量
        let zenGarden;

        // 页面加载完成后初始化
        document.addEventListener('DOMContentLoaded', () => {
            zenGarden = new ZenGarden();
        });