import MatchedController from 'app/types/matched';
import TitleController from 'app/types/title';

import { PostController } from 'app/types/rest/post';

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

const { Component } = wp.element;

interface Props {
  matched;
  componentHash: string;
}

export default class Post extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.request = this.request.bind(this);
  }

  /*
   * Request Post
   */
  request(): void {
    const { matched } = this.props;

    // Check if Matched has changed
    if (matched.hasChanged(MatchedController.getInstance().getMatched())) {
      const post = PostController.getInstance(matched.slug);

      // Post doesn't exist
      if (matched.slug && !post.isInit()) {
        post.request(this);
      }
    }
  }

  render(): JSX.Element {
    this.request();
    const { matched } = this.props;
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
      // @ts-ignore
      return (<NotFound />);
    }

    TitleController.getInstance().setTitle(post.getItem().title);

    const backgroundImage =
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
