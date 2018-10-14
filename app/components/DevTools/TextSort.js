import React, { Component, Fragment } from 'react';
import Helmet from 'react-helmet';

import PageHeader from 'app/components/Layout/PageHeader';
import { DEV_TOOLS_IMAGE } from 'app/constants/thumbnail';

import { sortText } from 'app/actions/dev-tools';

import Menu from './Menu';

class TextSort extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
    };

    this.handleChangeKeyword = this.handleChangeKeyword.bind(this);
  }

  handleChangeKeyword(event) {
    this.setState({
      text: event.target.value,
    });
  }

  render() {
    const text = (
      <Fragment>
        <h1>
          <div className="flag">
            <span className="label">Dev Tools</span>
          </div>
          <span>Text Sort</span>
        </h1>
      </Fragment>
    );

    return (
      <Fragment>
        <Helmet>
          <title>Sujin | Dev Tools | Text Sort</title>
          <meta name="description" content="Developer's tool" />
          <meta property="og:title" content="Sujin | Dev Tools | Text Sort" />
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
            <p className="description">Sort input text</p>

            <textarea onChange={this.handleChangeKeyword} rows="10" />

            {this.state.text &&
              <textarea value={sortText(this.state.text)} rows="10" readOnly />
            }
          </article>
        </section>
      </Fragment>
    );
  }
}

export default TextSort;
