var os = require('os')
var fs = require('fs-extra')
var path = require('path')

module.exports = {
  async create () {
    var tmpDir = path.join(os.tmpdir(), `bf-test-${Math.random().toString().substr(3, 5)}`)
    await fs.mkdirp(tmpDir)
    await fs.copyFile(
      path.join(__dirname, 'docker-compose.yml'),
      path.join(tmpDir, 'docker-compose.yml')
    )
    await fs.copyFile(
      path.join(__dirname, 'docker-compose.test.yml'),
      path.join(tmpDir, 'docker-compose.test.yml')
    )
    return tmpDir
  },
  async destroy (dir) {
    await fs.remove(dir)
  }
}
