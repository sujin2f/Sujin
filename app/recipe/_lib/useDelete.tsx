import { useCallback, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
/* Components */
import Confirm from '@common/components/containers/Confirm'
/* CONSTANT */
import { QuantumBool } from '@common/types'
/* Utils */
import { deleteRecipe } from '@app/recipe/_lib/deleteRecipe'

export const useDelete = (id: string, redirectTo: string) => {
    const router = useRouter()
    // const [redirection, setRedirect] = useState<boolean>(false)
    const [confirm, setConfirm] = useState<QuantumBool>(QuantumBool.FALSE)
    const [isPending, startPending] = useTransition()

    const confirmDelete = useCallback(
        async (value: QuantumBool) => {
            setConfirm(value)
            if (value === QuantumBool.TRUE) {
                startPending(async () => {
                    await deleteRecipe(id)
                    router.push(redirectTo)
                })
            }
        },
        [id, redirectTo, router],
    )

    const Component = (
        <Confirm callback={confirmDelete} value={confirm}>
            Do you really want to delete this?
        </Confirm>
    )

    return { setConfirm, isPending, Confirm: Component }
}
