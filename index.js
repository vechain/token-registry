const { clean, build } = require('./script')
const action = process.argv[2]
async function buildAll() {
  await clean()
  await build('main')
  await build('test')
}

async function start() {
  switch (action) {
    case 'main':
      await build('main')
      break

    case 'test':
      await build('test')
      break
    case 'clean':
      await clean()
      break
    default:
      await buildAll()
      break
  }
}

start()
