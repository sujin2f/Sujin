'use client'
import { useRouter } from 'next/navigation'
import { useRef } from 'react'
/* Components */
import { Button } from '@common/components/forms/Button'
import HeaderComponent from '@app/admin/_components/Header'
import { Input } from '@common/components/forms/Input'

type Props = {
    update: (slug: string) => Promise<void>
}

export function Header({ update }: Props) {
    const router = useRouter()
    const ref = useRef<HTMLInputElement>(null)

    return (
        <HeaderComponent title="Categories">
            <Input label="Pull from Wordpress" ref={ref} />
            <Button
                title="Update"
                onClick={() =>
                    update(ref.current?.value || '').then(() => {
                        ref.current!.value = ''
                        router.refresh()
                    })
                }
            />
        </HeaderComponent>
    )
}
