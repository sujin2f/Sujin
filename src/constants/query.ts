const POST_FIELDS = `
    post.ID AS id,
    post.post_date AS date,
    post.post_content AS content,
    post.post_title AS title,
    post.post_excerpt AS excerpt,
    post.post_parent AS parent,
    post.guid
`
export const SQL_GET_OPTION = `
    SELECT option_value
    FROM wp_options
    WHERE option_name="{0}"
    LIMIT 1
`
export const SQL_GET_TERM_RELATION = `
    SELECT object_id
    FROM wp_term_relationships
    WHERE term_taxonomy_id="{0}"
`
export const SQL_GET_POST_BY = `
    SELECT 
        ${POST_FIELDS}
    FROM wp_posts AS post
    WHERE {0}="{1}"
`
export const SQL_GET_POST_META = `
    SELECT meta_value
    FROM wp_postmeta
    WHERE
        post_id="{0}" AND
        meta_key="{1}"
    LIMIT 1
`
export const SQL_GET_ALL_POST_META = `
    SELECT meta_key, meta_value
    FROM wp_postmeta
    WHERE post_id="{0}"
`
export const SQL_GET_TERM = `
    SELECT term_id AS id, name, slug
    FROM wp_terms
    WHERE term_id="{0}"
`
export const SQL_GET_TERM_ITEMS = `
SELECT
    ${POST_FIELDS}
FROM
    wp_term_relationships AS term_relationship
INNER JOIN wp_posts as post
    ON post.ID = term_relationship.object_id
INNER JOIN wp_terms as term
    ON term.term_id = term_relationship.term_taxonomy_id
Where term.slug="{0}"
`

export enum WP_KEYS {
    ATTACHMENT_META = '_wp_attachment_metadata',
}
