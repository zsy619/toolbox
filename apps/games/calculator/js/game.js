class Calculator {
            constructor() {
                this.display = document.getElementById('displayMain');
                this.historyDisplay = document.getElementById('displayHistory');
                this.unitDisplay = document.getElementById('displayUnit');
                this.errorDisplay = document.getElementById('errorDisplay');
                
                this.currentInput = '0';
                this.previousInput = '';
                this.operator = '';
                this.shouldResetDisplay = false;
                this.memory = 0;
                this.history = [];
                this.isScientificMode = false;
                this.angleUnit = 'deg';
                this.settings = {
                    sound: true,
                    haptic: true
                };

                this.converters = {
                    length: {
                        name: '长度',
                        units: {
                            'm': '米',
                            'km': '千米',
                            'cm': '厘米',
                            'mm': '毫米',
                            'ft': '英尺',
                            'in': '英寸',
                            'yd': '码'
                        },
                        base: 'm',
                        factors: {
                            'm': 1,
                            'km': 0.001,
                            'cm': 100,
                            'mm': 1000,
                            'ft': 3.28084,
                            'in': 39.3701,
                            'yd': 1.09361
                        }
                    },
                    weight: {
                        name: '重量',
                        units: {
                            'kg': '千克',
                            'g': '克',
                            'lb': '磅',
                            'oz': '盎司',
                            't': '吨'
                        },
                        base: 'kg',
                        factors: {
                            'kg': 1,
                            'g': 1000,
                            'lb': 2.20462,
                            'oz': 35.274,
                            't': 0.001
                        }
                    },
                    temperature: {
                        name: '温度',
                        units: {
                            'c': '摄氏度',
                            'f': '华氏度',
                            'k': '开尔文'
                        },
                        convert: (value, from, to) => {
                            let celsius;
                            switch (from) {
                                case 'c': celsius = value; break;
                                case 'f': celsius = (value - 32) * 5/9; break;
                                case 'k': celsius = value - 273.15; break;
                            }
                            
                            switch (to) {
                                case 'c': return celsius;
                                case 'f': return celsius * 9/5 + 32;
                                case 'k': return celsius + 273.15;
                            }
                        }
                    },
                    area: {
                        name: '面积',
                        units: {
                            'm2': '平方米',
                            'km2': '平方千米',
                            'cm2': '平方厘米',
                            'ft2': '平方英尺',
                            'in2': '平方英寸'
                        },
                        base: 'm2',
                        factors: {
                            'm2': 1,
                            'km2': 0.000001,
                            'cm2': 10000,
                            'ft2': 10.7639,
                            'in2': 1550
                        }
                    },
                    volume: {
                        name: '体积',
                        units: {
                            'l': '升',
                            'ml': '毫升',
                            'm3': '立方米',
                            'gal': '加仑',
                            'fl_oz': '液体盎司'
                        },
                        base: 'l',
                        factors: {
                            'l': 1,
                            'ml': 1000,
                            'm3': 0.001,
                            'gal': 0.264172,
                            'fl_oz': 33.814
                        }
                    }
                };

                this.themes = {
                    default: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    sunset: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
                    ocean: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                    forest: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
                    night: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
                    fire: 'linear-gradient(135deg, #ff6b6b 0%, #ffd93d 100%)'
                };

                this.init();
            }

            init() {
                this.setupEventListeners();
                this.setupConverter();
                this.loadSettings();
                this.updateDisplay();
                this.updateMemoryDisplay();
            }

            setupEventListeners() {
                // 计算器按钮事件
                document.getElementById('calculatorButtons').addEventListener('click', (e) => {
                    if (e.target.classList.contains('calc-button')) {
                        this.handleButtonClick(e.target);
                        this.addRipple(e.target, e);
                    }
                });

                // 科学计算器按钮事件
                document.getElementById('scientificPanel').addEventListener('click', (e) => {
                    if (e.target.classList.contains('scientific-btn')) {
                        this.handleScientificFunction(e.target.dataset.action);
                        this.addRipple(e.target, e);
                    }
                });

                // 模式切换
                document.querySelectorAll('.mode-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        if (e.target.dataset.mode) {
                            this.switchMode(e.target.dataset.mode);
                        }
                    });
                });

                // 内存操作
                document.querySelectorAll('.memory-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        this.handleMemoryOperation(e.target.dataset.action);
                    });
                });

                // 历史记录
                document.getElementById('clearHistory').addEventListener('click', () => {
                    this.clearHistory();
                });

                document.getElementById('historyList').addEventListener('click', (e) => {
                    const historyItem = e.target.closest('.history-item');
                    if (historyItem) {
                        const result = historyItem.querySelector('.history-result').textContent;
                        this.currentInput = result;
                        this.updateDisplay();
                    }
                });

                // 单位换算
                document.getElementById('converterType').addEventListener('change', () => {
                    this.setupConverter();
                });

                document.getElementById('converterInput').addEventListener('input', () => {
                    this.performConversion();
                });

                document.getElementById('converterFrom').addEventListener('change', () => {
                    this.performConversion();
                });

                document.getElementById('converterTo').addEventListener('change', () => {
                    this.performConversion();
                });

                // 主题切换
                document.querySelectorAll('.theme-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        this.setTheme(e.target.dataset.theme);
                    });
                });

                // 设置
                document.getElementById('soundToggle').addEventListener('click', () => {
                    this.toggleSetting('sound');
                });

                document.getElementById('hapticToggle').addEventListener('click', () => {
                    this.toggleSetting('haptic');
                });

                document.getElementById('angleUnit').addEventListener('change', (e) => {
                    this.angleUnit = e.target.value;
                    this.saveSettings();
                });

                // 键盘事件
                document.addEventListener('keydown', (e) => {
                    this.handleKeyboard(e);
                });

                // 阻止右键菜单
                document.addEventListener('contextmenu', (e) => {
                    if (e.target.closest('.calc-button')) {
                        e.preventDefault();
                    }
                });
            }

            handleButtonClick(button) {
                const action = button.dataset.action;
                const value = button.dataset.value;

                this.playSound();
                this.triggerHaptic();

                switch (action) {
                    case 'digit':
                        this.inputDigit(value);
                        break;
                    case 'decimal':
                        this.inputDecimal();
                        break;
                    case 'add':
                    case 'subtract':
                    case 'multiply':
                    case 'divide':
                        this.inputOperator(action);
                        break;
                    case 'equals':
                        this.calculate();
                        break;
                    case 'clear':
                        this.clear();
                        break;
                    case 'clearEntry':
                        this.clearEntry();
                        break;
                    case 'backspace':
                        this.backspace();
                        break;
                }
            }

            inputDigit(digit) {
                if (this.shouldResetDisplay) {
                    this.currentInput = '';
                    this.shouldResetDisplay = false;
                }

                if (this.currentInput === '0') {
                    this.currentInput = digit;
                } else {
                    this.currentInput += digit;
                }

                this.updateDisplay();
            }

            inputDecimal() {
                if (this.shouldResetDisplay) {
                    this.currentInput = '0';
                    this.shouldResetDisplay = false;
                }

                if (!this.currentInput.includes('.')) {
                    this.currentInput += '.';
                }

                this.updateDisplay();
            }

            inputOperator(operator) {
                if (this.operator && !this.shouldResetDisplay) {
                    this.calculate();
                }

                this.previousInput = this.currentInput;
                this.operator = operator;
                this.shouldResetDisplay = true;

                this.updateHistoryDisplay();
            }

            calculate() {
                if (!this.operator || !this.previousInput) return;

                try {
                    const prev = parseFloat(this.previousInput);
                    const current = parseFloat(this.currentInput);
                    let result;

                    switch (this.operator) {
                        case 'add':
                            result = prev + current;
                            break;
                        case 'subtract':
                            result = prev - current;
                            break;
                        case 'multiply':
                            result = prev * current;
                            break;
                        case 'divide':
                            if (current === 0) {
                                throw new Error('除数不能为零');
                            }
                            result = prev / current;
                            break;
                        default:
                            return;
                    }

                    this.addToHistory(this.formatExpression(), result);
                    this.currentInput = this.formatResult(result);
                    this.operator = '';
                    this.previousInput = '';
                    this.shouldResetDisplay = true;

                    this.historyDisplay.textContent = '';
                    this.updateDisplay();
                } catch (error) {
                    this.showError(error.message);
                }
            }

            handleScientificFunction(func) {
                try {
                    const current = parseFloat(this.currentInput);
                    let result;

                    switch (func) {
                        case 'sin':
                            result = Math.sin(this.toRadians(current));
                            break;
                        case 'cos':
                            result = Math.cos(this.toRadians(current));
                            break;
                        case 'tan':
                            result = Math.tan(this.toRadians(current));
                            break;
                        case 'asin':
                            result = this.toDegrees(Math.asin(current));
                            break;
                        case 'acos':
                            result = this.toDegrees(Math.acos(current));
                            break;
                        case 'atan':
                            result = this.toDegrees(Math.atan(current));
                            break;
                        case 'log':
                            result = Math.log10(current);
                            break;
                        case 'ln':
                            result = Math.log(current);
                            break;
                        case 'sqrt':
                            result = Math.sqrt(current);
                            break;
                        case 'cbrt':
                            result = Math.cbrt(current);
                            break;
                        case 'factorial':
                            result = this.factorial(current);
                            break;
                        case 'pi':
                            this.currentInput = Math.PI.toString();
                            this.updateDisplay();
                            return;
                        case 'e':
                            this.currentInput = Math.E.toString();
                            this.updateDisplay();
                            return;
                        case 'exp':
                            result = Math.exp(current);
                            break;
                        case 'power':
                            this.inputOperator('power');
                            return;
                        default:
                            return;
                    }

                    if (isNaN(result) || !isFinite(result)) {
                        throw new Error('无效的数学运算');
                    }

                    this.addToHistory(`${func}(${current})`, result);
                    this.currentInput = this.formatResult(result);
                    this.shouldResetDisplay = true;
                    this.updateDisplay();
                } catch (error) {
                    this.showError(error.message);
                }
            }

            factorial(n) {
                if (n < 0 || n !== Math.floor(n)) {
                    throw new Error('阶乘仅适用于非负整数');
                }
                if (n > 170) {
                    throw new Error('数字过大');
                }
                
                let result = 1;
                for (let i = 2; i <= n; i++) {
                    result *= i;
                }
                return result;
            }

            toRadians(degrees) {
                return this.angleUnit === 'deg' ? degrees * (Math.PI / 180) : degrees;
            }

            toDegrees(radians) {
                return this.angleUnit === 'deg' ? radians * (180 / Math.PI) : radians;
            }

            clear() {
                this.currentInput = '0';
                this.previousInput = '';
                this.operator = '';
                this.shouldResetDisplay = false;
                this.historyDisplay.textContent = '';
                this.unitDisplay.textContent = '';
                this.hideError();
                this.updateDisplay();
            }

            clearEntry() {
                this.currentInput = '0';
                this.updateDisplay();
            }

            backspace() {
                if (this.currentInput.length > 1) {
                    this.currentInput = this.currentInput.slice(0, -1);
                } else {
                    this.currentInput = '0';
                }
                this.updateDisplay();
            }

            handleMemoryOperation(operation) {
                const current = parseFloat(this.currentInput);

                switch (operation) {
                    case 'memoryStore':
                        this.memory = current;
                        break;
                    case 'memoryRecall':
                        this.currentInput = this.memory.toString();
                        this.shouldResetDisplay = true;
                        break;
                    case 'memoryAdd':
                        this.memory += current;
                        break;
                    case 'memoryClear':
                        this.memory = 0;
                        break;
                }

                this.updateMemoryDisplay();
                this.updateDisplay();
            }

            switchMode(mode) {
                this.isScientificMode = mode === 'scientific';
                
                document.querySelectorAll('.mode-btn').forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.mode === mode);
                });

                const scientificPanel = document.getElementById('scientificPanel');
                scientificPanel.classList.toggle('show', this.isScientificMode);
            }

            setupConverter() {
                const type = document.getElementById('converterType').value;
                const converter = this.converters[type];
                
                const fromSelect = document.getElementById('converterFrom');
                const toSelect = document.getElementById('converterTo');
                
                fromSelect.innerHTML = '';
                toSelect.innerHTML = '';
                
                Object.entries(converter.units).forEach(([key, value]) => {
                    const fromOption = new Option(value, key);
                    const toOption = new Option(value, key);
                    fromSelect.appendChild(fromOption);
                    toSelect.appendChild(toOption);
                });

                this.performConversion();
            }

            performConversion() {
                const input = document.getElementById('converterInput').value;
                const type = document.getElementById('converterType').value;
                const from = document.getElementById('converterFrom').value;
                const to = document.getElementById('converterTo').value;
                const resultDiv = document.getElementById('converterResult');

                if (!input || isNaN(input)) {
                    resultDiv.textContent = '请输入有效数字';
                    return;
                }

                const value = parseFloat(input);
                const converter = this.converters[type];
                let result;

                if (converter.convert) {
                    result = converter.convert(value, from, to);
                } else {
                    const baseValue = value / converter.factors[from];
                    result = baseValue * converter.factors[to];
                }

                resultDiv.textContent = `${this.formatResult(result)} ${converter.units[to]}`;
            }

            addToHistory(expression, result) {
                const historyItem = {
                    expression: expression,
                    result: this.formatResult(result),
                    timestamp: new Date().toLocaleTimeString()
                };

                this.history.unshift(historyItem);
                if (this.history.length > 50) {
                    this.history.pop();
                }

                this.updateHistoryList();
                this.saveHistory();
            }

            updateHistoryList() {
                const historyList = document.getElementById('historyList');
                
                if (this.history.length === 0) {
                    historyList.innerHTML = '<div style="text-align: center; color: rgba(255,255,255,0.5); padding: 20px;">暂无计算记录</div>';
                    return;
                }

                historyList.innerHTML = '';
                this.history.slice(0, 10).forEach(item => {
                    const historyItem = document.createElement('div');
                    historyItem.className = 'history-item';
                    historyItem.innerHTML = `
                        <div class="history-expression">${item.expression}</div>
                        <div class="history-result">${item.result}</div>
                        <div class="history-time">${item.timestamp}</div>
                    `;
                    historyList.appendChild(historyItem);
                });
            }

            clearHistory() {
                if (confirm('确定要清空所有历史记录吗？')) {
                    this.history = [];
                    this.updateHistoryList();
                    this.saveHistory();
                }
            }

            formatExpression() {
                const operatorSymbols = {
                    add: '+',
                    subtract: '−',
                    multiply: '×',
                    divide: '÷'
                };
                
                return `${this.previousInput} ${operatorSymbols[this.operator]} ${this.currentInput}`;
            }

            formatResult(result) {
                if (Math.abs(result) > 1e15 || (Math.abs(result) < 1e-10 && result !== 0)) {
                    return result.toExponential(10);
                }
                
                return parseFloat(result.toPrecision(12)).toString();
            }

            updateDisplay() {
                this.display.textContent = this.currentInput;
            }

            updateHistoryDisplay() {
                if (this.operator && this.previousInput) {
                    const operatorSymbols = {
                        add: '+',
                        subtract: '−',
                        multiply: '×',
                        divide: '÷'
                    };
                    this.historyDisplay.textContent = `${this.previousInput} ${operatorSymbols[this.operator]}`;
                }
            }

            updateMemoryDisplay() {
                document.getElementById('memoryDisplay').textContent = this.formatResult(this.memory);
            }

            setTheme(theme) {
                document.querySelectorAll('.theme-btn').forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.theme === theme);
                });

                document.body.style.background = this.themes[theme];
                this.saveSettings();
            }

            toggleSetting(setting) {
                this.settings[setting] = !this.settings[setting];
                const toggle = document.getElementById(setting + 'Toggle');
                toggle.classList.toggle('active', this.settings[setting]);
                this.saveSettings();
            }

            handleKeyboard(e) {
                if (e.target.matches('input, select, textarea')) return;

                const key = e.key;
                e.preventDefault();

                if (/[0-9]/.test(key)) {
                    this.inputDigit(key);
                } else if (key === '.') {
                    this.inputDecimal();
                } else if (key === '+') {
                    this.inputOperator('add');
                } else if (key === '-') {
                    this.inputOperator('subtract');
                } else if (key === '*') {
                    this.inputOperator('multiply');
                } else if (key === '/') {
                    this.inputOperator('divide');
                } else if (key === 'Enter' || key === '=') {
                    this.calculate();
                } else if (key === 'Escape') {
                    this.clear();
                } else if (key === 'Backspace') {
                    this.backspace();
                }
            }

            addRipple(button, event) {
                const ripple = document.createElement('span');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = event.clientX - rect.left - size / 2;
                const y = event.clientY - rect.top - size / 2;

                ripple.className = 'button-ripple';
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';

                button.appendChild(ripple);

                setTimeout(() => {
                    ripple.remove();
                }, 600);
            }

            playSound() {
                if (!this.settings.sound) return;
                
                // 创建简单的点击音效
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.1);
            }

            triggerHaptic() {
                if (this.settings.haptic && navigator.vibrate) {
                    navigator.vibrate(10);
                }
            }

            showError(message) {
                this.errorDisplay.textContent = message;
                this.errorDisplay.classList.add('show');
                
                setTimeout(() => {
                    this.hideError();
                }, 3000);
            }

            hideError() {
                this.errorDisplay.classList.remove('show');
            }

            saveSettings() {
                const settings = {
                    theme: document.querySelector('.theme-btn.active').dataset.theme,
                    angleUnit: this.angleUnit,
                    sound: this.settings.sound,
                    haptic: this.settings.haptic
                };
                localStorage.setItem('calculatorSettings', JSON.stringify(settings));
            }

            saveHistory() {
                localStorage.setItem('calculatorHistory', JSON.stringify(this.history));
            }

            loadSettings() {
                try {
                    const settings = JSON.parse(localStorage.getItem('calculatorSettings'));
                    const history = JSON.parse(localStorage.getItem('calculatorHistory'));
                    
                    if (settings) {
                        if (settings.theme) {
                            this.setTheme(settings.theme);
                        }
                        
                        if (settings.angleUnit) {
                            this.angleUnit = settings.angleUnit;
                            document.getElementById('angleUnit').value = settings.angleUnit;
                        }
                        
                        this.settings.sound = settings.sound !== false;
                        this.settings.haptic = settings.haptic !== false;
                        
                        document.getElementById('soundToggle').classList.toggle('active', this.settings.sound);
                        document.getElementById('hapticToggle').classList.toggle('active', this.settings.haptic);
                    }
                    
                    if (history) {
                        this.history = history;
                        this.updateHistoryList();
                    }
                } catch (error) {
                    console.error('加载设置失败:', error);
                }
            }
        }

        // 初始化计算器
        document.addEventListener('DOMContentLoaded', () => {
            new Calculator();
        });