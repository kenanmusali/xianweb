// MENU TOGGLE
function toggleMenu() {
  const navSection = document.querySelector('.nav-section');
  const menuIcon = document.querySelector('.menu-icon');
  const closeIcon = document.querySelector('.close-icon');

  const isActive = navSection.classList.toggle('active');

  if (isActive) {
    menuIcon.style.display = 'none';
    closeIcon.style.display = 'block';
  } else {
    menuIcon.style.display = 'block';
    closeIcon.style.display = 'none';
  }
}

// DROPDOWN TOGGLE (mobile)
document.querySelectorAll('.nav-about > img, .nav-media > img, .themes > img.img1, .language > img:last-child').forEach((icon) => {
  icon.addEventListener('click', (e) => {
    const parent = e.target.closest('.nav-about, .nav-media, .themes, .language');

    // Close others
    document.querySelectorAll('.nav-about, .nav-media, .themes, .language').forEach((el) => {
      if (el !== parent) el.classList.remove('open');
    });

    parent.classList.toggle('open');
  });
});
