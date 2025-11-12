'use client'
import React from 'react'
import { usePathname } from 'next/navigation'
/* Components */
import Button from '@common/components/forms/Button'
/* Helpers */
import { BASE_URL } from '@lib/constants'
/* Assets */
import Twitter from '@common/images/twitter.svg'
import Facebook from '@common/images/facebook.svg'
/* Assets */
import '@app/(single)/_components/SocialShare.scss'

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

export const TWITTER_SHARE = 'https://www.twitter.com/intent/tweet'
export const FACEBOOK_SHARE = 'https://www.facebook.com/sharer/sharer.php'

const shareTwitter = (path: string, text: string): void => {
    const url = addQueryArgs(TWITTER_SHARE, {
        text,
        url: path,
    })

    window.open(url, 'Twitter', getNewWindowFeatures())
}

const shareFacebook = (
    path: string,
    title: string,
    excerpt: string,
    thumbnail: string,
): void => {
    const url = addQueryArgs(FACEBOOK_SHARE, {
        u: path,
        picture: thumbnail,
        text: title && encodeURIComponent(title),
        quote: excerpt && encodeURIComponent(excerpt),
    })

    window.open(url, 'Facebook', getNewWindowFeatures())
}

const getNewWindowFeatures = (): string => {
    const top = (window.innerHeight - 600) / 2
    const left = (window.innerWidth - 500) / 2
    return `toolbar=0,status=0,resizable=yes,width=500,height=600,top=${top},left=${left}`
}

const addQueryArgs = (url: string, args: Record<string, string>) => {
    const parsed = new URL(url)
    Object.keys(args).map((key) => parsed.searchParams.append(key, args[key]))
    return `${parsed.protocol}//${parsed.host}${parsed.pathname}${parsed.search}${parsed.hash}`
}
