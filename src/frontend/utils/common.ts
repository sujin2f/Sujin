export const backgroundImageStyle = (
    image: string,
): { [key: string]: string } => {
    if (typeof image !== 'string') {
        return {}
    }
    return (image && { backgroundImage: `url(${image})` }) || {}
}

export const replaceLink = (to: string) =>
    to.replace(window.sujin.FRONTEND || '', '')
