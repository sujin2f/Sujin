import { useQuery } from '@common/graphql/useQuery'
import { operationTagCloud } from '@constants/graphql'
import { TagCloud } from '@project/types/wordpress'

export const useTagCloud = () => {
    const { data } = useQuery<TagCloud[]>(operationTagCloud, {})

    return {
        tagCloud: data || [],
    }
}
