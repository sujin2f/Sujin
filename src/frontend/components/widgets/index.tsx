/** import { WidgetContainer } from 'components/widgets'; */

import React, { Fragment } from 'react'

import { Flickr } from 'src/frontend/components/widgets/Flickr'
import { GoogleAdvert } from 'src/frontend/components/widgets/GoogleAdvert'
import { RecentPosts } from 'src/frontend/components/widgets/RecentPosts'
import { TagCloud } from 'src/frontend/components/widgets/TagCloud'
import { Widgets } from 'src/frontend/store/items/global-variable'
import {
    RecentPostWidget,
    GoogleAdvertWidget,
    FlickrWidget,
    TagCloudWidget,
} from 'src/frontend/store/items/schema/global-variable'

interface Props {
    items: Widgets[]
    itemClass?: string
}

export const WidgetContainer = (props: Props): JSX.Element => {
    return (
        <Fragment>
            {props.items &&
                props.items.map((widget) => (
                    <section
                        key={`side-rail-widget-${widget.widget}-${widget.key}`}
                        className={`widget__container ${props.itemClass || ''}`}
                    >
                        {widget.title && (
                            <h2 className="section-header">
                                <span>{widget.title}</span>
                            </h2>
                        )}

                        {widget.widget === 'recent-post' && (
                            <RecentPosts
                                small={(widget as RecentPostWidget).small}
                                medium={(widget as RecentPostWidget).medium}
                                large={(widget as RecentPostWidget).large}
                            />
                        )}

                        {widget.widget === 'google-advert' && (
                            <GoogleAdvert
                                client={(widget as GoogleAdvertWidget).client}
                                slot={(widget as GoogleAdvertWidget).slot}
                                responsive={
                                    (widget as GoogleAdvertWidget).responsive
                                }
                            />
                        )}

                        {widget.widget === 'flickr' && (
                            <Flickr items={(widget as FlickrWidget).items} />
                        )}

                        {widget.widget === 'tag-cloud' && (
                            <TagCloud html={(widget as TagCloudWidget).html} />
                        )}
                    </section>
                ))}
        </Fragment>
    )
}
