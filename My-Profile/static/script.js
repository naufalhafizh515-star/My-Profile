document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main section[id]');
  const revealItems = document.querySelectorAll('.reveal');
  const form = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');
  const backToTop = document.querySelector('.back-to-top');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.forEach((item) => item.classList.remove('active'));
      link.classList.add('active');

      if (navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
      }
    });
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  revealItems.forEach((item) => revealObserver.observe(item));

  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const id = entry.target.getAttribute('id');
      navLinks.forEach((link) => {
        const isActive = link.getAttribute('href') === `#${id}`;
        link.classList.toggle('active', isActive);
      });
    });
  }, { threshold: 0.5 });

  sections.forEach((section) => activeObserver.observe(section));

  if (backToTop) {
    backToTop.addEventListener('click', (event) => {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        formMessage.textContent = 'Please fill in all fields before sending.';
        formMessage.style.color = '#ffb3b3';
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        formMessage.textContent = 'Please use a valid email address.';
        formMessage.style.color = '#ffb3b3';
        return;
      }

      const formData = new FormData(form);
      fetch('/contact', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          formMessage.textContent = data.message;
          formMessage.style.color = '#7ee7ff';

          if (data.status === 'success') {
            form.reset();
          }
        })
        .catch(() => {
          formMessage.textContent = 'An error occurred while sending the message.';
          formMessage.style.color = '#ffb3b3';
        });
    });
  }
});
