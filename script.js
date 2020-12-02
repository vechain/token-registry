const axios = require('axios')
const file = require('file-system')
const fs = require('fs')
const path = require('path')
const hashName = require('hash-file')
const { exec } = require('child_process')
const BN = require('bignumber.js')
const { abi } = require('thor-devkit')
const { getTokens, redFont, greenFont, yellowFont } = require('./utils')

const { NETS: NET_FOLDERS, NODES } = require('./const')

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

  for (const item of listJson) {
    file.copyFileSync(item.img, path.join(ASSETS, `${item.imgName}`))
    result.push({
      name: item.name,
      symbol: item.symbol,
      decimals: item.decimals,
      address: item.address,
      desc: item.desc,
      icon: item.imgName,
      totalSupply: item.symbol === 'VTHO' ? 'Infinite' : await getTotalSupply(NODES[net], item.address),
      ...item.extra
    })
  }

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
  const files = file.readdirSync(tokenPath)
  const infoFile = path.join(tokenPath, 'info.json')
  const img = path.join(tokenPath, 'token.png')
  const info = require(infoFile)
  let extraInfo = null
  if (files.includes('additional.json')) {
    extraInfo = getExtraInfo(path.join(tokenPath, 'additional.json'))
  }
  info.img = img
  info.createTime = await getCreateTimeFromGit(tokenPath)
  info.address = address
  info.extra = extraInfo

  return info
}

function getExtraInfo(filePath) {
  const urlRegExp = /(https):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/
  const keys = ['website', 'whitePaper']
  const LinkSymbol = 'links'
  const linkNames = ['twitter', 'telegram', 'facebook', 'medium', 'github', 'slack']

  const extraInfo = require(filePath)
  const links = extraInfo[LinkSymbol]
  const linkKeys = links ? Object.keys(links) : null
  let result = {}
  let linksTemp = []

  keys.forEach(item => {
    if (!extraInfo[item]) {
      return
    }
    if (!urlRegExp.test(extraInfo[item])) {
      console.warn(yellowFont(`The ${item} link invalid`))
      return
    }
    result[item] = extraInfo[item]
  })
  if (linkKeys && linkKeys.length) {
    linkKeys.forEach(item => {
      if (linkNames.includes(item) && links[item]) {
        if (urlRegExp.test(links[item])) {
          linksTemp.push({
            [item]: links[item]
          })
        } else {
          console.warn(yellowFont(`The ${item} link invalid`))
        }
      }
    })
  }

  if (linksTemp.length) {
    result[LinkSymbol] = linksTemp
  }

  return result
}


async function getCreateTimeFromGit(dirPath) {
  const command =
    'git log --diff-filter=A --follow --format=%aD -- [path] | tail -1'
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
const TSabi = {
  "constant": true,
  "inputs": [],
  "name": "totalSupply",
  "outputs": [
    {
      "name": "",
      "type": "uint256"
    }
  ],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}
async function getTotalSupply(url, address) {
  const resp = await axios.post(`${url}/accounts/*`, {
    clauses: [
      {
        to: address,
        value: '0',
        data: '0x18160ddd'
      }
    ]
  })
  let tsf = new abi.Function(TSabi)
  const decoded = tsf.decode(resp.data[0]['data'])

  return decoded[0]
}

module.exports = {
  clean: clear,
  build: packToken
}
