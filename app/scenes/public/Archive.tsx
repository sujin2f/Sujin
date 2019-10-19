import RouteController from 'app/controllers/route';
import GlobalController from 'app/controllers/global';
import ArchiveController from 'app/controllers/rest/archive';
import Types from 'app/types/rest/archive';

import Public from 'app/scenes/public';
import PageHeader from 'app/components/layout/PageHeader';
import Item from 'app/components/archive/Item';
import Paging from 'app/components/archive/Paging';
import NotFound from 'app/scenes/public/NotFound';

const { Fragment, Component } = wp.element;
const { compose } = wp.compose;

interface ArchiveMatched {
  type: Types;
  slug: string;
  page: number;
}

interface Props {
  matched;
  componentHash: string;
}

class Archive extends Component<Props> {
  static parseMatched(matched): ArchiveMatched {
    const type =
      (matched.category && Types.Category) ||
      (matched.tag && Types.Tag) ||
      (matched.search && Types.Search);
    const slug = matched[type];
    const page = parseInt((matched && matched.page) || 1, 10);

    return { type, slug, page };
  }

  constructor(props: Props) {
    super(props);
    this.request = this.request.bind(this);
  }

  /*
   * Request Archive
   */
  request(): void {
    const { matched } = this.props;

    // Check if Matched has changed
    if (!matched.hasChanged(RouteController.getInstance().getMatched())) {
      return;
    }

    const { type, slug, page } = Archive.parseMatched(matched);

    if (!slug) {
      return;
    }

    ArchiveController.getInstance(type, slug, page).request(this);
  }

  render(): JSX.Element {
    this.request();
    const { matched } = this.props;
    const { type, slug, page } = Archive.parseMatched(matched);
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
      return (<NotFound />);
    }

    GlobalController.getInstance().setTitle(`${type.toUpperCase()}: ${archive.title}`);

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

export default compose([])(Archive);
