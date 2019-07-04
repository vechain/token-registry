const file = require('file-system')
const fs = require('fs')
const path = require('path')
const hashName = require('hash-file')
const { exec } = require('child_process')
const { getTokens, redFont, greenFont, yellowFont } = require('./utils')

const NET_FOLDERS = require('./const').NETS

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

async function packToken(net) {
  console.time(greenFont(`build-${net}-tokens`))

  const folder = path.join(__dirname, `./tokens/${NET_FOLDERS[net]}`)
  const infos = await getTokensInfo(folder)
  let result = []
  const listJson = infos
    .sort((a, b) => {
      if (a.createTime < b.createTime) {
        return -1
      } else {
        return 1
      }
    })
    .map(item => {
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
      desc: item.desc,
      icon: item.imgName
    })
  })

  console.table(listJson, [
    'name',
    'symbol',
    'decimals',
    'address',
    'createTime'
  ])

  file.writeFileSync(
    path.join(__dirname, `./dist/${net}.json`),
    JSON.stringify(result, null, 2)
  )
  console.timeEnd(greenFont(`build-${net}-tokens`))
}

function rename(img) {
  return hashName.sync(img)
}

async function getTokensInfo(folder) {
  const tokens = getTokens(folder)
  const result = []
  for (let i = 0; i < tokens.length; i++) {
    const item = tokens[i]
    result.push(await tokenInfo(path.join(folder, item), item.toLowerCase()))
  }

  return result
}

async function tokenInfo(tokenPath, address) {
  const file = path.join(tokenPath, 'info.json')
  const img = path.join(tokenPath, 'token.png')
  const info = require(file)
  info.img = img
  info.createTime = await getCreateTimeFromGit(tokenPath)
  info.address = address
  return info
}

async function getCreateTimeFromGit(dirPath) {
  const command =
    'git log --diff-filter=A --follow --format=%aD -1 -- [path] | head -1'
  return new Promise((resolve, reject) => {
    exec(command.replace('[path]', dirPath), (err, stdout, stderr) => {
      if (err) return reject(err)
      if (stderr) return reject(stderr)
      if (!stdout)
        return reject(
          new Error('Can not find create time from git for dir: ' + dirPath)
        )
      return resolve(new Date(stdout))
    })
  })
}

module.exports = {
  clean: clear,
  build: packToken
}
