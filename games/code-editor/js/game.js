class CodeEditor {
            constructor() {
                this.currentFile = null;
                this.files = new Map();
                this.fileCounter = 0;
                this.currentLanguage = 'javascript';
                this.settings = {
                    fontSize: 14,
                    tabSize: 4,
                    fontFamily: 'JetBrains Mono',
                    theme: 'dark',
                    wordWrap: false,
                    showMinimap: false,
                    showConsole: false,
                    autoComplete: true,
                    livePreview: true
                };

                this.history = [];
                this.historyIndex = -1;
                this.maxHistorySize = 100;

                this.autocompleteData = {
                    javascript: [
                        { name: 'console.log', type: 'method', description: '输出到控制台' },
                        { name: 'function', type: 'keyword', description: '函数声明' },
                        { name: 'const', type: 'keyword', description: '常量声明' },
                        { name: 'let', type: 'keyword', description: '变量声明' },
                        { name: 'var', type: 'keyword', description: '变量声明' },
                        { name: 'if', type: 'keyword', description: '条件语句' },
                        { name: 'else', type: 'keyword', description: '否则分支' },
                        { name: 'for', type: 'keyword', description: '循环语句' },
                        { name: 'while', type: 'keyword', description: '条件循环' },
                        { name: 'return', type: 'keyword', description: '返回值' },
                        { name: 'document.getElementById', type: 'method', description: '通过ID获取元素' },
                        { name: 'document.querySelector', type: 'method', description: '选择器查询' },
                        { name: 'addEventListener', type: 'method', description: '添加事件监听器' },
                        { name: 'setTimeout', type: 'function', description: '延时执行' },
                        { name: 'setInterval', type: 'function', description: '定时执行' }
                    ],
                    html: [
                        { name: 'div', type: 'tag', description: '通用容器元素' },
                        { name: 'span', type: 'tag', description: '内联元素' },
                        { name: 'p', type: 'tag', description: '段落元素' },
                        { name: 'h1', type: 'tag', description: '一级标题' },
                        { name: 'h2', type: 'tag', description: '二级标题' },
                        { name: 'img', type: 'tag', description: '图片元素' },
                        { name: 'a', type: 'tag', description: '链接元素' },
                        { name: 'button', type: 'tag', description: '按钮元素' },
                        { name: 'input', type: 'tag', description: '输入元素' },
                        { name: 'form', type: 'tag', description: '表单元素' }
                    ],
                    css: [
                        { name: 'color', type: 'property', description: '文本颜色' },
                        { name: 'background', type: 'property', description: '背景样式' },
                        { name: 'margin', type: 'property', description: '外边距' },
                        { name: 'padding', type: 'property', description: '内边距' },
                        { name: 'font-size', type: 'property', description: '字体大小' },
                        { name: 'display', type: 'property', description: '显示类型' },
                        { name: 'position', type: 'property', description: '定位方式' },
                        { name: 'width', type: 'property', description: '宽度' },
                        { name: 'height', type: 'property', description: '高度' },
                        { name: 'border', type: 'property', description: '边框样式' }
                    ]
                };

                this.themes = {
                    dark: {
                        background: '#1e1e1e',
                        color: '#d4d4d4',
                        lineNumberBg: '#252526',
                        lineNumberColor: '#858585'
                    },
                    light: {
                        background: '#ffffff',
                        color: '#333333',
                        lineNumberBg: '#f5f5f5',
                        lineNumberColor: '#666666'
                    },
                    monokai: {
                        background: '#272822',
                        color: '#f8f8f2',
                        lineNumberBg: '#383830',
                        lineNumberColor: '#75715e'
                    },
                    solarized: {
                        background: '#002b36',
                        color: '#839496',
                        lineNumberBg: '#073642',
                        lineNumberColor: '#586e75'
                    }
                };

                this.init();
            }

            init() {
                this.setupEventListeners();
                this.createDefaultFile();
                this.updateLineNumbers();
                this.updatePreview();
                this.loadSettings();
                this.applyTheme();
            }

            setupEventListeners() {
                const codeEditor = document.getElementById('codeEditor');
                const consolePanel = document.getElementById('consolePanel');

                // 代码编辑器事件
                codeEditor.addEventListener('input', () => {
                    this.onCodeChange();
                    this.updateLineNumbers();
                    this.showAutocomplete();
                    this.saveToHistory();
                    if (this.settings.livePreview) {
                        this.updatePreview();
                    }
                });

                codeEditor.addEventListener('scroll', () => {
                    this.syncLineNumbers();
                });

                codeEditor.addEventListener('keydown', (e) => {
                    this.handleKeyDown(e);
                });

                codeEditor.addEventListener('click', () => {
                    this.updateCursorPosition();
                    this.hideAutocomplete();
                });

                codeEditor.addEventListener('blur', () => {
                    setTimeout(() => this.hideAutocomplete(), 150);
                });

                // 工具栏按钮事件
                document.getElementById('newFileBtn').addEventListener('click', () => this.createNewFile());
                document.getElementById('saveBtn').addEventListener('click', () => this.saveFile());
                document.getElementById('runBtn').addEventListener('click', () => this.runCode());
                document.getElementById('formatBtn').addEventListener('click', () => this.formatCode());
                document.getElementById('addFileBtn').addEventListener('click', () => this.addFileDialog());

                // 开发工具事件
                document.getElementById('undoBtn').addEventListener('click', () => this.undo());
                document.getElementById('redoBtn').addEventListener('click', () => this.redo());
                document.getElementById('findBtn').addEventListener('click', () => this.showFindDialog());
                document.getElementById('replaceBtn').addEventListener('click', () => this.showReplaceDialog());
                document.getElementById('consoleBtn').addEventListener('click', () => this.toggleConsole());
                document.getElementById('minimapBtn').addEventListener('click', () => this.toggleMinimap());
                document.getElementById('wrapBtn').addEventListener('click', () => this.toggleWordWrap());
                document.getElementById('fullscreenBtn').addEventListener('click', () => this.toggleFullscreen());

                // 预览控制事件
                document.getElementById('refreshPreviewBtn').addEventListener('click', () => this.updatePreview());
                document.getElementById('openInNewTabBtn').addEventListener('click', () => this.openInNewTab());

                // 语言选择事件
                document.querySelectorAll('.language-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        document.querySelectorAll('.language-btn').forEach(b => b.classList.remove('active'));
                        e.target.classList.add('active');
                        this.setLanguage(e.target.dataset.lang);
                    });
                });

                // 主题选择事件
                document.querySelectorAll('.theme-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
                        e.target.classList.add('active');
                        this.setTheme(e.target.dataset.theme);
                    });
                });

                // 设置控制事件
                document.getElementById('fontSize').addEventListener('input', (e) => {
                    this.settings.fontSize = parseInt(e.target.value);
                    this.applySettings();
                });

                document.getElementById('tabSize').addEventListener('change', (e) => {
                    this.settings.tabSize = parseInt(e.target.value);
                    this.applySettings();
                });

                document.getElementById('fontFamily').addEventListener('change', (e) => {
                    this.settings.fontFamily = e.target.value;
                    this.applySettings();
                });

                // 自动完成事件
                document.addEventListener('click', (e) => {
                    if (!e.target.closest('.autocomplete-popup')) {
                        this.hideAutocomplete();
                    }
                });

                // 键盘快捷键
                document.addEventListener('keydown', (e) => {
                    if (e.ctrlKey || e.metaKey) {
                        switch (e.key) {
                            case 's':
                                e.preventDefault();
                                this.saveFile();
                                break;
                            case 'n':
                                e.preventDefault();
                                this.createNewFile();
                                break;
                            case 'o':
                                e.preventDefault();
                                this.openFile();
                                break;
                            case 'f':
                                e.preventDefault();
                                this.showFindDialog();
                                break;
                            case 'h':
                                e.preventDefault();
                                this.showReplaceDialog();
                                break;
                            case 'z':
                                e.preventDefault();
                                this.undo();
                                break;
                            case 'y':
                                e.preventDefault();
                                this.redo();
                                break;
                            case 'Enter':
                                e.preventDefault();
                                this.runCode();
                                break;
                        }
                    }
                });
            }

            createDefaultFile() {
                const defaultContent = {
                    javascript: `// 欢迎使用在线代码编辑器！
console.log('Hello, World!');

// 这是一个简单的JavaScript示例
function greetUser(name) {
    return \`Hello, \${name}! 欢迎使用代码编辑器。\`;
}

// 调用函数
const message = greetUser('开发者');
console.log(message);

// 你可以在这里编写更多代码...`,
                    html: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>我的网页</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            text-align: center;
        }
        .btn {
            background: #ff6b6b;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            margin: 10px;
        }
        .btn:hover {
            background: #ee5a24;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 欢迎使用在线代码编辑器</h1>
        <p>这是一个功能强大的代码编辑器，支持多种编程语言。</p>
        <button class="btn" onclick="showMessage()">点击我</button>
        <div id="message"></div>
    </div>
    
    <script>
        function showMessage() {
            document.getElementById('message').innerHTML = 
                '<h2>🎉 太棒了！代码运行成功！</h2>';
        }