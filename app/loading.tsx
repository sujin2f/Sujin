'use client'

import React, { useEffect } from 'react'
import { useContext } from '@src/store'
import { setBanner, setWrapperClass } from '@src/store/actions'

import LoadingImg from '@src/images/loading.svg'

export default function Loading() {
    const [, dispatch] = useContext()

    useEffect(() => {
        dispatch(setWrapperClass(''))
        dispatch(
            setBanner({
                title: <LoadingImg />,
                excerpt: '',
                icon: undefined,
                prefix: undefined,
                background: undefined,
                backgroundColor: undefined,
            }),
        )
    }, [dispatch])

    return <></>
}
