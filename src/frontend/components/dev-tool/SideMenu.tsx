import React from 'react'
import { Link } from 'react-router-dom'

export const SideMenu = (): JSX.Element => {
    return (
        <ul>
            <li>
                <Link to="/dev-tools/case">Case Tool</Link>
            </li>
            <li>
                <Link to="/dev-tools/text-sort">Text Sort</Link>
            </li>
        </ul>
    )
}
