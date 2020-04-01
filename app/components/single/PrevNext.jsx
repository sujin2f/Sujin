import hash from 'object-hash';

import Link from 'app/components/router/Link';

const { Component } = wp.element;

class PrevNext extends Component {
  render() {
    const { prevNext } = this.props;

    return (
      <nav id="prev-next">
        {Object.keys(prevNext).map((key) => {
          if (!prevNext[key]) {
            return null;
          }

          return (
            <Link
              to={prevNext[key].link}
              className={key}
              key={hash(key + prevNext[key].title)}
            >
              <i />
              {prevNext[key].title}
            </Link>
          );
        })}
      </nav>
    );
  }
}

export default PrevNext;
