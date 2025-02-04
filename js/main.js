// Main JavaScript file for Shanghai SuperCTRL Automation website

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Bootstrap dropdowns
    const dropdownElementList = document.querySelectorAll('.dropdown-toggle');
    const dropdownList = [...dropdownElementList].map(dropdownToggleEl => new bootstrap.Dropdown(dropdownToggleEl));

    // Initialize AOS animation library
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });

    // Update language display when language changes
    i18next.on('languageChanged', (lang) => {
        // Update language selector UI
        const languageMap = {
            'en': { name: 'English' },
            'zh': { name: '中文' }
        };

        const currentLang = document.querySelector('.current-lang');
        if (currentLang && languageMap[lang]) {
            currentLang.textContent = languageMap[lang].name;
        }
    });

    // Handle language selection
    document.querySelectorAll('.language-selector').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const language = e.currentTarget.getAttribute('data-language');
            i18next.changeLanguage(language);
        });
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
