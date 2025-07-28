document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', function () {
        const item = btn.closest('.faq-item');
        item.classList.toggle('active');
        document.querySelectorAll('.faq-item').forEach(other => {
            if (other !== item) other.classList.remove('active');
        });
    });
});