import React, { Component } from 'react';

import CaseTool from 'app/components/dev-tools/CaseTool';
import TextSort from 'app/components/dev-tools/TextSort';
import SymbolAlignment from 'app/components/dev-tools/SymbolAlignment';

class DevTools extends Component {
  render() {
    const {
      match: {
        params: {
          subMenu,
        },
      },
    } = this.props;

    return (
      <section className="template-dev-tools">
        <main className="page-wrapper">
          {!subMenu &&
            <CaseTool />
          }
          {subMenu === 'text-sort' &&
            <TextSort />
          }
          {subMenu === 'symbol-alignment' &&
            <SymbolAlignment />
          }
        </main>

        <GlobalFooter />
      </section>
    );
  }
}

export default withRouter(DevTools);
