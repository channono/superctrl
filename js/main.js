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

    // Load language-specific fonts
    const loadLanguageFonts = (lang) => {
        const fontFamilies = {
            zh: 'Noto+Sans+SC:400,500,700'
        };

        if (fontFamilies[lang]) {
            const link = document.createElement('link');
            link.href = `https://fonts.googleapis.com/css2?family=${fontFamilies[lang]}&display=swap`;
            link.rel = 'stylesheet';
            document.head.appendChild(link);
        }
    };

    // Update language display when language changes
    i18next.on('languageChanged', (lang) => {
        loadLanguageFonts(lang);
        
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

    // Smooth scrolling for navigation links
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

    // Form validation and submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            // Add your form submission logic here
        });
    }
});

// Email validation helper
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

// Form message helper
function showFormMessage(message, type = 'success') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `alert alert-${type} mt-3`;
    messageDiv.role = 'alert';
    messageDiv.textContent = message;
    
    const form = document.getElementById('contactForm');
    form.parentNode.insertBefore(messageDiv, form.nextSibling);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}
