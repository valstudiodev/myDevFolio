"use strict"

// ===========================================================================================
// -----------------------------
// ВИЗНАЧЕННЯ ТИПУ ВВОДУ (Input Mode)
// -----------------------------
export function initInputMode() {
   const html = document.documentElement;
   let lockedByKeyboard = false;

   function setInputMode(type) {
      if (html.dataset.input !== type) {
         html.dataset.input = type;
      }
   }

   // ✅ Mobile First: старт з touch
   setInputMode('touch');

   window.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
         lockedByKeyboard = true;
         setInputMode('keyboard');
      }
   });

   window.addEventListener('pointermove', (e) => {
      // 🛡 Додатковий захист: перевіряємо e.movement (чи реально рухається миша)
      // Або просто суворо фільтруємо тип
      if (e.pointerType === 'mouse' && !lockedByKeyboard) {
         // На деяких тачах рух пальцем викликає pointermove з mouse і movement: 0
         if (e.movementX !== 0 || e.movementY !== 0) {
            setInputMode('mouse');
         }
      }
   }, { passive: true });

   window.addEventListener('pointerdown', (e) => {
      lockedByKeyboard = false;
      // Суворе розділення
      setInputMode(e.pointerType === 'mouse' ? 'mouse' : 'touch');
   });
}
