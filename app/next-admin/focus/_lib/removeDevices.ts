'use server'
/* Utils */
import { client } from '@app/_lib/graphql/client'
import { getAuthHeader } from '@app/_lib/utils/tokens'
/* CONSTANTS */
import mutation from '@app/next-admin/focus/_lib/focusRemoveDevices.graphql'

export const removeDevices = async (): Promise<boolean> => {
    'use server'
    const context = await getAuthHeader()
    return await client
        .mutate<{ focusRemoveDevices: boolean }>({
            mutation,
            context,
        })
        .then((result) => {
            if (!result.data || !result.data.focusRemoveDevices) {
                throw new Error('Failed to remove devices.')
            }
            return result.data.focusRemoveDevices
        })
        .catch(() => false)
}
