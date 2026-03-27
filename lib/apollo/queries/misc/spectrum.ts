'use server'
/* Models */
import { client } from '@app/_lib/graphql/client'
/* CONSTANTS */
import QUERY from '@lib/apollo/queries/misc/spectrum-gql.graphql'
import { IS_DEV } from '@common/constants/helper'
/* T_Types */
import type { ISpectrum } from '@common/types'
import { Logger } from '@common/model/Logger'

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
            Logger.error(`Error fetching spectrum with ${number}, ${ion}, ${JSON.stringify(e)}`)
            return []
        })
}
