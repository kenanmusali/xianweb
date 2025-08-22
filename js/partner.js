const track = document.getElementById('track');
const nextBtn = document.querySelector('.carousel-btn.next');
const prevBtn = document.querySelector('.carousel-btn.prev');

let slides = Array.from(track.children).filter(c => c.classList.contains('slide') || c.classList.contains('line'));
let slideWidth = slides[0].getBoundingClientRect().width;
let index = 0;

slides.forEach(slide => {
    const clone = slide.cloneNode(true);
    track.appendChild(clone);
});
slides = Array.from(track.children); 

function moveTrack() {
    track.style.transition = 'transform 0.5s ease';
    track.style.transform = `translateX(-${index * slideWidth}px)`;
}

// Next button
nextBtn.addEventListener('click', () => {
    index++;
    moveTrack();

    if (index >= slides.length / 2) {
        setTimeout(() => {
            track.style.transition = 'none';
            index = 0;
            track.style.transform = `translateX(-${index * slideWidth}px)`;
            track.getBoundingClientRect(); 
            track.style.transition = 'transform 0.5s ease';
        }, 500);
    }
});

// Prev button
prevBtn.addEventListener('click', () => {
    if (index === 0) {
        track.style.transition = 'none';
        index = slides.length / 2;
        track.style.transform = `translateX(-${index * slideWidth}px)`;
        track.getBoundingClientRect();
        track.style.transition = 'transform 0.5s ease';
    }
    index--;
    moveTrack();
});
