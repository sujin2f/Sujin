/*
 * Menu Hooks
 * import {} from 'store/hooks/menu';
 */

import { useContext, useEffect } from 'react'
import axios from 'axios'

import { ResponseCode } from 'src/frontend/constants/enum'
import { Context } from 'src/frontend/store'
import { loadMenuInit, loadMenuSuccess } from 'src/frontend/store/actions'
import { MenuItem } from 'src/frontend/store/items/menu-item'
import { StateMenu } from 'src/frontend/store/reducer'
import { log } from 'src/frontend/utils/common'

const loaded: string[] = []

export const useMenu = (slug: string): StateMenu => {
    const [{ menu }, dispatch] = useContext(Context) as Context

    useEffect(() => {
        if (loaded.includes(slug) || menu[slug]) {
            return
        }

        dispatch(loadMenuInit(slug))

        axios
            .get(`https://devbackend.sujinc.com/wp-json/sujin/v1/menu/${slug}`)
            .then((response) => {
                if (response.status === ResponseCode.Success) {
                    dispatch(
                        loadMenuSuccess(
                            slug,
                            response.data.map(
                                (item: any) => new MenuItem(item),
                            ),
                        ),
                    )
                    return
                }
            })
            .catch((e) => {
                log([`axios.get has been failed on menu/${slug}`, e], 'error')
            })

        loaded.push(slug)
    }, [dispatch, slug, menu])

    return menu[slug]
}
