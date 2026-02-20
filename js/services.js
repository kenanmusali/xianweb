(function() {
    const overlay = document.getElementById('popupOverlay');
    const closeBtn = document.getElementById('popupCloseBtn');
    const popupTitle = document.getElementById('popupTitle');
    const popupDesc = document.getElementById('popupDesc');
    const popupImage = document.getElementById('popupImage');
    const cards = document.querySelectorAll('.service-card-popup');

    let isPopupOpen = false;

    function openPopup(card) {
        const title = card.querySelector('.service-name').innerText;
        const desc = card.querySelector('.service-desc').innerText;
        const imageSrc = card.querySelector('.service-icon').src;
        
        popupTitle.innerText = title;
        popupDesc.innerText = desc;  
        popupImage.src = imageSrc;
        
        overlay.classList.add('active');
        isPopupOpen = true;

    }

    function closePopup() {
        overlay.classList.remove('active');
        isPopupOpen = false;
        document.body.style.overflow = '';
    }

    cards.forEach(card => {
        card.addEventListener('click', () => openPopup(card));
    });

    closeBtn.addEventListener('click', closePopup);

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closePopup();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isPopupOpen) {
            closePopup();
        }
    });

    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', (e) => {
        if (!isPopupOpen) return;

        const popupRect = overlay.getBoundingClientRect();
        const descRect = popupDesc.getBoundingClientRect();

        if (!(descRect.top <= 0 && descRect.bottom >= window.innerHeight)) {
            if (window.scrollY !== lastScrollY) {
                closePopup();
            }
        }

        lastScrollY = window.scrollY;
    });

})();