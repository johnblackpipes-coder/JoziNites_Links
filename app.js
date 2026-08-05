// app.js - fetch links.json and render link buttons

async function loadLinks() {
  try {
    const res = await fetch('links.json', {cache: 'no-store'});
    if (!res.ok) throw new Error('Failed to load links.json');
    const data = await res.json();

    // Populate profile area
    const profileName = document.querySelector('#profile-name');
    const profileBio = document.querySelector('#profile-bio');
    const avatarImg = document.querySelector('#profile-avatar');
    if (profileName) profileName.textContent = data.name || '';
    if (profileBio) profileBio.textContent = data.bio || '';
    if (avatarImg && data.avatar) avatarImg.src = data.avatar;

    // Set theme color (CSS variable)
    if (data.themeColor) document.documentElement.style.setProperty('--accent', data.themeColor);

    const list = document.querySelector('#link-list');
    if (!list) return;

    const iconMap = {
      twitter: 'assets/icons/twitter.svg',
      instagram: 'assets/icons/instagram.svg',
      fetlife: 'assets/icons/fetlife.svg',
      onlyfans: 'assets/icons/onlyfans.svg',
      generic: 'assets/icons/link.svg'
    };

    list.innerHTML = '';

    for (const item of data.links || []) {
      const a = document.createElement('a');
      a.className = 'link-item';
      a.href = item.url || '#';
      a.target = '_blank';
      a.rel = 'noopener noreferrer';

      const icon = document.createElement('img');
      const key = (item.platform || 'generic').toLowerCase();
      icon.src = iconMap[key] || iconMap['generic'];
      icon.alt = item.platform || 'link';
      icon.className = 'link-icon';

      const content = document.createElement('div');
      content.className = 'link-content';
      const title = document.createElement('div');
      title.className = 'link-title';
      title.textContent = item.title || item.url;
      content.appendChild(title);
      if (item.subtitle) {
        const subtitle = document.createElement('div');
        subtitle.className = 'link-subtitle';
        subtitle.textContent = item.subtitle;
        content.appendChild(subtitle);
      }

      a.appendChild(icon);
      a.appendChild(content);
      list.appendChild(a);
    }

  } catch (err) {
    console.error(err);
  }
}

window.addEventListener('DOMContentLoaded', loadLinks);

// Register service worker if available (keeps registration in app.js as well)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('SW registered from app.js', reg.scope))
      .catch(err => console.warn('SW register failed', err));
  });
}
