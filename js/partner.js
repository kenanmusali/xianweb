// document.addEventListener('DOMContentLoaded', function() {
//     const track = document.getElementById('track');
//     const nextBtn = document.querySelector('.carousel-btn.next');
//     const prevBtn = document.querySelector('.carousel-btn.prev');

//     // Check if all required elements exist
//     if (!track || !nextBtn || !prevBtn) {
//         console.error('Carousel elements not found');
//         return;
//     }

//     let slides = Array.from(track.children).filter(c => c.classList.contains('slide') || c.classList.contains('line'));
    
//     // Check if there are any slides
//     if (slides.length === 0) {
//         console.error('No slides found in carousel');
//         return;
//     }

//     let slideWidth = slides[0].getBoundingClientRect().width;
//     let index = 0;

//     // Clone slides for infinite loop
//     slides.forEach(slide => {
//         const clone = slide.cloneNode(true);
//         track.appendChild(clone);
//     });
    
//     // Update slides array with clones
//     slides = Array.from(track.children); 

//     function moveTrack() {
//         track.style.transition = 'transform 0.5s ease';
//         track.style.transform = `translateX(-${index * slideWidth}px)`;
//     }

//     // Handle window resize to update slide width
//     window.addEventListener('resize', function() {
//         slideWidth = slides[0].getBoundingClientRect().width;
//         moveTrack(); // Update position after resize
//     });

//     // Next button
//     nextBtn.addEventListener('click', () => {
//         index++;
//         moveTrack();

//         if (index >= slides.length / 2) {
//             setTimeout(() => {
//                 track.style.transition = 'none';
//                 index = 0;
//                 track.style.transform = `translateX(-${index * slideWidth}px)`;
//                 track.getBoundingClientRect(); // Force reflow
//                 track.style.transition = 'transform 0.5s ease';
//             }, 500);
//         }
//     });

//     // Prev button
//     prevBtn.addEventListener('click', () => {
//         if (index === 0) {
//             track.style.transition = 'none';
//             index = Math.floor(slides.length / 2);
//             track.style.transform = `translateX(-${index * slideWidth}px)`;
//             track.getBoundingClientRect(); // Force reflow
//             track.style.transition = 'transform 0.5s ease';
//         }
//         index--;
//         moveTrack();
//     });

//     moveTrack();
// });