import axios from 'axios';

import Public from 'app/scenes/Public';
import PageHeader from 'app/components/layout/PageHeader';
import Loading from 'app/components/layout/Loading';
import Content from 'app/components/single/Content';
import RecentPosts from 'app/components/single/RecentPosts';
import PrevNext from 'app/components/single/PrevNext';
import Item from 'app/components/archive/Item';
import NotFound from 'app/scenes/Public/NotFound';

import { STORE, IS_ERROR } from 'app/constants/common';
import { getRenderedText, parseJson } from 'app/utils/common';

import DEFAULT_BACKGROUND from '../../../assets/images/background/category.jpg';

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

    const backgroundImage =
      parseJson(post.meta.background, 'post-thumbnail') ||
      post.thumbnail ||
      DEFAULT_BACKGROUND;

    return (
      <Public className="template-single">
        <PageHeader backgroundImage={backgroundImage}>
          <Fragment>
            <h1>{getRenderedText(post.title)}</h1>
            <p dangerouslySetInnerHTML={{ __html: getRenderedText(post.excerpt) }} />
          </Fragment>
        </PageHeader>

        <section className="row">
          <Content post={post} className="large-9 medium-12">
            <aside id="single-footer">
              <PrevNext prevnext={post.prevnext} />

              <section id="related-posts">
                <header className="row">
                  <div className="columns small-12">
                    <h2 className="section-header">Related Posts</h2>
                  </div>
                </header>

                {post.related && (
                  <section className="post-grid row">
                    {post.related.map(related => (
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
