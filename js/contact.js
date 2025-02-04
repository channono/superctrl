document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const button = form.querySelector('button[type="submit"]');

    form.onsubmit = async (e) => {
        e.preventDefault();
        button.innerHTML = '<span class="spinner-border spinner-border-sm"></span> ' + i18next.t('form.sending');
        
        const data = {
            name: form.name.value,
            email: form.email.value,
            subject: form.topic.value,
            message: form.message.value
        };
        
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            });
            if (res.ok) {
                alert(i18next.t('contact.success'));
                form.reset();
            } else {
                const result = await res.json();
                alert(result.error || i18next.t('contact.error'));
            }
        } catch {
            alert(i18next.t('contact.error'));
        }
        
        button.textContent = i18next.t('form.submit');
    };
});