let tilt = document.querySelectorAll(".rounded, .about-wrapper__image img");
VanillaTilt.init(tilt, {
  max: 3,
  speed: 2000,
  scale: 1.05,
  glare: true,
  "max-glare": 0.1,
});
