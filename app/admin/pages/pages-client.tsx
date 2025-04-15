'use client'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
/* Components */
import HeaderComponent from '@app/admin/_components/Header'
import Callout from '@common/components/containers/Callout'
import { PrevNext } from '@app/admin/_components/PrevNext'
import { Row } from '@common/components/layout/Row'
import { Column } from '@common/components/layout/Column'
import { Table } from '@app/admin/pages/table'
import InputGroup from '@common/components/forms/InputGroup'
/* T_Types */
import type { T_Page } from '@app/_lib/types'

type Props = {
    readonly pages: T_Page[]
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
                <InputGroup
                    ref={ref}
                    label="Slug"
                    button="Update"
                    onSubmit={() =>
                        update(ref.current?.value || '').then((message) => {
                            console.log(ref.current?.value)
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
                    <PrevNext page={page} length={pages.length} path="pages" />
                </Column>
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
