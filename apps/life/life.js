/* =============================================================
 * Life 工具共享脚本 - life.js
 * 功能:暗色主题/进度条/回到顶部/平滑滚动/导航高亮/打印
 * ============================================================= */
(function () {
  'use strict';

  // ---------- 暗色主题切换 ----------
  var THEME_KEY = 'life-theme';
  var stored = localStorage.getItem(THEME_KEY);
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (stored === 'dark' || (!stored && prefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  function bindThemeToggle() {
    var btn = document.getElementById('themeToggle');
    if (!btn) return;
    btn.onclick = function () {
      var cur = document.documentElement.getAttribute('data-theme');
      if (cur === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem(THEME_KEY, 'light');
        btn.innerHTML = '🌗 主题';
        btn.setAttribute('aria-label', '切换到暗色主题');
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem(THEME_KEY, 'dark');
        btn.innerHTML = '☀️ 主题';
        btn.setAttribute('aria-label', '切换到浅色主题');
      }
    };
    if (document.documentElement.getAttribute('data-theme') === 'dark') {
      btn.innerHTML = '☀️ 主题';
    }
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

  // ---------- 当前页面导航高亮 ----------
  function highlightCurrentNav() {
    var path = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(function (a) {
      if (a.getAttribute('href') === path) a.classList.add('active');
    });
  }

  // ---------- 简单 Toast 提示 ----------
  function showToast(msg, type) {
    var t = document.createElement('div');
    t.textContent = msg;
    t.style.cssText = 'position:fixed;top:80px;left:50%;transform:translateX(-50%);background:' +
      (type === 'error' ? '#d63031' : '#00b894') +
      ';color:#fff;padding:10px 20px;border-radius:8px;z-index:9999;font-size:14px;box-shadow:0 4px 12px rgba(0,0,0,.15)';
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 1500);
  }
  // 暴露到 window 以便业务脚本调用
  window.lifeToast = showToast;

  // ---------- 初始化 ----------
  document.addEventListener('DOMContentLoaded', function () {
    bindThemeToggle();
    bindScroll();
    bindAnchors();
    highlightCurrentNav();
  });
})();