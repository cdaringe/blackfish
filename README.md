# blackfish

docker-compose cli extensions <img style='display: inline' width='24px' src="https://github.com/cdaringe/blackfish/blob/master/img/logo.png?raw=true" />


[![Build Status](https://travis-ci.org/cdaringe/blackfish.svg?branch=master)](https://travis-ci.org/cdaringe/blackfish) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## install

`npm install -g blackfish`

## usage

blackfish installs with two executables, `blackfish`, or `bf` for short.

run blackfish to glob up your compose files and run a subset of compose services.

blackfish will create a new compose file based on your selection, and proxy the rest of your command off to `docker-compose`.

<img width="620px" src="https://github.com/cdaringe/blackfish/blob/master/img/blackfish.demo.mov.gif?raw=true" />

```sh
$ bf --help

  docker* cli extensions

  Usage
    $ bf

  Options
    --compose, -c docker-compose
    --interactive, -i  interactive docker-compose
    --files, -f compose files

  Examples
    $ bf -ci -- up
    $ bf -ci -f docker-compose.yml,docker-compose.dev.yml -- up
```

## warning

- alpha software! ;)
