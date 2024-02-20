import { setDefaultValue } from './genericProperty'
import { flattenObject, isJsonString } from '~/plugins/mixins/json'

export function populateModelValues (model, values, customBehavior) {
  const flattenedValues = flattenObject(values)
  Object.keys(flattenedValues).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(model, key)) {
      // We can write our own logic here for tweaking property values based on name
      if (typeof customBehavior === 'function') {
        customBehavior(model, key, flattenedValues)
      // If we're not using custom logic, just hydrate the value
      } else {
        model[key].value = flattenedValues[key]
      }
      // We need to make sure array types which get pushed up as JSON strings are parsed
      if (model[key].type.toLowerCase() === 'array' && isJsonString(model[key].value)) {
        model[key].value = JSON.parse(model[key].value)
      }
      // We need to make sure floats are handled properly. You have to do parseFloat + 1 to not return false when we have a 0 value
      if (model[key].type === 'float' && (parseFloat(model[key].value) + 1)) {
        model[key].value = parseFloat(model[key].value)
      }
    }
  })
  return model
}

export function setDefaultValues (model, customBehavior) {
  for (const key of Object.keys(model)) {
    // Some values may not be the correct null value, so we run a function here
    model[key] = setDefaultValue(model[key])
    if (typeof customBehavior === 'function') {
      customBehavior(model, key)
    }
  }
  return model
}
