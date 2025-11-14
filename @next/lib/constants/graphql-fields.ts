import { IMAGE_SIZE, POST_IMAGE_LOCATION } from '@sujin/lib/types'

const IMAGE = 'width height url mimeType'
const ARCHIVE = '_id title slug type'

const IMAGE_ARCHIVE = `
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
    }`

const IMAGE_META = `
    ${POST_IMAGE_LOCATION.LIST} {
        sizes {
            ${IMAGE_SIZE.MEDIUM_LARGE} { ${IMAGE} }
        }
    }
    ${POST_IMAGE_LOCATION.THUMBNAIL} {
        sizes {
            ${IMAGE_SIZE.MEDIUM_LARGE} { ${IMAGE} }
        }
    }`

const IMAGE_SINGLE = `
    ${POST_IMAGE_LOCATION.ICON} {
        url
    }
    ${POST_IMAGE_LOCATION.BACKGROUND} {
        ${IMAGE}
        sizes {
            ${IMAGE_SIZE.MEDIUM} { ${IMAGE} }
            ${IMAGE_SIZE.MEDIUM_LARGE} { ${IMAGE} }
            ${IMAGE_SIZE.LARGE} { ${IMAGE} }
        }
    }
    ${POST_IMAGE_LOCATION.LIST} {
        sizes {
            ${IMAGE_SIZE.MEDIUM_LARGE} { ${IMAGE} }
        }
    }
    ${POST_IMAGE_LOCATION.THUMBNAIL} {
        sizes {
            ${IMAGE_SIZE.MEDIUM_LARGE} { ${IMAGE} }
        }
    }`

const POST_PREV_NEXT = '_id title link'
const POST_RECENT = `${POST_PREV_NEXT} id slug excerpt`

const PAGE = `
    ${POST_RECENT}
    date
    content
    meta {useBackgroundColor backgroundColor}
    images { ${IMAGE_SINGLE}}`
const POST = `
    ${PAGE}
    archives { title type }`

export const FIELDS = {
    BACKGROUNDS: `
        ${IMAGE}
        sizes {
            large { ${IMAGE} }
            medium { ${IMAGE} }
            mediumLarge { ${IMAGE} }
        }`,
    POST_PREV_NEXT,
    POST_ARCHIVE: `${POST_RECENT} date images {${IMAGE_ARCHIVE}} archives { ${ARCHIVE} }`,
    ARCHIVE,
    ARCHIVE_META: 'title excerpt',
    SINGLE_META: `
        title excerpt archives { title }
        images { ${IMAGE_META} }`,
    POST,
    PAGE,
    PAGE_ADMIN: `${POST_RECENT} status`,
}
export type FIELDS = keyof typeof FIELDS
