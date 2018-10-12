var fs = require('fs-extra')
var yaml = require('js-yaml')
var path = require('path')
var merge = require('lodash/merge')
var logger = require('./logger')
var { BlackfishError } = require('./errors')
module.exports = {
  /**
   *
   * @param {string[]} [filenames]
   */
  async get (cwd) {
    cwd = cwd || process.cwd()
    var files = await fs.readdir(cwd)
    files = files.filter(i => i.match(/docker-compose.*(\.yml|\.yaml)$/))
    if (!files.length) {
      throw new Error([
        'no docker-compose files found. try adding a',
        'docker-compose.yml [docker-compose.*(.yml|.yaml) are accepted]'
      ])
    }
    var blackfishYamls = files.filter(file => file.match(/.blackfish.yml/i))
    if (blackfishYamls.length > 1) throw new BlackfishError('too many blackfish yamls')
    else if (blackfishYamls.length === 1) {
      logger.info('*.blackfish.yml detected--booting existing service set')
      files = blackfishYamls
    }
    return files.map(f => path.resolve(cwd, f))
  },
  async merge (files) {
    if (!files || !files.length) throw new BlackfishError('no compose files provided')
    var rawContents = await Promise.all(files.map(f => fs.readFile(f)))
    var yamls = rawContents.map(yaml.safeLoad)
    return merge(...yamls)
  },
  async writeBlackfishCompose (superCompose) {
    var bfFilename = path.join(process.cwd(), '.docker-compose.blackfish.yml')
    await fs.writeFile(bfFilename, yaml.safeDump(superCompose))
    return bfFilename
  }
}
