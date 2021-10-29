/**
 * MySQL queries
 *
 * @module constants
 */

import { format } from 'src/utils'

const POST_FIELDS = `
    posts.ID AS id,
    posts.post_name AS slug,
    posts.post_title AS title,
    posts.post_excerpt AS excerpt,
    posts.post_date AS date,
    posts.post_content AS content,
    posts.post_parent AS parent,
    posts.post_type AS type,
    posts.menu_order AS menuOrder,
    posts.guid AS link
`
export const PER_PAGE = 12

const GET_OPTION = `
    SELECT option_value
    FROM wp_options
    WHERE option_name="{0}"
    LIMIT 1
`

const GET_POST_BY = `
    SELECT ${POST_FIELDS}
    FROM wp_posts AS posts
    WHERE {0}="{1}" AND posts.post_status="publish"
    ORDER BY posts.ID DESC
    LIMIT ${PER_PAGE} OFFSET {2}
`

const GET_POST_META = `
    SELECT meta_value
    FROM wp_postmeta
    WHERE
        post_id="{0}" AND
        meta_key="{1}"
    LIMIT 1
`

const GET_ALL_POST_META = `
    SELECT meta_key, meta_value
    FROM wp_postmeta
    WHERE post_id="{0}"
`

const GET_TERM_BY = `
    SELECT
        terms.term_id AS id,
        terms.name AS title,
        terms.slug AS slug,
        taxonomy.taxonomy AS type,
        taxonomy.description AS excerpt,
        COUNT(posts.ID) as total
    FROM wp_posts AS posts
    INNER JOIN wp_term_relationships AS relationships
        ON posts.ID = relationships.object_id
    INNER JOIN wp_term_taxonomy AS taxonomy
        ON taxonomy.term_taxonomy_id = relationships.term_taxonomy_id
    INNER JOIN wp_terms AS terms
        ON terms.term_id = taxonomy.term_id
    WHERE {0}="{1}" AND posts.post_status="publish"
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
    WHERE terms.slug="{0}" AND posts.post_status="{1}"
    {2}
    LIMIT ${PER_PAGE}
    OFFSET {3}
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

export const MySQLQuery = {
    getAllPostMeta: (postId: number): string =>
        format(GET_ALL_POST_META, postId),
    getRandomBackgrounds: (): string =>
        format(GET_TERM_ITEMS, 'background', 'inherit', 'ORDER BY RAND()', 0),
    getTermItems: (termSlug: string, offset: number): string =>
        format(
            GET_TERM_ITEMS,
            termSlug,
            'publish',
            'ORDER BY posts.ID DESC',
            offset,
        ),
    getOption: (optionName: string): string => format(GET_OPTION, optionName),
    getPostMeta: (postId: number, metaKey: string): string =>
        format(GET_POST_META, postId, metaKey),
    getPostBy: (key: string, value: string, offset: number): string =>
        format(GET_POST_BY, key, value, offset),
    getTermBy: (key: string, value: string): string => {
        const newKey = key === 'id' ? 'terms.term_id' : 'terms.slug'
        return format(GET_TERM_BY, newKey, value)
    },
    getTaxonomies: (postId: number): string => format(GET_TAXONOMIES, postId),
    getTermMeta: (id: number, metaKey: string): string =>
        format(GET_TERM_META, id, metaKey),
}

export enum MetaKeys {
    ATTACHMENT_META = '_wp_attachment_metadata',
    MENU_ITEM_CLASSES = '_menu_item_classes',
    MENU_ITEM_OBJECT_ID = '_menu_item_object_id',
    MENU_ITEM_TARGET = '_menu_item_target',
    MENU_ITEM_TYPE = '_menu_item_type',
    MENU_ITEM_URL = '_menu_item_url',
}

export enum MenuNames {
    MAIN = 'hercules',
    SOCIAL = 'social-media',
}

export enum MenuItemTypes {
    POST_TYPE = 'post_type',
    TAXONOMY = 'taxonomy',
}
