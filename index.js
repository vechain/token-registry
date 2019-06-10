const { clean, build } = require('./script')
const { lint } = require('./validates')
const action = process.argv[2]
const net = process.argv[3]

async function buildAll() {
  await clean()
  await build('main')
  await build('test')
}

function lintAll() {
  lint('main')
  lint('test')
}

async function execFun(net) {
  if (action === '-l') {
    if (net === 'all') {
      lintAll()
    } else {
      lint(net)
    }
  } else if (action === '-b') {
    if (net === 'all') {
      await buildAll()
    } else {
      clean()
      await build(net)
    }
  }
}

async function start() {
  switch (net) {
    case 'main':
      await execFun('main')
      break

    case 'test':
      await execFun('test')
      break
    case 'clean':
      await clean()
      break
    default:
      await execFun('all')
      break
  }
}

start()
