import { symbolAlignment } from 'app/utils/dev-tools';

import Link from 'app/components/router/Link';

const { Fragment, Component } = wp.element;

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

  handleChangeText(event): void {
    this.setState({
      text: event.target.value,
    });
  }

  handleChangeSymbol(event): void {
    this.setState({
      symbol: event.target.value,
    });
  }

  render(): JSX.Element {
    const convertedText =
      this.state.text ?
        symbolAlignment(this.state.text, this.state.symbol) :
        false;

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
          <textarea id="sort-text" onChange={this.handleChangeText} rows={10} />

          {convertedText && (
            <pre>
              {convertedText}
            </pre>
          )}
        </article>
      </Fragment>
    );
  }
}

export default SymbolAlignment;
