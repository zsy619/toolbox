/* ============================================================
   交互逻辑：渲染 / 存储 / SKILL.md 生成 / 复制下载 / 主题
   ============================================================ */

(function () {
    'use strict';

    const $ = (s) => document.querySelector(s);
    const $$ = (s) => Array.from(document.querySelectorAll(s));

    const STORE_KEY = 'skill-workbench-v1';
    const THEME_KEY = 'skill-theme';

    /* ============================================================
       1. Toast 提示
       ============================================================ */
    let toastTimer;
    function toast(msg) {
        const box = $('#toast');
        const text = $('#toastMsg');
        if (!box || !text) return;
        text.textContent = msg;
        box.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => box.classList.remove('show'), 2000);
    }

    /* ============================================================
       2. 复制（优先剪贴板 API，降级用 execCommand）
       ============================================================ */
    async function copyText(text) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                return true;
            }
        } catch (e) { /* 继续走降级方案 */ }

        try {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.setAttribute('readonly', '');
            ta.style.position = 'fixed';
            ta.style.top = '-9999px';
            document.body.appendChild(ta);
            ta.select();
            const ok = document.execCommand('copy');
            document.body.removeChild(ta);
            return ok;
        } catch (e) {
            return false;
        }
    }

    /* ============================================================
       3. 主题切换
       ============================================================ */
    function syncThemeIcons() {
        const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
        $$('.dark-only').forEach(el => el.classList.toggle('hidden', !isDark));
        $$('.light-only').forEach(el => el.classList.toggle('hidden', isDark));
    }

    function initTheme() {
        syncThemeIcons();
        $('#themeBtn')?.addEventListener('click', () => {
            const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', next);
            try { localStorage.setItem(THEME_KEY, next); } catch (e) { }
            syncThemeIcons();
        });
    }

    /* ============================================================
       4. 数据读写
       ============================================================ */
    let state = {};

    function collect() {
        const data = {};
        $$('[data-k]').forEach(el => { data[el.dataset.k] = el.value; });
        $$('[data-test]').forEach(el => { data['test_' + el.dataset.test] = el.checked; });
        $$('[data-stage-done]').forEach(el => { data['stage_' + el.dataset.stageDone] = el.checked; });
        return data;
    }

    function applyToForm(data) {
        Object.keys(data).forEach(k => {
            if (k.startsWith('test_') || k.startsWith('stage_')) return;
            const el = document.querySelector('[data-k="' + k + '"]');
            if (el) el.value = data[k] ?? '';
        });
        $$('[data-test]').forEach(el => { el.checked = !!data['test_' + el.dataset.test]; });
        $$('[data-stage-done]').forEach(el => { el.checked = !!data['stage_' + el.dataset.stageDone]; });
    }

    let saveTimer;
    function save() {
        clearTimeout(saveTimer);
        saveTimer = setTimeout(() => {
            state = collect();
            try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { }
        }, 300);
    }

    function load() {
        try {
            const raw = localStorage.getItem(STORE_KEY);
            return raw ? JSON.parse(raw) : {};
        } catch (e) {
            return {};
        }
    }

    /* ============================================================
       5. SKILL.md 生成
       —— 把表单内容按「六类规则」骨架组装成可交付的正文
       ============================================================ */
    function val(k) {
        const el = document.querySelector('[data-k="' + k + '"]');
        return el ? el.value.trim() : '';
    }

    /* 只保留非空行，避免空段落留下空行 */
    function lines(txt) {
        return txt.split('\n').map(s => s.trim()).filter(Boolean);
    }

    /* 剥离行首的列表符号，避免生成 Markdown 时出现 "- - xxx" 这类嵌套 */
    function stripBullet(s) {
        return s
            .replace(/^\s*(\d+)\s*[.、)）]\s*/, '')
            .replace(/^\s*[-*•·]\s*/, '')
            .trim();
    }

    function buildSkillMd() {
        const name = val('skillName') || '未命名 Skill';
        const desc = val('skillDesc') || val('goalSentence') || '待填写一句话用途';
        const L = [];

        // YAML frontmatter：原生 Skill 的元信息
        L.push('---');
        L.push('name: ' + name);
        L.push('description: ' + desc);
        L.push('version: ' + (val('version') || 'V1'));
        L.push('---');
        L.push('');
        L.push('# ' + name);
        L.push('');

        if (val('goalSentence')) {
            L.push('> ' + val('goalSentence'));
            L.push('');
        }

        // ① 场景
        L.push('## 一、场景');
        L.push('');
        L.push('**适用：**' + (val('rUse') || '待填写'));
        L.push('');
        L.push('**不适用：**' + (val('rNotUse') || '待填写'));
        L.push('');

        // ② 输入
        L.push('## 二、输入');
        L.push('');
        L.push('**必需材料：**' + (val('rInReq') || '待填写'));
        L.push('');
        if (val('rInOpt')) L.push('**可选材料：**' + val('rInOpt'));
        if (val('rInOpt')) L.push('');
        L.push('**缺少时怎么办：**' + (val('rInMiss') || '待填写'));
        L.push('');

        // ③ 步骤
        L.push('## 三、步骤');
        L.push('');
        const steps = lines(val('rSteps'));
        if (steps.length) {
            // 用户可能写成 "1. xxx" / "2、xxx" / "- xxx" / 纯文本，
            // 这里全部剥离原有标记再统一重编号，避免出现
            // "- 做C" 这类无序项混在有序列表里
            steps.forEach((s, i) => {
                const clean = s
                    .replace(/^\s*(\d+)\s*[.、)）:：]\s*/, '')  // 去掉 "1." "2、" "3)" 等序号
                    .replace(/^\s*[-*•·]\s*/, '')              // 去掉无序列表符号
                    .replace(/^\s*第[一二三四五六七八九十]+步[：:]\s*/, '') // 去掉「第一步：」
                    .trim();
                L.push(`${i + 1}. ${clean || '待填写'}`);
            });
        } else {
            L.push('待填写');
        }
        L.push('');

        // ④ 标准
        L.push('## 四、标准');
        L.push('');
        L.push('**可核对的质量线：**' + (val('rStd') || '待填写'));
        L.push('');
        const crit = lines(val('criteria'));
        if (crit.length) {
            L.push('**验收标准：**');
            crit.forEach(c => L.push('- ' + c));
            L.push('');
        }
        if (val('rPos')) { L.push('**正例 ✓：**' + val('rPos')); L.push(''); }
        if (val('rNeg')) { L.push('**反例 ✕：**' + val('rNeg')); L.push(''); }

        // ⑤ 边界
        L.push('## 五、边界');
        L.push('');
        L.push('- **缺信息：**' + (val('rEdgeMiss') || '待填写'));
        L.push('- **材料冲突：**' + (val('rEdgeConflict') || '待填写'));
        L.push('- **超出范围：**' + (val('rEdgeOver') || '待填写'));
        L.push('');

        // ⑥ 输出
        L.push('## 六、输出');
        L.push('');
        L.push('**固定结构：**');
        L.push('');
        const outs = lines(val('rOutStruct'));
        outs.length ? outs.forEach(o => L.push('- ' + stripBullet(o))) : L.push('- 待填写');
        L.push('');
        if (val('rOutField')) {
            L.push('**必须包含的字段：**' + val('rOutField'));
            L.push('');
        }

        // 调用示例
        L.push('## 七、调用示例');
        L.push('');
        L.push('```');
        L.push(val('callExample') || ('按【' + name + '】的规则处理下面的材料。'));
        L.push('```');
        L.push('');

        // 注意事项
        const warnings = lines(val('reminders'));
        if (warnings.length) {
            L.push('## 八、注意事项');
            L.push('');
            warnings.forEach(w => L.push('- ' + w));
            L.push('');
        }

        // 配套资料
        if (val('assets') && val('assets') !== '无') {
            L.push('## 配套资料');
            L.push('');
            L.push('- ' + val('assets'));
            L.push('');
        }

        L.push('---');
        L.push('');
        L.push('*' + (val('path') || '未标注') + ' · 由 Skill 封装工作台生成*');

        return L.join('\n');
    }

    /* ============================================================
       6. 六类规则完整度
       ============================================================ */
    const RULE_KEYS = [
        'rUse', 'rNotUse',
        'rInReq', 'rInOpt', 'rInMiss',
        'rSteps',
        'rStd', 'rPos', 'rNeg',
        'rEdgeMiss', 'rEdgeConflict', 'rEdgeOver',
        'rOutStruct', 'rOutField'
    ];

    function updateRuleProgress() {
        const filled = RULE_KEYS.filter(k => val(k)).length;
        const pct = Math.round((filled / RULE_KEYS.length) * 100);
        $('#rulePct').textContent = pct + '%';
        $('#ruleFill').style.width = pct + '%';

        const hint = $('#ruleHint');
        if (pct >= 85) {
            hint.textContent = '规则已比较完整，可以直接复制到工具里做 V1 了。';
            hint.className = 'text-[11px] leading-relaxed text-accent';
        } else if (pct >= 50) {
            hint.textContent = '还差一些关键规则没填。重点补齐「边界」和「输出」——这两类最容易漏。';
            hint.className = 'text-[11px] leading-relaxed text-warn';
        } else {
            hint.textContent = '填得越多，右边的 SKILL.md 越可直接用。建议先把六个「场景/输入/步骤/边界」填满。';
            hint.className = 'text-[11px] leading-relaxed text-raw/42';
        }
    }

    /* ============================================================
       7. 渲染：五阶段步骤条
       ============================================================ */
    function renderStages() {
        const list = $('#stageList');
        if (!list) return;

        list.innerHTML = STAGES.map((s, i) => `
            <li class="stage-item relative flex gap-3 lg:flex-col lg:items-center lg:text-center"
                data-stage="${i}">
                ${i < STAGES.length - 1 ? '<span class="stage-rail" aria-hidden="true"></span>' : ''}
                <label class="flex cursor-pointer items-start gap-3 lg:flex-col lg:items-center lg:gap-2">
                    <span class="stage-dot grid h-8 w-8 shrink-0 place-items-center rounded-[.6rem] border border-line/15 text-xs font-semibold text-raw/50 transition-all duration-300">
                        <input type="checkbox" data-stage-done="${i}" class="sr-only" />
                        <span class="stage-no">${s.no}</span>
                    </span>
                    <span class="min-w-0">
                        <span class="block text-[13px] font-semibold leading-tight">${s.short}</span>
                        <span class="mt-0.5 block text-[10.5px] leading-snug text-raw/40">${s.desc}</span>
                    </span>
                </label>
            </li>
        `).join('');

        // 已完成的阶段：隐藏序号圆点、加对勾
        $$('[data-stage-done]').forEach(cb => {
            const sync = () => {
                const item = cb.closest('.stage-item');
                const no = item?.querySelector('.stage-no');
                item?.classList.toggle('is-done', cb.checked);
                item?.classList.toggle('is-active', !cb.checked);
                if (no) no.textContent = cb.checked ? '✓' : STAGES[Number(cb.dataset.stageDone)].no;
            };
            cb.addEventListener('change', () => { sync(); updateStageProgress(); save(); });
            sync();
        });

        updateStageProgress();
    }

    function updateStageProgress() {
        const boxes = $$('[data-stage-done]');
        const done = boxes.filter(b => b.checked).length;
        const pct = Math.round((done / boxes.length) * 100);
        $('#stagePct').textContent = pct + '%';
        $('#stageFill').style.width = pct + '%';
    }

    /* ============================================================
       8. 渲染：五阶段教程
       ============================================================ */
    function renderTutorial() {
        const box = $('#tutorialList');
        if (!box) return;

        box.innerHTML = STAGES.map((s, i) => `
            <details class="acc" ${i === 0 ? 'open' : ''}>
                <summary>
                    <svg class="chev h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                    <span class="badge badge-p">第 ${s.no} 阶段</span>
                    <span class="min-w-0 flex-1">
                        <span class="block font-display text-[14px] font-semibold leading-tight">${s.title}</span>
                        <span class="mt-0.5 block text-[11.5px] leading-snug text-raw/45">${s.desc}</span>
                    </span>
                </summary>

                <div class="border-t border-line/08 px-4 py-4">

                    <!-- 要点 -->
                    <ul class="space-y-1.5">
                        ${s.points.map(p => `
                            <li class="flex gap-2 text-[12.5px] leading-relaxed">
                                <span class="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-primary"></span>
                                <span>${p}</span>
                            </li>`).join('')}
                    </ul>

                    <!-- 要回答的问题 -->
                    <p class="eyebrow mt-5">要回答的问题</p>
                    <div class="mt-2 space-y-2">
                        ${s.questions.map(q => `
                            <div class="rounded-lg border border-line/1 p-3">
                                <p class="text-[12.5px] font-medium leading-relaxed">${q.q}</p>
                                <p class="mt-1 text-[11.5px] leading-relaxed text-raw/42">
                                    ${q.hint}
                                </p>
                            </div>`).join('')}
                    </div>

                    <!-- 示例参考 -->
                    <div class="mt-4 rounded-lg border border-accent/25 bg-accent/8 p-3">
                        <p class="text-[10px] font-semibold uppercase tracking-widest text-accent">
                            示例参考 · 模拟场景，不是你的作业答案
                        </p>
                        <p class="mt-1.5 text-[12.5px] leading-relaxed text-raw/72">${s.example}</p>
                    </div>

                    <!-- 阶段跳转 -->
                    <a href="#workbench" class="btn btn-ghost mt-4 !min-h-9 !text-[11.5px]">
                        去工作台填写这一阶段
                        <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                    </a>
                </div>
            </details>
        `).join('');
    }

    /* ============================================================
       9. 渲染：提示词库
       ============================================================ */
    function renderPrompts() {
        const box = $('#promptList');
        if (!box) return;

        box.innerHTML = PROMPTS.map((p, i) => `
            <details class="acc">
                <summary>
                    <svg class="chev h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                    <span class="badge badge-a">${p.stage}</span>
                    <span class="min-w-0 flex-1 truncate font-display text-[13.5px] font-semibold">${p.title}</span>
                    <button type="button" class="btn btn-ghost !min-h-8 !px-2.5 !text-[11px] js-copy-prompt"
                        data-pi="${i}" onclick="event.preventDefault();event.stopPropagation();"
                        aria-label="复制提示词">
                        <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                            <rect x="9" y="9" width="11" height="11" rx="2" />
                            <path d="M5 15V6a2 2 0 012-2h8" />
                        </svg>
                        复制
                    </button>
                </summary>
                <div class="border-t border-line/08 p-4">
                    <div class="prompt-box">${escapeHtml(p.body)}</div>
                </div>
            </details>
        `).join('');

        // 事件委托：复制提示词
        box.addEventListener('click', async (e) => {
            const btn = e.target.closest('.js-copy-prompt');
            if (!btn) return;
            e.preventDefault();
            e.stopPropagation();
            const p = PROMPTS[Number(btn.dataset.pi)];
            const ok = await copyText(p.body);
            toast(ok ? '提示词已复制' : '复制失败，请手动选中');
        });
    }

    function escapeHtml(s) {
        return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    /* ============================================================
       10. 渲染：案例库
       ============================================================ */
    function renderCases() {
        const box = $('#caseGroups');
        if (!box) return;

        box.innerHTML = CASES.map((g, gi) => `
            <div>
                <p class="font-display mb-2.5 text-[14px] font-semibold">${g.group}</p>
                <div class="grid gap-2.5 md:grid-cols-2">
                    ${g.items.map((c, ci) => `
                        <article class="card card-hover p-4">
                            <div class="flex items-center gap-2">
                                <span class="badge badge-p">${c.who}</span>
                            </div>
                            <h3 class="font-display mt-2 text-[14px] font-semibold leading-snug">${c.title}</h3>
                            <p class="mt-1.5 text-[12.5px] leading-relaxed text-raw/60">${c.intro}</p>
                            <p class="mt-2.5 rounded-lg bg-raw/05 p-2.5 text-[11.5px] leading-relaxed text-raw/52">
                                <span class="font-semibold text-primary">重点借鉴 · </span>${c.key}
                            </p>
                            <a href="${c.url}" target="_blank" rel="noopener"
                                class="btn btn-ghost mt-3 !min-h-9 w-full !text-[11.5px]">
                                查看原文 ↗
                            </a>
                        </article>`).join('')}
                </div>
            </div>
        `).join('');
    }

    /* ============================================================
       11. 导入 / 导出
       ============================================================ */
    function exportJson() {
        state = collect();
        const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const stamp = new Date().toISOString().slice(0, 10);
        a.href = url;
        a.download = `skill-workbench-${stamp}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast('已导出 JSON');
    }

    function fillDemo() {
        applyToForm(DEMO);
        $$('[data-stage-done]').forEach((cb, i) => { cb.checked = i < 2; });
        $$('[data-stage-done]').forEach(cb => {
            const item = cb.closest('.stage-item');
            const no = item?.querySelector('.stage-no');
            item?.classList.toggle('is-done', cb.checked);
            item?.classList.toggle('is-active', !cb.checked);
            if (no) no.textContent = cb.checked ? '✓' : STAGES[Number(cb.dataset.stageDone)].no;
        });
        updateStageProgress();
        refresh();
        save();
        toast('已载入示例（模拟场景）');
    }

    function resetAll() {
        if (!confirm('清空所有已填写内容？此操作不可撤销。')) return;
        applyToForm({});
        $$('[data-stage-done]').forEach(cb => { cb.checked = false; });
        $$('[data-stage-done]').forEach(cb => {
            const item = cb.closest('.stage-item');
            const no = item?.querySelector('.stage-no');
            item?.classList.remove('is-done');
            item?.classList.add('is-active');
            if (no) no.textContent = STAGES[Number(cb.dataset.stageDone)].no;
        });
        try { localStorage.removeItem(STORE_KEY); } catch (e) { }
        updateStageProgress();
        refresh();
        toast('已清空');
    }

    /* ============================================================
       12. 预览刷新
       ============================================================ */
    function refresh() {
        const md = buildSkillMd();
        const pre = $('#mdPreview');
        if (pre) pre.textContent = md;
        updateRuleProgress();
    }

    /* ============================================================
       13. 初始化
       ============================================================ */
    function init() {
        initTheme();

        renderStages();
        renderTutorial();
        renderPrompts();
        renderCases();

        // 恢复已保存内容
        const saved = load();
        if (Object.keys(saved).length) applyToForm(saved);
        refresh();
        updateStageProgress();

        // 表单输入 → 实时生成 + 防抖保存
        document.addEventListener('input', (e) => {
            if (e.target.matches('[data-k]')) { refresh(); save(); }
        });
        document.addEventListener('change', (e) => {
            if (e.target.matches('[data-k]')) { refresh(); save(); }
            if (e.target.matches('[data-test]')) save();
        });

        // SKILL.md 操作
        $('#copyMdBtn')?.addEventListener('click', async () => {
            const ok = await copyText(buildSkillMd());
            toast(ok ? 'SKILL.md 已复制' : '复制失败，请手动选中');
        });

        $('#downloadMdBtn')?.addEventListener('click', () => {
            const blob = new Blob([buildSkillMd()], { type: 'text/markdown;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            const nm = (val('skillName') || 'skill').replace(/\s+/g, '-');
            const ver = val('version') || 'V1';
            a.href = url;
            a.download = `SKILL-${nm}-${ver}.md`;
            a.click();
            URL.revokeObjectURL(url);
            toast('已下载 SKILL.md');
        });

        // 导入导出
        $('#exportBtn')?.addEventListener('click', exportJson);
        $('#exportBtnMobile')?.addEventListener('click', exportJson);
        $('#resetBtn')?.addEventListener('click', resetAll);
        $('#resetBtnMobile')?.addEventListener('click', resetAll);
        $('#demoBtn')?.addEventListener('click', fillDemo);

        $('#importBtn')?.addEventListener('click', () => $('#importFile')?.click());
        $('#importFile')?.addEventListener('change', async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            try {
                const data = JSON.parse(await file.text());
                applyToForm(data);
                refresh();
                save();
                toast('已导入数据');
            } catch (err) {
                toast('导入失败：文件格式不正确');
            }
            e.target.value = '';
        });

        // 移动端菜单
        const menuBtn = $('#menuBtn');
        const menu = $('#mobileMenu');
        menuBtn?.addEventListener('click', () => {
            const open = menu.classList.toggle('open');
            menuBtn.setAttribute('aria-expanded', String(open));
        });
        $$('.mob-link').forEach(a => a.addEventListener('click', () => {
            menu.classList.remove('open');
            menuBtn?.setAttribute('aria-expanded', 'false');
        }));

        // 桌面端导航高亮当前区块
        const sections = ['tutorial', 'workbench', 'testing', 'prompts', 'cases'];
        const navLinks = $$('nav a[href^="#"]');
        if ('IntersectionObserver' in window) {
            const io = new IntersectionObserver((entries) => {
                entries.forEach(en => {
                    if (!en.isIntersecting) return;
                    navLinks.forEach(l => {
                        const on = l.getAttribute('href') === '#' + en.target.id;
                        l.classList.toggle('text-ink', on);
                        l.classList.toggle('bg-raw/06', on);
                    });
                });
            }, { rootMargin: '-20% 0px -70% 0px' });
            sections.forEach(id => { const el = document.getElementById(id); if (el) io.observe(el); });
        }

        // 快捷键：Ctrl/Cmd + S 导出 JSON（防误触浏览器保存）
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
                e.preventDefault();
                exportJson();
                toast('已导出 JSON');
            }
        });
    }

    // 暴露给 HTML 内联按钮用
    window.fillDemo = fillDemo;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();