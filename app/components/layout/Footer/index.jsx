import Copywrite from 'app/components/layout/Footer/Copywrite';
import Advert from 'app/components/layout/Footer/Advert';
import Flickr from 'app/components/layout/Footer/Flickr';
import Tags from 'app/components/layout/Footer/Tags';

const { Fragment, Component } = wp.element;

class GlobalFooter extends Component {
  render() {
    return (
      <Fragment>
        <div className="row widget-area">
          {sujin.widgets.footer && sujin.widgets.footer.map((widget) => (
            <div className="small-12 medium-4 large-4 columns">
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
                <Tags
                  html={widget.html}
                />
              )}
            </div>
          ))}
        </div>
        <Copywrite />
      </Fragment>
    );
  }
}

export default GlobalFooter;
