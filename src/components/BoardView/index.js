import React from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { notification } from "antd";
import Classic from "./Classic";
import { actions, selectors } from '../../store/board'

export const BoardView = () => {
  const dispatch = useDispatch();
  const currentBoard = useSelector(selectors.getCurrentBoard)

  const onBtnClick = (data) => {
    dispatch(actions.wsCreateEvent({
      event: 'evntboard-click',
      payload: data,
    }))
      .unwrap()
      .catch((error) => {
        notification.error({
          message: 'Error',
          description: error
      });
    })
  }

  return (
    <>
      <Helmet title='Board' />
      <div className='grid-main'>
        { currentBoard?.color && (<div className='bg-color' style={{ backgroundColor: currentBoard.color }} />) }
        { currentBoard?.image && (<img className='bg-image' src={currentBoard.image}  alt='bg-grid' />) }
        { currentBoard && <Classic board={currentBoard} onClick={onBtnClick} /> }
      </div>
    </>
  )
}