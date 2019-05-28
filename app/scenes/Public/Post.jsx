import axios from 'axios';

import Public from 'app/scenes/Public';
import PageHeader from 'app/components/layout/PageHeader';
import Loading from 'app/components/layout/Loading';
import Content from 'app/components/single/Content';
import RecentPosts from 'app/components/single/RecentPosts';
import Item from 'app/components/archive/Item';
import Link from 'app/components/router/Link';
import NotFound from 'app/scenes/Public/NotFound';

import { STORE, IS_ERROR } from 'app/constants/common';

import { getRenderedText, parseJson } from 'app/utils/common';

const { withDispatch, withSelect } = wp.data;
const { compose } = wp.compose;
const { Fragment, Component } = wp.element;

class Post extends Component {
  constructor(props) {
    super(props);

    this.state = {
      slug: false,
    };
  }

  static getDerivedStateFromProps(props, state) {
    const slug = props.matched.postSlug;


    if (!slug || state.slug === slug || props.getPost(slug).post) {
      return { slug };
    }

    props.requestPost(slug);
    return { slug };
  }

  render() {
    if (!this.state.slug) {
      return null;
    }

    const {
      post,
      loading,
    } = this.props.getPost(this.state.slug);

    if (loading) {
      return (
        <Public className="stretched-background hide-footer">
          <PageHeader>
            <Loading />
          </PageHeader>
        </Public>
      );
    }

    if (IS_ERROR === post) {
      return (
        <NotFound />
      );
    }

    const backgroundImage = parseJson(post.meta.background);

    return (
      <Public className="template-single">
        <PageHeader backgroundImage={backgroundImage.large}>
          <Fragment>
            <h1>{getRenderedText(post.title)}</h1>
            <p>{getRenderedText(post.excerpt)}</p>
          </Fragment>
        </PageHeader>

        <section className="row">
          <Content post={post} className="large-9 medium-12">
            <aside id="single-footer">
              <nav>
                {post.prevnext && (
                  <ul className="row" id="single-pager">
                    {post.prevnext.prev && (
                      <li className="small-12 medium-6 columns prev">
                        <Link href={post.prevnext.prev.link}>
                          <i className="fa fa-chevron-left" aria-hidden="true" />
                          <span>{post.prevnext.prev.title}</span>
                        </Link>
                      </li>
                    )}
                    {!post.prevnext.prev && (
                      <li className="small-12 medium-6 columns prev" />
                    )}
                    {post.prevnext.next && (
                      <li className="small-12 medium-6 columns next">
                        <Link href={post.prevnext.next.link}>
                          <i className="fa fa-chevron-right" aria-hidden="true" />
                          <span>{post.prevnext.next.title}</span>
                        </Link>
                      </li>
                    )}
                  </ul>
                )}
              </nav>

              <section id="related-posts">
                <header className="row">
                  <div className="columns small-12">
                    <h2 className="section-header">Related Posts</h2>
                  </div>
                </header>

                {post.related.data && (
                  <section className="post-grid row">
                    {post.related.data.map(related => (
                      <Item
                        item={related}
                        key={`related--${related.id}`}
                        columns="large-3 medium-6 small-12"
                      />
                    ))}
                  </section>
                )}
              </section>
            </aside>
          </Content>

          <aside id="recent-posts" className="columns large-3 show-for-large">
            <header>
              <h2 className="section-header">Recent Posts</h2>
            </header>

            <RecentPosts />
          </aside>
        </section>
      </Public>
    );
  }
}

const mapStateToProps = withSelect((select) => ({
  getPost: (slug) => select(STORE).getPost(slug),
  matched: select(STORE).getMatched(),
}));

const mapDispatchToProps = withDispatch((dispatch) => ({
  requestPost: (slug) => {
    dispatch(STORE).requestPostInit(slug);

    axios.get(`/wp-json/sujin/v1/posts/slug/?slug=${slug}`)
      .then((response) => {
        dispatch(STORE).requestPostSuccess(slug, response);
      }).catch(() => {
        dispatch(STORE).requestPostFail(slug);
      });
  },
}));

export default compose([mapStateToProps, mapDispatchToProps])(Post);