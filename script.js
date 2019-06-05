const file = require('file-system')
const fs = require('fs')
const path = require('path')
const hashName = require('hash-file')


redFont = (str) => {
  return `\x1b[31m${str}\x1b[0m`
}

greenFont = (str) => {
  return `\x1b[32m${str}\x1b[0m`
}

yellowFont = (str) => {
  return `\x1b[33m${str}\x1b[0m`
}

const NET_FOLDERS = {
  main: 'main.net',
  test: 'test.net'
}

const DIST = path.join(__dirname, './dist')
const ASSETS = path.join(DIST, 'assets')

const clear = () => {
  console.time(greenFont('clean'))

  let hasDist = true
  try {
    fs.statSync(DIST)
  } catch (error) {
    hasDist = false
  }
  if (hasDist) {
    file.rmdirSync(DIST)
  }

  console.timeEnd(greenFont('clean'))
}

function packToken(net) {
  console.time(greenFont(`build-${net}-tokens`))

  const folder = path.join(__dirname, `./tokens/${NET_FOLDERS[net]}`)
  const infos = getTokensInfo(folder)
  let result = []
  const listJson = infos.map(item => {
    return {
      ...item,
      imgName: rename(item.img) + '.png'
    }
  })

  file.mkdirSync(ASSETS)

  listJson.forEach(item => {
    file.copyFileSync(item.img, path.join(ASSETS, `${item.imgName}`))
    result.push({
      name: item.name,
      symbol: item.symbol,
      decimals: item.decimals,
      address: item.address,
      icon: item.imgName
    })
  })

  console.table(result, ['name', 'symbol', 'decimals', 'address'])
  
  file.writeFileSync(
    path.join(__dirname, `./dist/${net}.json`),
    JSON.stringify(result, null, 2)
  )
  console.timeEnd(greenFont(`build-${net}-tokens`))

}

function rename(img) {
  return hashName.sync(img)
}

function getTokensInfo(folder) {
  const tokens = getTokens(folder)
  const result = []
  tokens
    .filter(item => {
      return !item.startsWith('.')
    })
    .forEach(item => {
      result.push(tokenInfo(path.join(folder, item)))
    })

  return result
}

function getTokens(folder) {
  return file.readdirSync(folder)
}

function tokenInfo(tokenPath) {
  const file = path.join(tokenPath, 'info.json')
  const img = path.join(tokenPath, 'token.png')
  const info = require(file)
  info.img = img
  return info
}

module.exports = {
  clean: clear,
  build: packToken
}
