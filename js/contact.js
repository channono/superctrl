document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form values
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('topic').value,
                message: document.getElementById('message').value
            };

            // Disable submit button and show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> ' + 
                                   i18next.t('contact.sending');

            try {
                // Get the API URL based on environment
                const apiUrl = window.location.hostname === 'localhost' 
                    ? '/api/contact'  // Local development
                    : '/api/contact';  // Cloudflare Pages (same path)

                // Send data to backend server
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                // Show success message
                alert(i18next.t('contact.messageSent'));
                
                // Reset form
                contactForm.reset();
            } catch (error) {
                console.error('Error sending message:', error);
                // Show error message
                alert(i18next.t('contact.errorSending'));
            } finally {
                // Re-enable submit button
                submitButton.disabled = false;
                submitButton.innerHTML = originalText;
            }
        });
    }
});