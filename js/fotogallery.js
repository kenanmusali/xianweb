document.addEventListener('DOMContentLoaded', function () {
    let galleryItems = document.querySelectorAll('.gallery-item');
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

    // YouTube helper functions
    function isYouTubeUrl(url) {
        if (!url) return false;
        return url.includes('youtube.com') || url.includes('youtu.be');
    }

    function extractVideoId(url) {
        if (!url) return null;
        let videoId = '';
        if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1].split('?')[0];
        } else if (url.includes('youtube.com/watch')) {
            const urlParams = new URLSearchParams(url.split('?')[1]);
            videoId = urlParams.get('v');
        } else if (url.includes('embed/')) {
            videoId = url.split('embed/')[1].split('?')[0];
        }
        return videoId;
    }

    function getYouTubeThumbnailUrl(url) {
        const videoId = extractVideoId(url);
        if (!videoId) return null;
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }

    function getYouTubeEmbedUrl(url) {
        const videoId = extractVideoId(url);
        if (!videoId) return '';
        const origin = encodeURIComponent(window.location.origin || '*');
        return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&enablejsapi=1&origin=${origin}&rel=0`;
    }

    // Function to setup video gallery item (auto thumbnail + play button)
    function setupVideoGalleryItem(galleryItem) {
        const videoUrl = galleryItem.getAttribute('data-videourl');
        if (!videoUrl || videoUrl.trim() === '') return false;
        
        const imgWrapper = galleryItem.querySelector('.img-wrapper');
        if (!imgWrapper) return false;
        
        // Remove existing img if any (to use auto-generated one)
        const existingImg = imgWrapper.querySelector('img');
        
        // Auto-generate YouTube thumbnail
        const thumbnailUrl = getYouTubeThumbnailUrl(videoUrl);
        if (thumbnailUrl) {
            if (existingImg) {
                existingImg.src = thumbnailUrl;
            } else {
                const newImg = document.createElement('img');
                newImg.src = thumbnailUrl;
                newImg.alt = galleryItem.querySelector('.gallery-item-content p')?.textContent || 'Video thumbnail';
                newImg.style.width = '100%';
                newImg.style.height = '100%';
                newImg.style.objectFit = 'cover';
                imgWrapper.insertBefore(newImg, imgWrapper.firstChild);
            }
        }
        
        // Add play button overlay if not exists
        if (!imgWrapper.querySelector('.video-play-overlay')) {
            const playOverlay = document.createElement('div');
            playOverlay.className = 'video-play-overlay';
            playOverlay.innerHTML = `
                <svg class="play-icon" viewBox="0 0 24 24" width="56" height="56" fill="white">
                    <path d="M8 5v14l11-7z"/>
                </svg>
            `;
            playOverlay.style.position = 'absolute';
            playOverlay.style.top = '0';
            playOverlay.style.left = '0';
            playOverlay.style.width = '100%';
            playOverlay.style.height = '100%';
            playOverlay.style.display = 'flex';
            playOverlay.style.alignItems = 'center';
            playOverlay.style.justifyContent = 'center';
            playOverlay.style.backgroundColor = 'rgba(0,0,0,0.3)';
            playOverlay.style.borderRadius = 'inherit';
            playOverlay.style.cursor = 'pointer';
            playOverlay.style.pointerEvents = 'none';
            playOverlay.style.transition = 'background-color 0.2s ease';
            
            const playSvg = playOverlay.querySelector('.play-icon');
            playSvg.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))';
            
            imgWrapper.style.position = 'relative';
            imgWrapper.appendChild(playOverlay);
        }
        
        return true;
    }

    // Process all video gallery items
    function processAllGalleryItems() {
        galleryItems.forEach(item => {
            const videoUrl = item.getAttribute('data-videourl');
            if (videoUrl && videoUrl.trim() !== '') {
                setupVideoGalleryItem(item);
            }
        });
    }

    // Fix: Re-attach click events properly
    function attachClickEvents() {
        galleryItems.forEach((item) => {
            // Remove old listener by cloning and replacing (clean approach)
            const newItem = item.cloneNode(true);
            if (item.parentNode) {
                item.parentNode.replaceChild(newItem, item);
            }
            
            newItem.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                
                const videoUrl = this.getAttribute('data-videourl');
                const img = this.querySelector('.img-wrapper img');
                const captionElem = this.querySelector('.gallery-item-content p');
                const caption = captionElem ? captionElem.textContent : '';
                
                // Handle video items
                if (videoUrl && videoUrl.trim() !== '') {
                    currentSubGallery = [{
                        src: videoUrl,
                        alt: img ? img.alt : caption,
                        caption: caption,
                        isVideo: true
                    }];
                    currentImageIndex = 0;
                    openLightbox(currentImageIndex);
                    return;
                }
                
                // Handle gallery items with subgallery
                const galleryTitle = this.getAttribute('data-gallery-title');
                currentGallery = this;
                const subgalleryData = this.querySelector('.subgallery-data');
                
                if (subgalleryData && subgalleryData.children.length > 0) {
                    showSubGallery(this, galleryTitle);
                } else if (img) {
                    // Handle single image items
                    currentSubGallery = [{
                        src: img.src,
                        alt: img.alt,
                        caption: caption,
                        isVideo: false
                    }];
                    currentImageIndex = 0;
                    openLightbox(currentImageIndex);
                }
            });
        });
        
        // Update galleryItems reference
        galleryItems = document.querySelectorAll('.gallery-item');
    }

    function showSubGallery(galleryItem, galleryTitle) {
        subgalleryGrid.innerHTML = '';

        const subgalleryData = galleryItem.querySelector('.subgallery-data');
        const subItems = subgalleryData.querySelectorAll('.subgallery-item');

        document.querySelector('.subgallery-title').textContent =
            `${galleryTitle} - ${subItems.length} items`;

        subItems.forEach((subItem, index) => {
            let imgSrc = subItem.getAttribute('data-src');
            const imgCaption = subItem.getAttribute('data-caption');
            const imgAlt = subItem.getAttribute('data-alt') || `Item ${index + 1}`;
            const isVideo = isYouTubeUrl(imgSrc);
            
            // For video items, use YouTube thumbnail
            let displaySrc = imgSrc;
            if (isVideo) {
                const thumbnailUrl = getYouTubeThumbnailUrl(imgSrc);
                displaySrc = thumbnailUrl || imgSrc;
            }

            const subItemElement = document.createElement('div');
            subItemElement.className = 'subgallery-item';
            subItemElement.style.cursor = 'pointer';
            subItemElement.style.position = 'relative';
            subItemElement.style.marginBottom = '20px';
            
            // Create image wrapper
            const imgWrapper = document.createElement('div');
            imgWrapper.style.position = 'relative';
            imgWrapper.style.width = '100%';
            imgWrapper.style.aspectRatio = '16/9';
            imgWrapper.style.overflow = 'hidden';
            imgWrapper.style.borderRadius = '8px';
            imgWrapper.style.backgroundColor = '#f0f0f0';
            
            const img = document.createElement('img');
            img.src = displaySrc;
            img.alt = imgAlt;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            img.style.display = 'block';
            
            // Handle image load error
            if (isVideo && !thumbnailUrl) {
                img.onerror = function() {
                    const videoId = extractVideoId(imgSrc);
                    if (videoId) {
                        this.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                    }
                };
            }
            
            imgWrapper.appendChild(img);
            
            // Add play button overlay for video items
            if (isVideo) {
                const playOverlay = document.createElement('div');
                playOverlay.innerHTML = `
                    <svg viewBox="0 0 24 24" width="48" height="48" fill="white">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                `;
                playOverlay.style.position = 'absolute';
                playOverlay.style.top = '0';
                playOverlay.style.left = '0';
                playOverlay.style.width = '100%';
                playOverlay.style.height = '100%';
                playOverlay.style.display = 'flex';
                playOverlay.style.alignItems = 'center';
                playOverlay.style.justifyContent = 'center';
                playOverlay.style.backgroundColor = 'rgba(0,0,0,0.3)';
                playOverlay.style.borderRadius = '8px';
                playOverlay.style.pointerEvents = 'none';
                
                imgWrapper.appendChild(playOverlay);
            }
            
            subItemElement.appendChild(imgWrapper);
            
            const caption = document.createElement('p');
            caption.textContent = imgCaption;
            caption.style.marginTop = '8px';
            caption.style.fontSize = '14px';
            caption.style.color = '#666';
            subItemElement.appendChild(caption);

            subItemElement.addEventListener('click', function () {
                currentSubGallery = Array.from(subItems).map(item => ({
                    src: item.getAttribute('data-src'),
                    alt: item.getAttribute('data-alt') || '',
                    caption: item.getAttribute('data-caption') || '',
                    isVideo: isYouTubeUrl(item.getAttribute('data-src'))
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
        const isVideo = imgData.isVideo || isYouTubeUrl(imgData.src);

        // Remove existing video iframe
        const existingVideo = document.getElementById('youtube-video');
        if (existingVideo) {
            existingVideo.remove();
        }

        const lightboxBody = lightboxModal.querySelector('.lightbox-body');

        if (isVideo) {
            lightboxImg.style.display = 'none';
            const videoEmbed = getYouTubeEmbedUrl(imgData.src);
            const videoElement = document.createElement('iframe');
            videoElement.id = 'youtube-video';
            videoElement.src = videoEmbed;
            videoElement.setAttribute('frameborder', '0');
            videoElement.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
            videoElement.setAttribute('allowfullscreen', 'true');
            videoElement.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');

            lightboxBody.style.position = 'relative';
            lightboxBody.style.minHeight = '400px';
            videoElement.style.position = 'absolute';
            videoElement.style.top = '0';
            videoElement.style.left = '0';
            videoElement.style.width = '100%';
            videoElement.style.height = '100%';
            videoElement.style.border = 'none';

            lightboxBody.appendChild(videoElement);
            zoomInBtn.style.display = 'none';
            zoomOutBtn.style.display = 'none';
            downloadBtn.style.display = 'none';
        } else {
            lightboxBody.style.position = '';
            lightboxBody.style.minHeight = '';
            lightboxImg.style.display = 'block';
            lightboxImg.src = imgData.src;
            lightboxImg.alt = imgData.alt;
            zoomInBtn.style.display = 'flex';
            zoomOutBtn.style.display = 'flex';
            downloadBtn.style.display = 'flex';
        }

        lightboxCaption.textContent = imgData.caption;
        currentImgNum.textContent = index + 1;
        totalImg.textContent = currentSubGallery.length;
        prevBtn.style.display = currentSubGallery.length > 1 ? 'flex' : 'none';
        nextBtn.style.display = currentSubGallery.length > 1 ? 'flex' : 'none';
        lightboxModal.style.display = 'flex';
        currentZoom = 1;
        if (!isVideo) lightboxImg.style.transform = `scale(${currentZoom})`;
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
        const video = document.getElementById('youtube-video');
        if (video) video.remove();
    });

    prevBtn.addEventListener('click', showPrevImage);
    nextBtn.addEventListener('click', showNextImage);

    const subgalleryCloseBtn = subgalleryModal.querySelector('.subgallery-close-btn');
    if (subgalleryCloseBtn) {
        subgalleryCloseBtn.addEventListener('click', function () {
            subgalleryModal.style.display = 'none';
            currentGallery = null;
        });
    }

    [lightboxModal, subgalleryModal].forEach(modal => {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                modal.style.display = 'none';
                const video = document.getElementById('youtube-video');
                if (video) video.remove();
                if (modal === subgalleryModal) {
                    currentGallery = null;
                }
            }
        });
    });

    document.addEventListener('keydown', function (e) {
        if (lightboxModal.style.display === 'flex') {
            switch (e.key) {
                case 'Escape':
                    lightboxModal.style.display = 'none';
                    const video = document.getElementById('youtube-video');
                    if (video) video.remove();
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

    // Initialize everything
    processAllGalleryItems();
    attachClickEvents();
});