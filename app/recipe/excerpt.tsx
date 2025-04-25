'use client'
/* Components */
import Button from '@common/components/forms/Button'
import ButtonGroup from '@common/components/forms/ButtonGroup'
/* Utils */
import { handleSignIn, handleSignOut } from '@app/api/auth/utils'

export const Excerpt = ({ name }: { name?: string }) => {
    if (name) {
        return (
            <>
                <div>Welcome, {name}</div>
                <ButtonGroup>
                    <Button href="/recipe/mutate/new">New Recipe</Button>
                    <Button href="/recipe/1">List</Button>
                    <Button onClick={handleSignOut}>Sign out</Button>
                </ButtonGroup>
            </>
        )
    }
    return (
        <>
            <Button href="/recipe/1">List</Button>
            <div>Click to log in with Google Account</div>
            <Button onClick={handleSignIn}>Log in</Button>
        </>
    )
}
