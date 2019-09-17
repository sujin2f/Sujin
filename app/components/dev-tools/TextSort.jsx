import SyntaxHighlighter from 'react-syntax-highlighter';
import { arduinoLight } from 'react-syntax-highlighter/styles/hljs';

import Link from 'app/components/router/Link';

import { sortText } from 'app/actions/dev-tools';

const { Fragment, Component } = wp.element;

class TextSort extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      checked: true,
    };

    this.handleChangeText = this.handleChangeText.bind(this);
    this.handleChangeCheckbox = this.handleChangeCheckbox.bind(this);
  }

  handleChangeText(event) {
    this.setState({
      text: event.target.value,
    });
  }

  handleChangeCheckbox(checked) {
    this.setState({
      checked: checked.target.checked,
    });
  }

  render() {
    const convertedText = this.state.text ? sortText(this.state.text, this.state.checked) : false;

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
          <label htmlFor="remove-empty">
            <input
              id="remove-empty"
              type="checkbox"
              onChange={this.handleChangeCheckbox}
              checked={this.state.checked}
            />
            Remove Empty Lines
          </label>
          <textarea id="sort-text" onChange={this.handleChangeText} rows="10" />

          {convertedText && (
            <SyntaxHighlighter
              style={arduinoLight}
              showLineNumbers
            >
              {convertedText}
            </SyntaxHighlighter>
          )}
        </article>
      </Fragment>
    );
  }
}

export default TextSort;
