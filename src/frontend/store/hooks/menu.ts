/*
 * Menu Hooks
 * import {} from 'store/hooks/menu';
 */

import { useContext, useEffect } from 'react'
import { gql } from '@apollo/client'

import { Context } from 'src/frontend/store'
import { loadMenuInit, loadMenuSuccess } from 'src/frontend/store/actions'
import { graphqlClient } from 'src/frontend/utils'
import { MenuItem } from 'src/types'

export const useMenu = (slug: string): MenuItem[] => {
    const [
        {
            menus: { [slug]: menu },
        },
        dispatch,
    ] = useContext(Context) as Context

    useEffect(() => {
        if (menu) {
            return
        }

        dispatch(loadMenuInit(slug))

        graphqlClient
            .query<{ getMenu: MenuItem[] }>({
                query: gql`
                    query {
                        getMenu(menuName: "${slug}") {
                            id
                            title
                            target
                            link
                            htmlClass
                            children {
                                id
                                title
                                target
                                link
                                htmlClass
                            }
                        }
                    }
                `,
            })
            .then((response) => {
                dispatch(loadMenuSuccess(slug, response.data.getMenu))
            })
    }, [dispatch, slug, menu])

    return menu
}
