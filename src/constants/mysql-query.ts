/**
 * MySQL queries
 *
 * @module constants
 */

import { formatDate } from 'src/common/utils/datetime'
import { Post } from 'src/types/wordpress'
import { format } from 'src/utils/common'

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
    posts.guid AS link,
    posts.post_mime_type AS mimeType
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
    WHERE {0}="{1}" AND (posts.post_type="post" OR posts.post_type="page" OR posts.post_type="attachment") {3}
    ORDER BY posts.ID DESC
    LIMIT ${PER_PAGE} OFFSET {2}
`

const GET_RECENT_POSTS = `
    SELECT ${POST_FIELDS}
    FROM wp_posts AS posts
    WHERE posts.post_type="post" AND posts.post_status="publish"
    ORDER BY posts.ID DESC
    LIMIT 5
`

const GET_POST_META = `
    SELECT meta_value
    FROM wp_postmeta
    WHERE post_id="{0}" AND meta_key="{1}"
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
        taxonomy.taxonomy="post_tag" AND
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
        taxonomy.taxonomy="post_tag" AND
        count<>0
    GROUP BY terms.term_id
    ORDER BY hit DESC LIMIT 20
`

const UPDATE_TAG_HIT = `
    INSERT INTO wp_terms_hit (term_id, hit) VALUES ({0}, 1)
    ON DUPLICATE KEY UPDATE hit = hit + 1
`

const GET_ADJACENT_POST = `
    SELECT
        ${POST_FIELDS}
    FROM wp_posts AS posts
        INNER JOIN wp_term_relationships AS relationship ON posts.ID = relationship.object_id
        INNER JOIN wp_term_taxonomy taxonomy ON relationship.term_taxonomy_id = taxonomy.term_taxonomy_id
    WHERE
        posts.ID <> {0} AND
        posts.post_date {1} "{2}" AND
        posts.post_type = "post" AND
        taxonomy.taxonomy = "category" AND
        taxonomy.term_id IN ("{3}") AND
        posts.post_status = "publish"
    ORDER BY posts.post_date {4} LIMIT 1
`

const GET_RELATED_POST = `
    SELECT
        ${POST_FIELDS}
    FROM wp_posts AS posts
        INNER JOIN wp_term_relationships AS relationship ON posts.ID = relationship.object_id
        INNER JOIN wp_term_taxonomy taxonomy ON relationship.term_taxonomy_id = taxonomy.term_taxonomy_id
    WHERE
        posts.post_type = "post" AND
        taxonomy.taxonomy = "{0}" AND
        taxonomy.term_id IN ("{1}") AND
        posts.post_status = "publish"
    ORDER BY posts.post_date DESC LIMIT 5
`

const DELETE_POST_META = `
    DELETE FROM wp_postmeta
    WHERE
        post_id = {0} AND
        meta_key = "{1}"
`

export const MySQLQuery = {
    getAllPostMeta: (postId: number) => format(GET_ALL_POST_META, postId),
    getRandomBackgrounds: () =>
        format(GET_TERM_ITEMS, 'background', 'inherit', 'ORDER BY RAND()', 0),
    getTermItems: (termSlug: string, offset: number) =>
        format(
            GET_TERM_ITEMS,
            termSlug,
            'publish',
            'ORDER BY posts.ID DESC',
            offset,
        ),
    getOption: (optionName: string) => format(GET_OPTION, optionName),
    getPostMeta: (postId: number, metaKey: string) =>
        format(GET_POST_META, postId, metaKey),
    getPostBy: (
        key: string,
        value: string | number,
        offset: number,
        ignoreStatus: boolean,
    ) =>
        format(
            GET_POST_BY,
            key,
            value,
            offset,
            ignoreStatus ? '' : 'AND posts.post_status="publish"',
        ),
    getTermBy: (key: string, value: string) => {
        const newKey = key === 'id' ? 'terms.term_id' : 'terms.slug'
        return format(GET_TERM_BY, newKey, value)
    },
    getTaxonomies: (postId: number) => format(GET_TAXONOMIES, postId),
    getTermMeta: (id: number, metaKey: string) =>
        format(GET_TERM_META, id, metaKey),
    getTagCount: () => format(GET_TAG_COUNT),
    getTagHit: () => format(GET_TAG_HIT),
    updateTagHit: (termId: number) => format(UPDATE_TAG_HIT, termId),
    getAdjacentPost: (post: Post, previous = true) => {
        const comparison = previous ? '<' : '>'
        const order = previous ? 'DESC' : 'ASC'
        const termId = post.categories.map((category) => category.id)
        return format(
            GET_ADJACENT_POST,
            post.id,
            comparison,
            formatDate(post.date),
            termId.join(','),
            order,
        )
    },
    getRelatedPost: (taxonomy: 'category' | 'post_tag', termIds: number[]) => {
        return format(GET_RELATED_POST, taxonomy, termIds.join(','))
    },
    getRecentPosts: () => GET_RECENT_POSTS,
    deletePostMeta: (postId: number, metaKey: string) => {
        return format(DELETE_POST_META, postId, metaKey)
    },
}

export enum MetaKeys {
    ATTACHMENT_META = '_wp_attachment_metadata',
    MENU_ITEM_CLASSES = '_menu_item_classes',
    MENU_ITEM_OBJECT_ID = '_menu_item_object_id',
    MENU_ITEM_TARGET = '_menu_item_target',
    MENU_ITEM_TYPE = '_menu_item_type',
    MENU_ITEM_URL = '_menu_item_url',
    MENU_ITEM_PARENT = '_menu_item_menu_item_parent',
}

export enum MenuNames {
    MAIN = 'main',
    SOCIAL = 'social-media',
}

export enum MenuItemTypes {
    POST_TYPE = 'post_type',
    TAXONOMY = 'taxonomy',
}
