/* Helpers */
import type { T_ShortcodeNamed } from '@app/_lib/types'

export const replaceQuotes = (matched: T_ShortcodeNamed, key: string) => {
    const regex = /(&#8221;|&#8243;|\/\])/g
    return (matched[key] && matched[key].replace(regex, '')) || ''
}
