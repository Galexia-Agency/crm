import { populateModelValues, setDefaultValues } from '../genericModelFunctions'
import { GenericProperty } from '~/models/genericProperty'
import { safeURL } from '~/plugins/mixins/urls'
import { isJsonString } from '~/plugins/mixins/json'

export default class ClientClass {
  constructor (values = {}, rootState) {
    const model = {
      id: new GenericProperty({
        type: 'number',
        hidden: true
      }),
      pandle_id: new GenericProperty({
        hidden: true
      }),
      business_name: new GenericProperty({
        label: 'Business Name',
        required: true
      }),
      business_shortname: new GenericProperty({
        label: 'Business Shortname',
        required: true
      }),
      about: new GenericProperty({
        label: 'About The Business',
        inputType: 'textarea'
      }),
      billing_email: new GenericProperty({
        label: 'Billing Email'
      }),
      address_line_1: new GenericProperty({
        label: 'Address Line 1'
      }),
      address_line_2: new GenericProperty({
        label: 'Address Line 2'
      }),
      address_line_3: new GenericProperty({
        label: 'Address Line 3'
      }),
      address_town: new GenericProperty({
        label: 'Town / City'
      }),
      address_county: new GenericProperty({
        label: 'County'
      }),
      address_postcode: new GenericProperty({
        label: 'Postcode'
      }),
      address_country: new GenericProperty({
        label: 'Country'
      }),
      source: new GenericProperty({
        label: 'Source'
      }),
      // ToDo
      // Don't use projects as an array. Put a sortOrder on each product
      // projects: new GenericProperty({
      //   type: 'array',
      //   hidden: true
      // }),
      updated_at: new GenericProperty({
        hidden: true
      }),
      created_at: new GenericProperty({
        hidden: true
      })
    }
    // Parse the address so we can handle it in the populateModelValues method
    values.address = isJsonString(values.address) ? JSON.parse(values.address) : values.address

    const modelToReturn = populateModelValues(model, values, (model, key, values) => {
      if (key === 'business_shortname') {
        model[key].value = safeURL(values[key])
      } else {
        model[key].value = values[key]
      }
    })
    return setDefaultValues(modelToReturn)
  }
}
