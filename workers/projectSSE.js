import EventSourcePolyfill from 'eventsource'

onmessage = (e) => {
  const type = e.data[0]
  const url = e.data[1]
  const id = e.data[2]
  const authToken = e.data[3]
  let sse
  if (type === 'start') {
    sse = new EventSourcePolyfill(url, {
      headers: {
        Authorization: authToken
      },
      withCredentials: false
    })
    sse.addEventListener(id, function (event) {
      postMessage(JSON.parse(event.data)[0])
    }, false)
  }
  if (type === 'stop') {
    if (sse) {
      sse.close()
    }
  }
}
