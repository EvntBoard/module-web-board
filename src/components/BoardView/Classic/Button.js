import React, { useMemo, useState } from 'react'
import { useSelector } from "react-redux";
import cx from 'classnames';

import { selectors } from "../../../store/board";
import getContrastYIQ from '../../../utils/getContrastYIQ'
import txtToPng from '../../../utils/txtToPng'

const Button = ({ button: currentButton, onClick }) => {
  const [clicked, setClicked] = useState(false)
  const tmpData = useSelector(selectors.getTmpDataForBtn(currentButton))

  const button = {
    ...currentButton,
    ...tmpData
  }

  const textImage = useMemo(() => {
    if (button.text) {
      const color = getContrastYIQ(button.color)
      const border = color === 'white' ? 'black' : 'white'
      return txtToPng(button.text, { strokeWidth: 2, strokeColor: border, color, padding: 15 })
    }
    return null
  }, [button.text, button.color])

  const onMouseDown = () => {
    setClicked(true)
  }

  const onMouseUp = () => {
    setClicked(false)
  }

  const onClickButton = () => {
    if (button.type !== 'text') {
      onClick(button)
    }
  }

  if (!button) {
    return null
  }

  return (
    <div
      className='button'
      style={{ gridArea: button.id, cursor: button.type !== 'text' ? 'pointer' : null  }}
    >
      <div className='button-wrapper'>
        <div
          className={cx('button-content', {
            elevation5: button.type !== 'text' && clicked,
            elevation10: button.type !== 'text' && !clicked,
          })}
          style={{
            padding: 0,
            backgroundColor: button.color,
            color: button.color ? getContrastYIQ(button.color) : null,
          }}
        >
          { button.image && <img src={button.image}  alt='' /> }
          { textImage && <img className='button-content-text' src={textImage} alt='' /> }
          { button.type !== 'text' && (<div className='layer' onClick={onClickButton} onMouseDown={onMouseDown} onMouseUp={onMouseUp} />) }
        </div>
      </div>
    </div>
  );
}

export default Button
