import { useQuery } from '@src/common/graphql/useQuery'
import { operationBackgrounds } from '@src/constants/graphql'
import { Image } from '@src/types/wordpress'

export const useFrontPage = () => {
    const { data } = useQuery<Image[]>(operationBackgrounds, {})

    const background =
        data && data.length
            ? data[Math.floor(Math.random() * data.length)]
            : undefined

    return background
}
