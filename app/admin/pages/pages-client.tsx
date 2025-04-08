'use client'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
/* Components */
import { Button } from '@common/components/forms/Button'
import HeaderComponent from '@app/admin/_components/Header'
import { Input } from '@common/components/forms/Input'
import Callout from '@common/components/containers/Callout'
import { PrevNext } from '@app/admin/_components/PrevNext'
import { Row } from '@common/components/layout/Row'
import { Column } from '@common/components/layout/Column'

import { PageType } from '@app/_lib/data/mysql/types'
import { Table } from './table'

type Props = {
    readonly pages: PageType[]
    readonly page: number
    readonly remove: (slug: string) => Promise<string>
    readonly update: (slug: string) => Promise<string>
}

export function ClientComponent({ pages, page, remove, update }: Props) {
    const [message, setMessage] = useState('')
    const router = useRouter()
    const ref = useRef<HTMLInputElement>(null)

    return (
        <>
            <HeaderComponent title="Pages">
                <Input label="Pull from Wordpress" ref={ref} />
                <Button
                    title="Update"
                    onClick={() =>
                        update(ref.current?.value || '').then((message) => {
                            ref.current!.value = ''
                            setMessage(message)
                            router.refresh()
                        })
                    }
                />
            </HeaderComponent>
            {message ? <Callout>{message}</Callout> : null}
            <Row dom="article" fullWidth>
                <Column small={12}>
                    <Table
                        pages={pages}
                        remove={remove}
                        update={update}
                        setMessage={setMessage}
                    />
                </Column>
                <Column small={12}>
                    <PrevNext page={page} length={pages.length} path="pages" />
                </Column>
            </Row>
        </>
    )
}
