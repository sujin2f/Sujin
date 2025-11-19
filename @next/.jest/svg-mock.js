import React from 'react'
// eslint-disable-next-line react/display-name
const SvgMock = React.forwardRef((props, ref) => <span ref={ref} {...props} />)
export const ReactComponent = SvgMock
export default SvgMock
