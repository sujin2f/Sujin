import { BlockMath } from 'react-katex'
import { PropsWithChildren, ReactNode } from 'react'

type Props = {
    readonly caption?: ReactNode
}

export const Latex = ({ caption, children }: PropsWithChildren<Props>) => {
    return (
        <div className="latex__container">
            <div className="latex">
                <BlockMath>{children}</BlockMath>
            </div>
            {caption && (
                <div className="caption">
                    <div className="caption__text">{caption}</div>
                </div>
            )}
        </div>
    )
}
