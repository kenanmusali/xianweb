document.addEventListener('DOMContentLoaded', function() {
    const cardsContainer = document.getElementById('news-cards');
    const carouselDiv = document.querySelector('.news-carousel');
    const leftArrow = document.querySelector('.bubble[src*="left.svg"]');
    const rightArrow = document.querySelector('.bubble[src*="right.svg"]');
    
    if (!cardsContainer || !leftArrow || !rightArrow) return;
    
    let cards = Array.from(cardsContainer.children);
    let currentIndex = 0;
    let visibleCount = getVisibleCount();
    let totalCards = cards.length;
    
    let originalCards = [...cards];
    
    function getVisibleCount() {
        const width = window.innerWidth;
        if (width < 768) return 1;
        if (width >= 768 && width < 1024) return 2;
        if (width >= 1024 && width <= 1282) return 3;
        return 4;  
    }
    
    function updateCarousel() {
        while (cardsContainer.firstChild) {
            cardsContainer.removeChild(cardsContainer.firstChild);
        }
        
        const endIndex = currentIndex + visibleCount;
        
        if (endIndex <= totalCards) {
            for (let i = currentIndex; i < endIndex; i++) {
                cardsContainer.appendChild(cards[i % totalCards].cloneNode(true));
            }
        } else {
            const firstPart = cards.slice(currentIndex);
            const remainingNeeded = visibleCount - firstPart.length;
            const secondPart = cards.slice(0, remainingNeeded);
            [...firstPart, ...secondPart].forEach(card => {
                cardsContainer.appendChild(card.cloneNode(true));
            });
        }
        
        const newCards = document.querySelectorAll('#news-cards .news-card');
        newCards.forEach((card, idx) => {
            const readMoreLink = card.querySelector('.news-btn');
            if (readMoreLink) {
                const originalId = card.getAttribute('data-id') || (idx % totalCards + 1);
                readMoreLink.href = `read.html?id=${originalId}`;
            }
        });
    }
    
    function goNext() {
        currentIndex = (currentIndex + 1) % totalCards;
        updateCarousel();
    }
    
    function goPrev() {
        currentIndex = (currentIndex - 1 + totalCards) % totalCards;
        updateCarousel();
    }
    
    function handleResize() {
        const newVisibleCount = getVisibleCount();
        if (newVisibleCount !== visibleCount) {
            visibleCount = newVisibleCount;
            currentIndex = 0;
            updateCarousel();
        }
    }
    
    leftArrow.style.cursor = 'pointer';
    rightArrow.style.cursor = 'pointer';
    leftArrow.addEventListener('click', goPrev);
    rightArrow.addEventListener('click', goNext);
    
    window.addEventListener('resize', handleResize);
    
    visibleCount = getVisibleCount();
    updateCarousel();
    
    const existingPagination = document.querySelector('.news-pagination');
    if (existingPagination) {
        existingPagination.style.display = 'none';
    }
    
    let touchStartX = 0;
    let touchEndX = 0;
    
    cardsContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    cardsContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchEndX < touchStartX - 50) goNext();
        if (touchEndX > touchStartX + 50) goPrev();
    });
});