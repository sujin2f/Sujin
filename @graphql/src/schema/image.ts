/**
 * Basic image schema fragment with common fields used across image types.
 *
 * Fields:
 * - `url`: the image URL
 * - `width`, `height`: dimensions in pixels
 * - `mimeType`: optional MIME type string
 */
export const Image = {
    url: String,
    width: Number,
    height: Number,
    mimeType: String,
}
