if (window.innerWidth > 768) {
  let tilt = document.querySelectorAll(".about-wrapper__image img");
  VanillaTilt.init(tilt, {
    max: 5,
    speed: 2400,
    scale: 1,
    glare: true,
    "max-glare": 0.1,
  });
}
