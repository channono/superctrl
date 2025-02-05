document.addEventListener('DOMContentLoaded', async () => {
    await i18n.init();
    
    const form = document.getElementById('contactForm');
    const button = form.querySelector('button[type="submit"]');
    const submitText = button.textContent;

    form.onsubmit = async (e) => {
        e.preventDefault();
        button.disabled = true;
        button.innerHTML = '<span class="spinner-border spinner-border-sm"></span> ' + i18next.t('form.sending');
        
        const data = {
            name: form.name.value,
            email: form.email.value,
            subject: form.topic.value,
            message: form.message.value
        };
        
        try {
            const res = await fetch('/functions/api/contact', {
                method: 'GET',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            });
            
            if (res.ok) {
                alert(i18next.t('contact.success'));
                form.reset();
            } else {
                alert(i18next.t('contact.error'));
            }
        } catch (error) {
            alert(i18next.t('contact.error'));
        } finally {
            button.disabled = false;
            button.textContent = submitText;
        }
    };
});