import SyntaxHighlighter from 'react-syntax-highlighter';
import { arduinoLight } from 'react-syntax-highlighter/styles/hljs';

import { symbolAlignment } from 'app/actions/dev-tools';

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
          <textarea id="sort-text" onChange={this.handleChangeText} rows="10" />

          {convertedText && (
            /* eslint-disable max-len */
            <SyntaxHighlighter style={arduinoLight} showLineNumbers>
              {convertedText}
            </SyntaxHighlighter>
            /* eslint-enable max-len */
          )}
        </article>
      </Fragment>
    );
  }
}

export default SymbolAlignment;
