"use strict"

export function movingElements() {
   // buttonsMovement()
}
// ===========================================================================================
function buttonsMovement() {
   const btnActions = document.querySelectorAll('.buttons-active__moving');
   if (btnActions.length < 2) return;

   const btnOne = btnActions[0];
   const btnTwo = btnActions[1];

   const oldParent = btnOne.parentElement;
   if (!oldParent) return;

   const btnOneAnchor = btnOne.nextSibling;
   const btnTwoAnchor = btnTwo.nextSibling;

   const itemLink = document.querySelector('.menu-header__item:last-child');
   if (!itemLink) return;

   const mediaQuery = window.matchMedia('(max-width: 493px)');

   function toggleButtons(mq) {
      if (mq.matches) {
         itemLink.insertAdjacentElement('afterend', btnOne);
         btnOne.insertAdjacentElement('afterend', btnTwo);
      } else {
         if (btnOneAnchor) oldParent.insertBefore(btnOne, btnOneAnchor);
         if (btnTwoAnchor) oldParent.insertBefore(btnTwo, btnTwoAnchor);
      }
   }

   mediaQuery.addEventListener('change', toggleButtons);
   toggleButtons(mediaQuery);
}
