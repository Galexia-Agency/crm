import { v1 as uuidv1 } from 'uuid'
import { populateModelValues, setDefaultValues } from '../genericModelFunctions'
import { GenericProperty } from '../genericProperty'
import CardClass from '~/models/card/index'
import { getValues } from '~/models/genericProperty'

export function makeList (title, items = [], archived = false) {
  const id = uuidv1()
  return { id, title, items, archived }
}

export default class ListClass {
  constructor (values = {}, rootState) {
    const model = {
      id: new GenericProperty({
        type: 'number',
        hidden: true
      }),
      title: new GenericProperty({
        label: 'List Title',
        required: true
      }),
      items: new GenericProperty({
        type: 'array',
        hidden: true
      }),
      archived: new GenericProperty({
        type: 'integer',
        inputType: 'checkbox'
      })
    }
    values.id = values.id ?? uuidv1()

    if (values.items) {
      const allModels = []
      values.items.forEach((card) => {
        const hydratedModel = new CardClass(card, rootState)
        allModels.push(getValues(hydratedModel))
      })
      values.items = [...allModels]
    }

    const modelToReturn = populateModelValues(model, values, (model, key, values) => {
      model[key].value = values[key]
    })

    return setDefaultValues(modelToReturn)
  }
}
