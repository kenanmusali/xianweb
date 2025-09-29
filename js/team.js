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

    updateButtonOpacity();
  }

function updateButtonOpacity() {
  const width = window.innerWidth;
  
  if (width >= 1024) {
    if (totalCards <= 3) {
      leftButton.style.opacity = '0';
      rightButton.style.opacity = '0';
      leftButton.style.pointerEvents = 'none';
      rightButton.style.pointerEvents = 'none';
    } else {
      leftButton.style.opacity = '1';
      rightButton.style.opacity = '1';
      leftButton.style.pointerEvents = currentPosition === 0 ? 'none' : 'auto';
      rightButton.style.pointerEvents = (currentPosition + cardsToShow >= totalCards) ? 'none' : 'auto';
    }
  } else {
    leftButton.style.opacity = '1';
    rightButton.style.opacity = '1';
    leftButton.style.pointerEvents = currentPosition === 0 ? 'none' : 'auto';
    rightButton.style.pointerEvents = (currentPosition + cardsToShow >= totalCards) ? 'none' : 'auto';
  }
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

  const qrButtons = document.querySelectorAll('.qr');
  
  qrButtons.forEach((qrButton) => {
    qrButton.addEventListener('click', function() {
      const teamCard = this.closest('.ourteam-card');
      const teamImage = teamCard.querySelector('.Team');
      const currentQrButton = teamCard.querySelector('.qr');
      
      if (currentQrButton.src.includes('close-box-outline.svg')) {
        const currentSrc = teamImage.src;
        const baseName = currentSrc.split('/').pop();  
        const originalFileName = baseName.replace('qr-', ''); 
        const originalPath = currentSrc.replace('/qr-', '/').replace('qr-', '');
        teamImage.src = originalPath.replace(baseName, originalFileName);
        currentQrButton.src = "./svg/qr.svg";
      } else {
        // Switch to QR code
        const currentSrc = teamImage.src;
        const baseName = currentSrc.split('/').pop();  
        const qrFileName = 'qr-' + baseName;  
        
        const pathParts = currentSrc.split('/');
        pathParts.pop();  
        pathParts.push(qrFileName);  
        const qrImagePath = pathParts.join('/');
        
        teamImage.src = qrImagePath;
        currentQrButton.src = "./svg/close-box-outline.svg";
      }
    });
  });
});