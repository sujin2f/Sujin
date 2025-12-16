/* Models */
import { select } from '@src/utils/mysql'
/* CONSTANTS */
import { WPQuery } from '@src/utils/mysql/wp-query'
/* Utils */
import { phpUnSerialize } from '@sujin/share/utils/string'

export const getOption = async (key: string): Promise<unknown> => {
    const option = await select<{ option_value: string }>(WPQuery.getOption(key))
        .then((value: { option_value: string }[]) => value[0].option_value)
        .catch(() => undefined)

    if (!option) {
        return
    }

    return phpUnSerialize(option)
}
