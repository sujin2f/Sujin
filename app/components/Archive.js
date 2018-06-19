import React, { Component, Fragment } from 'react';
import Helmet from 'react-helmet';

import Paging from 'app/components/Archive/Paging';
import ArchiveEntity from 'app/components/Archive/ArchiveEntity';
import PageHeader from 'app/components/Layout/PageHeader';
import Loading from 'app/components/Common/Loading';
import { DEFAULT_CATEGORY_IMAGE } from 'app/constants/thumbnail';

class Archive extends Component {
  componentDidMount() {
    const {
      push,
      params,
      cancelToken,
      getPosts,
      resetMobileMenu,
    } = this.props;

    getPosts(params, push, cancelToken);
    resetMobileMenu();
  }

  componentWillReceiveProps(nextProps) {
    const update = this.props.params.category !== nextProps.params.category
      || this.props.params.tag !== nextProps.params.tag
      || this.props.params.searchString !== nextProps.params.searchString
      || this.props.params.paged !== nextProps.params.paged;

    if (update) {
      nextProps.getPosts(nextProps.params, nextProps.push, nextProps.cancelToken);
      nextProps.resetMobileMenu();
    }
  }

  render() {
    if (this.props.loading) {
      return (<PageHeader text={<Loading />} />);
    }

    const {
      entities,
      title,
      description,
      background,
      totalPage,
      label,
    } = this.props;

    const descriptionString = description
      .replace(/<p>|<\/p>/g, '')
      .replace(/\+/g, ' ')
      .replace(/\n/g, '<br />');

    const withoutDate = title === 'Portfolio';

    const flagString = label && label.charAt(0).toUpperCase() + label.slice(1);

    const text = (
      <Fragment>
        <h1>
          {flagString &&
            <div className="flag">
              <span className="label">{flagString}</span>
            </div>
          }
          <span>{title}</span>
        </h1>
        <p dangerouslySetInnerHTML={{ __html: descriptionString }} />
      </Fragment>
    );

    return (
      <Fragment>
        <Helmet>
          <title>Sujin | {title}</title>
          <meta name="description" content={descriptionString.replace(/<(?:.|\n)*?>/gm, '')} />
          <meta property="og:title" content={`Sujin | ${title}`} />
          <meta property="og:image" content={background || DEFAULT_CATEGORY_IMAGE} />
        </Helmet>

        <PageHeader
          style={{ backgroundImage: `url(${background || DEFAULT_CATEGORY_IMAGE})` }}
          text={text}
          />

        <section className="post-grid row large-up-3 medium-up-2 medium-up-1">
          {entities.map(post => (
            <ArchiveEntity
              key={`post-id-${post.id}`}
              id={`post-id-${post.id}`}
              className={withoutDate && 'without-date'}
              entity={post}
            />
          ))}
        </section>

        <Paging totalPage={totalPage} />
      </Fragment>
    );
  }
}

export default Archive;
