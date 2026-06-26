/**
 * ui-ux-pro-max-filter.js · v2.2.9
 *
 * 分类与难度联动逻辑(深度微交互版)
 *
 * v2.2.9 全局微交互增强:
 *   · 滚动进入动画(IntersectionObserver · .reveal-target)
 *   · 顶部导航滚动态(is-scrolled · 玻璃效果)
 *   · 页面加载进度条(.page-progress · 顶部 3px 珊瑚色)
 *   · 图片懒加载渐入(.is-loading → .is-loaded)
 *
 * v2.2.8 微交互增强:
 *   · Ripple 涟漪效果:点击 chip 时从点击位置扩散圆形波纹
 *   · CountUp 数字滚动:旧值上飞 + 新值下入(0.5s)
 *   · 未选中 chip 暗化:body.has-active-filter
 *   · 取消选中弹性:bounce out
 *   · 激活弹簧:bounce in(已存在)
 *   · 书籍卡片瀑布流:visible 卡片依次 30ms 延迟
 *   · 卡片 fade-out:hidden 时 0.2s scale 0.9
 *   · 状态栏/横幅数字脉冲
 *
 * 数据来源:HTML DOM 中的 .book-card 元素(无需服务器数据)
 */

(function () {
    'use strict';

    // ============================================================
    // 0. 工具函数
    // ============================================================
    const $  = (sel, ctx) => (ctx || document).querySelector(sel);
    const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

    // localStorage 记忆键
    const STORAGE_KEY = 'reading:filter:v229';

    // 难度列表
    const DIFFS = ['入门', '中等', '进阶', '挑战'];

    // bookGrid 引用(延迟获取)
    let bookGrid = null;

    // ============================================================
    // 1. Ripple 涟漪效果 · 从点击位置扩散
    // ============================================================
    function createRipple(chip, event) {
        const rect = chip.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 1.2;
        const x = (event.clientX || rect.left + rect.width / 2) - rect.left - size / 2;
        const y = (event.clientY || rect.top + rect.height / 2) - rect.top - size / 2;

        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.width  = size + 'px';
        ripple.style.height = size + 'px';
        ripple.style.left   = x + 'px';
        ripple.style.top    = y + 'px';
        chip.appendChild(ripple);

        // 自动清理
        setTimeout(() => ripple.remove(), 700);
    }

    // ============================================================
    // 2. CountUp 数字滚动 · 旧值上飞 + 新值下入
    // ============================================================
    function animateCount(countEl, newValue) {
        const oldValue = parseInt(countEl.textContent, 10) || 0;
        if (oldValue === newValue) return;

        // 1. 包裹层(如果还没有)
        if (!countEl.querySelector('.count-roll')) {
            countEl.innerHTML = `<span class="count-roll is-new">${oldValue}</span>`;
        }

        const currentRoll = countEl.querySelector('.count-roll');
        if (currentRoll) {
            currentRoll.classList.remove('is-new');
            currentRoll.classList.add('is-old');
        }

        // 2. 数字脉冲动画
        countEl.classList.remove('is-counting');
        void countEl.offsetWidth;
        countEl.classList.add('is-counting');

        // 3. 新值从下方进入
        setTimeout(() => {
            const newRoll = document.createElement('span');
            newRoll.className = 'count-roll is-new';
            newRoll.textContent = newValue;
            countEl.appendChild(newRoll);

            // 触发 reflow 让 transition 生效
            void newRoll.offsetWidth;
            requestAnimationFrame(() => {
                newRoll.style.transform = 'translateY(0)';
                newRoll.style.opacity = '1';
            });

            // 清理旧元素
            setTimeout(() => {
                if (currentRoll && currentRoll.parentNode) {
                    currentRoll.remove();
                }
            }, 550);
        }, 50);
    }

    // ============================================================
    // 3. body.has-active-filter 切换 · 用于 CSS 暗化未选中 chip
    // ============================================================
    function updateBodyFilterClass() {
        const hasActive = $$('.cat-chip.active, .diff-chip.active').length > 0;
        document.body.classList.toggle('has-active-filter', hasActive);
    }

    // ============================================================
    // 4. 初始化:扫描所有 book-card,构建统计表
    // ============================================================
    function buildStats() {
        const stats = {};
        const statsByDiff = {};
        const catOnly = {};
        const diffOnly = {};
        let total = 0;

        $$('.book-card').forEach(card => {
            const cat  = card.dataset.cat  || '其他';
            const diff = card.dataset.diff || '中等';
            if (!cat || !diff) return;

            stats[cat] = stats[cat] || {};
            stats[cat][diff] = (stats[cat][diff] || 0) + 1;
            catOnly[cat] = (catOnly[cat] || 0) + 1;

            statsByDiff[diff] = statsByDiff[diff] || {};
            statsByDiff[diff][cat] = (statsByDiff[diff][cat] || 0) + 1;
            diffOnly[diff] = (diffOnly[diff] || 0) + 1;

            total++;
        });

        return { stats, statsByDiff, catOnly, diffOnly, total };
    }

    // ============================================================
    // 5. 获取当前选中的筛选条件
    // ============================================================
    function getCurrentSelection() {
        const activeCat  = $('.cat-chip.active')  || $('.cat-chip[data-selected="true"]');
        const activeDiff = $('.diff-chip.active') || $('.diff-chip[data-selected="true"]');
        return {
            cat:  activeCat  ? activeCat.dataset.cat  : 'all',
            diff: activeDiff ? activeDiff.dataset.diff : null
        };
    }

    // ============================================================
    // 6. 更新 chip 按钮的 count 显示 + 0 count 灰显
    // ============================================================
    function setChipCount(chip, newCount) {
        const countEl = $('.chip-count', chip);
        if (!countEl) return;
        const old = parseInt(countEl.textContent, 10) || 0;
        if (old === newCount) return;

        // 数字滚动动画
        animateCount(countEl, newCount);

        // 0 count 时灰显
        if (newCount === 0) {
            chip.setAttribute('data-disabled', 'true');
        } else {
            chip.removeAttribute('data-disabled');
        }
    }

    // ============================================================
    // 7. 联动核心:根据当前选中状态,更新所有按钮的 count
    // ============================================================
    function updateAllChips(stats) {
        const sel = getCurrentSelection();
        const { cat, diff } = sel;

        $$('.cat-chip').forEach(chip => {
            const c = chip.dataset.cat;
            let count = 0;
            if (c === 'all') {
                count = stats.total;
            } else {
                if (diff) {
                    count = (stats.statsByDiff[diff] && stats.statsByDiff[diff][c]) || 0;
                } else {
                    count = stats.catOnly[c] || 0;
                }
            }
            setChipCount(chip, count);
        });

        $$('.diff-chip').forEach(chip => {
            const d = chip.dataset.diff;
            let count = 0;
            if (cat === 'all' || !cat) {
                count = stats.diffOnly[d] || 0;
            } else {
                count = (stats.stats[cat] && stats.stats[cat][d]) || 0;
            }
            setChipCount(chip, count);
        });
    }

    // ============================================================
    // 8. 过滤书籍显示
    // ============================================================
    function applyFilter(stats) {
        if (!bookGrid) bookGrid = $('#bookGrid');
        if (!bookGrid) return 0;

        const sel = getCurrentSelection();
        const { cat, diff } = sel;
        let visibleCount = 0;

        $$('.book-card').forEach(card => {
            const c = card.dataset.cat  || '';
            const d = card.dataset.diff || '';
            let show = true;

            if (cat && cat !== 'all' && c !== cat) show = false;
            if (diff && d !== diff) show = false;

            card.style.display = show ? '' : 'none';
            if (show) visibleCount++;
        });

        updateStatusBar(cat, diff, visibleCount);
        showResultBanner(cat, diff, visibleCount);
        showEmptyState(visibleCount);
        updateBodyFilterClass();

        return visibleCount;
    }

    // ============================================================
    // 9. 顶部状态栏
    // ============================================================
    function ensureStatusBar() {
        let bar = $('.filter-status-bar');
        if (bar) return bar;

        const target = $('.section-subtitle') || $('#catFilters');
        if (!target) return null;

        bar = document.createElement('div');
        bar.className = 'filter-status-bar';
        bar.setAttribute('data-empty', 'true');
        target.parentNode.insertBefore(bar, target.nextSibling);
        return bar;
    }

    function updateStatusBar(cat, diff, visibleCount) {
        const bar = ensureStatusBar();
        if (!bar) return;

        if ((!cat || cat === 'all') && !diff) {
            bar.innerHTML = '';
            bar.setAttribute('data-empty', 'true');
            return;
        }

        const tags = [];
        if (cat && cat !== 'all') tags.push(`<span class="status-tag">📂 ${cat}</span>`);
        if (diff)                 tags.push(`<span class="status-tag">📊 ${diff}</span>`);
        tags.push(`<span style="color: var(--ux-muted);">· 共 <span class="status-count">${visibleCount}</span> 本</span>`);
        tags.push(`<button class="status-clear" type="button">清除</button>`);

        bar.innerHTML = tags.join(' ');
        bar.setAttribute('data-empty', 'false');

        // 数字脉冲
        bar.classList.remove('is-updating');
        void bar.offsetWidth;
        bar.classList.add('is-updating');
        setTimeout(() => bar.classList.remove('is-updating'), 650);

        $('.status-clear', bar).addEventListener('click', clearAllFilters);
    }

    // ============================================================
    // 10. 筛选结果横幅
    // ============================================================
    function ensureResultBanner() {
        let banner = $('.filter-result-banner');
        if (banner) return banner;

        const target = $('#bookGrid');
        if (!target) return null;

        banner = document.createElement('div');
        banner.className = 'filter-result-banner';
        target.parentNode.insertBefore(banner, target);
        return banner;
    }

    function showResultBanner(cat, diff, visibleCount) {
        const banner = ensureResultBanner();
        if (!banner) return;

        if ((!cat || cat === 'all') && !diff) {
            banner.style.display = 'none';
            return;
        }

        const labels = [];
        if (cat && cat !== 'all') labels.push(cat);
        if (diff) labels.push(diff);

        banner.innerHTML = `
            <span class="result-icon">🔍</span>
            <span class="result-count">${visibleCount}</span>
            <span class="result-text">本「${labels.join(' · ')}」相关的书</span>
        `;
        banner.style.display = '';

        // 数字脉冲
        banner.classList.remove('is-updating');
        void banner.offsetWidth;
        banner.classList.add('is-updating');
        setTimeout(() => banner.classList.remove('is-updating'), 650);
    }

    // ============================================================
    // 11. 空结果状态
    // ============================================================
    function showEmptyState(visibleCount) {
        if (!bookGrid) bookGrid = $('#bookGrid');
        if (!bookGrid) return;

        let empty = $('.filter-empty-state', bookGrid);

        if (visibleCount > 0) {
            if (empty) empty.remove();
            bookGrid.classList.remove('is-empty');
            return;
        }

        if (!empty) {
            empty = document.createElement('div');
            empty.className = 'filter-empty-state';
            empty.innerHTML = `
                <div class="empty-icon">📚</div>
                <div class="empty-title">未找到符合条件的书</div>
                <div class="empty-desc">尝试调整筛选条件,或清除所有筛选</div>
                <button class="empty-action" type="button">🔄 清除所有筛选</button>
            `;
            empty.querySelector('.empty-action').addEventListener('click', clearAllFilters);
            bookGrid.appendChild(empty);
        }
        bookGrid.classList.add('is-empty');
    }

    // ============================================================
    // 12. 清除所有筛选
    // ============================================================
    function clearAllFilters() {
        $$('.cat-chip').forEach(c => {
            c.classList.remove('active');
            c.removeAttribute('data-selected');
            c.removeAttribute('data-disabled');
            if (c.dataset.cat === 'all') {
                c.classList.add('active');
                c.setAttribute('data-selected', 'true');
            }
        });
        $$('.diff-chip').forEach(c => {
            c.classList.remove('active');
            c.removeAttribute('data-selected');
            c.removeAttribute('data-disabled');
        });

        const stats = buildStats();
        updateAllChips(stats);
        applyFilter(stats);
        saveSelection();
        scrollToFilters();
        hideToast();
    }

    // ============================================================
    // 12.5 顶部浮动提示条 · 点击 chip 后立即出现,2.4s 后自动淡出
    // ============================================================
    let toastTimer = null;
    function ensureToast() {
        let t = $('.filter-toast');
        if (t) return t;
        t = document.createElement('div');
        t.className = 'filter-toast';
        t.setAttribute('role', 'status');
        t.setAttribute('aria-live', 'polite');
        document.body.appendChild(t);
        return t;
    }

    function showToast(cat, diff, count) {
        const t = ensureToast();
        if (!t) return;

        const catText = (cat && cat !== 'all') ? cat : '全部分类';
        const diffText = diff ? diff : '全部难度';
        const icon = count > 0 ? '🔍' : '⚠️';

        t.innerHTML = `
            <span class="toast-icon">${icon}</span>
            <span class="toast-text">已筛选</span>
            <strong style="color:#fff">${catText}</strong>
            <span class="toast-text" style="opacity:.5">·</span>
            <strong style="color:#fff">${diffText}</strong>
            <span class="toast-text" style="opacity:.5">·</span>
            <span class="toast-text">共</span>
            <span class="toast-count">${count}</span>
            <span class="toast-text">本</span>
            <button class="toast-clear" type="button" aria-label="清除筛选">清除</button>
        `;

        // 数字 CountUp
        const countEl = $('.toast-count', t);
        if (countEl) {
            countEl.textContent = '0';
            requestAnimationFrame(() => animateCount(countEl, count));
        }

        // 显示
        requestAnimationFrame(() => t.classList.add('is-visible'));

        // 清除按钮
        const clearBtn = $('.toast-clear', t);
        if (clearBtn) {
            clearBtn.onclick = clearAllFilters;
        }

        // 自动隐藏
        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(hideToast, 2400);
    }

    function hideToast() {
        const t = $('.filter-toast');
        if (t) t.classList.remove('is-visible');
        if (toastTimer) {
            clearTimeout(toastTimer);
            toastTimer = null;
        }
    }

    // ============================================================
    // 12.6 容器点击波纹动画
    // ============================================================
    function pulseContainer(chip) {
        const container = chip.closest('.chip-container');
        if (!container) return;
        container.classList.remove('is-clicked');
        void container.offsetWidth;
        container.classList.add('is-clicked');
        setTimeout(() => container.classList.remove('is-clicked'), 400);
    }

    // ============================================================
    // 13. 自动滚动到书籍列表
    // ============================================================
    function scrollToBooks(loadingDelay) {
        if (!bookGrid) bookGrid = $('#bookGrid');
        if (!bookGrid) return;

        if (loadingDelay > 0) {
            bookGrid.classList.add('is-loading');
            setTimeout(() => {
                bookGrid.classList.remove('is-loading');
                bookGrid.classList.add('is-loaded');
                setTimeout(() => bookGrid.classList.remove('is-loaded'), 800);
                bookGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, loadingDelay);
        } else {
            bookGrid.classList.add('is-loaded');
            setTimeout(() => bookGrid.classList.remove('is-loaded'), 800);
            bookGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    function scrollToFilters() {
        const filters = $('#catFilters');
        if (filters) {
            filters.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // ============================================================
    // 14. 点击分类按钮
    // ============================================================
    function onCatClick(e) {
        const chip = e.currentTarget;
        const isActive = chip.classList.contains('active');

        // Ripple 涟漪 + 容器波纹
        createRipple(chip, e);
        pulseContainer(chip);

        // 状态切换
        $$('.cat-chip').forEach(c => {
            if (c !== chip && c.classList.contains('active')) {
                // 取消其他激活状态时用 bounce-out
                c.classList.remove('is-activating');
                c.classList.add('is-deactivating');
                setTimeout(() => c.classList.remove('is-deactivating'), 400);
            }
            c.classList.remove('active');
            c.removeAttribute('data-selected');
        });

        if (isActive && chip.dataset.cat !== 'all') {
            const allChip = $('.cat-chip[data-cat="all"]');
            if (allChip) {
                allChip.classList.add('active');
                allChip.setAttribute('data-selected', 'true');
                allChip.classList.remove('is-activating');
                void allChip.offsetWidth;
                allChip.classList.add('is-activating');
                setTimeout(() => allChip.classList.remove('is-activating'), 500);
            }
        } else {
            chip.classList.add('active');
            chip.setAttribute('data-selected', 'true');
            chip.classList.remove('is-activating');
            void chip.offsetWidth;
            chip.classList.add('is-activating');
            setTimeout(() => chip.classList.remove('is-activating'), 500);
        }

        const stats = buildStats();
        updateAllChips(stats);
        const visibleCount = applyFilter(stats);
        saveSelection();
        scrollToBooks(280);

        // 顶部 toast 提示
        const sel = getCurrentSelection();
        showToast(sel.cat, sel.diff, visibleCount);
    }

    // ============================================================
    // 15. 点击难度按钮(多选)
    // ============================================================
    function onDiffClick(e) {
        const chip = e.currentTarget;
        const isActive = chip.classList.contains('active');

        // Ripple 涟漪 + 容器波纹
        createRipple(chip, e);
        pulseContainer(chip);

        if (isActive) {
            chip.classList.remove('active');
            chip.removeAttribute('data-selected');
            chip.classList.remove('is-activating');
            void chip.offsetWidth;
            chip.classList.add('is-deactivating');
            setTimeout(() => chip.classList.remove('is-deactivating'), 400);
        } else {
            chip.classList.add('active');
            chip.setAttribute('data-selected', 'true');
            chip.classList.remove('is-deactivating');
            void chip.offsetWidth;
            chip.classList.add('is-activating');
            setTimeout(() => chip.classList.remove('is-activating'), 500);
        }

        const stats = buildStats();
        updateAllChips(stats);
        const visibleCount = applyFilter(stats);
        saveSelection();
        scrollToBooks(280);

        // 顶部 toast 提示
        const sel = getCurrentSelection();
        showToast(sel.cat, sel.diff, visibleCount);
    }

    // ============================================================
    // 16. localStorage 记忆
    // ============================================================
    function saveSelection() {
        try {
            const sel = getCurrentSelection();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(sel));
        } catch (e) {}
    }

    function restoreSelection() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return;
            const sel = JSON.parse(raw);

            if (sel.cat) {
                $$('.cat-chip').forEach(c => {
                    if (c.dataset.cat === sel.cat) {
                        c.classList.add('active');
                        c.setAttribute('data-selected', 'true');
                    } else {
                        c.classList.remove('active');
                        c.removeAttribute('data-selected');
                    }
                });
            }
            if (sel.diff) {
                $$('.diff-chip').forEach(c => {
                    if (c.dataset.diff === sel.diff) {
                        c.classList.add('active');
                        c.setAttribute('data-selected', 'true');
                    }
                });
            }
        } catch (e) {}
    }

    // ============================================================
    // 17. v2.2.9 全局微交互 · 页面加载进度条
    // ============================================================
    function setupPageProgress() {
        // 1. 注入进度条元素
        let bar = document.querySelector('.page-progress');
        if (!bar) {
            bar = document.createElement('div');
            bar.className = 'page-progress';
            bar.setAttribute('aria-hidden', 'true');
            document.body.appendChild(bar);
        }

        // 2. 立即推进 30%(表示页面开始解析)
        requestAnimationFrame(() => {
            bar.style.width = '30%';
        });

        // 3. DOMContentLoaded 时推到 70%
        if (document.readyState !== 'complete') {
            const onReady = () => {
                bar.style.width = '70%';
            };
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', onReady, { once: true });
            } else {
                onReady();
            }
        }

        // 4. 全部资源加载完推到 100%
        const onComplete = () => {
            bar.style.width = '100%';
            setTimeout(() => {
                bar.classList.add('is-done');
                // 1s 后移除元素
                setTimeout(() => bar.remove(), 1000);
            }, 300);
        };

        if (document.readyState === 'complete') {
            onComplete();
        } else {
            window.addEventListener('load', onComplete, { once: true });
        }
    }

    // ============================================================
    // 18. v2.2.9 全局微交互 · 顶部导航滚动态
    // ============================================================
    function setupNavScroll() {
        // 1. 优先找 .site-nav · 兼容其他选择器
        const nav = document.querySelector('.site-nav, .nav-glass, nav[role="navigation"], header.nav, header');
        if (!nav) return;
        // 兼容:取第一个 sticky/fixed 的导航
        const target = nav.classList.contains('site-nav') ? nav :
                       (document.querySelector('.site-nav') ||
                        document.querySelector('.nav-glass') ||
                        nav);

        let ticking = false;
        const update = () => {
            const scrolled = window.scrollY > 8;
            target.classList.toggle('is-scrolled', scrolled);
            ticking = false;
        };

        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(update);
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        // 初始检查
        update();
    }

    // ============================================================
    // 19. v2.2.9 全局微交互 · 滚动进入动画(IntersectionObserver)
    // ============================================================
    function setupRevealAnimations() {
        // 1. 自动给符合条件的元素添加 reveal-target
        //    规则:.section, .featured-card, .book-card, .mood-card, .stat-card
        const AUTO_TARGETS = [
            '.section',
            '.featured-card',
            '.mood-card',
            '.stat-card',
            '.counter',
            '.metric'
        ];

        AUTO_TARGETS.forEach(sel => {
            $$(sel).forEach((el, idx) => {
                if (el.classList.contains('reveal-target')) return;
                el.classList.add('reveal-target');
                // 错开延迟(0-7 循环)
                const delay = idx % 8;
                el.setAttribute('data-reveal-delay', String(delay));
            });
        });

        // 2. 创建观察器
        if (!('IntersectionObserver' in window)) {
            // 不支持则直接显示
            $$('.reveal-target').forEach(el => el.classList.add('is-revealed'));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    // 触发后取消观察(只触发一次)
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.08,
            rootMargin: '0px 0px -60px 0px'  // 提前 60px 触发
        });

        $$('.reveal-target').forEach(el => observer.observe(el));
    }

    // ============================================================
    // 20. v2.2.9 全局微交互 · 图片懒加载渐入
    // ============================================================
    function setupImageLazyFadeIn() {
        $$('img').forEach(img => {
            // 跳过已经处理过的
            if (img.dataset.fadeProcessed) return;
            img.dataset.fadeProcessed = '1';

            // 已经加载完成
            if (img.complete && img.naturalHeight !== 0) {
                img.classList.add('is-loaded');
                return;
            }

            img.classList.add('is-loading');
            const onLoad = () => {
                img.classList.remove('is-loading');
                img.classList.add('is-loaded');
            };
            const onError = () => {
                img.classList.remove('is-loading');
                // 加载失败不阻塞
            };

            img.addEventListener('load', onLoad, { once: true });
            img.addEventListener('error', onError, { once: true });
        });
    }

    // ============================================================
    // 21. 初始化入口
    // ============================================================
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        bookGrid = $('#bookGrid');
        restoreSelection();

        const stats = buildStats();

        $$('.cat-chip').forEach(chip => chip.addEventListener('click', onCatClick));
        $$('.diff-chip').forEach(chip => chip.addEventListener('click', onDiffClick));

        updateAllChips(stats);
        applyFilter(stats);

        // v2.2.9 全局微交互初始化
        setupPageProgress();
        setupNavScroll();
        setupRevealAnimations();
        setupImageLazyFadeIn();

        window.__readingFilter = {
            stats,
            refresh: function() {
                const fresh = buildStats();
                updateAllChips(fresh);
                applyFilter(fresh);
                window.__readingFilter.stats = fresh;
            },
            clear: clearAllFilters,
            scrollToBooks: () => scrollToBooks(0)
        };

        console.log('[ui-ux-pro-max-filter.js v2.2.9] 联动 + 全局微交互已初始化');
        console.log('  - 共扫描', stats.total, '本书');
        console.log('  - 分类数:', Object.keys(stats.catOnly).length);
        console.log('  - 难度数:', Object.keys(stats.diffOnly).length);
        console.log('  - 微交互: Ripple + CountUp + 瀑布流 + 暗化 + 滚动进入 + 导航滚动态 + 加载进度条');
    }

    init();
})();
