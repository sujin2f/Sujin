'use server'
/* Models */
import { client } from '@lib/utils/apollo-client'
/* CONSTANTS */
import QUERY from '@lib/apollo/queries/misc/spectrum.graphql'
import { IS_DEV } from '@sujin/share/constants/helper'
/* T_Types */
import type { ISpectrum } from '@sujin/lib/types'
import { Logger } from '@sujin/share/model/Logger'

export const spectrum = async (number: number, ion: number): Promise<ISpectrum[]> => {
    return await client
        .query<{ spectrum: ISpectrum[] }>({
            query: QUERY,
            variables: { number, ion },
            fetchPolicy: IS_DEV ? 'network-only' : 'cache-first',
        })
        .then((result) => {
            if (!result.data) {
                return []
            }
            return result.data.spectrum
        })
        .catch((e) => {
            Logger.error(`🤬 Error fetching spectrum with ${number}, ${ion}, ${JSON.stringify(e)}`)
            return []
        })
}
