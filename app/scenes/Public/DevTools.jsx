import Public from 'app/scenes/public';
import PageHeader from 'app/components/layout/PageHeader';

import CaseTool from 'app/components/dev-tools/CaseTool';
import TextSort from 'app/components/dev-tools/TextSort';
import SymbolAlignment from 'app/components/dev-tools/SymbolAlignment';

const { Component } = wp.element;

class DevTools extends Component {
  render() {
    const subMenu = this.props.matched && this.props.matched.subMenu;

    return (
      <Public className="template-single template-dev-tools">
        <PageHeader backgroundImage="">
          <h1>Dev Too;</h1>
          <p>Yahoo</p>
        </PageHeader>

        <section className="row">
          <div className="medium-12">
            {!subMenu &&
              <CaseTool />
            }
            {subMenu === 'text-sort' &&
              <TextSort />
            }
            {subMenu === 'symbol-alignment' &&
              <SymbolAlignment />
            }
          </div>
        </section>
      </Public>
    );
  }
}

export default DevTools;
