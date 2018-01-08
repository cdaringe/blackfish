#!/usr/bin/env node

var debug = require('debug')('blackfish:bin')
var meow = require('meow')
var bf = require('.')
var path = require('path')
var { BlackfishError, BlackfishCliError } = require('./errors')

var mod = {
  parseFilenames (filenames) {
    return filenames.split(',')
    .map(i => i.trim())
    .map(i => {
      if (!i) throw new Error(`invalid file: ${i}`)
      return path.isAbsolute(i) ? i : path.resolve(process.cwd(), i)
    })
  }
}

async function run () {
  try {
    var cli = meow(`
      Usage
        $ bf

      Options
        --compose, -c docker-compose
        --interactive, -i  interactive docker-compose
        --files, -f compose files

      Examples
        $ bf -ci -- up
        $ bf -ci -f docker-compose.yml,docker-compose.dev.yml -- up
    `, {
      flags: {
        interactive: {
          type: 'boolean',
          alias: 'i'
        },
        files: {
          type: 'string',
          alias: 'f'
        },
        compose: {
          type: 'boolean',
          alias: 'c'
        }
      }
    })
    if (cli.input.length === 0) throw new BlackfishError('no docker[-compose] command provided')
    if (cli.flags.files) cli.flags.files = mod.parseFilenames(cli.flags.files)
    debug('running main')
    await bf.main(cli)
  } catch (err) {
    if (err instanceof BlackfishError) {
      console.error(err.message)
      process.exit(1)
    } else if (err instanceof BlackfishCliError) {
      console.error(err.message)
      console.error(cli.help)
      process.exit(1)
    }
    throw err
  }
}

if (require.main === module) {
  run()
}

module.exports = mod
