const defaultProps = {
  easing: "cubic-bezier(0.5, 0, 0, 1)",
  distance: "30px",
  origin: "bottom",
  duration: 1000,
  desktop: true,
  mobile: true,
};

// custom delay time for mobile
let delayTime;
if (window.matchMedia("(max-width: 45em)").matches) {
  delayTime = 0;
} else {
  delayTime = 100;
}

// Hero Section
ScrollReveal().reveal(".hero-title", {
  ...defaultProps,
  delay: 500,
  origin: window.innerWidth > 768 ? "left" : "bottom",
});
ScrollReveal().reveal(".name", {
  ...defaultProps,
  distance: "0px",
  delay: 700,
  scale: 0,
});
ScrollReveal().reveal(".hero-cta", {
  ...defaultProps,
  delay: 1200,
  origin: window.innerWidth > 768 ? "left" : "bottom",
});
ScrollReveal().reveal(".scroll-down-link", {
  ...defaultProps,
  delay: 2000,
  origin: "top",
});

/* About Section */
ScrollReveal().reveal(".section-title", {
  ...defaultProps,
  delay: delayTime,
  distance: "0px",
});
ScrollReveal().reveal(".about-wrapper__image", {
  ...defaultProps,
  delay: 300,
  scale: 0.5,
});

ScrollReveal().reveal('.drama-js-background', {
  ...defaultProps,
  distance: '0px',  // Prevents movement, only fades in
  opacity: 0,       // Starts with 0 opacity
  easing: 'ease-in',
  duration: 3000,   // Duration of the fade-in effect, adjust as needed
  afterReveal: function (el) {
    el.style.opacity = 1; // Ensures the element stays visible after animation
  }
});


// mobile about
if (!window.matchMedia("(max-width: 45em)").matches) {
  ScrollReveal().reveal(".about-wrapper__info", {
    ...defaultProps,
    delay: 700,
    distance: "100px",
    origin: "left",
  });
}

/* Projects Section */
ScrollReveal().reveal(".project-wrapper__text", {
  ...defaultProps,
  delay: delayTime,
  origin: window.innerWidth > 768 ? "left" : "bottom",
});

ScrollReveal().reveal(".project-wrapper__image", {
  ...defaultProps,
  delay: delayTime,
  scale: 0.9,
  origin: window.innerWidth > 768 ? "right" : "bottom",
});

/* Contact Section */
ScrollReveal().reveal(".contact-wrapper", {
  ...defaultProps,
  delay: delayTime,
});

ScrollReveal().reveal(".fa", {
  ...defaultProps,
  delay: 500,
  interval: 100,
});
