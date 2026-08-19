(() => {
  const root = document.querySelector('[data-gallery-root]');
  if (!root) return;
  let galleries = {};

  const openAlbum = (slug) => {
    const panel = document.querySelector(`[data-album-panel="${slug}"]`);
    if (!panel) return;
    document.querySelectorAll('[data-album-panel]').forEach((item) => { item.hidden = item !== panel; });
    const title = root.querySelector('[data-album-title]');
    if (title) title.textContent = galleries[slug]?.title || 'Fotografie';
    root.hidden = false;
    root.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  document.querySelectorAll('[data-album-open]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      openAlbum(link.dataset.albumOpen);
    });
  });

  root.querySelector('[data-album-close]')?.addEventListener('click', () => {
    root.hidden = true;
    document.querySelectorAll('[data-album-panel]').forEach((item) => { item.hidden = true; });
    document.querySelector('.gallery-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  fetch('assets/data/galleries.json')
    .then((response) => response.json())
    .then((data) => {
      galleries = data;
      Object.entries(data).forEach(([slug, gallery]) => {
        const mount = document.querySelector(`[data-gallery-list="${slug}"]`);
        if (!mount) return;
        const photos = Array.isArray(gallery.photos) ? gallery.photos : [];
        if (!photos.length) {
          mount.innerHTML = `<div class="empty-gallery"><strong>${gallery.title}</strong><p>${gallery.description || 'Fotografie budou doplněny.'}</p><small>Fotky přidej do složky <code>assets/gallery/${slug}</code> a zapiš je do <code>assets/data/galleries.json</code>.</small></div>`;
          return;
        }
        mount.classList.add('grid', 'grid--3');
        mount.innerHTML = photos.map((photo) => `
          <button class="gallery-photo" type="button" data-lightbox-src="${photo.src}" data-lightbox-alt="${photo.alt || gallery.title}" data-lightbox-group="${slug}">
            <img src="${photo.src}" alt="${photo.alt || gallery.title}" loading="lazy">
            <span>${photo.caption || gallery.title}</span>
          </button>
        `).join('');
      });
    })
    .catch(() => {
      root.insertAdjacentHTML('beforeend', '<div class="empty-gallery"><strong>Galerii se nepodařilo načíst.</strong><p>Zkontroluj soubor assets/data/galleries.json.</p></div>');
    });
})();
