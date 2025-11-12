import { IMAGE_SIZE, POST_IMAGE_LOCATION } from '@sujin/lib/types'

export const IMAGE = 'width height url mimeType'
export const ARCHIVE = '_id title slug type'

export const POST_PREV_NEXT = '_id title link'
export const POST_ARCHIVE = `${POST_PREV_NEXT} id slug excerpt date`

export const PAGE = `${POST_ARCHIVE} content meta {useBackgroundColor backgroundColor}`

export const ARCHIVE_POSTS = `
    ${POST_ARCHIVE}
    images {
        ${POST_IMAGE_LOCATION.LIST} {
            ${IMAGE}
            sizes {
                ${IMAGE_SIZE.THUMBNAIL} { ${IMAGE} }
            }
        }
        ${POST_IMAGE_LOCATION.THUMBNAIL} {
            ${IMAGE}
            sizes {
                ${IMAGE_SIZE.THUMBNAIL} { ${IMAGE} }
            }
        }
    }
    archives { ${ARCHIVE} }
`
