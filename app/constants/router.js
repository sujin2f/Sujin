const ROUTER = {
  '/': 'front-page',
  '/category/:category/page(/:paged)': 'category',
  '/tag/:tag/page(/:paged)': 'tag',
  '/search/:searchString(/:paged)': 'search',
  '/:year/:month/:day/:postSlug': 'single',
  '/:pageSlug': 'page',
};

export default ROUTER;
