import axios from 'axios';

import Public from 'app/scenes/public';
import PageHeader from 'app/components/layout/PageHeader';
import Content from 'app/components/single/Content';
import RecentPosts from 'app/components/single/RecentPosts';
import PrevNext from 'app/components/single/PrevNext';
import Item from 'app/components/archive/Item';
import NotFound from 'app/scenes/public/NotFound';

import { STORE } from 'app/constants/common';
import { parseJson } from 'app/utils/common';

import DEFAULT_BACKGROUND from '../../../assets/images/background/category.jpg';

const { withDispatch, withSelect } = wp.data;
const { compose } = wp.compose;
const { Component } = wp.element;

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = { slug: false };

    this.getLoading = this.getLoading.bind(this);
    this.getNotFound = this.getNotFound.bind(this);
    this.setTitle = this.setTitle.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    const slug = props.matched.postSlug;

    if (!slug || state.slug === slug || props.getPost(slug).post) {
      return { slug };
    }

    props.requestPost(slug);
    return { slug };
  }

  getLoading() {
    const { loading } = this.props.getPost(this.state.slug);

    if (loading) {
      return (
        <Public className="stretched-background hide-footer">
          <PageHeader isLoading />
        </Public>
      );
    }

    return null;
  }

  getNotFound() {
    const { post } = this.props.getPost(this.state.slug);

    if (post === 'NOT_FOUND') {
      return (<NotFound />);
    }

    return null;
  }

  setTitle() {
    const { post } = this.props.getPost(this.state.slug);
    const { title, setTitle } = this.props;

    if (title !== post.title) {
      setTitle(post.title);
    }
  }

  render() {
    if (!this.state.slug) {
      return null;
    }

    const loading = this.getLoading();
    if (loading) {
      return loading;
    }

    const notFound = this.getNotFound();
    if (notFound) {
      return notFound;
    }

    this.setTitle();

    const { post } = this.props.getPost(this.state.slug);

    const backgroundImage = parseJson(post.meta.background, 'post-thumbnail') ||
      post.thumbnail ||
      DEFAULT_BACKGROUND;

    return (
      <Public className="template-single">
        <PageHeader
          backgroundImage={backgroundImage}
          title={post.title}
          description={post.excerpt}
          backgroundColor={post.meta['background-color']}
          useBackgroundColor={post.meta['use-background-color']}
        />

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

          <RecentPosts />
        </section>
      </Public>
    );
  }
}

const mapStateToProps = withSelect((select) => ({
  getPost: (slug) => select(STORE).getPost(slug),
  matched: select(STORE).getMatched(),
  title: select(STORE).getTitle(),
}));

const mapDispatchToProps = withDispatch((dispatch) => ({
  requestPost: (slug) => {
    dispatch(STORE).requestPostInit(slug);

    axios.get(`/wp-json/sujin/v1/posts/?slug=${slug}`)
      .then((response) => {
        dispatch(STORE).requestPostSuccess(slug, response);
      }).catch((error) => {
        dispatch(STORE).requestPostFail(error.response.data.code, slug);
      });
  },
  setTitle: (title) => {
    dispatch(STORE).setTitle(title);
  },
}));

export default compose([mapStateToProps, mapDispatchToProps])(Post);
