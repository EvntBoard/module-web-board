const CACHE_FILENAME = "/board/data.json"

const SAMPLE_BOARD = {
  id: null,
  name: '',
  slug: '',
  description: '',
  default: false,
  image: null,
  color: null,
  width: 5,
  height: 5,
  layout: []
}

const SAMPLE_BUTTON = {
  id: null,
  slug: null,
  type: 'text',
  text: null,
  image: null,
  color: null,
  column_start: null,
  column_end: null,
  row_start: null,
  row_end: null,
}

const conditions = {
  "evntboard-start": true,
  "evntboard-create": true,
  "evntboard-update": true,
  "evntboard-delete": true,
  "evntboard-tmp": true,
};

const type = "QUEUE"; //  CLASSIC / THROTTLE / QUEUE / QUEUE_LOCK / THROTTLE_LOCK

async function reaction({ event: eventName, payload, emitter }) {
  switch (eventName) {
    case "evntboard-start": {
      let newData = file.read(CACHE_FILENAME)

      if (!newData) {
        newData = []
        newData.push({
          ...SAMPLE_BOARD,
          id: 'first-board',
          name: 'First Board',
          default: true,
          layout: [
            {
              ...SAMPLE_BUTTON,
              id: 'first-btn',
              slug: "fart-btn",
              type: "button",
              color: "rgb(114,7,137)",
              text: "Click me",
              column_start: 1,
              column_end: 2,
              row_start: 1,
              row_end: 2,
            }
          ]
        })
        file.write(CACHE_FILENAME, JSON.stringify(newData,  0, 2))
      } else {
        newData = JSON.parse(newData)
      }

      newEvent('evntboard-init', newData, { emitter })
      newEvent('evntboard-init-tmp', temp.get("evntboard-cache"), { emitter })
      break;
    }

      // BOARD
    case "evntboard-create": {
      let data = JSON.parse(file.read(CACHE_FILENAME))

      const newData = [
        ...data,
        {
          ...SAMPLE_BOARD,
          ...payload,
        }
      ]

      file.write(CACHE_FILENAME, JSON.stringify(newData,  0, 2))

      newEvent('evntboard-patch', newData, { emitter })
      break;
    }
    case "evntboard-update": {
      let data = JSON.parse(file.read(CACHE_FILENAME))

      const newData = [
        ...data.filter((i) => i.id !== payload.id),
        {
          ...SAMPLE_BOARD, // au cas ou !
          ...payload
        }
      ]

      file.write(CACHE_FILENAME, JSON.stringify(newData,  0, 2))

      newEvent('evntboard-patch', newData, { emitter })
      break;
    }
    case "evntboard-delete": {
      let data = JSON.parse(file.read(CACHE_FILENAME))

      const newData = data.filter((i) => i.id !== payload.id)

      file.write(CACHE_FILENAME, JSON.stringify(newData,  0, 2))

      newEvent('evntboard-patch', newData, { emitter })
      break;
    }
    case "evntboard-tmp": {
      let evntboardCache = temp.get("evntboard-cache")
      if (!evntboardCache) {
        evntboardCache = []
        evntboardCache.push(payload)
      } else {
        evntboardCache = [
          ...evntboardCache.filter((i) => i.slug !== payload.slug ),
          {
            ...evntboardCache.find((i) => i.slug === payload.slug),
            ...payload
          }
        ]
      }
      temp.set("evntboard-cache", evntboardCache)
      //
      newEvent('evntboard-patch-tmp', evntboardCache, { emitter })
    }
  }
}
