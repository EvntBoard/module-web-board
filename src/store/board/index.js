import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { getData } from './selector'

export * as selectors from './selector'

const PATH = "BOARD";

const wsCreateEvent = createAsyncThunk(
  `${PATH}/NEW_EVENT`,
  async (eventData, { getState, dispatch, rejectWithValue }) => {
  if (eventData?.payload?.type === 'switch-board' && eventData?.payload?.board_slug) {
      const boards = getData(getState());
      const data = boards.find((board) => board.slug === eventData.payload.board_slug)
      if (!data) {
        return rejectWithValue(`Can't switch to ${eventData.payload.board_slug} cause no board found !`)
      }
      dispatch(slice.actions.setCurrentBoardId(data.id))
    }
    return eventData
  }
)

const slice = createSlice({
  name: PATH,
  initialState: {
    currentBoardId: null,
    data: [],
    tmpData: [],
    ws: {
      id: null,
      loading: false,
      error: {}
    }
  },
  reducers: {
    dataCreate: () => {},
    dataUpdate: () => {},
    dataDelete: () => {},
    dataSetDefault: () => {},
    wsConnect: (state) => {
      state.ws.id = null
      state.ws.loading = true
      state.ws.error = {}
    },
    wsDisconnect: (state) => {
      state.ws.id = null
      state.ws.loading = false
      state.ws.error = {}
    },
    wsOnOpen: (state, action) => {
      state.ws.id = action.payload
      state.ws.loading = false
      state.ws.error = {}
    },
    wsOnClose: (state) => {
      state.ws.id = null
      state.ws.loading = false
      state.ws.error = {}
    },
    wsOnError: (state, action) => {
      state.ws.id = null
      state.ws.loading = false
      state.ws.error = action.payload
    },
    setCurrentBoardId: (state, action) => {
      state.currentBoardId = action.payload
    },
    setData: (state, action) => {
      state.data = action.payload
    },
    setTmpData: (state, action) => {
      state.tmpData = action.payload
    },
    patchData: (state, action) => {
      state.data = action.payload
    },
    patchTmpData: (state, action) => {
      state.tmpData = action.payload
    },
  }
});

export const actions = {
  ...slice.actions,
  wsCreateEvent,
}
export default slice.reducer;
