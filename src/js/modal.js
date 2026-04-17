"use strict"


export function openModal() {
  document.addEventListener('DOMContentLoaded', initModal);
}


async function initModal() {
  const openButtons = document.querySelectorAll('.open-btn-modal');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalContent = document.getElementById('modal-content');
  const statusText = document.getElementById('status-text');
  const statusOverlay = document.getElementById('status-overlay');

  if (!openButtons.length || !modalOverlay || !modalContent || !statusText) return;

  function getScrollbarWidth() {
    return window.innerWidth - document.documentElement.clientWidth;
  }

  function openModal() {
    const scrollWidth = getScrollbarWidth();
    document.documentElement.style.setProperty('--lock-padding', `${scrollWidth}px`);
    document.body.classList.add('no-scroll');
    modalOverlay.classList.add('is-open');
  }

  function closeModal() {
    modalOverlay.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
    document.documentElement.style.removeProperty('--lock-padding');
  }

  function showStatus(msgText, isSuccess = true) {
    statusText.textContent = msgText;
    statusText.classList.remove('success', 'error');
    statusText.classList.add(isSuccess ? 'success' : 'error');

    // Блокуємо взаємодію з формою
    modalContent.classList.add('modal-content-blocked');

    statusOverlay.style.display = 'block';
    statusText.style.opacity = '0';
    statusText.style.transform = 'translateY(-20px)';

    requestAnimationFrame(() => {
      statusText.style.opacity = '1';
      statusText.style.transform = 'translateY(0)';
    });

    const hideTime = isSuccess ? 2000 : 3000; // час показу
    setTimeout(() => {
      statusText.style.opacity = '0';
      statusText.style.transform = 'translateY(-20px)';

      setTimeout(() => {
        statusOverlay.style.display = 'none';
        modalContent.classList.remove('modal-content-blocked'); // знову можна взаємодіяти
      }, 300);
    }, hideTime);
  }



  openButtons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();

      if (!modalContent.innerHTML.trim()) {
        modalContent.innerHTML = '<div>Loading...</div>';
        openModal();

        try {
          const res = await fetch('modal.html');
          if (!res.ok) throw new Error('Failed to load');
          const html = await res.text();
          modalContent.innerHTML = html;
        } catch (err) {
          modalContent.innerHTML = '<p>Failed to load modal content.</p>';
        }
      } else {
        openModal();
      }
    });
  });

  modalOverlay.addEventListener('click', e => {
    if (e.target === modalOverlay || e.target.closest('[data-modal-close]')) {
      closeModal();
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('is-open')) {
      closeModal();
    }
  });

  // Перехоплення submit всередині модалки
  modalContent.addEventListener('submit', async e => {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn.textContent;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        form.reset();
        showStatus('Message sent successfully!', true);
        setTimeout(closeModal, 2500); // автозакриття після успіху
      } else {
        throw new Error('Failed to send message. Please try again.');
      }
    } catch (err) {
      showStatus(err.message, false);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}