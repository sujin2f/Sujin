import { unstable_cache } from 'next/cache'
import { Suspense } from 'react'
import { ObjectId } from 'mongodb'
import sanitize from 'mongo-sanitize'
/* Models */
import { A_Error, ForbiddenError, NoContentError } from '@common/model/Error'
/* Components */
import { LoadingTable } from '@app/_components/LoadingTable'
import { ListClient } from '@app/recipe/_components/List.client'
import Row from '@common/components/layout/Row'
import Column from '@common/components/layout/Column'
import Button from '@common/components/forms/Button'
/* Utils */
import { getCurrentUser } from '@app/api/auth/_lib/utils-server'
import { deleteRecipe } from '@app/recipe/_lib/deleteRecipe'
import { findWithCount } from '@common/data/mongo/mongo'
import { cachedRequest } from '@app/_lib/utils/cache'
/* CONSTANTS */
import { VERSION } from '@common/constants/helper'
import { revalidate } from '@app/_lib/constants'
import { COLLECTION, type PropWithPages, type T_Recipe } from '@app/_lib/types'
import { PER_PAGE } from '@app/_lib/constants'
/* T_Types */
import type { T_Mongo, T_Stringify } from '@common/types/mongo'

type Props = {
    page: number
    userId?: ObjectId
    title?: string
}

export async function ListServer({ title = 'Recipes', page, userId }: Props) {
    const user = await getCurrentUser().catch(() => undefined)
    const mine = !!userId
    if (mine && !user) {
        throw new ForbiddenError('You must log-in for this service.').log()
    }

    const request = unstable_cache(
        async (page: number, userId?: ObjectId) =>
            await getCachedRecipes(page, userId).catch(() => ({
                list: [],
                pages: 0,
            })),
        [page.toString(), userId ? userId.toString() : '', VERSION],
        {
            tags: ['recipe', 'list'],
            revalidate,
        },
    )

    const remove = async (id: string) => {
        'use server'
        await deleteRecipe(new ObjectId(id)).catch((e) => {
            if (e instanceof A_Error) {
                e.log()
            }
            throw e
        })
    }

    return (
        <>
            <h2>{title}</h2>
            {user && (
                <Row fullWidth className="--gap--bottom">
                    <Column large={6}>
                        {!userId ? (
                            <Button href="/recipe/mine/1" title="My Recipes" />
                        ) : (
                            <Button href="/recipe/1" title="Public Recipes" />
                        )}
                    </Column>
                    <Column className="--right" large={6}>
                        <Button
                            href="/recipe/mutate/new"
                            title="Add a New Recipe"
                        />
                    </Column>
                </Row>
            )}

            <Suspense fallback={<LoadingTable />}>
                <ListClient
                    request={request(page, userId)}
                    mine={mine && user}
                    remove={remove}
                    page={page}
                />
            </Suspense>
        </>
    )
}

/**
 *
 * @param page
 * @param user
 * @returns {PropWithPages<T_Stringify<T_Recipe>>}
 * @throws {NoContentError}
 */
const getCachedRecipes = async (_page: number, user?: ObjectId) => {
    const page = sanitize(_page)
    let error: Error | null = null
    const recipes = await cachedRequest(
        COLLECTION.RECIPE,
        [user?.toString(), page],
        async () => {
            const doc = user ? { user } : {}

            const { find, count } = await findWithCount<T_Mongo<T_Recipe>>(
                COLLECTION.RECIPE,
                doc,
            )
            const list = await find
                .skip(PER_PAGE * (page - 1))
                .limit(PER_PAGE)
                .project<T_Stringify<T_Recipe>>({
                    search: 0,
                })
                .map((recipe) => ({
                    ...recipe,
                    _id: recipe._id.toString(),
                    user: recipe.user.toString(),
                }))
                .toArray()

            // Failed to find the post, cache false
            if (!list.length) {
                error = new NoContentError(
                    'Recipes cannot be found.',
                    page,
                    user?.toString(),
                )
                return false
            }

            return {
                list,
                pages: Math.ceil(count / PER_PAGE),
            } satisfies PropWithPages<T_Stringify<T_Recipe>>
        },
    )
    if (error) {
        throw error
    }

    return recipes as PropWithPages<T_Stringify<T_Recipe>>
}
