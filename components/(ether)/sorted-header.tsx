import React from 'react'
// import { Link } from 'react-router-dom'
// import { romanize } from '@common/utils/number'
// import { getAtom } from 'src/utils/atom'

// import { Info } from 'src/frontend/components/modal/Info'
// import { PeriodicTable } from 'src/frontend/components/modal/PeriodicTable'

// import { useStore } from 'src/frontend/hooks/useStore'
// import { ContainerSorted } from 'src/model/ContainerSorted'

export const SortedHeader = () => {
    // const p = params
    // console.log(p)
    // const [{ container: c }] = useStore()

    // const container = c as ContainerSorted

    // const prev = useMemo(() => {
    //     if (!container) {
    //         return
    //     }
    //     if (container.number === 1) {
    //         return
    //     }
    //     return getAtom(container.number - 1)
    // }, [container])

    // const next = useMemo(() => {
    //     if (!container) {
    //         return
    //     }
    //     return getAtom(container.number + 1)
    // }, [container])

    // const atom = useMemo(() => {
    //     if (!container) {
    //         return
    //     }
    //     return getAtom(container.number)
    // }, [container])

    // if (!container) {
    //     return <Fragment></Fragment>
    // }

    return (
        <></>
        // <div className="data-header">
        //     <nav className="align__left">
        //         {prev && (
        //             <Link
        //                 to={container.getAddress({
        //                     number: prev.number,
        //                     term: 0,
        //                     ion: 1,
        //                 })}
        //             >
        //                 &lt; {prev.symbol}
        //             </Link>
        //         )}
        //     </nav>
        //     {atom && (
        //         <header className="align__center data-header__title">
        //             <div>
        //                 <h1>
        //                     {atom.symbol} {romanize(container.ion)}
        //                 </h1>
        //                 <div>
        //                     <PeriodicTable />
        //                 </div>
        //             </div>
        //             <Info />
        //         </header>
        //     )}

        //     <nav className="align__right">
        //         {next && (
        //             <Fragment>
        //                 <Link
        //                     to={container.getAddress({
        //                         number: next.number,
        //                         term: 0,
        //                         ion: 1,
        //                     })}
        //                 >
        //                     {next.symbol} &gt;
        //                 </Link>
        //             </Fragment>
        //         )}
        //     </nav>
        // </div>
    )
}
