// bf/blackfish <files>
// console.log(wip!)

var composeFiles = require('./compose-files')
var Prompt = require('prompt-checkbox')
var pick = require('lodash/pick')
var execa = require('execa')

module.exports = {
  async compose (opts) {
    var { files } = opts.flags
    if (!files) files = composeFiles.get()
    var superCompose = await composeFiles.merge(files)
    var prompt = new Prompt({
      name: 'images',
      message: 'run the following docker-compose services:',
      radio: true,
      choices: Object.keys(superCompose.services).sort(),
      default: Object.keys(superCompose.services).sort()
    })
    var services = await prompt.run()
    prompt.end(false)
    superCompose.services = pick(superCompose.services, services)
    var file = await composeFiles.writeBlackfishCompose(superCompose)
    await execa('docker-compose', ['-f', file, ...opts.input], { stdio: 'inherit' })
  },
  main (opts) {
    if (opts.flags.compose) return this.compose(opts)
  }
}
