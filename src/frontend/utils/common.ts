/** utils/common */

// import { Image } from 'src/frontend/store/items/image'

// @todo refactor
// export const parseExImage = (
//     meta: Image,
//     thumbnail: Image,
//     desktop: 'large' | 'medium' | 'small' | 'tiny',
//     mobile: 'large' | 'medium' | 'small' | 'tiny',
//     defaultDesktop: string,
//     defaultMobile: string,
// ): string => {
//     if (isMobile()) {
//         return meta[mobile] || thumbnail[mobile] || defaultMobile || ''
//     }

//     return meta[desktop] || thumbnail[desktop] || defaultDesktop || ''
// }

export const scrollTo = (id = null): void => {
    if (!id) {
        window.scrollTo(0, 0)
        return
    }

    const element = document.getElementById(id || '')
    if (!element) {
        return
    }

    const box = element.getBoundingClientRect()
    const docElem = document.documentElement
    const { body } = document
    const clientTop = docElem.clientTop || body.clientTop || 0
    const scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop

    window.scrollTo(0, box.top + scrollTop - clientTop)
}

export const backgroundImageStyle = (
    image: string,
): { [key: string]: string } => {
    if (typeof image !== 'string') {
        return {}
    }
    return (image && { backgroundImage: `url(${image})` }) || {}
}
