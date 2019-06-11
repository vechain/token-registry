const path = require('path')
const file = require('file-system')
const sharp = require('sharp')
const { getTokens, redFont, greenFont, yellowFont } = require('./utils')
const NET_FOLDERS = require('./const').NETS

function checkFolderName(folderName) {
  if (folderName.toLowerCase() !== folderName) {
    throw new Error('folder name should be low case')
  }

  if (!/^0x[a-f0-9]{40}$/.test(folderName)) {
    throw new Error('folder name should be a valid address with low case')
  }
}

function checkInfo(info) {
  if (!checkName(info.name)) {
    throw new Error('name should be string')
  }
  if (!checkSymbol(info.symbol)) {
    throw new Error('symbol should be string')
  }
  if (!checkDecimals(info.decimals)) {
    throw new Error('decimals should be number')
  }
}

function checkName(name) {
  return !(name === null || name === undefined || name.length === 0)
}

function checkSymbol(symbol) {
  return !(symbol === null || symbol === undefined || symbol.length === 0)
}

function checkDecimals(decimals) {
  return !(
    decimals === null ||
    decimals === undefined ||
    typeof decimals !== 'number'
  )
}

function checkAddress(folderName, address) {
  return !(
    folderName !== address.toLowerCase() ||
    !/^0x[a-f0-9]{40}$/.test(address.toLowerCase())
  )
}

async function checkImg(path) {
  const info = await sharp(path).metadata()
  if (info.width !== 512 || info.height !== 512) {
    throw new Error('image should be 512px * 512px')
  }
}

async function validate(net, folder) {
  const tokenFolder = path.join(
    __dirname,
    `./tokens/${NET_FOLDERS[net]}/${folder}`
  )
  const info = require(path.join(tokenFolder, 'info.json'))
  try {
    checkFolderName(folder)
    const files = file.readdirSync(tokenFolder)
    if (files.includes('info.json') && files.includes('token.png')) {
      throw new Error('missing info.json or token.png')
    }
    if (!checkAddress(folder, info.address)) {
      throw new Error('address should be a valid address with low case')
    }
    checkInfo(info)
    await checkImg(path.join(tokenFolder, 'token.png'))
  } catch (error) {
    throw new Error(`token: ${info.name}\npath: ${tokenFolder}\nmessage: "${error.message}"`)
  }
}

module.exports = {
  lint: async function(net) {
    const tokens = getTokens(
      path.join(__dirname, `./tokens/${NET_FOLDERS[net]}`)
    )
    try {
      for (let i = 0; i < tokens.length; i++) {
        const item = tokens[i]
        await validate(net, item)
      }
    } catch (error) {
      console.error(redFont(error.message))
    }

    // tokens.forEach(item => {
    //   validate(net, item)
    // })
  }
}
