import { useQuery } from '@common/graphql/useQuery'
import { operationBackgrounds } from '@constants/graphql'
import { Image } from '@project/types/wordpress'

export const useFrontPage = () => {
    const { data } = useQuery<Image[]>(operationBackgrounds, {})

    const background =
        data && data.length
            ? data[Math.floor(Math.random() * data.length)]
            : undefined

    return background
}
