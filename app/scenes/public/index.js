import React, { Component } from 'react';
import Helmet from 'react-helmet';

import ContentsWrapperContainer from 'app/components/Common/ContentsWrapperContainer';
import GlobalHeaderContainer from 'app/components/Layout/GlobalHeaderContainer';

class Public extends Component {
  constructor(props) {
    super(props);

    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      this.gtag = this.gtag.bind(this);

      this.gtag('js', new Date());
      this.gtag('config', 'UA-117697376-1');
    }
  }

  gtag(...args) {
    window.dataLayer.push(args);
  }

  render() {
    const internalURI = process.env.NODE_ENV === 'production'
      ? 'http://sujinc.com http://sujinc.com:7777'
      : 'http://sujinc.test http://localhost:8080';

    return (
      <ContentsWrapperContainer>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Sujin</title>

          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta httpEquiv="Content-type" content="text/html; charset=utf-8" />
          <meta name="theme-color" content="#970000" />
          <meta name="keywords" content="Wordpress, React, PHP, Developer, Plugin" />
          <meta name="description" content="Sujin, Wordpress Developer" />

          <meta property="og:title" content="Sujin" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="http://sujinc.com" />
          <meta property="og:image" content="/images/default-og-image.png" />

          <meta
            httpEquiv="Content-Security-Policy"
            content={`
              default-src 'self';
              style-src 'self' 'unsafe-inline'
                ${internalURI}
                https://fonts.googleapis.com
                http://fonts.googleapis.com
                https://platform.twitter.com
                http://platform.twitter.com
                https://assets-cdn.github.com
                http://assets-cdn.github.com
                data: blob:;
              media-src 'self';
              font-src 'self'
                ${internalURI}
                http://fonts.gstatic.com
                https://fonts.gstatic.com
                data:;
              img-src * data:;
              script-src 'unsafe-inline' 'unsafe-eval'
                ${internalURI}
                https://pagead2.googlesyndication.com
                http://pagead2.googlesyndication.com
                https://www.googletagmanager.com
                http://www.googletagmanager.com
                https://adservice.google.com
                http://adservice.google.com
                https://adservice.google.ca
                http://adservice.google.ca
                https://www.google-analytics.com
                http://www.google-analytics.com
                https://platform.twitter.com
                http://platform.twitter.com
                https://syndication.twitter.com
                http://syndication.twitter.com
                https://cdn.syndication.twimg.com
                http://cdn.syndication.twimg.com
                https://gist.github.com
                http://gist.github.com
                data: blob:;
              connect-src 'self'
                ${internalURI}
                ws:;
              frame-src 'self'
                https://googleads.g.doubleclick.net
                http://googleads.g.doubleclick.net
                https://embed.gettyimages.com
                http://embed.gettyimages.com
                https://platform.twitter.com
                http://platform.twitter.com
                https://syndication.twitter.com
                http://syndication.twitter.com
            `}
            />

          <script async src="https://www.googletagmanager.com/gtag/js?id=UA-117697376-1" />
          <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js" />

          <link
            rel="alternate"
            type="application/rss+xml"
            title="WordPress Blog RSS"
            href="http://sujinc.com:7777:/feed/"
            />
          <link rel="icon" type="image/png" href="/images/favicon-32x32.png" sizes="16x16" />
          <link rel="icon" type="image/png" href="/images/favicon-16x16.png" sizes="32x32" />
          <link rel="shortcut icon" href="/images/favicon.ico" />

        </Helmet>

        <GlobalHeaderContainer />

        {this.props.children}
      </ContentsWrapperContainer>
    );
  }
}

export default Public;
