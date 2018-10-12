// bf/blackfish <files>
// console.log(wip!)

var debug = require('debug')('blackfish:index')
var composeFiles = require('./compose-files')
var Prompt = require('prompt-checkbox')
var pick = require('lodash/pick')
var execa = require('execa')
var os = require('os')
var { BlackfishError, BlackfishCliError, BlackfishShutdown } = require('./errors')

module.exports = {
  async compose (opts) {
    debug('preparing to boot compose')
    var { files, interactive } = opts.flags
    if (!files) files = await composeFiles.get()
    debug(`compose files: ${files.join(', ')}`)
    var superCompose = await composeFiles.merge(files)
    if (interactive) {
      var prompt = new Prompt({
        name: 'images',
        message: 'run the following docker-compose services:',
        radio: true,
        choices: Object.keys(superCompose.services).sort(),
        default: Object.keys(superCompose.services).sort()
      })
      var services = await prompt.run()
      await prompt.ui.close()
      prompt.end(false)
      superCompose.services = pick(superCompose.services, services)
    }
    if (!Object.keys(superCompose.services).length) throw new BlackfishError('no docker compose services found')
    var file = await composeFiles.writeBlackfishCompose(superCompose)
    // var child = execa('docker-compose', ['-f', file, ...opts.input], { stdio: 'inherit' })
    var child = execa.shell(['docker-compose', ...['-f', file, ...opts.input]].join(' '), { stdio: 'inherit' })
    var handleSignal = async signal => {
      debug(`received signal: ${signal}`)
      try {
        var isWin = !!os.platform().match(/^win/)
        debug(`isWin?: ${isWin}`)
        isWin
          ? child.kill(signal)
          : await execa.shell(`kill -s ${signal.replace('SIG', '')} ${child.pid}`, {stdio: 'inherit'})
      } catch (err) {
        console.error(err)
      }
      try {
        await child
      } finally {
        throw new BlackfishShutdown() // eslint-disable-line
      }
    }
    process.addListener('SIGINT', handleSignal)
    try {
      await child
      process.removeListener('SIGINT', handleSignal)
    } catch (err) {
      // stderr should have been filled by the child
      throw new BlackfishShutdown() // eslint-disable-line
    }
  },
  main (opts) {
    if (opts.flags.compose) return this.compose(opts)
    throw new BlackfishCliError('only docker-compose is supported at the moment. please use -c')
  }
}
