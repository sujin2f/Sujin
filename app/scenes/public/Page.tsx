import { PostController } from 'app/types/rest/post';

import { STORE } from 'app/constants/common';

import Public from 'app/scenes/public';
import PageHeader from 'app/components/layout/PageHeader';
import Content from 'app/components/single/Content';
import NotFound from 'app/scenes/public/NotFound';

import { parseExImage } from 'app/utils/common';

import DEFAULT_BACKGROUND from '../../../assets/images/background/category.jpg';
import DEFAULT_BACKGROUND_MOBILE from '../../../assets/images/background/category-mobile.jpg';

const { withDispatch, withSelect } = wp.data;
const { compose } = wp.compose;
const { Component } = wp.element;

interface Props {
  // select
  matched: any;
  title: string;
  // props
  setTitle(title: string): void;
};

class Page extends Component<Props> {
  constructor(props) {
    super(props);
    this.setTitle = this.setTitle.bind(this);
  }

  componentDidMount() {
    const post = PostController.getInstance(this.props.matched.slug);
    if (!post.isInit()) {
      post.request(this);
    }
  }

  setTitle(): void {
    const post = PostController.getInstance(this.props.matched.slug);
    const { title, setTitle } = this.props;

    if (title !== post.getItem().title) {
      setTitle(post.getItem().title);
    }
  }

  render() {
    const post = PostController.getInstance(this.props.matched.slug);

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

    this.setTitle();

    const backgroundImage: string =
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

const mapStateToProps = withSelect((select) => ({
  matched: select(STORE).getMatched(),
  title: select(STORE).getTitle(),
}));

const mapDispatchToProps = withDispatch((dispatch) => ({
  setTitle: (title: string): void => {
    dispatch(STORE).setTitle(title);
  },
}));

export default compose([mapStateToProps, mapDispatchToProps])(Page);
