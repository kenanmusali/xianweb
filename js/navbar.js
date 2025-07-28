function toggleMenu() {
  const hamburger = document.querySelector('.hamburger-menu');
  const mobileNav = document.getElementById('mobileNav');

  hamburger.classList.toggle('active');
  mobileNav.classList.toggle('active');

  // Toggle body scroll and prevent background scrolling when mobile nav is open
  if (mobileNav.classList.contains('active')) {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
  } else {
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
  }
}

function toggleMobileGroup(element) {
  element.classList.toggle('active');
  const links = element.nextElementSibling;
  links.classList.toggle('active');

  // Close other open dropdowns when opening a new one
  if (element.classList.contains('active')) {
    const allGroups = document.querySelectorAll('.mobile-nav-group');
    allGroups.forEach(group => {
      if (group !== element.parentElement && group.querySelector('.mobile-nav-group-title').classList.contains('active')) {
        group.querySelector('.mobile-nav-group-title').classList.remove('active');
        group.querySelector('.mobile-nav-links').classList.remove('active');
      }
    });
  }
}

// Close mobile menu when clicking outside
document.addEventListener('click', function (event) {
  const mobileNav = document.getElementById('mobileNav');
  const hamburger = document.querySelector('.hamburger-menu');

  if (mobileNav.classList.contains('active') &&
    !event.target.closest('.mobile-nav-content') &&
    !event.target.closest('.hamburger-menu')) {
    toggleMenu();
  }
});