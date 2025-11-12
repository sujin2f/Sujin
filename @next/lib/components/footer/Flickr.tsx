'use client'
import React, { Fragment } from 'react'
// /* Components */
// import { Card } from '@common/components/containers/Card'
// import Column from '@common/components/layout/Column'
// import Row from '@common/components/layout/Row'
// import { LoadingArchive } from '@lib/components/LoadingArchive'
// /* CONSTANTS */
// import GQL from '../../../.backup/api/graphql/_lib/constants'
// import { WEEK_IN_SECONDS } from '@sujin/share/constants/datetime'
// import { Context } from '@lib/constants/store'
// /* Utils */
// import useIntersectionGQLStore from '@sujin/common/hooks/useIntersectionGQLStore'

const Flickr = () => {
    return <Fragment />
    // const { items, pending, error, ref } = useIntersectionGQLStore(
    //     'flickr',
    //     Context,
    //     GQL.queryFlickr,
    //     'title link media',
    //     WEEK_IN_SECONDS,
    // )

    // if (error) {
    //     return
    // }

    // return (
    //     <section className="widget--flickr" ref={ref}>
    //         {pending && (
    //             <LoadingArchive
    //                 className="flickr"
    //                 counts={12}
    //                 large={3}
    //                 medium={4}
    //                 small={3}
    //                 fullWidth
    //             />
    //         )}
    //         {items.length && (
    //             <Row fullWidth>
    //                 {items.slice(0, 12).map((item) => (
    //                     <Column
    //                         key={`flickr-${item.link}`}
    //                         className="widget--flickr__column"
    //                         large={3}
    //                         medium={4}
    //                         small={3}
    //                     >
    //                         <Card
    //                             to={item.link}
    //                             title={item.title}
    //                             image={item.media.replace('_m.jpg', '_s.jpg')}
    //                         />
    //                     </Column>
    //                 ))}
    //             </Row>
    //         )}
    //     </section>
    // )
}
export default Flickr
