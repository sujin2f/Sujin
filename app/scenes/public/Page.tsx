/**  app/scenes/public/Page */

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
 * //domain.com/page
 */
class Page extends WithController {
  getController(): IRestController {
    return PostController.getInstance().addComponent(this);
  }

  render(): JSX.Element {
    this.request();

    const { hideFrontFooter, hideFrontHeader, frontPage } = this.props;
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
    } = post;

    this.setTitle(title);

    const backgroundImage =
      parseExImage(
        meta.background,
        thumbnail,
        'large',
        'medium',
        DEFAULT_BACKGROUND,
        DEFAULT_BACKGROUND_MOBILE,
      );

    // @todo 'stretched-background'
    // @ref  https://css-tricks.com/the-trick-to-viewport-units-on-mobile/

    const className = hideFrontFooter ? 'hide-footer' : '';

    return (
      <Public className={`template-single ${className}`}>
        {!hideFrontHeader && (
          <PageHeader
            backgroundImage={backgroundImage}
            title={title}
            description={excerpt}
          />
        )}

        <section className="row">
          <Content post={post} className="medium-12" />
        </section>
      </Public>
    );
  }
}

export default compose([])(Page);
