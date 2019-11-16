import GlobalController from 'app/controllers/global';
import PostController from 'app/controllers/rest/post';

import Public from 'app/scenes/public';
import PageHeader from 'app/components/layout/PageHeader';
import Content from 'app/components/single/Content';
import Base from 'app/scenes/public/Base';

import { parseExImage } from 'app/utils/common';

import DEFAULT_BACKGROUND from '../../../assets/images/background/category.jpg';
import DEFAULT_BACKGROUND_MOBILE from '../../../assets/images/background/category-mobile.jpg';

const { compose } = wp.compose;

class Page extends Base {
  render(): JSX.Element {
    const { hideFrontFooter, hideFrontHeader, frontPage } = this.props;
    const post = PostController.getInstance(frontPage).addComponent(this).request();
    const pendingComponent = this.getPendingComponent(post.init, post.loading, post.failed);

    if (pendingComponent) {
      return pendingComponent;
    }

    GlobalController.getInstance().setTitle(post.entity.title);

    const backgroundImage =
      parseExImage(
        post.entity.meta.background,
        post.entity.thumbnail,
        'medium_large',
        'post-thumbnail',
        DEFAULT_BACKGROUND,
        DEFAULT_BACKGROUND_MOBILE,
      );

    // TODO 'stretched-background'

    const className = hideFrontFooter ? 'hide-footer template-single' : 'template-single';
    return (
      <Public className={className}>
        {!hideFrontHeader && (
          <PageHeader
            backgroundImage={backgroundImage}
            title={post.entity.title}
            description={post.entity.excerpt}
          />
        )}

        <section className="row">
          <Content post={post.entity} className="medium-12" />
        </section>
      </Public>
    );
  }
}

export default compose([])(Page);
