export default const htmlTemplate = (reactDom, reduxState, helmetData) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      ${helmetData.title.toString()}
      ${helmetData.meta.toString()}

      <title>React SSR</title>

      <meta
        http-equiv="Content-Security-Policy"
        content="
          default-src 'self';
          style-src 'self' 'unsafe-inline'
            https://fonts.googleapis.com
            https://platform.twitter.com
            data: blob:;
          media-src 'self';
          font-src 'self' https://fonts.gstatic.com data:;
          img-src * data:;
          script-src 'unsafe-inline' 'unsafe-eval'
            http://localhost:8080
            http://pagead2.googlesyndication.com
            https://www.googletagmanager.com
            https://adservice.google.com
            https://adservice.google.ca
            https://www.google-analytics.com
            http://platform.twitter.com
            https://platform.twitter.com
            https://syndication.twitter.com
            https://cdn.syndication.twimg.com
            data: blob:;
          connect-src 'self' http://localhost:8000 ws:;
          frame-src 'self'
            https://googleads.g.doubleclick.net
            http://embed.gettyimages.com
            http://platform.twitter.com
            https://platform.twitter.com
            https://syndication.twitter.com
        ">

      <script async src="https://www.googletagmanager.com/gtag/js?id=UA-117697376-1"></script>
      <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'UA-117697376-1');
      </script>

      <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
    </head>

    <body>
      <div id="app" itemType="http://schema.org/WebSite">${reactDom}</div>

      <script>
        window.REDUX_DATA = ${JSON.stringify(reduxState)}
      </script>
      <script src="/app.bundle.js"></script>
      <script src="/style.bundle.js"></script>
    </body>
    </html>
  `;
};
