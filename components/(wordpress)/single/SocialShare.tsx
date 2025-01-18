'use client'

import React from 'react'

import { Button } from '@common/components/forms/Button'
import { shareTwitter, shareFacebook } from '@src/utils/single'

import Twitter from '@src/images/twitter.svg'
import Facebook from '@src/images/facebook.svg'

import '@src/scss/social-share.scss'

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
                vanilla
                className="social-share__button social-share__button--twitter"
                onClick={() => shareTwitter(title)}
            >
                <Twitter />
            </Button>
            <Button
                vanilla
                className="social-share__button social-share__button--facebook"
                onClick={() => shareFacebook(title, excerpt, thumbnail)}
            >
                <Facebook />
            </Button>
        </nav>
    )
}
