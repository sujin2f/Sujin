/*
 * Single / Social Share Component
 * components/single/SocialShare
 */

import React from 'react'

import { Image } from 'store/items/image'
import { shareTwitter, shareFacebook } from 'utils/single'

interface Props {
  title: string
  excerpt: string
  thumbnail: Image
}

export const SocialShare = (props: Props): JSX.Element => {
  const { title, excerpt, thumbnail } = props

  return (
    <nav className="social-share">
      <button
        className="twitter"
        onClick={() => shareTwitter(title)}
        type="button"
      />
      <button
        className="facebook"
        onClick={() => shareFacebook(title, excerpt, thumbnail.medium)}
        type="button"
      />
    </nav>
  )
}
