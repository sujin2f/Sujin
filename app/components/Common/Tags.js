import React, { Component } from 'react';

import Link from 'src/components/Link';

class Tags extends Component {
  render() {
    const tags = this.props.tags || {};

    return (
      <ul className="tags">
        {Object.keys(tags).map(index => (
          <li
            key={`tag-id-${tags[index].term_id}`}
            id={`tag-id-${tags[index].term_id}`}
          >
            <Link href={`/tag/${tags[index].slug}/page/1`}>
              {tags[index].name}
            </Link>
          </li>
        ))}
      </ul>
    );
  }
}

export default Tags;
