/**
 * Error messages
 */

import { Post } from 'src/types'

// type HTTP_RESPONSE = {
//     error: string
//     message: string
// }

// export type HTTP_RESPONSE_BODY = {
//     code: number
//     response: HTTP_RESPONSE
// }

// export const HTTP_OK: HTTP_RESPONSE_BODY = {
//     code: 200,
//     response: {
//         error: '',
//         message: 'Success.',
//     },
// }

// export const HTTP_CREATED: HTTP_RESPONSE_BODY = {
//     code: 201,
//     response: {
//         error: '',
//         message: 'Created.',
//     },
// }

// export const NO_CONTENT: HTTP_RESPONSE_BODY = {
//     code: 204,
//     response: {
//         error: 'No Content',
//         message: 'Nothing returns in this endpoint.',
//     },
// }

// export const HTTP_BAD_REQUEST: HTTP_RESPONSE_BODY = {
//     code: 400,
//     response: {
//         error: 'Bad Request',
//         message: 'Your request is not acceptable.',
//     },
// }

// export const HTTP_UNAUTHORIZED: HTTP_RESPONSE_BODY = {
//     code: 401,
//     response: {
//         error: 'Access denied',
//         message: 'Rest route needs an authentication.',
//     },
// }

// export const HTTP_FORBIDDEN: HTTP_RESPONSE_BODY = {
//     code: 403,
//     response: {
//         error: 'Forbidden',
//         message: 'User not allowed to access this endpoint.',
//     },
// }

// export const HTTP_NOT_FOUND: HTTP_RESPONSE_BODY = {
//     code: 404,
//     response: {
//         error: 'Not found',
//         message: 'Rest route not found.',
//     },
// }

// export const HTTP_INTERNAL_SERVER_ERROR: HTTP_RESPONSE_BODY = {
//     code: 500,
//     response: {
//         error: 'Server error',
//         message: 'Something went wrong.',
//     },
// }

// export const HTTP_NOT_IMPLEMENTED: HTTP_RESPONSE_BODY = {
//     code: 501,
//     response: {
//         error: 'Not Implemented',
//         message: `REST route doesn't exist.`,
//     },
// }

// export const response = (
//     body: HTTP_RESPONSE_BODY,
//     message: string,
// ): HTTP_RESPONSE_BODY => {
//     return {
//         ...body,
//         response: {
//             ...body.response,
//             message,
//         },
//     }
// }
