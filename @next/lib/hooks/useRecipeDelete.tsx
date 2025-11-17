import { useCallback, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
/* Components */
import { default as ConfirmComponent } from '@common/components/containers/Confirm'
/* CONSTANT */
import { QuantumBool } from '@sujin/share/types'
import { removeRecipe } from '@lib/apollo/mutation/recipe-remove'
/* Utils */

export const useRecipeDelete = (id: string) => {
    const router = useRouter()
    // const [redirection, setRedirect] = useState<boolean>(false)
    const [confirm, setConfirm] = useState<QuantumBool>(QuantumBool.FALSE)
    const [pending, startPending] = useTransition()

    const confirmDelete = useCallback(
        async (value: QuantumBool) => {
            setConfirm(value)
            if (value === QuantumBool.TRUE) {
                startPending(async () => {
                    await removeRecipe(id)
                    router.back()
                })
            }
        },
        [id, router],
    )

    const Confirm = (
        <ConfirmComponent callback={confirmDelete} value={confirm}>
            Do you really want to delete this recipe?
        </ConfirmComponent>
    )

    return { setConfirm, pending, Confirm }
}
