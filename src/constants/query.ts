const POST_FIELDS = `
    post.ID AS id,
    post.post_name AS slug,
    post.post_title AS title,
    post.post_excerpt AS excerpt,
    post.post_date AS date,
    post.post_content AS content,
    post.post_parent AS parent,
    post.post_type AS type,
    post.menu_order AS menuOrder,
    post.guid AS link
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
export const SQL_GET_SIMPLE_POST_BY = `
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
    FROM wp_posts AS post
    INNER JOIN wp_term_relationships as term_relationship
        ON post.ID = term_relationship.object_id
    INNER JOIN wp_term_taxonomy as term_taxonomy
        ON term_taxonomy.term_taxonomy_id = term_relationship.term_taxonomy_id
    INNER JOIN wp_terms as term
        ON term.term_id = term_taxonomy.term_id
    WHERE term.slug="{0}"
`

export enum WPKeys {
    ATTACHMENT_META = '_wp_attachment_metadata',
}

export enum MenuName {
    MAIN = 'hercules',
    SOCIAL = 'social-media',
}
