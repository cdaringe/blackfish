var fs = require('fs-extra')
var yaml = require('js-yaml')
var path = require('path')
var merge = require('lodash/merge')
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
