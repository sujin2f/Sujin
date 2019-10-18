// TODO semantic elements
// https://webflow.com/blog
// /html5-semantic-elements-and-webflow-the-essential-guide
// Redux

// Router
import Router from 'app/components/router/Router';

// Scenes
import FrontPage from 'app/scenes/public/FrontPage';
import Archive from 'app/scenes/public/Archive';
import Page from 'app/scenes/public/Page';
import Post from 'app/scenes/public/Post';
import NotFound from 'app/scenes/public/NotFound';

declare global {
  interface Window {
    wp;
  }
}

((wp): void => {
  const { render } = wp.element;
  render(
    <Router>
      {/*
        // @ts-ignore */}
      <FrontPage path="/" />
      {/*
        // @ts-ignore */}
      <Archive path="/category/:category/page/:page?" />
      {/*
        // @ts-ignore */}
      <Archive path="/category/:category" />
      {/*
        // @ts-ignore */}
      <Archive path="/tag/:tag/page/:page?" />
      {/*
        // @ts-ignore */}
      <Archive path="/tag/:tag" />
      {/*
        // @ts-ignore */}
      <Archive path="/search/:search/page/:page?" />
      {/*
        // @ts-ignore */}
      <Archive path="/search/:search" />
      {/*
        // @ts-ignore */}
      <Post path="/:year([0-9]+)/:month([0-9]+)/:day([0-9]+)/:slug" />
      {/*
        // @ts-ignore */}
      <Page path="/:slug" />
      {/*
        // @ts-ignore */}
      <NotFound />
    </Router>,
    document.getElementById('app'),
  );

  document.getElementsByTagName('body')[0].classList.add('unicorn');
})(window.wp);
