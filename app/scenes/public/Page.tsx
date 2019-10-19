import RouteController from 'app/controllers/route';
import GlobalController from 'app/controllers/global';
import PostController from 'app/controllers/rest/post';

import Public from 'app/scenes/public';
import PageHeader from 'app/components/layout/PageHeader';
import Content from 'app/components/single/Content';
import NotFound from 'app/scenes/public/NotFound';

import { parseExImage } from 'app/utils/common';

import DEFAULT_BACKGROUND from '../../../assets/images/background/category.jpg';
import DEFAULT_BACKGROUND_MOBILE from '../../../assets/images/background/category-mobile.jpg';

const { Component } = wp.element;
const { compose } = wp.compose;

interface Props {
  matched;
  componentHash: string;
}

class Page extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.request = this.request.bind(this);
  }

  /*
   * Request Page
   */
  request(): void {
    const { matched } = this.props;

    // Check if Matched has changed || Post doesn't exist
    if (!matched.hasChanged(RouteController.getInstance().getMatched()) || !matched.slug) {
      return;
    }

    PostController.getInstance(matched.slug).request(this);
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
      return (<NotFound />);
    }

    GlobalController.getInstance().setTitle(post.getItem().title);

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
        />

        <section className="row">
          <Content post={post.getItem()} className="medium-12" />
        </section>
      </Public>
    );
  }
}

export default compose([])(Page);
