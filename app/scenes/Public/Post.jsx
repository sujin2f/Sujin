import axios from 'axios';

import Public from 'app/scenes/Public';
import PageHeader from 'app/components/layout/PageHeader';
import Loading from 'app/components/layout/Loading';
import Content from 'app/components/single/Content';
import RecentPosts from 'app/components/single/RecentPosts';

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
    const slug = props.match.postSlug;


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
        <Public className="template-single">
          <PageHeader>
            <Loading />
          </PageHeader>
        </Public>
      );
    }

    if (IS_ERROR === post) {
      return (
        <Public className="template-single">
          <PageHeader>
            <h1>Error Reading Content</h1>
            <p>Please try it again</p>
          </PageHeader>
        </Public>
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
          <Content post={post} className="large-9 medium-12" />

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
}));

const mapDispatchToProps = withDispatch((dispatch) => ({
  requestPost: (slug) => {
    dispatch(STORE).requestPostInit(slug);
    console.log(slug);

    axios.get(`/wp-json/sujin/v1/posts/${slug}`)
      .then((response) => {
        dispatch(STORE).requestPostSuccess(slug, response);
      }).catch(() => {
        dispatch(STORE).requestPostFail(slug);
      });
  },
}));

export default compose([mapStateToProps, mapDispatchToProps])(Post);
