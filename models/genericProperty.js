export class GenericProperty {
  constructor (values = {}) {
    const property = {
      value: null,
      label: 'Property',
      inputType: 'text',
      options: [],
      type: 'string',
      required: false,
      hidden: false,
      noSpaces: false
    }
    const propertyValuesArray = Object.keys(values)
    // Use values to populate values fields in product object
    propertyValuesArray.forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(property, key)) {
        property[key] = values[key]
      }
    })
    return property
  }
}

export function setDefaultValue (property) {
  // Make property type lowercase
  property.type = property.type.toLowerCase()
  if (property.value === null) {
    if (property.type === 'string') {
      property.value = ''
    } else if (property.type === 'number' || property.type === 'integer') {
      property.value = 0
    } else if (property.type === 'float') {
      property.value = 0.00
    } else if (property.type === 'array') {
      property.value = []
    }
  }
  return property
}

export function getValues (model) {
  const valuesOnly = {}
  for (const key in model) {
    if (Object.prototype.hasOwnProperty.call(model, key) && Object.prototype.hasOwnProperty.call(model[key], 'value')) {
      valuesOnly[key] = model[key].value
    }
  }
  return valuesOnly
}
