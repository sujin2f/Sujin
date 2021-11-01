import { useContext, useEffect } from 'react'
import { gql } from '@apollo/client'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { FlickrImage, TagCloud } from 'src/types'
import { graphqlClient } from 'src/frontend/utils'
import {
    Context,
    loadFlickrInit,
    loadFlickrSuccess,
    loadTagCloudInit,
    loadTagCloudSuccess,
} from 'src/frontend/store'

export const useFlickr = (): FlickrImage[] => {
    const [{ flickr }, dispatch] = useContext(Context) as Context

    useEffect(() => {
        if (flickr) {
            return
        }

        dispatch(loadFlickrInit())

        graphqlClient
            .query<{ getFlickr: FlickrImage[] }>({
                query: gql`
                    query {
                        getFlickr {
                            title
                            link
                            media
                        }
                    }
                `,
            })
            .then((response) => {
                dispatch(loadFlickrSuccess(response.data.getFlickr))
            })
    }, [dispatch, flickr])

    return flickr || []
}

export const useTagCloud = (): TagCloud[] => {
    const [{ tagCloud }, dispatch] = useContext(Context) as Context

    useEffect(() => {
        if (tagCloud) {
            return
        }

        dispatch(loadTagCloudInit())

        graphqlClient
            .query<{ getTagCloud: TagCloud[] }>({
                query: gql`
                    query {
                        getTagCloud {
                            id
                            title
                            slug
                            count
                            hit
                        }
                    }
                `,
            })
            .then((response) => {
                dispatch(loadTagCloudSuccess(response.data.getTagCloud))
            })
    }, [dispatch, tagCloud])

    return tagCloud || []
}
