// Video Collection JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const thumbnailsWrapper = document.getElementById('thumbnailsWrapper');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const mainVideo = document.getElementById('mainVideo');
    const videoTitle = document.getElementById('videoTitle');
    const videoDescription = document.getElementById('videoDescription');
    
    let currentIndex = 0;
    let thumbnailWidth = 300; // 280px + 20px gap
    let visibleThumbnails = 4;
    
    // Calculate visible thumbnails based on screen size
    function calculateVisibleThumbnails() {
        const containerWidth = document.querySelector('.thumbnails-container').offsetWidth;
        const screenWidth = window.innerWidth;
        
        if (screenWidth <= 480) {
            thumbnailWidth = 195; // 180px + 15px gap
            visibleThumbnails = Math.floor(containerWidth / thumbnailWidth);
        } else if (screenWidth <= 640) {
            thumbnailWidth = 215; // 200px + 15px gap
            visibleThumbnails = Math.floor(containerWidth / thumbnailWidth);
        } else if (screenWidth <= 768) {
            thumbnailWidth = 235; // 220px + 15px gap
            visibleThumbnails = Math.floor(containerWidth / thumbnailWidth);
        } else if (screenWidth <= 1024) {
            thumbnailWidth = 270; // 250px + 20px gap
            visibleThumbnails = Math.floor(containerWidth / thumbnailWidth);
        } else {
            thumbnailWidth = 300; // 280px + 20px gap
            visibleThumbnails = Math.floor(containerWidth / thumbnailWidth);
        }
        
        // Ensure at least 1 thumbnail is visible
        visibleThumbnails = Math.max(1, visibleThumbnails);
    }
    
    // Get all thumbnails
    const thumbnails = document.querySelectorAll('.video-thumbnail');
    const totalThumbnails = thumbnails.length;
    
    // Update navigation buttons state
    function updateNavButtons() {
        const maxIndex = Math.max(0, totalThumbnails - visibleThumbnails);
        
        prevBtn.disabled = currentIndex <= 0;
        nextBtn.disabled = currentIndex >= maxIndex;
    }
    
    // Update carousel position
    function updateCarousel() {
        calculateVisibleThumbnails();
        const translateX = -(currentIndex * thumbnailWidth);
        thumbnailsWrapper.style.transform = `translateX(${translateX}px)`;
        updateNavButtons();
    }
    
    // Previous button click
    prevBtn.addEventListener('click', function() {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });
    
    // Next button click
    nextBtn.addEventListener('click', function() {
        const maxIndex = Math.max(0, totalThumbnails - visibleThumbnails);
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateCarousel();
        }
    });
    
    // Thumbnail click handlers
    thumbnails.forEach(function(thumbnail) {
        thumbnail.addEventListener('click', function() {
            // Remove active class from all thumbnails
            thumbnails.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked thumbnail
            this.classList.add('active');
            
            // Get video data
            const videoId = this.getAttribute('data-video-id');
            const title = this.getAttribute('data-title');
            const description = this.getAttribute('data-description');
            
            // Update main video
            mainVideo.src = `https://www.youtube.com/embed/${videoId}`;
            videoTitle.textContent = title;
            videoDescription.textContent = description;
            
            // Smooth scroll to main video
            document.querySelector('.main-video-section').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        // Reset current index if it exceeds new limits
        calculateVisibleThumbnails();
        const maxIndex = Math.max(0, totalThumbnails - visibleThumbnails);
        if (currentIndex > maxIndex) {
            currentIndex = maxIndex;
        }
        updateCarousel();
    });
    
    // Initialize
    updateCarousel();
    
    // Touch/swipe support for mobile
    let startX = 0;
    let endX = 0;
    
    thumbnailsWrapper.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
    });
    
    thumbnailsWrapper.addEventListener('touchend', function(e) {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next
                nextBtn.click();
            } else {
                // Swipe right - previous
                prevBtn.click();
            }
        }
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            prevBtn.click();
        } else if (e.key === 'ArrowRight') {
            nextBtn.click();
        }
    });
});