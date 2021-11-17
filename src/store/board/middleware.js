import { EvntComWebSocket } from 'evntcom-js/dist/web';

import { actions } from "./";

let websocket;

const isDev = process.env.NODE_ENV === "development";

const getEmitterName = (store) => `evntboard:board:${store.getState()?.board?.ws?.id}`

const middleware = (store) => (next) => (action) => {
  switch (action.type) {
    case actions.wsConnect.type:
      // Configure the object
      try {
        websocket = new EvntComWebSocket({
          port: isDev ? 5000 : window.location.port,
          host: window.location.hostname,
          events: [
            "evntboard-init",
            "evntboard-init-tmp",
            "evntboard-patch",
            "evntboard-patch-tmp",
          ],
        })

        websocket.connect()

        websocket.on('open', (id) => {
          store.dispatch(actions.wsOnOpen(id))
          websocket.notify('newEvent', ['evntboard-start', {}, { emitter: getEmitterName(store) }]);
        })

        websocket.on('close', (event) => {
          store.dispatch(actions.wsOnClose(event))
        })

        websocket.on('event', ({event, ...rest}) => {
          switch (event) {
            case 'evntboard-init':
              store.dispatch(actions.setData(rest.payload))

              // try to find default board :)
              let defaultBoard = [...rest.payload].find((itm) => itm.default)

              if (!defaultBoard) {
                defaultBoard = rest.payload[0]
              }

              store.dispatch(actions.setCurrentBoardId(defaultBoard?.id))
              break;
            case 'evntboard-init-tmp':
              store.dispatch(actions.setTmpData(rest.payload))
              break;
            case 'evntboard-patch':
              store.dispatch(actions.patchData(rest.payload))
              break;
            case 'evntboard-patch-tmp':
              store.dispatch(actions.patchTmpData(rest.payload))
              break;
            default:
              break;
          }
        })

        websocket.on('error', (event) => {
          store.dispatch(actions.wsOnError(event));
        })
      } catch (e) {
        store.dispatch(actions.wsOnError(e));
      }
      break;

    case actions.dataCreate.type: {
      websocket.notify('newEvent', ['evntboard-create', action.payload, { emitter: getEmitterName(store) }]);
      break;
    }

    case actions.dataUpdate.type: {
      websocket.notify('newEvent', ['evntboard-update', action.payload, { emitter: getEmitterName(store) }]);
      break;
    }

    case actions.dataDelete.type: {
      websocket.notify('newEvent', ['evntboard-delete', action.payload, { emitter: getEmitterName(store) }]);
      break;
    }

    case actions.wsCreateEvent.pending.type: {
      websocket.notify('newEvent', [action.meta.arg.event, action.meta.arg.payload, { emitter: getEmitterName(store) }]);
      break;
    }

    case actions.wsDisconnect.type:
      websocket.disconnect();
      break;

    default:
      // We don't really need the default but ...
      break;
  }

  return next(action);
};

export default middleware;
