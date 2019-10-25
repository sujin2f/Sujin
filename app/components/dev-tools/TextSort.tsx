import Link from 'app/components/router/Link';

import { sortText } from 'app/utils/dev-tools';

const { Fragment, Component } = wp.element;

class TextSort extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: true,
      text: '',
    };

    this.handleChangeText = this.handleChangeText.bind(this);
    this.handleChangeCheckbox = this.handleChangeCheckbox.bind(this);
  }

  handleChangeText(event): void {
    this.setState({
      text: event.target.value,
    });
  }

  handleChangeCheckbox(checked): void {
    this.setState({
      checked: checked.target.checked,
    });
  }

  render(): JSX.Element {
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

export default TextSort;
