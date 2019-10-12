import { empty, MatchedController } from 'app/types/matched';

import { PostController } from 'app/types/rest/post';

import { STORE } from 'app/constants/common';

import Public from 'app/scenes/public';
import PageHeader from 'app/components/layout/PageHeader';
import Content from 'app/components/single/Content';
import RecentPosts from 'app/components/single/RecentPosts';
import RelatedPosts from 'app/components/single/RelatedPosts';
import PrevNext from 'app/components/single/PrevNext';
import NotFound from 'app/scenes/public/NotFound';

import { parseExImage } from 'app/utils/common';

import DEFAULT_BACKGROUND from '../../../assets/images/background/category.jpg';
import DEFAULT_BACKGROUND_MOBILE from '../../../assets/images/background/category-mobile.jpg';

const { withDispatch, withSelect } = wp.data;
const { compose } = wp.compose;
const { Component } = wp.element;

interface Props {
  path: string;
  title: string;
  setTitle(title: string): void;
}

class Post extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.setTitle = this.setTitle.bind(this);
  }

  componentDidMount(): void {
    console.log('componentDidMount');
    const matched = MatchedController.getInstance().getMatched() || empty;
    const post = PostController.getInstance(matched.slug);
    if (matched.slug && !post.isInit()) {
      post.request(this);
    }
  }

  setTitle(): void {
    console.log('setTitle');
    const matched = MatchedController.getInstance().getMatched() || empty;
    const post = PostController.getInstance(matched.slug);
    const { title, setTitle } = this.props;

    if (title !== post.getItem().title) {
      setTitle(post.getItem().title);
    }
  }

  render(): JSX.Element {
    console.log('render');
    const matched = MatchedController.getInstance().getMatched() || empty;
    const post = PostController.getInstance(matched.slug);

    if (!post.isInit()) {
      return null;
    }

    if (post.isLoading()) {
      return (
        <Public className="stretched-background hide-footer">
          <PageHeader isLoading />
        </Public>
      );
    }

    if (post.isFailed()) {
      return (<NotFound />);
    }

    this.setTitle();

    const backgroundImage: string =
      parseExImage(
        post.getItem().meta.background,
        post.getItem().thumbnail,
        'medium_large',
        'post-thumbnail',
        DEFAULT_BACKGROUND,
        DEFAULT_BACKGROUND_MOBILE,
      );

    return (
      <Public className="template-single">
        <PageHeader
          backgroundImage={backgroundImage}
          title={post.getItem().title}
          description={post.getItem().excerpt}
          backgroundColor={post.getItem().meta['background-color']}
          useBackgroundColor={post.getItem().meta['use-background-color']}
        />

        <section className="row">
          <Content post={post.getItem()} className="large-9 medium-12">
            <aside id="single-footer">
              <PrevNext prevnext={post.getItem().prevnext} />

              <section id="related-posts">
                <RelatedPosts items={post.getItem().related} />
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
  title: select(STORE).getTitle(),
}));

const mapDispatchToProps = withDispatch((dispatch) => ({
  setTitle: (title): void => {
    dispatch(STORE).setTitle(title);
  },
}));

export default compose([mapStateToProps, mapDispatchToProps])(Post);
