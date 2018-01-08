var ava = require('ava').default
var bin = require('../src/bin')
var path = require('path')

ava('parseFiles', async t => {
  t.throws(() => t.is(bin.parseFilenames(''), ['']))
  t.deepEqual(bin.parseFilenames('a'), [path.join(process.cwd(), 'a')])
  t.deepEqual(bin.parseFilenames('/a,b'), ['/a', path.join(process.cwd(), 'b')])
})
