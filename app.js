/**
 * Portfólio Cênico Valfredo Inforzato Júnior
 * Arquitetura JavaScript Moderna: Interatividade, Vitrine Dinâmica, Busca em Tempo Real e Cursor Spotlight
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollProgress();
  initSpotlight();
  initSceneSelector();
  initRepertorioFilterAndSearch();
  initModals();
});

/* ==========================================================================
   1. BARRA DE NAVEGAÇÃO & MENU MOBILE
   ========================================================================== */
function initNavbar() {
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navbar = document.getElementById('navbar');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Fechar ao clicar em qualquer link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // Estilização dinâmica da navbar ao rolar a página
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.style.borderBottomColor = 'rgba(229, 184, 105, 0.25)';
      navbar.style.background = 'rgba(9, 9, 11, 0.95)';
    } else {
      navbar.style.borderBottomColor = 'rgba(255, 255, 255, 0.08)';
      navbar.style.background = 'rgba(9, 9, 11, 0.85)';
    }
  }, { passive: true });
}

/* ==========================================================================
   2. BARRA DE PROGRESSO DE LEITURA (SCROLL PROGRESS)
   ========================================================================== */
function initScrollProgress() {
  const progressBar = document.getElementById('scrollProgress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const progress = (window.scrollY / totalHeight) * 100;
      progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }
  }, { passive: true });
}

/* ==========================================================================
   3. SPOTLIGHT CURSOR CINEMATOGRÁFICO (DESKTOP)
   ========================================================================== */
function initSpotlight() {
  const spotlight = document.getElementById('spotlightCursor');
  if (!spotlight || window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = -1000;
  let mouseY = -1000;
  let currentX = -1000;
  let currentY = -1000;
  let isMoving = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!isMoving) {
      isMoving = true;
      requestAnimationFrame(updateSpotlight);
    }
  }, { passive: true });

  function updateSpotlight() {
    // Interpolação suave (lerp) para movimento fluido
    currentX += (mouseX - currentX) * 0.15;
    currentY += (mouseY - currentY) * 0.15;
    spotlight.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;

    if (Math.abs(mouseX - currentX) > 0.5 || Math.abs(mouseY - currentY) > 0.5) {
      requestAnimationFrame(updateSpotlight);
    } else {
      isMoving = false;
    }
  }

  // Desaparece ao sair da janela
  document.addEventListener('mouseleave', () => {
    spotlight.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    spotlight.style.opacity = '1';
  });
}

/* ==========================================================================
   4. VITRINE CÊNICA INTERATIVA (HERO MEDIA SHOWCASE)
   ========================================================================== */
function initSceneSelector() {
  const mainImage = document.getElementById('heroMainImage');
  const captionTitle = document.getElementById('heroCaptionTitle');
  const captionSub = document.getElementById('heroCaptionSub');
  const thumbs = document.querySelectorAll('.scene-thumb');
  const heroCard = document.getElementById('heroCard');

  if (!mainImage || thumbs.length === 0) return;

  let currentIndex = 0;
  let autoTimer = null;
  let isPaused = false;

  function switchScene(index) {
    if (index === currentIndex && thumbs[index].classList.contains('active')) return;
    currentIndex = index;

    thumbs.forEach(t => t.classList.remove('active'));
    thumbs[index].classList.add('active');

    const newSrc = thumbs[index].getAttribute('data-img');
    const newTitle = thumbs[index].getAttribute('data-title');
    const newSub = thumbs[index].getAttribute('data-sub');

    // Efeito suave de transição
    mainImage.style.opacity = '0.3';
    mainImage.style.transform = 'scale(0.98)';

    setTimeout(() => {
      mainImage.src = newSrc;
      if (captionTitle) captionTitle.textContent = newTitle;
      if (captionSub) captionSub.textContent = newSub;
      mainImage.style.opacity = '1';
      mainImage.style.transform = 'scale(1)';
    }, 180);
  }

  thumbs.forEach((thumb, idx) => {
    thumb.addEventListener('click', () => {
      switchScene(idx);
    });
  });

  // Rotação automática a cada 6 segundos, pausada ao passar o mouse
  function startAutoCycle() {
    stopAutoCycle();
    autoTimer = setInterval(() => {
      if (!isPaused) {
        const nextIndex = (currentIndex + 1) % thumbs.length;
        switchScene(nextIndex);
      }
    }, 6000);
  }

  function stopAutoCycle() {
    if (autoTimer) clearInterval(autoTimer);
  }

  if (heroCard) {
    heroCard.addEventListener('mouseenter', () => { isPaused = true; });
    heroCard.addEventListener('mouseleave', () => { isPaused = false; });
  }

  startAutoCycle();
}

/* ==========================================================================
   5. REPERTÓRIO: FILTROS POR CATEGORIA + BUSCA DINÂMICA EM TEMPO REAL
   ========================================================================== */
function initRepertorioFilterAndSearch() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('repertorioSearch');
  const clearBtn = document.getElementById('searchClearBtn');
  const countBadge = document.getElementById('searchResultCount');
  const items = document.querySelectorAll('.rep-item');

  let activeCategory = 'all';
  let activeSearchTerm = '';

  function applyFilterAndSearch() {
    let visibleCount = 0;
    const term = activeSearchTerm.trim().toLowerCase();

    items.forEach(item => {
      const categories = (item.getAttribute('data-category') || '').toLowerCase();
      const text = item.innerText.toLowerCase();

      const matchesCategory = (activeCategory === 'all' || categories.includes(activeCategory));
      const matchesSearch = (!term || text.includes(term));

      if (matchesCategory && matchesSearch) {
        visibleCount++;
        item.style.display = 'flex';
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }, 15);
      } else {
        item.style.opacity = '0';
        item.style.transform = 'translateY(8px)';
        setTimeout(() => {
          item.style.display = 'none';
        }, 180);
      }
    });

    // Atualiza contagem visível
    if (countBadge) {
      if (term || activeCategory !== 'all') {
        countBadge.textContent = `${visibleCount} obra${visibleCount !== 1 ? 's' : ''} encontrada${visibleCount !== 1 ? 's' : ''}`;
      } else {
        countBadge.textContent = `${items.length} espetáculos catalogados`;
      }
    }
  }

  // Cliques nos botões de filtro
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-filter') || 'all';
      applyFilterAndSearch();
    });
  });

  // Busca em tempo real
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      activeSearchTerm = e.target.value;
      if (clearBtn) {
        clearBtn.style.display = activeSearchTerm ? 'block' : 'none';
      }
      applyFilterAndSearch();
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        activeSearchTerm = '';
        clearBtn.style.display = 'none';
        searchInput.focus();
        applyFilterAndSearch();
      });
    }
  }
}

/* ==========================================================================
   6. PLAYER DE VÍDEO & LIGHTBOX
   ========================================================================== */
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

function initModals() {
  const zoomables = document.querySelectorAll('.project-poster-wrapper, .zoomable, .d-gallery-card');
  zoomables.forEach(item => {
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });
  });
}

function openExternalLink(url) {
  window.open(url, '_blank', 'noopener,noreferrer');
}

// Fechamento com tecla ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeVideoModal();
    closeLightbox();
  }
});

// Funções globais para escopo inline no HTML
window.openVideoModal = openVideoModal;
window.closeVideoModal = closeVideoModal;
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.openExternalLink = openExternalLink;
