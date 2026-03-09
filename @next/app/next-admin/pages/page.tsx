'use client'
import { Fragment, useState, startTransition } from 'react'
import Link from 'next/link'
/* Components */
import { Paging } from '@app/_components/layout/Paging'
import { Input } from '@app/_components/html-elements/Input'
import { Button } from '@app/_components/html-elements/Button'
/* Utils */
import { useServerAction } from '@app/_lib/hooks/useServerAction'
import { queryPages } from '@app/next-admin/pages/_lib/queryPages'
import { useRedisPub } from '@app/next-admin/_lib/useRedisPub'
/* T_Type */
import type { T_ArchivePost } from '@sujin/lib/types'
/* CONSTANTS */
import { QuantumBool } from '@sujin/share/types'
import { POST_TYPE } from '@sujin/lib/constants'

export default function AdminPages() {
    const [page, setPage] = useState<number>(1)
    const { data, loading, error } = useServerAction<{
        items: T_ArchivePost[]
        total: number
    }>(() => queryPages(page), false, page)

    const [state, action, pending] = useRedisPub()

    if (loading || error || !data)
        return (
            <div className="flex justify-center align-center">
                <div className="animate-spin">⚙️</div>
            </div>
        )

    const { items, total } = data

    return (
        <>
            <h2 className="text-2xl font-bold border-l-6 border-l-primary pl-2 mb-2">Pages</h2>

            <form
                className="block mb-4 grid grid-cols-[max-content_minmax(200px,_1fr)_max-content]"
                onSubmit={(e) => {
                    e.preventDefault()
                    const data = new FormData(e.target as HTMLFormElement)
                    const slug = data.get('slug')?.toString()
                    if (!slug) return
                    startTransition(() => action([POST_TYPE.PAGE, 'update', slug]))
                }}
            >
                <div className="mr-2">Slug</div>
                <Input type="text" name="slug" />
                <Button>Update</Button>
            </form>

            {pending && (
                <div className="bg-yellow-400 flex p-3 mb-2">
                    <div className="animate-spin">⚙️</div> Pending...
                </div>
            )}

            {state === QuantumBool.TRUE && <div className="bg-green-400 flex p-3 mb-2">😀 Done</div>}

            {state === QuantumBool.FALSE && <div className="bg-red-400 flex p-3 mb-2">🤬 Failed</div>}

            <div className="grid grid-cols-[max-content_minmax(200px,_1fr)_max-content_max-content_max-content__max-content]">
                <div className="font-bold border-b-1 px-1">ID</div>
                <div className="font-bold border-b-1 px-1">Title</div>
                <div className="font-bold border-b-1 px-1">Slug</div>
                <div className="font-bold border-b-1 px-1">Status</div>
                <div className="font-bold border-b-1 px-1">Remove</div>
                <div className="font-bold border-b-1 px-1">Refresh</div>

                {(items || []).map((post) => (
                    <Fragment key={`admin-posts-${post._id}`}>
                        <div className="border-b-1 px-1">{post.id}</div>
                        <div className="border-b-1 border-b-black px-1">
                            <Link href={post.link} target="_blank" className="text-primary underline">
                                {post.title}
                            </Link>
                        </div>
                        <div className="border-b-1 px-1">{post.slug}</div>
                        <div className="border-b-1 px-1">{post.status}</div>
                        <div className="border-b-1 px-1">
                            <Link
                                href=""
                                className="text-primary underline"
                                onClick={(e) => {
                                    e.preventDefault()
                                    startTransition(() => action([POST_TYPE.PAGE, 'remove', post.slug]))
                                }}
                            >
                                Remove
                            </Link>
                        </div>
                        <div className="border-b-1 px-1">
                            <Link
                                href=""
                                className="text-primary underline"
                                onClick={(e) => {
                                    e.preventDefault()
                                    startTransition(() => action([POST_TYPE.PAGE, 'update', post.slug]))
                                }}
                            >
                                Refresh
                            </Link>
                        </div>
                    </Fragment>
                ))}
            </div>
            <Paging totalPages={total} urlPrefix={''} currentPage={page} onClick={(page) => setPage(page)} />
        </>
    )
}
