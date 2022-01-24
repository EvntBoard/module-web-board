import React, { useMemo } from 'react'
import { isEmpty } from 'lodash'
import { Menu, Dropdown } from 'antd';

import Handler from './Handler'
import text2png from '../../../utils/txtToPng'
import getContrastYIQ from '../../../utils/getContrastYIQ'

const Track = ({button, grabbing, onMouseDown, onHandlerMouseDown, onClickUpdate, onClickDelete}) => {
  const url = useMemo(() => {
    if (button.image && !isEmpty(button.image)) {
      return button.image
    }
    return null
  }, [button?.image])

  const color = useMemo(() => button.color ? getContrastYIQ(button.color) : 'black', [button?.color])

  const textImage = useMemo(() => {
    if (button.text && !isEmpty(button.text)) {
      const border = color === 'white' ? 'black' : 'white'
      return text2png(button.text, { strokeWidth: 2, strokeColor: border, color, padding: 15 })
    }
    return null
  }, [button?.text, color])

  const handleClickMenu = ({ key }) => {
    switch (key) {
      case 'update':
        onClickUpdate(button)
        break;
      case 'delete':
        onClickDelete(button)
        break;
      default:
        break;
    }
  }

  if (!button) {
    return null
  }

  return (
    <div
      onMouseDown={onMouseDown}
      className='preview-track'
      style={{
        cursor: grabbing ? 'grabbing' : 'grab',
        gridArea: button.id
      }}
    >
      <Dropdown
        overlay={(
          <Menu onClick={handleClickMenu}>
            <Menu.Item key="update">Edit</Menu.Item>
            <Menu.Item key="delete">Delete</Menu.Item>
          </Menu>
        )}
        trigger={['contextMenu']}
      >
        <div
          className={`preview-track-content ${grabbing ? 'shadow-lg' : 'shadow'}`}
          style={{
            backgroundColor: button.color,
            color: button.color ? getContrastYIQ(button.color) : null
          }}
        >
          { url && <img src={url}  alt='' /> }
          { textImage && <img className='preview-track-content-text' src={textImage} alt='' /> }
        </div>
      </Dropdown>
      <Handler position="top" onMouseDown={onHandlerMouseDown('top')} />
      <Handler position="right" onMouseDown={onHandlerMouseDown('right')} />
      <Handler position="bottom" onMouseDown={onHandlerMouseDown('bottom')} />
      <Handler position="left" onMouseDown={onHandlerMouseDown('left')} />
    </div>
  );
}

export default Track
