(function() {
  'use strict';

  // Email mapping by store name and abbreviations
  const emailMap = {
    'Ashland Community and Technical College': 'ashland-workforce@kctcs.edu',
    'ACTC': 'ashland-workforce@kctcs.edu',
    'ashland': 'ashland-workforce@kctcs.edu',
    
    'Big Sandy Community and Technical College': 'bigsandy-workforce@kctcs.edu',
    'BSCTC': 'bigsandy-workforce@kctcs.edu',
    'bigsandy': 'bigsandy-workforce@kctcs.edu',
    
    'Bluegrass Community and Technical College': 'bluegrass-workforce@kctcs.edu',
    'BCTC': 'bluegrass-workforce@kctcs.edu',
    'bluegrass': 'bluegrass-workforce@kctcs.edu',
    
    'Elizabethtown Community and Technical College': 'elizabethtown-workforce@kctcs.edu',
    'ECTC': 'elizabethtown-workforce@kctcs.edu',
    'elizabethtown': 'elizabethtown-workforce@kctcs.edu',
    
    'Gateway Community and Technical College': 'gateway-workforce@kctcs.edu',
    'GCTC': 'gateway-workforce@kctcs.edu',
    'gateway': 'gateway-workforce@kctcs.edu',
    
    'Hazard Community and Technical College': 'hazard-workforce@kctcs.edu',
    'HCTC': 'hazard-workforce@kctcs.edu',
    'hazard': 'hazard-workforce@kctcs.edu',
    
    'Henderson Community College': 'henderson-workforce@kctcs.edu',
    'HCC': 'henderson-workforce@kctcs.edu',
    'henderson': 'henderson-workforce@kctcs.edu',
    
    'Hopkinsville Community College': 'hopkinsville-workforce@kctcs.edu',
    'hopkinsville': 'hopkinsville-workforce@kctcs.edu',
    
    'Jefferson Community and Technical College': 'jefferson-workforce@kctcs.edu',
    'JCTC': 'jefferson-workforce@kctcs.edu',
    'jefferson': 'jefferson-workforce@kctcs.edu',
    
    'Madisonville Community College': 'madisonville-workforce@kctcs.edu',
    'MCC': 'madisonville-workforce@kctcs.edu',
    'madisonville': 'madisonville-workforce@kctcs.edu',
    
    'Maysville Community and Technical College': 'maysville-workforce@kctcs.edu',
    'MCTC': 'maysville-workforce@kctcs.edu',
    'maysville': 'maysville-workforce@kctcs.edu',
    
    'Owensboro Community and Technical College': 'owensboro-workforce@kctcs.edu',
    'OCTC': 'owensboro-workforce@kctcs.edu',
    'owensboro': 'owensboro-workforce@kctcs.edu',
    
    'Somerset Community College': 'somerset-workforce@kctcs.edu',
    'SCC': 'somerset-workforce@kctcs.edu',
    'somerset': 'somerset-workforce@kctcs.edu',
    
    'Southcentral Kentucky Community and Technical College': 'southcentral-workforce@kctcs.edu',
    'SKYCTC': 'southcentral-workforce@kctcs.edu',
    'southcentral': 'southcentral-workforce@kctcs.edu',
    
    'Southeast Kentucky Community and Technical College': 'southeast-workforce@kctcs.edu',
    'SKCTC': 'southeast-workforce@kctcs.edu',
    'southeast': 'southeast-workforce@kctcs.edu',
    
    'West Kentucky Community and Technical College': 'westkentucky-workforce@kctcs.edu',
    'WKCTC': 'westkentucky-workforce@kctcs.edu',
    'westkentucky': 'westkentucky-workforce@kctcs.edu'
  };

  const subjectLine = 'Storefront request for information';
  let attached = false;

  function getStoreEmail() {
    // Strategy 1: Check global store object
    if (typeof store !== 'undefined' && store && store.name) {
      const email = emailMap[store.name];
      if (email) {
        console.log('[Footer RFI] Email found via store.name:', store.name);
        return email;
      }
    }

    // Strategy 2: Extract from URL path (e.g., /bluegrass)
    const pathMatch = window.location.pathname.match(/\/([a-z]+)/);
    if (pathMatch && pathMatch[1]) {
      const storePath = pathMatch[1];
      const email = emailMap[storePath];
      if (email) {
        console.log('[Footer RFI] Email found via URL path:', storePath);
        return email;
      }
    }

    // Strategy 3: Check page title
    const titleStore = document.title.split('|')[0]?.trim();
    if (titleStore && emailMap[titleStore]) {
      console.log('[Footer RFI] Email found via page title:', titleStore);
      return emailMap[titleStore];
    }

    // Strategy 4: Check meta tag
    const metaStore = document.querySelector('meta[name="store-name"]')?.content;
    if (metaStore && emailMap[metaStore]) {
      console.log('[Footer RFI] Email found via meta tag:', metaStore);
      return emailMap[metaStore];
    }

    console.error('[Footer RFI] Could not determine store email. Tried:', {
      storeName: typeof store !== 'undefined' ? store?.name : 'undefined',
      urlPath: pathMatch ? pathMatch[1] : 'none',
      pageTitle: titleStore,
      metaTag: metaStore
    });
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