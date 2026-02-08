const defaultProps = {
  easing: "cubic-bezier(0.5, 0, 0, 1)",
  distance: "30px",
  origin: "bottom",
  duration: 1000,
  desktop: true,
  mobile: true,
};

let delayTime;
if (window.matchMedia("(max-width: 45em)").matches) {
  delayTime = 0;
} else {
  delayTime = 100;
}

// Hero Section
ScrollReveal().reveal(".name", {
  ...defaultProps,
  distance: "10px",
  delay: 300,
  origin: "bottom",
  duration: 1800,
  opacity: 0,
});
// ScrollReveal().reveal(".company-name", {
//   ...defaultProps,
//   distance: "0px",
//   delay: 0,
//   scale: 0,
//   duration: 1200,
// });

// About Section
ScrollReveal().reveal(".section-title", {
  ...defaultProps,
  delay: delayTime,
  distance: "0px",
});
ScrollReveal().reveal(".about-wrapper__image", {
  ...defaultProps,
  delay: 300,
  origin: "bottom",
  distance: "100px",
  scale: 0.85,
  duration: 1800,
  easing: "cubic-bezier(0.22, 1.15, 0.36, 1)",
});

ScrollReveal().reveal(".about-wrapper__info", {
  ...defaultProps,
  delay: 500,
  distance: "0px",
});

// Projects Section (disabled)
ScrollReveal().reveal(".project-wrapper__text", {
  ...defaultProps,
  delay: delayTime,
  origin: window.innerWidth > 768 ? "left" : "bottom",
});

ScrollReveal().reveal(".project-wrapper__image", {
  ...defaultProps,
  delay: 0,
  scale: 0.9,
  origin: window.innerWidth > 768 ? "right" : "bottom",
});

// Contact Section
ScrollReveal().reveal(".contact-wrapper__text", {
  ...defaultProps,
  delay: delayTime + 300,
  distance: "0px",
});

ScrollReveal().reveal(".cta-btn--contact", {
  ...defaultProps,
  delay: delayTime + 300,
});
