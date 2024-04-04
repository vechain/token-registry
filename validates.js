const path = require('path')
const axios = require('axios')
const file = require('file-system')
const sharp = require('sharp')
const { getTokens } = require('./utils')
const { NETS: NET_FOLDERS, NODES } = require('./const')

function checkFolderName(folderName) {
  if (!/^0x[a-f0-9]{40}$/.test(folderName)) {
    throw new Error('folder name should be a valid address with lower case')
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
    throw new Error('decimals should be integer')
  }
  if (!checkDesc(info.desc)) {
    throw new Error('desc should be string')
  }
}

async function checkAddressHasCode(net, address) {

  const resp = await axios.get(`${NODES[net]}/accounts/${address}`)
  if (!resp.data.hasCode) {
    throw new Error('invalid contract address')
  }
}

function checkName(name) {
  return !(name === null || name === undefined || name.length === 0)
}

function checkSymbol(symbol) {
  return !(symbol === null || symbol === undefined || symbol.length === 0)
}

function checkDesc(desc) {
  return !(desc === null || desc === undefined || desc.length === 0)
}

function checkDecimals(decimals) {
  return !(
    decimals === null ||
    decimals === undefined ||
    typeof decimals !== 'number'
  )
}

async function checkImg(path) {
  const info = await sharp(path).metadata()
  if (info.width !== 256 || info.height !== 256) {
    throw new Error('image should be 256px * 256px')
  }
}

async function validate(net, address) {
  const tokenFolder = path.join(
    __dirname,
    `./tokens/${NET_FOLDERS[net]}/${address}`
  )
  const info = require(path.join(tokenFolder, 'info.json'))
  try {
    checkFolderName(address)
    const files = file.readdirSync(tokenFolder)
    if (!files.includes('info.json') || !files.includes('token.png')) {
      throw new Error('missing info.json or token.png')
    }
    await checkAddressHasCode(net, address)
    checkInfo(info)

    await checkImg(path.join(tokenFolder, 'token.png'))
  } catch (error) {
    throw new Error(
      `token: ${info.name}\npath: ${tokenFolder}\nmessage: "${error.message}"`
    )
  }
}

module.exports = {
  lint: async function (net) {
    const tokens = getTokens(
      path.join(__dirname, `./tokens/${NET_FOLDERS[net]}`)
    )
    for (let i = 0; i < tokens.length; i++) {
      const item = tokens[i]
      await validate(net, item)
    }
  }
}
