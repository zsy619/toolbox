/* =============================================================
 * Remotion 知识库共享脚本 v2
 * 主题/进度/复制/搜索/历史/快捷键/标签筛选 全集合
 * ============================================================= */
(function () {
  'use strict';

  // ---------- 主题切换(localStorage 持久化) ----------
  var THEME_KEY = 'remotion-kb-theme';
  var stored = localStorage.getItem(THEME_KEY);
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (stored === 'dark' || (!stored && prefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  function bindTheme() {
    var btn = document.getElementById('themeToggle');
    if (!btn) return;
    btn.onclick = function () {
      var cur = document.documentElement.getAttribute('data-theme');
      if (cur === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem(THEME_KEY, 'light');
        btn.setAttribute('aria-label', '切换到暗色主题');
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem(THEME_KEY, 'dark');
        btn.setAttribute('aria-label', '切换到浅色主题');
      }
    };
  }

  // ---------- 阅读进度 + 回到顶部 ----------
  function bindScroll() {
    var bar = document.getElementById('progress');
    var top = document.getElementById('backTop');
    window.addEventListener('scroll', function () {
      var h = document.documentElement;
      var s = h.scrollTop;
      var sh = h.scrollHeight - h.clientHeight;
      if (bar) bar.style.width = (sh > 0 ? (s / sh) * 100 : 0) + '%';
      if (top) {
        if (window.scrollY > 400) top.classList.add('visible');
        else top.classList.remove('visible');
      }
    }, { passive: true });
    if (top) top.onclick = function () { window.scrollTo({ top: 0, behavior: 'smooth' }); };
  }

  // ---------- 平滑滚动锚点 ----------
  function bindAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.onclick = function (e) {
        var id = a.getAttribute('href');
        if (id.length < 2) return;
        var t = document.querySelector(id);
        if (t) {
          e.preventDefault();
          t.scrollIntoView({ behavior: 'smooth', block: 'start' });
          history.pushState(null, '', id);
        }
      };
    });
  }

  // ---------- 代码块 v3:统一增强(支持裸pre + 已包装) ----------
  // 1. 把所有不在 .code-block 内的 <pre class="line-numbers"> 自动包装为 .code-block
  // 2. 统一添加 macOS 风格标题栏 + 复制按钮 + 折叠功能
  // 3. 行号通过 <span class="line"> 包裹 + CSS counter 实现
  function enhanceCodeBlocks() {
    // ---- 步骤 1:包装裸 pre ----
    document.querySelectorAll('pre.line-numbers').forEach(function (pre) {
      if (pre.closest('.code-block')) return; // 已在 code-block 内,跳过
      if (pre.dataset.wrapped) return;
      pre.dataset.wrapped = '1';

      // 创建 wrapper 和 header
      var code = pre.querySelector('code[class*="language-"]');
      if (!code) return; // 没有 code 元素不处理
      var lang = (code.className.match(/language-(\w+)/) || [])[1] || 'text';

      var wrapper = document.createElement('div');
      wrapper.className = 'code-block';
      var header = document.createElement('div');
      header.className = 'code-block-header';
      header.setAttribute('data-lang', lang);
      // 用文件名占位,后续可由 .code-block-header > 文本 提供真实名称
      header.textContent = lang;

      // 替换 pre 在 DOM 中的位置
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(header);
      wrapper.appendChild(pre);
    });

    // ---- 步骤 2:统一增强所有 .code-block ----
    document.querySelectorAll('.code-block').forEach(function (block) {
      if (block.dataset.enhanced) return;
      block.dataset.enhanced = '1';

      // 1) 同步 data-lang 到 header
      var header = block.querySelector('.code-block-header');
      var code = block.querySelector('code[class*="language-"]');
      var pre = block.querySelector('pre[class*="language-"]');
      if (!code || !pre) return;
      var lang = (code.className.match(/language-(\w+)/) || [])[1] || 'text';
      if (header && !header.dataset.lang) header.setAttribute('data-lang', lang);
      // 如果 header 没有内容(空 div),填入语言标识
      if (header && !header.textContent.trim()) header.textContent = lang;

      // 2) 把代码行包成 <span class="line"> 触发 CSS 行号
      if (!code.querySelector('.line')) {
        var raw = code.innerHTML;
        if (raw.indexOf('\n') === -1 && raw.indexOf('<br') === -1) {
          // 单行也包一层让行号显示 1
          var html = raw.replace(/^(\s*)([\s\S]*?)(\s*)$/, function (_, lead, body, trail) {
            return lead + '<span class="line">' + body + '</span>' + trail;
          });
          code.innerHTML = html;
        } else {
          // 多行:按 \n 拆分(Prism 会后处理 .line 内的 token)
          var lines = code.innerHTML.split('\n');
          while (lines.length && !lines[0].trim()) lines.shift();
          while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
          code.innerHTML = lines.map(function (l) {
            return l.trim() ? '<span class="line">' + l + '</span>' : '';
          }).join('\n');
        }
      }

      // 3) >25 行默认折叠
      var lineCount = code.querySelectorAll('.line').length;
      if (lineCount > 25 && !block.classList.contains('is-collapsible')) {
        block.classList.add('is-collapsible');
        var tog = document.createElement('button');
        tog.className = 'toggle-btn';
        tog.textContent = '▼ 展开 (' + lineCount + ' 行)';
        tog.setAttribute('aria-label', '展开或折叠代码');
        tog.onclick = function (e) {
          e.stopPropagation();
          var expanded = block.classList.toggle('expanded');
          tog.textContent = expanded ? '▲ 折叠' : '▼ 展开 (' + lineCount + ' 行)';
        };
        block.appendChild(tog);
      }

      // 4) 代码块操作按钮组(GitHub 风格)
      // 拷贝 / 原始 / 全屏 三个图标按钮
      // 默认隐藏,.code-block:hover 时淡入显示
      // 重要:必须用闭包锁定 code 引用,杜绝作用域混淆
      if (!block.querySelector('.code-block-actions')) {
        // 闭包变量:本代码块专属引用(防止 forEach 闭包陷阱)
        var currentCode = code;
        var currentBlock = block;
        var currentLang = lang;
        var currentPre = pre;

        // 创建按钮组容器
        var actions = document.createElement('div');
        actions.className = 'code-block-actions';
        actions.setAttribute('role', 'toolbar');
        actions.setAttribute('aria-label', '代码块操作');

        /**
         * 创建单个图标按钮的工厂函数
         */
        function makeAction(opts) {
          var btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'code-action ' + (opts.cls || '');
          btn.setAttribute('aria-label', opts.label);
          btn.setAttribute('data-label', opts.label);
          btn.setAttribute('title', opts.label);
          btn.innerHTML = opts.icon;
          btn.onclick = function (e) {
            e.stopPropagation();
            // 作用域校验:btn 还在 currentBlock 内
            if (btn.closest('.code-block') !== currentBlock) {
              console.warn('code-action: scope mismatch, abort');
              return;
            }
            opts.onClick(btn);
          };
          return btn;
        }

        // ----- 按钮 1:拷贝(只复制当前代码块,自我校验重试机制) -----
        // 点击后:
        //   1) 优先用 navigator.clipboard.writeText()
        //   2) 写入后读取 readText() 校验内容一致
        //   3) 不一致 → 降级到 execCommand fallback
        //   4) 仍失败 → 指数退避重试(100ms/200ms/400ms),最多 3 次
        //   5) 3 次都失败 → 弹出 modal 让用户手动 Cmd/Ctrl + C
        var copyBtn = makeAction({
          label: '只拷贝当前代码块',
          icon: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>',
          cls: 'action-copy',
          onClick: function (b) {
            var text = currentCode.innerText;
            copyWithVerify(text, b).then(function (result) {
              // copyWithVerify 内部已处理状态反馈
              // 此处仅兜底日志
              console.log('[copy] result:', result);
            });
          }
        });

        // ----- 按钮 2:查看原始(在新窗口打开纯代码) -----
        var rawBtn = makeAction({
          label: '查看原始代码',
          icon: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>',
          cls: 'action-raw',
          onClick: function (b) {
            try {
              var text = currentCode.innerText;
              var blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
              var url = URL.createObjectURL(blob);
              var win = window.open(url, '_blank', 'noopener,noreferrer');
              // 兜底:新窗口被拦截时直接下载
              if (!win) {
                var a = document.createElement('a');
                a.href = url;
                a.download = 'code-' + (currentLang || 'txt') + '.txt';
                a.click();
                showToast('已下载 ' + (currentLang || '') + ' 源码 (' + (text.length || 0) + ' 字符)', 'success');
              } else {
                // 视觉反馈:按钮显示绿色 1.2s(临时)
                b.classList.add('flash');
                setTimeout(function () { b.classList.remove('flash'); }, 1200);
                showToast('已在新窗口打开原始代码 (' + (text.length || 0) + ' 字符)', 'success');
              }
              // 60s 后回收 Blob URL
              setTimeout(function () { URL.revokeObjectURL(url); }, 60000);
            } catch (e) {
              showToast('打开原始代码失败: ' + (e.message || e.name || 'unknown'), 'error');
            }
          }
        });

        // ----- 按钮 3:全屏(切换全屏模式) -----
        var fsBtn = makeAction({
          label: '全屏查看',
          icon: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>',
          cls: 'action-fullscreen',
          onClick: function (b) {
            toggleFullscreen(currentBlock, b);
          }
        });

        // ----- 按钮 4:下载(直接下载当前代码为文件) -----
        var dlBtn = makeAction({
          label: '下载代码',
          icon: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>',
          cls: 'action-download',
          onClick: function (b) {
            try {
              var text = currentCode.innerText;
              var ext = LANG_EXT_MAP[currentLang] || (currentLang || 'txt');
              var filename = 'code-' + Date.now() + '.' + ext;
              var blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
              var url = URL.createObjectURL(blob);
              var a = document.createElement('a');
              a.href = url;
              a.download = filename;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              setTimeout(function () { URL.revokeObjectURL(url); }, 60000);
              b.classList.add('flash');
              setTimeout(function () { b.classList.remove('flash'); }, 1200);
              showToast('已下载 ' + filename + ' (' + (text.length || 0) + ' 字符)', 'success');
            } catch (e) {
              showToast('下载失败: ' + (e.message || e.name || 'unknown'), 'error');
            }
          }
        });

        // ----- 按钮 5:换行(切换自动换行,适合超长行) -----
        var wrapBtn = makeAction({
          label: '切换自动换行',
          icon: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 21 6"></polyline><path d="M3 12h15a3 3 0 1 1 0 6h-4"></path><polyline points="9 16 6 19 9 22"></polyline><polyline points="20 18 23 15 20 12"></polyline><line x1="3" y1="18" x2="20" y2="18"></line></svg>',
          cls: 'action-wrap',
          onClick: function (b) {
            var isWrapped = currentBlock.classList.toggle('is-wrap');
            currentPre.style.whiteSpace = isWrapped ? 'pre-wrap' : 'pre';
            b.classList.toggle('active', isWrapped);
            b.setAttribute('aria-label', isWrapped ? '关闭自动换行' : '开启自动换行');
            b.setAttribute('data-label', isWrapped ? '关闭自动换行' : '开启自动换行');
            showToast(isWrapped ? '已开启自动换行' : '已关闭自动换行', 'info');
          }
        });

        // ----- 按钮 6:行号(切换显示/隐藏行号) -----
        var lineBtn = makeAction({
          label: '切换行号',
          icon: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="10" y1="6" x2="21" y2="6"></line><line x1="10" y1="12" x2="21" y2="12"></line><line x1="10" y1="18" x2="21" y2="18"></line><path d="M4 6h1v4"></path><path d="M4 10h2"></path><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path></svg>',
          cls: 'action-lines',
          onClick: function (b) {
            var hidden = currentBlock.classList.toggle('hide-line-numbers');
            b.classList.toggle('active', hidden);
            b.setAttribute('aria-label', hidden ? '显示行号' : '隐藏行号');
            b.setAttribute('data-label', hidden ? '显示行号' : '隐藏行号');
            showToast(hidden ? '已隐藏行号' : '已显示行号', 'info');
          }
        });

        actions.appendChild(copyBtn);
        actions.appendChild(rawBtn);
        actions.appendChild(dlBtn);
        actions.appendChild(wrapBtn);
        actions.appendChild(lineBtn);
        actions.appendChild(fsBtn);

        currentBlock.appendChild(actions);

        // 存储按钮引用(供全屏切换使用)
        currentBlock._fullscreenBtn = fsBtn;
        // 初始激活状态:行号默认显示,换行默认关闭
        lineBtn.classList.remove('active');
      }
    });
  }

  /**
   * 语言标识 → 文件后缀映射(用于下载按钮)
   * 涵盖常见代码语言
   */
  var LANG_EXT_MAP = {
    js: 'js', javascript: 'js', jsx: 'jsx',
    ts: 'ts', typescript: 'ts', tsx: 'tsx',
    py: 'py', python: 'py',
    rb: 'rb', ruby: 'rb',
    go: 'go', golang: 'go',
    rs: 'rs', rust: 'rs',
    java: 'java',
    kt: 'kt', kotlin: 'kt',
    swift: 'swift',
    c: 'c', h: 'h',
    cpp: 'cpp', cxx: 'cpp', cc: 'cpp', hpp: 'hpp',
    cs: 'cs', csharp: 'cs',
    php: 'php',
    sh: 'sh', bash: 'sh', zsh: 'sh',
    ps1: 'ps1', powershell: 'ps1',
    sql: 'sql',
    html: 'html', htm: 'html',
    xml: 'xml',
    css: 'css', scss: 'scss', sass: 'sass', less: 'less',
    json: 'json',
    yaml: 'yaml', yml: 'yaml',
    toml: 'toml',
    md: 'md', markdown: 'md',
    vue: 'vue',
    svelte: 'svelte',
    dart: 'dart',
    lua: 'lua',
    pl: 'pl', perl: 'pl',
    r: 'r',
    scala: 'scala',
    clj: 'clj', clojure: 'clj',
    ex: 'ex', elixir: 'ex',
    erl: 'erl', erlang: 'erl',
    hs: 'hs', haskell: 'hs',
    dockerfile: 'dockerfile',
    nginx: 'conf',
    env: 'env',
    gitignore: 'gitignore'
  };

  /**
   * 切换代码块全屏模式
   * 再次调用或按 ESC 退出
   */
  function toggleFullscreen(block, btn) {
    if (block.classList.contains('is-fullscreen')) {
      block.classList.remove('is-fullscreen');
      document.body.classList.remove('code-fullscreen-locked');
      if (btn) {
        btn.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>';
        btn.setAttribute('aria-label', '全屏查看');
      }
      showToast('已退出全屏', 'info');
    } else {
      block.classList.add('is-fullscreen');
      document.body.classList.add('code-fullscreen-locked');
      if (btn) {
        btn.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="4 14 10 14 10 20"></polyline><polyline points="20 10 14 10 14 4"></polyline><line x1="14" y1="10" x2="21" y2="3"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>';
        btn.setAttribute('aria-label', '退出全屏');
      }
      showToast('已进入全屏 · 按 ESC 退出', 'success');
    }
  }

  /**
   * 全局 ESC 键监听:退出任意全屏代码块
   */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.keyCode === 27) {
      var fsBlocks = document.querySelectorAll('.code-block.is-fullscreen');
      if (fsBlocks.length) {
        fsBlocks.forEach(function (b) {
          var btn = b._fullscreenBtn;
          toggleFullscreen(b, btn);
        });
      }
    }
  });

  /**
   * 全局 F 键快捷键:聚焦到代码块后按 F 进入全屏
   * 只有当用户已在某个代码块内(或按钮组获得焦点)时生效
   */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'f' && e.key !== 'F' && e.keyCode !== 70) return;
    // 排除输入框/textarea 内的按键
    var t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
    // 排除有修饰键的组合(如 Cmd+F 浏览器原生搜索)
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    // 找到鼠标最近 hover 的代码块,或已聚焦按钮组所在代码块
    var activeBlock = null;
    if (document.activeElement && document.activeElement.closest('.code-block')) {
      activeBlock = document.activeElement.closest('.code-block');
    } else if (window._hoveredCodeBlock) {
      activeBlock = window._hoveredCodeBlock;
    }
    if (activeBlock && !activeBlock.classList.contains('is-fullscreen')) {
      e.preventDefault();
      toggleFullscreen(activeBlock, activeBlock._fullscreenBtn);
    }
  });

  /**
   * 追踪鼠标 hover 的代码块(供 F 快捷键使用)
   */
  document.addEventListener('mouseover', function (e) {
    var b = e.target && e.target.closest && e.target.closest('.code-block');
    if (b) window._hoveredCodeBlock = b;
  });

  /**
   * 通用 Toast 反馈提示
   * @param {string} msg 提示文本
   * @param {'success'|'info'|'warn'|'error'} type 类型(影响颜色)
   * @param {number} duration 持续时间(ms),默认 2200
   */
  var TOAST_ICONS = {
    success: '✓',
    info: 'ⓘ',
    warn: '⚠',
    error: '✕'
  };
  var toastSeq = 0;

  function showToast(msg, type, duration) {
    type = type || 'info';
    duration = duration == null ? 2200 : duration;

    // 复用同一个容器(栈式管理)
    var container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('aria-atomic', 'true');
      document.body.appendChild(container);
    }

    var toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    toast.setAttribute('role', type === 'error' ? 'alert' : 'status');
    toast.innerHTML =
      '<span class="toast-icon" aria-hidden="true">' + (TOAST_ICONS[type] || 'ⓘ') + '</span>' +
      '<span class="toast-msg"></span>';
    toast.querySelector('.toast-msg').textContent = msg;
    toast.style.zIndex = 10001 + (toastSeq++ % 10);
    container.appendChild(toast);

    // 入场动画
    requestAnimationFrame(function () {
      toast.classList.add('toast-in');
    });

    // 自动消失
    var timer = setTimeout(function () {
      dismissToast(toast);
    }, duration);

    // 点击立即关闭
    toast.addEventListener('click', function () {
      clearTimeout(timer);
      dismissToast(toast);
    });
  }

  function dismissToast(toast) {
    if (!toast || !toast.parentNode) return;
    toast.classList.remove('toast-in');
    toast.classList.add('toast-out');
    setTimeout(function () {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 220);
  }

  /**
   * 兼容旧浏览器的 execCommand 复制方案(内部使用)
   * 不做任何 UI 反馈,只执行写剪贴板动作并返回成功标志
   */
  function fallbackCopyExec(text) {
    try {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;pointer-events:none;';
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, ta.value.length);
      var ok = document.execCommand && document.execCommand('copy');
      document.body.removeChild(ta);
      return !!ok;
    } catch (e) {
      return false;
    }
  }

  /**
   * 校验剪贴板内容是否与预期一致
   * 使用 navigator.clipboard.readText() 读取后对比
   * 读取失败(如权限被拒)直接返回 false 视为不可校验
   */
  async function verifyClipboard(expected) {
    try {
      if (!navigator.clipboard || !navigator.clipboard.readText) return false;
      var written = await navigator.clipboard.readText();
      // 严格对比(考虑 Windows / Unix 换行差异)
      var a = (written || '').replace(/\r\n/g, '\n');
      var b = (expected || '').replace(/\r\n/g, '\n');
      return a === b;
    } catch (e) {
      // 读取失败时不可校验,返回 true 视为通过(避免误判)
      // 这样在不支持读取的浏览器中不会陷入死循环重试
      return true;
    }
  }

  /**
   * 复制按钮 SVG 状态切换工具
   */
  var COPY_SVG = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
  var CHECK_SVG = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>';
  var LOADING_SVG = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spin" aria-hidden="true"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>';
  var FAIL_SVG = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';

  function setCopyState(btn, state) {
    if (!btn) return;
    btn.classList.remove('copied', 'copying', 'failed');
    if (state === 'copying') {
      btn.classList.add('copying');
      btn.innerHTML = LOADING_SVG;
      btn.setAttribute('aria-label', '正在拷贝...');
    } else if (state === 'copied') {
      btn.classList.add('copied');
      btn.innerHTML = CHECK_SVG;
      btn.setAttribute('aria-label', '已拷贝成功');
    } else if (state === 'failed') {
      btn.classList.add('failed');
      btn.innerHTML = FAIL_SVG;
      btn.setAttribute('aria-label', '拷贝失败,请手动复制');
    } else {
      btn.innerHTML = COPY_SVG;
      btn.setAttribute('aria-label', '只拷贝当前代码块');
    }
  }

  /**
   * 终极兜底:弹出 modal 让用户手动复制
   * 用于 navigator.clipboard 与 execCommand 全部失败且重试 3 次仍失败的场景
   */
  function showManualCopyModal(text) {
    // 关闭已有 modal
    var existing = document.getElementById('manualCopyModal');
    if (existing) existing.remove();

    var modal = document.createElement('div');
    modal.id = 'manualCopyModal';
    modal.className = 'manual-copy-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'manualCopyTitle');
    modal.innerHTML =
      '<div class="manual-copy-backdrop" data-close></div>' +
      '<div class="manual-copy-dialog">' +
        '<h3 id="manualCopyTitle">📋 请手动复制代码</h3>' +
        '<p>浏览器自动复制失败(可能是权限限制)。请按 <kbd>Ctrl</kbd>+<kbd>C</kbd>(Mac: <kbd>⌘</kbd>+<kbd>C</kbd>)复制下方文本框内容。</p>' +
        '<textarea class="manual-copy-textarea" readonly aria-label="待复制的代码"></textarea>' +
        '<div class="manual-copy-actions">' +
          '<button type="button" class="manual-copy-select" data-act="select">全选并复制</button>' +
          '<button type="button" class="manual-copy-close" data-close>关闭</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(modal);

    var ta = modal.querySelector('.manual-copy-textarea');
    ta.value = text;
    // 自动聚焦并全选
    setTimeout(function () {
      ta.focus();
      ta.select();
    }, 50);

    // 关闭按钮
    modal.querySelectorAll('[data-close]').forEach(function (el) {
      el.addEventListener('click', function () { modal.remove(); });
    });

    // 全选并复制按钮
    modal.querySelector('[data-act="select"]').addEventListener('click', function () {
      ta.focus();
      ta.select();
      try {
        document.execCommand('copy');
        var btn = modal.querySelector('[data-act="select"]');
        btn.textContent = '✓ 已复制';
        setTimeout(function () {
          btn.textContent = '全选并复制';
        }, 1800);
      } catch (e) {
        // 用户手动 Cmd+C
      }
    });

    // ESC 关闭
    var escHandler = function (e) {
      if (e.key === 'Escape' || e.keyCode === 27) {
        modal.remove();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);

    // 阻止 body 滚动
    document.body.classList.add('modal-locked');
    var observer = new MutationObserver(function () {
      if (!document.body.contains(modal)) {
        document.body.classList.remove('modal-locked');
        observer.disconnect();
      }
    });
    observer.observe(document.body, { childList: true });
  }

  /**
   * 自我校验复制函数(核心)
   *
   * 流程:
   *   1) 优先 navigator.clipboard.writeText()
   *   2) 写入后立即调用 readText() 校验内容一致
   *   3) 校验失败 → 降级到 execCommand fallback
   *   4) execCommand 后再次校验
   *   5) 仍失败 → 指数退避重试,最多 3 次
   *   6) 全部失败 → 弹出 modal 让用户手动复制
   *
   * @param {string} text 要复制的文本
   * @param {HTMLButtonElement} btn 状态反馈按钮(可选)
   * @returns {Promise<{success:boolean, method?:string, attempts:number, error?:string}>}
   */
  async function copyWithVerify(text, btn) {
    var MAX_ATTEMPTS = 3;
    var result = {
      success: false,
      method: null,
      attempts: 0,
      error: null
    };

    setCopyState(btn, 'copying');

    for (var attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      result.attempts = attempt;

      // 阶段 A:尝试 navigator.clipboard
      var clipboardApiOk = false;
      try {
        if (navigator.clipboard && navigator.clipboard.writeText && window.isSecureContext !== false) {
          await navigator.clipboard.writeText(text);
          clipboardApiOk = true;
          // 校验
          if (await verifyClipboard(text)) {
            result.success = true;
            result.method = 'clipboard';
            setCopyState(btn, 'copied');
            setTimeout(function () { setCopyState(btn, 'idle'); }, 1800);
            showToast('✓ 已拷贝 (' + (text.length || 0) + ' 字符) · ' + result.method, 'success');
            return result;
          }
        }
      } catch (e) {
        result.error = 'clipboard-rejected: ' + (e.message || e.name || 'unknown');
      }

      // 阶段 B:降级到 execCommand fallback
      var fallbackOk = false;
      try {
        if (fallbackCopyExec(text)) {
          fallbackOk = true;
          // 校验(如果 readText 可用)
          if (await verifyClipboard(text)) {
            result.success = true;
            result.method = 'fallback';
            setCopyState(btn, 'copied');
            setTimeout(function () { setCopyState(btn, 'idle'); }, 1800);
            showToast('✓ 已拷贝 (' + (text.length || 0) + ' 字符) · ' + result.method, 'success');
            return result;
          }
        }
      } catch (e) {
        result.error = 'fallback-failed: ' + (e.message || e.name || 'unknown');
      }

      // 两次都失败 / 校验不一致 → 记录错误 + 重试
      result.error = result.error || (
        (clipboardApiOk ? 'clipboard-mismatch' : 'no-method') +
        (fallbackOk ? '+fallback-mismatch' : '')
      );

      // 最后一次尝试不需要再 sleep
      if (attempt < MAX_ATTEMPTS) {
        // 指数退避:100ms → 200ms → 400ms
        var delay = 100 * Math.pow(2, attempt - 1);
        await new Promise(function (r) { setTimeout(r, delay); });
      }
    }

    // 全部失败 → 弹出 modal 让用户手动复制
    setCopyState(btn, 'failed');
    setTimeout(function () { setCopyState(btn, 'idle'); }, 2500);
    showManualCopyModal(text);
    return result;
  }

  // ---------- 复制全部代码(浮动按钮,已移除) ----------
  // 注意:本功能与"每个代码块只拷贝当前代码块"的理念冲突,
  // 已在 v3 重构中移除。如需恢复"复制全部"功能,可在 bindCopyAllCode
  // 位置重新实现,当前实现只支持每个代码块独立拷贝。

  // ---------- 当前页面导航高亮 ----------
  function highlightCurrentNav() {
    var path = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(function (a) {
      if (a.getAttribute('href') === path) a.classList.add('active');
    });
  }

  // ---------- 阅读历史(localStorage) ----------
  var HISTORY_KEY = 'remotion-kb-history';
  function recordHistory() {
    var path = location.pathname.split('/').pop() || 'index.html';
    if (path === 'index.html' || path === '' ) return;
    try {
      var arr = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
      arr = arr.filter(function (x) { return x.path !== path; });
      arr.unshift({ path: path, title: document.title, ts: Date.now() });
      arr = arr.slice(0, 10);  // 保留最近 10 条
      localStorage.setItem(HISTORY_KEY, JSON.stringify(arr));
    } catch (e) { /* localStorage 不可用时静默 */ }
  }

  // ---------- 键盘快捷键 ----------
  function bindShortcuts() {
    document.addEventListener('keydown', function (e) {
      // 跳过输入框
      if (e.target.matches('input, textarea, [contenteditable]')) return;
      // Cmd/Ctrl + K → 聚焦搜索框
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        var s = document.getElementById('searchInput');
        if (s) s.focus();
      }
      // g + h → 总目录
      if (e.key === 'g' && !e.metaKey && !e.ctrlKey) {
        var last = window.__lastKey;
        if (last === 'g') location.href = 'index.html';
        window.__lastKey = 'g';
        setTimeout(function () { window.__lastKey = null; }, 800);
      }
      // t → 切换主题
      if (e.key === 't' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        var btn = document.getElementById('themeToggle');
        if (btn) btn.click();
      }
      // ? → 显示快捷键帮助
      if (e.key === '?') {
        showShortcutsHelp();
      }
    });
  }

  function showShortcutsHelp() {
    var existing = document.getElementById('shortcutsModal');
    if (existing) { existing.remove(); return; }
    var modal = document.createElement('div');
    modal.id = 'shortcutsModal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-label', '键盘快捷键');
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:9999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
    modal.innerHTML = '<div style="background:var(--paper-card);color:var(--ink);padding:32px;border-radius:12px;max-width:420px;box-shadow:0 24px 64px rgba(0,0,0,.3)">' +
      '<h3 style="margin:0 0 16px;font-size:18px">⌨️ 键盘快捷键</h3>' +
      '<table style="width:100%;font-size:14px;line-height:2;border-collapse:collapse">' +
      '<tr><td><kbd>Ctrl/⌘ K</kbd></td><td>聚焦搜索框</td></tr>' +
      '<tr><td><kbd>g</kbd> + <kbd>h</kbd></td><td>回到总目录</td></tr>' +
      '<tr><td><kbd>t</kbd></td><td>切换主题</td></tr>' +
      '<tr><td><kbd>?</kbd></td><td>显示本帮助</td></tr>' +
      '<tr><td><kbd>Esc</kbd></td><td>关闭弹窗</td></tr>' +
      '</table>' +
      '<button onclick="this.parentElement.parentElement.remove()" style="margin-top:16px;padding:6px 14px;background:var(--docker-blue);color:#fff;border:none;border-radius:6px;cursor:pointer">关闭</button>' +
      '</div>';
    modal.onclick = function (e) { if (e.target === modal) modal.remove(); };
    document.body.appendChild(modal);
  }

  // ---------- 客户端全文搜索(Fuse.js 简化版) ----------
  // 自实现的轻量模糊搜索,避免外部依赖
  function bindSearch() {
    var input = document.getElementById('searchInput');
    if (!input) return;
    var cards = Array.from(document.querySelectorAll('[data-search]'));
    if (!cards.length) cards = Array.from(document.querySelectorAll('.index-card'));
    var debounce;

    function score(query, text) {
      if (!query) return 1;
      var q = query.toLowerCase();
      var t = text.toLowerCase();
      if (t.indexOf(q) === 0) return 3;        // 开头命中最高
      if (t.indexOf(q) > 0) return 2;          // 包含命中
      // 字符全部出现
      var i = 0, j = 0;
      while (i < q.length && j < t.length) {
        if (q[i] === t[j]) i++;
        j++;
      }
      return i === q.length ? 1 : 0;
    }

    function doSearch() {
      var q = input.value.trim();
      var visible = 0;
      cards.forEach(function (card) {
        var text = (card.textContent || '').replace(/\s+/g, ' ');
        var s = score(q, text);
        if (s > 0) {
          card.style.display = '';
          visible++;
          // 关键词高亮
          if (q.length >= 2) {
            var html = card.innerHTML;
            card.dataset.original = card.dataset.original || html;
            var orig = card.dataset.original;
            var re = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
            card.innerHTML = orig.replace(re, '<mark style="background:#f0a020;color:#000;padding:0 2px;border-radius:2px">$1</mark>');
          } else {
            if (card.dataset.original) card.innerHTML = card.dataset.original;
          }
        } else {
          card.style.display = 'none';
        }
      });
      var count = document.getElementById('searchCount');
      if (count) count.textContent = q ? ('共 ' + visible + ' 条结果') : '';
    }

    input.oninput = function () {
      clearTimeout(debounce);
      debounce = setTimeout(doSearch, 120);
    };
  }

  // ---------- 标签筛选 ----------
  function bindTagFilter() {
    var tags = document.querySelectorAll('[data-tag]');
    if (!tags.length) return;
    tags.forEach(function (tag) {
      tag.onclick = function () {
        var key = tag.dataset.tag;
        var cards = document.querySelectorAll('.index-card');
        var active = tag.classList.contains('active');
        tags.forEach(function (t) { t.classList.remove('active'); });
        tag.classList.add('active');
        // "all" 按钮特殊处理:显示全部
        if (key === 'all') {
          cards.forEach(function (c) { c.style.display = ''; });
        } else {
          cards.forEach(function (c) {
            var tags_attr = c.dataset.tags || '';
            c.style.display = tags_attr.indexOf(key) >= 0 ? '' : 'none';
          });
        }
      };
    });
  }

  // ---------- 阅读历史侧边栏 ----------
  function renderHistory() {
    var list = document.getElementById('historyList');
    if (!list) return;
    try {
      var arr = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
      if (!arr.length) {
        list.innerHTML = '<li style="color:var(--ink-3);font-size:13px;padding:8px 0">暂无阅读记录</li>';
        return;
      }
      list.innerHTML = arr.map(function (x) {
        return '<li style="padding:6px 0;border-bottom:1px solid var(--border)"><a href="' + x.path +
          '" style="color:var(--docker-blue);text-decoration:none;font-size:14px">' + x.title.split('|')[0].trim() +
          '</a><div style="color:var(--ink-3);font-size:11px;margin-top:2px">' +
          new Date(x.ts).toLocaleString('zh-CN') + '</div></li>';
      }).join('');
    } catch (e) { /* ignore */ }
  }

  // ---------- 初始化 ----------
  document.addEventListener('DOMContentLoaded', function () {
    bindTheme();
    bindScroll();
    bindAnchors();
    enhanceCodeBlocks();
    highlightCurrentNav();
    bindShortcuts();
    bindSearch();
    bindTagFilter();
    renderHistory();
    recordHistory();
  });
})();
