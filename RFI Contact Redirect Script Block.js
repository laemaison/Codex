{% assign rfi_email = store_variables['rfi_email_address'] | default: blank %}
(function() {
  'use strict';

  // Get email from Liquid store variable (injected at page load)
  const storeEmail = '{{ rfi_email }}';
  const subjectLine = 'Storefront request for information';
  let attached = false;

  function getStoreEmail() {
    // Use the store variable injected via Liquid
    if (storeEmail && storeEmail !== '' && !storeEmail.includes('{{')) {
      console.log('[Footer RFI] Using rfi_email_address store variable:', storeEmail);
      return storeEmail;
    }

    console.error('[Footer RFI] rfi_email_address store variable not found or empty');
    return null;
  }

  function attachMailtoHandler() {
    if (attached) return;

    const footerLink = document.querySelector('.footer-cta-button > .SC-Menu_link');
    if (!footerLink) {
      console.warn('[Footer RFI] Footer CTA link not found');
      return;
    }

    const email = getStoreEmail();
    if (!email) {
      console.warn('[Footer RFI] No email found for this store');
      return;
    }

    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subjectLine)}`;

    // Intercept sc:navigate event (capture phase)
    footerLink.addEventListener('sc:navigate', function(e) {
      // Only intercept on left-click without modifier keys
      const mouseEvent = e.detail?.originalEvent;
      if (mouseEvent && (mouseEvent.ctrlKey || mouseEvent.metaKey || mouseEvent.shiftKey || mouseEvent.button !== 0)) {
        return; // Let default behavior happen (open in new tab, etc.)
      }

      e.preventDefault();
      e.stopPropagation();
      
      // Remove focus/hover state before opening mailto
      footerLink.blur();
      
      window.location.href = mailtoUrl;
      console.log('[Footer RFI] Mailto triggered:', mailtoUrl);
    }, true);

    // Also intercept regular click as backup
    footerLink.addEventListener('click', function(e) {
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) {
        return; // Allow modified clicks to use original href
      }
      e.preventDefault();
      
      // Remove focus/hover state before opening mailto
      footerLink.blur();
      
      window.location.href = mailtoUrl;
      console.log('[Footer RFI] Direct click mailto triggered:', mailtoUrl);
    }, true);

    attached = true;
    console.log('[Footer RFI] Handler attached successfully for:', email);
  }

  // Retry attachment with exponential backoff
  let attempts = 0;
  const maxAttempts = 10;
  const delays = [100, 200, 300, 500, 800, 1000, 1500, 2000, 2500, 3000];

  function tryAttach() {
    if (attempts >= maxAttempts) {
      console.error('[Footer RFI] Max attachment attempts reached');
      return;
    }

    attachMailtoHandler();

    if (!attached) {
      attempts++;
      setTimeout(tryAttach, delays[attempts - 1] || 3000);
    }
  }

  // Start attachment process
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryAttach);
  } else {
    tryAttach();
  }

  // Also watch for dynamic footer injection
  const observer = new MutationObserver(function(mutations) {
    if (!attached) {
      attachMailtoHandler();
    }
  });

  if (document.body) {
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
})();