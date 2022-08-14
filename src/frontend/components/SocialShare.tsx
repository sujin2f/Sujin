/*
 * Single / Social Share Component
 * components/single/SocialShare
 */

import React from 'react'

import { shareTwitter, shareFacebook } from 'src/frontend/utils/single'

interface Props {
    title: string
    excerpt: string
    thumbnail: string
}

export const SocialShare = (props: Props): JSX.Element => {
    const { title, excerpt, thumbnail } = props

    return (
        <nav className="content__social-share">
            <button
                className="content__social-share__button content__social-share__twitter"
                onClick={() => shareTwitter(title)}
                type="button"
            />
            <button
                className="content__social-share__button content__social-share__facebook"
                onClick={() => shareFacebook(title, excerpt, thumbnail)}
                type="button"
            />
        </nav>
    )
}
