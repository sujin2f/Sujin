/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { updatePost } from '@src/utils/redis/actions/updatePost'
import { IS_DEV } from '@sujin/share/constants/helper'

export const test = async () => {
    if (!IS_DEV) {
        throw new Error('invalid access')
    }

    const result = await updatePost('focus')
    console.log(result)
}
