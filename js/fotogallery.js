document.addEventListener('DOMContentLoaded', function () {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightboxModal = document.getElementById('lightbox-modal');
    const subgalleryModal = document.getElementById('subgallery-modal');

    let currentZoom = 1;
    let currentGallery = null;
    let currentSubGallery = [];
    let currentImageIndex = 0;

    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const subgalleryGrid = document.getElementById('subgallery-grid');
    const zoomInBtn = document.querySelector('.zoom-in');
    const zoomOutBtn = document.querySelector('.zoom-out');
    const downloadBtn = document.querySelector('.download-btn');
    const closeBtn = document.querySelector('.close-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const currentImgNum = document.getElementById('current-img-num');
    const totalImg = document.getElementById('total-img');

    galleryItems.forEach((item) => {
        item.addEventListener('click', function () {
            const galleryTitle = this.getAttribute('data-gallery-title');
            const subGalleryId = this.getAttribute('data-subgallery');
            currentGallery = this;
            
            const subgalleryData = this.querySelector('.subgallery-data');
            
            if (subgalleryData) {
                showSubGallery(this, galleryTitle);
            } else {
                const img = this.querySelector('img');
                const caption = this.querySelector('p').textContent;
                currentSubGallery = [{ 
                    src: img.src, 
                    alt: img.alt, 
                    caption: caption 
                }];
                currentImageIndex = 0;
                openLightbox(currentImageIndex);
            }
        });
    });

    function showSubGallery(galleryItem, galleryTitle) {
        subgalleryGrid.innerHTML = '';
        
        const subgalleryData = galleryItem.querySelector('.subgallery-data');
        const subItems = subgalleryData.querySelectorAll('.subgallery-item');
        
        document.querySelector('.subgallery-title').textContent = 
            `${galleryTitle} - ${subItems.length} Images`;
        
        subItems.forEach((subItem, index) => {
            const imgSrc = subItem.getAttribute('data-src');
            const imgCaption = subItem.getAttribute('data-caption');
            const imgAlt = subItem.getAttribute('data-alt') || `Image ${index + 1}`;
            
            const subItemElement = document.createElement('div');
            subItemElement.className = 'subgallery-item';
            
            const img = document.createElement('img');
            img.src = imgSrc;
            img.alt = imgAlt;
            
            const caption = document.createElement('p');
            caption.textContent = imgCaption;
            
            subItemElement.appendChild(img);
            subItemElement.appendChild(caption);
            
            subItemElement.addEventListener('click', function () {
                currentSubGallery = Array.from(subItems).map(item => ({
                    src: item.getAttribute('data-src'),
                    alt: item.getAttribute('data-alt') || '',
                    caption: item.getAttribute('data-caption') || ''
                }));
                
                currentImageIndex = index;
                
                subgalleryModal.style.display = 'none';
                openLightbox(currentImageIndex);
            });
            
            subgalleryGrid.appendChild(subItemElement);
        });
        
        subgalleryModal.style.display = 'flex';
    }

    function openLightbox(index) {
        if (!currentSubGallery || !currentSubGallery[index]) return;

        const imgData = currentSubGallery[index];
        lightboxImg.src = imgData.src;
        lightboxImg.alt = imgData.alt;
        lightboxCaption.textContent = imgData.caption;

        currentImgNum.textContent = index + 1;
        totalImg.textContent = currentSubGallery.length;

        prevBtn.style.display = currentSubGallery.length > 1 ? 'flex' : 'none';
        nextBtn.style.display = currentSubGallery.length > 1 ? 'flex' : 'none';

        lightboxModal.style.display = 'flex';

        currentZoom = 1;
        lightboxImg.style.transform = `scale(${currentZoom})`;
    }

    function showNextImage() {
        if (currentSubGallery && currentSubGallery.length > 1) {
            currentImageIndex = (currentImageIndex + 1) % currentSubGallery.length;
            openLightbox(currentImageIndex);
        }
    }

    function showPrevImage() {
        if (currentSubGallery && currentSubGallery.length > 1) {
            currentImageIndex = (currentImageIndex - 1 + currentSubGallery.length) % currentSubGallery.length;
            openLightbox(currentImageIndex);
        }
    }

    zoomInBtn.addEventListener('click', function () {
        currentZoom += 0.1;
        lightboxImg.style.transform = `scale(${currentZoom})`;
    });

    zoomOutBtn.addEventListener('click', function () {
        if (currentZoom > 0.2) {
            currentZoom -= 0.1;
            lightboxImg.style.transform = `scale(${currentZoom})`;
        }
    });

    downloadBtn.addEventListener('click', function () {
        const link = document.createElement('a');
        link.href = lightboxImg.src;
        link.download = lightboxImg.alt + '.png';
        link.click();
    });

    closeBtn.addEventListener('click', function () {
        lightboxModal.style.display = 'none';
        if (currentGallery) {
            const galleryTitle = currentGallery.getAttribute('data-gallery-title');
            showSubGallery(currentGallery, galleryTitle);
        }
    });

    prevBtn.addEventListener('click', showPrevImage);
    nextBtn.addEventListener('click', showNextImage);

    subgalleryModal.querySelector('.subgallery-close-btn').addEventListener('click', function () {
        subgalleryModal.style.display = 'none';
        currentGallery = null;
    });

    [lightboxModal, subgalleryModal].forEach(modal => {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                modal.style.display = 'none';
                if (modal === subgalleryModal) {
                    currentGallery = null;
                }
            }
        });
    });

    document.addEventListener('keydown', function (e) {
        if (lightboxModal.style.display === 'flex') {
            switch(e.key) {
                case 'Escape':
                    lightboxModal.style.display = 'none';
                    if (currentGallery) {
                        const galleryTitle = currentGallery.getAttribute('data-gallery-title');
                        showSubGallery(currentGallery, galleryTitle);
                    }
                    break;
                case 'ArrowRight':
                    showNextImage();
                    break;
                case 'ArrowLeft':
                    showPrevImage();
                    break;
                case '+':
                    currentZoom += 0.1;
                    lightboxImg.style.transform = `scale(${currentZoom})`;
                    break;
                case '-':
                    if (currentZoom > 0.2) {
                        currentZoom -= 0.1;
                        lightboxImg.style.transform = `scale(${currentZoom})`;
                    }
                    break;
            }
        } else if (subgalleryModal.style.display === 'flex') {
            if (e.key === 'Escape') {
                subgalleryModal.style.display = 'none';
                currentGallery = null;
            }
        }
    });

    let touchStartX = 0;
    let touchEndX = 0;

    lightboxModal.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].screenX;
    });

    lightboxModal.addEventListener('touchend', function (e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;

        if (touchEndX < touchStartX - swipeThreshold) {
            showNextImage();
        }

        if (touchEndX > touchStartX + swipeThreshold) {
            showPrevImage();
        }
    }
});