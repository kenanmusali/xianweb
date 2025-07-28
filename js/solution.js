document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.solution-card').forEach(card => {
        const numberEl = card.querySelector('.solution-number');
        const target = +numberEl.getAttribute('data-target');
        let current = 0;
        const step = Math.max(1, Math.ceil(target / 80)); // Slower animation
        function animate() {
            current += step;
            if (current >= target) {
                numberEl.textContent = target + '%';
            } else {
                numberEl.textContent = current + '%';
                requestAnimationFrame(animate);
            }
        }
        animate();
    });
});