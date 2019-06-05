const { clean, build } = require('./script')
const action = process.argv[2]

switch (action) {
  case 'main':
    build('main')
    break

  case 'test':
    build('test')
    break
  case 'clean':
    clean()
    break
  default:
    clean()
    build('main')
    build('test')
    break
}
