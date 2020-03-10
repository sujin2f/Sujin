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

// Vanilla TS
import { Carousel } from 'app/components/single/Carousel';
import { CLASS_NAME } from 'app/constants/dom';

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
  private carousels: Array<Carousel> = [];

  componentDidUpdate(): void {
    const carousels = document.getElementsByClassName(CLASS_NAME.carousel.CAROUSEL);

    if (carousels.length === 0) {
      return;
    }

    this.carousels = [];

    Array.from(carousels).forEach((element: HTMLElement): void => {
      this.carousels.push(new Carousel(element));
    });
  }

  getController(): IRestController {
    const slug = this.props.frontPage || null;
    return PostController.getInstance(slug).addComponent(this);
  }

  render(): JSX.Element {
    this.request();

    const { hideFrontFooter, hideFrontHeader } = this.props;
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

    const className = hideFrontFooter ? 'hide-footer' : '';

    return (
      <Public className={`template-single ${className}`}>
        {!hideFrontHeader && (
          <PageHeader
            backgroundImage={backgroundImage}
            title={title}
            description={excerpt}
            backgroundColor={meta['background-color']}
            useBackgroundColor={meta['use-background-color']}
          />
        )}

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
