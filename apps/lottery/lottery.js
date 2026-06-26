/* =============================================================
 * Lottery 工具共享脚本 - lottery.js
 * 功能:暗色主题/进度条/回到顶部/平滑滚动/多彩主题/导航高亮
 * ============================================================= */
(function () {
  'use strict';

  // ---------- 暗色主题切换(localStorage 持久化) ----------
  var THEME_KEY = 'lottery-theme';
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
    // 初始化按钮文字
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

  // ---------- 多彩主题切换(彩票工具特性) ----------
  // 在 window 上暴露 initColorTheme,各页面调用并传入 localStorage key
  window.initColorTheme = function (storageKey) {
    var colorOptions = document.querySelectorAll('.color-option');
    if (!colorOptions.length) return;

    var saved = localStorage.getItem(storageKey) || 'blue';

    function applyTheme(theme) {
      // 保留根 html 的 data-theme(暗色),为 body 设置 data-lottery-theme
      document.body.setAttribute('data-lottery-theme', theme);
      // 同步 header 颜色(若存在)
      var header = document.querySelector('.tool-header');
      if (header) {
        // 通过 data-lottery-theme 自动改变 header 颜色,无需手动改 class
      }
      // 同步主背景色渐变
      var hero = document.querySelector('.hero');
      // 更新 active 状态
      colorOptions.forEach(function (opt) {
        opt.classList.toggle('active', opt.dataset.color === theme);
      });
    }

    applyTheme(saved);

    colorOptions.forEach(function (option) {
      option.onclick = function () {
        var selectedColor = this.dataset.color;
        applyTheme(selectedColor);
        localStorage.setItem(storageKey, selectedColor);
      };
    });
  };

  // ---------- 初始化 ----------
  document.addEventListener('DOMContentLoaded', function () {
    bindThemeToggle();
    bindScroll();
    bindAnchors();
    highlightCurrentNav();
  });
})();