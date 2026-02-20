    (function() {
            const overlay = document.getElementById('popupOverlay');
            const closeBtn = document.getElementById('popupCloseBtn');
            const popupTitle = document.getElementById('popupTitle');
            const popupDesc = document.getElementById('popupDesc');
            const popupImage = document.getElementById('popupImage');
            const cards = document.querySelectorAll('.service-card-popup');

            function openPopup(card) {
                const title = card.querySelector('.service-name').innerText;
                const desc = card.querySelector('.service-desc').innerText;
                const imageSrc = card.querySelector('.service-icon').src;
                
                popupTitle.innerText = title;
                popupDesc.innerText = desc;  
                popupImage.src = imageSrc;
                
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }

            function closePopup() {
                overlay.classList.remove('active');
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
                if (e.key === 'Escape' && overlay.classList.contains('active')) {
                    closePopup();
                }
            });
        })();