import React from 'react'

import { useGlobalState } from 'src/frontend/hooks/useGlobalState'
import HamburgerIcon from 'src/frontend/images/hamburger.svg'

export function Hamburger() {
    const { wrapperClasses, setWrapperClass } = useGlobalState()

    return (
        <button
            className="hide-for-large hamburger"
            onClick={() =>
                setWrapperClass({
                    'wrapper--mobile-menu':
                        !wrapperClasses['wrapper--mobile-menu'],
                })
            }
            type="button"
        >
            <HamburgerIcon />
        </button>
    )
}
