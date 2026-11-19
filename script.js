document.documentElement.classList.add('js');

// Called by includes.js once every partial has been inserted into the page
window.initPortfolio = function () {

    // ===========================
    // FOOTER YEAR
    // ===========================
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // ===========================
    // HEADER: SHADOW ON SCROLL
    // ===========================
    var header = document.getElementById('siteHeader');
    function onScroll() {
        header.classList.toggle('scrolled', window.scrollY > 10);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // ===========================
    // MOBILE NAVIGATION
    // ===========================
    var navToggle = document.getElementById('navToggle');
    var mainNav = document.getElementById('mainNav');

    function setNav(open) {
        mainNav.classList.toggle('open', open);
        navToggle.setAttribute('aria-expanded', String(open));
    }
    navToggle.addEventListener('click', function () {
        setNav(!mainNav.classList.contains('open'));
    });
    mainNav.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () { setNav(false); });
    });

    // ===========================
    // ACTIVE NAV LINK ON SCROLL
    // ===========================
    var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
    var sections = navLinks
        .map(function (link) { return document.querySelector(link.getAttribute('href')); })
        .filter(Boolean);

    if ('IntersectionObserver' in window) {
        var spy = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    navLinks.forEach(function (link) {
                        link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
                    });
                }
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        sections.forEach(function (section) { spy.observe(section); });
    }

    // ===========================
    // REVEAL ON SCROLL
    // ===========================
    var revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        revealEls.forEach(function (el) { revealObserver.observe(el); });
    } else {
        revealEls.forEach(function (el) { el.classList.add('in-view'); });
    }

    // ===========================
    // PROJECT FILTER
    // ===========================
    var filterButtons = document.querySelectorAll('.filter-btn');
    var projects = document.querySelectorAll('.project');

    filterButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var filter = btn.dataset.filter;
            filterButtons.forEach(function (b) {
                var isActive = b === btn;
                b.classList.toggle('active', isActive);
                b.setAttribute('aria-selected', String(isActive));
            });
            projects.forEach(function (project) {
                var show = filter === 'all' || project.dataset.type === filter;
                project.classList.toggle('is-hidden', !show);
                if (show) project.classList.add('in-view');
            });
        });
    });

    // ===========================
    // PROJECT DETAIL MODAL
    // ===========================
    var modal = document.getElementById('projectModal');
    var closeBtn = document.getElementById('modalCloseBtn');
    var modalImg = document.getElementById('modalImg');
    var modalMeta = document.getElementById('modalMeta');
    var modalTitle = document.getElementById('modalTitle');
    var modalSub = document.getElementById('modalSub');
    var modalDetails = document.getElementById('modalDetails');
    var modalTags = document.getElementById('modalTags');
    var lastTrigger = null;

    // ===========================
    // IMAGE LIGHTBOX
    // ===========================
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightboxImg');
    var lightboxCap = document.getElementById('lightboxCap');
    var lightboxClose = document.getElementById('lightboxClose');
    var lightboxTrigger = null;

    function openLightbox(src, alt, caption, trigger) {
        lightboxImg.src = src;
        lightboxImg.alt = alt || '';
        lightboxCap.textContent = caption || '';
        lightboxTrigger = trigger || null;
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        lightboxClose.focus();
    }

    function closeLightbox() {
        if (!lightbox.classList.contains('active')) return false;
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        // Keep page scroll locked if the project modal is still open underneath
        if (!modal.classList.contains('active')) document.body.style.overflow = '';
        if (lightboxTrigger) lightboxTrigger.focus();
        return true;
    }

    function openModal(project, trigger) {
        var img = project.querySelector('.project-media img');
        modalImg.src = img.getAttribute('src');
        modalImg.alt = img.getAttribute('alt');
        modalMeta.innerHTML = project.querySelector('.meta-row').innerHTML;
        modalTitle.textContent = project.querySelector('.project-title').textContent;
        modalSub.textContent = project.querySelector('.project-sub').textContent;
        modalDetails.innerHTML = project.querySelector('.project-details').innerHTML;
        modalTags.innerHTML = project.querySelector('.project-content .chip-row').innerHTML;

        lastTrigger = trigger;
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        closeBtn.focus();
    }

    function closeModal() {
        if (!modal.classList.contains('active')) return;
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (lastTrigger) lastTrigger.focus();
    }

    projects.forEach(function (project) {
        var openBtn = project.querySelector('.project-open');
        openBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            openModal(project, openBtn);
        });
        // Whole card is clickable for mouse users
        project.addEventListener('click', function (e) {
            if (e.target.closest('a, button')) return;
            openModal(project, openBtn);
        });
    });

    closeBtn.addEventListener('click', closeModal);
    modal.querySelector('[data-close]').addEventListener('click', closeModal);

    // Enlarge button + click-to-preview on every project image
    projects.forEach(function (project) {
        var media = project.querySelector('.project-media');
        var img = media.querySelector('img');
        var title = project.querySelector('.project-title').textContent;

        var zoom = document.createElement('button');
        zoom.type = 'button';
        zoom.className = 'zoom-btn';
        zoom.setAttribute('aria-label', 'Enlarge image: ' + title);
        zoom.innerHTML = '<i class="fas fa-magnifying-glass-plus"></i><span>Enlarge</span>';
        media.appendChild(zoom);

        media.addEventListener('click', function (e) {
            e.stopPropagation(); // don't open the details modal
            openLightbox(img.getAttribute('src'), img.getAttribute('alt'), title, zoom);
        });
    });

    // Organization (experience) images: click to preview, same lightbox as projects
    document.querySelectorAll('.org-media').forEach(function (media) {
        var img = media.querySelector('img');
        var caption = media.getAttribute('data-caption') || img.getAttribute('alt');

        // Hide the figure if the image file is missing, so no broken icon shows
        img.addEventListener('error', function () { media.hidden = true; });

        var zoom = document.createElement('button');
        zoom.type = 'button';
        zoom.className = 'zoom-btn';
        zoom.setAttribute('aria-label', 'Enlarge image: ' + caption);
        zoom.innerHTML = '<i class="fas fa-magnifying-glass-plus"></i><span>Enlarge</span>';
        media.appendChild(zoom);

        media.addEventListener('click', function () {
            openLightbox(img.getAttribute('src'), img.getAttribute('alt'), caption, zoom);
        });
    });

    // Image inside the project details modal can be enlarged too
    var modalMedia = modal.querySelector('.modal-media');
    modalMedia.addEventListener('click', function () {
        openLightbox(modalImg.getAttribute('src'), modalImg.getAttribute('alt'), modalTitle.textContent, closeBtn);
    });

    // Close lightbox: X button, click outside the image
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
        if (e.target !== lightboxImg) closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            if (closeLightbox()) return; // ESC closes the top-most layer first
            closeModal();
            setNav(false);
        }
    });
};