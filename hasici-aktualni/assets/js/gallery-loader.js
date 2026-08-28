(() => {
  const root = document.querySelector('[data-gallery-root]');
  if (!root) return;
  let galleries = {};

  const openAlbum = (slug) => {
    const panel = document.querySelector(`[data-album-panel="${CSS.escape(slug)}"]`);
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
        const mount = document.querySelector(`[data-gallery-list="${CSS.escape(slug)}"]`);
        if (!mount) return;
        const photos = Array.isArray(gallery.photos) ? gallery.photos : [];
        if (!photos.length) {
          const empty = document.createElement('div');
          empty.className = 'empty-gallery';
          const title = document.createElement('strong');
          title.textContent = gallery.title;
          const description = document.createElement('p');
          description.textContent = gallery.description || 'Fotografie budou doplněny.';
          const note = document.createElement('small');
          const folder = document.createElement('code');
          folder.textContent = `assets/gallery/${slug}`;
          const manifest = document.createElement('code');
          manifest.textContent = 'assets/data/galleries.json';
          note.append('Fotky přidej do složky ', folder, ' a zapiš je do ', manifest, '.');
          empty.append(title, description, note);
          mount.replaceChildren(empty);
          return;
        }
        mount.classList.add('grid', 'grid--3');
        const items = photos.map((photo) => {
          const button = document.createElement('button');
          button.className = 'gallery-photo';
          button.type = 'button';
          button.dataset.lightboxSrc = photo.src;
          button.dataset.lightboxAlt = photo.alt || gallery.title;
          button.dataset.lightboxGroup = slug;
          const image = document.createElement('img');
          image.src = photo.src;
          image.alt = photo.alt || gallery.title;
          image.loading = 'lazy';
          const caption = document.createElement('span');
          caption.textContent = photo.caption || gallery.title;
          button.append(image, caption);
          return button;
        });
        mount.replaceChildren(...items);
      });
    })
    .catch(() => {
      const empty = document.createElement('div');
      empty.className = 'empty-gallery';
      const title = document.createElement('strong');
      title.textContent = 'Galerii se nepodařilo načíst.';
      const description = document.createElement('p');
      description.textContent = 'Zkontroluj soubor assets/data/galleries.json.';
      empty.append(title, description);
      root.append(empty);
    });
})();
