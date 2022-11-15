import EventSourcePolyfill from 'eventsource'

let sse

onmessage = (e) => {
  const type = e.data[0].toLowerCase()
  if (type === 'start') {
    const url = e.data[1]
    const id = e.data[2]
    const authToken = e.data[3]
    sse = new EventSourcePolyfill(url, {
      headers: {
        Authorization: authToken
      },
      withCredentials: false
    })
    sse.addEventListener(id, function (event) {
      postMessage(JSON.parse(event.data)[0])
    }, false)
  } else if (type === 'stop') {
    sse.close()
    self.close()
  }
}
