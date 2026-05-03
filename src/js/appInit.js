"use strict"

export function initLoadAnimation() {
  initPageMaster(600, '#00FFC2');
}

/**
 * УНІВЕРСАЛЬНИЙ СКРИПТ ЗАВАНТАЖЕННЯ ТА АНІМАЦІЙ
 */

function initPageMaster(delay = 600, barColor = '#00FFC2') {
  const html = document.documentElement;

  // 1. Створюємо прогрес-бар
  const progressBar = document.createElement('div');
  progressBar.id = 'loader-progress-bar';
  progressBar.style.backgroundColor = barColor;
  html.appendChild(progressBar);

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 20;
    if (progress > 90) progress = 90;
    progressBar.style.width = progress + '%';
  }, 150);

  // 2. Функція активації сторінки
  const activatePage = () => {
    if (html.getAttribute('init-page-loader') === 'ready') return;

    clearInterval(interval);
    progressBar.style.width = '100%';

    setTimeout(() => {
      html.setAttribute('init-page-loader', 'ready');

      // Запускаємо обсервер для скрол-анімацій
      initAnimationObserver();

      setTimeout(() => {
        progressBar.style.opacity = '0';
        setTimeout(() => progressBar.remove(), 400);
      }, 300);
    }, delay);
  };

  // Слухачі завантаження
  window.addEventListener('load', activatePage);
  setTimeout(activatePage, 4000); // Запобіжник (fail-safe)
}

function initAnimationObserver() {
  const elements = document.querySelectorAll('[class*="--anim"]');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      const el = entry.target;

      // Отримуємо індивідуальний поріг з data-threshold або ставимо 0.15 за замовчуванням
      const customThreshold = parseFloat(el.dataset.threshold) || 0.15;

      // Перевіряємо, чи перетнув елемент саме СВІЙ поріг
      if (entry.intersectionRatio >= customThreshold) {
        const isOnce = el.getAttribute('data-once') !== "false";
        const children = el.querySelectorAll('.anim-child');
        const delay = parseInt(el.dataset.delay) || 0;
        const step = parseInt(el.dataset.step) || 150;

        if (children.length > 0) {
          children.forEach((child, index) => {
            setTimeout(() => child.classList.add('animate'), delay + (index * step));
          });
        } else {
          setTimeout(() => el.classList.add('animate'), delay);
        }

        if (isOnce) observer.unobserve(el);
      } else if (entry.intersectionRatio <= 0) {
        // Скидання, якщо data-once="false" і елемент повністю пішов з екрана
        if (el.getAttribute('data-once') === "false") {
          el.classList.remove('animate');
          el.querySelectorAll('.anim-child').forEach(c => c.classList.remove('animate'));
        }
      }
    });
  }, {
    // Масив порогів, щоб обсервер спрацьовував частіше і міг звірити дані
    threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
  });

  elements.forEach(el => observer.observe(el));
}












