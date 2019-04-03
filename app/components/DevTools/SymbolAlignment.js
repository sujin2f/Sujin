import React, { Component, Fragment } from 'react';
import Helmet from 'react-helmet';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { arduinoLight } from 'react-syntax-highlighter/styles/hljs';

import PageHeader from 'app/components/Layout/PageHeader';
import { DEV_TOOLS_IMAGE } from 'app/constants/thumbnail';
import { symbolAlignment } from 'app/actions/dev-tools';

import Menu from './Menu';

class SymbolAlignment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      symbol: '=',
      text: '',
    };

    this.handleChangeText = this.handleChangeText.bind(this);
    this.handleChangeSymbol = this.handleChangeSymbol.bind(this);
  }

  handleChangeText(event) {
    this.setState({
      text: event.target.value,
    });
  }

  handleChangeSymbol(event) {
    this.setState({
      symbol: event.target.value,
    });
  }

  render() {
    const convertedText = this.state.text
      ? symbolAlignment(this.state.text, this.state.symbol)
      : false;

    const text = (
      <Fragment>
        <h1>
          <div className="flag">
            <span className="label">Dev Tools</span>
          </div>
          <span>Symbol Alignment</span>
        </h1>
      </Fragment>
    );

    return (
      <Fragment>
        <Helmet>
          <title>Sujin | Dev Tools | Symbol Alignment</title>
          <meta name="description" content="Developer's tool" />
          <meta property="og:title" content="Sujin | Dev Tools | Symbol Alignment" />
          <meta property="og:image" content={DEV_TOOLS_IMAGE} />
        </Helmet>

        <PageHeader
          style={{ backgroundImage: `url(${DEV_TOOLS_IMAGE})` }}
          text={text}
          />

        <section className="row container">
          <aside className="columns large-3 medium-12">
            <Menu />
          </aside>

          <article className="columns large-9 medium-12">
            <section className="input-group">
              <span className="input-group-label">Symbol</span>
              <input
                id="convert-keyword"
                className="input-group-field"
                type="text"
                onChange={this.handleChangeSymbol}
                value={this.state.symbol}
              />
            </section>
            <textarea id="sort-text" onChange={this.handleChangeText} rows="10" />

            {convertedText &&
              /* eslint-disable max-len */
              <SyntaxHighlighter style={arduinoLight} showLineNumbers>
                {convertedText}
              </SyntaxHighlighter>
              /* eslint-enable max-len */
            }
          </article>
        </section>
      </Fragment>
    );
  }
}

export default SymbolAlignment;
