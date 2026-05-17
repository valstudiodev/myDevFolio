"use strict"

document.addEventListener('click', documentActions)

export function initEffects() {
  // initScrollHeader();
  initTiltCards();
  scrollHeaderHide();
  // initUniversalParallax();
  // createStars({
  //   selector: '.hero__stars',
  //   count: 14,
  // });
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

function scrollHeaderHide() {
  const header = document.querySelector('.header');

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll <= 50) {
      header.classList.remove('hide');
      return;
    }

    if (currentScroll > lastScroll) {
      header.classList.add('hide');
    } else {
      header.classList.remove('hide');
    }

    lastScroll = currentScroll;
  });
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

// ======== avatar ========
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

// ========= bg ========

const initUniversalParallax = (selector = '.js-parallax') => {
  const elements = document.querySelectorAll(selector);

  if (!elements.length) return;

  elements.forEach(el => {
    const speed = parseFloat(el.dataset.speed) || 0.5;
    const rotation = parseFloat(el.dataset.rotation) || 0;
    const distance = parseFloat(el.dataset.distance) || 150;

    gsap.to(el, {
      y: -distance * speed,
      rotation,
      ease: 'none',

      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        fastScrollEnd: true,
      }
    });
  });
};



// const tl = gsap.timeline();

// // Використовуємо невеликий трюк для розбиття тексту (або бібліотеку SplitText)
// // Але для початку можна просто анімувати заголовок цілком з ефектом "друкарської машинки"
// tl.from(".hero__title", {
//   duration: 1.5,
//   opacity: 0,
//   y: 30,
//   ease: "power4.out",
//   stagger: 0.1 // якщо розбити на літери/слова
// });


// /**
//  * Універсальний скрипт паралаксу
//  * @param {string} selector - Селектор елементів (наприклад, '[data-parallax]')
//  */
// export const initParallax = (selector = '[data-parallax]') => {
//   const elements = document.querySelectorAll(selector);

//   if (!elements.length) return;

//   const updatePosition = () => {
//     elements.forEach(el => {
//       // Отримуємо коефіцієнт швидкості з атрибута або ставимо 0.5 за дефолтом
//       const speed = parseFloat(el.dataset.parallax) || 0.5;

//       // Отримуємо позицію елемента відносно в'юпорту
//       const rect = el.parentElement.getBoundingClientRect();
//       const scrolled = window.innerHeight - rect.top;

//       // Рухаємо елемент тільки якщо його батьківську секцію видно
//       if (rect.top < window.innerHeight && rect.bottom > 0) {
//         const shift = scrolled * speed;
//         el.style.transform = `translate3d(0, ${shift}px, 0)`;
//       }
//     });
//   };

//   // Оптимізація через requestAnimationFrame
//   const onScroll = () => {
//     window.requestAnimationFrame(updatePosition);
//   };

//   window.addEventListener('scroll', onScroll);
//   // Викликаємо один раз для ініціалізації позиції
//   updatePosition();
// };


// window.addEventListener('scroll', () => {
//   const scroll = window.scrollY;
//   const bg = document.querySelector('.about-hero');
//   bg.style.transform = `translateY(${scroll * 0.3}px)`;
// });


// ================================== stars =================================
// function createStars({
//   selector = '.stars',
//   count = 12,
//   color = '0, 255, 194',
// } = {}) {

//   const container = document.querySelector(selector);

//   if (!container) return;

//   for (let i = 0; i < count; i++) {
//     const star = document.createElement('div');

//     star.classList.add('star');

//     // random position
//     star.style.left = Math.random() * 100 + '%';
//     star.style.top = (-20 + Math.random() * 40) + '%';

//     // random angle
//     const angle =
//       (20 + Math.random() * 70) *
//       (Math.random() > 0.5 ? 1 : -1);

//     star.style.setProperty('--angle', `${angle}deg`);

//     // horizontal move
//     const dx = Math.random() * 200 - 100;

//     star.style.setProperty('--dx', `${dx}px`);

//     // size
//     star.style.height =
//       50 + Math.random() * 80 + 'px';

//     // speed
//     star.style.animationDuration =
//       3 + Math.random() * 4 + 's';

//     // delay
//     star.style.animationDelay =
//       Math.random() * 5 + 's';

//     // softer opacity
//     star.style.opacity =
//       (0.12 + Math.random() * 0.18).toFixed(2);

//     // color variable
//     star.style.setProperty('--color', color);

//     container.appendChild(star);
//   }
// }



function initTiltCards(selector = '.card', maxRotate = 15) {
  const cards = document.querySelectorAll(selector);

  if (!cards.length) return;

  cards.forEach((card) => {
    card.style.transformStyle = 'preserve-3d';
    card.style.willChange = 'transform';

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateY = ((x - centerX) / centerX) * maxRotate;
      const rotateX = -((y - centerY) / centerY) * maxRotate;

      card.style.transform = `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.4s ease';

      card.style.transform = `
        perspective(1000px)
        rotateX(0deg)
        rotateY(0deg)
      `;

      setTimeout(() => {
        card.style.transition = '';
      }, 400);
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s linear';
    });
  });
}

