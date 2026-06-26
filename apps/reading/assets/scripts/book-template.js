/* =================================================================
 * book-template.js · reading 目录统一页面模板 v1.0
 * 创建日期: 2026-06-23
 *
 * 设计目标:
 *   · 以 yu-chenggong-youyue.html 为模板
 *   · 自动注入: 顶部导航 / 浮动按钮组 / 底部导航 / 黑色 footer
 *   · 收藏功能 + 字体大小 + 章节高亮
 *
 * 每个页面需要提供 (在 <head> 中):
 *   <meta name="book-id" content="唯一书名英文 id">
 *   <meta name="book-title" content="中文书名">
 *   <meta name="book-chapters" content='[{"id":"ch1","name":"关于"},{"id":"ch2","name":"法则"}]'>
 *   <meta name="book-prev" content="上一个文件.html">
 *   <meta name="book-next" content="下一个文件.html">
 *
 * 引入:
 *   <script src="assets/scripts/book-template.js" defer></script>
 * ================================================================= */
(function () {
    'use strict';
    if (window.__bookTemplateLoaded) return;
    window.__bookTemplateLoaded = true;

    // ============== 1. 读取页面元信息 ==============
    function getMeta(name) {
        const el = document.querySelector('meta[name="' + name + '"]');
        return el ? el.getAttribute('content') : '';
    }

    const BOOK_ID = getMeta('book-id') || (document.title.split('|')[0].trim().toLowerCase().replace(/\s+/g, '-'));
    const BOOK_TITLE = getMeta('book-title') || document.title.split('|')[0].trim();
    const BOOK_CHAPTERS = (() => {
        try {
            const raw = getMeta('book-chapters');
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    })();
    const BOOK_PREV = getMeta('book-prev') || '';
    const BOOK_NEXT = getMeta('book-next') || '';

    // ============== 2. 工具函数 ==============
    function el(tag, attrs, text) {
        const e = document.createElement(tag);
        if (attrs) {
            Object.keys(attrs).forEach(k => {
                if (k === 'class') e.className = attrs[k];
                else if (k === 'style') e.setAttribute('style', attrs[k]);
                else if (k.indexOf('on') === 0 && typeof attrs[k] === 'function') {
                    e.addEventListener(k.slice(2), attrs[k]);
                } else e.setAttribute(k, attrs[k]);
            });
        }
        if (text != null) e.textContent = text;
        return e;
    }
    function storageGet(k, def) {
        try { return localStorage.getItem(k) || def; } catch (e) { return def; }
    }
    function storageSet(k, v) {
        try { localStorage.setItem(k, v); } catch (e) {}
    }
    function showToast(msg) {
        let t = document.querySelector('.toast');
        if (!t) {
            t = el('div', { class: 'toast' });
            document.body.appendChild(t);
        }
        t.textContent = msg;
        t.classList.add('show');
        clearTimeout(showToast._t);
        showToast._t = setTimeout(() => t.classList.remove('show'), 1400);
    }

    // ============== 3. 顶部导航 ==============
    function injectTopNav() {
        if (document.querySelector('nav.book-top-nav')) return;

        const nav = el('nav', { class: 'book-top-nav', 'aria-label': '主导航' });
        const inner = el('div', { class: 'book-top-nav-inner' });

        // 左: 图标 + 书名
        const brand = el('a', { class: 'nav-brand-mini', href: '#top', 'aria-label': '返回顶部' });
        brand.innerHTML = '<span class="nav-brand-icon">📖</span><span class="nav-brand-text"></span>';
        brand.querySelector('.nav-brand-text').textContent = BOOK_TITLE;
        inner.appendChild(brand);

        // 中: 章节 pills
        if (BOOK_CHAPTERS.length) {
            const chapters = el('nav', { class: 'nav-chapters', 'aria-label': '章节导航' });
            BOOK_CHAPTERS.forEach(ch => {
                const a = el('a', { class: 'nav-chapter-pill', href: '#' + ch.id });
                a.textContent = ch.name;
                chapters.appendChild(a);
            });
            inner.appendChild(chapters);
        }

        // 右: 返回目录
        const home = el('a', { class: 'nav-home', href: 'index.html', 'aria-label': '返回目录', title: '返回目录' });
        home.innerHTML = '<i class="fa-solid fa-house"></i>';
        inner.appendChild(home);

        nav.appendChild(inner);
        document.body.insertBefore(nav, document.body.firstChild);
    }

    // ============== 4. 浮动操作集合 (右下角) ==============
    function injectFloatingActions() {
        if (document.querySelector('body > .floating-actions')) return;

        const container = el('div', { class: 'floating-actions', 'aria-label': '浮动操作' });

        // 1) 减小字体
        const fontDecr = el('button', { class: 'fab', id: 'faFontDecr', type: 'button',
            'aria-label': '减小字体', title: '减小字体' });
        fontDecr.innerHTML = '<i class="fa-solid fa-minus"></i>';

        // 2) 增大字体
        const fontIncr = el('button', { class: 'fab', id: 'faFontIncr', type: 'button',
            'aria-label': '增大字体', title: '增大字体' });
        fontIncr.innerHTML = '<i class="fa-solid fa-plus"></i>';

        // 3) 收藏
        const bookmark = el('button', { class: 'fab', id: 'faBookmark', type: 'button',
            'aria-label': '收藏', title: '收藏' });
        bookmark.innerHTML = '<i class="far fa-bookmark"></i>';

        // 5) 主页
        const home = el('button', { class: 'fab', id: 'faHome', type: 'button',
            'aria-label': '返回目录', title: '返回目录' });
        home.innerHTML = '<i class="fas fa-home"></i>';

        container.appendChild(fontDecr);
        container.appendChild(fontIncr);
        container.appendChild(bookmark);
        container.appendChild(home);
        document.body.appendChild(container);

        // 绑定事件 (4 按钮: A- / A+ / ⭐ / 🏠, 不含返回顶部)
        bindEvents({ fontDecr, fontIncr, bookmark, home });
    }

    // ============== 5. 事件绑定 ==============
    function bindEvents(btns) {
        const STORAGE_FONT = 'toolbox_font_size';
        const STORAGE_BMK = 'toolbox_bookmarks';

        // 字体大小 (CSS 变量)
        let fontSizePx = parseInt(storageGet(STORAGE_FONT, '16'), 10);
        if (isNaN(fontSizePx) || fontSizePx < 14) fontSizePx = 14;
        if (fontSizePx > 22) fontSizePx = 22;
        document.documentElement.style.setProperty('--ux-base-font-size', fontSizePx + 'px');

        btns.fontIncr.addEventListener('click', () => {
            if (fontSizePx >= 22) { showToast('已是最大字号'); return; }
            fontSizePx++;
            document.documentElement.style.setProperty('--ux-base-font-size', fontSizePx + 'px');
            storageSet(STORAGE_FONT, String(fontSizePx));
            showToast('字号: ' + fontSizePx + 'px');
        });
        btns.fontDecr.addEventListener('click', () => {
            if (fontSizePx <= 14) { showToast('已是最小字号'); return; }
            fontSizePx--;
            document.documentElement.style.setProperty('--ux-base-font-size', fontSizePx + 'px');
            storageSet(STORAGE_FONT, String(fontSizePx));
            showToast('字号: ' + fontSizePx + 'px');
        });

        // 优化: 返回顶部按钮已移除 (按用户要求)
        let bookmarks = {};
        try { bookmarks = JSON.parse(storageGet(STORAGE_BMK, '{}')) || {}; } catch (e) { bookmarks = {}; }
        if (bookmarks[BOOK_ID]) {
            btns.bookmark.classList.add('active');
            btns.bookmark.innerHTML = '<i class="fas fa-bookmark"></i>';
        }
        btns.bookmark.addEventListener('click', () => {
            if (bookmarks[BOOK_ID]) {
                delete bookmarks[BOOK_ID];
                btns.bookmark.classList.remove('active');
                btns.bookmark.innerHTML = '<i class="far fa-bookmark"></i>';
                showToast('已取消书签');
            } else {
                bookmarks[BOOK_ID] = {
                    title: BOOK_TITLE, url: window.location.pathname,
                    scroll: window.scrollY, added: Date.now()
                };
                btns.bookmark.classList.add('active');
                btns.bookmark.innerHTML = '<i class="fas fa-bookmark"></i>';
                showToast('已加入书签 ✓');
            }
            storageSet(STORAGE_BMK, JSON.stringify(bookmarks));
        });

        // 主页
        btns.home.addEventListener('click', () => { location.href = 'index.html'; });

        // 优化: 滚动监听已移除 (返回顶部按钮已移除)
    }

    // ============== 5. 底部导航 (上一本/下一本) ==============
    function injectBottomNav() {
        if (document.querySelector('section.footer-nav')) return;
        const prevTitle = getMeta('book-prev-title') || (BOOK_PREV ? BOOK_PREV.replace('.html', '').replace(/-/g, ' ') : '上一本');
        const nextTitle = getMeta('book-next-title') || (BOOK_NEXT ? BOOK_NEXT.replace('.html', '').replace(/-/g, ' ') : '下一本');
        const prevTag = getMeta('book-prev-tag') || '经典作家';
        const nextTag = getMeta('book-next-tag') || '经典作家';

        const section = el('section', { class: 'footer-nav py-12 bg-gradient-to-br from-gray-50 to-blue-50 border-t border-gray-200' });
        const container = el('div', { class: 'content-container' });
        const grid = el('div', { class: 'grid grid-cols-1 sm:grid-cols-3 gap-4' });

        // 左: 上一本
        const prevA = el('a', { href: BOOK_PREV || '#', class: 'footer-nav-card group' });
        prevA.innerHTML = '<div class="flex items-center justify-between"><div>' +
            '<p class="footer-nav-label">← 上一本</p>' +
            '<h3 class="footer-nav-title">' + prevTitle + ' | ' + prevTag + '</h3>' +
            '</div><span class="footer-nav-arrow footer-nav-arrow-left">←</span></div>';
        grid.appendChild(prevA);

        // 中: 返回阅读目录
        const homeA = el('a', { href: 'index.html', class: 'footer-nav-center group' });
        homeA.innerHTML = '<div class="flex flex-col items-center justify-center text-center">' +
            '<svg class="footer-nav-icon" width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">' +
            '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />' +
            '</svg>' +
            '<p class="footer-nav-label">返回</p>' +
            '<h3 class="footer-nav-title">阅读目录</h3>' +
            '</div>';
        grid.appendChild(homeA);

        // 右: 下一本
        const nextA = el('a', { href: BOOK_NEXT || '#', class: 'footer-nav-card group' });
        nextA.innerHTML = '<div class="flex items-center justify-between"><div>' +
            '<p class="footer-nav-label">下一本 →</p>' +
            '<h3 class="footer-nav-title">' + nextTitle + ' | ' + nextTag + '</h3>' +
            '</div><span class="footer-nav-arrow footer-nav-arrow-right">→</span></div>';
        grid.appendChild(nextA);

        container.appendChild(grid);
        section.appendChild(container);
        document.body.appendChild(section);
    }

    // ============== 6. 黑色 footer ==============
    function injectBlackFooter() {
        if (document.querySelector('footer#uxFooterBrand')) return;
        // 动态读取当前页面的书名,避免与页面文档不对照
        // 优先级: <meta name="book-title"> > <title> 解析 > 默认 "工具箱"
        let brandTitle = '工具箱';
        const meta = document.querySelector('meta[name="book-title"]');
        if (meta && meta.content) {
            brandTitle = meta.content.replace(/^《|》$/g, '').trim();
        } else {
            const tEl = document.querySelector('title');
            if (tEl && tEl.textContent) {
                const m = tEl.textContent.match(/《(.+?)》/);
                if (m) brandTitle = m[1].trim();
            }
        }
        const footer = el('footer', { id: 'uxFooterBrand', class: 'bg-black text-white py-12 border-t border-white/10' });
        footer.innerHTML = '<div class="content-container text-center">' +
            '<div class="flex items-center justify-center space-x-3 mb-4">' +
            '<span class="text-3xl">🏛️</span>' +
            `<h3 class="text-xl font-bold text-white">${brandTitle}</h3>` +
            '</div>' +
            '<p class="text-[var(--muted)] mb-6">持续更新高质量读书笔记，助你快速成长</p>' +
            '<div class="border-t border-gray-700 pt-6">' +
            '<p class="text-gray-500 text-sm">仅供学习交流，内容版权归原作者所有</p>' +
            '</div></div>';
        document.body.appendChild(footer);
    }

    // ============== 7. 章节高亮 ==============
    function bindChapterHighlight() {
        if (!BOOK_CHAPTERS.length) return;
        const pills = document.querySelectorAll('.nav-chapter-pill');
        if (!pills.length || !('IntersectionObserver' in window)) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    pills.forEach(p => p.classList.remove('is-active'));
                    const id = entry.target.id;
                    const active = document.querySelector('.nav-chapter-pill[href="#' + id + '"]');
                    if (active) active.classList.add('is-active');
                }
            });
        }, { rootMargin: '-100px 0px -50% 0px', threshold: 0.1 });

        BOOK_CHAPTERS.forEach(ch => {
            const section = document.getElementById(ch.id);
            if (section) observer.observe(section);
        });
    }

    // ============== 8. 搜索功能 (左下搜索栏 + 大屏弹层) ==============
    let BOOK_INDEX = null;
    let BOOK_INDEX_PROMISE = null;

    function loadBookIndex() {
        if (BOOK_INDEX) return Promise.resolve(BOOK_INDEX);
        if (BOOK_INDEX_PROMISE) return BOOK_INDEX_PROMISE;
        BOOK_INDEX_PROMISE = fetch('index.html', { credentials: 'omit' })
            .then(r => r.text())
            .then(html => {
                const items = [];
                const linkRe = /<a[^>]+href="([^"]+\.html)"[^>]*>([\s\S]*?)<\/a>/g;
                let m;
                while ((m = linkRe.exec(html)) !== null) {
                    const href = m[1];
                    if (!href || href.startsWith('http') || href === 'index.html') continue;
                    const text = (m[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
                    if (text && text.length > 1) items.push({ key: href, title: text });
                }
                BOOK_INDEX = items;
                return items;
            })
            .catch(() => { BOOK_INDEX = []; return []; });
        return BOOK_INDEX_PROMISE;
    }

    function injectSearch() {
        // 避免重复注入
        if (document.getElementById('btSearchBar')) return;

        // 1) 左下搜索栏
        const bar = document.createElement('div');
        bar.id = 'btSearchBar';
        bar.className = 'ft-search-bar';
        bar.setAttribute('role', 'search');
        bar.innerHTML =
            '<i class="fa-solid fa-magnifying-glass ft-search-icon" aria-hidden="true"></i>' +
            '<input type="search" id="btSearchInput" placeholder="搜索全部书籍..." autocomplete="off">' +
            '<span class="ft-search-kbd">ESC</span>';
        document.body.appendChild(bar);

        // 2) 大屏搜索弹层
        const panel = document.createElement('div');
        panel.id = 'btSearchPanel';
        panel.className = 'ft-search-panel';
        panel.setAttribute('role', 'dialog');
        panel.setAttribute('aria-label', '搜索书籍');
        panel.innerHTML =
            '<input type="search" id="btSearchPanelInput" placeholder="输入书名 / 作者 / 关键词..." autocomplete="off">' +
            '<div class="ft-search-results" id="btSearchResults"></div>';
        document.body.appendChild(panel);
    }

    function bindSearch() {
        const bar = document.getElementById('btSearchBar');
        const barInput = document.getElementById('btSearchInput');
        const panel = document.getElementById('btSearchPanel');
        const panelInput = document.getElementById('btSearchPanelInput');
        const results = document.getElementById('btSearchResults');
        if (!bar || !barInput || !panel || !panelInput || !results) return;

        function renderResults(q) {
            results.innerHTML = '';
            if (!q || !BOOK_INDEX) return;
            const kw = q.toLowerCase();
            const matched = BOOK_INDEX.filter(b => b.title.toLowerCase().includes(kw)).slice(0, 12);
            if (!matched.length) {
                const empty = document.createElement('p');
                empty.className = 'ft-result-empty';
                empty.textContent = '未找到匹配书籍';
                results.appendChild(empty);
                return;
            }
            matched.forEach((b, i) => {
                const a = document.createElement('a');
                a.className = 'ft-result-item' + (i === 0 ? ' is-focused' : '');
                a.href = b.key;
                const title = document.createElement('p');
                title.className = 'ft-result-title';
                title.textContent = b.title;
                const meta = document.createElement('p');
                meta.className = 'ft-result-meta';
                meta.textContent = b.key;
                a.appendChild(title);
                a.appendChild(meta);
                results.appendChild(a);
            });
        }

        // 聚焦搜索栏 → 打开大屏弹层
        barInput.addEventListener('focus', () => {
            panel.classList.add('is-open');
            loadBookIndex();
            setTimeout(() => panelInput.focus(), 50);
        });
        // 底部搜索栏回车直接跳转
        barInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const q = barInput.value.trim();
                if (q && BOOK_INDEX) {
                    const hit = BOOK_INDEX.find(b => b.title.toLowerCase().includes(q.toLowerCase()));
                    if (hit) location.href = hit.key;
                }
            }
        });
        // 大屏弹层实时搜索
        let timer;
        panelInput.addEventListener('input', () => {
            clearTimeout(timer);
            timer = setTimeout(() => renderResults(panelInput.value.trim()), 80);
        });
        // 弹层键盘导航
        panelInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const focused = results.querySelector('.ft-result-item.is-focused');
                if (focused) location.href = focused.getAttribute('href');
            } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                const items = Array.from(results.querySelectorAll('.ft-result-item'));
                if (!items.length) return;
                let idx = items.findIndex(el => el.classList.contains('is-focused'));
                items.forEach(el => el.classList.remove('is-focused'));
                idx = e.key === 'ArrowDown' ? (idx + 1) % items.length
                                              : (idx - 1 + items.length) % items.length;
                items[idx].classList.add('is-focused');
                items[idx].scrollIntoView({ block: 'nearest' });
            }
        });
        // 全局快捷键
        document.addEventListener('keydown', (e) => {
            // ESC 关闭弹层
            if (e.key === 'Escape' && panel.classList.contains('is-open')) {
                panel.classList.remove('is-open');
                barInput.blur();
            }
            // Cmd/Ctrl + K 打开搜索
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                panel.classList.add('is-open');
                loadBookIndex();
                setTimeout(() => panelInput.focus(), 50);
            }
            // 点击 bar 也可打开弹层
            if (e.key === '/' && document.activeElement !== barInput && document.activeElement !== panelInput) {
                e.preventDefault();
                panel.classList.add('is-open');
                loadBookIndex();
                setTimeout(() => panelInput.focus(), 50);
            }
        });
    }

    // ============== 9. 入口 ==============
    function init() {
        if (document.body.dataset.btInit === '1') return;
        document.body.dataset.btInit = '1';
        injectTopNav();
        injectBottomNav();
        injectBlackFooter();
        injectFloatingActions();
        injectSearch();
        bindChapterHighlight();
        bindSearch();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
