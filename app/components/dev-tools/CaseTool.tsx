import {
  preserveCase,
  camelCase,
  pascalCase,
  paramCase,
  snakeCase,
  constantCase,
  titleCase,
  pathCase,
  dotCase,
} from 'app/utils/dev-tools';

import Link from 'app/components/router/Link';

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

  handleChangeKeyword(event): void {
    this.setState({
      converted: preserveCase(event.target.value),
    });
  }

  reset(event): void {
    event.preventDefault();
    this.setState({ converted: [] });

    this.refs.convertKeyword.value = '';
    this.refs.convertKeyword.focus();
  }

  render(): JSX.Element {
    return (
      <Fragment>
        <aside className="columns large-3 medium-12">
          <ul>
            <li>
              <Link to="/dev-tools" rel="noopener noreferrer">
                Case Tool
              </Link>
            </li>
            <li>
              <Link to="/text-sort" rel="noopener noreferrer">
                Text Sort
              </Link>
            </li>
            <li>
              <Link to="/symbol-alignment" rel="noopener noreferrer">
                Symbol Alignment
              </Link>
            </li>
          </ul>
        </aside>

        <article className="columns large-9 medium-12">
          <p className="description">Convert keyword into many cases.</p>

          <section className="input-group">
            <span className="input-group-label">Keyword</span>
            <input
              id="convert-keyword"
              className="input-group-field"
              type="text"
              ref="convertKeyword"
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

          {this.state.converted.length > 0 && (
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
          )}
        </article>
      </Fragment>
    );
  }
}

export default CaseTool;
