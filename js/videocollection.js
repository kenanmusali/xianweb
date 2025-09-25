document.addEventListener('DOMContentLoaded', function() {
    const thumbnailsWrapper = document.getElementById('thumbnailsWrapper');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const mainVideo = document.getElementById('mainVideo');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    const currentTimeDisplay = document.getElementById('currentTime');
    const durationDisplay = document.getElementById('duration');
    const progressBar = document.getElementById('progressBar');
    const progressContainer = document.querySelector('.progress-container');
    
    let thumbnailWidth = 300; 
    let visibleThumbnails = 4;
    let currentIndex = 0;
    
    let isDraggingProgress = false;

    function togglePlayPause() {
        if (mainVideo.paused) {
            mainVideo.play();
            playPauseBtn.textContent = '⏸';
        } else {
            mainVideo.pause();
            playPauseBtn.textContent = '▶';
        }
    }
    
    function updateVolume() {
        mainVideo.volume = volumeSlider.value;
    }
    
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    function updateTimeDisplay() {
        currentTimeDisplay.textContent = formatTime(mainVideo.currentTime);
        durationDisplay.textContent = formatTime(mainVideo.duration);
    }
    
    function updateProgressBar() {
        if (!isDraggingProgress && !isNaN(mainVideo.duration)) {
            const progress = (mainVideo.currentTime / mainVideo.duration) * 100;
            progressBar.style.width = progress + '%';
        }
    }
    
    function seekVideo(e) {
        const rect = progressContainer.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        mainVideo.currentTime = pos * mainVideo.duration;
    }

    // Initialize video controls
    playPauseBtn.addEventListener('click', togglePlayPause);
    volumeSlider.addEventListener('input', updateVolume);
    
    mainVideo.addEventListener('timeupdate', function() {
        updateTimeDisplay();
        updateProgressBar();
    });
    
    mainVideo.addEventListener('loadedmetadata', function() {
        updateTimeDisplay();
    });
    
    mainVideo.addEventListener('play', function() {
        playPauseBtn.textContent = '⏸';
    });
    
    mainVideo.addEventListener('pause', function() {
        playPauseBtn.textContent = '▶';
    });

    progressContainer.addEventListener('click', seekVideo);
    
    progressContainer.addEventListener('mousedown', function() {
        isDraggingProgress = true;
    });
    
    document.addEventListener('mousemove', function(e) {
        if (isDraggingProgress) {
            seekVideo(e);
        }
    });
    
    document.addEventListener('mouseup', function() {
        isDraggingProgress = false;
    });
    
    progressContainer.addEventListener('touchstart', function() {
        isDraggingProgress = true;
    });
    
    progressContainer.addEventListener('touchmove', function(e) {
        if (isDraggingProgress) {
            seekVideo(e.touches[0]);
        }
    });
    
    progressContainer.addEventListener('touchend', function() {
        isDraggingProgress = false;
    });
    
    mainVideo.muted = true;
    mainVideo.play().then(() => {
        mainVideo.muted = false;
    }).catch(error => {
        console.log('Autoplay prevented:', error);
    });
    
    function calculateVisibleThumbnails() {
        const screenWidth = window.innerWidth;
        
        if (screenWidth <= 480) {
            thumbnailWidth = 200;
        } else if (screenWidth <= 640) {
            thumbnailWidth = 220;
        } else if (screenWidth <= 768) {
            thumbnailWidth = 240;
        } else if (screenWidth <= 825) {
            thumbnailWidth = 220;
        } else if (screenWidth <= 1024) {
            thumbnailWidth = 250;
        } else if (screenWidth <= 1134) {
            thumbnailWidth = 270;
        } else {
            thumbnailWidth = 300;
        }
        
        const containerWidth = document.querySelector('.thumbnails-container').offsetWidth;
        visibleThumbnails = Math.floor(containerWidth / thumbnailWidth);
        visibleThumbnails = Math.max(1, visibleThumbnails);
    }
    
    const thumbnails = document.querySelectorAll('.video-thumbnail');
    const totalThumbnails = thumbnails.length;
    
    function updateNavButtons() {
        const maxIndex = Math.max(0, totalThumbnails - visibleThumbnails);
        prevBtn.disabled = currentIndex <= 0;
        nextBtn.disabled = currentIndex >= maxIndex;
    }
    
    function updateCarousel() {
        calculateVisibleThumbnails();
        const translateX = -(currentIndex * thumbnailWidth);
        thumbnailsWrapper.style.transform = `translateX(${translateX}px)`;
        updateNavButtons();
    }
    
    prevBtn.addEventListener('click', function() {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });
    
    nextBtn.addEventListener('click', function() {
        const maxIndex = Math.max(0, totalThumbnails - visibleThumbnails);
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateCarousel();
        }
    });
    
    thumbnails.forEach(function(thumbnail) {
        thumbnail.addEventListener('click', function() {
            thumbnails.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const videoSrc = this.getAttribute('data-video-src');
            mainVideo.src = videoSrc;
            mainVideo.load();
            mainVideo.play().catch(error => {
                console.log('Play prevented:', error);
            });
            
            mainVideo.addEventListener('loadedmetadata', function() {
                updateTimeDisplay();
            }, { once: true });
        });
    });
    
    window.addEventListener('resize', function() {
        calculateVisibleThumbnails();
        const maxIndex = Math.max(0, totalThumbnails - visibleThumbnails);
        if (currentIndex > maxIndex) {
            currentIndex = maxIndex;
        }
        updateCarousel();
    });
    
    updateCarousel();
    
    let startX = 0;
    let endX = 0;
    
    thumbnailsWrapper.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
    });
    
    thumbnailsWrapper.addEventListener('touchend', function(e) {
        endX = e.changedTouches[0].clientX;
        const swipeThreshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) nextBtn.click();
            else prevBtn.click();
        }
    });
});