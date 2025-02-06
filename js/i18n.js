// Initialize i18next
const i18n = {
    initialized: false,
    init: async function() {
        if (this.initialized) {
            return;
        }
        try {
            // Get saved language from localStorage
            const savedLang = localStorage.getItem('language');
            await i18next
                .use(i18nextBrowserLanguageDetector)
                .init({
                    lng: savedLang,  // Use saved language
                    fallbackLng: savedLang || 'en',  // Use saved language as fallback
                    resources: {
                        en: { translation: enTranslation },
                        zh: { translation: zhTranslation }
                    },
                    detection: {
                        order: ['localStorage'],  // Only use localStorage
                        lookupLocalStorage: 'language',
                        caches: ['localStorage']
                    },
                    interpolation: {
                        escapeValue: false
                    }
                });

            // Initialize jquery-i18next after i18next is initialized
            jqueryI18next.init(i18next, $, {
                handleName: 'data-i18n',
                useOptionsAttr: true
            });

            // Initial translation
            this.updateContent();
            this.bindEvents();
            this.updateActiveLanguage();

            // Update content on language change
            i18next.on('languageChanged', () => {
                this.updateContent();
                this.updateActiveLanguage();
            });
            
            this.initialized = true;
        } catch (error) {
            console.error('Error initializing i18next:', error);
        }
    },

    updateContent: function() {
        // Translate text content
        $('[data-i18n]').each(function() {
            const $element = $(this);
            const key = $element.attr('data-i18n');
            const options = $element.data('i18n-options') || {};
            
            if (key.includes('[')) {
                // Handle attributes (like placeholder, title, etc)
                const parts = key.split(']');
                parts.forEach(part => {
                    if (part && part.startsWith('[')) {
                        const attr = part.substring(1);
                        const attrKey = parts[parts.length - 1];
                        $element.attr(attr, i18next.t(attrKey, options));
                    }
                });
            } else {
                // Handle text content
                const translated = i18next.t(key, options);
                if ($element.is('input, textarea')) {
                    $element.val(translated);
                } else {
                    $element.html(translated);
                }
            }
        });
    },

    bindEvents: function() {
        $('.language-selector').on('click', (e) => {
            e.preventDefault();
            const language = $(e.currentTarget).data('language');
            localStorage.setItem('language', language);
            i18next.changeLanguage(language);
        });
    },

    updateActiveLanguage: function() {
        const currentLang = i18next.language;
        $('.language-selector').each(function() {
            $(this).toggleClass('active', $(this).data('language') === currentLang);
        });
    }
};

// Initialize when DOM is ready
$(document).ready(() => i18n.init());
