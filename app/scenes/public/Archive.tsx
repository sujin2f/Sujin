import GlobalController from 'app/controllers/global';
import ArchiveController from 'app/controllers/rest/archive';

import Base from 'app/scenes/public/Base';
import Public from 'app/scenes/public';
import PageHeader from 'app/components/layout/PageHeader';
import Item from 'app/components/archive/Item';
import Paging from 'app/components/archive/Paging';

import { parseExImage } from 'app/utils/common';

import DEFAULT_BACKGROUND from '../../../assets/images/background/category.jpg';
import DEFAULT_BACKGROUND_MOBILE from '../../../assets/images/background/category-mobile.jpg';

const { Fragment } = wp.element;
const { compose } = wp.compose;

class Archive extends Base {
  render(): JSX.Element {
    const archive = ArchiveController.getInstance().addComponent(this).request();
    const pendingComponent = this.getPendingComponent(archive.init, archive.loading, archive.failed);

    if (pendingComponent) {
      return pendingComponent;
    }

    GlobalController.getInstance().setTitle(`${archive.type}: ${archive.title}`);

    const backgroundImage =
      parseExImage(
        archive.background,
        archive.background,
        'large',
        'medium',
        DEFAULT_BACKGROUND,
        DEFAULT_BACKGROUND_MOBILE,
      );

    return (
      <Public className="template-archive">
        <PageHeader
          backgroundImage={backgroundImage}
          prefix={archive.type}
          title={archive.title}
          description={archive.description.replace(/\+/g, ' ')}
        />

        {archive.entities && archive.entities.length > 0 && (
          <Fragment>
            <section className="row post-grid">
              {archive.entities.map((item) => (
                <Item item={item} key={`${archive.type}-${archive.slug}-${archive.page}-${item.id}`} />
              ))}
            </section>

            <Paging
              entities={archive.getPaging()}
              currentPage={archive.page}
              urlPrefix={`/${archive.type}/${archive.slug}`}
            />
          </Fragment>
        )}
      </Public>
    );
  }
}

export default compose([])(Archive);
