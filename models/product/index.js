import { populateModelValues, setDefaultValues } from '../genericModelFunctions'
import { GenericProperty } from '~/models/genericProperty'

export default class ProductClass {
  constructor (values = {}, rootState) {
    const model = {
      id: new GenericProperty({
        type: 'number',
        hidden: true
      }),
      name: new GenericProperty({
        label: 'Name',
        required: true
      }),
      type: new GenericProperty({
        label: 'Type',
        inputType: 'select',
        options: ['One-off', 'Monthly', 'Yearly'],
        required: true
      }),
      price: new GenericProperty({
        label: 'Price',
        inputType: 'currency',
        type: 'float',
        required: true
      }),
      updated_at: new GenericProperty({
        hidden: true
      }),
      created_at: new GenericProperty({
        hidden: true
      })
    }
    const modelToReturn = populateModelValues(model, values)
    return setDefaultValues(modelToReturn)
  }
}
