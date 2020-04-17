/**  app/scenes/public/Post */

// Items
import { IPost } from 'app/items/rest/interface/post';

// Components
import { Public } from 'app/scenes/public';
import PageHeader from 'app/components/layout/PageHeader';
import Content from 'app/components/single/Content';
import RelatedPosts from 'app/components/single/RelatedPosts';
import PrevNext from 'app/components/single/PrevNext';
import NotFound from 'app/scenes/public/NotFound';
import SingleAside from 'app/components/single/SingleAside';

import SocialShare from 'app/components/single/SocialShare';
import Tags from 'app/components/Tags';

// Functions
import { parseExImage } from 'app/utils/common';

// Vanilla TS
import { Carousel } from 'app/components/single/Carousel';
import { CLASS_NAME } from 'app/constants/dom';

import RouteController from 'app/controllers/route';
import { usePost } from 'app/hooks/usePost';
import { HTTP_RESPONSE_NO_CONTENT } from 'app/constants/common';

// Images
import DEFAULT_BACKGROUND from '../../../assets/images/background/category.jpg';
import DEFAULT_BACKGROUND_MOBILE from '../../../assets/images/background/category-mobile.jpg';

// Wordpress
const { Component } = wp.element;

interface Props {
  backgroundImage: string;
  hideFrontFooter: bool;
  hideFrontHeader: bool;
  isPending: string;
  post: IPost;
}

/*
 * //domain.com/2020/01/01/slug
 */
export class Post extends Component<Props> {
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

  render(): JSX.Element {
    const {
      hideFrontFooter,
      hideFrontHeader,
      frontPage,
    } = this.props;

    const { post, loading } = usePost(frontPage || RouteController.getInstance().getMatched().slug);

    if (loading) {
      return (
        <Public className="stretched-background hide-footer">
          <PageHeader isLoading />
        </Public>
      );
    }

    if (post === HTTP_RESPONSE_NO_CONTENT) {
      return (
        <NotFound />
      );
    }

    console.log(post);

    const {
      title,
      excerpt,
      thumbnail,
      meta,
      prevNext,
      related,
      tags,
      slug,
    } = post;

    // this.setTitle(post.title);

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
              <Tags tags={tags} from={`single-${slug}`} />
              <SocialShare />
              <PrevNext prevNext={prevNext} />
            </aside>
          </Content>

          <SingleAside />
        </section>

        <section className="row">
          <aside className="columns large-12">
            <RelatedPosts items={related} />
          </aside>
        </section>
      </Public>
    );
  }
}
