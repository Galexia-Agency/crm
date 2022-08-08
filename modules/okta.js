const path = require('path')

export default function () {
  this.addPlugin({
    src: path.resolve(__dirname, '../plugins/okta.js')
  })
}
