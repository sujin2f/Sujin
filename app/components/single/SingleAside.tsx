/**  app/components/single/SingleAside */
import RecentPosts from 'app/components/widgets/RecentPosts';
import Advert from 'app/components/widgets/Advert';
import Flickr from 'app/components/widgets/Flickr';
import Tags from 'app/components/widgets/Tags';

// Wordpress
const { compose } = wp.compose;
const { Fragment, Component } = wp.element;

class SingleAside extends Component {
  render(): JSX.Element {
    return (
      <aside id="side-rail" className="columns large-3">
        {sujin.widgets.siderail && sujin.widgets.siderail.map((widget) => (
          <Fragment key={`side-rail-widget-${widget.widget}-${widget.key}`}>
            {widget.title && (
              <h2><span>{widget.title}</span></h2>
            )}
            {widget.widget === 'flickr' && (
              <Flickr items={widget.items} />
            )}
            {widget.widget === 'advert' && (
              <Advert
                client={widget.client}
                slot={widget.slot}
                responsive={widget.responsive}
              />
            )}
            {widget.widget === 'tags' && (
              <Tags
                html={widget.html}
              />
            )}
            {widget.widget === 'recent-post' && (
              <RecentPosts />
            )}
          </Fragment>
        ))}
      </aside>
    );
  }
}

export default compose([])(SingleAside);
