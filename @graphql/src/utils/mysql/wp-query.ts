/**
 * MySQL queries
 *
 * @module constants
 */

import { TAXONOMY, POST_TYPE, PER_PAGE } from '@sujin/lib/constants'

/**
 * Making a formatted string
 * Replace {n} to args
 *
 * @param {string} str
 * @param {string[]} args
 * @return {string}
 */
const format = (str: string, ...args: (string | number)[]): string => {
    let result = str

    args.forEach((arg: string | number, idx: number) => {
        result = result.replace(new RegExp(`\\{${idx}\\}`, 'g'), arg.toString())
    })
    return result
}

const POST_FIELDS = `
    posts.ID AS id,
    posts.post_name AS slug,
    posts.post_title AS title,
    posts.post_excerpt AS excerpt,
    posts.post_date AS date,
    posts.post_content AS content,
    posts.post_status AS status,
    posts.post_mime_type AS mimeType,
    posts.post_type AS type,
    posts.guid AS link
`

const GET_OPTION = `
    SELECT option_value
    FROM wp_options
    WHERE option_name="{0}"
    LIMIT 1
`

const DELETE_OPTION = `
    DELETE FROM wp_options
    WHERE option_name="{0}"
`

const GET_POST_BY = `
    SELECT ${POST_FIELDS}
    FROM wp_posts AS posts
    WHERE {0}="{1}" AND posts.post_type="{2}" {4}
    ORDER BY posts.ID DESC
    LIMIT ${PER_PAGE} OFFSET {3}
`

const GET_SEARCH = `
    SELECT DISTINCT ${POST_FIELDS}
    FROM wp_posts AS posts
    WHERE UPPER(posts.post_title) LIKE UPPER("%{0}%") AND posts.post_status="publish"
    ORDER BY posts.ID DESC
    LIMIT ${PER_PAGE} OFFSET {1}
`

const GET_POST_META = `
    SELECT meta_value
    FROM wp_postmeta
    WHERE post_id="{0}" AND meta_key="{1}"
    LIMIT 1
`

// @deprecated
const GET_ALL_POST_META = `
    SELECT meta_key, meta_value
    FROM wp_postmeta
    WHERE post_id="{0}"
`

const GET_ARCHIVE_BY = `
    SELECT
        terms.term_id AS id,
        terms.name AS title,
        terms.slug AS slug,
        taxonomy.description AS excerpt
    FROM wp_term_relationships AS relationships
    INNER JOIN wp_term_taxonomy AS taxonomy
        ON taxonomy.term_taxonomy_id = relationships.term_taxonomy_id
    INNER JOIN wp_terms AS terms
        ON terms.term_id = taxonomy.term_id
    WHERE {0}="{1}"
`

const GET_TERM_BY = `
    SELECT
        terms.term_id AS id,
        terms.name AS title,
        terms.slug AS slug,
        taxonomy.description AS excerpt
    FROM wp_term_relationships AS relationships
    INNER JOIN wp_term_taxonomy AS taxonomy
        ON taxonomy.term_taxonomy_id = relationships.term_taxonomy_id
    INNER JOIN wp_terms AS terms
        ON terms.term_id = taxonomy.term_id
    WHERE {0}="{1}"
`

const GET_TERM_ITEMS = `
    SELECT ${POST_FIELDS}
    FROM wp_posts AS posts
    INNER JOIN wp_term_relationships AS relationships
        ON posts.ID = relationships.object_id
    INNER JOIN wp_term_taxonomy AS taxonomy
        ON taxonomy.term_taxonomy_id = relationships.term_taxonomy_id
    INNER JOIN wp_terms AS terms
        ON terms.term_id = taxonomy.term_id
    WHERE terms.slug="{0}" {1}
    {2}
`

const GET_TAXONOMIES = `
    SELECT
        terms.term_id AS id,
        terms.name AS title,
        terms.slug AS slug,
        taxonomy.taxonomy AS type
    FROM wp_terms AS terms
    INNER JOIN wp_term_taxonomy as taxonomy
        ON taxonomy.term_id = terms.term_id
    INNER JOIN wp_term_relationships as relationships
        ON relationships.term_taxonomy_id = taxonomy.term_taxonomy_id
    INNER JOIN wp_posts as posts
        ON posts.ID = relationships.object_id
    WHERE posts.ID={0}
    ORDER BY terms.name ASC
`

const GET_TERM_META = `
    SELECT meta_value as value
    FROM wp_termmeta
    WHERE term_id={0} AND meta_key="{1}"
`

const GET_TAG_COUNT = `
    SELECT
        terms.term_id as id,
        terms.name as title,
        terms.slug as slug,
        taxonomy.count as count,
        count.hit as hit
    FROM wp_term_taxonomy as taxonomy
        LEFT JOIN wp_terms as terms ON taxonomy.term_id = terms.term_id
        LEFT JOIN wp_term_relationships as relationship ON terms.term_id = relationship.term_taxonomy_id
        LEFT JOIN wp_posts as post ON post.ID = relationship.object_ID
        LEFT JOIN wp_terms_hit as count ON count.term_id = terms.term_id
    WHERE
        taxonomy.taxonomy="${TAXONOMY.POST_TAG}" AND
        count<>0
    GROUP BY terms.term_id
    ORDER BY count DESC LIMIT 20
`

const GET_TAG_HIT = `
    SELECT
        terms.term_id as id,
        terms.name as title,
        terms.slug as slug,
        taxonomy.count as count,
        count.hit as hit
    FROM wp_term_taxonomy as taxonomy
        LEFT JOIN wp_terms as terms ON taxonomy.term_id = terms.term_id
        LEFT JOIN wp_term_relationships as relationship ON terms.term_id = relationship.term_taxonomy_id
        LEFT JOIN wp_posts as post ON post.ID = relationship.object_ID
        LEFT JOIN wp_terms_hit as count ON count.term_id = terms.term_id
    WHERE
        taxonomy.taxonomy="${TAXONOMY.POST_TAG}" AND
        count<>0
    GROUP BY terms.term_id
    ORDER BY hit DESC LIMIT 20
`

const UPDATE_TAG_HIT = `
    INSERT INTO wp_terms_hit (term_id, hit) VALUES ({0}, 1)
    ON DUPLICATE KEY UPDATE hit = hit + 1
`

const DELETE_POST_META = `
    DELETE FROM wp_postmeta
    WHERE
        post_id = {0} AND
        meta_key = "{1}"
`

const IS_USER_ADMIN = `
    SELECT meta.meta_value
    FROM wp_users as user
        LEFT JOIN wp_usermeta as meta ON user.ID = meta.user_id
    WHERE
        user.user_email = "{0}" AND
        meta.meta_key = "wp_capabilities"
`

export const WPQuery = {
    getArchiveBy: (key: string, value: string) => {
        const newKey = key === 'id' ? 'terms.term_id' : 'terms.slug'
        return format(GET_ARCHIVE_BY, newKey, value)
    },
    getBackgrounds: () =>
        format(
            GET_TERM_ITEMS,
            'background',
            'AND posts.post_status="inherit"',
            '',
        ),
    // @deprecated
    getAllPostMeta: (postId: number) => format(GET_ALL_POST_META, postId),
    // @deprecated
    getTermItems: (termSlug: string, offset: number, ignoreStatus: boolean) =>
        format(
            GET_TERM_ITEMS,
            termSlug,
            ignoreStatus ? '' : 'AND posts.post_status="publish"',
            `ORDER BY posts.ID DESC LIMIT ${PER_PAGE} OFFSET ${offset}`,
        ),
    getOption: (optionName: string) => format(GET_OPTION, optionName),
    deleteOption: (optionName: string) => format(DELETE_OPTION, optionName),
    getPostMeta: (postId: number, metaKey: string) =>
        format(GET_POST_META, postId, metaKey),
    getPostBy: (
        key: string,
        value: string | number,
        type: POST_TYPE,
        offset: number,
        ignoreStatus: boolean,
    ) =>
        format(
            GET_POST_BY,
            key,
            value,
            type,
            offset,
            ignoreStatus ? '' : 'AND posts.post_status="publish"',
        ),
    getSearch: (value: string | number, offset: number) =>
        format(GET_SEARCH, value, offset),
    // @deprecated
    getTermBy: (key: string, value: string) => {
        const newKey = key === 'id' ? 'terms.term_id' : 'terms.slug'
        return format(GET_TERM_BY, newKey, value)
    },
    getTaxonomies: (postId: number) => format(GET_TAXONOMIES, postId),
    getTermMeta: (id: number, metaKey: string) =>
        format(GET_TERM_META, id, metaKey),
    // @deprecated
    getTagCount: () => format(GET_TAG_COUNT),
    // @deprecated
    getTagHit: () => format(GET_TAG_HIT),
    // @deprecated
    updateTagHit: (termId: number) => format(UPDATE_TAG_HIT, termId),
    // @deprecated
    deletePostMeta: (postId: number, metaKey: string) => {
        return format(DELETE_POST_META, postId, metaKey)
    },
    isUserAdmin: (email: string) => {
        return format(IS_USER_ADMIN, email)
    },
}
