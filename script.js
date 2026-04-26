document.addEventListener('DOMContentLoaded', function () {

    // ===========================
    // PROJECT CARD — KLIK UNTUK BUKA MODAL
    // ===========================
    const projectCards = document.querySelectorAll('.project-card');
    const modal        = document.getElementById('projectModal');
    const modalBox     = document.getElementById('projectModalBox');
    const closeBtn     = document.getElementById('modalCloseBtn');
    const modalImg     = document.getElementById('modalImg');
    const modalSem     = document.getElementById('modalSemester');
    const modalType    = document.getElementById('modalType');
    const modalTitle   = document.getElementById('modalTitle');
    const modalDesc    = document.getElementById('modalDesc');
    const modalTags    = document.getElementById('modalTags');

    projectCards.forEach(function (card) {
        card.addEventListener('click', function () {

            // 1. Bounce animasi pada card
            card.classList.remove('bounce');
            void card.offsetWidth; // reflow
            card.classList.add('bounce');

            // 2. Ambil data dari card
            const title    = card.dataset.title      || '';
            const semester = card.dataset.semester   || '';
            const type     = card.dataset.type       || 'web';
            const typeLabel = card.dataset.typeLabel || 'Web';
            const tags     = card.dataset.tags       || '';
            const desc     = card.dataset.desc       || '';
            const imgSrc   = card.dataset.img        || '';

            // 3. Isi modal
            modalImg.src        = imgSrc;
            modalImg.alt        = title;
            modalSem.textContent = semester;
            modalType.textContent = typeLabel;
            modalType.className  = 'badge-type ' + type;
            modalTitle.textContent = title;
            modalDesc.textContent  = desc;

            // Tags
            modalTags.innerHTML = '';
            tags.split(',').forEach(function (tag) {
                const span = document.createElement('span');
                span.className   = 'tech-tag';
                span.textContent = tag.trim();
                modalTags.appendChild(span);
            });

            // 4. Tampilkan modal setelah bounce selesai (400ms)
            setTimeout(function () {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }, 300);
        });

        // Hapus class bounce setelah animasi selesai
        card.addEventListener('animationend', function () {
            card.classList.remove('bounce');
        });
    });

    // Tutup modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeModal);

    // Klik area gelap di luar modal box = tutup
    modal.addEventListener('click', function (e) {
        if (e.target === modal) closeModal();
    });

    // ESC = tutup modal
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeModal();
    });

    // ===========================
    // SMOOTH SCROLL NAVBAR
    // ===========================
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

});