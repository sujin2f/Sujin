import React from 'react'

import { Button } from 'src/common/components/forms/Button'
import { shareTwitter, shareFacebook } from 'src/frontend/utils/single'

import Twitter from 'src/frontend/images/twitter.svg'
import Facebook from 'src/frontend/images/facebook.svg'

import '/src/frontend/scss/social-share.scss'

interface Props {
    title: string
    excerpt: string
    thumbnail: string
}

export const SocialShare = (props: Props) => {
    const { title, excerpt, thumbnail } = props

    return (
        <nav className="social-share">
            <Button
                className="social-share__button social-share__button--twitter"
                onClick={() => shareTwitter(title)}
            >
                <Twitter />
            </Button>
            <Button
                className="social-share__button social-share__button--facebook"
                onClick={() => shareFacebook(title, excerpt, thumbnail)}
            >
                <Facebook />
            </Button>
        </nav>
    )
}
