import MatchedController from 'app/types/matched';
import TitleController from 'app/types/title';

import { PostController } from 'app/types/rest/post';

import Public from 'app/scenes/public';
import PageHeader from 'app/components/layout/PageHeader';
import Content from 'app/components/single/Content';
import NotFound from 'app/scenes/public/NotFound';

import { parseExImage } from 'app/utils/common';

import DEFAULT_BACKGROUND from '../../../assets/images/background/category.jpg';
import DEFAULT_BACKGROUND_MOBILE from '../../../assets/images/background/category-mobile.jpg';

const { Component } = wp.element;

export default class Page extends Component {
  componentDidMount(): void {
    const matched = MatchedController.getInstance().getMatched();
    const post = PostController.getInstance(matched.slug);
    if (matched.slug && !post.isInit()) {
      post.request(this);
    }
  }

  render(): JSX.Element {
    const matched = MatchedController.getInstance().getMatched();
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
      // @ts-ignore
      return (<NotFound />);
    }

    TitleController.getInstance().setTitle(post.getItem().title);

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
