/* eslint-disable import/prefer-default-export */

export function getScrolled(scrolled) {
  if (window.scrollY > 80 && !scrolled) {
    return 'scrolled';
  }

  if (window.scrollY <= 80 && scrolled) {
    return '';
  }

  return false;
}

/* eslint-enable import/prefer-default-export */
