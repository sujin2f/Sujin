/**
 * @todo Apply Logger
 */
export enum ErrorMessage {
    MYSQL_CONNECTION = '[0000] 🤬 MySQL connection failed.',
    POST_NOT_FOUND = '[0010] 🤬 WP post does not exist.',
    POST_META_NOT_FOUND = '[0011] 🤬 WP postmeta does not exist.',
    ATTACHMENT_NOT_FOUND = '[0020] 🤬 WP attachment does not exist.',
    MENU_EMPTY = '[0030] 🤬 The menu is empty.',
    TERM_NOT_FOUND = '[0040] 🤬 The term does not exist.',
    TERM_META_NOT_FOUND = '[0050] 🤬 The term does not exist.',
}
