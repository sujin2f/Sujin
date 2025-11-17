// import { unstable_cache } from 'next/cache'
// import { Suspense } from 'react'
// import { ObjectId } from 'mongodb'
// /* Models */
// import { ForbiddenError } from '@sujin/common/model/Error'
// /* Components */
// import { LoadingTable } from '@app/_components/LoadingTable'
// import { ListClient } from '@app/recipe/_components/List.client'
// import Row from '@sujin/common/components/layout/Row'
// import Column from '@sujin/common/components/layout/Column'
// import Button from '@sujin/common/components/forms/Button'
// import Wrapper from '@app/_components/Wrapper'
// /* Utils */
// import { getCurrentUser } from '../../api/auth/_lib/utils-server'
// import { findWithCount } from '@sujin/common/data/mongo/mongo'
// import { cachedRequest, getCacheKey } from '@app/_lib/utils/cache'
// /* CONSTANTS */
// import { VERSION } from '@sujin/common/constants/helper'
// import { revalidate } from '@app/_lib/constants'
// import {
//     COLLECTION,
//     MENU_NAMES,
//     type PropWithPages,
//     type T_Recipe,
// } from '@app/_lib/types'
// import { PER_PAGE } from '@app/_lib/constants'
// import { mongoStringify } from '@sujin/common/utils/object'
// /* T_Types */
// import type { T_Mongo } from '@sujin/common/types/mongo'

type Props = {
    page: number
    mine?: boolean
    title?: string
}

export async function ListServer({ title = 'Recipes', page, mine }: Props) {
    return <></>
    //     const user = await getCurrentUser()
    //     if (mine && !user) {
    //         throw new ForbiddenError('You must log-in for this service.').log()
    //     }
    //     const userId = user ? new ObjectId(user._id) : undefined

    //     return (
    //         <Wrapper
    //             menu={MENU_NAMES.MAIN}
    //             title={mine ? 'My Recipes' : 'Recipes'}
    //             excerpt=""
    //         >
    //             <article>
    //                 <h2>{title}</h2>
    //                 {user && (
    //                     <Row fullWidth className="--gap--bottom">
    //                         <Column large={6}>
    //                             {mine ? (
    //                                 <Button
    //                                     href="/recipe/1"
    //                                     title="Public Recipes"
    //                                 />
    //                             ) : (
    //                                 <Button
    //                                     href="/recipe/mine/1"
    //                                     title="My Recipes"
    //                                 />
    //                             )}
    //                         </Column>
    //                         <Column className="--right" large={6}>
    //                             <Button
    //                                 href="/recipe/add"
    //                                 title="Add a New Recipe"
    //                             />
    //                         </Column>
    //                     </Row>
    //                 )}
    //                 <Suspense fallback={<LoadingTable />}>
    //                     <ListClient
    //                         request={getRecipes(page, userId).then((result) => ({
    //                             ...result,
    //                             list: result.list.map((item) =>
    //                                 mongoStringify(item),
    //                             ),
    //                         }))}
    //                         mine={mine}
    //                         page={page}
    //                     />
    //                 </Suspense>
    //             </article>
    //         </Wrapper>
    //     )
    // }

    // /**
    //  *
    //  * @param page
    //  * @param user
    //  * @returns {Promise<PropWithPages<T_Mongo<T_Recipe>>>}
    //  * @throws {NoContentError}
    //  */
    // const getRecipes = async (
    //     page: number,
    //     userId?: ObjectId,
    // ): Promise<PropWithPages<T_Mongo<T_Recipe>>> => {
    //     const request = unstable_cache(
    //         cached,
    //         [page.toString(), userId ? userId.toString() : '', VERSION],
    //         {
    //             tags: ['recipe', 'list'],
    //             revalidate,
    //         },
    //     )
    //     return await request(page, userId)
    // }

    // const query = async (page: number, user?: ObjectId) => {
    //     const doc = user ? { user } : {}
    //     const { find, count } = await findWithCount<T_Mongo<T_Recipe>>(
    //         COLLECTION.RECIPE,
    //         doc,
    //     )
    //     const list = await find
    //         .skip(PER_PAGE * (page - 1))
    //         .limit(PER_PAGE)
    //         .project<T_Mongo<T_Recipe>>({
    //             search: 0,
    //         })
    //         .toArray()

    //     return {
    //         list,
    //         pages: Math.ceil(count / PER_PAGE),
    //     }
    // }

    // const cached = async (page: number, user?: ObjectId) => {
    //     const request = cachedRequest(
    //         query,
    //         getCacheKey(COLLECTION.RECIPE, 'search', user?.toString(), page),
    //     )
    //     return await request(page, user)
}
