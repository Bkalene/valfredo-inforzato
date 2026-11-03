/**
 * Portfólio Cênico Valfredo Inforzato Júnior
 * Interatividade, Filtros de Repertório, Player de Vídeos e Lightbox
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initFilters();
  initModals();
});

// Navegação e Menu Mobile
function initNavbar() {
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navbar = document.getElementById('navbar');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Fechar ao clicar em link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // Scroll styling
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.borderBottomColor = 'rgba(229, 184, 105, 0.2)';
      navbar.style.background = 'rgba(9, 9, 11, 0.95)';
    } else {
      navbar.style.borderBottomColor = 'rgba(255, 255, 255, 0.08)';
      navbar.style.background = 'rgba(9, 9, 11, 0.85)';
    }
  });
}

// Filtros do Repertório Histórico
function initFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.rep-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active class
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      items.forEach(item => {
        const categories = item.getAttribute('data-category') || '';
        if (filter === 'all' || categories.includes(filter)) {
          item.style.display = 'flex';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 20);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(10px)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

// Modal de Vídeo Interativo
function openVideoModal(videoId, title) {
  const modal = document.getElementById('videoModal');
  const iframe = document.getElementById('videoIframe');
  const modalTitle = document.getElementById('modalVideoTitle');

  if (modal && iframe) {
    modalTitle.textContent = title || 'Apresentação Cênica';
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeVideoModal() {
  const modal = document.getElementById('videoModal');
  const iframe = document.getElementById('videoIframe');

  if (modal && iframe) {
    iframe.src = '';
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

// Lightbox para Ampliar Pôsteres e Imagens
function openLightbox(src, caption) {
  const lightbox = document.getElementById('imageLightbox');
  const img = document.getElementById('lightboxImg');
  const captionEl = document.getElementById('lightboxCaption');

  if (lightbox && img) {
    img.src = src;
    captionEl.textContent = caption || '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeLightbox() {
  const lightbox = document.getElementById('imageLightbox');
  if (lightbox) {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

// Helper para links externos
function openExternalLink(url) {
  window.open(url, '_blank');
}

// Tecla ESC para fechar modais
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeVideoModal();
    closeLightbox();
  }
});

// Expor funções globais para eventos inline nos botões
window.openVideoModal = openVideoModal;
window.closeVideoModal = closeVideoModal;
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.openExternalLink = openExternalLink;

