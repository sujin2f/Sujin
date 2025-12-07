'use client'
import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
/* Components */
import { Banner } from '@app/@banner/_components'
/* Utils */
import { setBackground } from '@app/_store/slices/background'
import { useServerAction } from '@app/_hooks/useServerAction'
import { getBackgrounds } from '@app/@banner/_lib/getBackgrounds'
/* Module */
import { RootState } from '@app/_store'
/* CONSTANTS */
import { MENU_NAMES } from '@sujin/lib/constants'
/* Assets */
import Logo from '@common/images/logo.svg'

// TODO height transition start/stop
export default function FrontPageBanner() {
    // Redux store
    const backgrounds = useSelector((state: RootState) => state.background)
    const dispatch = useDispatch()
    const hasStore = useMemo(() => !!backgrounds.length, [backgrounds])
    // Read from GraphQL
    const { data } = useServerAction(getBackgrounds, hasStore)

    useEffect(() => {
        if (!hasStore && data && data.length) {
            dispatch(setBackground(data))
        }
    }, [data, hasStore, dispatch])

    const background = backgrounds[Math.floor(Math.random() * backgrounds.length)]

    return (
        <Banner
            menu={MENU_NAMES.MAIN}
            background={background}
            excerpt={`${process.env.NEXT_PUBLIC_SITE_DESCRIPTION}`}
            title={<Logo aria-label={`${process.env.NEXT_PUBLIC_SITE_NAME}`} className="w-sm mx-auto" />}
            fullHeight
        />
    )
}
