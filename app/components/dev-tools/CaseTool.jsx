import Helmet from 'react-helmet';

import PageHeader from 'app/components/Layout/PageHeader';
import { DEV_TOOLS_IMAGE } from 'app/constants/thumbnail';

import preserveCase,
{
  camelCase,
  pascalCase,
  paramCase,
  snakeCase,
  constantCase,
  titleCase,
  pathCase,
  dotCase,
} from 'app/actions/dev-tools';

import Menu from './Menu';

const { Fragment, Component } = wp.element;

class CaseTool extends Component {
  constructor(props) {
    super(props);
    this.state = {
      converted: [],
    };

    this.handleChangeKeyword = this.handleChangeKeyword.bind(this);
    this.reset = this.reset.bind(this);
  }

  handleChangeKeyword(event) {
    this.setState({
      converted: preserveCase(event.target.value),
    });
  }

  reset(event) {
    event.preventDefault();
    this.setState({ converted: [] });
    document.getElementById('convert-keyword').value = '';
    document.getElementById('convert-keyword').focus();
  }

  render() {
    const text = (
      <Fragment>
        <h1>
          <div className="flag">
            <span className="label">Dev Tools</span>
          </div>
          <span>Case Tool</span>
        </h1>
      </Fragment>
    );

    return (
      <Fragment>
        <Helmet>
          <title>Sujin | Dev Tools | Case Tool</title>
          <meta name="description" content="Developer's tool" />
          <meta property="og:title" content="Sujin | Dev Tools | Case Tool" />
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
            <p className="description">Convert keyword into many cases.</p>

            <section className="input-group">
              <span className="input-group-label">Keyword</span>
              <input
                id="convert-keyword"
                className="input-group-field"
                type="text"
                onChange={this.handleChangeKeyword}
              />

              <div className="input-group-button">
                <input
                  type="submit"
                  className="button"
                  onClick={this.reset}
                  value="Reset"
                />
              </div>
            </section>

            {this.state.converted.length > 0 &&
              <dl className="row">
                <div className="columns large-6 medium-12">
                  <dt><span className="label">camelCase</span></dt>
                  <dd className="lead"><code>{camelCase(this.state.converted)}</code></dd>
                </div>

                <div className="columns large-6 medium-12">
                  <dt><span className="label">PascalCase</span></dt>
                  <dd className="lead"><code>{pascalCase(this.state.converted)}</code></dd>
                </div>

                <div className="columns large-6 medium-12">
                  <dt><span className="label">param-case</span></dt>
                  <dd className="lead"><code>{paramCase(this.state.converted)}</code></dd>
                </div>

                <div className="columns large-6 medium-12">
                  <dt><span className="label">snake_case</span></dt>
                  <dd className="lead"><code>{snakeCase(this.state.converted)}</code></dd>
                </div>

                <div className="columns large-6 medium-12">
                  <dt><span className="label">CONSTANT_CASE</span></dt>
                  <dd className="lead"><code>{constantCase(this.state.converted)}</code></dd>
                </div>

                <div className="columns large-6 medium-12">
                  <dt><span className="label">Title Case</span></dt>
                  <dd className="lead"><code>{titleCase(this.state.converted)}</code></dd>
                </div>

                <div className="columns large-6 medium-12">
                  <dt><span className="label">dotCase</span></dt>
                  <dd className="lead"><code>{dotCase(this.state.converted)}</code></dd>
                </div>

                <div className="columns large-6 medium-12">
                  <dt><span className="label">path/case</span></dt>
                  <dd className="lead"><code>{pathCase(this.state.converted)}</code></dd>
                </div>
              </dl>
            }
          </article>
        </section>
      </Fragment>
    );
  }
}

export default CaseTool;
