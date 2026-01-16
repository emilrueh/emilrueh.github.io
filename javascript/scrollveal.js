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

// About Section
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
  delay: delayTime,
  scale: 0.9,
  origin: window.innerWidth > 768 ? "right" : "bottom",
});

// Contact Section
ScrollReveal().reveal(".contact-wrapper", {
  ...defaultProps,
  delay: delayTime,
});
