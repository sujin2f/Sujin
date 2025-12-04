import { backgrounds as getBackgrounds } from '@src/resolvers/wordpress/backgrounds/backgrounds'

/**
 * Backgrounds resolver group.
 *
 * Exposes a `backgrounds` query and a `refreshBackgrounds` mutation which is
 * admin-protected.
 */
export const backgrounds = {
    Query: {
        backgrounds: getBackgrounds,
    },
}
