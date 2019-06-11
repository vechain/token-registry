const file = require('file-system')
module.exports = {

  getTokens: function(folder) {
    const tokens = file.readdirSync(folder)
    const temp = tokens.filter(item => {
      return !item.startsWith('.')
    })
    return temp
  },

  redFont: str => {
    return `\x1b[31m${str}\x1b[0m`
  },

  greenFont: str => {
    return `\x1b[32m${str}\x1b[0m`
  },

  yellowFont: str => {
    return `\x1b[33m${str}\x1b[0m`
  }
}
