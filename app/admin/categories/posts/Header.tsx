'use client'
import { useRouter } from 'next/navigation'
/* Components */
import { Button } from '@common/components/forms/Button'
import HeaderComponent from '@app/admin/_components/Header'

type Props = {
    page: number
    update: (page: number) => Promise<void>
}

export function Header({ update, page }: Props) {
    const router = useRouter()

    return (
        <HeaderComponent title="Category Posts">
            <Button
                title="Pull from WP"
                onClick={() =>
                    update(page).then(() => {
                        router.refresh()
                    })
                }
            />
        </HeaderComponent>
    )
}
