import React, { useEffect, useRef } from 'react'

const callbacks: { (): void; (): void }[] = []

interface Props {
    id: string
}

export const TweetEmbed = (props: Props): JSX.Element => {
    const refDiv = useRef<HTMLDivElement>(null)
    const twitterModule = window.twttr
    const currentDiv = refDiv.current
    const id = props.id

    const addScript = (src: string, cb: () => void): void => {
        if (!callbacks.length) {
            callbacks.push(cb)
            const s = document.createElement('script')
            s.setAttribute('src', src)
            s.onload = (): void => callbacks.forEach((d) => d())
            document.body.appendChild(s)
        } else {
            callbacks.push(cb)
        }
    }

    useEffect(() => {
        if (!twitterModule || !currentDiv) {
            return
        }

        const renderTweet = (): void => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            twitterModule.ready().then(({ widgets }: any) => {
                // Clear previously rendered tweet before rendering the updated tweet id
                if (refDiv.current) {
                    refDiv.current.innerHTML = ''
                }
                widgets.createTweetEmbed(id, currentDiv, {})
            })
        }

        const loadTweetForProps = (): void => {
            if (!(twitterModule && twitterModule.ready)) {
                const protocol =
                    window.location.protocol.indexOf('file') >= 0
                        ? 'https:'
                        : ''
                addScript(
                    `${protocol}//platform.twitter.com/widgets.js`,
                    renderTweet,
                )
            } else {
                renderTweet()
            }
        }

        loadTweetForProps()
    }, [twitterModule, currentDiv, id])

    return <div ref={refDiv} />
}
