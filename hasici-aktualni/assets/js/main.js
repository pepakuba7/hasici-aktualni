(() => {
  const body = document.body;
  const header = document.querySelector('[data-header]');
  const toggle = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-nav]');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = body.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        body.classList.remove('menu-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-nav] a, [data-footer-link]').forEach((a) => {
    const href = a.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      a.classList.add('is-active');
      a.setAttribute('aria-current', 'page');
    }
  });

  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  // Animated counters
  const counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    const counterIo = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const end = Number(el.dataset.count || 0);
        const suffix = el.dataset.suffix || '';
        const duration = 1100;
        const start = performance.now();
        const step = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(end * eased).toLocaleString('cs-CZ') + suffix;
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        counterIo.unobserve(el);
      });
    }, { threshold: 0.25 });
    counters.forEach((el) => counterIo.observe(el));
  }

  // Tabs / filters
  document.querySelectorAll('[data-tabs]').forEach((tabs) => {
    const buttons = tabs.querySelectorAll('[data-tab-target]');
    const panels = document.querySelectorAll('[data-tab-panel]');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tabTarget;
        buttons.forEach((b) => b.classList.toggle('is-active', b === btn));
        panels.forEach((panel) => {
          panel.hidden = panel.dataset.tabPanel !== target;
        });
      });
    });
  });

  // Incident table filter
  document.querySelectorAll('[data-incident-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const group = btn.closest('[data-filter-group]');
      const target = btn.dataset.incidentFilter;
      group.querySelectorAll('[data-incident-filter]').forEach((b) => b.classList.toggle('is-active', b === btn));
      document.querySelectorAll('[data-incident-row]').forEach((row) => {
        row.hidden = target !== 'all' && row.dataset.incidentRow !== target;
      });
    });
  });

  // Copy public contact details
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const value = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(value);
        const original = btn.textContent;
        btn.textContent = 'Zkopírováno';
        setTimeout(() => { btn.textContent = original; }, 1400);
      } catch (e) {
        alert(value);
      }
    });
  });

  // E-mail buttons and contact form: static fallback via mailto
  const openMailto = (href, statusEl) => {
    const fallback = href;
    window.location.href = fallback;
    if (statusEl) {
      statusEl.innerHTML = `Pokud se e-mailový program neotevře, napište přímo na <a href="${fallback}">hasici-hodslavice@seznam.cz</a>.`;
    }
  };

  const contactForm = document.querySelector('[data-contact-form]');
  if (contactForm) {
    let status = contactForm.querySelector('[data-mail-status]');
    if (!status) {
      status = document.createElement('p');
      status.className = 'form-note form-note--fallback';
      status.setAttribute('data-mail-status', '');
      contactForm.appendChild(status);
    }
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(contactForm);
      const subject = encodeURIComponent(String(data.get('subject') || 'Zpráva z webu Hasiči Hodslavice'));
      const bodyText = [
        `Jméno: ${data.get('name') || ''}`,
        `Telefon/e-mail: ${data.get('contact') || ''}`,
        '',
        data.get('message') || ''
      ].join('\n');
      const href = `mailto:hasici-hodslavice@seznam.cz?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
      openMailto(href, status);
    });
  }

  // Lightbox with previous/next navigation for gallery photos
  const lightbox = document.querySelector('[data-lightbox]');
  if (lightbox) {
    const img = lightbox.querySelector('img');
    const close = lightbox.querySelector('[data-lightbox-close]') || lightbox.querySelector('button');
    const prev = lightbox.querySelector('[data-lightbox-prev]');
    const next = lightbox.querySelector('[data-lightbox-next]');
    const counter = lightbox.querySelector('[data-lightbox-counter]');
    let photos = [];
    let index = 0;

    const setPhoto = (nextIndex) => {
      if (!photos.length) return;
      index = (nextIndex + photos.length) % photos.length;
      const photo = photos[index];
      img.src = photo.src;
      img.alt = photo.alt || '';
      if (counter) counter.textContent = `${index + 1} / ${photos.length}`;
      if (prev) prev.hidden = photos.length < 2;
      if (next) next.hidden = photos.length < 2;
    };

    const openLightbox = (trigger) => {
      const group = trigger.dataset.lightboxGroup || 'default';
      photos = Array.from(document.querySelectorAll(`[data-lightbox-src][data-lightbox-group="${CSS.escape(group)}"]`))
        .map((item) => ({ src: item.dataset.lightboxSrc, alt: item.dataset.lightboxAlt || '' }));
      const clickedIndex = photos.findIndex((photo) => photo.src === trigger.dataset.lightboxSrc);
      if (clickedIndex < 0) {
        photos = [{ src: trigger.dataset.lightboxSrc, alt: trigger.dataset.lightboxAlt || '' }];
        index = 0;
      } else {
        index = clickedIndex;
      }
      setPhoto(index);
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('lightbox-open');
      close?.focus();
    };

    const closeLightbox = () => {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('lightbox-open');
      img.removeAttribute('src');
      photos = [];
    };

    document.addEventListener('click', (event) => {
      const trigger = event.target.closest('[data-lightbox-src]');
      if (!trigger) return;
      event.preventDefault();
      openLightbox(trigger);
    });

    close?.addEventListener('click', closeLightbox);
    prev?.addEventListener('click', () => setPhoto(index - 1));
    next?.addEventListener('click', () => setPhoto(index + 1));
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') setPhoto(index - 1);
      if (e.key === 'ArrowRight') setPhoto(index + 1);
    });
  }
})();
