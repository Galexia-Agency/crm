import conflicts from './conflicts'
import projects from './projects'
import contacts from './contacts'
import clients from './clients'
import updateClientPandleDataHelper from './updateClientPandleDataHelper'
import pandle from './pandle'
import products from './products'

export default {
  ...conflicts,
  ...projects,
  ...contacts,
  ...clients,
  ...updateClientPandleDataHelper,
  ...pandle,
  ...products
}
