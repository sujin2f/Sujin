/*
 * Menu Hooks
 * import {} from 'store/hooks/menu';
 */

import { useContext, useEffect } from 'react'
import { gql } from '@apollo/client'

import { Context } from 'src/frontend/store'
import { loadMenuInit, loadMenuSuccess } from 'src/frontend/store/actions'
import { StateMenu } from 'src/frontend/store/reducer'
import { graphqlClient } from 'src/frontend/utils'
import { MenuItem } from 'src/types'

type Response = {
    getMenu: MenuItem[]
}

const loaded: string[] = []

export const useMenu = (slug: string): StateMenu => {
    const [{ menu }, dispatch] = useContext(Context) as Context

    useEffect(() => {
        if (loaded.includes(slug) || menu[slug]) {
            return
        }

        dispatch(loadMenuInit(slug))

        graphqlClient
            .query<Response>({
                query: gql`
                    query {
                        getMenu(menuName: "${slug}") {
                            id
                            title
                            guid
                            target
                            url
                            type
                            htmlClass
                            children {
                                id
                                title
                                guid
                                target
                                url
                                type
                                htmlClass
                            }
                        }
                    }
                `,
            })
            .then((response) => {
                dispatch(loadMenuSuccess(slug, response.data.getMenu))
            })

        loaded.push(slug)
    }, [dispatch, slug, menu])

    return menu[slug]
}
