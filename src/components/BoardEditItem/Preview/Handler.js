import React from 'react'
import classnames from 'classnames'

const Handler = ({position, onMouseDown}) => (<div className={classnames('preview-handler', position)} onMouseDown={onMouseDown} />)

export default Handler
