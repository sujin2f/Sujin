import axios from 'axios';

import { default as PostType } from 'app/types/responses/post';

import Public from 'app/scenes/public';
import PageHeader from 'app/components/layout/PageHeader';
import Content from 'app/components/single/Content';
import RecentPosts from 'app/components/single/RecentPosts';
import RelatedPosts from 'app/components/single/RelatedPosts';
import PrevNext from 'app/components/single/PrevNext';
import NotFound from 'app/scenes/public/NotFound';

import { STORE } from 'app/constants/common';
import { parseExImage } from 'app/utils/common';

import DEFAULT_BACKGROUND from '../../../assets/images/background/category.jpg';
import DEFAULT_BACKGROUND_MOBILE from '../../../assets/images/background/category-mobile.jpg';

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

    if (!slug || state.slug === slug || typeof props.getPost(slug) !== 'undefined') {
      return { slug };
    }

    props.requestPost(slug);
    return { slug };
  }

  getLoading() {
    const post = this.props.getPost(this.state.slug);

    if (post === true) {
      return (
        <Public className="stretched-background hide-footer">
          <PageHeader isLoading />
        </Public>
      );
    }

    return null;
  }

  getNotFound() {
    const post = this.props.getPost(this.state.slug);

    if (post === false) {
      return (<NotFound />);
    }

    return null;
  }

  setTitle() {
    const post = this.props.getPost(this.state.slug);
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

    const post = this.props.getPost(this.state.slug);

    const backgroundImage =
      parseExImage(
        post.meta.background,
        post.thumbnail,
        'medium_large',
        'post-thumbnail',
        DEFAULT_BACKGROUND,
        DEFAULT_BACKGROUND_MOBILE,
      );

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
                <RelatedPosts items={post.related} />
              </section>
            </aside>
          </Content>

          <aside id="recent-posts" className="columns large-3 show-for-large">
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
  title: select(STORE).getTitle(),
}));

const mapDispatchToProps = withDispatch((dispatch) => ({
  requestPost: (slug) => {
    dispatch(STORE).requestPostInit(slug);

    axios.get(`/wp-json/sujin/v1/posts/?slug=${slug}`)
      .then((response) => {
        const page = new PostType(response.data);
        dispatch(STORE).requestPostSuccess(page);
      }).catch((error) => {
        dispatch(STORE).requestPostFail(slug);
      });
  },
  setTitle: (title) => {
    dispatch(STORE).setTitle(title);
  },
}));

export default compose([mapStateToProps, mapDispatchToProps])(Post);
