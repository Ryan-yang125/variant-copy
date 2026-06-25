(() => {
  const CARD_SELECTOR = '.presentation-card[data-design-id]';
  const COPY_SLOT_SELECTOR = '[data-slot="copy-html"]';
  const BUTTON_SELECTOR = '.variant-copy-html-button';
  const STYLE_ID = 'variant-copy-html-extension-style';
  const TOAST_ID = 'variant-copy-html-extension-toast';

  const ICONS = {
    copy: `
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M7.25 3.25C7.25 2.55964 7.80964 2 8.5 2H15.25C15.9404 2 16.5 2.55964 16.5 3.25V10C16.5 10.6904 15.9404 11.25 15.25 11.25H8.5C7.80964 11.25 7.25 10.6904 7.25 10V3.25Z" stroke="currentColor" stroke-width="1.5" />
        <path d="M4.75 5.75H4.5C3.80964 5.75 3.25 6.30964 3.25 7V16.25C3.25 16.9404 3.80964 17.5 4.5 17.5H13.75C14.4404 17.5 15 16.9404 15 16.25V16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      </svg>`,
    done: `
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M16.25 5.75L8.75 13.25L5 9.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
      </svg>`,
    error: `
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M10 6V10.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        <path d="M10 14H10.01" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
        <path d="M10 2.75L17.25 16.25H2.75L10 2.75Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
      </svg>`
  };

  const SPINNER = '<span class="variant-copy-html-spinner" aria-hidden="true"></span>';

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .variant-copy-html-slot {
        pointer-events: auto;
      }

      .variant-copy-html-button {
        align-items: center !important;
        color: white !important;
        cursor: pointer !important;
        display: inline-flex !important;
        height: 28px !important;
        justify-content: center !important;
        pointer-events: auto !important;
        position: relative !important;
        width: 28px !important;
      }

      .variant-copy-html-button:hover {
        color: white !important;
        transform: translateY(-1px);
      }

      .variant-copy-html-button[data-state="loading"] {
        cursor: wait !important;
        opacity: 0.78;
      }

      [data-visible="false"] .variant-copy-html-button {
        pointer-events: none !important;
      }

      .variant-copy-html-button[data-state="done"] {
        color: #7cffb2 !important;
      }

      .variant-copy-html-button[data-state="error"] {
        color: #ff8f8f !important;
      }

      .variant-copy-html-spinner {
        animation: variant-copy-html-spin 0.72s linear infinite;
        border: 2px solid rgba(255, 255, 255, 0.35);
        border-top-color: white;
        border-radius: 999px;
        height: 16px;
        width: 16px;
      }

      #${TOAST_ID} {
        align-items: center;
        background: rgba(20, 20, 20, 0.92);
        border: 1px solid rgba(255, 255, 255, 0.16);
        border-radius: 8px;
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.32);
        color: white;
        display: flex;
        font: 500 13px/1.35 ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        gap: 8px;
        max-width: min(360px, calc(100vw - 32px));
        opacity: 0;
        padding: 10px 12px;
        pointer-events: none;
        position: fixed;
        right: 16px;
        top: 16px;
        transform: translateY(-6px);
        transition: opacity 160ms ease, transform 160ms ease;
        z-index: 2147483647;
      }

      #${TOAST_ID}[data-visible="true"] {
        opacity: 1;
        transform: translateY(0);
      }

      @keyframes variant-copy-html-spin {
        to { transform: rotate(360deg); }
      }
    `;

    document.documentElement.appendChild(style);
  }

  function getDesignId(card) {
    const id = card.getAttribute('data-design-id');
    return id && id.trim() ? id.trim() : null;
  }

  function getRightIcons(card) {
    return (
      card.querySelector('[data-hover-indicator-group="true"]') ||
      card.querySelector('[class*="CardIcons_rightIcons"]')
    );
  }

  function getBookmarkSlot(card) {
    return (
      card.querySelector('[data-slot="bookmark"]') ||
      card.querySelector('[data-hover-key="bookmark"]')
    );
  }

  function getButtonClass(bookmarkSlot) {
    const button = bookmarkSlot?.querySelector('button');
    return button?.className || '';
  }

  function setButtonState(button, state, label) {
    button.dataset.state = state;
    button.setAttribute('aria-label', label);
    button.title = label;

    if (state === 'loading') {
      button.innerHTML = SPINNER;
      return;
    }

    button.innerHTML = ICONS[state] || ICONS.copy;
  }

  function showToast(message) {
    let toast = document.getElementById(TOAST_ID);
    if (!toast) {
      toast = document.createElement('div');
      toast.id = TOAST_ID;
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.documentElement.appendChild(toast);
    }

    toast.textContent = message;
    toast.dataset.visible = 'true';
    window.clearTimeout(showToast.hideTimer);
    showToast.hideTimer = window.setTimeout(() => {
      toast.dataset.visible = 'false';
    }, 1800);
  }

  function makeDesignUrl(id) {
    return new URL(`/design/${encodeURIComponent(id)}.html`, location.origin).href;
  }

  async function fetchDesignHtml(id) {
    const url = makeDesignUrl(id);
    const response = await fetch(url, {
      cache: 'default',
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return response.text();
  }

  async function copyText(text) {
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return;
      } catch (error) {
        console.warn('[Variant Copy HTML] Clipboard API failed, using fallback.', error);
      }
    }

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.cssText = [
      'height:1px',
      'left:-9999px',
      'opacity:0',
      'position:fixed',
      'top:0',
      'width:1px'
    ].join(';');
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    const copied = document.execCommand('copy');
    textarea.remove();

    if (!copied) {
      throw new Error('Clipboard copy failed');
    }
  }

  function resetButtonSoon(button) {
    window.clearTimeout(button.variantCopyResetTimer);
    button.variantCopyResetTimer = window.setTimeout(() => {
      setButtonState(button, 'copy', 'Copy HTML');
    }, 1400);
  }

  async function handleCopyClick(event) {
    event.preventDefault();
    event.stopPropagation();

    const button = event.currentTarget;
    const card = button.closest(CARD_SELECTOR);
    const id = card ? getDesignId(card) : null;

    if (!id || button.dataset.state === 'loading') return;

    setButtonState(button, 'loading', 'Copying HTML');

    try {
      const html = await fetchDesignHtml(id);
      await copyText(html);
      setButtonState(button, 'done', 'Copied HTML');
      showToast(`Copied ${Math.round(html.length / 1024)} KB HTML`);
    } catch (error) {
      console.error('[Variant Copy HTML] Copy failed.', error);
      setButtonState(button, 'error', 'Copy failed');
      showToast(`Copy failed: ${error.message}`);
    } finally {
      resetButtonSoon(button);
    }
  }

  function createCopySlot(bookmarkSlot) {
    const slot = document.createElement('div');
    slot.className = `${bookmarkSlot?.className || ''} variant-copy-html-slot`.trim();
    slot.dataset.slot = 'copy-html';
    slot.dataset.hoverKey = 'copy-html';

    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip-container';

    const button = document.createElement('button');
    button.type = 'button';
    button.className = `${getButtonClass(bookmarkSlot)} variant-copy-html-button`.trim();
    button.dataset.persistHover = 'false';
    setButtonState(button, 'copy', 'Copy HTML');
    button.addEventListener('click', handleCopyClick, true);

    tooltip.appendChild(button);
    slot.appendChild(tooltip);
    return slot;
  }

  function enhanceCard(card) {
    if (!getDesignId(card) || card.querySelector(COPY_SLOT_SELECTOR)) return;

    const rightIcons = getRightIcons(card);
    const bookmarkSlot = getBookmarkSlot(card);
    if (!rightIcons || !bookmarkSlot) return;

    rightIcons.insertBefore(createCopySlot(bookmarkSlot), bookmarkSlot);
  }

  let scheduled = false;

  function enhanceVisibleCards() {
    scheduled = false;
    ensureStyles();
    document.querySelectorAll(CARD_SELECTOR).forEach(enhanceCard);
  }

  function scheduleEnhance() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(enhanceVisibleCards);
  }

  enhanceVisibleCards();

  const observer = new MutationObserver(scheduleEnhance);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  if (typeof chrome !== 'undefined' && chrome.runtime?.onMessage) {
    chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (message?.type !== 'variant-copy:get-status') return false;

      sendResponse({
        active: true,
        cardCount: document.querySelectorAll(CARD_SELECTOR).length,
        copyButtonCount: document.querySelectorAll(BUTTON_SELECTOR).length
      });
      return false;
    });
  }
})();
