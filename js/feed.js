const feedLink = document.querySelector('.blog-nav__feed');

feedLink.addEventListener('click', (event) => {
  event.preventDefault();
  if (feedLink.classList.contains('is-copied')) return;
  navigator.clipboard.writeText(feedLink.href);
  feedLink.classList.add('is-copied');
  setTimeout(() => feedLink.classList.remove('is-copied'), 2000);
});
