// TODO Title,

import MatchedController from 'app/types/matched';

import ArchiveController, { Types } from 'app/types/rest/archive';

import Public from 'app/scenes/public';
import PageHeader from 'app/components/layout/PageHeader';
import Item from 'app/components/archive/Item';
import Paging from 'app/components/archive/Paging';
import NotFound from 'app/scenes/public/NotFound';

const { Fragment, Component } = wp.element;

interface ArchiveMatched {
  type: Types;
  slug: string;
  page: number;
}

export default class Archive extends Component {
  static parseMatched(matched): ArchiveMatched {
    const type =
      (matched.category && Types.Category) ||
      (matched.tag && Types.Tag) ||
      (matched.search && Types.Search);
    const slug = matched[type];
    const page = parseInt((matched && matched.page) || 1, 10);

    return { type, slug, page };
  }

  componentDidMount(): void {
    const matched = MatchedController.getInstance().getMatched();
    const { type, slug, page } = Archive.parseMatched(matched);
    if (!slug) {
      return;
    }
    const archive = ArchiveController.getInstance(type, slug, page);
    if (!archive.isInit()) {
      archive.request(this);
    }
  }

  render(): JSX.Element {
    const matched = MatchedController.getInstance().getMatched();
    const { type, slug, page } = Archive.parseMatched(matched);
    if (!slug) {
      return null;
    }

    const archive = ArchiveController.getInstance(type, slug, page);

    if (!archive.isInit()) {
      return null;
    }

    if (archive.isLoading()) {
      return (
        <Public className="stretched-background hide-footer">
          <PageHeader isLoading />
        </Public>
      );
    }

    if (archive.isFailed()) {
      // @ts-ignore
      return (<NotFound />);
    }

    return (
      <Public className="template-archive">

        <PageHeader
          backgroundImage={archive.background}
          prefix={type}
          title={archive.title}
          description={archive.description.replace(/\+/g, ' ')}
        />

        {archive.getItems() && archive.getItems().length > 0 && (
          <Fragment>
            <section className="row post-grid">
              {archive.getItems().map((item) => (
                <Item item={item} key={`${type}-${slug}-${page}-${item.id}`} />
              ))}
            </section>

            <Paging
              entities={archive.getPaging()}
              currentPage={page}
              urlPrefix={`/${type}/${slug}`}
            />
          </Fragment>
        )}
      </Public>
    );
  }
}
