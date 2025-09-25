document.addEventListener('DOMContentLoaded', function () {
    const solutionSection = document.querySelector('.solution-section');
    const solutionCards = document.querySelectorAll('.solution-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Reset numbers to 0% before animating
                solutionCards.forEach(card => {
                    const numberEl = card.querySelector('.solution-number');
                    numberEl.textContent = '0%';
                });
                // Start animation
                animateNumbers();
            }
        });
    }, {
        threshold: 0.5 // Adjust based on when you want it to trigger
    });

    if (solutionSection) {
        observer.observe(solutionSection);
    }

    function animateNumbers() {
        solutionCards.forEach(card => {
            const numberEl = card.querySelector('.solution-number');
            const target = +numberEl.getAttribute('data-target');
            const duration = 1000; // 3 seconds (3000ms)
            const startTime = performance.now();
            
            function updateNumber(currentTime) {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1); // 0 to 1
                const currentValue = Math.floor(progress * target);
                
                numberEl.textContent = currentValue + '%';
                
                if (progress < 1) {
                    requestAnimationFrame(updateNumber);
                } else {
                    numberEl.textContent = target + '%'; // Ensure final value is exact
                }
            }
            
            requestAnimationFrame(updateNumber);
        });
    }
});