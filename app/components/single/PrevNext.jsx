import hash from 'object-hash';

import Link from 'app/components/router/Link';

const { Component } = wp.element;

class PrevNext extends Component {
  render() {
    const { prevnext } = this.props;

    return (
      <nav id="prev-next">
        {Object.keys(prevnext).map(key => {
          if (!prevnext[key]) {
            return null;
          }

          return (
            <Link
              to={prevnext[key].link}
              className={key}
              key={hash(key + prevnext[key].title)}
            >
              <i />
              {prevnext[key].title}
            </Link>
          );
        })}
      </nav>
    );
  }
}

export default PrevNext;
