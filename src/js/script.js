"use strict"

import { initInputMode } from './inputMode';
import { initDropdowns } from './dropdownMenu';
import { initEffects } from './effects';
import { formUtils } from './formUtils';
import { initUtils } from './initUtils';
import { initLoadAnimation } from './appInit';
import { openModal } from './modal'
// ===========================================================================================
// -----------------------------
// ГОЛОВНИЙ ЗАПУСК
// -----------------------------
function initApp() {
  initInputMode()
  initLoadAnimation()
  initUtils()
  initDropdowns()
  initEffects()
  openModal()
  // movingElements()
  // formUtils()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// if (document.readyState === 'loading') {
//   document.addEventListener('DOMContentLoaded', () => {
//     function hidePreloader() {
//       const preloader = document.getElementById('preloader');
//       if (preloader) {
//         preloader.classList.add('fade-out');

//         // Повністю видаляємо елемент з DOM через 500мс (після завершення CSS-анімації),
//         // щоб він не заважав клікам і не займав пам'ять
//         setTimeout(() => {
//           preloader.remove();
//         }, 500);
//       }
//     }

//     // Найнадійніший запуск
//     if (document.readyState === 'complete') {
//       hidePreloader();
//     } else {
//       window.addEventListener('load', hidePreloader);
//     }
//   });
// } else {
//   initApp();
// }














