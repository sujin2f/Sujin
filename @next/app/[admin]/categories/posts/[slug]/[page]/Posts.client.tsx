'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
/* Components */
import Button from '@sujin/common/components/forms/Button'
import Table from '@sujin/common/components/containers/Table'
import { PrevNext } from '@app/admin/_components/PrevNext'
import Row from '@sujin/common/components/layout/Row'
import Column from '@sujin/common/components/layout/Column'
import Header from '@app/admin/_components/Header'
import Callout from '@sujin/common/components/containers/Callout'
/* T_Types */
import type { T_Archive, T_ArchivePost } from '@app/_lib/types'
import type { T_Stringify } from '@sujin/common/types/mongo'

type Props = {
    readonly page: number
    readonly archive: T_Stringify<T_Archive>
    readonly posts: T_Stringify<T_ArchivePost>[]
    readonly update: (slug: string, page: number) => Promise<string>
}

export function PostsComponent({ page, archive, posts, update }: Props) {
    const [message, setMessage] = useState('')
    const router = useRouter()

    return (
    )
}
