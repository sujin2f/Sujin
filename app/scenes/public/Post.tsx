import GlobalController from 'app/controllers/global';
import PostController from 'app/controllers/rest/post';

import Base from 'app/scenes/public/Base';
import Public from 'app/scenes/public';
import PageHeader from 'app/components/layout/PageHeader';
import Content from 'app/components/single/Content';
import RecentPosts from 'app/components/single/RecentPosts';
import RelatedPosts from 'app/components/single/RelatedPosts';
import PrevNext from 'app/components/single/PrevNext';

import { parseExImage } from 'app/utils/common';

import DEFAULT_BACKGROUND from '../../../assets/images/background/category.jpg';
import DEFAULT_BACKGROUND_MOBILE from '../../../assets/images/background/category-mobile.jpg';

const { compose } = wp.compose;

class Post extends Base {
  render(): JSX.Element {
    const post = PostController.getInstance().addComponent(this).request();
    const pendingComponent = this.getPendingComponent(post.init, post.loading, post.failed);

    if (pendingComponent) {
      return pendingComponent;
    }

    GlobalController.getInstance().setTitle(post.entity.title);

    const backgroundImage =
      parseExImage(
        post.entity.meta.background,
        post.entity.thumbnail,
        'large',
        'medium',
        DEFAULT_BACKGROUND,
        DEFAULT_BACKGROUND_MOBILE,
      );

    return (
      <Public className="template-single">
        <PageHeader
          backgroundImage={backgroundImage}
          title={post.entity.title}
          description={post.entity.excerpt}
          backgroundColor={post.entity.meta.backgroundColor}
          useBackgroundColor={post.entity.meta.useBackgroundColor}
        />

        <section className="row">
          <Content post={post.entity} className="large-9 medium-12">
            <aside id="single-footer">
              <PrevNext prevNext={post.entity.prevNext} />

              <section id="related-posts">
                <RelatedPosts items={post.entity.related} />
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

export default compose([])(Post);
