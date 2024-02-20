import { v1 as uuidv1 } from 'uuid'
import { populateModelValues, setDefaultValues } from '../genericModelFunctions'
import { GenericProperty } from '../genericProperty'

export default class CardClass {
  constructor (values = {}, rootState) {
    const model = {
      id: new GenericProperty({
        type: 'number',
        hidden: true
      }),
      title: new GenericProperty({
        label: 'Title',
        required: true
      }),
      description: new GenericProperty({
        label: 'Description',
        inputType: 'editor'
      }),
      date: new GenericProperty({
        label: 'Date',
        inputType: 'date'
      }),
      dateUNIX: new GenericProperty({
        hidden: true
      }),
      createdDate: new GenericProperty({
        hidden: true
      }),
      updatedDate: new GenericProperty({
        hidden: true
      }),
      dayNo: new GenericProperty({
        hidden: true
      }),
      day: new GenericProperty({
        hidden: true
      }),
      month: new GenericProperty({
        hidden: true
      }),
      clientName: new GenericProperty({
        hidden: true
      }),
      clientShortName: new GenericProperty({
        hidden: true
      }),
      updatedBy: new GenericProperty({
        hidden: true
      }),
      assignee: new GenericProperty({
        label: 'Assignee',
        helpText: ' Email Address',
        inputType: 'email'
      })
    }
    values.id = values.id ?? uuidv1()

    if (values.date) {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      const JSdate = new Date(values.date)
      values.dayNo = JSdate.getDate()
      values.day = days[JSdate.getDay()]
      values.month = months[JSdate.getMonth()]
      values.dateUNIX = Number(JSdate)
    }

    const modelToReturn = populateModelValues(model, values, (model, key, values) => {
      model[key].value = values[key]
    })

    return setDefaultValues(modelToReturn)
  }
}
