document.addEventListener('DOMContentLoaded', function () {
    const solutionSection = document.querySelector('.solution-section');
    const solutionCards = document.querySelectorAll('.solution-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                solutionCards.forEach(card => {
                    const numberEl = card.querySelector('.solution-number');
                    numberEl.textContent = '0%';
                });
                animateNumbers();
            }
        });
    }, {
        threshold: 0.5 
    });

    if (solutionSection) {
        observer.observe(solutionSection);
    }

    function animateNumbers() {
        solutionCards.forEach(card => {
            const numberEl = card.querySelector('.solution-number');
            const target = +numberEl.getAttribute('data-target');
            const duration = 1000; 
            const startTime = performance.now();
            
            function updateNumber(currentTime) {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);  
                const currentValue = Math.floor(progress * target);
                
                numberEl.textContent = currentValue + '%';
                
                if (progress < 1) {
                    requestAnimationFrame(updateNumber);
                } else {
                    numberEl.textContent = target + '%';  
                }
            }
            
            requestAnimationFrame(updateNumber);
        });
    }
});