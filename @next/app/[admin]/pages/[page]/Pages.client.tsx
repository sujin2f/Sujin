'use client'
import { useRouter } from 'next/navigation'
import { use, useRef, useState } from 'react'
import Link from 'next/link'
/* Components */
import HeaderComponent from '@app/admin/_components/Header'
import Callout from '@sujin/common/components/containers/Callout'
import Row from '@sujin/common/components/layout/Row'
import Column from '@sujin/common/components/layout/Column'
import InputGroup from '@sujin/common/components/forms/InputGroup'
import Table from '@sujin/common/components/containers/Table'
import { PrevNext } from '@app/admin/_components/PrevNext'
/* T_Types */
import type { T_Page } from '@app/_lib/types'

type Props = {
    readonly pages: Promise<T_Page[]>
    readonly page: number
    readonly remove: (slug: string) => Promise<string>
    readonly update: (slug: string) => Promise<string>
}

export function PagesClient({ page, remove, update, ...props }: Props) {
    const pages = use(props.pages)
    const [message, setMessage] = useState('')
    const router = useRouter()
    const ref = useRef<HTMLInputElement>(null)

    return (
        <>
            <HeaderComponent title="Pages">
                <InputGroup
                    ref={ref}
                    label="Slug"
                    button="Update"
                    onSubmit={() =>
                        update(ref.current?.value || '').then((message) => {
                            ref.current!.value = ''
                            setMessage(message)
                            router.refresh()
                        })
                    }
                />
            </HeaderComponent>
            {message ? <Callout>{message}</Callout> : null}
        </>
    )
}
