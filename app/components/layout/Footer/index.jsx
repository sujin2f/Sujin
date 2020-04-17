import Copywrite from 'app/components/layout/Footer/Copywrite';

// Widgets
import RecentPosts from 'app/components/widgets/RecentPosts';
import Advert from 'app/components/widgets/Advert';
import Flickr from 'app/components/widgets/Flickr';
import WidgetTags from 'app/components/widgets/Tags';

const { Fragment, Component } = wp.element;

class GlobalFooter extends Component {
  render() {
    return (
      <Fragment>
        <aside className="row widget-area">
          {sujin.widgets.footer && sujin.widgets.footer.map((widget) => (
            <div
              className="small-12 medium-4 large-4 columns"
              key={`footer-widget-${widget.widget}-${widget.key}`}
            >
              {widget.title && (
                <h1><span>{widget.title}</span></h1>
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
                <WidgetTags
                  html={widget.html}
                />
              )}
              {widget.widget === 'recent-post' && (
                <RecentPosts />
              )}
            </div>
          ))}
        </aside>
        <Copywrite />
      </Fragment>
    );
  }
}

export default GlobalFooter;
