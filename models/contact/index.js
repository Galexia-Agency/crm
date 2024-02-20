import { populateModelValues, setDefaultValues } from '../genericModelFunctions'
import { GenericProperty } from '~/models/genericProperty'

export default class ContactClass {
  constructor (values = {}, rootState) {
    const client = rootState.client.all.find((client) => client.id === values.client_id)
    const address = client.address ? JSON.stringify(client.address) : null

    const model = {
      id: new GenericProperty({
        type: 'number',
        hidden: true
      }),
      client_id: new GenericProperty({
        type: 'number',
        required: true,
        hidden: true
      }),
      address: new GenericProperty({
        value: address,
        hidden: true
      }),
      google_contact_id: new GenericProperty({
        type: 'number',
        hidden: true
      }),
      title: new GenericProperty({
        label: 'Gender',
        inputType: 'select',
        options: ['Male', 'Female', 'Other']
      }),
      f_name: new GenericProperty({
        label: 'First Name',
        required: true
      }),
      l_name: new GenericProperty({
        label: 'Last Name'
      }),
      tel: new GenericProperty({
        label: 'Telephone',
        inputType: 'tel',
        noSpaces: true
      }),
      email: new GenericProperty({
        label: 'Email',
        inputType: 'email',
        required: true
      }),
      role: new GenericProperty({
        label: 'Role'
      }),
      facebook: new GenericProperty({
        label: 'Facebook'
      }),
      updated_at: new GenericProperty({
        hidden: true
      }),
      created_at: new GenericProperty({
        hidden: true
      })
    }
    const modelToReturn = populateModelValues(model, values, (model, key, values) => {
      if (key === 'email') {
        model[key].value = values[key].toLowerCase()
      } else {
        model[key].value = values[key]
      }
    })
    return setDefaultValues(modelToReturn)
  }
}
