    (function() {
            const overlay = document.getElementById('popupOverlay');
            const closeBtn = document.getElementById('popupCloseBtn');
            const popupTitle = document.getElementById('popupTitle');
            const popupDesc = document.getElementById('popupDesc');
            const cards = document.querySelectorAll('.service-card');

            function openPopup(card) {
                const title = card.querySelector('.service-name').innerText;
                const desc = card.querySelector('.service-desc').innerText;
                
                popupTitle.innerText = title;
                popupDesc.innerText = desc;  
                
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