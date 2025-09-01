class PixelArtEditor {
            constructor() {
                this.canvas = document.getElementById('pixelCanvas');
                this.ctx = this.canvas.getContext('2d');
                this.previewCanvas = document.getElementById('previewCanvas');
                this.previewCtx = this.previewCanvas.getContext('2d');
                this.gridCanvas = document.getElementById('gridOverlay');
                this.gridCtx = this.gridCanvas.getContext('2d');

                this.canvasWidth = 32;
                this.canvasHeight = 32;
                this.pixelSize = 10;
                this.zoom = 1;
                this.showGrid = true;

                this.currentTool = 'pencil';
                this.currentColor = '#000000';
                this.brushSize = 1;
                this.isDrawing = false;
                this.lastX = 0;
                this.lastY = 0;

                this.layers = [{ name: '图层 1', canvas: null, visible: true, opacity: 1 }];
                this.currentLayer = 0;
                this.frames = [{ layers: [] }];
                this.currentFrame = 0;
                this.isPlaying = false;
                this.frameRate = 12;

                this.history = [];
                this.historyStep = -1;
                this.maxHistorySteps = 50;

                this.defaultPalette = [
                    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
                    '#800000', '#008000', '#000080', '#808000', '#800080', '#008080', '#C0C0C0', '#808080',
                    '#FF9999', '#99FF99', '#9999FF', '#FFFF99', '#FF99FF', '#99FFFF', '#FFE4B5', '#D2B48C',
                    '#DDA0DD', '#98FB98', '#F0E68C', '#87CEEB', '#FFB6C1', '#20B2AA', '#FFA500', '#FF6347'
                ];

                this.init();
            }

            init() {
                this.setupCanvas();
                this.setupEventListeners();
                this.setupColorPalette();
                this.setupLayers();
                this.setupFrames();
                this.drawGrid();
                this.updatePreview();
                this.updateStatus();
            }

            setupCanvas() {
                this.canvas.width = this.canvasWidth * this.pixelSize;
                this.canvas.height = this.canvasHeight * this.pixelSize;
                this.gridCanvas.width = this.canvas.width;
                this.gridCanvas.height = this.canvas.height;

                this.ctx.imageSmoothingEnabled = false;
                this.previewCtx.imageSmoothingEnabled = false;

                // 初始化图层
                this.layers[0].canvas = this.createLayerCanvas();
                this.frames[0].layers = [this.copyCanvas(this.layers[0].canvas)];
            }

            createLayerCanvas() {
                const canvas = document.createElement('canvas');
                canvas.width = this.canvasWidth;
                canvas.height = this.canvasHeight;
                const ctx = canvas.getContext('2d');
                ctx.imageSmoothingEnabled = false;
                return canvas;
            }

            setupEventListeners() {
                // 工具选择
                document.querySelectorAll('.tool-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
                        e.target.classList.add('active');
                        this.currentTool = e.target.dataset.tool;
                        this.updateStatus(`切换到 ${this.getToolName(this.currentTool)}`);
                    });
                });

                // 画布事件
                this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
                this.canvas.addEventListener('mousemove', (e) => this.draw(e));
                this.canvas.addEventListener('mouseup', () => this.stopDrawing());
                this.canvas.addEventListener('mouseleave', () => this.stopDrawing());

                // 触摸支持
                this.canvas.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    this.startDrawing(e.touches[0]);
                });
                this.canvas.addEventListener('touchmove', (e) => {
                    e.preventDefault();
                    this.draw(e.touches[0]);
                });
                this.canvas.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    this.stopDrawing();
                });

                // 鼠标位置跟踪
                this.canvas.addEventListener('mousemove', (e) => {
                    const rect = this.canvas.getBoundingClientRect();
                    const x = Math.floor((e.clientX - rect.left) / this.pixelSize);
                    const y = Math.floor((e.clientY - rect.top) / this.pixelSize);
                    document.getElementById('cursorPosition').textContent = `位置: (${x}, ${y})`;
                });

                // 控制按钮
                document.getElementById('brushSize').addEventListener('input', (e) => {
                    this.brushSize = parseInt(e.target.value);
                    document.getElementById('brushSizeValue').textContent = this.brushSize;
                    this.updateBrushPreview();
                });

                document.getElementById('colorPicker').addEventListener('change', (e) => {
                    this.currentColor = e.target.value;
                    this.updateColorSelection();
                });

                document.getElementById('addColor').addEventListener('click', () => {
                    this.addColorToPalette(this.currentColor);
                });

                document.getElementById('zoomIn').addEventListener('click', () => this.zoomIn());
                document.getElementById('zoomOut').addEventListener('click', () => this.zoomOut());
                document.getElementById('toggleGrid').addEventListener('click', () => this.toggleGrid());

                // 图层控制
                document.getElementById('addLayer').addEventListener('click', () => this.addLayer());

                // 帧控制
                document.getElementById('addFrame').addEventListener('click', () => this.addFrame());
                document.getElementById('deleteFrame').addEventListener('click', () => this.deleteFrame());
                document.getElementById('playAnimation').addEventListener('click', () => this.toggleAnimation());

                document.getElementById('frameRate').addEventListener('input', (e) => {
                    this.frameRate = parseInt(e.target.value);
                    document.getElementById('frameRateValue').textContent = this.frameRate;
                });

                // 变换工具
                document.getElementById('flipH').addEventListener('click', () => this.flipHorizontal());
                document.getElementById('flipV').addEventListener('click', () => this.flipVertical());
                document.getElementById('rotateL').addEventListener('click', () => this.rotate(-90));
                document.getElementById('rotateR').addEventListener('click', () => this.rotate(90));

                // 画布设置
                document.getElementById('resizeCanvas').addEventListener('click', () => this.resizeCanvas());
                document.getElementById('clearCanvas').addEventListener('click', () => this.clearCanvas());

                // 文件操作
                document.getElementById('newProject').addEventListener('click', () => this.newProject());
                document.getElementById('saveProject').addEventListener('click', () => this.saveProject());
                document.getElementById('loadProject').addEventListener('click', () => this.loadProject());
                document.getElementById('exportPNG').addEventListener('click', () => this.exportPNG());
                document.getElementById('exportGIF').addEventListener('click', () => this.exportGIF());

                // 键盘快捷键
                document.addEventListener('keydown', (e) => this.handleKeyboard(e));

                // 全屏控制
                document.getElementById('fullscreen').addEventListener('click', () => this.toggleFullscreen());
            }

            setupColorPalette() {
                const palette = document.getElementById('colorPalette');
                palette.innerHTML = '';

                this.defaultPalette.forEach((color, index) => {
                    const swatch = document.createElement('div');
                    swatch.className = 'color-swatch';
                    swatch.style.backgroundColor = color;
                    swatch.addEventListener('click', () => {
                        this.currentColor = color;
                        this.updateColorSelection();
                        document.getElementById('colorPicker').value = color;
                    });
                    palette.appendChild(swatch);

                    if (index === 0) {
                        swatch.classList.add('active');
                    }
                });
            }

            updateColorSelection() {
                document.querySelectorAll('.color-swatch').forEach(swatch => {
                    swatch.classList.toggle('active', 
                        this.rgbToHex(swatch.style.backgroundColor) === this.currentColor.toLowerCase()
                    );
                });
            }

            addColorToPalette(color) {
                if (this.defaultPalette.includes(color)) return;

                this.defaultPalette.push(color);
                const palette = document.getElementById('colorPalette');
                const swatch = document.createElement('div');
                swatch.className = 'color-swatch';
                swatch.style.backgroundColor = color;
                swatch.addEventListener('click', () => {
                    this.currentColor = color;
                    this.updateColorSelection();
                    document.getElementById('colorPicker').value = color;
                });
                palette.appendChild(swatch);
            }

            setupLayers() {
                this.updateLayersList();
            }

            updateLayersList() {
                const layersList = document.getElementById('layersList');
                layersList.innerHTML = '';

                this.layers.forEach((layer, index) => {
                    const layerItem = document.createElement('div');
                    layerItem.className = 'layer-item';
                    if (index === this.currentLayer) {
                        layerItem.classList.add('active');
                    }

                    layerItem.innerHTML = `
                        <div class="layer-name">${layer.name}</div>
                        <div class="layer-controls">
                            <button class="layer-btn" data-action="toggle" data-layer="${index}">
                                ${layer.visible ? '👁️' : '🙈'}
                            </button>
                            <button class="layer-btn" data-action="delete" data-layer="${index}">🗑️</button>
                        </div>
                    `;

                    layerItem.addEventListener('click', (e) => {
                        if (!e.target.classList.contains('layer-btn')) {
                            this.selectLayer(index);
                        }
                    });

                    layersList.appendChild(layerItem);
                });

                // 图层按钮事件
                document.querySelectorAll('.layer-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const action = e.target.dataset.action;
                        const layerIndex = parseInt(e.target.dataset.layer);

                        if (action === 'toggle') {
                            this.toggleLayerVisibility(layerIndex);
                        } else if (action === 'delete') {
                            this.deleteLayer(layerIndex);
                        }
                    });
                });
            }

            setupFrames() {
                this.updateFrameTimeline();
            }

            updateFrameTimeline() {
                const timeline = document.getElementById('frameTimeline');
                timeline.innerHTML = '';

                this.frames.forEach((frame, index) => {
                    const thumb = document.createElement('div');
                    thumb.className = 'frame-thumb';
                    if (index === this.currentFrame) {
                        thumb.classList.add('active');
                    }

                    thumb.addEventListener('click', () => {
                        this.selectFrame(index);
                    });

                    timeline.appendChild(thumb);
                });

                this.updateCanvasInfo();
            }

            getPixelCoordinates(e) {
                const rect = this.canvas.getBoundingClientRect();
                const x = Math.floor((e.clientX - rect.left) / this.pixelSize);
                const y = Math.floor((e.clientY - rect.top) / this.pixelSize);
                return { x: Math.max(0, Math.min(x, this.canvasWidth - 1)), 
                        y: Math.max(0, Math.min(y, this.canvasHeight - 1)) };
            }

            startDrawing(e) {
                this.isDrawing = true;
                const coords = this.getPixelCoordinates(e);
                this.lastX = coords.x;
                this.lastY = coords.y;

                this.saveState();

                if (this.currentTool === 'bucket') {
                    this.floodFill(coords.x, coords.y);
                } else if (this.currentTool === 'eyedropper') {
                    this.pickColor(coords.x, coords.y);
                } else {
                    this.drawPixel(coords.x, coords.y);
                }
            }

            draw(e) {
                if (!this.isDrawing) return;

                const coords = this.getPixelCoordinates(e);

                if (this.currentTool === 'pencil' || this.currentTool === 'brush' || this.currentTool === 'eraser') {
                    this.drawLine(this.lastX, this.lastY, coords.x, coords.y);
                    this.lastX = coords.x;
                    this.lastY = coords.y;
                }
            }

            stopDrawing() {
                if (this.isDrawing) {
                    this.isDrawing = false;
                    this.updatePreview();
                    this.renderCanvas();
                }
            }

            drawPixel(x, y) {
                const layer = this.layers[this.currentLayer];
                if (!layer || !layer.visible) return;

                const ctx = layer.canvas.getContext('2d');
                
                for (let dx = 0; dx < this.brushSize; dx++) {
                    for (let dy = 0; dy < this.brushSize; dy++) {
                        const px = x + dx;
                        const py = y + dy;
                        
                        if (px >= 0 && px < this.canvasWidth && py >= 0 && py < this.canvasHeight) {
                            if (this.currentTool === 'eraser') {
                                ctx.clearRect(px, py, 1, 1);
                            } else {
                                ctx.fillStyle = this.currentColor;
                                ctx.fillRect(px, py, 1, 1);
                            }
                        }
                    }
                }

                this.renderCanvas();
            }

            drawLine(x0, y0, x1, y1) {
                const dx = Math.abs(x1 - x0);
                const dy = Math.abs(y1 - y0);
                const sx = x0 < x1 ? 1 : -1;
                const sy = y0 < y1 ? 1 : -1;
                let err = dx - dy;

                let x = x0;
                let y = y0;

                while (true) {
                    this.drawPixel(x, y);

                    if (x === x1 && y === y1) break;

                    const e2 = 2 * err;
                    if (e2 > -dy) {
                        err -= dy;
                        x += sx;
                    }
                    if (e2 < dx) {
                        err += dx;
                        y += sy;
                    }
                }
            }

            floodFill(startX, startY) {
                const layer = this.layers[this.currentLayer];
                if (!layer || !layer.visible) return;

                const ctx = layer.canvas.getContext('2d');
                const imageData = ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
                const data = imageData.data;

                const startIndex = (startY * this.canvasWidth + startX) * 4;
                const startR = data[startIndex];
                const startG = data[startIndex + 1];
                const startB = data[startIndex + 2];
                const startA = data[startIndex + 3];

                const targetColor = this.hexToRgb(this.currentColor);
                
                if (startR === targetColor.r && startG === targetColor.g && 
                    startB === targetColor.b && startA === 255) {
                    return;
                }

                const stack = [[startX, startY]];
                const visited = new Set();

                while (stack.length > 0) {
                    const [x, y] = stack.pop();
                    const key = `${x},${y}`;
                    
                    if (visited.has(key) || x < 0 || x >= this.canvasWidth || 
                        y < 0 || y >= this.canvasHeight) {
                        continue;
                    }

                    const index = (y * this.canvasWidth + x) * 4;
                    if (data[index] !== startR || data[index + 1] !== startG || 
                        data[index + 2] !== startB || data[index + 3] !== startA) {
                        continue;
                    }

                    visited.add(key);
                    
                    data[index] = targetColor.r;
                    data[index + 1] = targetColor.g;
                    data[index + 2] = targetColor.b;
                    data[index + 3] = 255;

                    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
                }

                ctx.putImageData(imageData, 0, 0);
                this.renderCanvas();
            }

            pickColor(x, y) {
                const layer = this.layers[this.currentLayer];
                if (!layer) return;

                const ctx = layer.canvas.getContext('2d');
                const imageData = ctx.getImageData(x, y, 1, 1);
                const data = imageData.data;

                if (data[3] > 0) {
                    const hex = `#${((data[0] << 16) | (data[1] << 8) | data[2]).toString(16).padStart(6, '0')}`;
                    this.currentColor = hex.toUpperCase();
                    document.getElementById('colorPicker').value = this.currentColor;
                    this.updateColorSelection();
                    this.updateStatus(`选择颜色: ${this.currentColor}`);
                }
            }

            renderCanvas() {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

                this.layers.forEach(layer => {
                    if (layer.visible && layer.canvas) {
                        this.ctx.globalAlpha = layer.opacity;
                        this.ctx.drawImage(layer.canvas, 0, 0, this.canvas.width, this.canvas.height);
                    }
                });

                this.ctx.globalAlpha = 1;
            }

            drawGrid() {
                if (!this.showGrid) {
                    this.gridCtx.clearRect(0, 0, this.gridCanvas.width, this.gridCanvas.height);
                    return;
                }

                this.gridCtx.clearRect(0, 0, this.gridCanvas.width, this.gridCanvas.height);
                this.gridCtx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
                this.gridCtx.lineWidth = 1;

                for (let x = 0; x <= this.canvasWidth; x++) {
                    this.gridCtx.beginPath();
                    this.gridCtx.moveTo(x * this.pixelSize, 0);
                    this.gridCtx.lineTo(x * this.pixelSize, this.canvas.height);
                    this.gridCtx.stroke();
                }

                for (let y = 0; y <= this.canvasHeight; y++) {
                    this.gridCtx.beginPath();
                    this.gridCtx.moveTo(0, y * this.pixelSize);
                    this.gridCtx.lineTo(this.canvas.width, y * this.pixelSize);
                    this.gridCtx.stroke();
                }
            }

            updatePreview() {
                const scale = this.previewCanvas.width / this.canvasWidth;
                this.previewCtx.clearRect(0, 0, this.previewCanvas.width, this.previewCanvas.height);

                this.layers.forEach(layer => {
                    if (layer.visible && layer.canvas) {
                        this.previewCtx.globalAlpha = layer.opacity;
                        this.previewCtx.drawImage(layer.canvas, 0, 0, 
                            this.previewCanvas.width, this.previewCanvas.height);
                    }
                });

                this.previewCtx.globalAlpha = 1;
            }

            updateBrushPreview() {
                const preview = document.getElementById('brushPreview');
                const size = Math.min(this.brushSize * 2, 20);
                preview.style.width = size + 'px';
                preview.style.height = size + 'px';
                preview.style.backgroundColor = this.currentColor;
            }

            // 图层管理
            addLayer() {
                const layerNumber = this.layers.length + 1;
                const newLayer = {
                    name: `图层 ${layerNumber}`,
                    canvas: this.createLayerCanvas(),
                    visible: true,
                    opacity: 1
                };

                this.layers.push(newLayer);
                this.currentLayer = this.layers.length - 1;
                this.updateLayersList();
                this.updateStatus(`添加了新图层: ${newLayer.name}`);
            }

            selectLayer(index) {
                this.currentLayer = index;
                this.updateLayersList();
                this.updateStatus(`选择图层: ${this.layers[index].name}`);
            }

            toggleLayerVisibility(index) {
                this.layers[index].visible = !this.layers[index].visible;
                this.updateLayersList();
                this.renderCanvas();
                this.updatePreview();
            }

            deleteLayer(index) {
                if (this.layers.length === 1) {
                    this.updateStatus('无法删除最后一个图层');
                    return;
                }

                this.layers.splice(index, 1);
                if (this.currentLayer >= this.layers.length) {
                    this.currentLayer = this.layers.length - 1;
                }
                this.updateLayersList();
                this.renderCanvas();
                this.updatePreview();
                this.updateStatus('图层已删除');
            }

            // 帧管理
            addFrame() {
                const newFrame = { layers: [] };
                this.layers.forEach(layer => {
                    newFrame.layers.push(this.copyCanvas(layer.canvas));
                });

                this.frames.push(newFrame);
                this.currentFrame = this.frames.length - 1;
                this.updateFrameTimeline();
                this.updateStatus(`添加了新帧: ${this.currentFrame + 1}`);
            }

            selectFrame(index) {
                // 保存当前帧
                this.frames[this.currentFrame].layers = [];
                this.layers.forEach(layer => {
                    this.frames[this.currentFrame].layers.push(this.copyCanvas(layer.canvas));
                });

                // 切换到新帧
                this.currentFrame = index;
                const frame = this.frames[this.currentFrame];
                
                if (frame.layers.length > 0) {
                    frame.layers.forEach((layerCanvas, layerIndex) => {
                        if (this.layers[layerIndex] && layerCanvas) {
                            const ctx = this.layers[layerIndex].canvas.getContext('2d');
                            ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
                            ctx.drawImage(layerCanvas, 0, 0);
                        }
                    });
                }

                this.updateFrameTimeline();
                this.renderCanvas();
                this.updatePreview();
            }

            deleteFrame() {
                if (this.frames.length === 1) {
                    this.updateStatus('无法删除最后一帧');
                    return;
                }

                this.frames.splice(this.currentFrame, 1);
                if (this.currentFrame >= this.frames.length) {
                    this.currentFrame = this.frames.length - 1;
                }
                this.selectFrame(this.currentFrame);
                this.updateStatus('帧已删除');
            }

            toggleAnimation() {
                if (this.isPlaying) {
                    this.stopAnimation();
                } else {
                    this.playAnimation();
                }
            }

            playAnimation() {
                if (this.frames.length < 2) {
                    this.updateStatus('需要至少2帧才能播放动画');
                    return;
                }

                this.isPlaying = true;
                document.getElementById('playAnimation').textContent = '停止';
                
                let frameIndex = 0;
                const frameDelay = 1000 / this.frameRate;

                this.animationInterval = setInterval(() => {
                    this.selectFrame(frameIndex);
                    frameIndex = (frameIndex + 1) % this.frames.length;
                }, frameDelay);

                this.updateStatus('动画播放中...');
            }

            stopAnimation() {
                this.isPlaying = false;
                document.getElementById('playAnimation').textContent = '播放';
                
                if (this.animationInterval) {
                    clearInterval(this.animationInterval);
                    this.animationInterval = null;
                }

                this.updateStatus('动画已停止');
            }

            // 变换工具
            flipHorizontal() {
                const layer = this.layers[this.currentLayer];
                if (!layer) return;

                this.saveState();
                const ctx = layer.canvas.getContext('2d');
                const imageData = ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
                
                ctx.save();
                ctx.scale(-1, 1);
                ctx.drawImage(layer.canvas, -this.canvasWidth, 0);
                ctx.restore();

                this.renderCanvas();
                this.updatePreview();
                this.updateStatus('水平翻转完成');
            }

            flipVertical() {
                const layer = this.layers[this.currentLayer];
                if (!layer) return;

                this.saveState();
                const ctx = layer.canvas.getContext('2d');
                
                ctx.save();
                ctx.scale(1, -1);
                ctx.drawImage(layer.canvas, 0, -this.canvasHeight);
                ctx.restore();

                this.renderCanvas();
                this.updatePreview();
                this.updateStatus('垂直翻转完成');
            }

            rotate(degrees) {
                const layer = this.layers[this.currentLayer];
                if (!layer) return;

                this.saveState();
                const ctx = layer.canvas.getContext('2d');
                const tempCanvas = this.copyCanvas(layer.canvas);
                
                ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
                ctx.save();
                ctx.translate(this.canvasWidth / 2, this.canvasHeight / 2);
                ctx.rotate(degrees * Math.PI / 180);
                ctx.drawImage(tempCanvas, -this.canvasWidth / 2, -this.canvasHeight / 2);
                ctx.restore();

                this.renderCanvas();
                this.updatePreview();
                this.updateStatus(`旋转 ${degrees}° 完成`);
            }

            // 画布操作
            resizeCanvas() {
                const newWidth = parseInt(document.getElementById('canvasWidth').value);
                const newHeight = parseInt(document.getElementById('canvasHeight').value);

                if (newWidth < 8 || newWidth > 128 || newHeight < 8 || newHeight > 128) {
                    this.updateStatus('画布尺寸必须在8-128之间');
                    return;
                }

                this.saveState();
                this.canvasWidth = newWidth;
                this.canvasHeight = newHeight;
                this.pixelSize = Math.min(640 / this.canvasWidth, 640 / this.canvasHeight);

                this.setupCanvas();
                this.drawGrid();
                this.renderCanvas();
                this.updatePreview();
                this.updateCanvasInfo();
                this.updateStatus(`画布调整为 ${newWidth}×${newHeight}`);
            }

            clearCanvas() {
                if (confirm('确定要清空当前图层吗？')) {
                    this.saveState();
                    const layer = this.layers[this.currentLayer];
                    if (layer) {
                        const ctx = layer.canvas.getContext('2d');
                        ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
                        this.renderCanvas();
                        this.updatePreview();
                        this.updateStatus('画布已清空');
                    }
                }
            }

            // 缩放控制
            zoomIn() {
                this.zoom = Math.min(this.zoom * 1.2, 5);
                this.updateZoom();
            }

            zoomOut() {
                this.zoom = Math.max(this.zoom / 1.2, 0.1);
                this.updateZoom();
            }

            updateZoom() {
                const container = document.getElementById('canvasContainer');
                container.style.transform = `scale(${this.zoom})`;
                document.getElementById('zoomLevel').textContent = `${Math.round(this.zoom * 100)}%`;
            }

            toggleGrid() {
                this.showGrid = !this.showGrid;
                this.drawGrid();
                document.getElementById('toggleGrid').textContent = this.showGrid ? '隐藏网格' : '显示网格';
            }

            // 历史记录
            saveState() {
                const state = {
                    layers: this.layers.map(layer => ({
                        ...layer,
                        canvas: this.copyCanvas(layer.canvas)
                    })),
                    currentLayer: this.currentLayer
                };

                this.historyStep++;
                if (this.historyStep < this.history.length) {
                    this.history.length = this.historyStep;
                }

                this.history.push(state);
                if (this.history.length > this.maxHistorySteps) {
                    this.history.shift();
                    this.historyStep--;
                }
            }

            undo() {
                if (this.historyStep > 0) {
                    this.historyStep--;
                    this.restoreState(this.history[this.historyStep]);
                    this.updateStatus('撤销操作');
                }
            }

            redo() {
                if (this.historyStep < this.history.length - 1) {
                    this.historyStep++;
                    this.restoreState(this.history[this.historyStep]);
                    this.updateStatus('重做操作');
                }
            }

            restoreState(state) {
                this.layers = state.layers.map(layer => ({
                    ...layer,
                    canvas: this.copyCanvas(layer.canvas)
                }));
                this.currentLayer = state.currentLayer;
                this.updateLayersList();
                this.renderCanvas();
                this.updatePreview();
            }

            // 文件操作
            newProject() {
                if (confirm('确定要创建新项目吗？当前工作将会丢失。')) {
                    this.layers = [{ name: '图层 1', canvas: this.createLayerCanvas(), visible: true, opacity: 1 }];
                    this.currentLayer = 0;
                    this.frames = [{ layers: [this.copyCanvas(this.layers[0].canvas)] }];
                    this.currentFrame = 0;
                    this.history = [];
                    this.historyStep = -1;

                    this.updateLayersList();
                    this.updateFrameTimeline();
                    this.renderCanvas();
                    this.updatePreview();
                    this.updateStatus('新项目已创建');
                }
            }

            saveProject() {
                const projectData = {
                    canvasWidth: this.canvasWidth,
                    canvasHeight: this.canvasHeight,
                    layers: this.layers.map(layer => ({
                        name: layer.name,
                        visible: layer.visible,
                        opacity: layer.opacity,
                        imageData: layer.canvas.toDataURL()
                    })),
                    frames: this.frames.map(frame => ({
                        layers: frame.layers.map(canvas => canvas.toDataURL())
                    })),
                    currentLayer: this.currentLayer,
                    currentFrame: this.currentFrame,
                    palette: this.defaultPalette
                };

                const blob = new Blob([JSON.stringify(projectData)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'pixel-art-project.json';
                a.click();
                URL.revokeObjectURL(url);

                this.updateStatus('项目已保存');
            }

            loadProject() {
                document.getElementById('fileInput').click();
                document.getElementById('fileInput').onchange = (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            try {
                                const projectData = JSON.parse(e.target.result);
                                this.loadProjectData(projectData);
                                this.updateStatus('项目已加载');
                            } catch (error) {
                                this.updateStatus('加载项目失败');
                            }
                        };
                        reader.readAsText(file);
                    }
                };
            }

            loadProjectData(data) {
                this.canvasWidth = data.canvasWidth;
                this.canvasHeight = data.canvasHeight;
                
                document.getElementById('canvasWidth').value = this.canvasWidth;
                document.getElementById('canvasHeight').value = this.canvasHeight;

                this.setupCanvas();

                // 加载图层
                this.layers = data.layers.map(layerData => {
                    const layer = {
                        name: layerData.name,
                        visible: layerData.visible,
                        opacity: layerData.opacity,
                        canvas: this.createLayerCanvas()
                    };

                    const img = new Image();
                    img.onload = () => {
                        const ctx = layer.canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, this.canvasWidth, this.canvasHeight);
                        this.renderCanvas();
                        this.updatePreview();
                    };
                    img.src = layerData.imageData;

                    return layer;
                });

                this.currentLayer = data.currentLayer;
                this.currentFrame = data.currentFrame;

                if (data.palette) {
                    this.defaultPalette = data.palette;
                    this.setupColorPalette();
                }

                this.updateLayersList();
                this.updateFrameTimeline();
                this.updateCanvasInfo();
                this.drawGrid();
            }

            exportPNG() {
                const exportCanvas = document.createElement('canvas');
                exportCanvas.width = this.canvasWidth;
                exportCanvas.height = this.canvasHeight;
                const exportCtx = exportCanvas.getContext('2d');

                this.layers.forEach(layer => {
                    if (layer.visible && layer.canvas) {
                        exportCtx.globalAlpha = layer.opacity;
                        exportCtx.drawImage(layer.canvas, 0, 0);
                    }
                });

                exportCtx.globalAlpha = 1;

                const link = document.createElement('a');
                link.download = 'pixel-art.png';
                link.href = exportCanvas.toDataURL();
                link.click();

                this.updateStatus('PNG已导出');
            }

            exportGIF() {
                if (this.frames.length === 1) {
                    this.updateStatus('需要多帧才能导出GIF');
                    return;
                }

                this.updateStatus('GIF导出功能需要额外的库支持');
            }

            // 键盘快捷键
            handleKeyboard(e) {
                if (e.target.matches('input, textarea')) return;

                switch (e.key.toLowerCase()) {
                    case 'z':
                        if (e.ctrlKey || e.metaKey) {
                            e.preventDefault();
                            if (e.shiftKey) {
                                this.redo();
                            } else {
                                this.undo();
                            }
                        }
                        break;
                    case 'g':
                        e.preventDefault();
                        this.toggleGrid();
                        break;
                    case ' ':
                        e.preventDefault();
                        this.toggleAnimation();
                        break;
                    case 'b':
                        this.selectTool('brush');
                        break;
                    case 'p':
                        this.selectTool('pencil');
                        break;
                    case 'e':
                        this.selectTool('eraser');
                        break;
                    case 'f':
                        this.selectTool('bucket');
                        break;
                    case 'i':
                        this.selectTool('eyedropper');
                        break;
                }
            }

            selectTool(tool) {
                document.querySelectorAll('.tool-btn').forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.tool === tool);
                });
                this.currentTool = tool;
                this.updateStatus(`切换到 ${this.getToolName(tool)}`);
            }

            toggleFullscreen() {
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen();
                } else {
                    document.exitFullscreen();
                }
            }

            // 工具函数
            copyCanvas(canvas) {
                const newCanvas = document.createElement('canvas');
                newCanvas.width = canvas.width;
                newCanvas.height = canvas.height;
                const newCtx = newCanvas.getContext('2d');
                newCtx.drawImage(canvas, 0, 0);
                return newCanvas;
            }

            hexToRgb(hex) {
                const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? {
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16)
                } : null;
            }

            rgbToHex(rgb) {
                const match = rgb.match(/\d+/g);
                if (!match) return '#000000';
                
                const hex = ((parseInt(match[0]) << 16) | (parseInt(match[1]) << 8) | parseInt(match[2])).toString(16);
                return '#' + hex.padStart(6, '0');
            }

            getToolName(tool) {
                const names = {
                    pencil: '铅笔',
                    brush: '画笔',
                    eraser: '橡皮',
                    bucket: '油漆桶',
                    eyedropper: '吸管',
                    line: '直线',
                    rectangle: '矩形',
                    circle: '圆形'
                };
                return names[tool] || tool;
            }

            updateStatus(message) {
                document.getElementById('statusText').textContent = message;
                setTimeout(() => {
                    document.getElementById('statusText').textContent = '就绪 - 选择工具开始创作';
                }, 3000);
            }

            updateCanvasInfo() {
                document.getElementById('canvasInfo').textContent = 
                    `画布: ${this.canvasWidth}×${this.canvasHeight} | 当前帧: ${this.currentFrame + 1}/${this.frames.length}`;
            }
        }

        // 初始化编辑器
        document.addEventListener('DOMContentLoaded', () => {
            new PixelArtEditor();
        });