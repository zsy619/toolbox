class ColoringGame {
    constructor() {
        this.canvas = document.getElementById('coloringCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.patternCanvas = document.getElementById('patternCanvas');
        this.patternCtx = this.patternCanvas.getContext('2d');
        
        // 游戏状态
        this.currentPattern = 'flower';
        this.currentColor = '#ff0000';
        this.currentTool = 'brush';
        this.brushSize = 8;
        this.isDrawing = false;
        this.startTime = Date.now();
        this.timer = null;
        
        // 历史记录用于撤销/重做
        this.history = [];
        this.historyIndex = -1;
        this.maxHistory = 20;
        
        // 统计数据
        this.colorsUsed = new Set();
        this.coloredPixels = 0;
        this.totalPixels = 0;
        
        // 预设颜色
        this.presetColors = [
            '#ff0000', '#ff8000', '#ffff00', '#80ff00',
            '#00ff00', '#00ff80', '#00ffff', '#0080ff',
            '#0000ff', '#8000ff', '#ff00ff', '#ff0080',
            '#ffffff', '#c0c0c0', '#808080', '#404040',
            '#000000', '#800000', '#808000', '#008000',
            '#008080', '#000080', '#800080', '#ff6b6b',
            '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'
        ];
        
        this.initGame();
        this.bindEvents();
        this.startTimer();
    }
    
    initGame() {
        this.createColorPalette();
        this.selectPattern(this.currentPattern);
        this.setTool('brush');
        this.updateDisplay();
        this.saveState();
    }
    
    createColorPalette() {
        const colorGrid = document.getElementById('colorGrid');
        colorGrid.innerHTML = '';
        
        this.presetColors.forEach(color => {
            const swatch = document.createElement('div');
            swatch.className = 'color-swatch';
            swatch.style.backgroundColor = color;
            swatch.onclick = () => this.selectColor(color);
            colorGrid.appendChild(swatch);
        });
        
        // 默认选择第一个颜色
        this.selectColor(this.presetColors[0]);
    }
    
    selectColor(color) {
        this.currentColor = color;
        this.colorsUsed.add(color);
        
        // 更新选中状态
        document.querySelectorAll('.color-swatch').forEach(swatch => {
            swatch.classList.remove('selected');
            if (swatch.style.backgroundColor === this.rgbToHex(color) || 
                swatch.style.backgroundColor === color) {
                swatch.classList.add('selected');
            }
        });
        
        this.updateDisplay();
    }
    
    addCustomColor(color) {
        this.selectColor(color);
        
        // 添加到调色板
        const colorGrid = document.getElementById('colorGrid');
        const swatch = document.createElement('div');
        swatch.className = 'color-swatch selected';
        swatch.style.backgroundColor = color;
        swatch.onclick = () => this.selectColor(color);
        colorGrid.appendChild(swatch);
        
        // 移除其他选中状态
        document.querySelectorAll('.color-swatch').forEach(s => {
            if (s !== swatch) s.classList.remove('selected');
        });
    }
    
    rgbToHex(rgb) {
        if (rgb.startsWith('#')) return rgb;
        const values = rgb.match(/\d+/g);
        if (!values) return rgb;
        return '#' + values.map(x => parseInt(x).toString(16).padStart(2, '0')).join('');
    }
    
    selectPattern(patternName) {
        this.currentPattern = patternName;
        
        // 更新按钮状态
        document.querySelectorAll('.pattern-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
        
        // 清空画布
        this.clearCanvas();
        
        // 绘制新图案
        this.drawPattern(patternName);
        
        // 更新显示
        document.getElementById('currentPattern').textContent = this.getPatternName(patternName);
        this.calculateTotalPixels();
        this.updateDisplay();
    }
    
    getPatternName(pattern) {
        const names = {
            flower: '花朵',
            butterfly: '蝴蝶', 
            house: '房子',
            tree: '大树',
            heart: '爱心',
            star: '星星'
        };
        return names[pattern] || '未知';
    }
    
    drawPattern(patternName) {
        this.patternCtx.clearRect(0, 0, this.patternCanvas.width, this.patternCanvas.height);
        this.patternCtx.strokeStyle = '#333';
        this.patternCtx.lineWidth = 2;
        this.patternCtx.lineCap = 'round';
        this.patternCtx.lineJoin = 'round';
        
        const centerX = this.patternCanvas.width / 2;
        const centerY = this.patternCanvas.height / 2;
        
        this.patternCtx.beginPath();
        
        switch (patternName) {
            case 'flower':
                this.drawFlower(centerX, centerY);
                break;
            case 'butterfly':
                this.drawButterfly(centerX, centerY);
                break;
            case 'house':
                this.drawHouse(centerX, centerY);
                break;
            case 'tree':
                this.drawTree(centerX, centerY);
                break;
            case 'heart':
                this.drawHeart(centerX, centerY);
                break;
            case 'star':
                this.drawStar(centerX, centerY);
                break;
        }
        
        this.patternCtx.stroke();
    }
    
    drawFlower(x, y) {
        const ctx = this.patternCtx;
        
        // 花瓣
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI * 2) / 6;
            const petalX = x + Math.cos(angle) * 60;
            const petalY = y + Math.sin(angle) * 60;
            
            ctx.moveTo(x, y);
            ctx.quadraticCurveTo(
                x + Math.cos(angle) * 80,
                y + Math.sin(angle) * 80,
                petalX, petalY
            );
            
            // 花瓣轮廓
            ctx.moveTo(petalX, petalY);
            ctx.arc(petalX, petalY, 25, 0, Math.PI * 2);
        }
        
        // 花心
        ctx.moveTo(x + 15, y);
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        
        // 茎
        ctx.moveTo(x, y + 15);
        ctx.lineTo(x, y + 150);
        
        // 叶子
        ctx.moveTo(x - 30, y + 80);
        ctx.quadraticCurveTo(x - 50, y + 70, x - 40, y + 100);
        ctx.quadraticCurveTo(x - 20, y + 110, x, y + 100);
        
        ctx.moveTo(x + 30, y + 120);
        ctx.quadraticCurveTo(x + 50, y + 110, x + 40, y + 140);
        ctx.quadraticCurveTo(x + 20, y + 150, x, y + 140);
    }
    
    drawButterfly(x, y) {
        const ctx = this.patternCtx;
        
        // 身体
        ctx.moveTo(x, y - 60);
        ctx.lineTo(x, y + 60);
        
        // 触角
        ctx.moveTo(x - 5, y - 55);
        ctx.quadraticCurveTo(x - 15, y - 70, x - 10, y - 80);
        ctx.moveTo(x + 5, y - 55);
        ctx.quadraticCurveTo(x + 15, y - 70, x + 10, y - 80);
        
        // 上翅膀
        ctx.moveTo(x, y - 30);
        ctx.quadraticCurveTo(x - 60, y - 50, x - 80, y - 20);
        ctx.quadraticCurveTo(x - 70, y + 10, x - 40, y - 10);
        ctx.lineTo(x, y - 30);
        
        ctx.moveTo(x, y - 30);
        ctx.quadraticCurveTo(x + 60, y - 50, x + 80, y - 20);
        ctx.quadraticCurveTo(x + 70, y + 10, x + 40, y - 10);
        ctx.lineTo(x, y - 30);
        
        // 下翅膀
        ctx.moveTo(x, y + 10);
        ctx.quadraticCurveTo(x - 50, y + 20, x - 60, y + 50);
        ctx.quadraticCurveTo(x - 40, y + 60, x - 20, y + 40);
        ctx.lineTo(x, y + 10);
        
        ctx.moveTo(x, y + 10);
        ctx.quadraticCurveTo(x + 50, y + 20, x + 60, y + 50);
        ctx.quadraticCurveTo(x + 40, y + 60, x + 20, y + 40);
        ctx.lineTo(x, y + 10);
        
        // 翅膀装饰
        ctx.moveTo(x - 50, y - 25);
        ctx.arc(x - 50, y - 25, 8, 0, Math.PI * 2);
        ctx.moveTo(x + 50, y - 25);
        ctx.arc(x + 50, y - 25, 8, 0, Math.PI * 2);
    }
    
    drawHouse(x, y) {
        const ctx = this.patternCtx;
        
        // 房子主体
        ctx.rect(x - 80, y - 20, 160, 120);
        
        // 屋顶
        ctx.moveTo(x - 100, y - 20);
        ctx.lineTo(x, y - 80);
        ctx.lineTo(x + 100, y - 20);
        ctx.closePath();
        
        // 门
        ctx.rect(x - 20, y + 40, 40, 60);
        
        // 门把手
        ctx.moveTo(x + 8, y + 70);
        ctx.arc(x + 5, y + 70, 3, 0, Math.PI * 2);
        
        // 窗户
        ctx.rect(x - 60, y, 25, 25);
        ctx.rect(x + 35, y, 25, 25);
        
        // 窗框
        ctx.moveTo(x - 47.5, y);
        ctx.lineTo(x - 47.5, y + 25);
        ctx.moveTo(x - 60, y + 12.5);
        ctx.lineTo(x - 35, y + 12.5);
        
        ctx.moveTo(x + 47.5, y);
        ctx.lineTo(x + 47.5, y + 25);
        ctx.moveTo(x + 35, y + 12.5);
        ctx.lineTo(x + 60, y + 12.5);
        
        // 烟囱
        ctx.rect(x + 40, y - 70, 15, 30);
        
        // 烟
        for (let i = 0; i < 3; i++) {
            ctx.moveTo(x + 47 + i * 8, y - 75 - i * 10);
            ctx.arc(x + 47 + i * 8, y - 75 - i * 10, 3, 0, Math.PI * 2);
        }
    }
    
    drawTree(x, y) {
        const ctx = this.patternCtx;
        
        // 树干
        ctx.rect(x - 15, y + 20, 30, 80);
        
        // 树冠（三层）
        ctx.moveTo(x - 60, y + 20);
        ctx.lineTo(x, y - 40);
        ctx.lineTo(x + 60, y + 20);
        ctx.closePath();
        
        ctx.moveTo(x - 50, y);
        ctx.lineTo(x, y - 60);
        ctx.lineTo(x + 50, y);
        ctx.closePath();
        
        ctx.moveTo(x - 40, y - 20);
        ctx.lineTo(x, y - 80);
        ctx.lineTo(x + 40, y - 20);
        ctx.closePath();
        
        // 树叶装饰
        for (let i = 0; i < 8; i++) {
            const leafX = x + (Math.random() - 0.5) * 80;
            const leafY = y - 60 + (Math.random() - 0.5) * 40;
            ctx.moveTo(leafX + 5, leafY);
            ctx.arc(leafX, leafY, 5, 0, Math.PI * 2);
        }
        
        // 根部
        ctx.moveTo(x - 25, y + 100);
        ctx.quadraticCurveTo(x - 35, y + 110, x - 30, y + 120);
        ctx.moveTo(x + 25, y + 100);
        ctx.quadraticCurveTo(x + 35, y + 110, x + 30, y + 120);
    }
    
    drawHeart(x, y) {
        const ctx = this.patternCtx;
        
        // 爱心
        ctx.moveTo(x, y + 50);
        ctx.bezierCurveTo(x - 50, y - 20, x - 100, y - 60, x - 50, y - 100);
        ctx.bezierCurveTo(x - 25, y - 120, x + 25, y - 120, x + 50, y - 100);
        ctx.bezierCurveTo(x + 100, y - 60, x + 50, y - 20, x, y + 50);
        ctx.closePath();
        
        // 装饰小心
        for (let i = 0; i < 5; i++) {
            const heartX = x + (Math.random() - 0.5) * 80;
            const heartY = y - 40 + (Math.random() - 0.5) * 60;
            const size = 5 + Math.random() * 10;
            
            ctx.moveTo(heartX, heartY + size/2);
            ctx.bezierCurveTo(heartX - size/2, heartY - size/4, heartX - size, heartY - size/2, heartX - size/2, heartY - size);
            ctx.bezierCurveTo(heartX - size/4, heartY - size*1.2, heartX + size/4, heartY - size*1.2, heartX + size/2, heartY - size);
            ctx.bezierCurveTo(heartX + size, heartY - size/2, heartX + size/2, heartY - size/4, heartX, heartY + size/2);
            ctx.closePath();
        }
    }
    
    drawStar(x, y) {
        const ctx = this.patternCtx;
        
        // 主星星
        ctx.moveTo(x, y - 60);
        for (let i = 0; i < 5; i++) {
            const angle1 = (i * Math.PI * 2) / 5 - Math.PI / 2;
            const angle2 = ((i + 0.5) * Math.PI * 2) / 5 - Math.PI / 2;
            
            const x1 = x + Math.cos(angle1) * 60;
            const y1 = y + Math.sin(angle1) * 60;
            const x2 = x + Math.cos(angle2) * 25;
            const y2 = y + Math.sin(angle2) * 25;
            
            ctx.lineTo(x2, y2);
            ctx.lineTo(x1, y1);
        }
        ctx.closePath();
        
        // 小星星装饰
        const smallStars = [
            {x: x - 80, y: y - 80, size: 15},
            {x: x + 80, y: y - 60, size: 12},
            {x: x - 70, y: y + 70, size: 18},
            {x: x + 70, y: y + 80, size: 10},
            {x: x - 100, y: y + 20, size: 8}
        ];
        
        smallStars.forEach(star => {
            ctx.moveTo(star.x, star.y - star.size);
            for (let i = 0; i < 5; i++) {
                const angle1 = (i * Math.PI * 2) / 5 - Math.PI / 2;
                const angle2 = ((i + 0.5) * Math.PI * 2) / 5 - Math.PI / 2;
                
                const x1 = star.x + Math.cos(angle1) * star.size;
                const y1 = star.y + Math.sin(angle1) * star.size;
                const x2 = star.x + Math.cos(angle2) * star.size * 0.4;
                const y2 = star.y + Math.sin(angle2) * star.size * 0.4;
                
                ctx.lineTo(x2, y2);
                ctx.lineTo(x1, y1);
            }
            ctx.closePath();
        });
    }
    
    setTool(tool) {
        this.currentTool = tool;
        
        // 更新按钮状态
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // 找到对应的按钮并激活
        document.querySelectorAll('.tool-btn').forEach(btn => {
            if (btn.textContent.includes(tool === 'brush' ? '🖌️' : tool === 'fill' ? '🪣' : '🧹')) {
                btn.classList.add('active');
            }
        });
        
        // 更新鼠标样式
        this.canvas.style.cursor = tool === 'brush' ? 'crosshair' : 
                                   tool === 'fill' ? 'pointer' : 'grabbing';
    }
    
    setBrushSize(size) {
        this.brushSize = parseInt(size);
        document.getElementById('brushSizeDisplay').textContent = size + 'px';
    }
    
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 重置统计
        this.colorsUsed.clear();
        this.colorsUsed.add(this.currentColor);
        this.coloredPixels = 0;
        
        this.updateDisplay();
        this.saveState();
    }
    
    saveState() {
        // 限制历史记录数量
        if (this.historyIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.historyIndex + 1);
        }
        
        if (this.history.length >= this.maxHistory) {
            this.history.shift();
        } else {
            this.historyIndex++;
        }
        
        // 保存当前状态
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        this.history[this.historyIndex] = {
            imageData: this.ctx.createImageData(imageData),
            colorsUsed: new Set(this.colorsUsed),
            coloredPixels: this.coloredPixels
        };
        
        // 复制像素数据
        this.history[this.historyIndex].imageData.data.set(imageData.data);
    }
    
    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.restoreState();
        }
    }
    
    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.restoreState();
        }
    }
    
    restoreState() {
        if (this.history[this.historyIndex]) {
            const state = this.history[this.historyIndex];
            this.ctx.putImageData(state.imageData, 0, 0);
            this.colorsUsed = new Set(state.colorsUsed);
            this.coloredPixels = state.coloredPixels;
            this.updateDisplay();
        }
    }
    
    saveImage() {
        const link = document.createElement('a');
        link.download = `coloring_${this.currentPattern}_${Date.now()}.png`;
        link.href = this.canvas.toDataURL();
        link.click();
    }
    
    calculateTotalPixels() {
        // 简化计算：基于图案复杂度估算
        const complexity = {
            flower: 25000,
            butterfly: 30000,
            house: 20000,
            tree: 35000,
            heart: 15000,
            star: 22000
        };
        this.totalPixels = complexity[this.currentPattern] || 25000;
    }
    
    updateProgress() {
        const progress = Math.min((this.coloredPixels / this.totalPixels) * 100, 100);
        document.getElementById('progressFill').style.width = progress + '%';
        document.getElementById('progressPercent').textContent = Math.round(progress) + '%';
        document.getElementById('completion').textContent = Math.round(progress) + '%';
        
        if (progress >= 90 && !this.completionShown) {
            this.completionShown = true;
            setTimeout(() => this.showCompletionPopup(), 1000);
        }
    }
    
    showCompletionPopup() {
        const finalTime = this.formatTime(Math.floor((Date.now() - this.startTime) / 1000));
        
        document.getElementById('finalColors').textContent = this.colorsUsed.size;
        document.getElementById('finalTime').textContent = finalTime;
        document.getElementById('finalCompletion').textContent = document.getElementById('completion').textContent;
        
        // 创建预览
        const preview = document.getElementById('completionPreview');
        const previewCanvas = document.createElement('canvas');
        previewCanvas.width = 200;
        previewCanvas.height = 200;
        const previewCtx = previewCanvas.getContext('2d');
        previewCtx.drawImage(this.canvas, 0, 0, 200, 200);
        
        preview.innerHTML = '';
        preview.appendChild(previewCanvas);
        
        document.getElementById('completionPopup').style.display = 'flex';
    }
    
    closeCompletion() {
        document.getElementById('completionPopup').style.display = 'none';
    }
    
    saveToGallery() {
        const galleries = JSON.parse(localStorage.getItem('coloringGallery') || '[]');
        
        const artwork = {
            id: Date.now(),
            pattern: this.currentPattern,
            patternName: this.getPatternName(this.currentPattern),
            image: this.canvas.toDataURL(),
            colors: this.colorsUsed.size,
            time: this.formatTime(Math.floor((Date.now() - this.startTime) / 1000)),
            date: new Date().toLocaleDateString(),
            completion: document.getElementById('completion').textContent
        };
        
        galleries.unshift(artwork);
        
        // 限制作品集大小
        if (galleries.length > 50) {
            galleries.splice(50);
        }
        
        localStorage.setItem('coloringGallery', JSON.stringify(galleries));
        
        this.closeCompletion();
        alert('作品已保存到作品集！');
    }
    
    shareImage() {
        if (navigator.share) {
            this.canvas.toBlob(blob => {
                const file = new File([blob], 'my-coloring.png', { type: 'image/png' });
                navigator.share({
                    title: '我的填色作品',
                    text: `我完成了一幅${this.getPatternName(this.currentPattern)}的填色作品！`,
                    files: [file]
                });
            });
        } else {
            // 降级方案：下载图片
            this.saveImage();
            alert('图片已下载，您可以手动分享！');
        }
    }
    
    showGallery() {
        const galleries = JSON.parse(localStorage.getItem('coloringGallery') || '[]');
        const galleryGrid = document.getElementById('galleryGrid');
        
        galleryGrid.innerHTML = '';
        
        if (galleries.length === 0) {
            galleryGrid.innerHTML = '<p>还没有保存的作品</p>';
        } else {
            galleries.forEach((artwork, index) => {
                const item = document.createElement('div');
                item.className = 'gallery-item';
                item.innerHTML = `
                    <img src="${artwork.image}" alt="${artwork.patternName}">
                    <div class="item-info">
                        ${artwork.patternName} - ${artwork.date}
                    </div>
                `;
                
                item.onclick = () => this.viewArtwork(artwork);
                galleryGrid.appendChild(item);
            });
        }
        
        document.getElementById('galleryModal').style.display = 'flex';
    }
    
    closeGallery() {
        document.getElementById('galleryModal').style.display = 'none';
    }
    
    clearGallery() {
        if (confirm('确定要清空所有作品吗？此操作不可撤销！')) {
            localStorage.removeItem('coloringGallery');
            this.showGallery();
        }
    }
    
    viewArtwork(artwork) {
        // 在新窗口显示作品
        const newWindow = window.open('', '_blank', 'width=800,height=600');
        newWindow.document.write(`
            <html>
                <head><title>${artwork.patternName} - 填色作品</title></head>
                <body style="margin:0;padding:20px;text-align:center;background:#f0f0f0;">
                    <h2>${artwork.patternName}</h2>
                    <img src="${artwork.image}" style="max-width:100%;border-radius:10px;box-shadow:0 5px 15px rgba(0,0,0,0.3);">
                    <p>完成时间: ${artwork.date} | 用时: ${artwork.time} | 颜色: ${artwork.colors}种 | 完成度: ${artwork.completion}</p>
                </body>
            </html>
        `);
    }
    
    randomColors() {
        // 生成随机和谐配色
        const baseHue = Math.random() * 360;
        const colors = [];
        
        // 生成互补色和类似色
        for (let i = 0; i < 8; i++) {
            const hue = (baseHue + i * 45) % 360;
            const saturation = 60 + Math.random() * 40;
            const lightness = 40 + Math.random() * 40;
            colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
        }
        
        // 更新调色板
        const colorGrid = document.getElementById('colorGrid');
        const swatches = colorGrid.querySelectorAll('.color-swatch');
        
        colors.forEach((color, index) => {
            if (swatches[index]) {
                swatches[index].style.backgroundColor = color;
                swatches[index].onclick = () => this.selectColor(color);
            }
        });
        
        this.selectColor(colors[0]);
    }
    
    startTimer() {
        this.timer = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            document.getElementById('drawingTime').textContent = this.formatTime(elapsed);
        }, 1000);
    }
    
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    updateDisplay() {
        document.getElementById('colorsUsed').textContent = this.colorsUsed.size;
        this.updateProgress();
    }
    
    bindEvents() {
        let lastX, lastY;
        
        // 鼠标事件
        this.canvas.addEventListener('mousedown', (e) => {
            this.isDrawing = true;
            const rect = this.canvas.getBoundingClientRect();
            lastX = e.clientX - rect.left;
            lastY = e.clientY - rect.top;
            this.handleDrawing(lastX, lastY, e);
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
            if (!this.isDrawing) return;
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.handleDrawing(x, y, e, lastX, lastY);
            lastX = x;
            lastY = y;
        });
        
        this.canvas.addEventListener('mouseup', () => {
            if (this.isDrawing) {
                this.isDrawing = false;
                this.saveState();
            }
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            if (this.isDrawing) {
                this.isDrawing = false;
                this.saveState();
            }
        });
        
        // 触摸事件
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.isDrawing = true;
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            lastX = touch.clientX - rect.left;
            lastY = touch.clientY - rect.top;
            this.handleDrawing(lastX, lastY, e);
        });
        
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (!this.isDrawing) return;
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            this.handleDrawing(x, y, e, lastX, lastY);
            lastX = x;
            lastY = y;
        });
        
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            if (this.isDrawing) {
                this.isDrawing = false;
                this.saveState();
            }
        });
        
        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'z':
                        e.preventDefault();
                        if (e.shiftKey) {
                            this.redo();
                        } else {
                            this.undo();
                        }
                        break;
                    case 'y':
                        e.preventDefault();
                        this.redo();
                        break;
                    case 's':
                        e.preventDefault();
                        this.saveImage();
                        break;
                }
            }
        });
    }
    
    handleDrawing(x, y, e, lastX = null, lastY = null) {
        switch (this.currentTool) {
            case 'brush':
                this.drawBrush(x, y, lastX, lastY);
                break;
            case 'fill':
                if (e.type === 'mousedown' || e.type === 'touchstart') {
                    this.floodFill(Math.floor(x), Math.floor(y));
                }
                break;
            case 'eraser':
                this.drawEraser(x, y, lastX, lastY);
                break;
        }
    }
    
    drawBrush(x, y, lastX, lastY) {
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.fillStyle = this.currentColor;
        this.ctx.strokeStyle = this.currentColor;
        this.ctx.lineWidth = this.brushSize;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        
        if (lastX !== null && lastY !== null) {
            this.ctx.beginPath();
            this.ctx.moveTo(lastX, lastY);
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
        } else {
            this.ctx.beginPath();
            this.ctx.arc(x, y, this.brushSize / 2, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        this.coloredPixels += this.brushSize * this.brushSize;
        this.updateDisplay();
    }
    
    drawEraser(x, y, lastX, lastY) {
        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.lineWidth = this.brushSize * 2;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        
        if (lastX !== null && lastY !== null) {
            this.ctx.beginPath();
            this.ctx.moveTo(lastX, lastY);
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
        } else {
            this.ctx.beginPath();
            this.ctx.arc(x, y, this.brushSize, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        this.coloredPixels = Math.max(0, this.coloredPixels - this.brushSize * this.brushSize * 2);
        this.updateDisplay();
    }
    
    floodFill(startX, startY) {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        const startIndex = (startY * width + startX) * 4;
        const startR = data[startIndex];
        const startG = data[startIndex + 1];
        const startB = data[startIndex + 2];
        const startA = data[startIndex + 3];
        
        // 转换目标颜色
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = 1;
        tempCanvas.height = 1;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.fillStyle = this.currentColor;
        tempCtx.fillRect(0, 0, 1, 1);
        const targetData = tempCtx.getImageData(0, 0, 1, 1).data;
        
        const targetR = targetData[0];
        const targetG = targetData[1];
        const targetB = targetData[2];
        const targetA = 255;
        
        // 如果颜色相同则不填充
        if (startR === targetR && startG === targetG && startB === targetB && startA === targetA) {
            return;
        }
        
        const stack = [[startX, startY]];
        const visited = new Set();
        let filledPixels = 0;
        
        while (stack.length > 0) {
            const [x, y] = stack.pop();
            const key = `${x},${y}`;
            
            if (visited.has(key) || x < 0 || x >= width || y < 0 || y >= height) {
                continue;
            }
            
            const index = (y * width + x) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            const a = data[index + 3];
            
            if (r !== startR || g !== startG || b !== startB || a !== startA) {
                continue;
            }
            
            visited.add(key);
            
            data[index] = targetR;
            data[index + 1] = targetG;
            data[index + 2] = targetB;
            data[index + 3] = targetA;
            
            filledPixels++;
            
            // 添加相邻像素
            stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
            
            // 限制填充区域大小以防止浏览器卡死
            if (filledPixels > 50000) break;
        }
        
        this.ctx.putImageData(imageData, 0, 0);
        this.coloredPixels += filledPixels;
        this.updateDisplay();
    }
}

// 全局变量
let coloringGame;

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    coloringGame = new ColoringGame();
});