"use strict"

document.addEventListener('click', documentActions)

export function initEffects() {
  initScrollHeader()
}
// ===========================================================================================
// window.addEventListener('scroll', scrollHeader)

// ===========================================================================================
// -----------------------------
// scroll-header
// -----------------------------
// function initScrollHeader() {
//    const header = document.querySelector('.header');
//    if (!header) return;

//    window.addEventListener('scroll', () => {
//       header.classList.toggle('scrolled', window.scrollY > 50);
//    });
// }

function initScrollHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  // 1. Ініціалізація: встановлюємо стан відразу при завантаженні
  let currentScroll = window.scrollY;
  let lastScroll = currentScroll;
  let downStart = currentScroll;

  // Якщо сторінка вже проскролена при завантаженні (після оновлення)
  if (currentScroll > 50) {
    header.classList.add('scrolled');
    // Можна додати 'visible', щоб хедер був відразу при оновленні,
    // або залишити прихованим до першого руху вгору
    header.classList.add('visible');
  }

  const OFFSET = 50;
  const DELTA = 8;
  const HIDE_AFTER = 40;

  const onScroll = () => {
    const current = window.scrollY;

    // 2. ЗАХИСТ ВІД FOOTER: перевіряємо, чи ми в самому низу
    // Якщо до низу сторінки залишилось менше 20px, ігноруємо логіку появи
    const scrollHeight = document.documentElement.scrollHeight;
    const screenHeight = window.innerHeight;
    const isBottom = current + screenHeight >= scrollHeight - 20;

    // Захист: меню відкрите або iOS "відскок" (negative scroll)
    if (document.documentElement.classList.contains('menu-open') ||
      header.classList.contains('menu-open') ||
      current < 0) {
      return;
    }

    const diff = current - lastScroll;
    if (Math.abs(diff) < DELTA) return;

    // Верх сторінки (повне скидання)
    if (current <= OFFSET) {
      header.classList.remove('scrolled', 'visible');
      header.style.transform = '';
      downStart = current;
      lastScroll = current;
      return;
    }

    // Скрол вниз
    if (diff > 0) {
      if (current - downStart > HIDE_AFTER) {
        header.classList.add('scrolled');
        header.classList.remove('visible');
      }
    }
    // Скрол вгору (тільки якщо ми НЕ в самому низу)
    else {
      if (!isBottom) {
        header.classList.add('scrolled', 'visible');
      }
      downStart = current;
    }

    lastScroll = current;
  };

  // throttle для оптимізації (опціонально, але scroll і так працює часто)
  window.addEventListener('scroll', onScroll, { passive: true });
}


// ===========================================================================================
// -----------------------------
// MENU-BURGER
// -----------------------------
// function documentActions(e) {
//   const targetElement = e.target
//   if (targetElement.closest('.icon-menu')) {
//     document.body.classList.toggle('menu-open')
//     document.body.classList.toggle('scroll-lock')
//     document.documentElement.classList.toggle('menu-open')
//   }
// }
// const burger = document.querySelector('.icon-menu');
// const body = document.body;

// burger.addEventListener('click', () => {
//   body.classList.toggle('active');
// });

function documentActions(e) {
  const targetElement = e.target
  if (targetElement.closest('.menu-btn')) {
    document.body.classList.toggle('menu-open')
    document.body.classList.toggle('scroll-lock')
    document.documentElement.classList.toggle('menu-open')
  }
}
const burger = document.querySelector('.menu-btn');
const body = document.body;

burger.addEventListener('click', () => {
  body.classList.toggle('active');
});


// const btn = document.querySelector('.menu-btn');
// const menu = document.querySelector('.menu');

// btn.addEventListener('click', () => {
//   btn.classList.toggle('active');
//   menu.classList.toggle('active');

//   // блок скролу
//   document.body.classList.toggle('no-scroll');
// });
// ===========================================================================================
// -----------------------------
// flip-cart
// -----------------------------
// function toggleCardContent() {
//    const cards = document.querySelectorAll('.cart-work__inner');

//    cards.forEach(card => {
//       card.addEventListener('click', () => {
//          // При кліку додаємо або прибираємо клас активного стану
//          if (window.innerWidth <= 768) {
//             card.classList.toggle('animCart');
//          }

//       });
//    });
// }

// ===========================================================================================
// -----------------------------
// icon-show
// -----------------------------
// function showList() {
//    const iconShows = document.querySelectorAll(`.row-menu__icon`)

//    iconShows.forEach(iconShow => {
//       iconShow.addEventListener('click', () => {
//          if (iconShow) {
//             iconShow.classList.toggle('icon-active')
//          }
//       })
//    })
// }

// function showList() {
//    const items = document.querySelectorAll('.row-menu');

//    items.forEach(item => {
//       const icon = item.querySelector('.row-menu__icon');
//       const wrap = item.querySelector('.row-menu__wrap');

//       icon.addEventListener('click', () => {
//          icon.classList.toggle('icon-active');
//          wrap.classList.toggle('open');
//       });
//    });
// }



// window.addEventListener('scroll', () => {
//   const scrollValue = window.scrollY;
//   const parallaxBg = document.getElementById('parallax-bg');

//   // 1. Рухаємо фото повільніше за скрол (коефіцієнт 0.5)
//   // 2. Додаємо легке збільшення (scale), щоб краї не "втікали"
//   const translateY = scrollValue * 0.5;
//   const scale = 1 + (scrollValue * 0.0005);

//   parallaxBg.style.transform = `translateY(${translateY}px) scale(${scale})`;
// });


window.addEventListener('scroll', () => {
  const scrollValue = window.scrollY;
  const parallaxBg = document.getElementById('parallax-bg');

  // Оптимізація: виконуємо код тільки тоді, коли Hero видно на екрані
  if (scrollValue < window.innerHeight) {
    // 0.3 - інтенсивність руху (чим менше число, тим повільніше)
    const move = scrollValue * 0.3;

    // Додаємо легке збільшення при скролі
    const scale = 1 + (scrollValue * 0.0002);

    parallaxBg.style.transform = `translateY(${move}px) scale(${scale})`;
  }
});

// const container = document.querySelector('.stars');
// const COUNT = 16; // не більше 12–20

// for (let i = 0; i < COUNT; i++) {
//   const s = document.createElement('div');
//   s.className = 'star';

//   // позиція
//   s.style.left = Math.random() * 100 + '%';
//   s.style.top = (-20 + Math.random() * 40) + '%';

//   // кут (різні напрямки)
//   const angle = (30 + Math.random() * 90) * (Math.random() > 0.5 ? 1 : -1);
//   s.style.setProperty('--angle', `${angle}deg`);

//   // горизонтальний зсув під час падіння
//   const dx = (Math.random() * 200 - 160) + 'px';
//   s.style.setProperty('--dx', dx);

//   // довжина хвоста
//   s.style.height = (60 + Math.random() * 20) + 'px';

//   // швидкість і затримка
//   s.style.animationDuration = (3.5 + Math.random() * 6) + 's';
//   s.style.animationDelay = (Math.random() * 6) + 's';

//   // трохи різна яскравість
//   s.style.opacity = (0.2 + Math.random() * 0.4).toFixed(2);

//   container.appendChild(s);
// }