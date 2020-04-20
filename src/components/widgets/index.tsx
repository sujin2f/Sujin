/** import { WidgetContainer } from 'components/widgets'; */

import React, { Fragment } from 'react';

import { Flickr } from 'components/widgets/Flickr';
import { GoogleAdvert } from 'components/widgets/GoogleAdvert';
import { RecentPosts } from 'components/widgets/RecentPosts';
import { TagCloud } from 'components/widgets/TagCloud';

interface Props {
  items: any[];
  itemClass?: string;
}

export const WidgetContainer = (props: Props): JSX.Element => {
  return (
    <Fragment>
      {props.items && props.items.map((widget) => (
        <section
          key={`side-rail-widget-${widget.widget}-${widget.key}`}
          className={`widget__container ${props.itemClass || ''}`}
        >
          {widget.title && (
            <h2 className="section-header"><span>{widget.title}</span></h2>
          )}
          {widget.widget === 'flickr' && (
            <Flickr items={widget.items} />
          )}
          {widget.widget === 'advert' && (
            <GoogleAdvert
              client={widget.client}
              slot={widget.slot}
              responsive={widget.responsive}
            />
          )}
          {widget.widget === 'tags' && (
            <TagCloud
              html={widget.html}
            />
          )}
          {widget.widget === 'recent-post' && (
            <RecentPosts
              small={widget.small}
              medium={widget.medium}
              large={widget.large}
            />
          )}
        </section>
      ))}
    </Fragment>
  );
};
