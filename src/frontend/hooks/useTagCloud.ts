import { useQuery } from 'src/common/graphql/useQuery'
import { operationTagCloud } from 'src/constants/graphql'
import { TagCloud } from 'src/types/wordpress'

export const useTagCloud = () => {
    const { data } = useQuery<TagCloud[]>(operationTagCloud, {})

    return {
        tagCloud: data || [],
    }
}
