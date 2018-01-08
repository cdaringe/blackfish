var ava = require('ava').default
var composeFiles = require('../src/compose-files')
var project = require('./fixture/project')
var path = require('path')

ava.beforeEach('before', async t => {
  var tmpDir = await project.create()
  t.context.tmpDir = tmpDir
})
ava.afterEach('after', async t => {
  await project.destroy(t.context.tmpDir)
})

ava('getFilenames', async t => {
  var filenames = await composeFiles.get(t.context.tmpDir)
  var expected = ['docker-compose.test.yml', 'docker-compose.yml'].map(f => path.join(t.context.tmpDir, f))
  t.deepEqual(filenames, expected)
})

ava('merge', async t => {
  var filenames = await composeFiles.get(t.context.tmpDir)
  var superCompose = await composeFiles.merge(filenames)
  t.truthy(superCompose.services.nginx)
  t.truthy(superCompose.services.httpster)
})
