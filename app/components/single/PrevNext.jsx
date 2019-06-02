import hash from 'object-hash';

import Link from 'app/components/router/Link';

const { Component } = wp.element;

class PrevNext extends Component {
  render() {
    const { prevnext } = this.props;
    console.log(prevnext);

    return (
      <nav id="prev-next">
        {Object.keys(prevnext).map(key => {
          if (!prevnext[key]) {
            return null;
          }

          return (
            <Link
              href={prevnext[key].link}
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
