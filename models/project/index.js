import { populateModelValues, setDefaultValues } from '../genericModelFunctions'
import { GenericProperty } from '~/models/genericProperty'

export default class ProjectClass {
  constructor (values = {}, rootState) {
    const currentUserEmail = rootState.userInfo.email
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
      name: new GenericProperty({
        label: 'Name',
        required: true
      }),
      status: new GenericProperty({
        label: 'Status',
        inputType: 'select',
        options: [
          'Hot Lead',
          'Cold Lead',
          'Development',
          'Ad-Hoc',
          'Paused',
          'In House',
          'On-Going',
          'Closed Lead',
          'Completed',
          'Cancelled'
        ],
        required: true
      }),
      project_url: new GenericProperty({
        label: 'Project URL',
        inputType: 'url'
      }),
      project_login_url: new GenericProperty({
        label: 'Project Login URL',
        inputType: 'url'
      }),
      hosting: new GenericProperty({
        label: 'Hosting'
      }),
      php: new GenericProperty({
        label: 'PHP Version',
        inputType: 'select',
        options: [
          '7.3',
          '7.4',
          '8.0',
          '8.1',
          '8.2'
        ]
      }),
      github_url: new GenericProperty({
        label: 'GitHub Link',
        inputType: 'url'
      }),
      drive_url: new GenericProperty({
        label: 'Google Drive Link',
        inputType: 'url'
      }),
      viewer: new GenericProperty({
        label: 'Project Viewers',
        noSpaces: true
      }),
      contributor: new GenericProperty({
        label: 'Project Contributors',
        noSpaces: true
      }),
      admin: new GenericProperty({
        label: 'Project Admins',
        noSpaces: true
      }),
      completion_amount: new GenericProperty({
        label: 'Completion Total',
        type: 'float',
        inputType: 'currency'
      }),
      bb_revenue: new GenericProperty({
        label: 'Before Business Revenue',
        type: 'float',
        inputType: 'currency'
      }),
      bb_expenses: new GenericProperty({
        label: 'Before Business Expenses',
        type: 'float',
        inputType: 'currency'
      }),
      enquiry_date: new GenericProperty({
        label: 'Date of Enquiry',
        inputType: 'date'
      }),
      start_date: new GenericProperty({
        label: 'Date of Project Start',
        inputType: 'date'
      }),
      ongoing: new GenericProperty({
        label: 'Is/Was this an ongoing project?',
        inputType: 'checkbox',
        type: 'integer'
      }),
      completion_date: new GenericProperty({
        label: 'Date of Project Completion',
        inputType: 'date'
      }),
      lists: new GenericProperty({
        hidden: true,
        type: 'array'
      }),
      pandle_id: new GenericProperty({
        hidden: true
      }),
      updated_at: new GenericProperty({
        hidden: true
      }),
      created_at: new GenericProperty({
        hidden: true
      }),
      pandle_income: new GenericProperty({
        type: 'float',
        hidden: true
      }),
      pandle_expenses: new GenericProperty({
        type: 'float',
        hidden: true
      }),
      pandle_income_transactions: new GenericProperty({
        hidden: true,
        type: 'array'
      }),
      pandle_expenses_transactions: new GenericProperty({
        hidden: true,
        type: 'array'
      })
    }
    const modelToReturn = populateModelValues(model, values)
    return setDefaultValues(modelToReturn, (model, key) => {
      if (key === 'admin') {
        if (!model[key].value) {
          // Add yourself at the beginning
          if (currentUserEmail !== 'joe@galexia.agency') {
            model[key].value = `joe@galexia.agency,${currentUserEmail}`
          // Add Joe at the beginning
          } else {
            model[key].value = 'joe@galexia.agency'
          }
        } else {
          // Add yourself at the beginning
          if (currentUserEmail !== 'joe@galexia.agency') {
            model[key].value = `${currentUserEmail},${model[key].value}`
          }
          // Add Joe at the beginning
          if (!model[key].value.includes('joe@galexia.agency')) {
            model[key].value = `joe@galexia.agency,${model[key].value}`
          }
        }
      }
    })
  }
}
