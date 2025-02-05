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
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            });
            
            console.log('Response status:', res.status);
            const result = await res.json();
            console.log('Response data:', result);
            
            if (res.ok) {
                alert(i18next.t('contact.success'));
                form.reset();
            } else {
                alert(result.error || i18next.t('contact.error'));
            }
        } catch (error) {
            console.error('Error:', error);
            alert(i18next.t('contact.error'));
        } finally {
            button.disabled = false;
            button.textContent = submitText;
        }
    };
});