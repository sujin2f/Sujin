import React from 'react'

import { useGlobalState } from 'src/frontend/hooks/global'
import HamburgerIcon from 'src/frontend/images/hamburger.svg'

export const Hamburger = (): JSX.Element => {
    const { wrapperClasses, setWrapperClass } = useGlobalState()

    return (
        <button
            className="hide-for-large hamburger"
            type="button"
            onClick={() =>
                setWrapperClass({
                    'wrapper--mobile-menu':
                        !wrapperClasses['wrapper--mobile-menu'],
                })
            }
        >
            <HamburgerIcon />
        </button>
    )
}
