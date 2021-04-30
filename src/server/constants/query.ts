const POST_FIELDS = `
    \`ID\` AS id,
    post_date AS date,
    post_content AS content,
    post_title AS title,
    post_excerpt AS excerpt,
    post_parent AS parent,
    \`guid\`
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
    FROM wp_posts
    WHERE \`{0}\`="{1}"
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
    post.\`ID\` AS id,
    post.post_date AS date,
    post.post_content AS content,
    post.post_title AS title,
    post.post_excerpt AS excerpt,
    post.post_parent AS parent,
    post.guid
FROM
    wp_term_relationships AS term
INNER JOIN
    wp_posts as post
ON post.ID = term.object_id
Where term.term_taxonomy_id={0}
`
