import { useContext, useEffect } from 'react'
import { gql } from '@apollo/client'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { FlickrImage } from 'src/types'
import { graphqlClient } from 'src/frontend/utils'
import { Context, loadFlickrInit, loadFlickrSuccess } from 'src/frontend/store'

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
