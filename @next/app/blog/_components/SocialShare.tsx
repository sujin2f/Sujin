'use client'
import { usePathname } from 'next/navigation'
/* Assets */
import Twitter from '@app/_lib/images/twitter.svg'
import Facebook from '@app/_lib/images/facebook.svg'

type Props = {
    title: string
    excerpt: string
    thumbnail: string
    baseUrl: string
}

export const SocialShare = ({ title, excerpt, thumbnail, baseUrl }: Props) => {
    const path = `${baseUrl}${usePathname()}`

    return (
        <nav className="mt-5">
            <button
                className="w-10 h-10 overflow-hidden cursor-pointer rounded-full mr-1"
                onClick={() => shareTwitter(path, title)}
            >
                <Twitter className="w-10 fill-[#4ec8f4] transition-transform hover:rotate-7 hover:scale-150" />
            </button>
            <button
                className="w-10 h-10 overflow-hidden cursor-pointer rounded-full"
                onClick={() => shareFacebook(path, title, excerpt, thumbnail)}
            >
                <Facebook className="w-10 fill-[#1b75bb] transition-transform hover:rotate-7 hover:scale-150" />
            </button>
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

const shareFacebook = (path: string, title: string, excerpt: string, thumbnail: string): void => {
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
