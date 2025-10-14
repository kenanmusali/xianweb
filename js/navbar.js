function toggleMenu() {
    const navSection = document.querySelector('.mobile .nav-section');
    const menuIcon = document.querySelector('.mobile .menu-icon');
    const closeIcon = document.querySelector('.mobile .close-icon');

    navSection.classList.toggle('active');
    const open = navSection.classList.contains('active');
    menuIcon.style.display = open ? 'none' : 'block';
    closeIcon.style.display = open ? 'block' : 'none';
}

function closeMobileMenu() {
    const navSection = document.querySelector('.mobile .nav-section');
    const menuIcon = document.querySelector('.mobile .menu-icon');
    const closeIcon = document.querySelector('.mobile .close-icon');
    navSection.classList.remove('active');
    menuIcon.style.display = 'block';
    closeIcon.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', function (e) {
        const link = e.target.closest('.mobile .nav-section a[href]');
        if (!link) return;

        if (link.target === '_blank') return;
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

        const href = link.getAttribute('href');
        if (!href || href.startsWith('#')) {
            closeMobileMenu();
            return;
        }

        e.preventDefault();
        closeMobileMenu();

        setTimeout(() => {
            window.location.href = href;
        }, 50);
    }, { capture: true });
});

document.querySelectorAll('.mobile .nav-about, .mobile .nav-media, .mobile .themes, .mobile .language').forEach(item => {
    item.addEventListener('click', function (e) {
        if (e.target.tagName === 'A' || e.target.tagName === 'IMG') {
            e.preventDefault();
        }
        e.stopPropagation();

        const dropdown = this.querySelector('.dropdown-menu');

        document.querySelectorAll('.mobile .dropdown-menu').forEach(menu => {
            if (menu !== dropdown) menu.classList.remove('active');
        });

        dropdown.classList.toggle('active');
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const themeDropdowns = document.querySelectorAll(
        '.themes .menu-items, .mobile .nav-about .menu-items'
    );

    const themeDropdownItems = [];
    themeDropdowns.forEach(dropdown => {
        dropdown.querySelectorAll('a').forEach(item => {
            themeDropdownItems.push(item);
        });
    });

    let currentTheme = localStorage.getItem('theme') || 'Auto';

    setTheme(currentTheme, true);

    themeDropdownItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();

            const theme = getThemeFromText(item.textContent.trim());
            currentTheme = theme;
            localStorage.setItem('theme', theme);

            setTheme(theme);
        });
    });

    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: Dark)');
    darkModeMediaQuery.addEventListener('change', () => {
        if (currentTheme === 'Auto') setTheme('Auto');
    });
});

function getThemeFromText(text) {
    // Map language-specific text to standard theme values
    const themeMap = {
        // English
        'Auto': 'Auto',
        'Light': 'Light', 
        'Dark': 'Dark',
        
        // Russian
        'Авто': 'Auto',
        'Светлый': 'Light',
        'Тёмный': 'Dark',
        
        // Chinese
        '自动': 'Auto',
        '浅色': 'Light',
        '深色': 'Dark'
    };
    
    return themeMap[text] || 'Auto';
}

function getThemeDisplayText(theme) {
    const htmlLang = document.documentElement.lang || 'en';
    
    const themeTexts = {
        'en': {
            'Auto': 'Auto',
            'Light': 'Light',
            'Dark': 'Dark'
        },
        'ru': {
            'Auto': 'Авто',
            'Light': 'Светлый', 
            'Dark': 'Тёмный'
        },
        'zh': {
            'Auto': '自动',
            'Light': '浅色',
            'Dark': '深色'
        }
    };
    
    const language = htmlLang.startsWith('zh') ? 'zh' : 
                    htmlLang.startsWith('ru') ? 'ru' : 'en';
    
    return themeTexts[language][theme] || theme;
}

function setTheme(theme, initialLoad = false) {
    const root = document.documentElement;

    const isDark = theme === 'Auto'
        ? window.matchMedia('(prefers-color-scheme: Dark)').matches
        : theme === 'Dark';

    updateActiveThemeIndicator(theme);
    updateWorldMapImage(isDark); 

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
        root.style.setProperty('--black-filter', ' brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(335deg) brightness(103%) contrast(101%)');
        root.style.setProperty('--Logo', ' brightness(0) saturate(100%) invert(100%) sepia(100%) saturate(0%) hue-rotate(127deg) brightness(103%) contrast(103%)');
        root.style.setProperty('--cyan-white', 'filter: brightness(0) saturate(100%) invert(100%) sepia(100%) saturate(2%) hue-rotate(312deg) brightness(103%) contrast(101%);');


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
        root.style.setProperty('--black-filter', ' brightness(0) saturate(100%)');
        root.style.setProperty('--Logo', ' none');
        root.style.setProperty('--cyan-white', ' #29799b');

    }

    if (!initialLoad) {
        document.querySelectorAll('.dropdown-menu.active').forEach(menu => {
            menu.classList.remove('active');
        });
    }
}

function updateActiveThemeIndicator(theme) {
    document.querySelectorAll('.themes .menu-items a, .mobile .nav-about .menu-items a')
        .forEach(item => {
            const itemTheme = getThemeFromText(item.textContent.trim());
            if (itemTheme === theme) {
                item.classList.add('active-theme');
            } else {
                item.classList.remove('active-theme');
            }
        });
}

function updateWorldMapImage(isDark) {
    const worldMapImage = document.querySelector('.world-map-bg .main-image');
    if (worldMapImage) {
        if (isDark) {
            worldMapImage.src = '/svg/Country/world-dark.svg';
            worldMapImage.setAttribute('data-theme', 'Dark');
        } else {
            worldMapImage.src = '/svg/Country/world.svg';
            worldMapImage.setAttribute('data-theme', 'Light');
        }
    }
}

const countryHovers = document.querySelectorAll('.country-hover');
const mainImage = document.querySelector('.main-image');

function getImagePath(countryCode, isDark) {
    const suffix = isDark ? '-Dark' : '';
}

function isDarkModeActive() {
    const mainImage = document.querySelector('.main-image');
    return mainImage && mainImage.getAttribute('data-theme') === 'Dark';
}

document.querySelector('.world-map-bg').style.pointerEvents = 'none';
document.querySelector('.image').style.pointerEvents = 'none';