import { v1 as uuidv1 } from 'uuid'

export function makeCard ({ title, description, date, createdDate, updatedDate, clientName, clientShortName, updatedBy, assignee, id = null }) {
  id = id || uuidv1()
  let dayNo, day, month, dateUNIX
  if (date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const JSdate = new Date(date)
    dayNo = JSdate.getDate()
    day = days[JSdate.getDay()]
    month = months[JSdate.getMonth()]
    dateUNIX = Number(new Date(date))
  }
  return { id, title, description, date, dateUNIX, createdDate, updatedDate, dayNo, day, month, clientName, clientShortName, updatedBy, assignee }
}

export function makeList (title, items = [], archived = false) {
  const id = uuidv1()
  return { id, title, items, archived }
}
