'use client'
import React from 'react'
import { usePathname } from 'next/navigation'
/* Components */
import { Button } from '@common/components/forms/Button'
/* Helpers */
import { shareTwitter, shareFacebook } from '@app/helpers/utils/single'
import { BASE_URL } from '@app/helpers/constants/system'
/* Assets */
import Twitter from '@src/images/twitter.svg'
import Facebook from '@src/images/facebook.svg'
import '@src/scss/social-share.scss'

type Props = {
    title: string
    excerpt: string
    thumbnail: string
}

export const SocialShare = (props: Props) => {
    const { title, excerpt, thumbnail } = props
    const path = `${BASE_URL}${usePathname()}`

    return (
        <nav className="social-share">
            <Button
                vanilla
                className="social-share__button social-share__button--twitter"
                onClick={() => shareTwitter(path, title)}
            >
                <Twitter />
            </Button>
            <Button
                vanilla
                className="social-share__button social-share__button--facebook"
                onClick={() => shareFacebook(path, title, excerpt, thumbnail)}
            >
                <Facebook />
            </Button>
        </nav>
    )
}
