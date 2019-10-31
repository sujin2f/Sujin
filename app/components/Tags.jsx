import hash from 'object-hash';

import Link from 'app/components/router/Link';

const { Component } = wp.element;

class Tags extends Component {
  render() {
    const tags = this.props.tags || {};

    return (
      <ul className="tags">
        {Object.keys(tags).map((index) => (
          <li
            key={hash(`tag-id-${tags[index].term_id}`)}
            id={`tag-id-${tags[index].term_id}`}
          >
            <Link to={`/tag/${tags[index].slug}/page/1`}>
              {tags[index].name}
            </Link>
          </li>
        ))}
      </ul>
    );
  }
}

export default Tags;
