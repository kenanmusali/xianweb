document.addEventListener('DOMContentLoaded', function() {
    const videoThumbnails = document.querySelectorAll('.video-thumbnail');
    const videoModal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    const modalVideoSource = document.getElementById('modalVideoSource');
    const modalVideoTitle = document.getElementById('modalVideoTitle');  
    const closeModal = document.getElementById('closeModal');
    
    videoThumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            const videoSrc = this.getAttribute('data-video-src');
            const videoTitle = this.nextElementSibling.textContent; 
            
            modalVideoSource.src = videoSrc;
            modalVideo.load();
            modalVideo.play();
            
            modalVideoTitle.textContent = videoTitle;  
            
            videoModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    function closeVideoModal() {
        videoModal.classList.remove('active');
        modalVideo.pause();
        modalVideo.currentTime = 0;
        document.body.style.overflow = 'auto';
    }
    
    closeModal.addEventListener('click', closeVideoModal);
    
    videoModal.addEventListener('click', function(e) {
        if (e.target === videoModal) {
            closeVideoModal();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && videoModal.classList.contains('active')) {
            closeVideoModal();
        }
    });
});
