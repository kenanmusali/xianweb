document.addEventListener('DOMContentLoaded', function () {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightboxModal = document.getElementById('lightbox-modal');
    const subgalleryModal = document.getElementById('subgallery-modal');

    let currentZoom = 1;
    let currentGalleryIndex = null;
    let currentSubGallery = [];
    let currentImageIndex = 0;

    const subGalleries = {
        1: [
            { src: 'img/foto/1/img1.jpg', },
            { src: 'img/foto/1/img2.jpg', },
            { src: 'img/foto/1/img3.jpeg', },
            { src: 'img/foto/1/img4.jpeg', },
            { src: 'img/foto/1/img5.jpeg', },
            { src: 'img/foto/1/img6.jpeg', },

        ],
        2: [
            { src: 'img/foto/2/img1.jpeg', },
            { src: 'img/foto/2/img2.jpeg', },
            { src: 'img/foto/2/img3.jpeg', },
            { src: 'img/foto/2/img4.jpeg', },
            { src: 'img/foto/2/img5.jpeg', },
            { src: 'img/foto/2/img6.jpeg', },

        ]
    };


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

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function () {
            const imgIndex = index + 1;
            currentGalleryIndex = imgIndex;

            if (subGalleries[imgIndex]) {
                showSubGallery(imgIndex);
            } else {
                const img = this.querySelector('img');
                const caption = this.querySelector('p').textContent;
                currentSubGallery = [{ src: img.src, alt: img.alt, caption: caption }];
                currentImageIndex = 0;
                openLightbox(currentImageIndex);
            }
        });
    });

    function showSubGallery(galleryIndex) {
        subgalleryGrid.innerHTML = '';

        document.querySelector('.subgallery-title').textContent = `Gallery ${galleryIndex} - ${subGalleries[galleryIndex].length} Images`;

        subGalleries[galleryIndex].forEach((imgData, index) => {
            const subItem = document.createElement('div');
            subItem.className = 'subgallery-item';

            const img = document.createElement('img');
            img.src = imgData.src;
            img.alt = imgData.alt;

            const caption = document.createElement('p');
            caption.textContent = imgData.caption;

            subItem.appendChild(img);
            subItem.appendChild(caption);

            subItem.addEventListener('click', function () {
                currentSubGallery = subGalleries[galleryIndex];
                currentImageIndex = index;

                subgalleryModal.style.display = 'none';
                openLightbox(currentImageIndex);
            });

            subgalleryGrid.appendChild(subItem);
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
        if (currentGalleryIndex && subGalleries[currentGalleryIndex]) {
            showSubGallery(currentGalleryIndex);
        }
    });

    prevBtn.addEventListener('click', showPrevImage);
    nextBtn.addEventListener('click', showNextImage);

    subgalleryModal.querySelector('.subgallery-close-btn').addEventListener('click', function () {
        subgalleryModal.style.display = 'none';
        currentGalleryIndex = null;
    });

    [lightboxModal, subgalleryModal].forEach(modal => {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                modal.style.display = 'none';
                if (modal === subgalleryModal) {
                    currentGalleryIndex = null;
                }
            }
        });
    });

    document.addEventListener('keydown', function (e) {
        if (lightboxModal.style.display === 'flex') {
            if (e.key === 'Escape') {
                lightboxModal.style.display = 'none';
                if (currentGalleryIndex && subGalleries[currentGalleryIndex]) {
                    showSubGallery(currentGalleryIndex);
                }
            }
            if (e.key === 'ArrowRight') {
                showNextImage();
            }
            if (e.key === 'ArrowLeft') {
                showPrevImage();
            }
            if (e.key === '+') {
                currentZoom += 0.1;
                lightboxImg.style.transform = `scale(${currentZoom})`;
            }
            if (e.key === '-') {
                if (currentZoom > 0.2) {
                    currentZoom -= 0.1;
                    lightboxImg.style.transform = `scale(${currentZoom})`;
                }
            }
        } else if (subgalleryModal.style.display === 'flex') {
            if (e.key === 'Escape') {
                subgalleryModal.style.display = 'none';
                currentGalleryIndex = null;
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