import { v1 as uuidv1 } from 'uuid'

export function makeItem ({ title, description, date, dateUNIX, createdDate, updatedDate, dayNo, day, month, clientName, clientShortName, updatedBy, assignee, id = null }) {
  id = id || uuidv1()
  return { id, title, description, date, dateUNIX, createdDate, updatedDate, dayNo, day, month, clientName, clientShortName, updatedBy, assignee }
}

export function makeList (title, items = []) {
  const id = uuidv1()
  return { id, title, items }
}
