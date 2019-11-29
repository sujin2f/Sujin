/**  app/scenes/public/Post */

import { WithController } from 'app/scenes/WithController';

// Controllers
import { IRestController } from 'app/controllers/rest';
import PostController from 'app/controllers/rest/post';

// Items
import { IPost } from 'app/items/rest/interface/post';

// Components
import Public from 'app/scenes/public';
import PageHeader from 'app/components/layout/PageHeader';
import Content from 'app/components/single/Content';
import RecentPosts from 'app/components/single/RecentPosts';
import RelatedPosts from 'app/components/single/RelatedPosts';
import PrevNext from 'app/components/single/PrevNext';
import NotFound from 'app/scenes/public/NotFound';

// Functions
import { parseExImage } from 'app/utils/common';

// Images
import DEFAULT_BACKGROUND from '../../../assets/images/background/category.jpg';
import DEFAULT_BACKGROUND_MOBILE from '../../../assets/images/background/category-mobile.jpg';

// Wordpress
const { compose } = wp.compose;
const { Fragment } = wp.element;

/*
 * //domain.com/2020/01/01/slug
 */
class Post extends WithController {
  getController(): IRestController {
    return PostController.getInstance().addComponent(this);
  }

  render(): JSX.Element {
    this.request();
    const isPending = this.isPending();

    switch (isPending) {
      case 'init':
        return (
          <Fragment />
        );
      case 'loading':
        return (
          <Public className="stretched-background hide-footer">
            <PageHeader isLoading />
          </Public>
        );
      case 'failed':
        return (
          <NotFound />
        );
      default:
        break;
    }

    const post: IPost = this.getController().entity;

    const {
      title,
      excerpt,
      thumbnail,
      meta,
      prevNext,
      related,
    } = post;

    this.setTitle(post.title);

    const backgroundImage =
      parseExImage(
        meta.background,
        thumbnail,
        'large',
        'medium',
        DEFAULT_BACKGROUND,
        DEFAULT_BACKGROUND_MOBILE,
      );

    return (
      <Public className="template-single">
        <PageHeader
          backgroundImage={backgroundImage}
          title={title}
          description={excerpt}
          backgroundColor={meta.backgroundColor}
          useBackgroundColor={meta.useBackgroundColor}
        />

        <section className="row">
          <Content post={post} className="large-9 medium-12">
            <aside id="single-footer">
              <PrevNext prevNext={prevNext} />

              <section id="related-posts">
                <RelatedPosts items={related} />
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
