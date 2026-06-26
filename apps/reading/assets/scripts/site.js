/**
 * 站点通用脚本 - Site Common Scripts
 * 统一管理：导航菜单、移动端抽屉、章节高亮、回到顶部、主题切换
 *
 * 使用方法:
 *   <script src="assets/scripts/site.js" defer></script>
 *   HTML 中需包含以下结构:
 *     <div class="top-nav"> ... <button class="top-nav-toggle" id="navToggle">...</button> </div>
 *     <div class="mobile-menu" id="mobileMenu"> ... </div>
 *     <button class="back-to-top" id="backToTop">↑</button>
 *     <div class="reading-progress" id="readingProgress"></div>
 */
(function () {
  'use strict';

  // ============ 移动端菜单 ============
  function initMobileMenu() {
    var toggle = document.getElementById('navToggle');
    var menu = document.getElementById('mobileMenu');
    if (!toggle || !menu) return;

    function openMenu() {
      toggle.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      menu.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('open');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', function () {
      if (menu.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    var backdrop = menu.querySelector('.mobile-menu-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', closeMenu);
    }

    var closeBtn = menu.querySelector('.mobile-menu-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeMenu);
    }

    // 点击链接后自动关闭菜单
    var links = menu.querySelectorAll('.mobile-menu-link');
    links.forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // ESC 键关闭
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) {
        closeMenu();
      }
    });
  }

  // ============ 回到顶部 ============
  function initBackToTop() {
    var btn = document.getElementById('backToTop');
    if (!btn) return;

    var threshold = 300;
    function toggleVisibility() {
      if (window.scrollY > threshold) {
        btn.classList.add('show');
      } else {
        btn.classList.remove('show');
      }
    }

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    toggleVisibility();
  }

  // ============ 阅读进度条 ============
  function initReadingProgress() {
    var bar = document.getElementById('readingProgress');
    if (!bar) return;

    function updateProgress() {
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var scrolled = (window.scrollY / docHeight) * 100;
      bar.style.width = Math.min(100, Math.max(0, scrolled)) + '%';
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });
    updateProgress();
  }

  // ============ 章节导航高亮 ============
  function initSectionNavHighlight() {
    var navLinks = document.querySelectorAll('.section-nav-link');
    if (!navLinks.length) return;

    var sections = [];
    navLinks.forEach(function (link) {
      var id = link.getAttribute('href');
      if (id && id.startsWith('#')) {
        var target = document.querySelector(id);
        if (target) sections.push({ id: id, el: target, link: link });
      }
    });

    if (!sections.length) return;

    function update() {
      var scrollPos = window.scrollY + 120;
      var activeId = null;
      for (var i = 0; i < sections.length; i++) {
        if (sections[i].el.offsetTop <= scrollPos) {
          activeId = sections[i].id;
        }
      }
      sections.forEach(function (item) {
        if (item.id === activeId) {
          item.link.classList.add('active');
        } else {
          item.link.classList.remove('active');
        }
      });
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  // ============ 初始化 ============
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initMobileMenu();
      initBackToTop();
      initReadingProgress();
      initSectionNavHighlight();
    });
  } else {
    initMobileMenu();
    initBackToTop();
    initReadingProgress();
    initSectionNavHighlight();
  }
})();