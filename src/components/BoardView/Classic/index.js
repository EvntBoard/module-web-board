import React, { useMemo } from 'react'
import { template } from "grid-template-parser";

import Button from "./Button";
import newToOld from "../../../utils/newToOld";

const Board = ({ board, onClick }) => {
  const tpl = useMemo(() => {
    if (board) {
      return template({
        width: board.width,
        height: board.height,
        areas: board.layout.reduce((acc, i) => ({ ...acc, [i.id]: newToOld(i) }), {})
      })
    }
    return null
  }, [board])

  if (!tpl) {
    return null
  }

  return (
    <div
      className='grid'
      style={{
        gridTemplateColumns: `repeat(${board.width}, ${100 / board.width}%)`,
        gridTemplateRows: `repeat(${board.height}, ${100 / board.height}%)`,
        gridTemplateAreas: `${tpl}`,
      }}
    >
      {board.layout.map(button => (
        <Button
          onClick={onClick}
          key={button.id}
          button={button}
        />
      ))}
    </div>
  );
}

export default Board;
