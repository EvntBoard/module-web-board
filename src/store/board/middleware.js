import {JSONRPCServerAndClient, JSONRPCServer, JSONRPCClient} from "json-rpc-2.0";

import { actions } from "./";
import { wsId } from "./selector";

const getEmitter = (store) => `evntboard:board:${wsId(store.getState())}`

const middleware = (store) =>  {
  let webSocket;

  let serverAndClient = new JSONRPCServerAndClient(
    new JSONRPCServer(),
    new JSONRPCClient((request) => {
      try {
        webSocket.send(JSON.stringify(request));
        return Promise.resolve();
      } catch (error) {
        return Promise.reject(error);
      }
    })
  );

  serverAndClient.addMethod('connected', async ({ id }) => {
    store.dispatch(actions.wsOnOpen(id))

    await serverAndClient.request('events.subscribe', [
      "evntboard-init",
      "evntboard-init-tmp",
      "evntboard-patch",
      "evntboard-patch-tmp",
    ])
    await serverAndClient.request('event.new', {
      name: 'evntboard-start',
      emitter: getEmitter(store)
    })
  })

  serverAndClient.addMethod('events.subscription', ({ result: event }) => {
    switch (event?.name) {
      case 'evntboard-init':
        store.dispatch(actions.setData(event?.payload))

        // try to find default board :)
        let defaultBoard = [...event?.payload].find((itm) => itm.default)

        if (!defaultBoard) {
          defaultBoard = event?.payload[0]
        }

        store.dispatch(actions.setCurrentBoardId(defaultBoard?.id))
        break;
      case 'evntboard-init-tmp':
        store.dispatch(actions.setTmpData(event?.payload))
        break;
      case 'evntboard-patch':
        store.dispatch(actions.patchData(event?.payload))
        break;
      case 'evntboard-patch-tmp':
        store.dispatch(actions.patchTmpData(event?.payload))
        break;
      default:
        break;
    }
  })

  return (next) => (action) => {
      switch (action.type) {
        case actions.wsConnect.type:
          const protocolPrefix = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
          webSocket = new WebSocket(`${protocolPrefix}//${window.location.host}/api-ws`);

          webSocket.onmessage = (event) => {
            serverAndClient.receiveAndSend(JSON.parse(event.data.toString()));
          };

          // On close, make sure to reject all the pending requests to prevent hanging.
          webSocket.onclose = (event) => {
            store.dispatch(actions.wsOnClose(event))
            serverAndClient.rejectAllPendingRequests(
              `Connection is closed (${event.reason}).`
            );
          };
          break;

        case actions.dataCreate.type: {
          serverAndClient.request('event.new', {
            name: 'evntboard-create',
            emitter: getEmitter(store),
            payload: action.payload
          });
          break;
        }

        case actions.dataUpdate.type: {
          serverAndClient.request('event.new', {
            name: 'evntboard-update',
            emitter: getEmitter(store),
            payload: action.payload
          });
          break;
        }

        case actions.dataDelete.type: {
          serverAndClient.request('event.new', {
            name: 'evntboard-delete',
            payload: action.payload,
            emitter: getEmitter(store)
          });
          break;
        }

        case actions.wsCreateEvent.pending.type: {

          serverAndClient.request('event.new', {
            name: action.meta.arg.event,
            payload: action.meta.arg.payload,
            emitter: getEmitter(store)
          });
          break;
        }

        case actions.wsDisconnect.type:
          webSocket.disconnect();
          break;

        default:
          // We don't really need the default but ...
          break;
      }

      return next(action);
    };
}

export default middleware;
