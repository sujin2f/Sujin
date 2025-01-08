import { useCallback, useRef } from 'react'
import { debounce } from 'src/common/utils/device'

/**
 * Not to execute the single click when onClick and onDoubleClick are combined
 */
export const useSingleAndDoubleClick = (
    callbackClick: () => void,
    callbackDoubleClick: () => void,
) => {
    const clicks = useRef(0)

    const callFunction = useCallback(() => {
        debounce(() => {
            switch (clicks.current) {
                case 1:
                    callbackClick()
                    break
                case 3:
                    callbackDoubleClick()
                    break
            }
            clicks.current = 0
        }, 250)
    }, [callbackClick, callbackDoubleClick])

    // clicks will be 1 when it triggers onClick
    const handleClick = () => {
        clicks.current++
        callFunction()
    }

    // clicks will be 3 (2 onClick + 1 onDoubleClick)
    const handleDoubleClick = () => {
        clicks.current++
    }

    return [handleClick, handleDoubleClick]
}
