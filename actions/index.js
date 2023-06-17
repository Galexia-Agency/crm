import auth from './auth'
import conflicts from './conflicts'
import confirm from './confirm'
import projects from './projects'
import contacts from './contacts'
import clients from './clients'
import updateClientPandleDataHelper from './updateClientPandleDataHelper'
import pandle from './pandle'
import products from './products'

export default {
  ...auth,
  ...conflicts,
  ...confirm,
  ...projects,
  ...contacts,
  ...clients,
  ...updateClientPandleDataHelper,
  ...pandle,
  ...products
}
