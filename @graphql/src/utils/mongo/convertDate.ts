import { T_Page } from '@sujin/lib/types'

export const convertDate = <T extends T_Page>(post: T) => {
    return {
        ...post,
        date: (post.date as unknown as Date).getTime(),
    }
}
