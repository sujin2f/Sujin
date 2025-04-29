'use client'
import React from 'react'
import { usePathname } from 'next/navigation'
/* Components */
import Button from '@common/components/forms/Button'
/* Helpers */
import { shareTwitter, shareFacebook } from '@app/(single)/_lib/utils'
import { BASE_URL } from '@app/_lib/constants'
/* Assets */
import Twitter from '@app/_lib/images/twitter.svg'
import Facebook from '@app/_lib/images/facebook.svg'

type Props = {
    title: string
    excerpt: string
    thumbnail: string
}

export const SocialShare = ({ title, excerpt, thumbnail }: Props) => {
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
