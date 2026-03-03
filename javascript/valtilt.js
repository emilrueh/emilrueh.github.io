if (window.innerWidth > 768) {
  let tilt = document.querySelectorAll(".about-wrapper__image img");
  VanillaTilt.init(tilt, {
    max: 5,
    speed: 2400,
    scale: 1,
    glare: false,
    "max-glare": 0.1,
  });

  let serviceTilt = document.querySelectorAll(".service-card__image");
  VanillaTilt.init(serviceTilt, {
    max: 0,
    speed: 2400,
    scale: 1.1,
    glare: false,
    "max-glare": 6,
  });
}
