import React, {useEffect, useMemo, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import {Button, Modal} from "antd";
import { useHistory, useParams } from "react-router-dom";
import {ExclamationCircleOutlined} from "@ant-design/icons";

import { actions, selectors } from '../../store/board'
import Preview from "./Preview";

export const BoardEditItem = () => {
  const history = useHistory()
  const { boardId } = useParams();
  const dispatch = useDispatch();
  const [board, setBoard] = useState(null)
  const boards = useSelector(selectors.getData)

  const currentBoard = useMemo(() => {
    return boards.find(board => board.id === boardId)
  }, [boards, boardId])

  useEffect(() => {
    if (currentBoard) {
      setBoard(currentBoard)
    } else {
      setBoard(null)
    }
  }, [currentBoard])

  const handleOnClick = () => {
    history.push('/board/edit')
  }

  const handleOnSave = () => {
    Modal.confirm({
      title: `Do you want to update this board ${currentBoard?.name} ?`,
      icon: <ExclamationCircleOutlined />,
      content: 'Be careful, this action will replace configuration of this board !',
      onOk: () => {
        dispatch(actions.dataUpdate(board))
        history.push('/board/edit')
      }
    });
  }

  return (
    <>
      <div style={{ display: 'flex', padding: 8 }}>
        <h1 style={{ flexGrow: 1, margin: 'auto' }}>Update {currentBoard?.name}</h1>
        <Button onClick={handleOnClick} style={{ marginRight: 8 }}>
          Back to boards
        </Button>
        <Button type='primary' onClick={handleOnSave}>
          Save
        </Button>
      </div>
      <div className='grid-main grid-main-edit'>
        { currentBoard?.color && (<div className='bg-color' style={{ backgroundColor: currentBoard.color }} />) }
        { currentBoard?.image && (<img className='bg-image' src={currentBoard.image}  alt='bg-grid' />) }
        { currentBoard && <Preview setBoard={setBoard} board={board} /> }
      </div>
    </>
  )
}