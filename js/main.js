/* ===========================
   星嘉艺印刷 · 交互脚本
   =========================== */

// ---- 1. 导航栏：滚动 + 鼠标悬停顶部触发 ----
(function () {
  const navbar = document.getElementById('navbar');
  const scrollHint = document.getElementById('scrollHint');
  const SCROLL_THRESHOLD = 80;
  const HOVER_ZONE_HEIGHT = 60;
  let isHoverZone = false;
  let lastScrollY = 0;

  function updateNavbar() {
    const scrollY = window.scrollY;

    // 滚动超过阈值时显示
    if (scrollY > SCROLL_THRESHOLD) {
      navbar.classList.add('visible', 'scrolled');
    } else if (isHoverZone) {
      navbar.classList.add('visible');
      navbar.classList.remove('scrolled');
    } else {
      navbar.classList.remove('visible', 'scrolled');
    }

    // 隐藏滚动提示
    if (scrollY > 100) {
      scrollHint && scrollHint.classList.add('hide');
    } else {
      scrollHint && scrollHint.classList.remove('hide');
    }

    lastScrollY = scrollY;
  }

  // 鼠标移到顶部 hover zone
  document.addEventListener('mousemove', function (e) {
    if (e.clientY < HOVER_ZONE_HEIGHT) {
      if (!isHoverZone) {
        isHoverZone = true;
        updateNavbar();
      }
    } else {
      if (isHoverZone) {
        isHoverZone = false;
        updateNavbar();
      }
    }
  });

  window.addEventListener('scroll', updateNavbar, { passive: true });

  // 初始化
  updateNavbar();
})();

// ---- 2. 移动端菜单切换 ----
(function () {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('mobileMenu');

  if (!toggle || !menu) return;

  toggle.addEventListener('click', function () {
    const isOpen = menu.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  window.closeMobileMenu = function () {
    menu.classList.remove('open');
    toggle.classList.remove('open');
    document.body.style.overflow = '';
  };
})();

// ---- 3. 浮动书本动画 ----
(function () {
  const container = document.getElementById('floatingBooks');
  if (!container) return;

  const bookEmojis = ['📚', '📖', '📕', '📗', '📘', '📙', '🎨', '🌈', '⭐', '✏️'];

  function createBook() {
    const book = document.createElement('div');
    book.className = 'floating-book';
    book.textContent = bookEmojis[Math.floor(Math.random() * bookEmojis.length)];
    book.style.left = Math.random() * 100 + 'vw';
    book.style.fontSize = (24 + Math.random() * 32) + 'px';
    const dur = 12 + Math.random() * 16;
    book.style.animationDuration = dur + 's';
    book.style.animationDelay = -Math.random() * dur + 's';
    container.appendChild(book);

    // 清理
    book.addEventListener('animationend', function () {
      book.remove();
      createBook();
    });
  }

  // 初始创建12个
  for (let i = 0; i < 12; i++) {
    createBook();
  }
})();

// ---- 4. Reveal 滚动动画 ----
(function () {
  const revealItems = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  const highlightItems = document.querySelectorAll('.highlight-text');

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealItems.forEach(function (item) {
    observer.observe(item);
  });

  const hlObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        hlObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  highlightItems.forEach(function (item) {
    hlObserver.observe(item);
  });
})();

// ---- 5. 数字计数动画 ----
(function () {
  function animateNumber(el, target, suffix) {
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(eased * target);
      el.textContent = current.toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  const statsObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const numEl = entry.target.querySelector('.stat-num');
        if (!numEl) return;
        const text = numEl.textContent;
        const sup = numEl.querySelector('sup');
        const supText = sup ? sup.textContent : '';
        const num = parseInt(text.replace(/\D/g, ''));
        if (!isNaN(num) && num > 0) {
          numEl.textContent = '0';
          if (supText) {
            numEl.innerHTML = '0<sup>' + supText + '</sup>';
          }
          setTimeout(function () {
            animateNumber(numEl, num);
            if (supText) {
              numEl.addEventListener('DOMSubtreeModified', function() {});
            }
          }, 200);
        }
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.8 });

  document.querySelectorAll('.stat').forEach(function (stat) {
    statsObserver.observe(stat);
  });
})();

// ---- 6. 平滑导航滚动 + 活跃状态 ----
(function () {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    threshold: 0.4
  });

  sections.forEach(function (s) { sectionObserver.observe(s); });
})();

// ---- 7. 表单提交处理 ----
(function () {
  const form = document.getElementById('contactForm');
  const toast = document.getElementById('successToast');

  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const originalHTML = btn.innerHTML;

    // 提交动画
    btn.innerHTML = '<span>提交中...</span>';
    btn.style.opacity = '0.7';
    btn.style.pointerEvents = 'none';

    setTimeout(function () {
      btn.innerHTML = originalHTML;
      btn.style.opacity = '';
      btn.style.pointerEvents = '';
      form.reset();

      // 显示成功Toast
      toast.classList.add('show');
      setTimeout(function () {
        toast.classList.remove('show');
      }, 3500);
    }, 1200);
  });
})();

// ---- 8. 磁力按钮效果 ----
(function () {
  const magneticBtns = document.querySelectorAll('.btn-primary, .nav-cta');

  magneticBtns.forEach(function (btn) {
    btn.addEventListener('mousemove', function (e) {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * 0.25;
      const dy = (e.clientY - cy) * 0.25;
      btn.style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
    });

    btn.addEventListener('mouseleave', function () {
      btn.style.transform = '';
    });
  });
})();

// ---- 9. 卡片 3D 倾斜效果（桌面端）----
(function () {
  if (window.matchMedia('(pointer: coarse)').matches) return; // 手机跳过

  const cards = document.querySelectorAll('.service-card:not(.service-card-cta), .testimonial-card');

  cards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const rx = ((e.clientY - cy) / (rect.height / 2)) * 6;
      const ry = -((e.clientX - cx) / (rect.width / 2)) * 6;
      card.style.transform = 'translateY(-8px) perspective(600px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';
    });

    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
    });
  });
})();

// ---- 10. 进度指示条 ----
(function () {
  const bar = document.createElement('div');
  bar.style.cssText = [
    'position: fixed',
    'top: 0',
    'left: 0',
    'height: 3px',
    'background: linear-gradient(90deg, #FF6B35, #FF6B9D, #4ECDC4)',
    'z-index: 9999',
    'width: 0%',
    'transition: width 0.1s ease',
    'pointer-events: none'
  ].join(';');
  document.body.appendChild(bar);

  window.addEventListener('scroll', function () {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
})();

console.log('%c 星嘉艺印刷官网 ✨', 'color: #FF6B35; font-size: 18px; font-weight: bold;');
