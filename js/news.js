// // Simple swiper functionality for news cards
// document.addEventListener('DOMContentLoaded', function () {
//     const cardsContainer = document.getElementById('news-cards');
//     const cards = Array.from(cardsContainer.children);
//     const leftBtn = document.getElementById('news-left');
//     const rightBtn = document.getElementById('news-right');
//     let start = 0;
//     let visible = 4;

//     function updateCards() {
//         cards.forEach((card, i) => {
//             card.style.display = (i >= start && i < start + visible) ? 'flex' : 'none';
//         });
//     }

//     function checkResponsive() {
//         if (window.innerWidth <= 500) {
//             leftBtn.style.display = 'none';
//             rightBtn.style.display = 'none';
//             cards.forEach(card => card.style.display = 'flex');
//         } else {
//             if (window.innerWidth <= 900) visible = 2;
//             else visible = 4;
//             if (start + visible > cards.length) start = Math.max(0, cards.length - visible);
//             updateCards();
//         }
//     }

//     leftBtn.addEventListener('click', function () {
//         if (start > 0) {
//             start--;
//             updateCards();
//         }
//     });

//     rightBtn.addEventListener('click', function () {
//         if (start + visible < cards.length) {
//             start++;
//             updateCards();
//         }
//     });

//     window.addEventListener('resize', checkResponsive);

//     checkResponsive(); // Initial check
// });


document.addEventListener('DOMContentLoaded', function() {
    const cardsContainer = document.getElementById('news-cards');
    const cards = Array.from(cardsContainer.children);
    const paginationContainer = document.createElement('div');
    paginationContainer.className = 'news-pagination';
    cardsContainer.parentNode.insertBefore(paginationContainer, cardsContainer.nextSibling);
    
    const itemsPerPage = 16;
    let currentPage = 0;

    function showPage(page) {
        const startIndex = page * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        
        cards.forEach((card, index) => {
            card.style.display = (index >= startIndex && index < endIndex) ? 'flex' : 'none';
        });
    }

    function updatePagination() {
        const totalPages = Math.ceil(cards.length / itemsPerPage);
        paginationContainer.innerHTML = '';
        
        if (totalPages <= 1) {
            paginationContainer.style.display = 'none';
            return;
        }
        
        paginationContainer.style.display = 'flex';
        
        for (let i = 0; i < totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.textContent = i + 1;
            if (i === currentPage) {
                pageBtn.classList.add('active');
            }
            
            pageBtn.addEventListener('click', () => {
                currentPage = i;
                showPage(currentPage);
                updatePagination();
            });
            
            paginationContainer.appendChild(pageBtn);
        }
    }

    function checkResponsive() {
        if (window.innerWidth <= 500) {
            cards.forEach(card => card.style.display = 'flex');
            paginationContainer.style.display = 'none';
        } else {
            showPage(currentPage);
            updatePagination();
        }
    }

    window.addEventListener('resize', checkResponsive);
    checkResponsive();
});