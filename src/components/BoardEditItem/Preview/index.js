import React, { useMemo, useRef, useState } from 'react'
import { area, template } from 'grid-template-parser'
import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

import Track from './Track'
import GridLayout from "./GridLayout";
import ModalButton from "../Modal/ModalButton";
import useEventListener from '../../../hooks/useEventListener'
import { SAMPLE_BUTTON } from '../../../utils/constants'
import newToOld from '../../../utils/newToOld'
import generateColor from '../../../utils/generateColor'
import clamp from '../../../utils/clamp'
import generateStringId from "../../../utils/generateStringId";

const Preview = ({ board, setBoard }) => {
  const ref = useRef()

  const [dx, setDx] = useState(0)
  const [dy, setDy] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [draggedArea, setDraggedArea] = useState(null)
  const [draggedPosition, setDraggedPosition] = useState(null)
  const [current, setCurrent] = useState(null)
  const [open, setOpen] = useState(false)

  const width = useMemo(() => {
    if (board) {
      return board.width
    }
    return 0
  }, [board])

  const height = useMemo(() => {
    if (board) {
      return board.height
    }
    return 0
  }, [board])

  const tpl = useMemo(() => {
    let areas = []
    if (board?.layout) {
      areas = board?.layout?.reduce((acc, i) => ({ ...acc, [i.id]: newToOld(i) }), {})
    }
    return template({ width, height, areas })
  }, [width, height, board])

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false)
      setDraggedArea(null)
      setDraggedPosition(null)
    }
  }

  const handleMouseMove = evt => {
    if (isDragging) {
      const rect = ref.current.getBoundingClientRect();
      const x = Math.round((evt.clientX - rect.left) / rect.width * width);
      const y = Math.round((evt.clientY - rect.top) / rect.height * height);

      switch (true) {
        case typeof draggedPosition === 'string':
          return moveHandler(x, y);
        case typeof draggedArea === 'string':
          return moveTrack(x, y);
        default:
          return null
      }
    }
  }

  useEventListener('mouseup', handleMouseUp)
  useEventListener('mousemove', handleMouseMove)

  const moveTrack = (x, y) => {
    const button = board?.layout?.find((btn) => btn.id === draggedArea );

    const buttonTop = findAdjacentArea(button, 'top');
    const buttonRight = findAdjacentArea(button, 'right');
    const buttonBottom = findAdjacentArea(button, 'bottom');
    const buttonLeft = findAdjacentArea(button, 'left');

    const column_start = clamp(
      x - dx + 1,
      buttonLeft ? buttonLeft.column_end : 1,
      (buttonRight ? buttonRight.column_start : width + 1) - (button.column_end - button.column_start),
    );

    const row_start = clamp(
      y - dy + 1,
      buttonTop ? buttonTop.row_end : 1,
      (buttonBottom ? buttonBottom.row_start : height + 1) - (button.row_end - button.row_start),
    );

    if (column_start !== button.column_start || row_start !== button.row_start) {
      const column_end = column_start + (button.column_end - button.column_start);
      const row_end = row_start + (button.row_end - button.row_start);

      return moveArea({
        ...button,
        column_start: column_start,
        column_end: column_end,
        row_start: row_start,
        row_end: row_end
      });
    }
  };

  const makeTrackMouseDown = button => evt => {
    evt.preventDefault();
    const rect = ref.current.getBoundingClientRect();
    const x = Math.round((evt.clientX - rect.left) / rect.width * width);
    const y = Math.round((evt.clientY - rect.top) / rect.height * height);

    setDx( x - button.column_start + 1)
    setDy(y - button.row_start + 1)

    setIsDragging(true)
    setDraggedArea(button.id)
  }

  const makeHandlerMouseDown = button => draggedPosition => evt => {
    evt.preventDefault();
    setIsDragging(true)
    setDraggedArea(button.id)
    setDraggedPosition(draggedPosition)
  }

  const moveHandler = (x, y) => {
    let start
    let end

    const button = board?.layout?.find((btn) => btn.id === draggedArea);
    const adjTrigger = findAdjacentArea(button, draggedPosition);

    switch (draggedPosition) {
      case 'top':
        start = clamp(
          y + 1,
          adjTrigger ? adjTrigger.row_end : 1,
          button.row_end - 1,
        );
        return moveArea({ ...button, row_start: start });
      case 'right':
        end = clamp(
          x + 1,
          button.column_start + 1,
          adjTrigger ? adjTrigger.column_start : width + 1,
        );
        return moveArea({ ...button, column_end: end });
      case 'bottom':
        end = clamp(
          y + 1,
          button.row_start + 1,
          adjTrigger ? adjTrigger.row_start : height + 1,
        );
        return moveArea({ ...button, row_end: end });
      case 'left':
        start = clamp(
          x + 1,
          adjTrigger ? adjTrigger.column_end : 1,
          button.column_end - 1,
        );
        return moveArea({ ...button, column_start: start });
      default:
        throw new Error('WTF ?!?')
    }
  }

  const onClickAdd = (event) => {
    event.preventDefault()
    if (isDragging) {
      return
    }
    const rectGrid = event.currentTarget.getBoundingClientRect()

    const gridHeight = rectGrid.bottom - rectGrid.top
    const gridWidth = rectGrid.right - rectGrid.left

    const mouseX = event.clientX - rectGrid.left
    const mouseY = event.clientY - rectGrid.top

    const colWidth = gridWidth / width
    const colHeight = gridHeight / height

    const x = Math.trunc(mouseX / colWidth)
    const y = Math.trunc(mouseY / colHeight)

    const newArea = area({ x, y, width: 1, height: 1 });

    setCurrent({
      ...SAMPLE_BUTTON,
      color: generateColor(),
      column_start: newArea.column.start,
      column_end: newArea.column.end,
      row_start: newArea.row.start,
      row_end: newArea.row.end,
    })
    setOpen(true)
  }

  const moveArea = (button) => {
    setBoard({
      ...board,
      layout: [
        ...board?.layout?.filter(i => i.id !== button.id),
        button
      ]
    })
  }

  const findAdjacentArea = (button, direction) => {
    const { column_start, column_end, row_start, row_end } = button;

    switch (direction) {
      case 'top':
        return board?.layout?.find((i) =>
          i.row_end === row_start &&
          i.column_start < column_end &&
          i.column_end > column_start
        )
      case 'right':
        return board?.layout?.find((i) =>
          i.column_start === column_end &&
          i.row_start < row_end &&
          i.row_end > row_start
        )
      case 'bottom':
        return board?.layout?.find((i) =>
          i.row_start === row_end &&
          i.column_start < column_end &&
          i.column_end > column_start
        )
      case 'left':
        return board?.layout?.find((i) =>
          i.column_end === column_start &&
          i.row_start < row_end &&
          i.row_end > row_start
        )
      default:
        throw new Error('WTF !?')
    }
  }

  const onCreate = (button) => {
    setBoard({
      ...board,
      layout: [
        ...board.layout,
        { ...button, id: generateStringId() }
      ]
    })
    setCurrent(null)
    setOpen(false)
  }

  const onUpdate = (button) => {
    setBoard({
      ...board,
      layout: [
        ...board?.layout?.filter(i => i.id !== button.id),
        button
      ]
    })
    setCurrent(null)
    setOpen(false)
  }

  const onClickDelete = async (button) => {
    Modal.confirm({
      title: `Do you want to delete this button ${button.name} ?`,
      icon: <ExclamationCircleOutlined />,
      content: 'Be careful, this action will delete the configuration of this button !',
      onOk: () => {
        setBoard({
          ...board,
          layout: board?.layout?.filter(i => i.id !== button.id)
        })
      }
    });
  }

  const onCreateOrUpdate = async (button) => {
    if (button.id) {
      onUpdate(button)
    } else {
      onCreate(button)
    }
  }

  const onReset = () => {
    setCurrent(null)
    setOpen(false)
  }

  const onClickUpdate = (button) => {
    setCurrent(button)
    setOpen(true)
  }

  if (!tpl) {
    return null
  }

  return (
    <>
      <ModalButton open={open} onSubmit={onCreateOrUpdate} onCancel={onReset} current={current} />
      <GridLayout width={width} height={height} />
      <div
        id='preview'
        className='preview'
        ref={ref}
        style={{
          gridTemplateColumns: `repeat(${width}, ${100 / width}%)`,
          gridTemplateRows: `repeat(${height}, ${100 / height}%)`,
          gridTemplateAreas: `${tpl}`,
        }}
        onMouseUp={onClickAdd}
      >
        {board?.layout?.map(button => (
          <Track
            key={button.id}
            button={button}
            grabbing={isDragging && draggedArea === button.id && typeof draggedPosition !== 'string'}
            onMouseDown={makeTrackMouseDown(button)}
            onHandlerMouseDown={makeHandlerMouseDown(button)}
            onClickUpdate={onClickUpdate}
            onClickDelete={onClickDelete}
          />
        ))}
      </div>
    </>
  );
}
export default Preview
