'use client'
import { useRouter } from 'next/navigation'
/* Components */
import { Button } from '@common/components/forms/Button'
import HeaderComponent from '@app/admin/_components/Header'

type Props = {
    refresh: () => Promise<void>
}

export function Header({ refresh }: Props) {
    const router = useRouter()

    return (
        <HeaderComponent title="Backgrounds">
            <Button
                title="Refresh All"
                onClick={() =>
                    refresh().then(() => {
                        router.refresh()
                    })
                }
            />
        </HeaderComponent>
    )
}
