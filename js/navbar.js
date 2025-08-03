function toggleMenu() {
    // Only target the mobile nav section
    const navSection = document.querySelector('.mobile .nav-section');
    const menuIcon = document.querySelector('.mobile .menu-icon');
    const closeIcon = document.querySelector('.mobile .close-icon');

    navSection.classList.toggle('active');

    if (navSection.classList.contains('active')) {
        menuIcon.style.display = 'none';
        closeIcon.style.display = 'block';
    } else {
        menuIcon.style.display = 'block';
        closeIcon.style.display = 'none';
    }
}

// Dropdown toggle for mobile - updated to only target mobile version
document.querySelectorAll('.mobile .nav-about, .mobile .nav-media, .mobile .themes, .mobile .language').forEach(item => {
    item.addEventListener('click', function (e) {
        // Prevent link click from instantly closing
        if (e.target.tagName === 'A' || e.target.tagName === 'IMG') {
            e.preventDefault();
        }
        e.stopPropagation();

        const dropdown = this.querySelector('.dropdown-menu');

        // Close other open dropdowns in mobile nav only
        document.querySelectorAll('.mobile .dropdown-menu').forEach(menu => {
            if (menu !== dropdown) menu.classList.remove('active');
        });

        // Toggle the clicked one
        dropdown.classList.toggle('active');
    });
});
document.addEventListener('DOMContentLoaded', () => {
    // Select ALL theme dropdowns (desktop + mobile)
    const themeDropdowns = document.querySelectorAll(
        '.themes .menu-items, .mobile .nav-about .menu-items'
    );

    // Collect all theme option <a> elements
    const themeDropdownItems = [];
    themeDropdowns.forEach(dropdown => {
        dropdown.querySelectorAll('a').forEach(item => {
            themeDropdownItems.push(item);
        });
    });

    let currentTheme = localStorage.getItem('theme') || 'auto';

    // Set initial theme
    setTheme(currentTheme, true);

    // Add click handler for each theme link
    themeDropdownItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();

            const theme = item.textContent.trim();
            currentTheme = theme;
            localStorage.setItem('theme', theme);

            // Set the theme and close dropdown
            setTheme(theme);
        });
    });

    // Watch for system dark mode changes
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeMediaQuery.addEventListener('change', () => {
        if (currentTheme === 'auto') setTheme('auto');
    });
});

function setTheme(theme, initialLoad = false) {
    const root = document.documentElement;

    // Determine if dark
    const isDark = theme === 'auto'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
        : theme === 'dark';

    // Update the active indicator on all menus
    updateActiveThemeIndicator(theme);

    // Apply the CSS variables
    if (isDark) {
        // Dark Mode
        root.style.setProperty('--text', '#E0E0E0');
        root.style.setProperty('--black', '#E0E0E0');
        root.style.setProperty('--background', '#121212');
        root.style.setProperty('--cyan', '#4A8DA9');
        root.style.setProperty('--cyan1', '#66AAC7');
        root.style.setProperty('--cyan1-filter', 'brightness(0) saturate(100%) invert(76%) sepia(12%) saturate(1025%) hue-rotate(157deg) brightness(87%) contrast(85%)');
        root.style.setProperty('--light-cyan', '#1E3A47');
        root.style.setProperty('--grey', '#2A2A2A');
        root.style.setProperty('--white', '#1E1E1E');
        root.style.setProperty('--second-background', '#1A1A1A');
        root.style.setProperty('--button', 'linear-gradient(to top right, #2A2A2A, #1E3A47)');
        root.style.setProperty('--button-hover', 'linear-gradient(to top right, #4A8DA9, #29799b)');
        root.style.setProperty('--shadow', '0 4px 20px rgba(0, 0, 0, 0.3)');
        root.style.setProperty('--shadow2', '0 2px 10px rgba(0, 0, 0, 0.2)');
        root.style.setProperty('--border-color', '#333333');
        root.style.setProperty('--background3', 'linear-gradient(to bottom, #1E3A47, #121212)');

    } else {
        // Light Mode (original)
        root.style.setProperty('--text', '#333333');
        root.style.setProperty('--black', '#141414');
        root.style.setProperty('--background', '#FBFCFF');
        root.style.setProperty('--cyan', '#66AAC7');
        root.style.setProperty('--cyan1', '#29799b');
        root.style.setProperty('--cyan1-filter', 'brightness(0) saturate(100%) invert(35%) sepia(73%) saturate(441%) hue-rotate(152deg) brightness(100%) contrast(90%)');
        root.style.setProperty('--light-cyan', '#C9E3EE');
        root.style.setProperty('--grey', '#f5f5f5');
        root.style.setProperty('--white', '#ffffff');
        root.style.setProperty('--second-background', '#f7f7f7');
        root.style.setProperty('--button', 'linear-gradient(to top right, #F6F6F6, #E8F5FA)');
        root.style.setProperty('--button-hover', 'linear-gradient(to top right, #66AAC7, #4192B5)');
        root.style.setProperty('--shadow', '0 4px 20px rgba(0, 0, 0, 0.08)');
        root.style.setProperty('--shadow2', '0 2px 10px rgba(0, 0, 0, 0.1)');
        root.style.setProperty('--border-color', '#e4e4e4');
        root.style.setProperty('--background3', 'linear-gradient(to bottom, #C9E3EE, #FFFFFF)');

    }

    if (!initialLoad) {
        document.querySelectorAll('.dropdown-menu.active').forEach(menu => {
            menu.classList.remove('active');
        });
    }
}

function updateActiveThemeIndicator(theme) {
    // Works for both desktop and mobile
    document.querySelectorAll('.themes .menu-items a, .mobile .nav-about .menu-items a')
        .forEach(item => {
            if (item.textContent.trim() === theme) {
                item.classList.add('active-theme');
            } else {
                item.classList.remove('active-theme');
            }
        });
}
