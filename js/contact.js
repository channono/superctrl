const form = document.getElementById('contactForm');
const button = form.querySelector('button[type="submit"]');

form.onsubmit = async (e) => {
    e.preventDefault();
    const oldText = button.textContent;
    button.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Sending...';
    
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
            alert('Message sent successfully!');
            form.reset();
        } else {
            const result = await res.json();
            alert(result.error || 'Failed to send message');
        }
    } catch {
        alert('Failed to send message');
    }
    
    button.textContent = oldText;
};