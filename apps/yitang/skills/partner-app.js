/* ============================================================
   逻辑层：Partner 封装工作台
   —— 依赖 partner-data.js 中的 P_STAGES / TCPR / TRI_CORNERS 等数据
   —— 负责渲染、字段绑定、本地持久化与实时预览生成
   ============================================================ */
(function () {
    'use strict';

    const $ = (s, r) => (r || document).querySelector(s);
    const $$ = (s, r) => [...(r || document).querySelectorAll(s)];

    /* ============================================================
       1. 工具函数
       ============================================================ */

    /** 转义 HTML，防止用户输入破坏标签结构 */
    function esc(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    /** 空值占位：未填写时显示灰色提示，避免预览看起来像漏填 */
    function or(v, ph) {
        const t = String(v || '').trim();
        return t || '【' + ph + '】';
    }

    /**
     * 读取字段值。
     * 注意：双三角六角用 data-tri 而非 data-k 标记，这里必须一并查找，
     * 否则预览里永远读不到六角内容（collect() 存的键名是 tri_ 前缀）。
     */
    function val(k) {
        const el = document.querySelector('[data-k="' + k + '"]')
            || document.querySelector('[data-tri="' + k.replace(/^tri_/, '') + '"]');
        return el ? el.value.trim() : '';
    }

    const save = debounce(() => {
        try {
            localStorage.setItem('partner-draft', JSON.stringify(collect()));
        } catch (e) { /* 隐私模式下写入失败可忽略 */ }
    }, 400);

    function debounce(fn, ms) {
        let t;
        return function () {
            clearTimeout(t);
            t = setTimeout(fn, ms);
        };
    }

    const load = () => {
        try {
            return JSON.parse(localStorage.getItem('partner-draft') || '{}') || {};
        } catch (e) {
            return {};
        }
    };

    /** 把当前表单内容打包为一个扁平对象 */
    function collect() {
        const o = {};
        $$('[data-k]').forEach(el => {
            if (el.type === 'checkbox') o[el.getAttribute('data-k')] = el.checked;
            else o[el.getAttribute('data-k')] = el.value;
        });
        o.tcpr = ($('#tcprGrid .tcpr-card.on') || {}).dataset?.key || '';
        // 双三角每个角是一个 textarea，用 data-tri 区分
        $$('[data-tri]').forEach(el => {
            o['tri_' + el.getAttribute('data-tri')] = el.value;
        });
        o.deliver = $$('[data-deliver]').map(el => el.getAttribute('data-deliver') + ':' + (el.checked ? 1 : 0)).join('|');
        return o;
    }

    /* ============================================================
       2. Toast 提示
       ============================================================ */
    let toastTimer;
    function toast(msg) {
        const el = $('#toast');
        el.textContent = msg;
        el.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
    }

    async function copyText(txt) {
        try {
            await navigator.clipboard.writeText(txt);
            return true;
        } catch (e) {
            // 非安全上下文降级：临时选中文本
            const ta = document.createElement('textarea');
            ta.value = txt;
            ta.style.cssText = 'position:fixed;opacity:0';
            document.body.appendChild(ta);
            ta.select();
            let ok = false;
            try { ok = document.execCommand('copy'); } catch (e2) { ok = false; }
            ta.remove();
            return ok;
        }
    }

    /* ============================================================
       3. 渲染：TCPR 角色卡
       ============================================================ */
    function renderTcpr() {
        $('#tcprGrid').innerHTML = TCPR.map(r => `
            <button type="button" class="tcpr-card rounded-4xl border p-4 text-left" data-key="${r.key}">
                <p class="text-[14px] font-semibold">${esc(r.label)}</p>
                <p class="mt-1.5 text-[12px] leading-relaxed text-raw/60">${esc(r.how)}</p>
                <p class="mt-2.5 text-[11px] leading-relaxed text-accent">${esc(r.scenes)}</p>
                <p class="mt-2 text-[10.5px] leading-relaxed text-raw/42">${esc(r.hint)}</p>
            </button>`).join('');

        $$('#tcprGrid .tcpr-card').forEach(b => {
            b.addEventListener('click', () => {
                $$('#tcprGrid .tcpr-card').forEach(x => x.classList.remove('on'));
                b.classList.add('on');
                save();
                renderPartner();
                updateProgress();
            });
        });

        // 风险场景标签
        $('#riskList').innerHTML = RISK_SCENES
            .map(s => `<span class="badge badge-w">${esc(s)}</span>`).join('');
    }

    /* ============================================================
       4. 渲染：步骤条
       ============================================================ */
    function renderRail() {
        $('#stageRail').innerHTML = P_STAGES.map((s, i) => `
            <li class="stage-item relative flex w-full flex-col items-center gap-2 text-center">
                ${i < P_STAGES.length - 1 ? '<span class="stage-rail"></span>' : ''}
                <button type="button" data-goto="${s.id}"
                    class="stage-dot grid h-8 w-8 shrink-0 place-items-center rounded-[.6rem] border border-line/15 text-xs font-semibold text-raw/50 transition-all duration-300">
                    ${s.no}
                </button>
                <span class="text-[11px] text-raw/55">${esc(s.short)}</span>
            </li>`).join('');

        $$('#stageRail [data-goto]').forEach(b => {
            b.addEventListener('click', () => {
                const d = document.getElementById('acc-' + b.dataset.goto);
                if (d) {
                    d.open = true;
                    d.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
        });
    }

    /* ============================================================
       5. 渲染：六阶段手风琴
       ============================================================ */

    /** 阶段表单字段：与 partner-data 的 questions 一一对应 */
    function fieldsOfStage(st) {
        if (st.kind === 'tri') return [];
        if (st.id === 'p1') return identityFields();
        return st.questions.map((q, i) => ({
            key: st.id + '_q' + i,
            label: q.q,
            hint: q.hint,
            single: true
        }));
    }

    /** 第一阶段身份卡字段（独立于 questions，字段更多） */
    function identityFields() {
        return [
            { key: 'name', label: 'Partner 正式名称', hint: '如：课程应用教练' },
            { key: 'user', label: '目标用户 / 使用对象', hint: '谁会用它' },
            { key: 'scene', label: '细分场景', hint: '在什么节点触发' },
            { key: 'core', label: '内核：主要解决什么', hint: '它主要解决的问题' },
            { key: 'boundary', label: '边界：暂不处理什么', hint: '主动砍掉的功能，保持聚焦' },
            { key: 'deliverable', label: '交付物', hint: '最终交付什么' },
            { key: 'std1', label: '合格标准 1', hint: '可逐项核对' },
            { key: 'std2', label: '合格标准 2', hint: '可逐项核对' },
            { key: 'std3', label: '合格标准 3', hint: '可逐项核对' },
            { key: 'oneLiner', label: '一句话定义', hint: '当【谁】遇到【具体问题】时，Partner 作为【角色】，使用【输入与方法】，帮助得到【可验收结果】。', rows: 2 }
        ];
    }

    /** 双三角六角填写（第二阶段） */
    function triCells() {
        return TRI_CORNERS.map(c => `
            <div class="tri-cell rounded-xl border p-3">
                <p class="text-[12px] font-semibold">${esc(c.label)}</p>
                <p class="mt-1 text-[10.5px] leading-relaxed text-raw/45">${esc(c.q)}</p>
                <textarea data-tri="${c.key}" rows="2" placeholder="${esc(c.hint)}"
                    class="inp mt-2 !min-h-0 resize-y text-[12px]"></textarea>
            </div>`).join('');
    }

    function renderStages() {
        $('#stageList').innerHTML = P_STAGES.map(st => {
            let body = '';

            // 要点
            if (st.points && st.points.length) {
                body += `
                    <div class="mb-4">
                        <p class="eyebrow text-raw/45">要点</p>
                        <ul class="mt-2 space-y-1.5">
                            ${st.points.map(p => `
                                <li class="flex gap-2 text-[12.5px] leading-relaxed">
                                    <span class="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-primary"></span>
                                    <span>${esc(p)}</span>
                                </li>`).join('')}
                        </ul>
                    </div>`;
            }

            // 双三角六角
            if (st.kind === 'tri') {
                body += `<div class="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">${triCells()}</div>`;
            } else {
                // 表单字段
                const fs = fieldsOfStage(st);
                body += `<div class="grid gap-3 sm:grid-cols-2">${fs.map((f, i) => `
                    <label class="block ${f.rows > 1 ? 'sm:col-span-2' : ''}">
                        <span class="field-label">
                            <span class="field-num">${i + 1}</span>${esc(f.label)}
                        </span>
                        ${f.rows > 1
                        ? `<textarea data-k="${f.key}" rows="${f.rows}" placeholder="${esc(f.hint)}" class="inp"></textarea>`
                        : `<input type="text" data-k="${f.key}" placeholder="${esc(f.hint)}" class="inp">`}
                    </label>`).join('')}</div>`;
            }

            // 问题清单（第三阶段起补充）
            if (st.kind !== 'tri' && st.id !== 'p1' && st.questions && st.questions.length) {
                body += `
                    <details class="acc mt-4 rounded-[.875rem] border">
                        <summary class="flex cursor-pointer items-center gap-2 p-3.5">
                            <span class="chev text-[11px] text-raw/45">▶</span>
                            <span class="eyebrow text-raw/55">要回答的问题（${st.questions.length}）</span>
                        </summary>
                        <div class="space-y-2 border-t border-line/08 px-4 py-4">
                            ${st.questions.map(q => `
                                <p class="text-[12.5px] font-medium leading-relaxed">${esc(q.q)}</p>
                                <p class="mt-1 text-[11.5px] leading-relaxed text-raw/42">${esc(q.hint)}</p>`).join('')}
                        </div>
                    </details>`;
            }

            // 示例
            if (st.example) {
                body += `
                    <div class="mt-4 rounded-lg border border-accent/25 bg-accent/8 p-3">
                        <p class="text-[10px] font-semibold uppercase tracking-widest text-accent">示例参考</p>
                        <p class="mt-1.5 text-[12.5px] leading-relaxed text-raw/72">${esc(st.example)}</p>
                    </div>`;
            }

            // 阶段勾选
            if (st.checklist && st.checklist.length) {
                body += `
                    <label class="mt-4 flex cursor-pointer items-start gap-2.5 rounded-lg bg-raw/04 p-3">
                        <input type="checkbox" data-k="${st.id}_done" class="mt-[3px] h-4 w-4 shrink-0 accent-[rgb(var(--c-accent))]">
                        <span class="text-[12.5px] leading-relaxed">${esc(st.checklist[0])}</span>
                    </label>`;
            }

            return `
                <details class="acc" id="acc-${st.id}" ${st.id === 'p1' ? 'open' : ''}>
                    <summary>
                        <span class="stage-dot grid h-8 w-8 shrink-0 place-items-center rounded-[.6rem] border border-line/15 text-xs font-semibold text-raw/50 transition-all duration-300">${st.no}</span>
                        <span class="min-w-0 flex-1">
                            <span class="block text-[14px] font-semibold leading-snug">${esc(st.title)}</span>
                            <span class="mt-0.5 block text-[11.5px] leading-relaxed text-raw/50">${esc(st.desc)}</span>
                        </span>
                        <span class="chev shrink-0 text-[11px] text-raw/45">▶</span>
                    </summary>
                    <div class="border-t border-line/08 px-4 py-4">
                        ${st.tips ? `<div class="mb-4 rounded-lg border-l-2 border-primary/50 bg-primary/6 py-2.5 pl-3 pr-3">
                            <p class="text-[12.5px] leading-relaxed text-raw/75">${esc(st.tips)}</p>
                        </div>` : ''}
                        ${body}
                    </div>
                </details>`;
        }).join('');

        // 展开时同步左侧步骤条高亮
        $$('#stageList details.acc').forEach(d => {
            d.addEventListener('toggle', () => {
                if (d.open) setActiveStage(d.id.replace('acc-', ''));
            });
        });
    }

    /* ============================================================
       6. 渲染：提示词库 / 交付自检
       ============================================================ */
    function renderPrompts() {
        $('#promptList').innerHTML = P_PROMPTS.map(p => `
            <article class="card p-4">
                <div class="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <p class="text-[14px] font-semibold">${esc(p.title)}</p>
                        <p class="mt-0.5 text-[11px] text-raw/45">${esc(p.when)}</p>
                    </div>
                    <button type="button" class="btn btn-ghost btn-sm" data-copy-prompt="${p.id}">复制</button>
                </div>
                <pre class="prompt-box mt-3">${esc(p.body)}</pre>
            </article>`).join('');

        $$('[data-copy-prompt]').forEach(b => {
            b.addEventListener('click', async () => {
                const p = P_PROMPTS.find(x => x.id === b.dataset.copyPrompt);
                toast(await copyText(p.body) ? '提示词已复制' : '复制失败，请手动选中');
            });
        });
    }

    function renderDeliver() {
        $('#deliverList').innerHTML = P_DELIVER_CHECK.map((t, i) => `
            <label class="flex cursor-pointer items-start gap-2.5">
                <input type="checkbox" data-deliver="d${i}" class="mt-[3px] h-4 w-4 shrink-0 accent-[rgb(var(--c-accent))]">
                <span class="text-[12.5px] leading-relaxed">${esc(t)}</span>
            </label>`).join('');

        $$('[data-deliver]').forEach(cb => {
            cb.addEventListener('change', () => {
                updateDeliver();
                save();
            });
        });
    }

    function updateDeliver() {
        const all = $$('[data-deliver]');
        const n = all.filter(c => c.checked).length;
        $('#deliverProgress').textContent = '已勾选 ' + n + ' / ' + all.length + ' 项';
    }

    /* ============================================================
       7. 实时生成 Partner 配置
       ============================================================ */
    function buildPartnerMd() {
        const L = [];
        const t = k => val(k);

        const tcprObj = TCPR.find(x => x.key === (collect().tcpr || ''));

        L.push('# 身份卡');
        L.push('');
        L.push('Partner 名称：' + or(t('name'), '未命名 Partner'));
        L.push('TCPR 角色定位：' + or(tcprObj ? tcprObj.label : t('tcpr'), '未选择'));
        L.push('目标用户：' + or(t('user'), '目标用户'));
        L.push('细分场景：' + or(t('scene'), '触发场景'));
        L.push('');
        L.push('内核：' + or(t('core'), '它主要解决的问题'));
        L.push('边界：' + or(t('boundary'), '主动不做什么'));
        L.push('');
        L.push('一句话定义：');
        L.push(or(t('oneLiner'), '当【谁】遇到【具体问题】时，Partner 作为【角色】，使用【输入与方法】，帮助得到【可验收结果】。'));
        L.push('');

        L.push('## 交付标准');
        L.push('');
        L.push('交付物：' + or(t('deliverable'), '最终交付物'));
        L.push('');
        L.push('1. ' + or(t('std1'), '合格标准 1'));
        L.push('2. ' + or(t('std2'), '合格标准 2'));
        L.push('3. ' + or(t('std3'), '合格标准 3'));
        L.push('');

        // 双三角
        L.push('## 双三角');
        L.push('');
        TRI_CORNERS.forEach(c => {
            const v = val('tri_' + c.key);
            if (v) {
                L.push('- ' + c.label + '：' + v);
            }
        });
        if (!TRI_CORNERS.some(c => val('tri_' + c.key))) {
            L.push('（第二阶段填写六个角后，此处自动汇总）');
        }
        L.push('');

        // 第五阶段：里程碑与验收
        const ms = val('p4_q3') || val('p5_q1');
        if (ms) {
            L.push('## 里程碑');
            L.push('');
            L.push(ms);
            L.push('');
        }

        const ac = [val('p5_q2'), val('p5_q3')].filter(Boolean);
        if (ac.length) {
            L.push('## 本次验收标准');
            L.push('');
            ac.forEach(a => L.push('- ' + a));
            L.push('');
        }

        // 第六阶段：保存与复用
        const pf = [val('p6_q1'), val('p6_q2')].filter(Boolean);
        if (pf.length) {
            L.push('## 保存与复用');
            L.push('');
            L.push('- 保存入口：' + pf[0]);
            if (pf[1]) L.push('- 复用方式：' + pf[1]);
            L.push('');
        }

        const keep = val('p6_q3');
        if (keep) {
            L.push('## 复盘结论');
            L.push('');
            L.push(keep);
            L.push('');
        }

        L.push('---');
        L.push('');
        L.push('> 只固化已确认有效的做法；待验证想法单独列出。');
        L.push('> 不要把本次的人名、数字和临时要求写成通用规则。');

        return L.join('\n');
    }

    function renderPartner() {
        $('#partnerPreview').textContent = buildPartnerMd();
        renderFillStats();
    }

    /** 右栏「填写进度」：显示各阶段已填字段数 */
    function renderFillStats() {
        const rows = P_STAGES.map(st => {
            let total = 0, filled = 0;
            if (st.kind === 'tri') {
                total = TRI_CORNERS.length;
                filled = TRI_CORNERS.filter(c => val('tri_' + c.key)).length;
            } else {
                const keys = fieldsOfStage(st).map(f => f.key);
                keys.push(st.id + '_done');
                total = keys.length;
                filled = keys.filter(k => {
                    const el = document.querySelector('[data-k="' + k + '"]');
                    if (!el) return false;
                    return el.type === 'checkbox' ? el.checked : !!el.value.trim();
                }).length;
            }
            const pct = total ? Math.round(filled / total * 100) : 0;
            return { st, filled, total, pct };
        });

        $('#fillStats').innerHTML = rows.map(r => `
            <li>
                <div class="flex items-center justify-between gap-2">
                    <span class="text-[12px] text-raw/70">${r.st.no} · ${esc(r.st.short)}</span>
                    <span class="text-[11px] ${r.pct === 100 ? 'text-accent' : 'text-raw/45'}">${r.filled}/${r.total}</span>
                </div>
                <div class="prog-track mt-1.5">
                    <div class="prog-fill" style="width:${r.pct}%"></div>
                </div>
            </li>`).join('');
    }

    /* ============================================================
       8. 阶段进度与步骤条状态
       ============================================================ */
    function updateProgress() {
        const rows = P_STAGES.map(st => {
            let total = 0, filled = 0;
            if (st.kind === 'tri') {
                total = TRI_CORNERS.length;
                filled = TRI_CORNERS.filter(c => val('tri_' + c.key)).length;
            } else {
                const keys = fieldsOfStage(st).map(f => f.key);
                keys.push(st.id + '_done');
                total = keys.length;
                filled = keys.filter(k => {
                    const el = document.querySelector('[data-k="' + k + '"]');
                    if (!el) return false;
                    return el.type === 'checkbox' ? el.checked : !!el.value.trim();
                }).length;
            }
            return total ? filled / total : 0;
        });

        const pct = Math.round(rows.reduce((a, b) => a + b, 0) / rows.length * 100);
        const doneCount = rows.filter(r => r >= 1).length;

        $('#progressBar').style.width = pct + '%';
        $('#progressLabel').textContent = '完成度 ' + pct + '%';
        $('#stageCounter').textContent = doneCount + ' / ' + P_STAGES.length + ' 阶段';

        // 同步两侧步骤条圆点状态
        P_STAGES.forEach((st, i) => {
            const full = rows[i] >= 1;
            const partial = rows[i] > 0 && !full;
            $$('#stageRail .stage-item').forEach((li, j) => {
                const dot = $('button', li);
                if (!dot) return;
                dot.classList.toggle('is-done', j === i ? full : dot.classList.contains('is-done'));
                if (j === i) {
                    dot.classList.toggle('is-active', partial);
                    dot.classList.toggle('is-done', full);
                }
            });
            const accDot = $('#acc-' + st.id + ' .stage-dot');
            if (accDot) {
                accDot.classList.toggle('is-done', full);
                $('#acc-' + st.id).classList.toggle('is-done', full);
            }
        });
    }

    let activeId = 'p1';
    function setActiveStage(id) {
        activeId = id;
        $$('#stageRail .stage-item').forEach((li, j) => {
            const dot = $('button', li);
            if (dot && !dot.classList.contains('is-done')) {
                dot.classList.toggle('is-active', P_STAGES[j].id === id);
            }
        });
    }

    /* ============================================================
       9. 回填 / 重置 / 示例
       ============================================================ */
    function applyData(d) {
        if (!d || typeof d !== 'object') return;
        $$('[data-k]').forEach(el => {
            const k = el.getAttribute('data-k');
            if (!(k in d)) return;
            if (el.type === 'checkbox') el.checked = !!d[k];
            else el.value = d[k] == null ? '' : d[k];
        });
        $$('[data-tri]').forEach(el => {
            const k = 'tri_' + el.getAttribute('data-tri');
            if (k in d) el.value = d[k] || '';
        });
        // TCPR 选中态
        if (d.tcpr) {
            $$('#tcprGrid .tcpr-card').forEach(b => b.classList.toggle('on', b.dataset.key === d.tcpr));
        }
        // 交付自检
        if (d.deliver) {
            const m = {};
            d.deliver.split('|').forEach(s => {
                const [k, v] = s.split(':');
                m[k] = v === '1';
            });
            $$('[data-deliver]').forEach(cb => { cb.checked = !!m[cb.getAttribute('data-deliver')]; });
        }
    }

    function resetAll() {
        if (!confirm('清空全部填写内容？此操作不可撤销。')) return;
        applyData({});
        try { localStorage.removeItem('partner-draft'); } catch (e) { }
        renderPartner();
        updateProgress();
        updateDeliver();
        toast('已清空');
    }

    /** 把示例（课程应用教练）写入表单 */
    function fillDemo() {
        const d = {
            tcpr: P_DEMO.tcpr, name: P_DEMO.name, user: P_DEMO.user, scene: P_DEMO.scene,
            core: P_DEMO.core, boundary: P_DEMO.boundary, deliverable: P_DEMO.deliverable,
            std1: P_DEMO.std1, std2: P_DEMO.std2, std3: P_DEMO.std3, oneLiner: P_DEMO.oneLiner,
            p5_q1: P_DEMO.milestone, p5_q2: P_DEMO.accept1, p5_q3: P_DEMO.accept2,
            p6_q1: P_DEMO.platform + '：' + P_DEMO.entry + '（' + P_DEMO.mount + '）',
            p6_q2: P_DEMO.reuseTask + '；材料：' + P_DEMO.reuseMaterial,
            p6_q3: '保留：' + P_DEMO.kept + '；暂不优先：' + P_DEMO.dropped
        };
        TRI_CORNERS.forEach(c => { d['tri_' + c.key] = P_DEMO.tri[c.key]; });
        applyData(d);
        save();
        renderPartner();
        updateProgress();
        toast('已填入示例：课程应用教练');
    }

    function exportJson() {
        const blob = new Blob([JSON.stringify(collect(), null, 2)], { type: 'application/json;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'partner-draft.json';
        a.click();
        URL.revokeObjectURL(url);
        toast('已导出 JSON');
    }

    function downloadPartner() {
        const blob = new Blob([buildPartnerMd()], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'PARTNER-' + (val('name') || 'draft').replace(/\s+/g, '-') + '.md';
        a.click();
        URL.revokeObjectURL(url);
        toast('已下载 Partner 配置');
    }

    /* ============================================================
       10. 主题切换
       ============================================================ */
    function initTheme() {
        const btn = $('#themeBtn');
        const sync = () => {
            const dark = document.documentElement.getAttribute('data-theme') !== 'light';
            $('#themeIcon').textContent = dark ? '◐' : '◑';
        };
        sync();
        btn.addEventListener('click', () => {
            const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', next);
            try { localStorage.setItem('partner-theme', next); } catch (e) { }
            sync();
        });
    }

    /* ============================================================
       11. 初始化
       ============================================================ */
    function init() {
        initTheme();
        renderTcpr();
        renderRail();
        renderStages();
        renderPrompts();
        renderDeliver();

        applyData(load());
        renderPartner();
        updateProgress();
        updateDeliver();

        // 输入 → 实时重算 + 防抖保存
        document.addEventListener('input', e => {
            if (e.target.matches('[data-k], [data-tri]')) {
                renderPartner();
                updateProgress();
                save();
            }
        });
        document.addEventListener('change', e => {
            if (e.target.matches('[data-k]')) {
                renderPartner();
                updateProgress();
                save();
            }
        });

        $('#resetBtn').addEventListener('click', resetAll);
        $('#exportBtn').addEventListener('click', exportJson);
        $('#demoBtn').addEventListener('click', fillDemo);
        $('#downloadPartnerBtn').addEventListener('click', downloadPartner);
        $('#copyPartnerBtn').addEventListener('click', async () => {
            toast(await copyText(buildPartnerMd()) ? 'Partner 配置已复制' : '复制失败，请手动选中');
        });

        // 移动端菜单
        const menu = $('#mobileMenu');
        const menuBtn = $('#menuBtn');
        menuBtn.addEventListener('click', () => {
            const open = menu.classList.toggle('open');
            menuBtn.setAttribute('aria-expanded', String(open));
        });
        $$('.mob-link').forEach(a => a.addEventListener('click', () => {
            menu.classList.remove('open');
            menuBtn.setAttribute('aria-expanded', 'false');
        }));

        // 桌面端导航高亮
        if ('IntersectionObserver' in window) {
            const ids = ['tcpr', 'stages', 'prompts', 'deliver'];
            const links = $$('header nav a[href^="#"]');
            const io = new IntersectionObserver(entries => {
                entries.forEach(en => {
                    if (!en.isIntersecting) return;
                    links.forEach(l => {
                        const on = l.getAttribute('href') === '#' + en.target.id;
                        l.classList.toggle('text-ink', on);
                        l.classList.toggle('bg-raw/06', on);
                    });
                });
            }, { rootMargin: '-20% 0px -70% 0px' });
            ids.forEach(id => { const el = document.getElementById(id); if (el) io.observe(el); });
        }

        // 快捷键：Ctrl/Cmd + S 导出 JSON
        document.addEventListener('keydown', e => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
                e.preventDefault();
                exportJson();
                toast('已导出 JSON');
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
