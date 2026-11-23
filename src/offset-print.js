(() => {
  const art = document.querySelector('[data-offset-print]');
  if (!art || !CSS.supports('mask-image', 'url("test.png")')) return;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let drag = null;

  function resetInk() {
    delete art.dataset.printing;
  }

  function showPrint(event, pressing, bounds = art.getBoundingClientRect()) {
    const x = Math.max(-1, Math.min(1, (event.clientX - bounds.left - bounds.width / 2) / (bounds.width * .37)));
    const y = Math.max(-1, Math.min(1, (event.clientY - bounds.top - bounds.height / 2) / (bounds.height * .42)));
    const dx = x * (pressing ? 18 : 13);
    const dy = y * (pressing ? 13 : 9);

    art.style.setProperty('--clay-x', Math.round(dx) + 'px');
    art.style.setProperty('--clay-y', Math.round(dy + 3) + 'px');
    art.style.setProperty('--sage-x', Math.round(-dx * .78) + 'px');
    art.style.setProperty('--sage-y', Math.round(-dy - 3) + 'px');
    art.dataset.printing = '';
  }

  art.dataset.ready = '';

  art.addEventListener('pointerdown', event => {
    if (reducedMotion.matches || !event.isPrimary || event.button !== 0) return;
    drag = {id: event.pointerId, x: event.clientX, started: event.pointerType === 'mouse'};
    art.setPointerCapture(event.pointerId);
    if (drag.started) {
      art.dataset.dragging = '';
      showPrint(event, true);
    }
  });

  art.addEventListener('pointermove', event => {
    if (reducedMotion.matches) return;
    if (drag?.id === event.pointerId) {
      if (!drag.started && Math.abs(event.clientX - drag.x) < 6) return;
      drag.started = true;
      art.dataset.dragging = '';
      showPrint(event, true);
      return;
    }
    if (!drag && event.pointerType === 'mouse' && !event.buttons) showPrint(event, false);
  });

  function endDrag(event) {
    if (drag?.id !== event.pointerId) return;
    drag = null;
    delete art.dataset.dragging;
    const bounds = art.getBoundingClientRect();
    const inside = event.clientX >= bounds.left && event.clientX <= bounds.right
      && event.clientY >= bounds.top && event.clientY <= bounds.bottom;
    if (event.type === 'pointerup' && event.pointerType === 'mouse' && inside && !reducedMotion.matches) {
      showPrint(event, false, bounds);
    } else {
      resetInk();
    }
  }

  art.addEventListener('pointerup', endDrag);
  art.addEventListener('pointercancel', endDrag);
  art.addEventListener('lostpointercapture', endDrag);
  art.addEventListener('pointerleave', () => {
    if (!drag) resetInk();
  });
  reducedMotion.addEventListener('change', () => {
    if (drag && art.hasPointerCapture(drag.id)) art.releasePointerCapture(drag.id);
    drag = null;
    delete art.dataset.dragging;
    resetInk();
  });
})();
