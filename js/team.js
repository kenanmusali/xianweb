document.addEventListener('DOMContentLoaded', function() {
  const servicesGrid = document.querySelector('.services-grid');
  const teamCards = document.querySelectorAll('.ourteam-card');
  const leftButton = document.querySelector('.CaruselTeam img[src*="left.svg"]');
  const rightButton = document.querySelector('.CaruselTeam img[src*="right.svg"]');

  let currentPosition = 0;
  let cardsToShow = 3;
  const totalCards = teamCards.length;

  function updateLayout() {
    const width = window.innerWidth;
    if (width < 600) {
      cardsToShow = 1;
    } else if (width < 1024) {
      cardsToShow = 2;
    } else {
      cardsToShow = 3;
    }

    if (servicesGrid) {
      servicesGrid.style.gridTemplateColumns = `repeat(${cardsToShow}, 1fr)`;
    }
  }

  function updateCarousel() {
    updateLayout(); 
    teamCards.forEach((card, index) => {
      if (index >= currentPosition && index < currentPosition + cardsToShow) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }

  updateCarousel();

  rightButton.addEventListener('click', function() {
    if (currentPosition + cardsToShow < totalCards) {
      currentPosition++;
      updateCarousel();
    }
  });

  leftButton.addEventListener('click', function() {
    if (currentPosition > 0) {
      currentPosition--;
      updateCarousel();
    }
  });

  window.addEventListener('resize', updateCarousel);
});
