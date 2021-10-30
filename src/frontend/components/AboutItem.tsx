import React from 'react'

interface Props {
    from: string
    to: string
    content: string
}

export const AboutItem = (props: Props): JSX.Element => {
    return (
        <div className="about-item">
            <div className="about-item__year">
                <div>{props.from}</div>
                <div className="about-item__separator"></div>
                <div>{props.to}</div>
            </div>
            <div
                className="about-item__detail"
                dangerouslySetInnerHTML={{ __html: props.content }}
            ></div>
        </div>
    )
}
