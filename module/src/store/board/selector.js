import { createSelector } from '@reduxjs/toolkit'

const basic = state => state.board

export const wsId = createSelector(
  basic,
  state => state?.ws?.id
)

export const getData = createSelector(
  basic,
  (state) => [...state.data]
);

export const getTmpData = createSelector(
  basic,
  (state) => state.tmpData
);

export const getCurrentBoardId = createSelector(
  basic,
  (state) => state.currentBoardId
);

export const getCurrentBoard = createSelector(
  getCurrentBoardId,
  getData,
  (currentId, boardsList) => boardsList.find((item) => item.id === currentId)
);

export const getTmpDataForBtn = (button) => createSelector(getTmpData, (state) => state?.find((item) => item.slug === button.slug))