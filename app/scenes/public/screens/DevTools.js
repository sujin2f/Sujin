import React, { Component } from 'react';
import { withRouter } from 'react-router';

import CaseTool from 'app/components/DevTools/CaseTool';
import TextSort from 'app/components/DevTools/TextSort';
import SymbolAlignment from 'app/components/DevTools/SymbolAlignment';

import GlobalFooter from 'app/components/Layout/GlobalFooter';

class DevTools extends Component {
  static serverFetch() {
    return {
      type: 'DONALD TRUMP',
    };
  }

  render() {
    return (
      <section className="template-dev-tools">
        <main className="page-wrapper">
          {!this.props.match.params.subMenu &&
            <CaseTool />
          }
          {this.props.match.params.subMenu === 'text-sort' &&
            <TextSort />
          }
          {this.props.match.params.subMenu === 'symbol-alignment' &&
            <SymbolAlignment />
          }
        </main>

        <GlobalFooter />
      </section>
    );
  }
}

export default withRouter(DevTools);
