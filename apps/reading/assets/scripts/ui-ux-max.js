/* =================================================================
 * ui-ux-max.js · 全站统一增强脚本
 * 适用: apps/reading/ 目录下所有 HTML 页面
 * 版本: v1.0.0 · 2026-06-22
 *
 * 自动注入以下 UI 元素(全部幂等,不会重复添加):
 *   1. 顶部阅读进度条(滚动驱动)
 *   2. 浮动操作集合 #uuxFloatingActions (右下角: 返回顶部 / 暗色切换)
 *   4. 暗色模式切换按钮(顶栏右侧,持久化)
 *   5. 主题色调切换(Coral/Amber/Teal/Ink 四种)
 *
 * 触发条件:
 *   · DOMContentLoaded 时自动初始化
 *   · 仅在 <body> 不含 data-uux-init 时执行(避免重复)
 *
 * 不破坏:
 *   · 不修改页面现有结构
 *   · 不改变页面主题色(所有新增元素走 CSS 变量)
 *   · reduced-motion 用户自动禁用动画
 * ================================================================= */

(function () {
    'use strict';

    // 防止重复初始化
    if (document.body && document.body.dataset.uuxInit === '1') return;
    document.addEventListener('DOMContentLoaded', init, { once: true });

    function init() {
        if (document.body.dataset.uuxInit === '1') return;
        document.body.dataset.uuxInit = '1';

        injectProgressBar();
        injectFloatingActions();
        bindScrollProgress();
        bindFloatingActions();
    }

    // ============== 工具函数 ==============

    function prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    function storageGet(key, fallback) {
        try {
            const v = localStorage.getItem(key);
            return v == null ? fallback : v;
        } catch (e) {
            return fallback;
        }
    }

    function storageSet(key, val) {
        try {
            localStorage.setItem(key, val);
        } catch (e) { /* quota or disabled */ }
    }

    function el(tag, attrs, children) {
        const e = document.createElement(tag);
        if (attrs) {
            for (const k in attrs) {
                if (k === 'class') e.className = attrs[k];
                else if (k === 'text') e.textContent = attrs[k];
                else if (k === 'html') e.innerHTML = attrs[k];
                else if (k.indexOf('on') === 0) e[k] = attrs[k];
                else if (k === 'style') e.setAttribute('style', attrs[k]);
                else e.setAttribute(k, attrs[k]);
            }
        }
        if (children) {
            (Array.isArray(children) ? children : [children]).forEach(function (c) {
                if (c) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
            });
        }
        return e;
    }

    // ============== 1. 顶部阅读进度条 ==============

    function injectProgressBar() {
        if (document.querySelector('.reading-progress-bar')) return;
        const bar = el('div', {
            class: 'reading-progress-bar',
            role: 'progressbar',
            'aria-label': '阅读进度',
            'aria-valuemin': '0',
            'aria-valuemax': '100'
        });
        document.body.appendChild(bar);
    }

    function bindScrollProgress() {
        const bar = document.querySelector('.reading-progress-bar');
        if (!bar) return;

        let ticking = false;
        function update() {
            const doc = document.documentElement;
            const scrollTop = window.pageYOffset || doc.scrollTop;
            const scrollHeight = doc.scrollHeight - doc.clientHeight;
            const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
            bar.style.width = Math.min(100, Math.max(0, pct)) + '%';
            bar.setAttribute('aria-valuenow', Math.round(pct));
            ticking = false;
        }
        window.addEventListener('scroll', function () {
            if (!ticking) {
                window.requestAnimationFrame(update);
                ticking = true;
            }
        }, { passive: true });
        update();
    }

    // ============== 3. 浮动操作集合 (返回顶部 + 暗色切换) ==============
    // 优化: 替代旧的 .back-to-top-uux 分散注入
    // 统一注入到右下角 .floating-actions 容器 (右下方浮动显示)

    function injectFloatingActions() {
        // 跳过条件: 页面已创建自己的 .floating-actions 容器 (如 .fabContainer 包含 bookmarkBtn)
        // 这样避免与页面级 bookmarkBtn/homeBtn 重复
        if (document.getElementById('uuxFloatingActions')) return;
        if (document.querySelector('body > .floating-actions')) return;

        const container = el('div', {
            class: 'floating-actions',
            id: 'uuxFloatingActions',
            'aria-label': '浮动操作'
        });

        // 1) 返回顶部按钮 (滚动后浮现)
        const backTop = el('button', {
            class: 'fa-btn is-hidden',
            id: 'faBackTop',
            type: 'button',
            'aria-label': '返回顶部',
            title: '返回顶部'
        });
        backTop.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';

        // 仅保留返回顶部按钮 (主题切换已移除)
        container.appendChild(backTop);
        document.body.appendChild(container);

        if (!document.getElementById('uux-injected-styles')) {
            const style = el('style', { id: 'uux-injected-styles' });
            style.textContent = getFloatingActionsCSS();
            document.head.appendChild(style);
        }
    }

    function bindFloatingActions() {
        const backTop = document.querySelector('#faBackTop');
        if (backTop) {
            const reduced = prefersReducedMotion();
            let ticking = false;
            function toggle() {
                const y = window.pageYOffset || document.documentElement.scrollTop;
                backTop.classList.toggle('is-hidden', !(y > 480));
                backTop.classList.toggle('is-visible', y > 480);
                ticking = false;
            }
            window.addEventListener('scroll', function () {
                if (!ticking) {
                    window.requestAnimationFrame(toggle);
                    ticking = true;
                }
            }, { passive: true });
            backTop.addEventListener('click', function () {
                window.scrollTo({
                    top: 0,
                    behavior: reduced ? 'auto' : 'smooth'
                });
            });
            toggle();
        }

        // 优化: 主题切换已移除,仅保留返回顶部
    }

    // ============== 4. 注入的 CSS (只对动态创建的 #uuxFloatingActions 元素) ==============

    function getFloatingActionsCSS() {
        return [
            '#uuxFloatingActions{',
            '  position:fixed !important;',
            '  right:1.25rem !important;',
            '  left:auto !important;',
            '  bottom:1.25rem;',
            '  z-index:60;',
            '  display:flex;',
            '  flex-direction:column;',
            '  gap:0.5rem;',
            '  align-items:flex-end;',
            '}',
            '#uuxFloatingActions .fa-btn{',
            '  width:44px;height:44px;',
            '  border-radius:9999px;',
            '  background:rgba(255,255,255,.95);',
            '  backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);',
            '  border:1px solid rgba(102,126,234,.18);',
            '  color:#4b5563;',
            '  display:inline-flex;align-items:center;justify-content:center;',
            '  cursor:pointer;',
            '  box-shadow:0 4px 14px rgba(0,0,0,.08);',
            '  font-size:16px;line-height:1;',
            '  transition:all .25s ease;',
            '  padding:0;',
            '}',
            '#uuxFloatingActions .fa-btn:hover{',
            '  background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);',
            '  color:#fff;border-color:transparent;',
            '  transform:translateY(-2px);',
            '  box-shadow:0 8px 22px rgba(102,126,234,.4);',
            '}',
            '#uuxFloatingActions .fa-btn.is-hidden{',
            '  opacity:0;visibility:hidden;transform:translateY(8px);',
            '  pointer-events:none;',
            '}',
            '#uuxFloatingActions .fa-btn.is-visible{',
            '  opacity:1;visibility:visible;transform:translateY(0);',
            '  pointer-events:auto;',
            '}',
            '@media (max-width:640px){',
            '  #uuxFloatingActions{right:.75rem;bottom:.75rem;}',
            '  #uuxFloatingActions .fa-btn{width:40px;height:40px;font-size:14px;}',
            '}'
        ].join('\n');
    }

})();
