// Contact page animations and interactions
document.addEventListener('DOMContentLoaded', function () {
    // Form handling
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        // Add focus animations to form inputs
        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('focus', function () {
                this.parentElement.style.transform = 'translateY(-2px)';
                this.parentElement.style.transition = 'transform 0.3s ease';
            });

            input.addEventListener('blur', function () {
                this.parentElement.style.transform = 'translateY(0)';
            });
        });
    }

    // Smooth scrolling
    const backHomeLink = document.querySelector('.back-home');
    if (backHomeLink) {
        backHomeLink.addEventListener('click', function (e) {
            // Let the default link behavior work for navigation
            // Just add a nice visual effect
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    }

    // Add hover effect to info items
    const infoItems = document.querySelectorAll('.info-item');
    infoItems.forEach(item => {
        item.addEventListener('mouseenter', function () {
            this.querySelector('i').style.transform = 'scale(1.2) rotate(10deg)';
            this.querySelector('i').style.transition = 'transform 0.3s ease';
        });

        item.addEventListener('mouseleave', function () {
            this.querySelector('i').style.transform = 'scale(1) rotate(0deg)';
        });
    });

    // Console message
    console.log('%c📧 Contact Page Loaded!', 'color: #667eea; font-size: 16px; font-weight: bold;');
    console.log('%cFeel free to reach out - I\'d love to hear from you!', 'color: #764ba2; font-size: 12px;');
});
